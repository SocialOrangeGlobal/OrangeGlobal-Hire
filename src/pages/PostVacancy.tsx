import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Building2, MapPin, FileText, CheckCircle2,
  ChevronRight, Sparkles, Send, Plus, Trash2
} from 'lucide-react';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import { scaleIn } from '../utils/animations';
import { postVacancyJobCategories, postVacancyWorkMode } from '../data';

type Step = 'basics' | 'details' | 'perks' | 'success';

export default function PostVacancyPage() {
  const [step, setStep] = useState<Step>('basics');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    jobTitle: '',
    category: '',
    location: '',
    type: '',
    mode: '',
    vacancies: '1',
    salaryRange: '',
    description: '',
    requirements: [''],
    benefits: ['']
  });

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const addField = (field: 'requirements' | 'benefits') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeField = (field: 'requirements' | 'benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateListField = (field: 'requirements' | 'benefits', index: number, value: string) => {
    const newList = [...formData[field]];
    newList[index] = value;
    setFormData(prev => ({ ...prev, [field]: newList }));
  };

  const handleNext = () => {
    if (step === 'basics') setStep('details');
    else if (step === 'details') setStep('perks');
  };

  const handleBack = () => {
    if (step === 'details') setStep('basics');
    else if (step === 'perks') setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setStep('success');
  };

  const goHome = () => window.location.hash = '#hire-talent';

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial="hidden" animate="visible" variants={scaleIn}
          className="max-w-xl w-full text-center"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-50 text-green-500 rounded-[24px] sm:rounded-[32px] flex items-center justify-center mx-auto mb-6 sm:mb-10 shadow-inner">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-rh-teal mb-4 sm:mb-6 tracking-tight">Vacancy Posted!</h2>
          <p className="text-gray-500 text-sm sm:text-lg leading-relaxed mb-8 sm:mb-12 px-2">
            Your vacancy for <strong>{formData.jobTitle}</strong> at <strong>{formData.companyName}</strong> has been successfully submitted. Our consultants will review it and get back to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button variant="primary" onClick={() => window.location.hash = '#employer-dashboard'} className="w-full sm:w-auto px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base">Go to Dashboard</Button>
            <Button variant="outline" onClick={() => window.location.hash = '#jobs'} className="w-full sm:w-auto px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border-gray-100 text-sm sm:text-base">View Active Jobs</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 md:pt-32 pb-10 sm:pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <button
              onClick={() => window.location.hash = '#employer-dashboard'}
              className="flex items-center gap-2 text-gray-400 hover:text-rh-red transition-colors mb-4 sm:mb-6 group text-[10px] sm:text-sm font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-rh-teal tracking-tight leading-tight">
              Post a <span className="text-rh-red font-[300]">Vacancy</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {['basics', 'details', 'perks'].map((s, i) => (
              <div key={s} className="flex items-center gap-2 sm:gap-4">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${step === s ? 'bg-rh-red text-white shadow-lg shadow-rh-red/20' :
                  (i < ['basics', 'details', 'perks'].indexOf(step) ? 'bg-rh-teal text-white' : 'bg-white text-gray-300 border border-gray-100')
                  }`}>
                  {i + 1}
                </div>
                {i < 2 && <div className="w-4 sm:w-8 h-[2px] bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[24px] sm:rounded-[32px] md:rounded-[48px] shadow-2xl shadow-gray-200/50 p-6 sm:p-8 md:p-16 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-rh-red/5 blur-3xl -translate-y-16 sm:-translate-y-32 translate-x-16 sm:translate-x-32" />

          <form onSubmit={handleSubmit} className="relative z-10">
            <AnimatePresence mode="wait">
              {step === 'basics' && (
                <motion.div
                  key="basics"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 sm:space-y-10"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-rh-light rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center text-rh-teal shrink-0">
                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-rh-teal">Company & Role</h3>
                      <p className="text-[10px] sm:text-xs md:text-sm text-gray-400">Tell us who you are and what you're looking for</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
                      <input
                        required type="text"
                        value={formData.companyName}
                        onChange={(e) => updateFormData('companyName', e.target.value)}
                        className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-rh-light border border-transparent rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 outline-none transition-all text-xs sm:text-sm font-medium"
                        placeholder="e.g. Orange Global"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Title</label>
                      <input
                        required type="text"
                        value={formData.jobTitle}
                        onChange={(e) => updateFormData('jobTitle', e.target.value)}
                        className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-rh-light border border-transparent rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 outline-none transition-all text-xs sm:text-sm font-medium"
                        placeholder="e.g. Senior Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Category</label>
                      <Dropdown
                        options={postVacancyJobCategories}
                        value={formData.category}
                        onChange={(v) => updateFormData('category', v)}
                        placeholder="Select category"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Location</label>
                      <div className="relative group">
                        <MapPin className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-focus-within:text-rh-red transition-colors" />
                        <input
                          required type="text"
                          value={formData.location}
                          onChange={(e) => updateFormData('location', e.target.value)}
                          className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-rh-light border border-transparent rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 outline-none transition-all text-xs sm:text-sm font-medium"
                          placeholder="e.g. Sydney, Australia"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 sm:space-y-10"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-rh-light rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center text-rh-teal shrink-0">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-rh-teal">Position Details</h3>
                      <p className="text-[10px] sm:text-xs md:text-sm text-gray-400">Describe the role and candidate requirements</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Work Mode</label>
                      <Dropdown
                        options={postVacancyWorkMode}
                        value={formData.mode}
                        onChange={(v) => updateFormData('mode', v)}
                        placeholder="Work mode"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Type</label>
                      <Dropdown
                        options={[
                          { value: 'Full-time', label: 'Full-time' },
                          { value: 'Contract', label: 'Contract' },
                          { value: 'Part-time', label: 'Part-time' }
                        ]}
                        value={formData.type}
                        onChange={(v) => updateFormData('type', v)}
                        placeholder="Job type"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Salary Range</label>
                      <input
                        type="text"
                        value={formData.salaryRange}
                        onChange={(e) => updateFormData('salaryRange', e.target.value)}
                        className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-rh-light border border-transparent rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 outline-none transition-all text-xs sm:text-sm font-medium"
                        placeholder="e.g. $120k - $150k"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">No. of Vacancies</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.vacancies || 1}
                        onChange={(e) => updateFormData('vacancies', e.target.value)}
                        className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-rh-light border border-transparent rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 outline-none transition-all text-xs sm:text-sm font-medium"
                        placeholder="1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Description</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      className="w-full h-32 sm:h-40 px-5 sm:px-6 py-3.5 sm:py-4 bg-rh-light border border-transparent rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 outline-none transition-all text-xs sm:text-sm font-medium resize-none"
                      placeholder="Enter detailed job description..."
                    />
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Key Requirements</label>
                      <button
                        type="button"
                        onClick={() => addField('requirements')}
                        className="text-[9px] sm:text-[10px] font-bold text-rh-red uppercase tracking-widest flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                      >
                        <Plus className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> Add Requirement
                      </button>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {formData.requirements.map((req, i) => (
                        <div key={i} className="flex gap-2 sm:gap-4 group">
                          <input
                            type="text"
                            value={req}
                            onChange={(e) => updateListField('requirements', i, e.target.value)}
                            className="flex-1 px-5 sm:px-6 py-3.5 sm:py-4 bg-rh-light border border-transparent rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 outline-none transition-all text-xs sm:text-sm font-medium"
                            placeholder={`Requirement #${i + 1}`}
                          />
                          {formData.requirements.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeField('requirements', i)}
                              className="p-3 sm:p-4 text-gray-300 hover:text-rh-red transition-colors"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'perks' && (
                <motion.div
                  key="perks"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 sm:space-y-10"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-rh-light rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center text-rh-teal shrink-0">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-rh-teal">Benefits & Perks</h3>
                      <p className="text-[10px] sm:text-xs md:text-sm text-gray-400">What makes your workplace special?</p>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company Benefits</label>
                      <button
                        type="button"
                        onClick={() => addField('benefits')}
                        className="text-[9px] sm:text-[10px] font-bold text-rh-red uppercase tracking-widest flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                      >
                        <Plus className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> Add Benefit
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {formData.benefits.map((benefit, i) => (
                        <div key={i} className="flex gap-2 sm:gap-4 group">
                          <input
                            type="text"
                            value={benefit}
                            onChange={(e) => updateListField('benefits', i, e.target.value)}
                            className="flex-1 px-5 sm:px-6 py-3.5 sm:py-4 bg-rh-light border border-transparent rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 outline-none transition-all text-xs sm:text-sm font-medium"
                            placeholder="e.g. Private Health Insurance"
                          />
                          {formData.benefits.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeField('benefits', i)}
                              className="p-3 sm:p-4 text-gray-300 hover:text-rh-red transition-colors"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-rh-light/50 rounded-[20px] sm:rounded-[32px] p-5 sm:p-10 border border-rh-teal/5">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center text-rh-red shadow-sm shrink-0">
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-rh-teal mb-2">Final Step</h4>
                        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">
                          By submitting this vacancy, you agree to our recruitment terms and conditions. Your posting will be reviewed by our team before going live on the platform.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 sm:mt-16 pt-6 sm:pt-10 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              {step !== 'basics' ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-400 font-bold hover:text-rh-red transition-colors text-xs sm:text-sm"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Previous Step
                </button>
              ) : <div className="hidden sm:block" />}

              <Button
                type={step === 'perks' ? 'submit' : 'button'}
                onClick={step === 'perks' ? undefined : handleNext}
                disabled={isSubmitting}
                variant="primary"
                className="w-full sm:w-auto px-8 sm:px-10 md:px-12 lg:px-16 py-3 sm:py-3.5 md:py-4 lg:py-4.5 rounded-xl sm:rounded-2xl shadow-xl shadow-rh-red/20 flex items-center justify-center gap-2 sm:gap-3 font-bold group text-xs sm:text-sm md:text-base lg:text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    {step === 'perks' ? 'Post Vacancy' : 'Continue'}
                    {step === 'perks' ? <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" /> : <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
