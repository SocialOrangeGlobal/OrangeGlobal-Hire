import { motion } from 'framer-motion';
import { staggerContainer, fadeUp } from '../../utils/animations';
import { useInView } from '../../hooks/useInView';
import { useCountUp } from '../../hooks/useCountUp';

export default function Stats() {
  const { ref, inView } = useInView(0.3);

  // Custom counting for the specific stats
  const placements = useCountUp(2, 2000, inView);
  const locations = useCountUp(300, 2000, inView);

  return (
    <section ref={ref} className="bg-white py-16 md:py-20 lg:py-28 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start"
        >
          {/* Left Column */}
          <div className="flex flex-col text-center lg:text-left">
            <motion.h2
              variants={fadeUp}
              className="text-3xl xs:text-4xl sm:text-5xl font-light text-gray-900 mb-8 md:mb-12 lg:mb-20"
            >
              Why <span className='text-rh-red font-[300] tracking-tight'>Orange Global</span>
            </motion.h2>

            <motion.div variants={fadeUp} className="flex flex-col items-center lg:items-start">
              <div className="text-5xl xs:text-6xl sm:text-7xl font-semibold text-rh-red mb-4">
                #1
              </div>
              <p className="text-gray-600 text-base md:text-[17px] leading-relaxed max-w-sm">
                on industry lists of Australians Best Professional Recruiting Firms for 7 consecutive years
              </p>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col lg:border-l-2 lg:border-gray-200 lg:pl-16 space-y-12 md:space-y-16 lg:mt-8 text-center lg:text-left">
            <motion.div variants={fadeUp} className="flex flex-col items-center lg:items-start">
              <div className="text-4xl xs:text-5xl font-semibold text-rh-red mb-3 md:mb-4">
                {placements} million +
              </div>
              <p className="text-gray-600 text-base md:text-[17px] leading-relaxed max-w-md">
                contract and permanent placements and counting
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col items-center lg:items-start">
              <div className="text-4xl xs:text-5xl font-semibold text-rh-red mb-3 md:mb-4">
                {locations}+
              </div>
              <p className="text-gray-600 text-base md:text-[17px] leading-relaxed max-w-md">
                locations to access local expertise near you, or around the world
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
