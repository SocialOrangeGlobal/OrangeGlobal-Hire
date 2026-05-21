import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Zap, Globe2, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import { signUpPositionType } from '../data';
import { authApi } from '../lib/auth';
import { useAppDispatch } from '../store';
import { setLoading, setError as setAuthError } from '../store/slices/authSlice';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useGlobalLoader } from '../components/ui/GlobalLoader';

const employerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  businessPhone: z.string()
    .min(1, 'Business phone is required')
    .refine((val) => val.replace(/\D/g, '').length >= 5, {
      message: 'Business phone must have at least 5 digits',
    }),
  companyName: z.string().min(2, 'Company name is required'),
  jobTitle: z.string().min(2, 'Your job title is required'),
  jobTitleToHire: z.string().min(2, 'Job title to hire is required'),
  zipCode: z.string().min(2, 'Zip code is required'),
  positionType: z.string().min(1, 'Please select a position type'),
});

type EmployerFormData = z.infer<typeof employerSchema>;

export default function SignUpEmployer() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { executeWithLoader } = useGlobalLoader();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<EmployerFormData>({
    resolver: zodResolver(employerSchema),
    defaultValues: {
      positionType: ''
    }
  });

  const onSignUpSubmit = async (data: EmployerFormData) => {
    setError(null);
    try {
      await executeWithLoader(
        'Creating corporate account...',
        () => authApi.signUpEmployer(data),
        1500
      );
      setIsSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      dispatch(setAuthError(msg));
    }
  };

  const goBack = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/signup-choice');
  };

  return (
    <div className="bg-white min-h-screen pt-[72px] lg:pt-0 flex flex-col lg:flex-row font-sans overflow-x-hidden">
      <main className="flex-1 p-4 sm:p-12 lg:p-12 bg-[#f8f9fa] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 lg:p-12 border border-gray-100 py-8 lg:py-12 mx-auto lg:my-12"
        >
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <>
                <div className="mb-8 lg:mb-10">
                  <h1 className="text-xl sm:text-3xl font-bold text-[#081B2D] mb-2 tracking-tight">
                    Build Your Dream <span className="text-rh-red">Team</span>
                  </h1>
                  <p className="text-gray-500 text-sm sm:text-base font-medium">
                    Tell us about your organization and the role you're looking to fill and we'll handle the rest.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-medium mb-8 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8 lg:space-y-10"
                  onSubmit={handleSubmit(onSignUpSubmit)}
                >
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
                        <input {...register('firstName')} placeholder="e.g. John" className={`w-full px-5 py-3.5 sm:py-4 bg-[#F4F7FA] border ${errors.firstName ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300`} />
                        {errors.firstName && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.firstName.message}
                          </motion.p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                        <input {...register('lastName')} placeholder="e.g. Doe" className={`w-full px-5 py-3.5 sm:py-4 bg-[#F4F7FA] border ${errors.lastName ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300`} />
                        {errors.lastName && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.lastName.message}
                          </motion.p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Business Phone</label>
                        <input
                          type="tel"
                          {...register('businessPhone', {
                            onChange: (e) => {
                              e.target.value = e.target.value.replace(/[^\d+\s\-]/g, '');
                            }
                          })}
                          placeholder="+1 (555) 000-0000"
                          className={`w-full px-5 py-3.5 sm:py-4 bg-[#F4F7FA] border ${errors.businessPhone ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300`}
                        />
                        {errors.businessPhone && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.businessPhone.message}
                          </motion.p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Business Email</label>
                        <input type="email" {...register('email')} placeholder="john@company.com" className={`w-full px-5 py-3.5 sm:py-4 bg-[#F4F7FA] border ${errors.email ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300`} />
                        {errors.email && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.email.message}
                          </motion.p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                          <input type={showPassword ? 'text' : 'password'} {...register('password')} placeholder="At least 8 characters" className={`w-full px-5 py-3.5 sm:py-4 bg-[#F4F7FA] border ${errors.password ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300`} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rh-red transition-colors">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.password && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.password.message}
                          </motion.p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
                        <input {...register('companyName')} placeholder="e.g. Acme Corp" className={`w-full px-5 py-3.5 sm:py-4 bg-[#F4F7FA] border ${errors.companyName ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300`} />
                        {errors.companyName && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.companyName.message}
                          </motion.p>
                        )}
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Your Job Title</label>
                        <input {...register('jobTitle')} placeholder="e.g. Hiring Manager" className={`w-full px-5 py-3.5 sm:py-4 bg-[#F4F7FA] border ${errors.jobTitle ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300`} />
                        {errors.jobTitle && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.jobTitle.message}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </section>

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
                        <input {...register('jobTitleToHire')} placeholder="e.g. Senior Backend Developer" className={`w-full px-5 py-3.5 sm:py-4 bg-[#F4F7FA] border ${errors.jobTitleToHire ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300`} />
                        {errors.jobTitleToHire && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.jobTitleToHire.message}
                          </motion.p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Zip Code</label>
                        <input {...register('zipCode')} placeholder="e.g. 10001" className={`w-full px-5 py-3.5 sm:py-4 bg-[#F4F7FA] border ${errors.zipCode ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300`} />
                        {errors.zipCode && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.zipCode.message}
                          </motion.p>
                        )}
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Position Type</label>
                        <div className={`rounded-2xl border ${errors.positionType ? 'border-red-500 bg-red-50/10' : 'border-transparent'}`}>
                          <Controller
                            name="positionType"
                            control={control}
                            render={({ field }) => (
                              <Dropdown
                                options={signUpPositionType}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select position type"
                                className="w-full"
                              />
                            )}
                          />
                        </div>
                        {errors.positionType && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.positionType.message}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </section>

                  <div className="pt-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <button type="button" onClick={goBack} className="text-gray-400 font-bold hover:text-rh-red flex items-center gap-2 transition-colors text-sm sm:text-base">
                      <ArrowLeft className="w-5 h-5" /> Back to Choice
                    </button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      variant="primary"
                      className="w-full sm:w-auto px-12 py-3.5 sm:py-4 text-sm sm:text-lg font-bold bg-[#D71920] hover:bg-[#B41419] text-white rounded-2xl transition-all shadow-xl shadow-red-500/10 min-w-[220px] flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Registration'}
                    </Button>
                  </div>
                </motion.form>
              </>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 px-6"
              >
                <div className="w-24 h-24 bg-rh-teal/10 text-rh-teal rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-rh-teal/10 border border-rh-teal/10">
                  <ShieldCheck className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-rh-teal mb-4">Check your inbox!</h2>
                <p className="text-gray-500 mb-4 text-lg font-medium max-w-md mx-auto leading-relaxed">
                  We've sent a verification link to your registered business email.
                </p>
                <p className="text-gray-400 mb-10 text-sm font-medium max-w-md mx-auto">
                  Please verify your email first, then you'll be able to sign in and start hiring top talent.
                </p>
                <Button
                  onClick={() => navigate('/signin')}
                  variant="primary"
                  className="px-12 py-4 bg-rh-teal hover:bg-[#0E8A8F] text-white rounded-2xl shadow-2xl shadow-rh-teal/20 font-bold text-lg"
                >
                  Go to Sign In
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <aside className="w-full lg:w-[40%] relative flex flex-col justify-center p-6 md:p-12 lg:p-24 overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-100 min-h-[350px] md:min-h-[450px] lg:min-h-screen shrink-0">
        <div className="absolute inset-0 z-0 bg-rh-dark">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />
        </div>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative z-10 space-y-8 lg:space-y-12 text-center lg:text-left">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-4 lg:mb-6 leading-tight">Why partner with <br /><span className="text-rh-red font-normal italic">Orange Global?</span></h2>
            <p className="text-gray-200 text-sm sm:text-base lg:text-lg font-medium leading-relaxed max-w-sm mx-auto lg:mx-0 opacity-90">We connect you with the top 1% of global talent through our specialized recruitment process and AI-powered matching.</p>
          </div>
          <div className="space-y-6 lg:space-y-10 text-left">
            {[
              { icon: <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6" />, title: "Vetted Professionals", desc: "Every candidate undergoes rigorous technical and cultural assessment." },
              { icon: <Globe2 className="w-5 h-5 lg:w-6 lg:h-6" />, title: "Global Reach", desc: "Access talent from over 50 countries with simplified compliance." },
              { icon: <Zap className="w-5 h-5 lg:w-6 lg:h-6" />, title: "Speed to Hire", desc: "Reduce your recruitment cycle by up to 60% with our AI-matching." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 lg:gap-6 group">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-white/10 flex items-center justify-center text-rh-red shrink-0 group-hover:bg-rh-red group-hover:text-white transition-all duration-300 backdrop-blur-md">{item.icon}</div>
                <div className="space-y-1"><h4 className="text-white text-sm lg:text-base font-bold">{item.title}</h4><p className="text-gray-300 text-xs lg:text-sm leading-relaxed font-medium opacity-80">{item.desc}</p></div>
              </div>
            ))}
          </div>
          <div className="pt-8 lg:pt-10 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-3">{[1, 2, 3, 4].map(i => (<div key={i} className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-[#12161A] bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg"><img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" /></div>))}</div>
              <p className="text-xs lg:text-sm font-bold text-white/80">Joined by <span className="text-rh-red">500+</span> top organizations</p>
            </div>
          </div>
        </motion.div>
      </aside>
    </div>
  );
}
