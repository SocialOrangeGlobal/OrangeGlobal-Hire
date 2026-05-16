import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ShieldCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import { authApi } from '../lib/auth';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const verifyingRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found.');
      return;
    }

    if (verifyingRef.current) return;
    verifyingRef.current = true;

    const verify = async () => {
      try {
        const res = await authApi.verifyEmail(token);
        setStatus('success');
        setMessage(res.message || 'Your email has been successfully verified.');
      } catch (error: any) {
        setStatus('error');
        const errMsg = error.response?.data?.message || error.response?.data?.error || 'Verification failed. The link may have expired or is invalid.';
        setMessage(errMsg);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="bg-white min-h-screen pt-[72px] lg:pt-0 flex flex-col lg:flex-row font-sans overflow-x-hidden">
      {/* Left Side: Professional Branding */}
      <div className="w-full lg:w-1/2 min-h-[350px] md:min-h-[450px] lg:min-h-screen relative flex items-center justify-center p-6 md:p-12 lg:p-24 border-b lg:border-b-0 lg:border-r border-gray-100 shrink-0 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-rh-dark">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />
        </div>

        <div className="relative z-10 max-w-md text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 lg:mb-6 tracking-tight leading-tight">
              One Step <br />
              <span className="text-rh-red font-normal italic">Closer</span>
            </h1>
            <p className="text-gray-200 text-sm sm:text-base lg:text-xl font-medium leading-relaxed max-w-sm mx-auto lg:mx-0 opacity-90">
              Verifying your email ensures your account is secure and you receive important updates.
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
            <span>Identity Verified</span>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Status Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-12 lg:p-16 bg-[#F8F9FA]">
        <div className="w-full max-w-[520px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] md:rounded-[60px] p-10 md:p-20 shadow-[0_30px_60px_rgb(0,0,0,0.05)] border border-gray-50 text-center"
          >
            {status === 'loading' && (
              <>
                <div className="w-20 h-20 md:w-28 md:h-28 bg-rh-teal/5 text-rh-teal rounded-[28px] md:rounded-[40px] flex items-center justify-center mx-auto mb-8 animate-pulse">
                  <Loader2 className="w-10 h-10 md:w-14 md:h-14 animate-spin" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-rh-teal mb-4">Verifying Email...</h2>
                <p className="text-gray-500 text-sm md:text-lg font-medium max-w-sm mx-auto leading-relaxed">
                  Please wait while we confirm your email address. This will only take a moment.
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-20 h-20 md:w-28 md:h-28 bg-emerald-50 text-emerald-500 rounded-[28px] md:rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/5 border border-emerald-100">
                  <CheckCircle2 className="w-10 h-10 md:w-14 md:h-14" />
                </div>
                <h2 className="text-2xl md:text-4xl font-light text-rh-teal mb-4 tracking-tight leading-tight">Verified!</h2>
                <p className="text-gray-500 mb-10 text-sm md:text-lg font-medium max-w-sm mx-auto leading-relaxed">
                  {message}
                </p>
                <Button
                  onClick={() => navigate('/signin')}
                  variant="primary"
                  className="w-full py-4 rounded-2xl text-sm font-bold bg-rh-teal text-white shadow-xl shadow-rh-teal/10"
                >
                  Proceed to Sign In
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-20 h-20 md:w-28 md:h-28 bg-red-50 text-red-500 rounded-[28px] md:rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-red-500/5 border border-red-100">
                  <XCircle className="w-10 h-10 md:w-14 md:h-14" />
                </div>
                <h2 className="text-2xl md:text-4xl font-light text-rh-teal mb-4 tracking-tight leading-tight">Verification Failed</h2>
                <p className="text-gray-500 mb-10 text-sm md:text-lg font-medium max-w-sm mx-auto leading-relaxed">
                  {message}
                </p>
                <div className="space-y-4">
                  <Button
                    onClick={() => navigate('/signup')}
                    variant="primary"
                    className="w-full py-4 rounded-2xl text-sm font-bold bg-rh-teal text-white"
                  >
                    Try Registering Again
                  </Button>
                  <Link to="/" className="block text-gray-400 text-sm font-bold hover:text-rh-teal transition-colors">
                    Back to Home
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
