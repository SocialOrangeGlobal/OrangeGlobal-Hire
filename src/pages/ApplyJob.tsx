import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, User, FileText, Send, Building2, MapPin, Briefcase, Globe, Clock, Award, Upload, AlertCircle, ChevronRight, Edit3, Trash2, GraduationCap, Star, MessageSquare, Zap
} from 'lucide-react';
import Button from '../components/ui/Button';
import { fadeUp, scaleIn } from '../utils/animations';
import type { Job } from '../types';
import { useAppSelector } from '../store';
import toast from 'react-hot-toast';
import { uploadFile } from '../lib/storage';
import { authApi } from '../lib/auth';
import PageLoader from '../components/ui/PageLoader';

const STEPS = [
  { id: 1, title: 'Resume', icon: FileText },
  { id: 2, title: 'Personal', icon: User },
  { id: 3, title: 'Experience', icon: Briefcase },
  { id: 4, title: 'Education', icon: GraduationCap },
  { id: 5, title: 'Skills', icon: Star },
  { id: 6, title: 'Message', icon: MessageSquare },
  { id: 7, title: 'Review', icon: CheckCircle2 }
];

export default function ApplyJobPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user, accessToken } = useAppSelector((state) => state.auth);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(isAuthenticated);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Multi-step state
  const [applyMode, setApplyMode] = useState<'easy' | 'manual' | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // User Profile & Resumes
  const [profile, setProfile] = useState<any>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');

  const [uploadingResume, setUploadingResume] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stepperRef = useRef<HTMLDivElement>(null);

  // Manual Details
  const [manualDetails, setManualDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    skills: [] as string[],
    experienceSummary: '',
    experiences: [] as any[],
    educations: [] as any[],
    hobbies: ''
  });
  const [hasEditedDetails, setHasEditedDetails] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  // Step 6
  const [coverLetter, setCoverLetter] = useState('');

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      const jobId = searchParams.get('id');
      if (!jobId) {
        setJobLoading(false);
        return;
      }

      try {
        setJobLoading(true);
        const url = `${import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1"}/jobs/${jobId}`;
        const res = await fetch(url);
        if (res.ok) {
          const result = await res.json();
          const item = result?.data?.data;
          if (item) {
            setSelectedJob({
              id: item.id,
              title: item.title,
              company: item.company,
              companyLogo: "https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=150",
              location: item.location,
              salary: item.salary || "Negotiable",
              type: item.type,
              mode: item.mode,
              category: item.category,
              postedAt: new Date(item.postedAt).toLocaleDateString("en-AU", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              }),
              description: item.description,
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch live job details:", err);
      } finally {
        setJobLoading(false);
      }
    };
    fetchJob();
  }, [searchParams]);

  // Fetch profile
  const fetchProfile = async () => {
    if (!isAuthenticated || !accessToken) {
      setProfileLoading(false);
      return;
    }
    try {
      setProfileLoading(true);
      const data = await authApi.getMe();
      const p = data.profile;
      setProfile(p);
      const userResumes = p?.resumes || [];
      setResumes(userResumes);

      if (!selectedResumeId) {
        const defaultResume = userResumes.find((r: any) => r.isDefault);
        if (defaultResume) {
          setSelectedResumeId(defaultResume.id);
        } else if (userResumes.length > 0) {
          setSelectedResumeId(userResumes[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [isAuthenticated, accessToken]);

  // Scroll active step into view
  useEffect(() => {
    if (stepperRef.current) {
      const activeElement = stepperRef.current.querySelector('.active-step');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [currentStep, applyMode]);

  // Auto-fill manual details dynamically in Easy Apply mode whenever selectedResumeId changes
  useEffect(() => {
    if (applyMode === 'easy' && selectedResumeId && resumes.length > 0) {
      const selected = resumes.find(r => r.id === selectedResumeId);
      setManualDetails({
        fullName: selected?.parsedName || profile?.fullName || user?.fullName || '',
        email: selected?.parsedEmail || profile?.workEmail || user?.email || '',
        phone: selected?.parsedPhone || profile?.phone || '',
        skills: selected?.parsedSkills?.length ? selected.parsedSkills : (profile?.skills || []),
        experienceSummary: selected?.parsedExperience?.toString() || profile?.totalExp || '',
        experiences: profile?.experiences || [],
        educations: profile?.educations || [],
        hobbies: profile?.hobbies || ''
      });
    }
  }, [selectedResumeId, resumes, profile, user, applyMode]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (resumes.length >= 5) {
      toast.error('You have reached the maximum limit of 5 uploaded resumes. Please remove one from your Manage Profile page first.');
      return;
    }

    setUploadingResume(true);
    try {
      const timestamp = Date.now();
      const fileName = `${user?.id}-${timestamp}-${file.name.replace(/\s+/g, '-')}`;
      const url = await uploadFile(file, 'resumes', fileName);

      await authApi.addResume({ fileName: file.name, fileUrl: url });
      toast.success("Resume uploaded successfully!");
      await fetchProfile(); // refresh list
    } catch (err: any) {
      toast.error("Failed to save resume record: " + (err.response?.data?.message || err.message));
    } finally {
      setUploadingResume(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !selectedResumeId) {
      toast.error("Please select a resume to proceed.");
      return;
    }
    if (applyMode === 'easy' && currentStep === 1) {
      easyApply();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 7));
    }
  };

  const easyApply = () => {
    if (!selectedResumeId) {
      toast.error("Please select a resume for Easy Apply.");
      return;
    }
    const selected = resumes.find(r => r.id === selectedResumeId);

    setManualDetails({
      fullName: selected?.parsedName || profile?.fullName || user?.fullName || '',
      email: selected?.parsedEmail || profile?.workEmail || user?.email || '',
      phone: selected?.parsedPhone || profile?.phone || '',
      skills: selected?.parsedSkills?.length ? selected.parsedSkills : (profile?.skills || []),
      experienceSummary: selected?.parsedExperience?.toString() || profile?.totalExp || '',
      experiences: profile?.experiences || [],
      educations: profile?.educations || [],
      hobbies: profile?.hobbies || ''
    });
    setHasEditedDetails(true);
    setCurrentStep(7);
  };

  const prevStep = () => {
    if (applyMode === 'easy' && currentStep === 7) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setApplyMode(null);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !manualDetails.skills.includes(skillInput.trim())) {
      setManualDetails(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput('');
      setHasEditedDetails(true);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setManualDetails(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
    setHasEditedDetails(true);
  };

  const addExperience = () => {
    setManualDetails(p => ({ ...p, experiences: [...p.experiences, { title: '', company: '', responsibilities: '' }] }));
    setHasEditedDetails(true);
  };
  const removeExperience = (index: number) => {
    setManualDetails(p => ({ ...p, experiences: p.experiences.filter((_, i) => i !== index) }));
    setHasEditedDetails(true);
  };

  const addEducation = () => {
    setManualDetails(p => ({ ...p, educations: [...p.educations, { school: '', degree: '', year: '' }] }));
    setHasEditedDetails(true);
  };
  const removeEducation = (index: number) => {
    setManualDetails(p => ({ ...p, educations: p.educations.filter((_, i) => i !== index) }));
    setHasEditedDetails(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeId) {
      toast.error('Please select a resume to apply.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1"}/jobs/${selectedJob?.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          resumeId: selectedResumeId,
          coverLetter,
          manualDetails
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to submit application');
      }

      setIsSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => navigate('/jobs');

  const pageLoading = jobLoading || profileLoading;

  if (pageLoading) {
    return <PageLoader message="Loading application details..." subMessage="Setting up your application portal" />;
  }

  if (!selectedJob && !isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rh-light p-10">
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-rh-red mx-auto mb-8">
            <Briefcase className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-rh-teal mb-4">Job Not Found</h2>
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
          <button onClick={goBack} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest transition-colors group-hover:text-white">Back to Job Listing</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
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
              <div className="bg-white rounded-[32px] md:rounded-[48px] p-6 md:p-10 lg:p-16 shadow-2xl shadow-gray-200/50">
                {isSubmitted ? (
                  <motion.div initial="hidden" animate="visible" variants={scaleIn} className="text-center py-20">
                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12" />
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold text-rh-teal mb-4 tracking-tight">Application Sent!</h2>
                    <p className="text-gray-500 max-w-md mx-auto leading-relaxed mb-10">
                      Great news! Your application for the <strong>{selectedJob?.title}</strong> role has been successfully transmitted. Our ATS will analyze your resume.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Button variant="primary" onClick={() => navigate('/talent-dashboard')} className="w-full sm:w-auto px-10 py-4 rounded-xl">View My Applications</Button>
                      <Button variant="outline" onClick={() => navigate('/')} className="w-full sm:w-auto px-10 py-4 rounded-xl border-gray-200">Return Home</Button>
                    </div>
                  </motion.div>
                ) : !isAuthenticated ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-rh-light rounded-full flex items-center justify-center mx-auto mb-6 text-rh-teal">
                      <User className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-rh-teal mb-4">Sign In Required</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">You must be signed in as Talent to apply for this job and have your resume processed by our ATS.</p>
                    <Button variant="primary" onClick={() => navigate('/sign-in')} className="px-10 py-4 rounded-xl">Sign In to Apply</Button>
                  </div>
                ) : user?.role === 'EMPLOYER' ? (
                  <div className="text-center py-20">
                    <h3 className="text-2xl font-bold text-rh-teal mb-4">Employer Accounts Cannot Apply</h3>
                    <p className="text-gray-500 mb-8">Please log in with a Talent account to apply for jobs.</p>
                  </div>
                ) : applyMode === null ? (
                  <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-2xl mx-auto space-y-8 py-4 sm:py-8">
                    <div className="text-center space-y-2 mb-8">
                      <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900">How would you like to apply?</h3>
                      <p className="text-sm text-gray-500">Choose the application method that works best for you.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div
                        onClick={() => {
                          setApplyMode('easy');
                          const defaultResume = resumes.find((r: any) => r.isDefault) || resumes[0];
                          if (defaultResume) {
                            setSelectedResumeId(defaultResume.id);
                          }
                        }}
                        className="cursor-pointer border border-gray-200 hover:border-rh-teal hover:ring-1 hover:ring-rh-teal bg-white p-5 rounded-2xl transition-all flex items-start gap-4 shadow-sm group"
                      >
                        <div className="w-10 h-10 bg-rh-teal/10 text-rh-teal rounded-full flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-rh-teal group-hover:text-white transition-colors">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-gray-900">Easy Apply</h4>
                          <p className="text-sm text-gray-500 mt-1 leading-relaxed">Use your saved profile to auto-fill the application. Fastest option.</p>
                        </div>
                        <div className="ml-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-5 h-5 text-rh-teal" />
                        </div>
                      </div>

                      <div
                        onClick={() => {
                          setApplyMode('manual');
                          setSelectedResumeId('');
                          setManualDetails({
                            fullName: '',
                            email: '',
                            phone: '',
                            skills: [],
                            experienceSummary: '',
                            experiences: [],
                            educations: [],
                            hobbies: ''
                          });
                        }}
                        className="cursor-pointer border border-gray-200 hover:border-rh-teal hover:ring-1 hover:ring-rh-teal bg-white p-5 rounded-2xl transition-all flex items-start gap-4 shadow-sm group"
                      >
                        <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-rh-teal group-hover:text-white transition-colors">
                          <Edit3 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-gray-900">Apply Manually</h4>
                          <p className="text-sm text-gray-500 mt-1 leading-relaxed">Go through a step-by-step process to tailor your experience, education, and cover letter for this specific role.</p>
                        </div>
                        <div className="ml-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-5 h-5 text-rh-teal" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 flex justify-center">
                      <button onClick={() => navigate('/jobs')} className="text-sm text-gray-500 hover:text-gray-900 font-medium hover:underline">
                        Cancel & Return to Jobs
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-10">
                      {/* Scrollable steps indicator with responsive wrapping on larger screens */}
                      <div ref={stepperRef} className="flex items-center overflow-x-auto lg:overflow-x-visible lg:flex-wrap pb-4 hide-scrollbar gap-2 lg:gap-3 snap-x w-full">
                        {(applyMode === 'easy' ? STEPS.filter(s => s.id === 1 || s.id === 7) : STEPS).map((step, idx, arr) => (
                          <div
                            key={step.id}
                            className={`flex items-center shrink-0 snap-center ${currentStep === step.id ? 'active-step' : ''} cursor-pointer`}
                            onClick={() => {
                              if (applyMode === 'easy') {
                                  if (step.id === 1) setCurrentStep(1);
                                  if (step.id === 7 && selectedResumeId) easyApply();
                              } else {
                                  setCurrentStep(step.id);
                              }
                            }}
                          >
                            <div className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${currentStep === step.id
                                ? 'bg-rh-red text-white shadow-md shadow-rh-red/20 scale-105'
                                : currentStep > step.id
                                  ? 'text-rh-teal bg-rh-light hover:bg-rh-teal/10'
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}>
                              <step.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${currentStep === step.id ? 'text-white' : ''}`} />
                              <span>{step.title}</span>
                            </div>
                            {idx < arr.length - 1 && (
                              <div className={`w-4 sm:w-8 h-[2px] ml-2 sm:ml-4 rounded-full transition-colors ${currentStep > step.id ? 'bg-rh-red' : 'bg-gray-100'} lg:hidden`} />
                            )}
                            {idx < arr.length - 1 && (
                              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 mx-2 hidden lg:block" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <form onSubmit={currentStep === 7 ? handleFormSubmit : (e) => { e.preventDefault(); nextStep(); }} className="space-y-8">

                      {/* STEP 1: RESUME */}
                      {currentStep === 1 && (
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
                          <h3 className="text-2xl font-bold text-rh-teal flex items-center gap-3">
                            <FileText className="text-rh-red w-6 h-6" /> Select or Upload Resume
                          </h3>
                          <p className="text-sm text-gray-500">Choose an existing resume or upload a new one to proceed.</p>

                          {resumes.length === 0 ? (
                            <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-sm font-medium flex flex-col items-center justify-center text-center gap-4">
                              <AlertCircle className="w-10 h-10" />
                              <p>You don't have any uploaded resumes yet.</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {resumes.map(r => (
                                <div
                                  key={r.id}
                                  onClick={() => {
                                    setSelectedResumeId(r.id);
                                    if (applyMode === 'manual') {
                                      const selected = resumes.find(res => res.id === r.id);
                                      setManualDetails({
                                        fullName: selected?.parsedName || profile?.fullName || user?.fullName || '',
                                        email: selected?.parsedEmail || profile?.workEmail || user?.email || '',
                                        phone: selected?.parsedPhone || profile?.phone || '',
                                        skills: selected?.parsedSkills?.length ? selected.parsedSkills : (profile?.skills || []),
                                        experienceSummary: selected?.parsedExperience?.toString() || profile?.totalExp || '',
                                        experiences: profile?.experiences || [],
                                        educations: profile?.educations || [],
                                        hobbies: profile?.hobbies || ''
                                      });
                                    }
                                  }}
                                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3
                                                ${selectedResumeId === r.id ? 'border-rh-red bg-rh-red/5' : 'border-gray-100 hover:border-gray-200'}`}
                                >
                                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5
                                                  ${selectedResumeId === r.id ? 'border-rh-red bg-rh-red' : 'border-gray-300'}`}>
                                    {selectedResumeId === r.id && <div className="w-2 h-2 bg-white rounded-full" />}
                                  </div>
                                  <div>
                                    <p className={`font-bold text-sm ${selectedResumeId === r.id ? 'text-rh-red' : 'text-rh-teal'}`}>{r.fileName}</p>
                                    {r.isDefault && <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-1 block">Default</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="mt-6 pt-6 border-t border-gray-100">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="hidden"
                              ref={fileInputRef}
                              onChange={handleFileUpload}
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploadingResume}
                              className="w-full p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-rh-red/50 hover:bg-rh-red/5 transition-all flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-rh-red disabled:opacity-50"
                            >
                              {uploadingResume ? (
                                <div className="w-6 h-6 border-2 border-rh-red/30 border-t-rh-red rounded-full animate-spin" />
                              ) : (
                                <Upload className="w-6 h-6" />
                              )}
                              <span className="text-sm font-bold">
                                {uploadingResume ? 'Uploading...' : 'Upload New Resume (Max 5)'}
                              </span>
                            </button>
                            {resumes.length >= 5 && (
                              <p className="text-xs text-red-500 mt-2 text-center">
                                Maximum limit of 5 resumes reached. <a href="/talent/manage-profile" className="underline font-bold">Manage Profile</a> to delete old ones.
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 2: PERSONAL DETAILS */}
                      {currentStep === 2 && (
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
                          <h3 className="text-2xl font-bold text-rh-teal flex items-center gap-3">
                            <User className="text-rh-red w-6 h-6" /> Personal Details
                          </h3>
                          <p className="text-sm text-gray-500">Review and verify your contact information and summary.</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                              <input
                                type="text"
                                value={manualDetails.fullName}
                                onChange={e => { setManualDetails(p => ({ ...p, fullName: e.target.value })); setHasEditedDetails(true); }}
                                className="w-full bg-[#F4F7FA] border-transparent focus:bg-white focus:border-rh-red/20 border-2 rounded-2xl py-3 px-5 outline-none transition-all text-sm font-medium"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Email</label>
                              <input
                                type="email"
                                value={manualDetails.email}
                                onChange={e => { setManualDetails(p => ({ ...p, email: e.target.value })); setHasEditedDetails(true); }}
                                className="w-full bg-[#F4F7FA] border-transparent focus:bg-white focus:border-rh-red/20 border-2 rounded-2xl py-3 px-5 outline-none transition-all text-sm font-medium"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Phone</label>
                              <input
                                type="text"
                                value={manualDetails.phone}
                                onChange={e => { setManualDetails(p => ({ ...p, phone: e.target.value })); setHasEditedDetails(true); }}
                                className="w-full bg-[#F4F7FA] border-transparent focus:bg-white focus:border-rh-red/20 border-2 rounded-2xl py-3 px-5 outline-none transition-all text-sm font-medium"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Total Experience (Years)</label>
                              <input
                                type="text"
                                value={manualDetails.experienceSummary}
                                onChange={e => { setManualDetails(p => ({ ...p, experienceSummary: e.target.value })); setHasEditedDetails(true); }}
                                className="w-full bg-[#F4F7FA] border-transparent focus:bg-white focus:border-rh-red/20 border-2 rounded-2xl py-3 px-5 outline-none transition-all text-sm font-medium"
                              />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Hobbies & Other Details</label>
                              <input
                                type="text"
                                value={manualDetails.hobbies}
                                onChange={e => { setManualDetails(p => ({ ...p, hobbies: e.target.value })); setHasEditedDetails(true); }}
                                className="w-full bg-[#F4F7FA] border-transparent focus:bg-white focus:border-rh-red/20 border-2 rounded-2xl py-3 px-5 outline-none transition-all text-sm font-medium"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 3: WORK EXPERIENCE */}
                      {currentStep === 3 && (
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-rh-teal flex items-center gap-3">
                              <Briefcase className="text-rh-red w-6 h-6" /> Work Experience
                            </h3>
                            <button type="button" onClick={addExperience} className="text-rh-red font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                              + Add Role
                            </button>
                          </div>
                          <p className="text-sm text-gray-500">Provide details about your past employment history.</p>

                          <div className="space-y-4">
                            {manualDetails.experiences.map((exp, index) => (
                              <div key={index} className="p-4 sm:p-6 bg-[#F9FBFF] rounded-2xl border border-gray-100 relative group">
                                <button type="button" onClick={() => removeExperience(index)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-rh-red transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Title</label>
                                    <input
                                      value={exp.title || ''}
                                      onChange={e => {
                                        const newExps = [...manualDetails.experiences];
                                        newExps[index].title = e.target.value;
                                        setManualDetails(p => ({ ...p, experiences: newExps }));
                                      }}
                                      className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company</label>
                                    <input
                                      value={exp.company || ''}
                                      onChange={e => {
                                        const newExps = [...manualDetails.experiences];
                                        newExps[index].company = e.target.value;
                                        setManualDetails(p => ({ ...p, experiences: newExps }));
                                      }}
                                      className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium"
                                    />
                                  </div>
                                  <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Responsibilities</label>
                                    <textarea
                                      rows={3}
                                      value={exp.responsibilities || ''}
                                      onChange={e => {
                                        const newExps = [...manualDetails.experiences];
                                        newExps[index].responsibilities = e.target.value;
                                        setManualDetails(p => ({ ...p, experiences: newExps }));
                                      }}
                                      className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium resize-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            {manualDetails.experiences.length === 0 && (
                              <div className="text-center p-8 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 text-sm font-medium">
                                No work experience added yet.
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 4: EDUCATIONS */}
                      {currentStep === 4 && (
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-rh-teal flex items-center gap-3">
                              <GraduationCap className="text-rh-red w-6 h-6" /> Education
                            </h3>
                            <button type="button" onClick={addEducation} className="text-rh-red font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                              + Add Education
                            </button>
                          </div>
                          <p className="text-sm text-gray-500">Provide details of your academic background.</p>

                          <div className="space-y-4">
                            {manualDetails.educations.map((edu, index) => (
                              <div key={index} className="p-4 sm:p-6 bg-[#F9FBFF] rounded-2xl border border-gray-100 relative group">
                                <button type="button" onClick={() => removeEducation(index)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-rh-red transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">School / University</label>
                                    <input
                                      value={edu.school || ''}
                                      onChange={e => {
                                        const newEdus = [...manualDetails.educations];
                                        newEdus[index].school = e.target.value;
                                        setManualDetails(p => ({ ...p, educations: newEdus }));
                                      }}
                                      className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Degree</label>
                                    <input
                                      value={edu.degree || ''}
                                      onChange={e => {
                                        const newEdus = [...manualDetails.educations];
                                        newEdus[index].degree = e.target.value;
                                        setManualDetails(p => ({ ...p, educations: newEdus }));
                                      }}
                                      className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Year</label>
                                    <input
                                      value={edu.year || ''}
                                      onChange={e => {
                                        const newEdus = [...manualDetails.educations];
                                        newEdus[index].year = e.target.value;
                                        setManualDetails(p => ({ ...p, educations: newEdus }));
                                      }}
                                      className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            {manualDetails.educations.length === 0 && (
                              <div className="text-center p-8 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 text-sm font-medium">
                                No education details added yet.
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 5: SKILLS */}
                      {currentStep === 5 && (
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
                          <h3 className="text-2xl font-bold text-rh-teal flex items-center gap-3">
                            <Star className="text-rh-red w-6 h-6" /> Expertise & Skills
                          </h3>
                          <p className="text-sm text-gray-500">Add key skills to help the ATS match you with the job requirements.</p>

                          <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                              <input
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                                placeholder="Type a skill and hit Enter or Add..."
                                className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all font-medium"
                              />
                              <Button type="button" onClick={addSkill} variant="outline" className="px-8 border-2 border-gray-100 rounded-2xl font-bold">Add</Button>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4 min-h-[60px] p-6 bg-white border border-gray-100 rounded-2xl">
                              {manualDetails.skills.length > 0 ? manualDetails.skills.map((s) => (
                                <span key={s} className="px-5 py-2.5 bg-rh-light text-rh-teal rounded-xl text-xs font-bold flex items-center gap-3 group">
                                  {s}
                                  <button type="button" onClick={() => removeSkill(s)}>
                                    <Trash2 className="w-4 h-4 text-gray-300 group-hover:text-rh-red transition-colors" />
                                  </button>
                                </span>
                              )) : (
                                <span className="text-gray-400 text-sm font-medium">No skills added.</span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 6: COVER LETTER & MESSAGE */}
                      {currentStep === 6 && (
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
                          <h3 className="text-2xl font-bold text-rh-teal flex items-center gap-3">
                            <MessageSquare className="text-rh-red w-6 h-6" /> Cover Letter
                          </h3>
                          <p className="text-sm text-gray-500">Provide an optional cover letter or personal note to the employer.</p>

                          <div className="space-y-3">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Message to Employer</label>
                            <textarea
                              value={coverLetter}
                              onChange={(e) => setCoverLetter(e.target.value)}
                              className="w-full bg-[#F4F7FA] border-2 border-transparent focus:border-rh-red/20 focus:bg-white rounded-3xl py-6 px-8 outline-none transition-all text-sm font-medium h-48 resize-none"
                              placeholder="Why are you the perfect fit for this role?"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 7: REVIEW */}
                      {currentStep === 7 && (
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
                          <h3 className="text-2xl font-bold text-rh-teal flex items-center gap-3">
                            <CheckCircle2 className="text-rh-red w-6 h-6" /> Final Review
                          </h3>
                          <p className="text-sm text-gray-500">Review your application details before submitting.</p>

                          <div className="bg-[#F9FBFF] rounded-3xl p-6 md:p-8 border border-gray-100 space-y-8">
                            <div>
                              <h4 className="text-xs font-bold text-rh-red uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">Personal Details</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                                <div><span className="text-gray-400 block text-[10px] uppercase">Name</span>{manualDetails.fullName || '-'}</div>
                                <div><span className="text-gray-400 block text-[10px] uppercase">Email</span>{manualDetails.email || '-'}</div>
                                <div><span className="text-gray-400 block text-[10px] uppercase">Phone</span>{manualDetails.phone || '-'}</div>
                                <div><span className="text-gray-400 block text-[10px] uppercase">Total Experience</span>{manualDetails.experienceSummary || '-'}</div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-xs font-bold text-rh-red uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">Work Experience ({manualDetails.experiences.length})</h4>
                              {manualDetails.experiences.length > 0 ? (
                                <ul className="space-y-2 text-sm font-medium">
                                  {manualDetails.experiences.map((exp, i) => (
                                    <li key={i} className="flex gap-2">
                                      <span className="text-rh-red">•</span>
                                      <div>
                                        <span className="font-bold">{exp.title}</span> at <span className="text-gray-600">{exp.company}</span>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              ) : <span className="text-sm text-gray-400">None added</span>}
                            </div>

                            <div>
                              <h4 className="text-xs font-bold text-rh-red uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">Education ({manualDetails.educations.length})</h4>
                              {manualDetails.educations.length > 0 ? (
                                <ul className="space-y-2 text-sm font-medium">
                                  {manualDetails.educations.map((edu, i) => (
                                    <li key={i} className="flex gap-2">
                                      <span className="text-rh-red">•</span>
                                      <div>
                                        <span className="font-bold">{edu.degree}</span> from <span className="text-gray-600">{edu.school}</span>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              ) : <span className="text-sm text-gray-400">None added</span>}
                            </div>

                            <div>
                              <h4 className="text-xs font-bold text-rh-red uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">Skills ({manualDetails.skills.length})</h4>
                              <div className="flex flex-wrap gap-2">
                                {manualDetails.skills.length > 0 ? manualDetails.skills.map(s => (
                                  <span key={s} className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-xs font-bold text-rh-teal">{s}</span>
                                )) : <span className="text-sm text-gray-400">None added</span>}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* NAVIGATION BUTTONS */}
                      <div className="pt-8 flex flex-col sm:flex-row items-center gap-4 border-t border-gray-100">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          className="w-full sm:w-auto px-6 py-4 rounded-xl border-gray-200 order-2 sm:order-1"
                        >
                          Back
                        </Button>

                        {currentStep < 7 ? (
                          <Button
                            type="submit"
                            variant="primary"
                            className="w-full sm:flex-1 py-4 rounded-xl shadow-xl shadow-rh-red/30 flex items-center justify-center gap-2 text-sm font-bold group order-1 sm:order-3"
                          >
                            {applyMode === 'easy' && currentStep === 1 ? 'Review Application' : 'Next Step'} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            variant="primary"
                            className="flex-1 py-4 rounded-xl shadow-xl shadow-rh-red/30 flex items-center justify-center gap-4 text-sm font-bold group"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                Submit Application <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-6 md:space-y-8">
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
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
