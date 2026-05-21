import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { DropdownProps } from '../../types';

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select option',
  className = '',
  triggerClassName = '',
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions =
    searchable && searchQuery.trim()
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

  // Reset search / focus on open/close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    } else if (searchable) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  }, [isOpen, searchable]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
  }, []);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  // Highlight matching text in options
  const renderHighlightedLabel = (optLabel: string) => {
    if (!searchQuery.trim()) return <span>{optLabel}</span>;
    const idx = optLabel.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (idx === -1) return <span>{optLabel}</span>;
    return (
      <span>
        {optLabel.slice(0, idx)}
        <mark
          className="bg-rh-teal/15 text-rh-teal rounded not-italic font-bold"
          style={{ padding: '0 2px' }}
        >
          {optLabel.slice(idx, idx + searchQuery.length)}
        </mark>
        {optLabel.slice(idx + searchQuery.length)}
      </span>
    );
  };

  return (
    // Outer wrapper: only relative + user-supplied className for layout
    <div className={`relative ${className}`} ref={dropdownRef} onKeyDown={handleKeyDown}>
      {label && (
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
          {label}
        </label>
      )}

      {/* ── Trigger Button ────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`
          w-full flex items-center gap-2
          px-4 sm:px-5 py-2.5 sm:py-3.5
          bg-white border rounded-xl sm:rounded-2xl
          transition-all duration-200 group text-left
          ${isOpen
            ? 'border-rh-teal ring-2 ring-rh-teal/10 shadow-sm'
            : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'}
          ${triggerClassName}
        `}
      >
        <span
          className={`flex-1 min-w-0 truncate text-xs sm:text-sm font-semibold ${
            selectedOption ? 'text-rh-teal' : 'text-gray-400'
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <ChevronDown
          className={`shrink-0 w-4 h-4 transition-all duration-200 ${
            isOpen ? 'rotate-180 text-rh-teal' : 'text-gray-300 group-hover:text-gray-500'
          }`}
        />
      </button>

      {/* ── Dropdown Panel ────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="listbox"
            className="
              absolute z-[9999] left-0 right-0 mt-1.5
              bg-white border border-gray-100
              rounded-xl sm:rounded-2xl
              shadow-[0_8px_30px_rgba(0,0,0,0.09)]
              overflow-hidden
            "
          >
            {/* Search bar — only rendered when searchable */}
            {searchable && (
              <div className="px-2 pt-2 pb-1.5 border-b border-gray-100 bg-gray-50/60">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') { setIsOpen(false); e.stopPropagation(); }
                      if (e.key === 'Enter' && filteredOptions.length > 0) {
                        handleSelect(filteredOptions[0].value);
                        e.preventDefault();
                      }
                    }}
                    placeholder="Type to search..."
                    className="
                      w-full pl-8 pr-8
                      py-2 text-xs sm:text-sm
                      bg-white border border-gray-200
                      rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-rh-teal/15 focus:border-rh-teal
                      transition-all font-medium text-gray-700
                      placeholder:text-gray-300 placeholder:font-normal
                    "
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="
                        absolute right-2.5 top-1/2 -translate-y-1/2
                        w-4 h-4 flex items-center justify-center
                        rounded-full text-gray-400
                        hover:text-gray-600 hover:bg-gray-100
                        transition-all
                      "
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options list */}
            <div
              className="
                overflow-y-auto p-1.5
                max-h-[200px] sm:max-h-[240px]
                [&::-webkit-scrollbar]:w-[3px]
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-gray-200
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb:hover]:bg-gray-300
              "
            >
              {filteredOptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-5 text-gray-400">
                  <span className="text-xl mb-1">🔍</span>
                  <p className="text-xs font-semibold">
                    No results for &ldquo;{searchQuery}&rdquo;
                  </p>
                  <p className="text-[10px] text-gray-300 mt-0.5">Try a different spelling</p>
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = value === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(option.value)}
                      className={`
                        w-full flex items-center justify-between gap-2
                        px-3 sm:px-3.5 py-2 sm:py-2.5
                        rounded-lg sm:rounded-xl
                        text-[11px] sm:text-xs font-semibold
                        transition-all duration-100 text-left
                        ${isSelected
                          ? 'bg-rh-teal/8 text-rh-teal'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-rh-teal'}
                      `}
                    >
                      <span className="truncate">
                        {renderHighlightedLabel(option.label)}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="shrink-0"
                        >
                          <Check className="w-3.5 h-3.5 text-rh-teal" />
                        </motion.div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer count — only when list is large */}
            {options.length > 8 && (
              <div className="border-t border-gray-50 px-3 py-1.5 flex items-center justify-between bg-gray-50/40">
                <span className="text-[10px] text-gray-300 font-medium">
                  {filteredOptions.length} of {options.length}
                </span>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="text-[10px] text-rh-teal font-semibold hover:underline"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
