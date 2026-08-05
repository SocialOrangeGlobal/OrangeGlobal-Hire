import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, AlertCircle, Save } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hasAtLeastOne: boolean;
  children: React.ReactNode;
}

export const FinancialDocumentsModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, hasAtLeastOne, children }) => {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (hasAtLeastOne) {
      setShowError(false);
    }
  }, [hasAtLeastOne]);

  const handleConfirm = () => {
    if (!hasAtLeastOne) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onConfirm();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-[24px] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Financial Documents</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Please upload at least one of the following.</p>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {children}
              </div>
              
              {showError && !hasAtLeastOne && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-600 text-sm font-bold flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <AlertCircle className="w-5 h-5 shrink-0" /> You must upload at least one financial document to save.
                </motion.p>
              )}
            </div>
            
            <div className="p-6 sm:p-8 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-4 bg-gray-50">
              <button onClick={onClose} className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button onClick={handleConfirm} className="w-full sm:w-auto px-10 py-3.5 rounded-xl font-bold text-white bg-rh-teal hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rh-teal/20">
                <Save className="w-5 h-5" /> Save Documents
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
