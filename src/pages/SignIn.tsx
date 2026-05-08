import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ChevronDown, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Footer from '../components/layouts/Footer';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'talent' | 'employer'>('talent');

  const goBack = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '';
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      {/* Professional Header */}
      <header className="bg-white border-b border-gray-100 py-5 px-6 md:px-12 flex items-center justify-between relative z-20">
        <a href="#" onClick={goBack} className="flex items-center gap-2">
          <div className="w-40">
            <img src="/images/brand-logo-dark.png" alt="Orange Global" className="w-full h-auto object-contain" />
          </div>
        </a>
        <a href="#" onClick={goBack} className="text-sm font-bold text-gray-500 hover:text-rh-red flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-16 px-4 pb-20">
        <h1 className="text-[48px] font-light text-gray-900 mb-10 tracking-tight">Sign <span className='text-rh-red'>in</span></h1>

        <div className="w-full max-w-[580px]">
          {/* Custom Tabs to match screenshot */}
          <div className="flex">
            <button
              onClick={() => setActiveTab('talent')}
              className={`px-12 py-3.5 text-sm font-bold rounded-t-2xl transition-all duration-200 border-x border-t ${activeTab === 'talent'
                ? 'bg-white text-rh-teal border-gray-200 relative z-10'
                : 'bg-[#eff2f6] text-gray-500 border-transparent hover:text-gray-900'
                }`}
            >
              <span className={activeTab === 'talent' ? 'border-b-2 border-rh-teal pb-1' : ''}>Talent</span>
            </button>
            <button
              onClick={() => setActiveTab('employer')}
              className={`px-12 py-3.5 text-sm font-bold rounded-t-2xl transition-all duration-200 border-x border-t -ml-2 ${activeTab === 'employer'
                ? 'bg-white text-rh-teal border-gray-200 relative z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]'
                : 'bg-[#eff2f6] text-gray-500 border-transparent hover:text-gray-900'
                }`}
            >
              <span className={activeTab === 'employer' ? 'border-b-2 border-rh-teal pb-1' : ''}>Employer</span>
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-r-2xl rounded-bl-2xl shadow-[0_4px_25px_rgba(0,0,0,0.05)] p-10 md:p-14 border border-gray-200 -mt-px"
          >
            {/* Form */}
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <input
                  type="text"
                  className="w-full px-6 py-5 bg-[#eff2f6] border-none rounded-2xl focus:ring-2 focus:ring-rh-teal/20 transition-all text-gray-900 font-medium placeholder:text-gray-500"
                  placeholder="Username"
                />
              </div>

              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-6 py-5 bg-[#eff2f6] border-none rounded-2xl focus:ring-2 focus:ring-rh-teal/20 transition-all text-gray-900 font-medium placeholder:text-gray-500"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-rh-teal hover:text-rh-teal/80 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-6 h-6 rounded-md border-gray-300 text-rh-red focus:ring-rh-red cursor-pointer"
                />
                <label htmlFor="remember" className="text-base text-gray-600 font-medium cursor-pointer">Remember Me</label>
              </div>

              <Button type="submit" className="w-full py-5 text-xl font-bold bg-[#081B2D] hover:bg-[#0c2a46] text-white rounded-full transition-all">
                Sign In
              </Button>
            </form>

            {/* Footer Links - Precise Colors from Screenshot */}
            <div className="mt-10 flex flex-col items-center gap-6">
              <div className="flex gap-2 text-sm font-bold text-rh-teal">
                <a href="#" className="hover:underline">Forgot username</a>
                <span className="text-gray-300">or</span>
                <a href="#" className="text-rh-red hover:underline">Password?</a>
              </div>
              <p className="text-sm text-gray-600 font-semibold">
                Don't have an account?{' '}
                <a href="#signup-choice" className="text-rh-red hover:underline underline-offset-4">
                  Sign up
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
