import { motion } from 'framer-motion';
import { Cpu, Clock, Globe, ShieldCheck } from 'lucide-react';
import { staggerContainer, fadeUp, slideInRight } from '../../utils/animations';
import SectionLabel from '../ui/SectionLabel';

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
    <section className="bg-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={fadeUp}>
              <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mt-4 mb-6 leading-tight">
                Why industry leaders choose <span className="text-rh-red font-[300] tracking-tight">Orange Global</span> to build their teams.
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                We combine decades of recruitment expertise with cutting-edge AI matching technology to deliver exceptional talent faster and more reliably than traditional agencies.
              </p>
            </motion.div>

            <div className="space-y-8">
              {features.map((feature, i) => (
                <motion.div key={i} variants={fadeUp} className="flex gap-5">
                  <div className="w-12 h-12 bg-rh-light rounded-full flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-rh-red" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-rh-teal mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
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
            className="relative"
          >
            {/* Organic Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-rh-teal/5 rounded-full filter blur-[60px] pointer-events-none" />

            <div className="grid grid-cols-2 gap-4 sm:gap-6 relative z-10">
              <div className="space-y-4 sm:space-y-6 mt-12">
                <div className="bg-rh-light rounded-[24px] overflow-hidden shadow-lg border border-gray-100">
                  <img src="https://images.pexels.com/photos/3182750/pexels-photo-3182750.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Team meeting" className="w-full h-48 sm:h-64 object-cover" />
                </div>
                <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-lg border border-gray-100 text-rh-teal font-bold">
                  <div className="text-4xl font-extrabold text-rh-red mb-2">91%</div>
                  <div className="text-sm text-gray-600 font-semibold">Offer Acceptance Rate</div>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-rh-teal">Verified</div>
                      <div className="text-xs text-gray-500">Talent Pool</div>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
                <div className="bg-rh-light rounded-[24px] overflow-hidden shadow-lg border border-gray-100">
                  <img src="https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Professional working" className="w-full h-56 sm:h-72 object-cover" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
