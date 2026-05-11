import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrolled } from '../../hooks/useScrolled';
import { ChevronDown, Menu, X, Search, ArrowLeft } from 'lucide-react';
import { navItems } from '../../data';
import Button from '../ui/Button';

export default function Navbar() {
  const scrolled = useScrolled(60);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      setMobileOpen(false);
      setSearchOpen(false);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isAuthPage = ['#signin', '#signup-employer', '#signup-talent', '#signup-choice'].includes(currentHash);

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${(scrolled || isAuthPage) ? 'bg-white shadow-sm' : (searchOpen || mobileOpen) ? 'bg-[#12161A]' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <div className="flex items-center gap-8 xl:gap-12">
            {/* Logo */}
            <a href="#" onClick={goHome} className="flex items-center group relative shrink-0">
              <div className={`flex items-center transition-all duration-300 ${scrolled || isAuthPage ? 'gap-3' : 'gap-0'}`}>
                <div className="relative">
                  <img
                    src="/images/brand-logo-dark.png"
                    alt="Logo"
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-36 sm:w-44 lg:w-52 transition-opacity duration-300 ${scrolled || isAuthPage ? 'opacity-100' : 'opacity-0'
                      }`}
                  />
                  <img
                    src="/images/brand-logo-light.png"
                    alt="Logo"
                    className={`w-36 sm:w-44 lg:w-52 transition-opacity duration-300 ${scrolled || isAuthPage ? 'opacity-0' : 'opacity-100'
                      }`}
                  />
                </div>
              </div>
            </a>

            {/* Desktop Nav - Hidden on Auth Pages */}
            {!isAuthPage && (
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
                      className={`flex items-center gap-1 px-4 py-2 text-[15px] font-[500] rounded transition-colors ${scrolled ? 'text-[#081B2D] hover:text-rh-red' : 'text-white hover:text-rh-red'
                        }`}
                    >
                      {item.label}
                      {item.children && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''
                            }`}
                        />
                      )}
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
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4 md:gap-6">
            {isAuthPage ? (
              <a
                href="#"
                onClick={goHome}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-rh-red/5 hover:text-rh-red transition-all group border border-gray-100"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap">Back to Home</span>
              </a>
            ) : (
              <>
                <div className="hidden lg:flex items-center gap-6">
                  <button
                    className={`transition-colors flex items-center justify-center ${scrolled ? 'text-[#081B2D] hover:text-rh-red' : 'text-white hover:text-rh-red'
                      }`}
                    onClick={() => setSearchOpen(!searchOpen)}
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <a
                    href="#signin"
                    className={`text-md font-[500] transition-all ${scrolled ? 'text-[#081B2D] hover:text-rh-red' : 'text-white hover:text-rh-red'
                      } hover:underline hover:underline-offset-4`}
                  >
                    Sign in
                  </a>
                </div>

                {/* Mobile Toggle */}
                <div className="flex items-center gap-2 lg:hidden">
                  <button
                    className={`p-2 rounded-full transition-colors ${scrolled ? 'text-[#081B2D] hover:bg-gray-100' : 'text-white hover:bg-white/10'
                      }`}
                    onClick={() => setSearchOpen(!searchOpen)}
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    className={`p-2 rounded-full transition-colors ${scrolled ? 'text-[#081B2D] hover:bg-gray-100' : 'text-white hover:bg-white/10'
                      }`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                  >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search Dropdown */}
      <AnimatePresence>
        {searchOpen && !isAuthPage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`absolute top-full left-0 right-0 overflow-hidden shadow-2xl border-t z-40 ${scrolled ? 'bg-white border-gray-100' : 'bg-[#12161A] border-white/10'
              }`}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
              <div className="relative">
                <Search
                  className={`absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 ${scrolled ? 'text-gray-400' : 'text-gray-500'
                    }`}
                />
                <input
                  type="text"
                  placeholder="Search jobs, talent, or insights..."
                  className={`w-full pl-12 md:pl-16 pr-6 py-4 md:py-6 rounded-2xl md:rounded-full border outline-none text-base md:text-xl transition-all ${scrolled
                    ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-rh-teal focus:bg-white'
                    : 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-white/30 focus:bg-white/10'
                    }`}
                  autoFocus
                />
              </div>
              <div className="mt-8 md:mt-12">
                <h4
                  className={`text-xs font-bold tracking-widest uppercase mb-6 ${scrolled ? 'text-gray-500' : 'text-gray-400'
                    }`}
                >
                  Quick Links
                </h4>
                <div className="flex flex-wrap gap-3 md:gap-4">
                  {[
                    'Browse jobs',
                    'Find your next hire',
                    'Our locations',
                    'Salary guide',
                    'Career advice',
                  ].map((link) => (
                    <a
                      key={link}
                      href="#"
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${scrolled
                        ? 'bg-gray-100 text-gray-800 hover:bg-rh-teal hover:text-white'
                        : 'bg-white/5 text-gray-300 hover:bg-white/20 hover:text-white'
                        }`}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && !isAuthPage && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed inset-0 top-[72px] z-40 lg:hidden overflow-y-auto transition-colors duration-300 ${scrolled ? 'bg-white' : 'bg-[#12161A]'
              }`}
          >
            <div className="flex flex-col min-h-[calc(100vh-72px)] p-6 pb-12">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <div key={item.label} className={`border-b last:border-none ${scrolled ? 'border-gray-50' : 'border-white/5'
                    }`}>
                    <button
                      className={`w-full text-left flex items-center justify-between py-4 text-lg font-bold transition-colors ${scrolled ? 'text-[#081B2D]' : 'text-white'
                        } active:text-rh-red`}
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    >
                      {item.label}
                      {item.children && (
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${openDropdown === item.label ? 'rotate-180' : ''
                            }`}
                        />
                      )}
                    </button>
                    <AnimatePresence>
                      {item.children && openDropdown === item.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className={`overflow-hidden rounded-2xl mb-4 ${scrolled ? 'bg-gray-50' : 'bg-white/5'
                            }`}
                        >
                          <div className="py-2 px-4 space-y-1">
                            {item.children.map((child) => (
                              <a
                                key={child.label}
                                href={child.href}
                                className={`block py-3 text-base font-medium transition-colors ${scrolled ? 'text-gray-600' : 'text-gray-300'
                                  } hover:text-rh-red`}
                              >
                                {child.label}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-10 space-y-4">
                <a
                  href="#signin"
                  className={`block w-full text-center py-4 text-lg font-bold rounded-2xl transition-all`}
                >
                  <Button size="lg" className="w-full py-5 text-lg font-bold rounded-2xl shadow-xl">
                    Sign In
                  </Button>
                </a>
                <div className="flex justify-center gap-6 pt-6">
                  {['Linkedin', 'Twitter', 'Facebook'].map((social) => (
                    <a key={social} href="#" className="text-gray-400 hover:text-rh-teal transition-colors">
                      <span className="text-sm font-bold">{social}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
