import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, User, Building, Scale, Lock, Eye, FileText, CheckCircle2, Download, Trash2 } from 'lucide-react';
import { fadeUp } from '../utils/animations';

export default function PrivacyPolicyPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'candidates' | 'employers' | 'rights'>('general');

  const tabs = [
    { id: 'general', label: 'General Policy', icon: Shield, desc: 'Core principles of how we handle data' },
    { id: 'candidates', label: 'Candidate Data', icon: User, desc: 'CVs, applications, and job matching' },
    { id: 'employers', label: 'Employer Info', icon: Building, desc: 'Corporate details and verification' },
    { id: 'rights', label: 'Your Rights & GDPR', icon: Scale, desc: 'Access, deletion, and regulations' },
  ] as const;

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Printable Area - Hidden on screen, designed to fit exactly on one page */}
      <div className="hidden print:block bg-white text-slate-900 p-8 max-w-4xl mx-auto space-y-6 text-xs leading-relaxed">
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            @page {
              size: portrait;
              margin: 15mm;
            }
            html, body {
              height: 100%;
              overflow: hidden;
              background: #fff !important;
            }
            body * {
              visibility: hidden;
            }
            .print-only-content, .print-only-content * {
              visibility: visible;
            }
            .print-only-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}} />
        <div className="print-only-content space-y-6">
        {/* Letterhead */}
        <div className="flex justify-between items-center border-b pb-4 border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Orange Global</h1>
            <p className="text-[10px] text-slate-500">Staffing, Recruitment & Talent Solutions</p>
          </div>
          <div className="text-right text-[10px] text-slate-400">
            <p>dpo@orangeglobal.in</p>
            <p>www.orangeglobal.in</p>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-800">PRIVACY POLICY STATEMENT</h2>
          <p className="text-[9px] text-slate-500">Effective Date: June 02, 2026 • Policy Version 3.0 (GDPR & APP Compliant)</p>
        </div>

        <p className="text-slate-600">
          At Orange Global, your privacy and data security are our highest priorities. This statement summarizes how we collect, use, and protect personal and professional information across our websites and talent portals.
        </p>

        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">1. Collection & Usage</h3>
            <p className="text-slate-500">
              We collect credentials, resumes, and contact info solely to match candidates with active job opportunities and verify business clients. We do not sell user data to advertising networks.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">2. Security & Retention</h3>
            <p className="text-slate-500">
              Your details are protected using AES-256 encryption at rest and HTTPS protocols in transit. Personal data is retained only as long as necessary to provide active recruitment services.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm">3. Your Rights & Access</h3>
          <p className="text-slate-500">
            Under GDPR and Australian Privacy Principles (APPs), you have the right to request a full transcript of your data or demand complete erasure of your profile. For any access or deletion requests, please contact our Data Protection Officer at <span className="font-semibold text-slate-800">privacy@orangeglobal.in</span>.
          </p>
        </div>

        {/* Footer info */}
        <div className="border-t pt-4 text-center text-[9px] text-slate-400">
          <p>© 2026 Orange Global. This official statement is generated for offline record-keeping. All rights reserved.</p>
        </div>
        </div>
      </div>

      {/* Main Screen Layout (Unchanged structure, beautiful screen view) */}
      <div className="print:hidden">
        {/* Premium Hero */}
        <section className="pt-32 pb-24 md:pt-48 md:pb-36 relative overflow-hidden bg-[#0A0D10] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(239,68,68,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/6050434/pexels-photo-6050434.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10" />
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
            <div className="max-w-3xl">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="space-y-6"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight leading-[1.1] tracking-tight text-white">
                  Privacy <span className="text-rh-red">Policy</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl">
                  We believe in complete transparency. Explore our structured privacy policies to understand exactly how your information is collected, processed, and protected.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Interactive Tabs Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Left Column: Interactive Nav Cards */}
              <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-32">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Navigating the Policy</h3>
                  <div className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${isActive
                            ? 'bg-rh-teal text-white border-rh-teal shadow-lg shadow-rh-teal/10'
                            : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-slate-50'
                            }`}
                        >
                          <div className={`p-2.5 rounded-xl shrink-0 ${isActive ? 'bg-white/10 text-white' : 'bg-slate-50 text-rh-teal'
                            }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm leading-tight">{tab.label}</p>
                            <p className={`text-[11px] mt-1 ${isActive ? 'text-white/70' : 'text-gray-400'}`}>{tab.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PDF Download Action Card */}
                <div className="bg-rh-teal text-white rounded-3xl p-6 border border-white/5 shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-32 h-32 bg-rh-red/10 rounded-full blur-2xl -mr-10 -mb-10" />
                  <div className="relative z-10 space-y-4">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-rh-red">Offline Access</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Need a physical copy for legal or compliance records? Download the complete policy document as a PDF.
                    </p>
                    <button
                      onClick={handleDownloadPDF}
                      className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> Download PDF Policy
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Tab Content */}
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm space-y-8"
                  >
                    {activeTab === 'general' && (
                      <div className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                          <div>
                            <h2 className="text-2xl font-bold text-rh-teal">General Privacy Overview</h2>
                            <p className="text-xs text-gray-400 mt-1">Applicable to all users visiting our site or platform.</p>
                          </div>
                          <span className="self-start md:self-auto px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">Active</span>
                        </div>

                        <div className="space-y-6 leading-relaxed font-light text-gray-600 text-sm md:text-base">
                          <p>
                            Orange Global provides a unified platform connecting global professionals with hiring companies. This policy details how we treat information collected across all platforms, websites, and recruitment channels.
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-gray-100 space-y-3">
                              <div className="w-10 h-10 rounded-xl bg-rh-teal/5 flex items-center justify-center text-rh-teal">
                                <Eye className="w-5 h-5" />
                              </div>
                              <h4 className="font-bold text-sm text-rh-teal">What We Track</h4>
                              <p className="text-xs text-gray-500 leading-relaxed">
                                IP addresses, browser details, device type, referral links, and standard cookies to ensure optimization and secure sessions.
                              </p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-2xl border border-gray-100 space-y-3">
                              <div className="w-10 h-10 rounded-xl bg-rh-teal/5 flex items-center justify-center text-rh-teal">
                                <Lock className="w-5 h-5" />
                              </div>
                              <h4 className="font-bold text-sm text-rh-teal">Data Encryption</h4>
                              <p className="text-xs text-gray-500 leading-relaxed">
                                All standard data transfers utilize HTTPS protocols and sensitive data sets are encrypted at rest using AES-256 standard.
                              </p>
                            </div>
                          </div>

                          <h3 className="text-lg font-bold text-rh-teal mt-8">Core Principles</h3>
                          <ul className="space-y-4">
                            {[
                              'We do not sell user data to third-party advertisers or brokers.',
                              'Data is retained only as long as necessary to provide staffing and application actions.',
                              'You maintain full command over your marketing subscription and communication preferences.'
                            ].map((item, idx) => (
                              <li key={idx} className="flex gap-3 items-start">
                                <CheckCircle2 className="w-4 h-4 text-rh-red mt-0.5 shrink-0" />
                                <span className="text-xs md:text-sm text-gray-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeTab === 'candidates' && (
                      <div className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                          <div>
                            <h2 className="text-2xl font-bold text-rh-teal">Candidate & Applicant Privacy</h2>
                            <p className="text-xs text-gray-400 mt-1">Specific guidelines for resumes, profiles, and applications.</p>
                          </div>
                          <span className="self-start md:self-auto px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">Candidates Only</span>
                        </div>

                        <div className="space-y-6 leading-relaxed font-light text-gray-600 text-sm md:text-base">
                          <p>
                            When registering as a talent candidate or using the "Easy Apply" feature, we process detailed information to evaluate your qualifications and match you with prospective employers.
                          </p>

                          <div className="p-6 bg-slate-50 border border-gray-100 rounded-2xl space-y-4">
                            <h4 className="font-bold text-sm text-rh-teal">Professional Data Collected:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {[
                                'Full Name & contact numbers',
                                'CV/Resume documents',
                                'Work experience history',
                                'Accredited certifications',
                                'Salary expectations',
                                'Visa status & residency details'
                              ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                  <span className="w-1.5 h-1.5 bg-rh-teal rounded-full" />
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>

                          <h3 className="text-lg font-bold text-rh-teal">Information Sharing Rules</h3>
                          <p className="text-xs md:text-sm">
                            Your profile details and CV are only shared with registered employers when you explicitly apply for a job posting. We do not expose candidate contact lists to public searches or search engines.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'employers' && (
                      <div className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                          <div>
                            <h2 className="text-2xl font-bold text-rh-teal">Employer & Partner Data</h2>
                            <p className="text-xs text-gray-400 mt-1">Guidelines for corporate clients and recruitment users.</p>
                          </div>
                          <span className="self-start md:self-auto px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold">Employers Only</span>
                        </div>

                        <div className="space-y-6 leading-relaxed font-light text-gray-600 text-sm md:text-base">
                          <p>
                            For organizations posting jobs or searching for candidates, we collect operational data necessary to verify the business entity and manage subscription agreements.
                          </p>

                          <div className="space-y-4">
                            <h4 className="font-bold text-sm text-rh-teal">We collect:</h4>
                            <div className="space-y-3">
                              {[
                                'Registered business name, tax registration codes, and address.',
                                'Corporate email addresses and contact information of company representatives.',
                                'Payment history logs (actual card details are processed securely by our certified billing providers).',
                                'IP addresses used during administrative console activities.'
                              ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                  <span className="w-5 h-5 rounded bg-orange-50 flex items-center justify-center text-rh-red font-bold text-xs shrink-0">{idx + 1}</span>
                                  <span className="text-xs md:text-sm text-gray-600">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'rights' && (
                      <div className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                          <div>
                            <h2 className="text-2xl font-bold text-rh-teal">Your Rights (GDPR & APPs)</h2>
                            <p className="text-xs text-gray-400 mt-1">Actions you can take regarding your stored information.</p>
                          </div>
                          <span className="self-start md:self-auto px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold">Global Compliance</span>
                        </div>

                        <div className="space-y-6 leading-relaxed font-light text-gray-600 text-sm md:text-base">
                          <p>
                            Under the European Union General Data Protection Regulation (GDPR) and the Australian Privacy Principles (APPs), you have statutory rights that we extend to all global users.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 border border-gray-100 rounded-2xl hover:border-rh-teal/20 transition-all flex gap-4">
                              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-rh-teal">Access and Portability</h4>
                                <p className="text-xs text-gray-500 mt-1">Request a full export of all personal files, resumes, and data we hold.</p>
                              </div>
                            </div>

                            <div className="p-5 border border-gray-100 rounded-2xl hover:border-rh-teal/20 transition-all flex gap-4">
                              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-rh-red shrink-0">
                                <Trash2 className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-rh-teal">Erasure (Right to be Forgotten)</h4>
                                <p className="text-xs text-gray-500 mt-1">Request immediate deletion of your candidate or employer profile.</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 space-y-3">
                            <h4 className="font-bold text-sm text-rh-teal">How to initiate a request:</h4>
                            <p className="text-xs leading-relaxed">
                              To exercise any rights, contact our Data Protection Officer at{' '}
                              <span className="text-rh-red font-bold">privacy@orangeglobal.in</span>. We will respond to and address verified requests within 30 calendar days.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
