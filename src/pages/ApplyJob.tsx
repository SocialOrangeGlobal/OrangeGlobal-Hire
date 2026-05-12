import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Upload, CheckCircle2, User, Mail, Phone,
  FileText, Send, Building2, MapPin, Briefcase, Globe, Clock,
  Linkedin, Award, ShieldCheck, ChevronRight
} from 'lucide-react';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import { fadeUp, scaleIn } from '../utils/animations';
import { jobs } from '../data';
import type { Job } from '../types';

export default function ApplyJobPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedin: '',
    experience: '',
    resume: null as File | null,
    message: ''
  });

  useEffect(() => {
    // Get job ID from URL hash params
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const jobId = params.get('id');
    if (jobId) {
      const job = jobs.find(j => j.id === jobId);
      if (job) setSelectedJob(job);
    }
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const goBack = () => {
    window.location.hash = '#jobs';
  };

  if (!selectedJob && !isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rh-light p-10">
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-rh-red mx-auto mb-8">
            <Briefcase className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-rh-teal mb-4">Job Not Found</h2>
          <p className="text-gray-500 mb-8">The position you are looking for is no longer available or the link is invalid.</p>
          <Button variant="primary" onClick={goBack}>Back to Jobs</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Header */}
      <section className="bg-rh-dark pt-24 md:pt-32 pb-16 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest transition-colors group-hover:text-white">Back to Job Listing</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-rh-red text-white text-[10px] font-bold uppercase tracking-widest rounded-md">New Opening</span>
                <span className="text-white/40 text-sm font-medium">#{selectedJob?.id}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight">
                Apply for <span className="text-rh-red font-[300]">{selectedJob?.title}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-6 md:mt-8 text-white/60">
                <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-rh-red" /> <span className="text-xs md:text-sm font-medium">{selectedJob?.company}</span></div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-rh-red" /> <span className="text-xs md:text-sm font-medium">{selectedJob?.location}</span></div>
                <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-rh-red" /> <span className="text-xs md:text-sm font-medium">{selectedJob?.category}</span></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="py-12 md:py-20 bg-rh-light relative -mt-6 md:-mt-10 rounded-t-[32px] md:rounded-t-[60px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* Left Form */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-[32px] md:rounded-[48px] p-6 md:p-16 shadow-2xl shadow-gray-200/50">
                {isSubmitted ? (
                  <motion.div
                    initial="hidden" animate="visible" variants={scaleIn}
                    className="text-center py-20"
                  >
                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12" />
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold text-rh-teal mb-4 tracking-tight">Application Sent!</h2>
                    <p className="text-gray-500 max-w-md mx-auto leading-relaxed mb-10">
                      Great news! Your application for the <strong>{selectedJob?.title}</strong> role has been successfully transmitted to the hiring team at {selectedJob?.company}.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Button variant="primary" onClick={goBack} className="w-full sm:w-auto px-10 py-4 rounded-xl">View More Jobs</Button>
                      <Button variant="outline" onClick={() => window.location.hash = ''} className="w-full sm:w-auto px-10 py-4 rounded-xl border-gray-200">Return Home</Button>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-8 md:mb-12">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-rh-light rounded-xl md:rounded-2xl flex items-center justify-center text-rh-teal">
                        <User className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg md:text-2xl font-bold text-rh-teal">Personal Information</h3>
                        <p className="text-gray-400 text-[10px] md:text-sm">Please provide your contact details</p>
                      </div>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">First Name</label>
                          <input
                            required type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full bg-rh-light border-2 border-transparent focus:border-rh-red/20 focus:bg-white rounded-xl md:rounded-2xl py-3.5 md:py-5 px-6 md:px-8 outline-none transition-all text-[13px] md:text-sm font-medium"
                            placeholder="e.g. Alexander"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Last Name</label>
                          <input
                            required type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full bg-rh-light border-2 border-transparent focus:border-rh-red/20 focus:bg-white rounded-xl md:rounded-2xl py-3.5 md:py-5 px-6 md:px-8 outline-none transition-all text-[13px] md:text-sm font-medium"
                            placeholder="e.g. Knight"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                          <div className="relative group">
                            <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-rh-red transition-colors" />
                            <input
                              required type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full bg-rh-light border-2 border-transparent focus:border-rh-red/20 focus:bg-white rounded-xl md:rounded-2xl py-3.5 md:py-5 px-6 md:px-8 outline-none transition-all text-[13px] md:text-sm font-medium"
                              placeholder="alex@example.com"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
                          <div className="relative group">
                            <Phone className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-rh-red transition-colors" />
                            <input
                              required type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full bg-rh-light border-2 border-transparent focus:border-rh-red/20 focus:bg-white rounded-xl md:rounded-2xl py-3.5 md:py-5 px-6 md:px-8 outline-none transition-all text-[13px] md:text-sm font-medium"
                              placeholder="+1 (000) 000-0000"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-10 pt-4">
                        <div className="flex items-center gap-4 mb-8 md:mb-12">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-rh-light rounded-xl md:rounded-2xl flex items-center justify-center text-rh-teal">
                            <FileText className="w-5 h-5 md:w-6 md:h-6" />
                          </div>
                          <div>
                            <h3 className="text-lg md:text-2xl font-bold text-rh-teal">Professional Assets</h3>
                            <p className="text-gray-400 text-[10px] md:text-sm">Upload your CV and supporting links</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">LinkedIn Profile</label>
                            <div className="relative group">
                              <Linkedin className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-rh-red transition-colors" />
                              <input
                                type="url"
                                value={formData.linkedin}
                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                className="w-full bg-rh-light border-2 border-transparent focus:border-rh-red/20 focus:bg-white rounded-xl md:rounded-2xl py-3.5 md:py-5 px-6 md:px-8 outline-none transition-all text-[13px] md:text-sm font-medium"
                                placeholder="linkedin.com/in/username"
                              />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Experience Level</label>
                            <Dropdown
                              options={[
                                { value: 'entry', label: 'Entry Level (0-2 years)' },
                                { value: 'mid', label: 'Mid Level (3-5 years)' },
                                { value: 'senior', label: 'Senior Level (6+ years)' },
                                { value: 'lead', label: 'Director / Executive' }
                              ]}
                              value={formData.experience}
                              onChange={(val) => setFormData({ ...formData, experience: val })}
                              placeholder="Select level..."
                              className="w-full"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Resume / CV</label>
                          <div className="relative">
                            <input
                              required
                              type="file"
                              id="apply-resume-upload"
                              className="hidden"
                              onChange={(e) => setFormData({ ...formData, resume: e.target.files?.[0] || null })}
                            />
                            <label
                              htmlFor="apply-resume-upload"
                              className="w-full flex items-center justify-between bg-rh-light border-2 border-dashed border-gray-200 hover:border-rh-red/40 hover:bg-rh-red/[0.02] rounded-2xl md:rounded-3xl p-6 md:p-8 cursor-pointer transition-all group"
                            >
                              <div className="flex items-center gap-4 md:gap-6">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-rh-red shadow-sm transition-all group-hover:scale-110">
                                  <Upload className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <div>
                                  <p className="text-sm md:text-base font-bold text-rh-teal">
                                    {formData.resume ? formData.resume.name : 'Click or Drag Resume here'}
                                  </p>
                                  <p className="text-[10px] md:text-xs text-gray-400">PDF, DOCX or RTF (Max 10MB)</p>
                                </div>
                              </div>
                              <div className="hidden md:block">
                                <Button variant="outline" className="pointer-events-none text-xs rounded-xl">Browse Files</Button>
                              </div>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Cover Note</label>
                          <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full bg-rh-light border-2 border-transparent focus:border-rh-red/20 focus:bg-white rounded-3xl py-6 px-8 outline-none transition-all text-sm font-medium h-48 resize-none"
                            placeholder="Why are you the perfect fit for this role?"
                          />
                        </div>
                      </div>

                      <div className="pt-2 md:pt-6">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          variant="primary"
                          className="w-full py-4 md:py-6 rounded-xl md:rounded-2xl shadow-xl shadow-rh-red/30 flex items-center justify-center gap-4 text-sm md:text-lg font-bold group"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Finalizing...
                            </>
                          ) : (
                            <>
                              Submit Application <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                          )}
                        </Button>
                        <p className="text-center text-gray-400 text-xs mt-6">
                          By clicking submit, you agree to our <a href="#" className="text-rh-red hover:underline">Privacy Policy</a> and <a href="#" className="text-rh-red hover:underline">Terms of Service</a>.
                        </p>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-6 md:space-y-8">
              {/* Job Summary Card */}
              <div className="bg-rh-teal rounded-[32px] md:rounded-[40px] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rh-red opacity-10 rounded-full blur-3xl -translate-y-16 translate-x-16" />

                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Position Summary</h4>
                <div className="space-y-8">
                  {[
                    { label: 'Work Mode', val: selectedJob?.mode, icon: Globe },
                    { label: 'Location', val: selectedJob?.location, icon: MapPin },
                    { label: 'Package', val: selectedJob?.salary, icon: Award },
                    { label: 'Deadline', val: 'Ongoing', icon: Clock }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-sm font-bold">{item.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Card */}
              <div className="bg-white rounded-[32px] md:rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-rh-teal">Why Orange Global?</h4>
                </div>
                <ul className="space-y-6">
                  {[
                    'Direct access to top-tier hiring managers',
                    'Transparent and fast feedback loop',
                    'Dedicated support during the interview process',
                    'Access to exclusive market leadership insights'
                  ].map((text, i) => (
                    <li key={i} className="flex gap-4 group">
                      <ChevronRight className="w-4 h-4 text-rh-red shrink-0 mt-1 transition-transform group-hover:translate-x-1" />
                      <span className="text-sm text-gray-500 leading-relaxed">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support Card */}
              <div className="p-8 md:p-10 bg-rh-light rounded-[32px] md:rounded-[40px] border border-gray-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-rh-teal mb-6">
                  <Mail className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-rh-teal mb-2">Need Assistance?</h4>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">Our recruitment consultants are here to help you through every step.</p>
                <a href="#" className="text-rh-red font-bold text-sm hover:underline">Contact Support</a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
