import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '../../utils/animations';
import Button from '../ui/Button';
import { useAppSelector } from '../../store';

export default function Hero() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const showTalentCTA = !isAuthenticated || user?.role === 'TALENT';
  const showEmployerCTA = isAuthenticated && user?.role === 'EMPLOYER';

  return (
    <section className="relative bg-rh-dark flex items-center min-h-[90dvh] pt-16 overflow-hidden w-full">
      <div className="absolute inset-0 w-full h-full bg-[#12161A]">
        {/* Full width image */}
        <img
          src="/images/hero-image.jpg"
          alt="Professional smiling"
          className="absolute inset-0 w-full h-full object-cover object-[75%_center] md:object-[80%_center] lg:object-center transform-gpu"
        />
        {/* Left side blur black overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#12161A]/80 via-[#12161A]/60 to-[#12161A]/90 lg:hidden"></div>
        <div className="hidden lg:block absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-[#12161A] via-[#12161A]/95 to-transparent"></div>
        <div className="hidden lg:block absolute inset-y-0 left-0 w-[45%] bg-[#12161A] blur-[60px] translate-x-[-5%]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-8 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-0">
        <div className="flex flex-col justify-center lg:grid lg:grid-cols-5 gap-12 lg:gap-12 items-center min-h-[calc(100vh-80px)] lg:min-h-screen">
          {/* Left Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3 text-center lg:text-left"
          >
            <motion.h1
              variants={fadeUp}
              className="text-fluid-h1 font-extrabold text-white leading-[1.1] mb-6 tracking-tight"
            >
              Build Your Future <br /> <span className='text-rh-red font-[300] tracking-tight'>in Australia</span> with the right Talent.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-fluid-p text-gray-300 leading-relaxed mb-8 md:mb-12 max-w-2xl mx-auto lg:mx-0 lg:pr-4"
            >
              Professional Australian PR, visa, and migration solutions tailored for skilled professionals, students, and families.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {showTalentCTA && (
                <Button
                  onClick={() => navigate('/jobs')}
                  size="lg" className="bg-rh-red hover:bg-red-700 text-white rounded-full px-8 py-3.5 text-sm font-bold shadow-lg w-full sm:w-auto min-w-[180px]"
                >
                  Find a job
                </Button>
              )}
              {showEmployerCTA && (
                <Button
                  onClick={() => navigate('/hire-talent')}
                  size="lg" className="!bg-white hover:!bg-gray-100 !text-gray-900 rounded-full px-8 py-3.5 text-sm font-bold shadow-lg w-full sm:w-auto min-w-[180px] border-none"
                >
                  Find talent
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
