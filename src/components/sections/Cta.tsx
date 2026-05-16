import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { fadeUp } from '../../utils/animations';
import Button from '../ui/Button';
import { useAppSelector } from '../../store';

export default function Cta() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const isEmployer = isAuthenticated && user?.role === 'EMPLOYER';
  const isTalent = isAuthenticated && user?.role === 'TALENT';

  return (
    <section className="bg-rh-dark py-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-rh-teal/30 to-transparent" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-rh-red/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
        >
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6 leading-tight tracking-tight">
            {isTalent ? 'Ready to transform your ' : 'Ready to transform your '}
            <span className="text-rh-red font-[300] tracking-tight">{isTalent ? 'Career?' : 'Workforce?'}</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            {isTalent
              ? 'Find your next big opportunity in Australia with leading global companies. Build a career that makes an impact.'
              : 'Partner with Orange Global to access the top 5% of industry professionals. Build teams that drive measurable business impact.'}
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center gap-4">
            {(!isAuthenticated || isEmployer) && (
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate('/hire-talent')}
                className="px-8 py-4 text-base font-bold shadow-[0_0_20px_rgba(215,0,54,0.4)] hover:shadow-[0_0_30px_rgba(215,0,54,0.6)]"
              >
                Hire Top Talent <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            )}
            {(!isAuthenticated || isTalent) && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/jobs')}
                className="border-white/40 text-white hover:bg-gray-200 hover:text-gray-900 px-8 py-4 text-base font-bold"
              >
                Find a Job
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
