import { motion } from 'framer-motion';
import { Users, Briefcase } from 'lucide-react';
import Button from '../components/ui/Button';

export default function SignUpChoice() {
  const selectChoice = (choice: 'talent' | 'employer') => {
    window.location.hash = `#signup-${choice}`;
  };

  return (
    <div className="bg-white min-h-screen pt-20 lg:pt-0 flex flex-col lg:flex-row font-sans overflow-x-hidden">
      {/* Left Side: Professional Branding with Background Image (Matches SignIn) */}
      <div className="w-full lg:w-1/2 min-h-[350px] md:min-h-[450px] lg:min-h-screen relative flex items-center justify-center p-6 md:p-12 lg:p-24 border-b lg:border-b-0 lg:border-r border-gray-100 shrink-0 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0 bg-rh-dark">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />
        </div>

        <div className="relative z-10 max-w-md text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 lg:mb-6 tracking-tight leading-tight">
              Join <br />
              <span className="text-rh-red font-normal italic">Orange Global</span>
            </h1>
            <p className="text-gray-200 text-sm sm:text-base lg:text-xl font-medium leading-relaxed max-w-sm mx-auto lg:mx-0 opacity-90">
              Choose how you'd like to get started and join our elite global staffing ecosystem.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-8 lg:mt-12 flex items-center justify-center lg:justify-start gap-4 text-white/60 text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em]"
          >
            <div className="w-8 h-[1px] bg-white/30" />
            <span>Empowering Global Careers</span>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Simple Choice Cards */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-12 lg:p-16 bg-white overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-4xl py-8 lg:py-12">
          <div className="grid sm:grid-cols-2 gap-4 lg:gap-8">
            {/* Talent Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -5 }}
              className="group relative bg-white rounded-[32px] p-6 sm:p-8 lg:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-gray-100 cursor-pointer overflow-hidden transition-all"
              onClick={() => selectChoice('talent')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-rh-teal/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />

              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-rh-teal/10 rounded-2xl flex items-center justify-center text-rh-teal mb-4 sm:mb-6 group-hover:bg-rh-teal group-hover:text-white transition-all shadow-sm">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#081B2D] mb-2 sm:mb-3">Find Work</h2>
                <p className="text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed">
                  Access exclusive global opportunities and advance your career.
                </p>
                <Button variant="outline" className="w-full py-3.5 sm:py-4 text-sm sm:text-base font-bold border-2 border-gray-100 text-[#081B2D] hover:bg-rh-teal hover:text-white hover:border-rh-teal rounded-2xl transition-all">
                  Join as Talent
                </Button>
              </div>
            </motion.div>

            {/* Employer Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -5 }}
              className="group relative bg-white rounded-[32px] p-6 sm:p-8 lg:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-gray-100 cursor-pointer overflow-hidden transition-all"
              onClick={() => selectChoice('employer')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-rh-red/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />

              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-rh-red/10 rounded-2xl flex items-center justify-center text-rh-red mb-4 sm:mb-6 group-hover:bg-rh-red group-hover:text-white transition-all shadow-sm">
                  <Briefcase className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#081B2D] mb-2 sm:mb-3">Hire Talent</h2>
                <p className="text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed">
                  Partner with us to find the best talent for your organization.
                </p>
                <Button
                  variant="primary"
                  className="w-full py-3.5 sm:py-4 text-sm sm:text-base font-bold bg-white border-2 border-rh-red !text-rh-red hover:bg-rh-red hover:!text-white rounded-2xl transition-all"
                >
                  Join as Employer
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <a href="#signin" className="text-rh-red font-bold hover:underline underline-offset-4 ml-1">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
