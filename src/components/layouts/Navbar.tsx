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
      setOpenDropdown(null);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isSubPage = [
    '#signin', '#signup-employer', '#signup-talent', '#signup-choice', '#forgot-password',
    '#jobs', '#hire-talent', '#consulting', '#insights', '#post-vacancy', '#contact',
    '#employer-dashboard', '#talent-dashboard'
  ].some(path => currentHash.startsWith(path)) || currentHash.startsWith('#apply-job');

  const isAuthPage = ['#signin', '#signup-employer', '#signup-talent', '#signup-choice', '#forgot-password'].some(path => currentHash.startsWith(path));

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '';
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('header')) {
        setOpenDropdown(null);
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const activePanel = searchOpen ? '__search__' : openDropdown;

  const handleNavEnter = (label: string, hasChildren: boolean) => {
    if (!hasChildren) return;
    setSearchOpen(false);
    setOpenDropdown(label);
  };

  const handleNavLeave = () => {
    setOpenDropdown(null);
  };

  const handleSearchToggle = () => {
    setOpenDropdown(null);
    setSearchOpen((prev) => !prev);
  };

  const panelOpen = activePanel !== null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${scrolled || isAuthPage || isSubPage || currentHash.startsWith('#apply-job')
        ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
        : panelOpen || mobileOpen
          ? 'bg-[#12161A]'
          : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <div className="flex items-center gap-6 xl:gap-10 h-full">
            {/* Logo */}
            <a href="#" onClick={goHome} className="flex items-center group relative shrink-0 h-full">
              <div className={`flex items-center transition-all duration-300 ${scrolled || isAuthPage || isSubPage ? 'gap-3' : 'gap-0'}`}>
                <div className="relative flex items-center h-[32px] sm:h-[40px] lg:h-[48px]">
                  <img
                    src="/images/brand-logo-dark.png"
                    alt="Logo"
                    className={`absolute left-0 w-32 sm:w-44 lg:w-48 transition-opacity duration-300 ${scrolled || isAuthPage || isSubPage ? 'opacity-100' : 'opacity-0'
                      }`}
                  />
                  <img
                    src="/images/brand-logo-light.png"
                    alt="Logo"
                    className={`w-32 sm:w-44 lg:w-48 transition-opacity duration-300 ${scrolled || isAuthPage || isSubPage ? 'opacity-0' : 'opacity-100'
                      }`}
                  />
                </div>
              </div>
            </a>

            {/* Desktop Nav */}
            {!isAuthPage && (
              <nav className="hidden xl:flex items-center gap-1 xl:gap-2 h-full">
                {navItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative flex items-center h-full"
                    onMouseEnter={() => handleNavEnter(item.label, !!item.children)}
                    onMouseLeave={handleNavLeave}
                  >
                    <a
                      href={item.href}
                      className={`flex items-center gap-1.5 px-3 xl:px-5 py-2 text-[13px] xl:text-[15px] 2xl:text-[16px] font-[500] rounded-lg transition-all ${scrolled || isAuthPage || isSubPage
                        ? 'text-rh-teal hover:text-rh-red hover:bg-rh-light'
                        : 'text-white hover:text-rh-red hover:bg-white/10'
                        } ${openDropdown === item.label ? 'text-rh-red' : ''}`}
                    >
                      {item.label}
                      {item.children && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 xl:w-4 xl:h-4 transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''
                            }`}
                        />
                      )}
                    </a>
                  </div>
                ))}
              </nav>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4 xl:gap-8 h-full">
            {isAuthPage ? (
              <div className="flex items-center h-full">
                <a
                  href="#"
                  onClick={goHome}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-500 hover:bg-rh-red/5 hover:text-rh-red transition-all group border border-gray-100"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="hidden sm:block text-[10px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap">Back to Home</span>
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-6 xl:gap-8 h-full">
                <div className="hidden xl:flex items-center gap-6 h-full">
                  <button
                    className={`transition-colors flex items-center justify-center p-2 rounded-full hover:bg-black/5 ${scrolled || isSubPage || isAuthPage || currentHash.startsWith('#apply-job') ? 'text-rh-teal hover:text-rh-red' : 'text-white hover:text-rh-red'
                      } ${searchOpen ? 'text-rh-red bg-black/5' : ''}`}
                    onClick={handleSearchToggle}
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <a
                    href="#signin"
                    className={`text-[14px] xl:text-[15px] 2xl:text-[16px] font-[500] transition-all flex items-center h-full ${scrolled || isAuthPage || isSubPage ? 'text-rh-teal hover:text-rh-red' : 'text-white hover:text-rh-red'
                      } hover:underline hover:underline-offset-8`}
                  >
                    Sign in
                  </a>
                </div>

                {/* Mobile Toggle */}
                <div className="flex items-center gap-2 xl:hidden">
                  <button
                    className={`p-2 rounded-full transition-colors ${scrolled || isSubPage || isAuthPage || currentHash.startsWith('#apply-job') ? 'text-rh-teal hover:bg-gray-100' : 'text-white hover:bg-white/10'
                      }`}
                    onClick={handleSearchToggle}
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    className={`p-2 rounded-full transition-colors ${scrolled || isSubPage || isAuthPage || currentHash.startsWith('#apply-job') ? 'text-rh-teal hover:bg-gray-100' : 'text-white hover:bg-white/10'
                      }`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                  >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Full-width Dropdown Panel (Search + Nav items) ─── */}
      <AnimatePresence>
        {activePanel && (
          <motion.div
            key={activePanel}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className={`absolute top-full left-0 right-0 overflow-hidden shadow-2xl border-t z-40 transition-colors duration-300 ${scrolled || isSubPage || isAuthPage || currentHash.startsWith('#apply-job') ? 'bg-white border-gray-100' : 'bg-[#12161A] border-white/10'
              }`}
            onMouseEnter={() => {
              if (activePanel !== '__search__') setOpenDropdown(activePanel);
            }}
            onMouseLeave={() => {
              if (activePanel !== '__search__') setOpenDropdown(null);
            }}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
              {/* ── Search panel ── */}
              {activePanel === '__search__' && (
                <>
                  <div className="relative">
                    <Search
                      className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search jobs, talent, or insights..."
                      className={`w-full pl-12 md:pl-16 pr-6 py-4 md:py-6 rounded-2xl md:rounded-full border outline-none text-base md:text-xl transition-all ${scrolled || isSubPage || isAuthPage || currentHash.startsWith('#apply-job')
                        ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-rh-teal focus:bg-white'
                        : 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-white/30 focus:bg-white/10'
                        }`}
                      autoFocus
                    />
                  </div>
                  <div className="mt-8 md:mt-12">
                    <h4
                      className="text-xs font-bold tracking-widest uppercase mb-6 text-gray-500"
                    >
                      Quick Links
                    </h4>
                    <div className="flex flex-wrap gap-3 md:gap-4">
                      {['Browse jobs', 'Find your next hire', 'Our locations', 'Salary guide', 'Career advice'].map(
                        (link) => (
                          <a
                            key={link}
                            href={link === 'Browse jobs' ? '#jobs' : '#'}
                            onClick={() => {
                              setOpenDropdown(null);
                              setSearchOpen(false);
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${scrolled || isSubPage || isAuthPage || currentHash.startsWith('#apply-job')
                              ? 'bg-gray-100 text-gray-800 hover:bg-rh-teal hover:text-white'
                              : 'bg-white/5 text-gray-200 hover:bg-white/20 hover:text-white'
                              }`}
                          >
                            {link}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ── Nav item dropdown panel ── */}
              {activePanel !== '__search__' && (() => {
                const item = navItems.find((n) => n.label === activePanel);
                if (!item?.children) return null;
                return (
                  <>
                    <h4
                      className="text-xs font-bold tracking-widest uppercase mb-6 text-gray-500"
                    >
                      {item.label}
                    </h4>
                    <div className="flex flex-wrap gap-3 md:gap-4">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          onClick={() => setOpenDropdown(null)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${scrolled || isSubPage || isAuthPage || currentHash.startsWith('#apply-job')
                            ? 'bg-gray-100 text-gray-800 hover:bg-rh-teal hover:text-white'
                            : 'bg-white/5 text-gray-200 hover:bg-white/20 hover:text-white'
                            }`}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Mobile Menu ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed inset-0 top-[72px] z-40 xl:hidden overflow-y-auto transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${scrolled || isAuthPage || isSubPage ? 'bg-white' : 'bg-[#12161A]'
              }`}
          >
            <div className="flex flex-col min-h-[calc(100vh-72px)] p-6 pb-12">
              <div className="space-y-2">
                <div className={`border-b ${scrolled ? 'border-gray-50' : 'border-white/5'}`}>
                  <a
                    href="#"
                    onClick={() => setMobileOpen(false)}
                    className={`w-full block py-3 sm:py-4 text-base sm:text-lg lg:text-xl font-bold transition-colors ${scrolled || isAuthPage || isSubPage ? 'text-rh-teal' : 'text-white'} active:text-rh-red`}
                  >
                    Home
                  </a>
                </div>
                {navItems.map((item) => (
                  <div
                    key={item.label}
                    className={`border-b last:border-none ${scrolled || isAuthPage || isSubPage ? 'border-gray-50' : 'border-white/5'}`}
                  >
                    <div className="flex items-center justify-between py-3 sm:py-4">
                      <a
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`text-base sm:text-lg lg:text-xl font-bold transition-colors ${scrolled || isAuthPage || isSubPage ? 'text-rh-teal' : 'text-white'} active:text-rh-red`}
                      >
                        {item.label}
                      </a>

                      {item.children && (
                        <button
                          onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                          className={`p-2 -mr-2 rounded-lg transition-colors ${scrolled || isAuthPage || isSubPage ? 'hover:bg-gray-100' : 'hover:bg-white/5'}`}
                        >
                          <ChevronDown
                            className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${openDropdown === item.label ? 'rotate-180 text-rh-red' : scrolled || isAuthPage || isSubPage ? 'text-gray-400' : 'text-white/40'}`}
                          />
                        </button>
                      )}
                    </div>
                    <AnimatePresence>
                      {item.children && openDropdown === item.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mb-4"
                        >
                          <div className="flex flex-wrap gap-3 pb-2">
                            {item.children.map((child) => (
                              <a
                                key={child.label}
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${scrolled || isAuthPage || isSubPage
                                  ? 'bg-gray-100 text-gray-800 hover:bg-rh-teal hover:text-white'
                                  : 'bg-white/5 text-gray-300 hover:bg-white/20 hover:text-white'
                                  }`}
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

              <div className="mt-auto pt-8 sm:pt-10 space-y-4">
                <a
                  href="#signin"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center py-3 sm:py-4 transition-all"
                >
                  <Button size="lg" className="w-full py-4 sm:py-5 text-base sm:text-lg font-bold rounded-2xl shadow-xl">
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
