import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobalLoaderContextType {
  showLoader: (message?: string) => void;
  hideLoader: () => void;
  executeWithLoader: <T>(message: string, promiseFn: () => Promise<T>, delay?: number) => Promise<T>;
}

const GlobalLoaderContext = createContext<GlobalLoaderContextType | undefined>(undefined);

export const GlobalLoaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Loading...');

  const showLoader = (msg = 'Loading...') => {
    setMessage(msg);
    setIsLoading(true);
  };

  const hideLoader = () => {
    setIsLoading(false);
  };

  const executeWithLoader = async <T,>(
    msg: string,
    promiseFn: () => Promise<T>,
    delay = 1000
  ): Promise<T> => {
    setMessage(msg);
    setIsLoading(true);
    const startTime = Date.now();
    try {
      const result = await promiseFn();
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, delay - elapsedTime);
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }
      return result;
    } catch (error) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, delay - elapsedTime);
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlobalLoaderContext.Provider value={{ showLoader, hideLoader, executeWithLoader }}>
      {children}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-rh-dark/60 backdrop-blur-xl pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white/10 backdrop-blur-md border border-white/10 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl max-w-xs sm:max-w-sm w-full mx-4 text-center flex flex-col items-center"
            >
              {/* Outer Circular spinning track */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-6 sm:mb-8 flex items-center justify-center">
                {/* Brand-red glow background */}
                <div className="absolute inset-0 bg-rh-red/20 rounded-full blur-xl animate-pulse" />
                
                {/* Rotating track spinner */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-white/5"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-rh-red"
                    strokeWidth="4"
                    strokeDasharray="250"
                    strokeDashoffset="100"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    style={{
                      animation: 'spin 1.5s linear infinite',
                      transformOrigin: '50px 50px',
                    }}
                  />
                </svg>

                {/* Pulsating Favicon inside */}
                <motion.img
                  src="/images/logo-icon.png"
                  alt="Loading"
                  className="w-10 h-10 sm:w-12 sm:h-12 relative z-10"
                  animate={{
                    scale: [0.95, 1.08, 0.95],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* Message */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-base sm:text-lg font-bold tracking-tight mb-2"
              >
                {message}
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.2 }}
                className="text-white/60 text-xs font-semibold tracking-widest uppercase"
              >
                Orange Global Staffing
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </GlobalLoaderContext.Provider>
  );
};

export const useGlobalLoader = () => {
  const context = useContext(GlobalLoaderContext);
  if (!context) {
    throw new Error('useGlobalLoader must be used within a GlobalLoaderProvider');
  }
  return context;
};
