import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Play, Clock, Calendar,
  User, ChevronLeft, ChevronRight, X,
  Share2, Bookmark, CheckCircle2, MessageCircle,
  TrendingUp, Video
} from 'lucide-react';
import Button from '../components/ui/Button';
import SectionLabel from '../components/ui/SectionLabel';
import { fadeUp } from '../utils/animations';

interface VideoInsight {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  category: string;
  trendingTitle: string;
  trendingTag: string;
}

interface BlogInsight {
  id: string;
  category: string;
  title: string;
  desc: string;
  content: string[];
  image: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

const videos: VideoInsight[] = [
  {
    id: '1',
    title: 'Navigating Regulatory Changes in Global Finance',
    thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '45:00',
    category: 'Finance',
    trendingTitle: 'How AI is redefining the role of the CFO',
    trendingTag: 'Market Analysis • 5 Min Read'
  },
  {
    id: '2',
    title: 'The Future of AI in Talent Acquisition',
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    duration: '32:15',
    category: 'Technology',
    trendingTitle: 'Recruitment marketing: A guide for 2026',
    trendingTag: 'Digital Strategy • 8 Min Read'
  },
  {
    id: '3',
    title: 'Leadership Strategies for Distributed Teams',
    thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '28:40',
    category: 'Leadership',
    trendingTitle: 'Remote work culture: Long-term success factors',
    trendingTag: 'Culture Guide • 12 Min Read'
  }
];

const blogs: BlogInsight[] = [
  // Technology Category
  {
    id: 'tech-1',
    category: 'Technology',
    title: 'Retaining Elite Engineering Talent in 2026',
    desc: 'New strategies for reducing turnover in the world\'s most competitive labor market.',
    content: [
      'The landscape of engineering recruitment has shifted dramatically. It\'s no longer just about the stack or the salary—it\'s about the impact and the environment.',
      'In our 2026 survey, we found that 68% of senior engineers prioritize autonomy and "maker time" over standard benefits packages.',
      'To stay ahead, organizations must implement deep-work blocks, fractional leadership models, and clear career pathing that doesn\'t always lead to management.'
    ],
    image: 'https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'Sarah Whitmore',
    date: 'May 12, 2026',
    readTime: '6 min read',
    tags: ['Engineering', 'Retention', 'HR Tech']
  },
  {
    id: 'tech-2',
    category: 'Technology',
    title: 'The Impact of Generative AI on Developer Velocity',
    desc: 'Analyzing how AI-pair programming is changing output expectations and team structures.',
    content: [
      'Generative AI has moved from a novelty to a necessity in high-performing engineering teams.',
      'We track how teams are leveraging Copilots to reduce boilerplate and focus on architectural complexity.',
      'The new bottleneck isn\'t writing code—it\'s reviewing and validating it. This shift requires a new type of senior oversight.'
    ],
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'David Chen',
    date: 'May 15, 2026',
    readTime: '7 min read',
    tags: ['AI', 'Development', 'Productivity']
  },
  {
    id: 'tech-3',
    category: 'Technology',
    title: 'Scaling Infrastructure for Global SaaS',
    desc: 'Lessons from the field on managing multi-region deployments at scale.',
    content: [
      'Scaling infrastructure globally requires a deep understanding of data sovereignty and latency.',
      'We explore the evolution of edge computing and its role in delivering consistent experiences across continents.',
      'Automation at the terraform level is no longer optional—it\'s the backbone of global operations.'
    ],
    image: 'https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'Alex Rivera',
    date: 'May 18, 2026',
    readTime: '9 min read',
    tags: ['Infrastructure', 'SaaS', 'Cloud']
  },

  // Finance Category
  {
    id: 'fin-1',
    category: 'Finance',
    title: '2026 Global Salary Guide: High-Growth Sectors',
    desc: 'Comprehensive analysis of compensation trends across tech, finance, and legal markets.',
    content: [
      'Financial services are seeing a resurgence in demand for specialized quant and risk profiles.',
      'We analyze how high-interest rate environments have shifted the bonus structures for mid-market investment banks.',
      'A detailed breakdown of compensation packages in London, New York, and Singapore hubs shows a 12% YOY increase for specialized roles.'
    ],
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'Michael Dalton',
    date: 'May 10, 2026',
    readTime: '8 min read',
    tags: ['Finance', 'Salary Guide', 'Economy']
  },
  {
    id: 'fin-2',
    category: 'Finance',
    title: 'Crypto Regulation and the Future of FinTech',
    desc: 'How institutional frameworks are bringing stability to the digital asset market.',
    content: [
      'Regulation is finally catching up with innovation, providing the guardrails needed for institutional adoption.',
      'We examine the impact of central bank digital currencies on traditional payment rails.',
      'FinTechs that prioritize compliance are winning the trust of major institutional partners.'
    ],
    image: 'https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'Elena Rossi',
    date: 'May 20, 2026',
    readTime: '10 min read',
    tags: ['FinTech', 'Crypto', 'Regulation']
  },
  {
    id: 'fin-3',
    category: 'Finance',
    title: 'Sustainable Investing: Beyond the Buzzwords',
    desc: 'The data-driven approach to ESG that is driving returns for institutional investors.',
    content: [
      'ESG is evolving from a marketing label to a core component of risk management.',
      'We look at the metrics that actually matter for long-term sustainability and performance.',
      'Institutional investors are demanding higher transparency and standardized reporting on carbon footprints.'
    ],
    image: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'James Wilson',
    date: 'May 22, 2026',
    readTime: '7 min read',
    tags: ['ESG', 'Investing', 'Sustainability']
  },

  // Leadership Category
  {
    id: 'lead-1',
    category: 'Leadership',
    title: 'The Rise of Fractional Leadership in APAC',
    desc: 'Why organizations are turning to part-time executive talent to drive strategic initiatives.',
    content: [
      'Fractional leadership is becoming the standard for startups scaling in the APAC region.',
      'Experienced C-suite talent is now offering their expertise to multiple organizations simultaneously, providing high-level strategy without the full-time overhead.',
      'This model allows for faster decision-making and access to veteran wisdom for growing teams.'
    ],
    image: 'https://images.pexels.com/photos/3184301/pexels-photo-3184301.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'Chen Wei',
    date: 'May 08, 2026',
    readTime: '5 min read',
    tags: ['Leadership', 'Strategy', 'APAC']
  },
  {
    id: 'lead-2',
    category: 'Leadership',
    title: 'Leading Through Uncertainty: A CEO Playbook',
    desc: 'Strategic frameworks for maintaining morale and momentum in shifting markets.',
    content: [
      'Uncertainty is the only constant. Great leaders build resilient systems that thrive on change.',
      'Communication is the primary tool for a CEO. Transparency build trust, while clarity builds action.',
      'We outline the "Agile Leadership" framework used by Fortune 500 CEOs to navigate global shifts.'
    ],
    image: 'https://images.pexels.com/photos/3182811/pexels-photo-3182811.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'Robert Vance',
    date: 'May 25, 2026',
    readTime: '12 min read',
    tags: ['CEO', 'Leadership', 'Management']
  },
  {
    id: 'lead-3',
    category: 'Leadership',
    title: 'Building a High-Trust Culture Remotely',
    desc: 'New methodologies for creating connection and accountability across borders.',
    content: [
      'Trust is the currency of remote work. Without it, the entire system collapses into micro-management.',
      'We share the specific rituals used by remote-first companies to maintain cultural cohesion.',
      'Accountability should be measured by outcomes, not hours logged on a dashboard.'
    ],
    image: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'Laura Mendez',
    date: 'May 28, 2026',
    readTime: '8 min read',
    tags: ['Culture', 'Remote', 'Trust']
  }
];

export default function InsightsPage() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogInsight | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const videoRef = useRef<HTMLVideoElement>(null);

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
    setActiveVideoIndex((prev) => (prev + 1) % videos.length);
    setIsVideoPlaying(false);
  };

  const prevVideo = () => {
    setActiveVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setIsVideoPlaying(false);
  };

  const filteredBlogs = activeCategory === 'All'
    ? blogs
    : blogs.filter(b => b.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero & Video Carousel */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Main Title - Full Width */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-12 md:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-rh-teal leading-[1.1] tracking-tight text-center lg:text-left">
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
                    key={videos[activeVideoIndex].id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                  >
                    {isVideoPlaying ? (
                      <video
                        ref={videoRef}
                        src={videos[activeVideoIndex].videoUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        controls
                        onEnded={() => setIsVideoPlaying(false)}
                      />
                    ) : (
                      <>
                        <img
                          src={videos[activeVideoIndex].thumbnail}
                          alt={videos[activeVideoIndex].title}
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
                        <Video className="w-2.5 h-2.5 sm:w-3 h-3" /> {videos[activeVideoIndex].category}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 leading-tight max-w-2xl line-clamp-2 sm:line-clamp-none">
                      {videos[activeVideoIndex].title}
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
                            Duration: {videos[activeVideoIndex].duration}
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
                {videos.map((v, i) => (
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
      <section className="py-20 md:py-32 bg-rh-light/30">
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBlog(null)}
              className="absolute inset-0 bg-white/10 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] bg-white rounded-none sm:rounded-[32px] md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Body - Single Scrollable Column */}
              <div className="overflow-y-auto custom-scrollbar flex-1">
                <style>{`
                  .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                  .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 20px; }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
                `}</style>

                {/* Hero Section */}
                <div className="relative h-64 sm:h-80 md:h-[450px]">
                  <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
                  <button
                    onClick={() => setSelectedBlog(null)}
                    className="absolute top-6 right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-rh-red hover:text-white transition-all group z-20"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
                    <span className="px-4 py-2 bg-rh-red text-white text-[10px] font-bold uppercase tracking-widest rounded-lg mb-6 inline-block">
                      {selectedBlog.category}
                    </span>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-rh-teal leading-tight max-w-4xl">
                      {selectedBlog.title}
                    </h2>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-8 sm:p-12 md:p-16 max-w-4xl mx-auto">
                  <div className="flex flex-wrap items-center gap-6 sm:gap-12 py-8 border-y border-gray-50 mb-12">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rh-light flex items-center justify-center text-rh-teal">
                        <User className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Author</p>
                        <p className="text-sm sm:text-base font-bold text-rh-teal">{selectedBlog.author}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rh-light flex items-center justify-center text-rh-teal">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Published</p>
                        <p className="text-sm sm:text-base font-bold text-rh-teal">{selectedBlog.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rh-light flex items-center justify-center text-rh-teal">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reading Time</p>
                        <p className="text-sm sm:text-base font-bold text-rh-teal">{selectedBlog.readTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="prose prose-lg max-w-none">
                    {selectedBlog.content.map((para, i) => (
                      <p key={i} className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed mb-8 font-light">
                        {para}
                      </p>
                    ))}
                  </div>

                  <div className="bg-rh-light/50 rounded-[32px] p-8 sm:p-12 mt-16 border border-gray-100">
                    <div className="flex items-center gap-4 mb-8">
                      <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-rh-red" />
                      <h4 className="text-xl sm:text-2xl font-bold text-rh-teal tracking-tight">Executive Takeaways</h4>
                    </div>
                    <ul className="space-y-6">
                      {[
                        'Master the core drivers of talent retention in 2026.',
                        'Implement data-driven leadership frameworks.',
                        'Leverage global market trends for competitive advantage.'
                      ].map((item, idx) => (
                        <li key={idx} className="flex gap-4 text-gray-600 text-sm sm:text-base md:text-lg items-start">
                          <div className="w-2 h-2 bg-rh-red rounded-full mt-2.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Share & Actions */}
                  <div className="mt-16 pt-12 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Share this Insight:</span>
                      <div className="flex gap-2">
                        {[Share2, Bookmark, MessageCircle].map((Icon, i) => (
                          <button key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rh-light flex items-center justify-center text-rh-teal hover:bg-rh-red hover:text-white transition-all">
                            <Icon className="w-5 h-5" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button variant="primary" className="w-full sm:w-auto px-10 py-4 rounded-xl shadow-xl shadow-rh-red/20 font-bold">
                      Download Full Insight PDF
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Newsletter */}
      <section className="py-20 md:py-32 bg-[#081B2D] relative overflow-hidden md:rounded-[48px] mx-0 md:mx-8 mb-20 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-rh-red rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-rh-teal rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <SectionLabel className="text-white/40 mb-8 mx-auto" children="Newsletter" />
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-white mb-8 tracking-tight leading-tight">Stay ahead of the <br /> <span className="text-rh-red font-[300]">market curve</span></h2>
          <p className="text-white/60 text-base md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">Get exclusive salary data, hiring trends, and leadership insights delivered monthly.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <input type="email" placeholder="Work email address" className="w-full sm:flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:bg-white/10 focus:border-white/30 transition-all text-base" />
            <Button variant="primary" className="w-full sm:w-auto px-12 py-5 rounded-2xl shadow-xl shadow-rh-red/20 font-bold whitespace-nowrap">Subscribe Now</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
