import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Zap, Globe2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import { signUpPositionType } from '../data';

export default function SignUpEmployer() {
  const navigate = useNavigate();
  const [positionType, setPositionType] = useState('');

  const goBack = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/signup-choice');
  };

  return (
    <div className="bg-white min-h-screen pt-[72px] lg:pt-0 flex flex-col lg:flex-row font-sans overflow-x-hidden">
      {/* Left Side: SignUp Form */}
      <main className="flex-1 p-4 sm:p-12 lg:p-12 bg-[#f8f9fa] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 lg:p-12 border border-gray-100 py-8 lg:py-12 mx-auto lg:my-12"
        >
          <div className="mb-8 lg:mb-10">
            <h1 className="text-xl sm:text-3xl font-bold text-[#081B2D] mb-2 tracking-tight">
              Build Your Dream <span className="text-rh-red">Team</span>
            </h1>
            <p className="text-gray-500 text-sm sm:text-base font-medium">
              Tell us about your organization and the role you're looking to fill and we'll handle the rest.
            </p>
          </div>

          <form
            className="space-y-8 lg:space-y-10"
            onSubmit={(e) => {
              e.preventDefault();
              // Simulating a successful signup and redirecting to dashboard
              const btn = e.currentTarget.querySelector('button[type="submit"]');
              if (btn) btn.innerHTML = 'Signing up...';
              setTimeout(() => {
                navigate('/employer-dashboard');
              }, 1500);
            }}
          >
            {/* Section 1: Contact Information */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <div className="w-8 h-8 rounded-full bg-rh-red/10 flex items-center justify-center text-rh-red">
                  <span className="text-xs font-bold">01</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#081B2D]">Contact Information</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John"
                    className="w-full px-5 py-3.5 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Doe"
                    className="w-full px-5 py-3.5 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Business Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-5 py-3.5 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Business Email</label>
                  <input
                    type="email"
                    required
                    placeholder="john@company.com"
                    className="w-full px-5 py-3.5 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp"
                    className="w-full px-5 py-3.5 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Your Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hiring Manager"
                    className="w-full px-5 py-3.5 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Position Details */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <div className="w-8 h-8 rounded-full bg-rh-red/10 flex items-center justify-center text-rh-red">
                  <span className="text-xs font-bold">02</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#081B2D]">Position Details</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Title to Hire</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Backend Developer"
                    className="w-full px-5 py-3.5 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Zip Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10001"
                    className="w-full px-5 py-3.5 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Position Type</label>
                  <Dropdown
                    options={signUpPositionType}
                    value={positionType}
                    onChange={setPositionType}
                    placeholder="Select position type"
                    className="w-full"
                  />
                </div>
              </div>
            </section>

            <div className="pt-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
              <button type="button" onClick={goBack} className="text-gray-400 font-bold hover:text-rh-red flex items-center gap-2 transition-colors text-sm sm:text-base">
                <ArrowLeft className="w-5 h-5" /> Back to Choice
              </button>
              <Button type="submit" variant="primary" className="w-full sm:w-auto px-12 py-3.5 sm:py-4 text-sm sm:text-lg font-bold bg-[#D71920] hover:bg-[#B41419] text-white rounded-2xl transition-all shadow-xl shadow-red-500/10 min-w-[220px]">
                Complete Registration
              </Button>
            </div>
          </form>
        </motion.div>
      </main>

      {/* Right Side: Professional Branding (Swapped for mobile consistency) */}
      <aside className="w-full lg:w-[40%] relative flex flex-col justify-center p-6 md:p-12 lg:p-24 overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-100 min-h-[350px] md:min-h-[450px] lg:min-h-screen shrink-0">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0 bg-rh-dark">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 space-y-8 lg:space-y-12 text-center lg:text-left"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-4 lg:mb-6 leading-tight">
              Why partner with <br />
              <span className="text-rh-red font-normal italic">Orange Global?</span>
            </h2>
            <p className="text-gray-200 text-sm sm:text-base lg:text-lg font-medium leading-relaxed max-w-sm mx-auto lg:mx-0 opacity-90">
              We connect you with the top 1% of global talent through our specialized recruitment process and AI-powered matching.
            </p>
          </div>

          <div className="space-y-6 lg:space-y-10 text-left">
            {[
              { icon: <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6" />, title: "Vetted Professionals", desc: "Every candidate undergoes rigorous technical and cultural assessment." },
              { icon: <Globe2 className="w-5 h-5 lg:w-6 lg:h-6" />, title: "Global Reach", desc: "Access talent from over 50 countries with simplified compliance." },
              { icon: <Zap className="w-5 h-5 lg:w-6 lg:h-6" />, title: "Speed to Hire", desc: "Reduce your recruitment cycle by up to 60% with our AI-matching." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 lg:gap-6 group">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-white/10 flex items-center justify-center text-rh-red shrink-0 group-hover:bg-rh-red group-hover:text-white transition-all duration-300 backdrop-blur-md">
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="text-white text-sm lg:text-base font-bold">{item.title}</h4>
                  <p className="text-gray-300 text-xs lg:text-sm leading-relaxed font-medium opacity-80">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 lg:pt-10 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-[#12161A] bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-xs lg:text-sm font-bold text-white/80">
                Joined by <span className="text-rh-red">500+</span> top organizations
              </p>
            </div>
          </div>
        </motion.div>
      </aside>
    </div>
  );
}
