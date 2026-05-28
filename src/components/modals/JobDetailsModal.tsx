import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Briefcase, Globe, Clock, Building2, ChevronRight, Bookmark, Share2, Copy, Check, Twitter, Linkedin, Facebook, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';
import type { Job } from '../../types';

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
  isApplied?: boolean;
}

export default function JobDetailsModal({ job, onClose, isApplied }: JobDetailsModalProps) {
  const navigate = useNavigate();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const navigateToApply = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    navigate(`/apply-job?id=${jobId}`);
  };

  const shareUrl = `${window.location.origin}${window.location.pathname}?id=${job?.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    { name: 'Twitter', icon: Twitter, color: 'hover:bg-black', url: `https://twitter.com/intent/tweet?text=Check out this job: ${job?.title}&url=${encodeURIComponent(shareUrl)}` },
    { name: 'LinkedIn', icon: Linkedin, color: 'hover:bg-[#0077B5]', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
    { name: 'Facebook', icon: Facebook, color: 'hover:bg-[#4267B2]', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
  ];

  return (
    <AnimatePresence>
      {job && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-12 overflow-hidden"
        >
          <div className="absolute inset-0 bg-rh-dark/60 backdrop-blur-md" onClick={onClose} />

          {/* Large Tablet & Desktop Layout: Side-by-side Dual Panel */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative hidden lg:flex w-full max-w-6xl bg-white rounded-[32px] overflow-hidden shadow-2xl h-full lg:h-[88vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 z-[120] w-12 h-12 bg-white rounded-full flex items-center justify-center text-rh-teal hover:bg-rh-red hover:text-white transition-all shadow-xl"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Side Panel */}
            <div className="w-[320px] bg-rh-light flex flex-col shrink-0 border-r border-gray-100 overflow-y-auto no-scrollbar">
              <div className="p-8 pb-0">
                <div className="flex items-center gap-5 mb-12">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-rh-red shrink-0 overflow-hidden">
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={`${job.company} Logo`}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <Building2 className="w-10 h-10" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-rh-teal truncate leading-tight mb-1">{job.company}</h3>
                    <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-medium">
                      <MapPin className="w-3 h-3 text-rh-red" />
                      {job.location}
                    </div>
                    {isApplied && (
                      <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-green-50 border border-green-200/50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm shadow-green-500/5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Applied
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  {[
                    { label: 'Employment', val: job.type, icon: Briefcase },
                    { label: 'Work Mode', val: job.mode, icon: Globe },
                    { label: 'Posted', val: job.postedAt, icon: Clock },
                    { label: 'Salary', val: job.salary, icon: Bookmark, highlight: true }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-5 group">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border transition-all ${item.highlight ? 'bg-rh-red text-white border-rh-red' : 'bg-white text-rh-teal border-gray-50 group-hover:bg-rh-red group-hover:text-white'}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className={`text-[11px] font-bold ${item.highlight ? 'text-rh-red' : 'text-rh-teal'}`}>{item.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto p-8 space-y-4">
                {/* Share Options Panel (Desktop) */}
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-full py-4 rounded-2xl border-gray-200 text-rh-teal hover:bg-gray-50 flex items-center justify-center gap-3 font-bold cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setShowShareOptions(!showShareOptions); }}
                  >
                    <Share2 className="w-4 h-4" />
                    Share this role
                  </Button>

                  <AnimatePresence>
                    {showShareOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-0 right-0 mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-[130]"
                      >
                        <div className="flex items-center justify-between gap-2 mb-4">
                          {shareLinks.map((link) => (
                            <a
                              key={link.name}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex-1 aspect-square rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 transition-all ${link.color} hover:text-white shadow-sm`}
                              title={link.name}
                            >
                              <link.icon className="w-5 h-5" />
                            </a>
                          ))}
                        </div>
                        <button
                          onClick={copyToClipboard}
                          className="w-full py-3 bg-rh-light rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-rh-teal hover:bg-gray-100 transition-colors"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          {copied ? 'Link Copied!' : 'Copy Job Link'}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {isApplied ? (
                  <Button
                    variant="outline"
                    className="w-full py-4 rounded-2xl !border-rh-teal !text-rh-teal hover:!bg-rh-teal/10 flex items-center justify-center gap-3 font-bold cursor-pointer shadow-sm"
                    onClick={(e) => { e.stopPropagation(); navigate('/talent-dashboard'); }}
                  >
                    View Application
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="w-full py-4 rounded-2xl text-sm font-bold shadow-lg shadow-rh-red/20 cursor-pointer"
                    onClick={(e) => navigateToApply(e, job.id)}
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-white p-12 custom-scrollbar">
              <div className="mb-4 border-b border-gray-50 pb-4">
                <h2 className="text-3xl sm:text-4xl font-light text-rh-teal leading-tight tracking-tight mb-6">
                  {job.title}
                </h2>
                <div className="flex flex-wrap gap-3 items-center">
                  {isApplied && (
                    <span className="px-4 py-2 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-green-200/40 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                    </span>
                  )}
                  {job.tags?.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-gray-100">#{tag}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-20 max-w-4xl">
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-1.5 h-6 bg-rh-red rounded-full" />
                    <h4 className="text-lg font-bold text-rh-teal tracking-tight">Role Overview</h4>
                  </div>
                  <div className="text-gray-500 leading-relaxed text-[15px] font-light space-y-4">
                    {job.description?.split('\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1.5 h-6 bg-rh-red rounded-full" />
                    <h4 className="text-lg font-bold text-rh-teal tracking-tight">Key Requirements</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-5">
                    {job.requirements?.map((req, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="w-6 h-6 rounded-lg bg-rh-light flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-rh-red transition-all">
                          <ChevronRight className="w-3.5 h-3.5 text-rh-red group-hover:text-white transition-all" />
                        </div>
                        <span className="text-gray-600 text-[15px] leading-relaxed font-light">{req}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="pb-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-6 bg-rh-red rounded-full" />
                    <h4 className="text-lg font-bold text-rh-teal tracking-tight">Perks & Benefits</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    {job.benefits?.map((benefit, i) => (
                      <div key={i} className="p-5 bg-rh-light rounded-3xl border border-gray-100 flex items-center gap-5 hover:bg-white hover:shadow-xl transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-rh-red group-hover:bg-rh-red group-hover:text-white transition-all shrink-0">
                          <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-[13px] font-bold text-rh-teal">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </motion.div>

          {/* Tablet & Mobile Layout: Single Scroll Layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative flex lg:hidden w-full max-w-2xl max-h-[85vh] bg-white rounded-[32px] overflow-hidden flex-col shadow-2xl"
          >
            {/* Header (Fixed) */}
            <div className="px-6 md:px-10 py-5 md:py-8 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white z-10">
              <div className="flex items-center gap-3 md:gap-5">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-rh-light rounded-xl md:rounded-2xl flex items-center justify-center text-rh-red overflow-hidden border border-gray-100">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={`${job.company} Logo`}
                      className="h-full w-full object-contain p-1.5 md:p-2.5 bg-white"
                    />
                  ) : (
                    <Building2 className="w-5 h-5 md:w-8 md:h-8" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm md:text-xl font-bold text-rh-teal truncate leading-tight">{job.company}</h3>
                  <p className="text-[10px] md:text-sm text-gray-400 truncate mt-0.5">{job.location}</p>
                  {isApplied && (
                    <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 bg-green-50 border border-green-200/50 text-green-600 rounded-full text-[9px] font-bold uppercase tracking-wider w-max shadow-sm shadow-green-500/5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Applied
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-rh-teal hover:bg-gray-100 transition-colors"
                  onClick={(e) => { e.stopPropagation(); setShowShareOptions(!showShareOptions); }}
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-full flex items-center justify-center text-rh-teal hover:bg-rh-red hover:text-white transition-all"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>

            {/* Mobile Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar custom-scrollbar bg-white">
              <AnimatePresence>
                {showShareOptions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8 overflow-hidden"
                  >
                    <div className="bg-rh-light rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Share this role</h4>
                        <button onClick={() => setShowShareOptions(false)} className="text-gray-400 hover:text-rh-red"><X className="w-4 h-4" /></button>
                      </div>
                      <div className="flex gap-3 mb-4">
                        {shareLinks.map((link) => (
                          <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex-1 py-3 rounded-xl bg-white flex items-center justify-center text-gray-400 transition-all ${link.color} hover:text-white shadow-sm border border-gray-100`}
                          >
                            <link.icon className="w-5 h-5" />
                          </a>
                        ))}
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className="w-full py-3.5 bg-white border border-gray-100 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-rh-teal"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Link Copied!' : 'Copy Job Link'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mb-8 md:mb-12">
                <div className="flex flex-wrap gap-2 mb-4 items-center">
                  <span className="px-2.5 py-1 bg-rh-teal/5 text-rh-teal text-[9px] md:text-xs font-bold rounded-lg uppercase tracking-wider">{job.category}</span>
                  <span className="px-2.5 py-1 bg-rh-red/5 text-rh-red text-[9px] md:text-xs font-bold rounded-lg uppercase tracking-wider">{job.mode}</span>
                  {isApplied && (
                    <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[9px] md:text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1 border border-green-200/50">
                      <CheckCircle2 className="w-3 h-3" /> Applied
                    </span>
                  )}
                </div>
                <h2 className="text-xl md:text-3xl font-bold text-rh-teal mb-8 md:mb-10 leading-tight">{job.title}</h2>

                <div className="grid grid-cols-2 gap-3 md:gap-6 mb-10 md:mb-16">
                  {[
                    { label: 'Employment', val: job.type },
                    { label: 'Salary', val: job.salary, highlight: true },
                    { label: 'Work Mode', val: job.mode },
                    { label: 'Posted', val: job.postedAt }
                  ].map((item, idx) => (
                    <div key={idx} className={`p-4 md:p-6 rounded-2xl border transition-all ${item.highlight ? 'bg-rh-red/5 border-rh-red/10' : 'bg-rh-light/50 border-gray-50'}`}>
                      <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{item.label}</p>
                      <p className={`text-[11px] md:text-[14px] font-bold ${item.highlight ? 'text-rh-red' : 'text-rh-teal'}`}>{item.val}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-12 md:space-y-16">
                  <section>
                    <h4 className="text-sm md:text-lg font-bold text-rh-teal mb-4 md:mb-6 flex items-center gap-2.5">
                      <div className="w-1 h-5 bg-rh-red rounded-full" /> Role Overview
                    </h4>
                    <div className="text-gray-500 text-[13px] md:text-[15px] leading-relaxed font-light space-y-4">
                      {job.description?.split('\n').map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-sm md:text-lg font-bold text-rh-teal mb-5 md:mb-8 flex items-center gap-2.5">
                      <div className="w-1 h-5 bg-rh-red rounded-full" /> Key Requirements
                    </h4>
                    <div className="space-y-4 md:space-y-5">
                      {job.requirements?.map((req, i) => (
                        <div key={i} className="flex gap-4 group">
                          <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-rh-light flex items-center justify-center shrink-0 mt-0.5">
                            <ChevronRight className="w-3 h-3 text-rh-red" />
                          </div>
                          <span className="text-gray-600 text-[13px] md:text-[15px] leading-relaxed font-light">{req}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="pb-10">
                    <h4 className="text-sm md:text-lg font-bold text-rh-teal mb-6 md:mb-10 flex items-center gap-2.5">
                      <div className="w-1 h-5 bg-rh-red rounded-full" /> Perks & Benefits
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {job.benefits?.map((benefit, i) => (
                        <div key={i} className="p-5 bg-rh-light/50 rounded-2xl border border-gray-100 flex items-center gap-4 hover:bg-white hover:shadow-lg transition-all group">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-rh-red shrink-0">
                            <Clock className="w-4 h-4 md:w-5 md:h-5" />
                          </div>
                          <span className="text-[12px] md:text-[14px] font-bold text-rh-teal">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>

            {/* Mobile Footer (Fixed) */}
            <div className="p-6 md:p-10 border-t border-gray-100 bg-white shrink-0">
              {isApplied ? (
                <Button
                  variant="outline"
                  className="w-full py-4 rounded-xl !border-rh-teal !text-rh-teal hover:!bg-rh-teal/10 flex items-center justify-center gap-2 font-bold cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); navigate('/talent-dashboard'); }}
                >
                  View Application
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="w-full py-4 md:py-6 rounded-2xl text-sm md:text-base font-bold shadow-lg shadow-rh-red/20"
                  onClick={(e) => navigateToApply(e, job.id)}
                >
                  Apply for this job
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
