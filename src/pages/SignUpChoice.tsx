import { motion } from 'framer-motion';
import { User, Briefcase, ArrowLeft, ArrowRight } from 'lucide-react';
import Footer from '../components/layouts/Footer';

export default function SignUpChoice() {
  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '';
  };

  const selectChoice = (choice: 'talent' | 'employer') => {
    window.location.hash = `#signup-${choice}`;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Simple Auth Header */}
      <header className="bg-white border-b border-gray-100 py-5 px-6 md:px-12 flex items-center justify-between relative z-20">
        <a href="#" onClick={goHome} className="flex items-center gap-2">
          <div className="w-40">
            <img src="/images/brand-logo-dark.png" alt="Orange Global" className="w-full h-auto object-contain" />
          </div>
        </a>
        <a href="#" onClick={goHome} className="text-sm font-bold text-gray-500 hover:text-rh-red flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </a>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row relative overflow-hidden pb-20">
        {/* Left Side: Talent */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex-1 relative group cursor-pointer overflow-hidden border-r border-gray-100"
          onClick={() => selectChoice('talent')}
        >
          <div className="absolute inset-0 bg-rh-red/0 group-hover:bg-rh-red/[0.02] transition-colors duration-500" />
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 bg-rh-red/5 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-rh-red/10 transition-all duration-500">
              <User className="w-12 h-12 text-rh-red" />
            </div>
            <h2 className="text-4xl font-light text-gray-900 mb-6">
              I'm looking <span className="text-rh-red font-[300] tracking-tight block sm:inline">for work</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-sm mb-10 leading-relaxed">
              Create your professional profile, upload your resume, and get matched with elite global opportunities.
            </p>
            <div className="flex items-center gap-3 text-rh-red font-bold text-lg group-hover:gap-5 transition-all">
              Join as Talent <ArrowRight className="w-6 h-6" />
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-rh-red scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </motion.div>

        {/* Right Side: Employer */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex-1 relative group cursor-pointer overflow-hidden"
          onClick={() => selectChoice('employer')}
        >
          <div className="absolute inset-0 bg-rh-teal/0 group-hover:bg-rh-teal/[0.02] transition-colors duration-500" />
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 bg-rh-teal/5 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-rh-teal/10 transition-all duration-500">
              <Briefcase className="w-12 h-12 text-rh-teal" />
            </div>
            <h2 className="text-4xl font-light text-gray-900 mb-6">
              I'm looking <span className="text-rh-teal font-[300] tracking-tight block sm:inline">to hire</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-sm mb-10 leading-relaxed">
              Scale your team with pre-vetted industry experts and transform your business impact globally.
            </p>
            <div className="flex items-center gap-3 text-rh-teal font-bold text-lg group-hover:gap-5 transition-all">
              Join as Employer <ArrowRight className="w-6 h-6" />
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute bottom-0 right-0 w-full h-1.5 bg-rh-teal scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
