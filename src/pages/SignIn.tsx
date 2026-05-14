import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'talent' | 'employer'>('talent');

  return (
    <div className="bg-white min-h-screen pt-20 lg:pt-0 flex flex-col lg:flex-row font-sans overflow-x-hidden">
      {/* Left Side: Professional Branding with Background Image */}
      <div className="w-full lg:w-1/2 min-h-[350px] md:min-h-[450px] lg:min-h-screen relative flex items-center justify-center p-6 md:p-12 lg:p-24 border-b lg:border-b-0 lg:border-r border-gray-100 shrink-0 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0 bg-rh-dark">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />
        </div>

        <div className="relative z-10 max-w-md text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 lg:mb-6 tracking-tight leading-tight">
              Welcome to <br />
              <span className="text-rh-red font-normal italic">Orange Global</span>
            </h1>
            <p className="text-gray-200 text-sm sm:text-base lg:text-xl font-medium leading-relaxed max-w-sm mx-auto lg:mx-0 opacity-90">
              Access your account and explore elite opportunities waiting for you across the globe.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-8 lg:mt-12 flex items-center justify-center lg:justify-start gap-4 text-white/60 text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em]"
          >
            <div className="w-8 h-[1px] bg-white/30" />
            <span>Trusted by global leaders</span>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Simple Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-12 lg:p-16 bg-white overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-[440px] py-8 lg:py-12">
          {/* Custom Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-8 lg:mb-10">
            <button
              onClick={() => setActiveTab('talent')}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'talent' ? 'bg-white text-rh-teal shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Talent
            </button>
            <button
              onClick={() => setActiveTab('employer')}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'employer' ? 'bg-white text-rh-teal shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Employer
            </button>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
          >
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  className="w-full px-5 py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all text-gray-900 font-medium"
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-5 py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all text-gray-900 font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rh-teal transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-rh-red focus:ring-rh-red" />
                  <span className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-700">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-xs sm:text-sm font-bold text-rh-teal hover:text-rh-red transition-colors">Forgot Password?</Link>
              </div>

              <Button type="submit" className="w-full py-4 text-base font-bold bg-[#081B2D] hover:bg-rh-teal text-white rounded-2xl transition-all shadow-lg shadow-blue-900/10 mt-2">
                Sign In
              </Button>
            </form>

            <div className="pt-8 text-center">
              <p className="text-gray-500 text-sm">
                Don't have an account?{' '}
                <Link to="/signup-choice" className="text-rh-red font-bold hover:underline underline-offset-4 ml-1">
                  Sign Up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
