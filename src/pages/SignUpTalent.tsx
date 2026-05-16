import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle, Plus, Trash2, User, GraduationCap, Briefcase, Star, CheckCircle2, Loader2, Eye, EyeOff, Camera } from 'lucide-react';
import Button from '../components/ui/Button';
import { authApi } from '../lib/auth';
import { uploadFile } from '../lib/storage';
import { useAppDispatch } from '../store';
import { setLoading, setError as setAuthError } from '../store/slices/authSlice';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

type Step = 'resume' | 'personal' | 'education' | 'skills' | 'experience' | 'success';

const talentSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  location: z.string().optional(),
  resumeUrl: z.string().optional(),
  avatarUrl: z.string().optional(),
  educations: z.array(z.object({
    school: z.string().min(1, 'School is required'),
    degree: z.string().min(1, 'Degree is required'),
    year: z.string().min(4, 'Valid year required'),
  })),
  skills: z.array(z.string()).min(1, 'Please add at least one skill'),
  experiences: z.array(z.object({
    title: z.string().min(1, 'Job title is required'),
    company: z.string().min(1, 'Company is required'),
    responsibilities: z.string().min(10, 'Please describe your role'),
  })),
});

type TalentFormData = z.infer<typeof talentSchema>;

export default function SignUpTalent() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<Step>('resume');
  const [extracting, setExtracting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState('');

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm<TalentFormData>({
    resolver: zodResolver(talentSchema),
    defaultValues: {
      educations: [{ school: '', degree: '', year: '' }],
      experiences: [{ title: '', company: '', responsibilities: '' }],
      skills: ['Strategic Management', 'Market Analysis', 'Leadership']
    }
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control,
    name: 'educations'
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control,
    name: 'experiences'
  });

  const skills = watch('skills');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const goBack = () => {
    if (step === 'resume') navigate('/signup-choice');
    if (step === 'personal') setStep('resume');
    if (step === 'education') setStep('personal');
    if (step === 'skills') setStep('education');
    if (step === 'experience') setStep('skills');
  };

  const handleResumeUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setExtracting(true);
      setError(null);
      try {
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
        const url = await uploadFile(file, 'resumes', fileName);
        setValue('resumeUrl', url);
        setStep('personal');
      } catch (err: any) {
        setError('Failed to upload resume. Please try again.');
      } finally {
        setExtracting(false);
      }
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setValue('skills', [...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setValue('skills', skills.filter(s => s !== skill));
  };

  const onSignUpSubmit = async (data: TalentFormData) => {
    dispatch(setLoading(true));
    setError(null);
    try {
      await authApi.signUpTalent(data);
      // Do NOT set credentials — user must verify email before signing in
      setStep('success');
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      const msg = Array.isArray(backendMessage)
        ? backendMessage.join(', ')
        : backendMessage || 'Registration failed';
      setError(msg);
      dispatch(setAuthError(msg));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const stepsInfo = [
    { id: 'resume', title: 'Resume Upload', icon: <Upload className="w-5 h-5" /> },
    { id: 'personal', title: 'Personal Details', icon: <User className="w-5 h-5" /> },
    { id: 'education', title: 'Education', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'skills', title: 'Skills & Expertise', icon: <Star className="w-5 h-5" /> },
    { id: 'experience', title: 'Work Experience', icon: <Briefcase className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-white min-h-screen pt-20 lg:pt-0 flex flex-col lg:flex-row font-sans overflow-x-hidden">
      {/* Left Side */}
      <aside className="w-full lg:w-[40%] relative flex flex-col justify-between p-6 md:p-12 lg:p-16 overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-100 min-h-[450px] md:min-h-[550px] lg:min-h-screen shrink-0">
        <div className="absolute inset-0 z-0 bg-rh-dark">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />
        </div>
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 lg:mb-12 mt-2 lg:mt-8 text-center lg:text-left">
            <h1 className="text-xl lg:text-4xl font-medium text-white mb-3 lg:mb-4 tracking-tight leading-tight">
              Get Your <span className='text-rh-teal-lighter font-medium italic ml-2'>Dream Job!</span>
            </h1>
            <p className="text-gray-200 text-sm lg:text-base font-normal leading-relaxed max-w-xs mx-auto lg:mx-0 opacity-90">
              Get discovered by top employers across 40+ countries and join the global elite.
            </p>
          </motion.div>
          <div className="space-y-4 md:space-y-6 lg:space-y-12 relative mb-8 lg:mb-0 max-w-xs mx-auto lg:mx-0">
            <div className="absolute left-[19px] lg:left-[23px] top-4 bottom-4 w-[1px] bg-white/10" />
            {stepsInfo.map((s, i) => {
              const currentIdx = stepsInfo.findIndex(item => item.id === step);
              const isCompleted = step === 'success' || i < currentIdx;
              const isActive = step !== 'success' && i === currentIdx;
              return (
                <div key={s.id} className="flex items-center gap-4 lg:gap-8 group relative z-10">
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-[14px] lg:rounded-[18px] flex items-center justify-center transition-all duration-500 border-2 shrink-0 ${isActive ? 'bg-rh-teal-lighter border-rh-teal-lighter text-white shadow-xl shadow-rh-teal-lighter/20 scale-105 lg:scale-110' : isCompleted ? 'bg-rh-teal-lighter/20 border-rh-teal-lighter text-rh-teal-lighter shadow-lg shadow-rh-teal-lighter/5' : 'bg-white/5 border-white/10 text-white/40 group-hover:border-rh-teal-lighter/40'}`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4 lg:w-6 lg:h-6" /> : s.icon}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className={`text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 transition-colors ${isActive ? 'text-rh-teal-lighter' : isCompleted ? 'text-rh-teal-lighter opacity-80' : 'text-white/30'}`}>{`Step 0${i + 1}`}</span>
                    <span className={`text-xs lg:text-base font-bold transition-colors ${isActive ? 'text-white' : isCompleted ? 'text-white/70' : 'text-white/40'}`}>{s.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative z-10 mt-16 pt-8 border-t border-white/10 hidden lg:flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md shadow-sm flex items-center justify-center border border-white/5">
            <CheckCircle className="w-5 h-5 text-rh-teal-lighter" />
          </div>
          <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest leading-tight">Verified Professional <br /> Registration</p>
        </div>
      </aside>

      {/* Right Side */}
      <main className="flex-1 bg-[#F8F9FA] p-4 md:p-12 lg:p-12 lg:overflow-y-auto custom-scrollbar flex items-center justify-center">
        <div className="w-full max-w-3xl py-8 md:py-12">
          {error && <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-[24px] text-sm font-medium mb-8">{error}</div>}

          <form onSubmit={handleSubmit(onSignUpSubmit)}>
            <AnimatePresence mode="wait">
              {step === 'resume' && (
                <motion.div key="resume" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} className="bg-white rounded-[48px] p-10 lg:p-16 shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-100">
                  <div className="mb-8 lg:mb-12">
                    <h2 className="text-xl lg:text-3xl font-bold text-rh-teal mb-4">Upload Resume</h2>
                    <p className="text-gray-500 font-medium">Get a head start by pre-filling your profile with your CV.</p>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                  <div className="border-2 border-dashed border-gray-100 bg-[#F9FBFF] rounded-[24px] p-8 sm:p-14 lg:p-20 text-center cursor-pointer hover:border-rh-teal/30 hover:bg-white transition-all group mb-10" onClick={handleResumeUploadClick}>
                    {extracting ? (
                      <div className="space-y-6">
                        <div className="w-16 h-16 border-[5px] border-rh-teal border-t-transparent rounded-full animate-spin mx-auto shadow-sm" />
                        <p className="text-rh-teal font-bold text-sm uppercase tracking-widest">Analyzing Documents...</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white shadow-sm rounded-[24px] flex items-center justify-center mx-auto mb-6 sm:mb-8 group-hover:scale-110 transition-transform text-rh-teal border border-gray-50"><Upload className="w-8 h-8 sm:w-10 sm:h-10" /></div>
                        <h3 className="text-base sm:text-xl font-bold text-[#081B2D] mb-2">Drop your resume here</h3>
                        <p className="text-gray-400 text-[10px] sm:text-sm mb-8 sm:mb-10">PDF or Word documents (Max 10MB)</p>
                        <Button type="button" variant="primary" className="px-10 sm:px-14 py-3 sm:py-4.5 bg-rh-teal hover:bg-[#0E8A8F] text-white rounded-2xl shadow-2xl shadow-rh-teal/10 font-bold text-[13px] sm:text-base">Select File</Button>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col gap-8 items-center border-t border-gray-50 pt-8">
                    <button type="button" onClick={() => setStep('personal')} className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.2em] hover:text-rh-teal transition-colors">Continue without Resume</button>
                    <button type="button" onClick={goBack} className="text-gray-400 font-bold hover:text-rh-red transition-colors flex items-center gap-2 group text-sm"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Choice</button>
                  </div>
                </motion.div>
              )}

              {step === 'personal' && (
                <motion.div key="personal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 lg:p-16 shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-100">
                  <div className="mb-8 sm:mb-12 border-b border-gray-50 pb-6">
                    <h2 className="text-xl sm:text-3xl font-bold text-rh-teal mb-2">Personal Details</h2>
                    <p className="text-gray-500 text-[13px] sm:text-base font-medium">Please provide your contact information.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 p-6 bg-rh-light/30 rounded-[32px] border border-rh-teal/5">
                    <div className="relative group">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem] bg-white overflow-hidden shadow-lg border-4 border-white">
                        {watch('avatarUrl') ? (
                          <img src={watch('avatarUrl')} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                            <User className="w-10 h-10" />
                          </div>
                        )}
                      </div>
                      <label className="absolute -bottom-1 -right-1 p-2.5 bg-rh-red text-white rounded-xl shadow-lg cursor-pointer hover:bg-[#B41419] transition-all hover:scale-110">
                        <Camera className="w-4 h-4" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const url = await uploadFile(file, 'profile-pictures', `${Date.now()}-${file.name}`);
                                setValue('avatarUrl', url);
                              } catch (err) {
                                setError('Failed to upload avatar');
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="text-center sm:text-left">
                      <h4 className="text-sm font-bold text-rh-teal uppercase tracking-widest mb-1">Profile Picture</h4>
                      <p className="text-xs text-gray-500 font-medium">Add a professional photo to stand out</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 sm:gap-y-10 mb-8 sm:mb-12">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input {...register('fullName')} placeholder="e.g. John Doe" className={`w-full px-5 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border ${errors.fullName ? 'border-red-500' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300`} />
                      {errors.fullName && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Work Email</label>
                      <input {...register('email')} placeholder="john@example.com" className={`w-full px-5 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border ${errors.email ? 'border-red-500' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300`} />
                      {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} {...register('password')} placeholder="At least 8 characters" className={`w-full px-5 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border ${errors.password ? 'border-red-500' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                      </div>
                      {errors.password && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.password.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input type="tel" {...register('phone')} placeholder="+1 (555) 000-0000" className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Current Location</label>
                      <input type="text" {...register('location')} placeholder="City, Country" className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300" />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 sm:pt-10 border-t border-gray-50">
                    <button type="button" onClick={goBack} className="text-gray-400 font-bold hover:text-rh-red flex items-center gap-2 transition-colors order-2 sm:order-1"><ArrowLeft className="w-5 h-5" /> Back</button>
                    <Button type="button" onClick={async () => {
                      const isValid = await trigger(['fullName', 'email', 'password']);
                      if (isValid) setStep('education');
                    }} variant="primary" className="w-full sm:w-auto px-12 py-3.5 sm:py-4.5 bg-rh-teal hover:bg-[#0E8A8F] text-white rounded-2xl shadow-xl shadow-rh-teal/10 font-bold text-sm sm:text-base order-1 sm:order-2">Continue</Button>
                  </div>
                </motion.div>
              )}

              {step === 'education' && (
                <motion.div key="education" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 lg:p-16 shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12 border-b border-gray-50 pb-6">
                    <div>
                      <h2 className="text-xl sm:text-3xl font-bold text-rh-teal mb-2">Education</h2>
                      <p className="text-gray-500 text-[13px] sm:text-base font-medium">Tell us about your academic background.</p>
                    </div>
                    <button type="button" onClick={() => appendEdu({ school: '', degree: '', year: '' })} className="text-rh-teal font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1 self-start sm:self-center"><Plus className="w-3 h-3" /> Add More</button>
                  </div>
                  <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12">
                    {eduFields.map((field, idx) => (
                      <div key={field.id} className="p-6 sm:p-10 bg-[#F9FBFF] rounded-[32px] sm:rounded-[40px] border border-gray-100 relative group">
                        {eduFields.length > 1 && <button type="button" onClick={() => removeEdu(idx)} className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-300 hover:text-rh-red transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>}
                        <div className="grid gap-6 sm:gap-8">
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">University / College</label>
                            <input {...register(`educations.${idx}.school`)} placeholder="e.g. Harvard University" className={`w-full px-5 sm:px-6 py-3 sm:py-4 bg-white border ${errors.educations?.[idx]?.school ? 'border-red-500' : 'border-gray-100'} rounded-2xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-[13px] sm:text-sm font-medium placeholder:text-gray-300`} />
                            {errors.educations?.[idx]?.school && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.educations[idx]?.school?.message}</p>}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                            <div className="space-y-2">
                              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Degree</label>
                              <input {...register(`educations.${idx}.degree`)} placeholder="e.g. Master of Science" className={`w-full px-5 py-3 sm:px-6 sm:py-4 bg-white border ${errors.educations?.[idx]?.degree ? 'border-red-500' : 'border-gray-100'} rounded-2xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-[13px] sm:text-sm font-medium placeholder:text-gray-300`} />
                              {errors.educations?.[idx]?.degree && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.educations[idx]?.degree?.message}</p>}
                            </div>
                            <div className="space-y-2">
                              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Graduation Year</label>
                              <input {...register(`educations.${idx}.year`)} placeholder="YYYY" className={`w-full px-5 py-3 sm:px-6 sm:py-4 bg-white border ${errors.educations?.[idx]?.year ? 'border-red-500' : 'border-gray-100'} rounded-2xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-[13px] sm:text-sm font-medium placeholder:text-gray-300`} />
                              {errors.educations?.[idx]?.year && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.educations[idx]?.year?.message}</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 sm:pt-10 border-t border-gray-50">
                    <button type="button" onClick={goBack} className="text-gray-400 font-bold hover:text-rh-red flex items-center gap-2 transition-colors order-2 sm:order-1"><ArrowLeft className="w-5 h-5" /> Back</button>
                    <Button type="button" onClick={async () => {
                      const isValid = await trigger('educations');
                      if (isValid) setStep('skills');
                    }} variant="primary" className="w-full sm:w-auto px-12 py-3 sm:py-4.5 bg-rh-teal hover:bg-[#0E8A8F] text-white rounded-2xl shadow-xl shadow-rh-teal/10 font-bold text-[13px] sm:text-base order-1 sm:order-2">Continue</Button>
                  </div>
                </motion.div>
              )}

              {step === 'skills' && (
                <motion.div key="skills" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 lg:p-16 shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-100">
                  <div className="mb-8 sm:mb-12 border-b border-gray-50 pb-6">
                    <h2 className="text-xl sm:text-3xl font-bold text-rh-teal mb-2">Skills & Expertise</h2>
                    <p className="text-gray-500 text-[13px] sm:text-base font-medium">Highlight your specialized skills.</p>
                  </div>
                  <div className="space-y-8 sm:space-y-12 mb-8 sm:mb-12">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }} placeholder="e.g. Product Strategy, React..." className="flex-1 px-5 py-3 sm:px-6 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300" />
                      <Button type="button" onClick={addSkill} variant="outline" className="w-full sm:w-auto px-12 py-3 sm:py-4 rounded-2xl border-2 border-gray-100 text-[#081B2D] font-bold hover:bg-rh-teal hover:text-white hover:border-rh-teal transition-all text-[13px] sm:text-sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                      {skills.map(s => (
                        <span key={s} className="px-4 py-2.5 sm:px-8 sm:py-3.5 bg-white border border-gray-100 rounded-xl sm:rounded-2xl text-[11px] sm:text-sm font-bold text-gray-600 flex items-center gap-3 sm:gap-4 shadow-sm hover:border-rh-teal/30 transition-all group">
                          {s}
                          <button type="button" onClick={() => removeSkill(s)}><Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300 group-hover:text-rh-red cursor-pointer transition-colors" /></button>
                        </span>
                      ))}
                    </div>
                    {errors.skills && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.skills.message}</p>}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 sm:pt-10 border-t border-gray-50">
                    <button type="button" onClick={goBack} className="text-gray-400 font-bold hover:text-rh-red flex items-center gap-2 transition-colors order-2 sm:order-1"><ArrowLeft className="w-5 h-5" /> Back</button>
                    <Button type="button" onClick={async () => {
                      const isValid = await trigger('skills');
                      if (isValid) setStep('experience');
                    }} variant="primary" className="w-full sm:w-auto px-12 py-3 sm:py-4.5 bg-rh-teal hover:bg-[#0E8A8F] text-white rounded-2xl shadow-xl shadow-rh-teal/10 font-bold text-[13px] sm:text-base order-1 sm:order-2">Continue</Button>
                  </div>
                </motion.div>
              )}

              {step === 'experience' && (
                <motion.div key="experience" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 lg:p-16 shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12 border-b border-gray-50 pb-6">
                    <div>
                      <h2 className="text-xl sm:text-3xl font-bold text-rh-teal mb-2">Work Experience</h2>
                      <p className="text-gray-500 text-[13px] sm:text-base font-medium">Detail your professional journey.</p>
                    </div>
                    <button type="button" onClick={() => appendExp({ title: '', company: '', responsibilities: '' })} className="text-rh-teal font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1 self-start sm:self-center"><Plus className="w-3 h-3" /> Add Position</button>
                  </div>
                  <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12">
                    {expFields.map((field, idx) => (
                      <div key={field.id} className="p-6 sm:p-10 bg-[#F9FBFF] rounded-[32px] sm:rounded-[40px] border border-gray-100 relative group">
                        {expFields.length > 1 && <button type="button" onClick={() => removeExp(idx)} className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-300 hover:text-rh-red transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>}
                        <div className="grid gap-6 sm:gap-8">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                            <div className="space-y-2">
                              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Title</label>
                              <input {...register(`experiences.${idx}.title`)} placeholder="e.g. Project Lead" className={`w-full px-5 py-3 sm:px-6 sm:py-4 bg-white border ${errors.experiences?.[idx]?.title ? 'border-red-500' : 'border-gray-100'} rounded-2xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-[13px] sm:text-sm font-medium placeholder:text-gray-300`} />
                              {errors.experiences?.[idx]?.title && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.experiences[idx]?.title?.message}</p>}
                            </div>
                            <div className="space-y-2">
                              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company</label>
                              <input {...register(`experiences.${idx}.company`)} placeholder="e.g. Tech Global" className={`w-full px-5 py-3 sm:px-6 sm:py-4 bg-white border ${errors.experiences?.[idx]?.company ? 'border-red-500' : 'border-gray-100'} rounded-2xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-[13px] sm:text-sm font-medium placeholder:text-gray-300`} />
                              {errors.experiences?.[idx]?.company && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.experiences[idx]?.company?.message}</p>}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Key Responsibilities</label>
                            <textarea rows={5} {...register(`experiences.${idx}.responsibilities`)} placeholder="Describe your achievements..." className={`w-full px-5 py-3 sm:px-6 sm:py-4 bg-white border ${errors.experiences?.[idx]?.responsibilities ? 'border-red-500' : 'border-gray-100'} rounded-2xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-[13px] sm:text-sm font-medium resize-none placeholder:text-gray-300`} />
                            {errors.experiences?.[idx]?.responsibilities && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.experiences[idx]?.responsibilities?.message}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 sm:pt-10 border-t border-gray-50">
                    <button type="button" onClick={goBack} className="text-gray-400 font-bold hover:text-rh-red flex items-center gap-2 transition-colors order-2 sm:order-1"><ArrowLeft className="w-5 h-5" /> Back</button>
                    <Button type="submit" disabled={isSubmitting} variant="primary" className="w-full sm:w-auto px-12 py-3.5 sm:py-5 bg-rh-teal hover:bg-[#0E8A8F] text-white rounded-[20px] shadow-2xl shadow-rh-teal/20 font-bold text-[13px] sm:text-base order-1 sm:order-2 flex items-center justify-center gap-2">
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Registration'}
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] sm:rounded-[60px] p-8 sm:p-16 lg:p-24 shadow-[0_30px_60px_rgb(0,0,0,0.05)] border border-gray-50 text-center">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-rh-teal/10 text-rh-teal rounded-[32px] sm:rounded-[44px] flex items-center justify-center mx-auto mb-6 sm:mb-10 shadow-xl shadow-rh-teal/10 border border-rh-teal/10">
                    <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-light text-rh-teal mb-4 sm:mb-6 tracking-tight leading-tight">Check your inbox!</h2>
                  <p className="text-gray-500 mb-3 sm:mb-4 text-base sm:text-lg font-medium max-w-md mx-auto leading-relaxed">
                    We've sent a verification link to your registered email address.
                  </p>
                  <p className="text-gray-400 mb-8 sm:mb-14 text-sm font-medium max-w-md mx-auto">
                    Please verify your email first, then you'll be able to sign in and access your dashboard.
                  </p>
                  <Button type="button" onClick={() => navigate('/signin')} variant="primary" className="w-full sm:w-auto px-12 sm:px-16 py-4 sm:py-6 bg-rh-teal hover:bg-[#0E8A8F] text-white rounded-[20px] sm:rounded-[28px] shadow-2xl shadow-rh-teal/20 font-bold text-lg sm:text-xl">Go to Sign In</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </main>
    </div>
  );
}
