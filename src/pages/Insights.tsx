import { motion } from 'framer-motion';
import {
  ArrowRight, Play, Search, Filter
} from 'lucide-react';
import Button from '../components/ui/Button';
import SectionLabel from '../components/ui/SectionLabel';
import { fadeUp } from '../utils/animations';

const articles = [
  {
    category: 'Market Report',
    title: '2026 Global Salary Guide: High-Growth Sectors',
    desc: 'Comprehensive analysis of compensation trends across tech, finance, and legal markets.',
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: 'May 10, 2026'
  },
  {
    category: 'Career Advice',
    title: 'The Rise of Fractional Leadership in APAC',
    desc: 'Why organizations are turning to part-time executive talent to drive strategic initiatives.',
    image: 'https://images.pexels.com/photos/3184301/pexels-photo-3184301.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: 'May 08, 2026'
  },
  {
    category: 'Hiring Insights',
    title: 'Retaining Elite Engineering Talent in 2026',
    desc: 'New strategies for reducing turnover in the world\'s most competitive labor market.',
    image: 'https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: 'May 05, 2026'
  }
];

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-rh-light">
      {/* Hero & Featured Insight */}
      <section className="pt-32 pb-16 md:pt-48 md:pb-24 bg-white border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-7">
              <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-rh-teal leading-[1.1] tracking-tight mb-8 md:mb-12 text-center lg:text-left">
                  Knowledge that <br />
                  <span className="text-rh-red font-[300]">shapes industries</span>
                </h1>
                
                <div className="relative group cursor-pointer overflow-hidden rounded-[32px] md:rounded-[48px] shadow-2xl aspect-[16/10] md:aspect-video">
                  <img
                    src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Featured Insight"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rh-teal/95 via-rh-teal/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
                    <div className="flex items-center gap-3 mb-4">
                       <span className="px-3 py-1 bg-rh-red text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full">Webinar</span>
                       <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Live Now</span>
                    </div>
                    <h3 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">Navigating Regulatory Changes in Global Finance</h3>
                    <div className="flex items-center gap-4">
                      <button className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center text-rh-red shadow-xl hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 md:w-6 md:h-6 fill-current" />
                      </button>
                      <span className="text-white font-bold text-xs md:text-sm tracking-wide">Watch Session (45m)</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 pt-4 lg:pt-20">
              <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-rh-teal">Trending Insights</h3>
                <Filter className="w-5 h-5 text-gray-300" />
              </div>
              <div className="space-y-8 md:space-y-10">
                {[
                  'How AI is redefining the role of the CFO',
                  'Recruitment marketing: A guide for 2026',
                  'Remote work culture: Long-term success factors',
                  'Top 10 skills in demand for Q3 2026'
                ].map((title, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex items-center gap-4 mb-2">
                       <span className="text-rh-red text-[10px] font-bold uppercase tracking-widest">0{i + 1}</span>
                       <div className="h-[1px] flex-1 bg-gray-50 group-hover:bg-rh-red/20 transition-colors" />
                    </div>
                    <h4 className="text-base md:text-xl font-bold text-rh-teal group-hover:text-rh-red transition-colors leading-tight mb-2">{title}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Market Analysis • 5 Min Read</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Grid */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-rh-teal">Latest Resources</h2>
            <div className="flex flex-wrap gap-2">
              {['All', 'Reports', 'Articles', 'Videos'].map((cat, i) => (
                <button key={cat} className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all border ${i === 0 ? 'bg-rh-teal text-white border-rh-teal shadow-lg shadow-rh-teal/20' : 'bg-white text-gray-500 border-gray-100 hover:border-rh-red hover:text-rh-red'}`}>{cat}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {articles.map((article, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                variants={fadeUp}
                className="group flex flex-col h-full bg-white rounded-[32px] p-4 md:p-6 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50"
              >
                <div className="relative aspect-[16/10] rounded-[24px] overflow-hidden mb-8 group-hover:shadow-xl transition-all">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-white/95 backdrop-blur-md rounded-xl text-rh-teal text-[9px] font-bold uppercase tracking-widest shadow-lg border border-white/20">{article.category}</span>
                  </div>
                </div>
                <div className="flex-1 px-2 pb-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{article.date}</p>
                  <h3 className="text-xl md:text-2xl font-bold text-rh-teal group-hover:text-rh-red transition-colors mb-4 leading-tight">{article.title}</h3>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-10 font-light">{article.desc}</p>
                  <a href="#" className="inline-flex items-center gap-2 text-[11px] font-bold text-rh-teal uppercase tracking-[0.2em] group-hover:gap-3 transition-all">
                    Read Article <ArrowRight className="w-4 h-4 text-rh-red" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Button variant="outline" className="w-full sm:w-auto px-12 py-5 rounded-2xl font-bold border-gray-200">Load More Insights</Button>
          </div>
        </div>
      </section>

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
