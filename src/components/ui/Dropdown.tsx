import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select option',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-4 px-5 py-3.5 bg-white border rounded-2xl transition-all duration-300 group ${
          isOpen ? 'border-rh-red ring-4 ring-rh-red/5' : 'border-gray-100 hover:border-gray-200'
        }`}
      >
        <span className={`text-sm font-bold ${selectedOption ? 'text-rh-teal' : 'text-gray-400'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-rh-red' : 'group-hover:text-rh-teal'}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute z-50 left-0 right-0 mt-3 bg-white border border-gray-100 rounded-[24px] shadow-2xl overflow-hidden p-2"
          >
            <div className="max-h-60 overflow-y-auto no-scrollbar">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                    value === option.value 
                    ? 'bg-rh-red/5 text-rh-red' 
                    : 'text-gray-600 hover:bg-rh-light hover:text-rh-teal'
                  }`}
                >
                  {option.label}
                  {value === option.value && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
