import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, slideInRight } from '../../utils/animations';
import Button from '../ui/Button';

export default function Hero() {
  return (
    <section className="relative bg-rh-dark flex items-center min-h-screen pt-20 overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-[#12161A]">
        {/* Full width image */}
        <img
          src="/images/hero-image.jpg"
          alt="Professional smiling"
          className="absolute inset-0 w-full h-full object-cover object-[80%_center] lg:object-center"
        />
        {/* Left side blur black overlay */}
        <div className="absolute inset-0 bg-[#12161A]/90 lg:hidden"></div>
        <div className="hidden lg:block absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-[#12161A] via-[#12161A]/95 to-transparent"></div>
        <div className="hidden lg:block absolute inset-y-0 left-0 w-[45%] bg-[#12161A] blur-[60px] translate-x-[-5%]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
        <div className="grid lg:grid-cols-5 gap-16 lg:gap-12 items-center min-h-screen">
          {/* Left Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3"
          >
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-[3.5rem] xl:text-[4rem] font-extrabold text-white leading-[1.05] mb-6"
            >
              Anything's possible<br />
              <span className='block md:inline text-rh-red font-[300] tracking-tight letter-spacing-[-1px]'>with the right </span>
              talent
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 pr-4"
            >
              Discover exceptional candidates, in-demand opportunities, and workforce solutions that help businesses and careers grow faster.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-rh-red hover:bg-red-700 text-white rounded-full px-10 py-4 text-base font-bold shadow-lg w-full sm:w-auto">
                Find a job
              </Button>
              <Button size="lg" className="!bg-white hover:!bg-gray-200 !text-gray-900 rounded-full px-10 py-4 text-base font-bold shadow-lg w-full sm:w-auto border-none">
                Find talent
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Image for Mobile (Visible only on small screens) */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            className="lg:hidden relative rounded-2xl overflow-hidden shadow-2xl h-[400px]"
          >
            <img
              src="/images/hero-image.jpg"
              alt="Professional smiling"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
