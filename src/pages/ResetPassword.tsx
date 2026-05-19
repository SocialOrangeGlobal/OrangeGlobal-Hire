import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, CheckCircle2, ShieldCheck, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { authApi } from '../lib/auth';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; general?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { password?: string; confirmPassword?: string; general?: string } = {};

    if (!password) newErrors.password = 'Password is required.';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters.';

    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password.';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

    if (!token) newErrors.general = 'Invalid reset token.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      await authApi.resetPassword({ token: token!, newPassword: password });
      setStep('success');
    } catch (err: any) {
      setErrors({ general: err.response?.data?.message || 'Failed to reset password. The link may have expired.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && step === 'form') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Link</h2>
          <p className="text-gray-500 mb-8">This password reset link is invalid or has expired. Please request a new one.</p>
          <Link to="/forgot-password">
            <Button className="w-full bg-rh-teal hover:bg-[#0E8A8F] text-white py-3 rounded-xl">
              Go to Forgot Password
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-[72px] lg:pt-0 flex flex-col lg:flex-row font-sans overflow-x-hidden">
      {/* Left Side: Professional Branding */}
      <div className="w-full lg:w-1/2 min-h-[350px] md:min-h-[450px] lg:min-h-screen relative flex items-center justify-center p-6 md:p-12 lg:p-24 border-b lg:border-b-0 lg:border-r border-gray-100 shrink-0 overflow-hidden">
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
              Create a <br />
              <span className="text-rh-red font-normal italic">Stronger</span> Secure
            </h1>
            <p className="text-gray-200 text-sm sm:text-base lg:text-xl font-medium leading-relaxed max-w-sm mx-auto lg:mx-0 opacity-90">
              Ensure your new password is unique and contains a mix of characters for maximum security.
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
            {step === 'form' ? (
              <motion.div
                key="form-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[32px] md:rounded-[48px] p-8 md:p-14 shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-100"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-rh-teal mb-3">Reset Password</h2>
                <p className="text-gray-500 font-medium text-sm md:text-base mb-10 leading-relaxed">
                  Enter your new password below to regain access to your account.
                </p>

                {errors.general && (
                  <div className="bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl text-sm font-medium mb-6 flex items-center gap-3 animate-shake">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errors.general}</span>
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(prev => ({ ...prev, password: '' })); }}
                        placeholder="••••••••"
                        className={`w-full pl-14 pr-12 py-4 bg-[#F4F7FA] border ${errors.password ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all text-gray-900 font-medium text-sm md:text-base`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.password}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' })); }}
                        placeholder="••••••••"
                        className={`w-full pl-14 pr-12 py-4 bg-[#F4F7FA] border ${errors.confirmPassword ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all text-gray-900 font-medium text-sm md:text-base`}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.confirmPassword}
                      </motion.p>
                    )}
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
                        Reset Password
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-12 pt-8 border-t border-gray-50 text-center">
                  <p className="text-gray-400 text-xs md:text-sm">
                    Back to <Link to="/signin" className="text-rh-red font-bold hover:underline ml-1">Sign In</Link>
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
                <h2 className="text-2xl md:text-4xl font-light text-rh-teal mb-4 tracking-tight leading-tight">Password Reset!</h2>
                <p className="text-gray-500 mb-10 text-sm md:text-lg font-medium max-w-sm mx-auto leading-relaxed">
                  Your password has been successfully updated. You can now use your new password to sign in.
                </p>
                <Button
                  onClick={() => navigate('/signin')}
                  variant="primary"
                  className="w-full py-4 rounded-2xl text-sm font-bold bg-rh-teal text-white shadow-xl shadow-rh-teal/10"
                >
                  Sign In Now
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
