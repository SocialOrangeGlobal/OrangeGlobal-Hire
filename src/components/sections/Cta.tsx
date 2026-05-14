import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { fadeUp } from '../../utils/animations';
import Button from '../ui/Button';

export default function Cta() {
  const navigate = useNavigate();
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
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight tracking-tight">
            Ready to transform your <span className="text-rh-red font-[300] tracking-tight">Workforce?</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Partner with Orange Global to access the top 5% of industry professionals. Build teams that drive measurable business impact.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/hire-talent')}
              className="px-10 py-5 text-lg font-bold shadow-[0_0_20px_rgba(215,0,54,0.4)] hover:shadow-[0_0_30px_rgba(215,0,54,0.6)]"
            >
              Hire Top Talent <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/jobs')}
              className="border-white/40 text-white hover:bg-gray-200 hover:text-gray-900 px-10 py-5 text-lg font-bold"
            >
              Find a Job
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
