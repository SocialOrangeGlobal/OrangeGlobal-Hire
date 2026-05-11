import { motion } from 'framer-motion';
import { Cpu, Clock, Globe, ShieldCheck } from 'lucide-react';
import { staggerContainer, fadeUp, slideInRight } from '../../utils/animations';

const features = [
  {
    icon: Cpu,
    title: 'AI-Powered Matching',
    description: 'Our proprietary algorithms analyze thousands of data points to find the perfect cultural and technical fit.',
  },
  {
    icon: Clock,
    title: 'Faster Hiring Cycle',
    description: 'Reduce time-to-hire by up to 40% with our pre-vetted network of passive candidates.',
  },
  {
    icon: Globe,
    title: 'Global Network',
    description: 'Access top talent across 400+ markets worldwide with localized expertise in every region.',
  },
  {
    icon: ShieldCheck,
    title: 'Risk-Free Guarantee',
    description: 'Every placement comes with a satisfaction guarantee. If it is not a fit, we will replace them at no cost.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={fadeUp}>
              <h2 className="text-3xl xs:text-4xl sm:text-5xl font-light text-gray-900 mt-2 md:mt-4 mb-6 leading-tight">
                Why industry leaders choose <span className="text-rh-red font-[300] tracking-tight">Orange Global</span> to build their teams.
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-10 leading-relaxed max-w-xl">
                We combine decades of recruitment expertise with cutting-edge AI matching technology to deliver exceptional talent faster and more reliably than traditional agencies.
              </p>
            </motion.div>

            <div className="space-y-6 md:space-y-8">
              {features.map((feature, i) => (
                <motion.div key={i} variants={fadeUp} className="flex gap-4 md:gap-5">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-rh-light rounded-full flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-rh-red" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-rh-teal mb-1 md:mb-2">{feature.title}</h3>
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual Grid */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative mt-8 lg:mt-0"
          >
            {/* Organic Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-rh-teal/5 rounded-full filter blur-[60px] pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 relative z-10">
              <div className="space-y-4 md:space-y-6 sm:mt-12 order-2 sm:order-1">
                <div className="bg-rh-light rounded-[24px] overflow-hidden shadow-lg border border-gray-100 h-48 sm:h-64 lg:h-72">
                  <img src="https://images.pexels.com/photos/3182750/pexels-photo-3182750.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Team meeting" className="w-full h-full object-cover" />
                </div>
                <div className="bg-white rounded-[24px] p-5 md:p-8 shadow-lg border border-gray-100 text-rh-teal font-bold">
                  <div className="text-3xl md:text-5xl font-extrabold text-rh-red mb-1 md:mb-2">91%</div>
                  <div className="text-[10px] md:text-sm text-gray-600 font-semibold leading-tight">Offer Acceptance Rate</div>
                </div>
              </div>
              <div className="space-y-4 md:space-y-6 order-1 sm:order-2">
                <div className="bg-white rounded-[24px] p-5 md:p-8 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3 md:gap-4 mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-rh-teal truncate">Verified</div>
                      <div className="text-[9px] md:text-xs text-gray-500 uppercase tracking-wider font-bold truncate">Talent Pool</div>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
                <div className="bg-rh-light rounded-[24px] overflow-hidden shadow-lg border border-gray-100 h-48 sm:h-80 lg:h-96">
                  <img src="https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Professional working" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
