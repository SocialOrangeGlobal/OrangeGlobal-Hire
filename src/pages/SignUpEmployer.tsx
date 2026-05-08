import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import Button from '../components/ui/Button';
import Footer from '../components/layouts/Footer';

export default function SignUpEmployer() {
  const goBack = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '#signup-choice';
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      {/* Minimal Header */}
      <header className="bg-white border-b border-gray-100 py-5 px-6 md:px-12 flex items-center justify-between relative z-20">
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }} className="flex items-center gap-2">
          <div className="w-40">
            <img src="/images/brand-logo-dark.png" alt="Orange Global" className="w-full h-auto object-contain" />
          </div>
        </a>
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }} className="text-sm font-bold text-gray-500 hover:text-rh-red flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </a>
      </header>

      <main className="flex-1 py-12 px-4 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-8 md:p-12 border border-gray-100"
        >
          <form className="space-y-12">
            {/* Section 1: Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-[#081B2D] mb-8">Contact information</h2>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">First name</label>
                  <input 
                    type="text" 
                    placeholder="First name"
                    className="w-full px-5 py-4 bg-[#eff2f6] border-none rounded-2xl focus:ring-2 focus:ring-rh-teal/20 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Last name</label>
                  <input 
                    type="text" 
                    placeholder="Last name"
                    className="w-full px-5 py-4 bg-[#eff2f6] border-none rounded-2xl focus:ring-2 focus:ring-rh-teal/20 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Business phone</label>
                  <input 
                    type="tel" 
                    placeholder="Business phone"
                    className="w-full px-5 py-4 bg-[#eff2f6] border-none rounded-2xl focus:ring-2 focus:ring-rh-teal/20 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Business email</label>
                  <input 
                    type="email" 
                    placeholder="Business email"
                    className="w-full px-5 py-4 bg-[#eff2f6] border-none rounded-2xl focus:ring-2 focus:ring-rh-teal/20 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Company name</label>
                  <input 
                    type="text" 
                    placeholder="Company name"
                    className="w-full px-5 py-4 bg-[#eff2f6] border-none rounded-2xl focus:ring-2 focus:ring-rh-teal/20 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Your job title</label>
                  <input 
                    type="text" 
                    placeholder="Your job title"
                    className="w-full px-5 py-4 bg-[#eff2f6] border-none rounded-2xl focus:ring-2 focus:ring-rh-teal/20 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Position Details */}
            <section>
              <h2 className="text-2xl font-bold text-[#081B2D] mb-8">Your position details</h2>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Job title</label>
                  <input 
                    type="text" 
                    placeholder="Job title"
                    className="w-full px-5 py-4 bg-[#eff2f6] border-none rounded-2xl focus:ring-2 focus:ring-rh-teal/20 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Zip code</label>
                  <input 
                    type="text" 
                    placeholder="Zip code"
                    className="w-full px-5 py-4 bg-[#eff2f6] border-none rounded-2xl focus:ring-2 focus:ring-rh-teal/20 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="md:w-1/2 pr-4">
                <div className="space-y-2 relative">
                  <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Position type</label>
                  <div className="relative">
                    <select className="w-full px-5 py-4 bg-[#eff2f6] border-none rounded-2xl focus:ring-2 focus:ring-rh-teal/20 transition-all text-gray-900 font-medium appearance-none">
                      <option>Select position type</option>
                      <option>Full-time</option>
                      <option>Contract</option>
                      <option>Remote</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-rh-teal pointer-events-none" />
                  </div>
                </div>
              </div>
            </section>

            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <button onClick={goBack} className="text-gray-500 font-bold hover:text-gray-900 flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <Button variant="primary" className="px-12 py-5 text-lg font-bold min-w-[200px]">
                    Continue
                </Button>
            </div>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
