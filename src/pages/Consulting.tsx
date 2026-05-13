import { motion } from 'framer-motion';
import {
  Lightbulb, Rocket, Zap, Globe,
  BarChart3, Database
} from 'lucide-react';
import Button from '../components/ui/Button';
import { fadeUp } from '../utils/animations';

const solutions = [
  {
    title: 'Business Transformation',
    icon: Lightbulb,
    desc: 'Redesigning operational models to drive efficiency and sustainable growth in a digital-first economy.',
    color: 'bg-orange-50 text-orange-600'
  },
  {
    title: 'Technology Solutions',
    icon: Database,
    desc: 'Cloud migration, cybersecurity audits, and bespoke software architecture tailored to your unique scaling needs.',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Financial Management',
    icon: BarChart3,
    desc: 'Strategic financial planning, risk assessment, and interim CFO leadership for mid-to-large cap organizations.',
    color: 'bg-emerald-50 text-emerald-600'
  },
  {
    title: 'Digital Strategy',
    icon: Rocket,
    desc: 'Comprehensive digital roadmaps that align technology investment with core business objectives and market trends.',
    color: 'bg-purple-50 text-purple-600'
  }
];

export default function ConsultingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 lg:pt-56 lg:pb-40 relative overflow-hidden bg-rh-dark">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-4xl text-center lg:text-left">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.1] tracking-tight mb-8">
                Consulting solutions for a <br />
                <span className="text-rh-red font-[300]">borderless economy</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/70 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                We go beyond staffing. Our consulting practice provides the strategic insight and technical execution needed to thrive in complex global markets.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button
                  onClick={() => window.location.hash = '#contact'}
                  variant="primary"
                  className="w-full sm:w-auto px-10 py-4.5 rounded-2xl bg-white !text-rh-teal hover:bg-rh-light shadow-2xl font-bold"
                >
                  Talk to an Expert
                </Button>
                {/* <Button 
                  onClick={() => window.location.hash = '#contact'}
                  variant="outline" 
                  className="w-full sm:w-auto px-10 py-4.5 rounded-2xl border-white/20 text-white hover:bg-white/10 font-bold"
                >
                  Our Approach
                </Button> */}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 md:py-32 bg-rh-light">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {solutions.map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                variants={fadeUp}
                className="bg-white rounded-[32px] md:rounded-[40px] p-8 md:p-12 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 group flex flex-col h-full"
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[20px] md:rounded-3xl ${item.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-rh-teal mb-4 group-hover:text-rh-red transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed font-light flex-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Big Feature Section */}
      <section className="py-20 md:py-32 lg:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            <div className="w-full lg:w-1/2">
              <div className="relative text-center lg:text-left">
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-rh-red/10 rounded-full blur-3xl hidden lg:block" />
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-light text-rh-teal leading-tight tracking-tight relative z-10">
                  Where strategy <br />
                  meets <span className="text-rh-red font-[300]">execution</span>
                </h2>
              </div>
              <p className="mt-8 md:mt-10 text-base md:text-lg text-gray-500 leading-relaxed text-center lg:text-left font-light max-w-xl mx-auto lg:mx-0">
                Most consulting firms stop at recommendations. Orange Global stays for the implementation. We partner with you to embed lasting change across your organization.
              </p>

              <div className="mt-12 md:mt-16 space-y-8 md:space-y-12">
                {[
                  { title: 'Data-Driven Insights', icon: BarChart3, desc: 'We utilize deep market analytics to inform every strategic decision.' },
                  { title: 'Global Delivery Model', icon: Globe, desc: 'Deploying specialized teams across timezones for 24/7 project momentum.' }
                ].map(feature => (
                  <div key={feature.title} className="flex gap-6 group">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-rh-light rounded-2xl flex items-center justify-center text-rh-teal shrink-0 group-hover:bg-rh-red group-hover:text-white transition-all">
                      <feature.icon className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <div>
                      <h4 className="text-base md:text-xl font-bold text-rh-teal mb-2">{feature.title}</h4>
                      <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 md:mt-16 text-center lg:text-left">
                <Button
                  onClick={() => window.location.hash = '#contact'}
                  variant="primary"
                  className="w-full sm:w-auto px-12 py-5 rounded-2xl shadow-xl shadow-rh-red/10 font-bold"
                >
                  Our Approach
                </Button>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
              <div className="relative aspect-square max-w-[500px] mx-auto">
                <div className="absolute inset-0 bg-rh-light rounded-full -rotate-6" />
                <img
                  src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Consulting Session"
                  className="absolute inset-4 md:inset-6 object-cover rounded-full shadow-2xl hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 -right-4 md:bottom-10 md:-right-10 bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl border border-gray-50 max-w-[200px] md:max-w-xs animate-float">
                  <Zap className="text-rh-red w-6 h-6 md:w-8 md:h-8 mb-3 md:mb-4" />
                  <p className="text-[11px] md:text-sm font-bold text-rh-teal italic leading-relaxed">"Orange Global helped us reduce operational overhead by 34% within two quarters."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
