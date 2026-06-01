import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, User, Mail, Phone, MapPin, GraduationCap, Briefcase, Languages, CheckSquare, FileText, Upload, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../../components/seo/SEO';

const STEPS = [
  { id: 'personal', title: 'Personal Details', icon: User },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'experience', title: 'Work Experience', icon: Briefcase },
  { id: 'english', title: 'English & Skills', icon: Languages },
  { id: 'australia', title: 'AU Connection', icon: CheckSquare },
  { id: 'review', title: 'Review & Submit', icon: FileText },
];

const QUALIFICATIONS = [
  'Doctorate Degree (PhD)',
  'Master Degree',
  'Bachelor Degree',
  'Advanced Diploma / Associate Degree',
  'Diploma / Trade Qualification',
  'Secondary School (High School)',
  'Other',
];

const ENGLISH_TESTS = ['PTE Academic', 'IELTS Academic', 'IELTS General', 'TOEFL iBT', 'OET', 'None / Not Yet Taken'];

const nationalList = [
  "Afghan", "Albanian", "Algerian", "American", "Australian", "Austrian", "Bangladeshi", "Belgian", 
  "Brazilian", "British", "Canadian", "Chinese", "Dutch", "Egyptian", "Fijian", "Filipino", 
  "French", "German", "Greek", "Indian", "Indonesian", "Irish", "Italian", "Japanese", 
  "Malaysian", "Nepalese", "New Zealander", "Pakistani", "Singaporean", "South African", 
  "South Korean", "Spanish", "Sri Lankan", "Swiss", "Thai", "Turkish", "Ukrainian", "Vietnamese"
];

export default function ProfileEvaluationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    nationality: '',
    currentCountry: '',
    
    // Education
    highestQual: '',
    fieldOfStudy: '',
    institution: '',
    yearCompleted: '',
    
    // Work Experience
    occupation: '',
    yearsExp: '',
    currentEmployer: '',
    industry: '',
    
    // English & Skills
    englishTest: '',
    listeningScore: '',
    readingScore: '',
    writingScore: '',
    speakingScore: '',
    skillsAssessed: 'No',
    assessmentBody: '',
    assessmentOutcome: '',
    
    // Australian Connection
    studiedInAu: 'No',
    workedInAu: 'No',
    stateNominationInterest: 'No',
    preferredState: '',
    
    // Additional Details
    additionalInfo: '',
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const nextStep = () => {
    // Validate current step
    if (currentStep === 0) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.dob) {
        toast.error('Please fill in all required fields');
        return;
      }
    }
    if (currentStep === 1) {
      if (!formData.highestQual || !formData.fieldOfStudy) {
        toast.error('Please complete highest qualification and field of study');
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.occupation || !formData.yearsExp) {
        toast.error('Please fill in occupation and years of experience');
        return;
      }
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Your Profile Evaluation Form has been submitted successfully! One of our MARA registered agents will evaluate your profile and contact you within 24-48 business hours.');
      // Reset
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        dob: '',
        nationality: '',
        currentCountry: '',
        highestQual: '',
        fieldOfStudy: '',
        institution: '',
        yearCompleted: '',
        occupation: '',
        yearsExp: '',
        currentEmployer: '',
        industry: '',
        englishTest: '',
        listeningScore: '',
        readingScore: '',
        writingScore: '',
        speakingScore: '',
        skillsAssessed: 'No',
        assessmentBody: '',
        assessmentOutcome: '',
        studiedInAu: 'No',
        workedInAu: 'No',
        stateNominationInterest: 'No',
        preferredState: '',
        additionalInfo: '',
      });
      setUploadedFile(null);
      setCurrentStep(0);
    }, 2000);
  };

  const ActiveIcon = STEPS[currentStep].icon;

  return (
    <>
      <SEO
        title="Skilled Migration Profile Evaluation | Orange Global Migration"
        description="Get your skilled visa eligibility assessed by our Registered Migration Agents. Complete our premium multi-step assessment form."
      />

      <main className="pt-24 pb-20 lg:pt-32 bg-gray-50/50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-10 space-y-4">
            <span className="inline-block px-3 py-1.5 rounded-lg bg-rh-teal/10 text-rh-teal text-xs font-bold uppercase tracking-widest">
              Evaluation & Assessment
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-rh-teal tracking-tight leading-tight">
              Skilled Migration Profile Evaluation
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-base">
              Orange Global provides a comprehensive, step-by-step visa evaluation. Submit your detailed profile information below, and receive a professional review from our registered immigration team.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 mb-8 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[640px] px-4">
              {STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;

                return (
                  <div key={step.id} className="flex items-center flex-1 last:flex-initial">
                    <button
                      onClick={() => {
                        if (idx < currentStep) setCurrentStep(idx);
                      }}
                      className="flex flex-col items-center gap-2 group focus:outline-none"
                      disabled={idx > currentStep}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-rh-red text-white shadow-md shadow-rh-red/20 scale-110'
                          : isCompleted
                            ? 'bg-rh-teal text-white'
                            : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                      }`}>
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <span className={`text-[11px] font-bold tracking-wider uppercase whitespace-nowrap ${
                        isActive
                          ? 'text-rh-red'
                          : isCompleted
                            ? 'text-rh-teal font-bold'
                            : 'text-gray-400'
                      }`}>
                        {step.title}
                      </span>
                    </button>
                    {idx < STEPS.length - 1 && (
                      <div className={`h-0.5 mx-4 flex-1 rounded-full ${
                        idx < currentStep ? 'bg-rh-teal' : 'bg-gray-150'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rh-teal/[0.02] rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-rh-red/10 flex items-center justify-center shrink-0">
                <ActiveIcon className="w-5 h-5 text-rh-red" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-rh-teal m-0">{STEPS[currentStep].title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Step {currentStep + 1} of {STEPS.length}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6 min-h-[320px]"
                >
                  {/* Step 1: Personal Details */}
                  {currentStep === 0 && (
                    <div className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Full Name <span className="text-rh-red">*</span></label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              required
                              placeholder="John Doe"
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none transition text-sm text-gray-700 bg-gray-50/50"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Date of Birth <span className="text-rh-red">*</span></label>
                          <input
                            type="date"
                            required
                            value={formData.dob}
                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none transition text-sm text-gray-700 bg-gray-50/50"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Email Address <span className="text-rh-red">*</span></label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="email"
                              required
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none transition text-sm text-gray-700 bg-gray-50/50"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Phone Number <span className="text-rh-red">*</span></label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="tel"
                              required
                              placeholder="+61 400 000 000"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none transition text-sm text-gray-700 bg-gray-50/50"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Nationality</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                              value={formData.nationality}
                              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none transition text-sm text-gray-700 bg-gray-50/50 appearance-none"
                            >
                              <option value="">Select Nationality</option>
                              {nationalList.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Current Country of Residence</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                              value={formData.currentCountry}
                              onChange={(e) => setFormData({ ...formData, currentCountry: e.target.value })}
                              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none transition text-sm text-gray-700 bg-gray-50/50 appearance-none"
                            >
                              <option value="">Select Country</option>
                              {nationalList.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Education */}
                  {currentStep === 1 && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Highest Qualification <span className="text-rh-red">*</span></label>
                        <div className="relative">
                          <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            required
                            value={formData.highestQual}
                            onChange={(e) => setFormData({ ...formData, highestQual: e.target.value })}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none transition text-sm text-gray-700 bg-gray-50/50 appearance-none"
                          >
                            <option value="">Select Qualification</option>
                            {QUALIFICATIONS.map((q) => (
                              <option key={q} value={q}>{q}</option>
                            ))}
                          </select>
                          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Field of Study <span className="text-rh-red">*</span></label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Computer Science, Accounting"
                            value={formData.fieldOfStudy}
                            onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none transition text-sm text-gray-700 bg-gray-50/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Institution / University</label>
                          <input
                            type="text"
                            placeholder="e.g. Monash University"
                            value={formData.institution}
                            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none transition text-sm text-gray-700 bg-gray-50/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Year of Completion</label>
                        <input
                          type="number"
                          placeholder="e.g. 2024"
                          value={formData.yearCompleted}
                          onChange={(e) => setFormData({ ...formData, yearCompleted: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none transition text-sm text-gray-700 bg-gray-50/50"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Work Experience */}
                  {currentStep === 2 && (
                    <div className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Nominated Occupation <span className="text-rh-red">*</span></label>
                          <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Software Engineer"
                              value={formData.occupation}
                              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none transition text-sm text-gray-700 bg-gray-50/50"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Years of Post-Graduation Experience <span className="text-rh-red">*</span></label>
                          <input
                            type="number"
                            required
                            placeholder="e.g. 5"
                            value={formData.yearsExp}
                            onChange={(e) => setFormData({ ...formData, yearsExp: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none transition text-sm text-gray-700 bg-gray-50/50"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Current Employer</label>
                          <input
                            type="text"
                            placeholder="Company Name"
                            value={formData.currentEmployer}
                            onChange={(e) => setFormData({ ...formData, currentEmployer: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none transition text-sm text-gray-700 bg-gray-50/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Industry Area</label>
                          <input
                            type="text"
                            placeholder="e.g. Technology, Health"
                            value={formData.industry}
                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none transition text-sm text-gray-700 bg-gray-50/50"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: English & Skills */}
                  {currentStep === 3 && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">English Language Test Taken</label>
                        <div className="relative">
                          <Languages className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            value={formData.englishTest}
                            onChange={(e) => setFormData({ ...formData, englishTest: e.target.value })}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none transition text-sm text-gray-700 bg-gray-50/50 appearance-none"
                          >
                            <option value="">Select English Test</option>
                            {ENGLISH_TESTS.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" />
                        </div>
                      </div>

                      {formData.englishTest && formData.englishTest !== 'None / Not Yet Taken' && (
                        <div className="bg-gray-50/50 border border-gray-150 rounded-2xl p-5 space-y-4">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block">Enter Test Scores</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {['listening', 'reading', 'writing', 'speaking'].map((skill) => (
                              <div key={skill} className="space-y-1">
                                <span className="text-xs font-semibold text-gray-500 capitalize">{skill}</span>
                                <input
                                  type="text"
                                  placeholder="0.0"
                                  value={(formData as any)[`${skill}Score`]}
                                  onChange={(e) => setFormData({ ...formData, [`${skill}Score`]: e.target.value })}
                                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none text-center text-sm font-semibold text-gray-700"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 border-t border-gray-100 pt-5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Have you had a formal Skills Assessment?</label>
                        <div className="flex gap-4">
                          {['Yes', 'No'].map((choice) => (
                            <button
                              key={choice}
                              type="button"
                              onClick={() => setFormData({ ...formData, skillsAssessed: choice })}
                              className={`flex-1 py-2.5 rounded-xl border font-semibold text-xs transition-all duration-200 ${
                                formData.skillsAssessed === choice
                                  ? 'bg-rh-teal border-rh-teal text-white shadow-sm'
                                  : 'bg-gray-50/80 border-gray-200 text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {choice}
                            </button>
                          ))}
                        </div>
                      </div>

                      {formData.skillsAssessed === 'Yes' && (
                        <div className="grid sm:grid-cols-2 gap-5 bg-gray-50/50 border border-gray-150 rounded-2xl p-5">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Assessment Body Name</label>
                            <input
                              type="text"
                              placeholder="e.g. ACS, Engineers Australia"
                              value={formData.assessmentBody}
                              onChange={(e) => setFormData({ ...formData, assessmentBody: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none text-sm bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Assessment Outcome</label>
                            <input
                              type="text"
                              placeholder="e.g. Suitable / Approved"
                              value={formData.assessmentOutcome}
                              onChange={(e) => setFormData({ ...formData, assessmentOutcome: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none text-sm bg-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 5: Australian Connection */}
                  {currentStep === 4 && (
                    <div className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Have you studied in Australia?</label>
                          <div className="flex gap-4">
                            {['Yes', 'No'].map((choice) => (
                              <button
                                key={choice}
                                type="button"
                                onClick={() => setFormData({ ...formData, studiedInAu: choice })}
                                className={`flex-1 py-2.5 rounded-xl border font-semibold text-xs transition-all duration-200 ${
                                  formData.studiedInAu === choice
                                    ? 'bg-rh-teal border-rh-teal text-white shadow-sm'
                                    : 'bg-gray-50/80 border-gray-200 text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {choice}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Have you worked in Australia?</label>
                          <div className="flex gap-4">
                            {['Yes', 'No'].map((choice) => (
                              <button
                                key={choice}
                                type="button"
                                onClick={() => setFormData({ ...formData, workedInAu: choice })}
                                className={`flex-1 py-2.5 rounded-xl border font-semibold text-xs transition-all duration-200 ${
                                  formData.workedInAu === choice
                                    ? 'bg-rh-teal border-rh-teal text-white shadow-sm'
                                    : 'bg-gray-50/80 border-gray-200 text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {choice}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-gray-100 pt-5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Interested in State Nomination (Subclass 190/491)?</label>
                        <div className="flex gap-4">
                          {['Yes', 'No'].map((choice) => (
                            <button
                              key={choice}
                              type="button"
                              onClick={() => setFormData({ ...formData, stateNominationInterest: choice })}
                              className={`flex-1 py-2.5 rounded-xl border font-semibold text-xs transition-all duration-200 ${
                                formData.stateNominationInterest === choice
                                  ? 'bg-rh-teal border-rh-teal text-white shadow-sm'
                                  : 'bg-gray-50/80 border-gray-200 text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {choice}
                            </button>
                          ))}
                        </div>
                      </div>

                      {formData.stateNominationInterest === 'Yes' && (
                        <div className="space-y-2 bg-gray-50/50 border border-gray-150 rounded-2xl p-5">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Preferred Australian State(s)</label>
                          <input
                            type="text"
                            placeholder="e.g. Victoria, New South Wales"
                            value={formData.preferredState}
                            onChange={(e) => setFormData({ ...formData, preferredState: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none text-sm bg-white"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 6: Review & Submit */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div className="bg-gray-50/50 border border-gray-150 rounded-2xl p-6 space-y-4">
                        <h4 className="text-md font-bold text-rh-teal border-b border-gray-200 pb-2">Profile Overview Summary</h4>
                        
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400 block text-xs font-semibold uppercase tracking-wider">Candidate</span>
                            <span className="font-bold text-gray-700 mt-1 block">{formData.fullName || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-xs font-semibold uppercase tracking-wider">DOB / Age</span>
                            <span className="font-bold text-gray-700 mt-1 block">{formData.dob || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-xs font-semibold uppercase tracking-wider">Education Field</span>
                            <span className="font-bold text-gray-700 mt-1 block">{formData.fieldOfStudy || 'N/A'} ({formData.highestQual || 'N/A'})</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-xs font-semibold uppercase tracking-wider">Occupation</span>
                            <span className="font-bold text-gray-700 mt-1 block">{formData.occupation || 'N/A'} ({formData.yearsExp || '0'} years exp)</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Upload Detailed Resume / CV</label>
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-rh-teal/40 bg-gray-50/50 rounded-xl p-5 cursor-pointer transition">
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                            />
                            <div className="flex flex-col items-center text-center space-y-2">
                              <Upload className="w-6 h-6 text-rh-red" />
                              <span className="text-xs font-bold text-gray-600 block">
                                {uploadedFile ? uploadedFile.name : 'Choose File to Upload'}
                              </span>
                              <span className="text-[10px] text-gray-400">PDF, DOC, DOCX up to 10MB</span>
                            </div>
                          </label>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Additional Notes / Information</label>
                          <textarea
                            rows={4}
                            placeholder="Any specific visas, dependents details, or deadlines?"
                            value={formData.additionalInfo}
                            onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-rh-teal focus:ring-1 focus:ring-rh-teal outline-none transition text-sm text-gray-700 bg-gray-50/50"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 text-xs text-gray-500 bg-rh-teal/5 p-4 rounded-xl leading-relaxed">
                        <CheckSquare className="w-5 h-5 text-rh-teal shrink-0 mt-0.5" />
                        <span>I understand that this is an evaluation questionnaire. Orange Global Migration guarantees high confidentiality in handling all details in accordance with the MARA Code of Conduct.</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                {currentStep > 0 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-3 bg-rh-teal hover:bg-teal-800 text-white font-bold rounded-xl transition text-sm shadow-md shadow-rh-teal/15"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-8 py-3.5 bg-rh-red hover:bg-red-700 text-white font-bold rounded-xl transition text-sm shadow-lg shadow-rh-red/20 disabled:bg-gray-300"
                  >
                    {submitting ? 'Evaluating Profile...' : 'Submit Evaluation'}
                    <Sparkles className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
