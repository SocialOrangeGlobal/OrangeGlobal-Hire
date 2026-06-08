import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Play, Clock, Calendar,
  User, ChevronLeft, ChevronRight,
  TrendingUp, Video
} from 'lucide-react';
import Button from '../components/ui/Button';
import SectionLabel from '../components/ui/SectionLabel';
import { fadeUp } from '../utils/animations';
import BlobDetailsModal from '../components/modals/BlogDetailsModal';
import { videoInsights, blogsInsights } from '../data';
import { BlogInsight } from '../types';
import toast from 'react-hot-toast';
import { contactApi } from '../lib/contact';

export default function InsightsPage() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogInsight | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const videoRef = useRef<HTMLVideoElement>(null);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubmittingNewsletter(true);
    try {
      await contactApi.submitMessage({
        fullName: 'Newsletter Subscriber',
        email: newsletterEmail.trim(),
        subject: 'Newsletter Subscription',
        message: `New newsletter subscription from: ${newsletterEmail.trim()}`,
        type: 'NEWSLETTER',
      });
      toast.success('Successfully subscribed to the newsletter!');
      setNewsletterEmail('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setSubmittingNewsletter(false);
    }
  };

  // Auto-slide carousel
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isVideoPlaying) {
      interval = setInterval(() => {
        nextVideo();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying, activeVideoIndex]);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const nextVideo = () => {
    setActiveVideoIndex((prev) => (prev + 1) % videoInsights.length);
    setIsVideoPlaying(false);
  };

  const prevVideo = () => {
    setActiveVideoIndex((prev) => (prev - 1 + videoInsights.length) % videoInsights.length);
    setIsVideoPlaying(false);
  };

  const filteredBlogs = activeCategory === 'All'
    ? blogsInsights
    : blogsInsights.filter(b => b.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero & Video Carousel */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Main Title - Full Width */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-rh-teal leading-[1.1] tracking-tight text-center lg:text-left">
              Knowledge that <br />
              <span className="text-rh-red font-[300]">shapes industries</span>
            </h1>
          </motion.div>

          {/* Content Grid - Video & Timeline Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

            {/* Video Carousel Column - 8/12 on Desktop */}
            <div className="lg:col-span-8 w-full">
              <div className="relative group overflow-hidden rounded-[32px] md:rounded-[48px] shadow-2xl bg-black aspect-video w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={videoInsights[activeVideoIndex].id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                  >
                    {isVideoPlaying ? (
                      <video
                        ref={videoRef}
                        src={videoInsights[activeVideoIndex].videoUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        controls
                        onEnded={() => setIsVideoPlaying(false)}
                      />
                    ) : (
                      <>
                        <img
                          src={videoInsights[activeVideoIndex].thumbnail}
                          alt={videoInsights[activeVideoIndex].title}
                          className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-rh-teal/95 via-transparent to-transparent" />
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                {!isVideoPlaying && (
                  <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 md:p-10 lg:p-12">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-rh-red text-white text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full">
                        Featured Insight
                      </span>
                      <span className="text-white/60 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 sm:gap-2">
                        <Video className="w-2.5 h-2.5 sm:w-3 h-3" /> {videoInsights[activeVideoIndex].category}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 leading-tight max-w-2xl line-clamp-2 sm:line-clamp-none">
                      {videoInsights[activeVideoIndex].title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <button
                          onClick={toggleVideo}
                          className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center text-rh-red shadow-xl hover:scale-110 transition-transform shrink-0"
                        >
                          <Play className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 fill-current ml-1" />
                        </button>
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-[10px] sm:text-xs md:text-sm tracking-wide block">
                            Duration: {videoInsights[activeVideoIndex].duration}
                          </span>
                          <span className="text-white/40 text-[7px] sm:text-[9px] md:text-[10px] uppercase font-bold tracking-widest">
                            Click to Play Now
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button onClick={prevVideo} className="p-1.5 sm:p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all">
                          <ChevronLeft className="w-4 h-4 sm:w-5 h-5" />
                        </button>
                        <button onClick={nextVideo} className="p-1.5 sm:p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all">
                          <ChevronRight className="w-4 h-4 sm:w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Trending Sidebar Column - 4/12 on Desktop */}
            <div className="lg:col-span-4 w-full">
              <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-rh-teal flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-rh-red" /> Trending Insights
                </h3>
              </div>
              <div className="space-y-10">
                {videoInsights.map((v, i) => (
                  <div
                    key={v.id}
                    className={`group cursor-pointer transition-all duration-500 ${activeVideoIndex === i ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-100'}`}
                    onClick={() => {
                      setActiveVideoIndex(i);
                      setIsVideoPlaying(false);
                    }}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${activeVideoIndex === i ? 'text-rh-red' : 'text-gray-400'}`}>
                        {activeVideoIndex === i ? 'Watching Now' : `Insight 0${i + 1}`}
                      </span>
                      <div className={`h-[1px] flex-1 transition-all ${activeVideoIndex === i ? 'bg-rh-red' : 'bg-gray-100'}`} />
                    </div>
                    <h4 className={`text-base font-bold transition-colors leading-tight mb-2 ${activeVideoIndex === i ? 'text-rh-red' : 'text-rh-teal'}`}>
                      {v.trendingTitle}
                    </h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{v.trendingTag}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog/Resources Grid */}
      <section className="py-16 md:py-24 bg-rh-light/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-rh-teal mb-2">Latest Insights</h2>
              <p className="text-gray-500 text-sm font-medium">Strategic perspectives on the future of work</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', 'Technology', 'Finance', 'Leadership'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all border ${activeCategory === cat ? 'bg-rh-teal text-white border-rh-teal shadow-lg shadow-rh-teal/20' : 'bg-white text-gray-500 border-gray-100 hover:border-rh-red hover:text-rh-red'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredBlogs.map((blog, i) => (
              <motion.div
                key={blog.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                variants={fadeUp}
                onClick={() => setSelectedBlog(blog)}
                className="group flex flex-col h-full bg-white rounded-[32px] p-5 md:p-6 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer"
              >
                <div className="relative aspect-[16/10] rounded-[24px] overflow-hidden mb-8">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-white/95 backdrop-blur-md rounded-xl text-rh-teal text-[9px] font-bold uppercase tracking-widest shadow-lg">
                      {blog.category}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {blog.date}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.readTime}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-rh-teal group-hover:text-rh-red transition-colors mb-4 leading-tight line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 font-light line-clamp-3">{blog.desc}</p>
                </div>
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rh-light flex items-center justify-center text-rh-teal">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-rh-teal">{blog.author}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-rh-light group-hover:bg-rh-red flex items-center justify-center transition-all">
                    <ArrowRight className="w-5 h-5 text-rh-teal group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Details Modal - Single Column Layout with Transparent Backdrop */}
      <AnimatePresence>
        {selectedBlog && (
          <BlobDetailsModal selectedBlog={selectedBlog} setSelectedBlog={setSelectedBlog} />
        )}
      </AnimatePresence>

      {/* Newsletter */}
      <section className="py-16 md:py-24 bg-[#081B2D] relative overflow-hidden md:rounded-[48px] mx-0 md:mx-8 mb-20 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-rh-red rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-rh-teal rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <SectionLabel className="text-white/40 mb-8 mx-auto" children="Newsletter" />
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-white mb-8 tracking-tight leading-tight">Stay ahead of the <br /> <span className="text-rh-red font-[300]">market curve</span></h2>
          <p className="text-white/60 text-base md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">Get exclusive salary data, hiring trends, and leadership insights delivered monthly.</p>
          <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto w-full">
            <input
              type="email"
              placeholder="Work email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="w-full sm:flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:bg-white/10 focus:border-white/30 transition-all text-base"
              required
            />
            <Button
              type="submit"
              disabled={submittingNewsletter}
              variant="primary"
              className="w-full sm:w-auto px-12 py-5 rounded-2xl shadow-xl shadow-rh-red/20 font-bold whitespace-nowrap"
            >
              {submittingNewsletter ? 'Subscribing...' : 'Subscribe Now'}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
