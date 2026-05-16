import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { authApi } from '../lib/auth';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setStep('success');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-[72px] lg:pt-0 flex flex-col lg:flex-row font-sans overflow-x-hidden">
      {/* Left Side: Professional Branding */}
      <div className="w-full lg:w-1/2 min-h-[350px] md:min-h-[450px] lg:min-h-screen relative flex items-center justify-center p-6 md:p-12 lg:p-24 border-b lg:border-b-0 lg:border-r border-gray-100 shrink-0 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0 bg-rh-dark">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />
        </div>

        <div className="relative z-10 max-w-md text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 lg:mb-6 tracking-tight leading-tight">
              Secure your <br />
              <span className="text-rh-red font-normal italic">Future</span>
            </h1>
            <p className="text-gray-200 text-sm sm:text-base lg:text-xl font-medium leading-relaxed max-w-sm mx-auto lg:mx-0 opacity-90">
              We take your security seriously. Follow the steps to safely reset your account access.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-8 lg:mt-12 flex items-center justify-center lg:justify-start gap-4 text-white/60 text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em]"
          >
            <div className="w-8 h-[1px] bg-white/30" />
            <ShieldCheck className="w-4 h-4 text-rh-red" />
            <span>Enterprise-Grade Security</span>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Reset Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-12 lg:p-16 bg-[#F8F9FA]">
        <div className="w-full max-w-[520px]">
          <AnimatePresence mode="wait">
            {step === 'email' ? (
              <motion.div
                key="email-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[32px] md:rounded-[48px] p-8 md:p-14 shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-100"
              >
                <button
                  onClick={() => navigate('/signin')}
                  className="flex items-center gap-2 text-gray-400 hover:text-rh-teal font-bold text-xs uppercase tracking-widest mb-10 transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Login
                </button>

                <h2 className="text-2xl md:text-3xl font-bold text-rh-teal mb-3">Forgot Password?</h2>
                <p className="text-gray-500 font-medium text-sm md:text-base mb-10 leading-relaxed">
                  Enter the email address associated with your account and we'll send you a recovery link.
                </p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full pl-14 pr-6 py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all text-gray-900 font-medium text-sm md:text-base"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-4.5 text-base font-bold bg-rh-teal hover:bg-[#0E8A8F] text-white rounded-2xl transition-all shadow-xl shadow-rh-teal/20 disabled:opacity-70 flex items-center justify-center gap-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-12 pt-8 border-t border-gray-50 text-center">
                  <p className="text-gray-400 text-xs md:text-sm">
                    Suddenly remembered? <Link to="/signin" className="text-rh-red font-bold hover:underline ml-1">Sign In</Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[40px] md:rounded-[60px] p-10 md:p-20 shadow-[0_30px_60px_rgb(0,0,0,0.05)] border border-gray-50 text-center"
              >
                <div className="w-20 h-20 md:w-28 md:h-28 bg-emerald-50 text-emerald-500 rounded-[28px] md:rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/5 border border-emerald-100">
                  <CheckCircle2 className="w-10 h-10 md:w-14 md:h-14" />
                </div>
                <h2 className="text-2xl md:text-4xl font-light text-rh-teal mb-4 tracking-tight leading-tight">Check your email</h2>
                <p className="text-gray-500 mb-10 text-sm md:text-lg font-medium max-w-sm mx-auto leading-relaxed">
                  We've sent a password recovery link to <span className="text-rh-teal font-bold">{email}</span>. Please check your inbox and spam folder.
                </p>
                <div className="space-y-4">
                  <Button
                    onClick={() => setStep('email')}
                    variant="outline"
                    className="w-full py-4 rounded-2xl text-sm font-bold border-gray-100 text-gray-500 hover:bg-gray-50"
                  >
                    Didn't receive it? Resend
                  </Button>
                  <Button
                    onClick={() => navigate('/signin')}
                    variant="primary"
                    className="w-full py-4 rounded-2xl text-sm font-bold bg-rh-teal text-white shadow-xl shadow-rh-teal/10"
                  >
                    Back to Login
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
