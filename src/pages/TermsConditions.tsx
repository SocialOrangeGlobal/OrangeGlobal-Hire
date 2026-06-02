import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gavel, Scale, ShieldCheck, HeartHandshake, CheckSquare, Square, FileText, CheckCircle } from 'lucide-react';
import { fadeUp } from '../utils/animations';

export default function TermsConditionsPage() {
  const [agreedItems, setAgreedItems] = useState<Record<number, boolean>>({});

  const toggleItem = (idx: number) => {
    setAgreedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const sections = [
    {
      num: '01',
      icon: Scale,
      title: 'Agreement to Terms',
      desc: 'By accessing or using our websites, platform, or services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you are prohibited from using the platform.',
      points: [
        'You must be at least 18 years old to register an account or apply for roles.',
        'You agree to use our platform solely for legitimate job search or hiring activities.',
        'You are fully responsible for maintaining account confidentiality and password security.',
        'Any fraudulent, abusive, or illegal behavior is grounds for immediate termination of your access.'
      ]
    },
    {
      num: '02',
      icon: Gavel,
      title: 'Intellectual Property Rights',
      desc: 'Unless otherwise indicated, the platform is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the platform are owned or controlled by us.',
      points: [
        'Content is provided on the platform "AS IS" for your information and personal use only.',
        'No part of the platform may be copied, reproduced, aggregated, republished, uploaded, or distributed.',
        'We reserve all rights not expressly granted to you in and to the platform and Content.',
        'Any unauthorized scraping, data-mining, or mirroring of vacancy listings is strictly prohibited.'
      ]
    },
    {
      num: '03',
      icon: ShieldCheck,
      title: 'User Representations & Profiles',
      desc: 'By registering or creating a candidate profile, you represent and warrant that all registration information you submit will be true, accurate, current, and complete.',
      points: [
        'You will maintain the accuracy of such information and promptly update registration data.',
        'You have the legal capacity and agree to comply with these Terms and Conditions.',
        'You will not provide misleading qualifications, education history, or professional credentials.',
        'We reserve the right to suspend or terminate accounts that contain false or outdated records.'
      ]
    },
    {
      num: '04',
      icon: HeartHandshake,
      title: 'Limitation of Liability',
      desc: 'In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages arising from your use of the platform.',
      points: [
        'We do not guarantee that job postings will lead to immediate employment or visa success.',
        'We are not responsible for independent hiring agreements made between candidates and employers.',
        'We strive for 100% platform uptime, but make no guarantees of continuous service availability.',
        'Our liability is limited to the maximum extent permitted by applicable local laws.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Visual Hero */}
      <section className="pt-32 pb-24 md:pt-48 md:pb-36 relative overflow-hidden bg-[#0A0D10] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(239,68,68,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/6050434/pexels-photo-6050434.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-4xl text-center lg:text-left">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white leading-[1.1] tracking-tight mb-8">
                Terms & <span className="text-rh-red font-[300]">Conditions</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Please review our terms carefully. These rules govern your use of the Orange Global talent board, employer dashboard, and migration calculation tools.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Single-Column Document Layout with floating acceptance sidebar */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Left: Document Flow */}
            <div className="lg:col-span-8 space-y-8">
              {sections.map((sec, index) => {
                const Icon = sec.icon;
                return (
                  <motion.div
                    key={sec.num}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    variants={fadeUp}
                    className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm relative overflow-hidden group"
                  >
                    {/* Big Decorative Section Number */}
                    <div className="absolute right-8 top-6 text-7xl md:text-8xl font-black text-slate-50 select-none pointer-events-none group-hover:text-slate-100 transition-colors">
                      {sec.num}
                    </div>

                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-rh-teal/5 flex items-center justify-center text-rh-teal">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-rh-teal">{sec.title}</h3>
                      </div>

                      <p className="text-gray-500 text-sm md:text-base leading-relaxed font-light">
                        {sec.desc}
                      </p>

                      <div className="border-t border-gray-100 pt-6 space-y-4">
                        {sec.points.map((point, pIdx) => (
                          <div key={pIdx} className="flex gap-4 items-start text-xs md:text-sm text-gray-600 font-light">
                            <div className="w-5 h-5 rounded-full bg-slate-50 border border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 mt-0.5 shrink-0">
                              {pIdx + 1}
                            </div>
                            <span className="leading-relaxed">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right: Interactive Reading Completion Checklist */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Section Checklist</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-light">
                  Acknowledge that you have read and understood each section to complete the legal review.
                </p>

                <div className="space-y-3">
                  {sections.map((sec, idx) => {
                    const isAgreed = !!agreedItems[idx];
                    return (
                      <button
                        key={sec.num}
                        onClick={() => toggleItem(idx)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${isAgreed
                          ? 'bg-green-50/50 border-green-200 text-green-800'
                          : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'
                          }`}
                      >
                        {isAgreed ? (
                          <CheckSquare className="w-5 h-5 text-green-600 shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold">{sec.title}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-xs font-bold text-rh-teal uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    General Liability Checked
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section >
    </div >
  );
}
