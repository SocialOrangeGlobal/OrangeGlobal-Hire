import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { authApi } from '../lib/auth';
import { useAppDispatch } from '../store';
import { setCredentials, setLoading, setError as setAuthError } from '../store/slices/authSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useGlobalLoader } from '../components/ui/GlobalLoader';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'talent' | 'employer'>('talent');
  const [error, setError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState(false);
  const { executeWithLoader } = useGlobalLoader();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSignInSubmit = async (data: SignInFormData) => {
    setError(null);
    setUnverifiedEmail(false);
    try {
      const response = await executeWithLoader(
        'Signing in securely...',
        () => authApi.signIn({
          ...data,
          role: activeTab === 'talent' ? 'TALENT' : 'EMPLOYER',
        }),
        1200
      );

      dispatch(setCredentials({
        user: response.data.user,
        accessToken: response.data.accessToken
      }));

      // Redirect to Home page after successful sign in
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Authentication failed';
      // Detect the email verification error specifically
      if (msg.toLowerCase().includes('verify your email')) {
        setUnverifiedEmail(true);
      } else {
        setError(msg);
      }
      dispatch(setAuthError(msg));
    }
  };

  return (
    <div className="bg-white min-h-screen pt-20 lg:pt-0 flex flex-col lg:flex-row font-sans overflow-x-hidden">
      <div className="w-full lg:w-1/2 min-h-[350px] md:min-h-[450px] lg:min-h-screen relative flex items-center justify-center p-6 md:p-12 lg:p-24 border-b lg:border-b-0 lg:border-r border-gray-100 shrink-0 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-rh-dark">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />
        </div>
        <div className="relative z-10 max-w-md text-center lg:text-left">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 lg:mb-6 tracking-tight leading-tight">Welcome to <br /><span className="text-rh-red font-normal italic">Orange Global</span></h1>
            <p className="text-gray-200 text-sm sm:text-base lg:text-xl font-medium leading-relaxed max-w-sm mx-auto lg:mx-0 opacity-90">Access your account and explore elite opportunities waiting for you across the globe.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="mt-8 lg:mt-12 flex items-center justify-center lg:justify-start gap-4 text-white/60 text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em]">
            <div className="w-8 h-[1px] bg-white/30" />
            <span>Trusted by global leaders</span>
          </motion.div>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-12 lg:p-16 bg-white overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-[440px] py-8 lg:py-12">
          <div className="hidden bg-gray-100 p-1 rounded-2xl mb-8 lg:mb-10">
            <button onClick={() => { setActiveTab('talent'); setError(null); setUnverifiedEmail(false); }} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'talent' ? 'bg-white text-rh-teal shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Talent</button>
            <button onClick={() => { setActiveTab('employer'); setError(null); setUnverifiedEmail(false); }} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'employer' ? 'bg-white text-rh-teal shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Employer</button>
          </div>

          <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} className="space-y-6">
            {/* Generic error */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-shake flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email not verified warning */}
            {unverifiedEmail && (
              <div className="bg-rh-teal/5 border border-rh-teal/20 rounded-xl px-4 py-4 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rh-teal flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01" /></svg>
                </div>
                <div>
                  <p className="text-rh-teal font-bold text-sm mb-0.5">Email not verified</p>
                  <p className="text-gray-500 text-xs leading-relaxed">Please check your inbox and click the verification link we sent you. Once verified, you can sign in.</p>
                </div>
              </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmit(onSignInSubmit)}>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input {...register('email')} className={`w-full px-5 py-4 bg-[#F4F7FA] border ${errors.email ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all text-gray-900 font-medium`} placeholder="name@example.com" />
                {errors.email && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.email.message}
                  </motion.p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} {...register('password')} className={`w-full px-5 py-4 bg-[#F4F7FA] border ${errors.password ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all text-gray-900 font-medium`} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rh-teal transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.password.message}
                  </motion.p>
                )}
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-rh-red focus:ring-rh-red" />
                  <span className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-700">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-xs sm:text-sm font-bold text-rh-teal hover:text-rh-red transition-colors">Forgot Password?</Link>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full py-4 text-base font-bold bg-[#081B2D] hover:bg-rh-teal text-white rounded-2xl transition-all shadow-lg shadow-blue-900/10 mt-2 flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              </Button>
            </form>
            <div className="pt-8 text-center"><p className="text-gray-500 text-sm">Don't have an account? <Link to="/signup-choice" className="text-rh-red font-bold hover:underline underline-offset-4 ml-1">Sign Up</Link></p></div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
