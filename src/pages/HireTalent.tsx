import { motion } from 'framer-motion';
import {
  Users, UserCheck, Search, ShieldCheck,
  ArrowRight, Globe2, Zap
} from 'lucide-react';
import Button from '../components/ui/Button';
import { fadeUp } from '../utils/animations';

const solutionCards = [
  {
    title: 'Permanent Staffing',
    description: 'Our proprietary screening process ensures you find leaders who align with your culture and business goals.',
    icon: Users,
    metrics: '97% retention rate'
  },
  {
    title: 'Executive Search',
    description: 'Identifying and attracting transformational C-suite talent through extensive global networks and research.',
    icon: ShieldCheck,
    metrics: 'Avg. 35 days to close'
  },
  {
    title: 'Contract Solutions',
    description: 'Agile staffing solutions to manage project peaks, leave coverage, or specialized skill requirements.',
    icon: Zap,
    metrics: '48h talent matching'
  }
];

export default function HireTalentPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-white pt-32 pb-20 md:pt-48 md:pb-32 lg:pt-56 lg:pb-40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-rh-light -skew-x-12 translate-x-1/2 hidden lg:block" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-center lg:text-left"
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-rh-teal leading-[1.1] tracking-tight mb-6 md:mb-10">
                Build your team with <br />
                <span className="text-rh-red font-[300]">unmatched expertise</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-8 md:mb-12 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Orange Global provides enterprise-grade talent solutions that bridge the gap between ambitious organizations and exceptional professionals.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button variant="primary" className="w-full sm:w-auto px-10 py-4.5 rounded-2xl shadow-xl shadow-rh-red/20 text-sm font-bold">Post a Vacancy</Button>
                <Button variant="outline" className="w-full sm:w-auto px-10 py-4.5 rounded-2xl text-sm font-bold border-gray-200">View Case Studies</Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative mt-8 lg:mt-0"
            >
              <div className="relative rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Business Meeting"
                  className="w-full h-full object-cover min-h-[400px] md:min-h-[500px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rh-teal/90 via-rh-teal/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-[24px] p-6 md:p-8 border border-white/20">
                    <p className="text-white text-base md:text-xl font-light italic leading-relaxed">
                      "The quality of candidates from Orange Global transformed our engineering department within 6 months."
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-rh-red flex items-center justify-center text-white font-bold text-sm md:text-base">JD</div>
                      <div>
                        <p className="text-white text-sm md:text-base font-bold">James Dalton</p>
                        <p className="text-white/60 text-[10px] md:text-xs uppercase tracking-widest font-bold">CTO, TechScale Global</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="bg-rh-light py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-light text-rh-teal leading-tight tracking-tight mb-6">
              Tailored strategies for <br />
              <span className="text-rh-red font-[300]">diverse hiring needs</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-medium max-w-2xl mx-auto">
              Whether you're a high-growth startup or a Fortune 500 company, we have the network and tools to scale your human capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {solutionCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                variants={fadeUp}
                className="bg-white rounded-[32px] p-8 md:p-12 border border-gray-100 hover:shadow-2xl transition-all group flex flex-col h-full"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-rh-light rounded-2xl flex items-center justify-center text-rh-teal group-hover:bg-rh-red group-hover:text-white transition-all mb-8 md:mb-10">
                  <card.icon className="w-7 h-7 md:w-8 md:h-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-rh-teal mb-4 group-hover:text-rh-red transition-colors">{card.title}</h3>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-10 flex-1">{card.description}</p>
                <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] md:text-xs font-bold text-rh-teal uppercase tracking-widest">{card.metrics}</span>
                  <div className="w-10 h-10 rounded-full bg-rh-light group-hover:bg-rh-red flex items-center justify-center transition-all">
                    <ArrowRight className="w-5 h-5 text-rh-teal group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us / Process */}
      <section className="bg-white py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-light text-rh-teal leading-tight tracking-tight mb-12 md:mb-16">
                The Orange Global <br />
                <span className="text-rh-red font-[300]">difference</span>
              </h2>
              <div className="space-y-8 md:space-y-10">
                {[
                  { title: 'Global Reach, Local Depth', desc: 'Networks spanning across India, APAC, and the Middle East.', icon: Globe2 },
                  { title: 'AI-Enhanced Screening', desc: 'Proprietary technology that predicts long-term candidate success.', icon: Search },
                  { title: 'Dedicated Search Partners', desc: 'Senior-level consultants who specialize in your specific industry.', icon: UserCheck }
                ].map((item) => (
                  <div key={item.title} className="flex gap-6 group">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-rh-light flex items-center justify-center text-rh-teal shrink-0 group-hover:bg-rh-red group-hover:text-white transition-all">
                      <item.icon className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <div>
                      <h4 className="text-base md:text-xl font-bold text-rh-teal mb-2">{item.title}</h4>
                      <p className="text-gray-500 text-sm md:text-base leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12 md:mt-16 text-center lg:text-left">
                 <Button variant="primary" className="w-full sm:w-auto px-12 py-5 rounded-2xl shadow-xl shadow-rh-red/10 font-bold">Partner with Us</Button>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                <div className="space-y-4 md:space-y-8 mt-8 md:mt-16">
                  <div className="bg-rh-light rounded-[32px] md:rounded-[48px] p-8 md:p-12 aspect-square flex flex-col justify-center text-center hover:scale-105 transition-transform border border-gray-100">
                    <h4 className="text-3xl md:text-5xl font-bold text-rh-teal mb-2">12M+</h4>
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Global Talent Pool</p>
                  </div>
                  <div className="bg-rh-teal rounded-[32px] md:rounded-[48px] p-8 md:p-12 aspect-square flex flex-col justify-center text-center text-white hover:scale-105 transition-transform shadow-2xl shadow-rh-teal/20">
                    <h4 className="text-3xl md:text-5xl font-bold mb-2">91%</h4>
                    <p className="text-[10px] md:text-xs font-bold text-white/60 uppercase tracking-widest">Offer Acceptance</p>
                  </div>
                </div>
                <div className="space-y-4 md:space-y-8">
                  <div className="bg-rh-red rounded-[32px] md:rounded-[48px] p-8 md:p-12 aspect-square flex flex-col justify-center text-center text-white hover:scale-105 transition-transform shadow-2xl shadow-rh-red/20">
                    <h4 className="text-3xl md:text-5xl font-bold mb-2">400+</h4>
                    <p className="text-[10px] md:text-xs font-bold text-white/60 uppercase tracking-widest">Expert Recruiters</p>
                  </div>
                  <div className="bg-white border border-gray-100 shadow-xl rounded-[32px] md:rounded-[48px] p-8 md:p-12 aspect-square flex flex-col justify-center text-center hover:scale-105 transition-transform">
                    <h4 className="text-3xl md:text-5xl font-bold text-rh-teal mb-2">18d</h4>
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Avg. Time to Hire</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
