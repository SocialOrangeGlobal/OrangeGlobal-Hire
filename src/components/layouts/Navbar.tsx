import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrolled } from '../../hooks/useScrolled';
import { ChevronDown, Menu, X, Search } from 'lucide-react';
import { navItems } from '../../data';
import Button from '../ui/Button';

export default function Navbar() {
  const scrolled = useScrolled(60);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : searchOpen ? 'bg-[#12161A]' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-18' : 'h-18'}`}>
          <div className="flex items-center xl:gap-12 gap-8">
            {/* Logo */}
            <a href="#" className="flex items-center group relative">
              <img
                src="/images/brand-logo-dark.png"
                alt="Logo"
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-32 transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
              />
              <img
                src="/images/brand-logo-light.png"
                alt="Logo"
                className={`w-32 transition-opacity duration-300 ${scrolled ? 'opacity-0' : 'opacity-100'}`}
              />
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <a
                    href={item.href}
                    className={`flex items-center gap-1 px-4 py-2 text-md font-[500] rounded transition-colors ${scrolled
                      ? 'text-[#081B2D] hover:text-rh-red'
                      : 'text-white hover:text-rh-red'
                      }`}
                  >
                    {item.label}
                    {item.children && <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`} />}
                  </a>
                  {item.children && (
                    <AnimatePresence>
                      {openDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-4 w-64 bg-white rounded-[24px] shadow-2xl border border-gray-100 p-4 z-50 before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4"
                        >
                          <div className="flex flex-col gap-1">
                            {item.children.map((child) => (
                              <a
                                key={child.label}
                                href={child.href}
                                className="block px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-rh-red transition-all"
                              >
                                {child.label}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-6">
            <button
              className={`transition-colors flex items-center justify-center ${scrolled ? 'text-[#081B2D] hover:text-rh-red' : 'text-white hover:text-rh-red'}`}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-5 h-5" />
            </button>
            <a href="#signin" className={`text-md font-[500] transition-all ${scrolled ? 'text-[#081B2D] hover:text-rh-red' : 'text-white hover:text-rh-red'} hover:underline hover:underline-offset-4`}>
              Sign in
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`lg:hidden p-2 rounded transition-colors ${scrolled ? 'text-[#081B2D]' : 'text-white'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Search Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`absolute top-full left-0 right-0 overflow-hidden shadow-2xl border-t ${scrolled ? 'bg-white border-gray-100' : 'bg-[#12161A] border-white/10'}`}
            >
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="relative">
                  <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${scrolled ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Search"
                    className={`w-full pl-12 pr-4 py-4 rounded-full border outline-none text-lg transition-colors ${scrolled ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-rh-teal' : 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-white/30'}`}
                    autoFocus
                  />
                </div>
                <div className="mt-8">
                  <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 ${scrolled ? 'text-gray-500' : 'text-gray-400'}`}>Quick Links</h4>
                  <div className="flex flex-col gap-3">
                    {['Browse jobs', 'Find your next hire', 'Our locations'].map((link) => (
                      <a key={link} href="#" className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-800 hover:text-rh-red' : 'text-gray-300 hover:text-white'}`}>
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  <button
                    className="w-full text-left flex items-center justify-between px-3 py-3 text-sm font-semibold text-[#081B2D] hover:bg-gray-50 rounded"
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                  {item.children && openDropdown === item.label && (
                    <div className="ml-4 space-y-1 mt-1">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-rh-red"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 flex flex-col gap-3 border-t border-gray-100">
                <Button variant="outline" className="w-full">Find Jobs</Button>
                <Button variant="primary" className="w-full">Hire Talent</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header >
  );
}
