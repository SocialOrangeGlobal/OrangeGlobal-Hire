import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrolled } from '../../hooks/useScrolled';
import { ChevronDown, Menu, X, Search, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navItems } from '../../data';
import Button from '../ui/Button';
import { useAppSelector, useAppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { authApi } from '../../lib/auth';
import { useGlobalLoader } from '../ui/GlobalLoader';

export default function Navbar() {
  const scrolled = useScrolled(60);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const pathname = location.pathname;
  const { executeWithLoader } = useGlobalLoader();

  const handleSignOut = async () => {
    try {
      await executeWithLoader(
        'Signing out securely...',
        async () => {
          try {
            await authApi.signOut();
          } catch (e) {
            console.error('Failed to sign out on backend', e);
          }
          dispatch(logout());
        },
        1000
      );
      navigate('/');
    } catch (err) {
      console.error(err);
      dispatch(logout());
      navigate('/');
    }
  };

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const isSubPage = [
    '/signin', '/signup-employer', '/signup-talent', '/signup-choice', '/forgot-password', '/reset-password', '/verify-email',
    '/jobs', '/hire-talent', '/consulting', '/insights', '/post-vacancy', '/contact',
    '/employer-dashboard', '/talent-dashboard', '/apply-job', '/manage-profile'
  ].some(path => pathname.startsWith(path));

  const isAuthPage = ['/signin', '/signup-employer', '/signup-talent', '/signup-choice', '/forgot-password', '/reset-password', '/verify-email'].some(path => pathname.startsWith(path));

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

  const filteredNavItems = navItems.filter((item) => {
    if (!isAuthenticated) {
      if (item.label === 'Hire Talent') return false;
      return true;
    }
    if (user?.role === 'EMPLOYER' && item.label === 'Find Jobs') return false;
    if (user?.role === 'TALENT' && item.label === 'Hire Talent') return false;
    return true;
  });

  const handleSearchToggle = () => {
    setOpenDropdown(null);
    setSearchOpen((prev) => !prev);
  };

  const panelOpen = activePanel !== null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${scrolled || isAuthPage || isSubPage
        ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
        : panelOpen || mobileOpen
          ? 'bg-[#12161A]'
          : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">
          <div className="flex items-center gap-6 xl:gap-10 h-full">
            {/* Logo */}
            <Link to="/" className="flex items-center group relative shrink-0 h-full">
              <div className={`flex items-center transition-all duration-300 ${scrolled || isAuthPage || isSubPage ? 'gap-3' : 'gap-0'}`}>
                <div className="relative flex items-center h-[30px] sm:h-[36px] lg:h-[44px]">
                  <img
                    src="/images/brand-logo-dark.png"
                    alt="Logo"
                    className={`absolute left-0 w-32 sm:w-40 lg:w-44 transition-opacity duration-300 ${scrolled || isAuthPage || isSubPage ? 'opacity-100' : 'opacity-0'
                      }`}
                  />
                  <img
                    src="/images/brand-logo-light.png"
                    alt="Logo"
                    className={`w-32 sm:w-40 lg:w-44 transition-opacity duration-300 ${scrolled || isAuthPage || isSubPage ? 'opacity-0' : 'opacity-100'
                      }`}
                  />
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            {!isAuthPage && (
              <nav className="hidden xl:flex items-center gap-1 xl:gap-2 h-full">
                {filteredNavItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative flex items-center h-full"
                    onMouseEnter={() => handleNavEnter(item.label, !!item.children)}
                    onMouseLeave={handleNavLeave}
                  >
                    <Link
                      to={item.href}
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
                    </Link>
                  </div>
                ))}
              </nav>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4 xl:gap-8 h-full">
            {isAuthPage ? (
              <div className="flex items-center h-full">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-500 hover:bg-rh-red/5 hover:text-rh-red transition-all group border border-gray-100"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="hidden sm:block text-[10px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap">Back to Home</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-6 xl:gap-8 h-full">
                <div className="hidden xl:flex items-center gap-6 h-full">
                  <button
                    className={`transition-colors flex items-center justify-center p-2 rounded-full hover:bg-black/5 ${scrolled || isSubPage || isAuthPage ? 'text-rh-teal hover:text-rh-red' : 'text-white hover:text-rh-red'
                      } ${searchOpen ? 'text-rh-red bg-black/5' : ''}`}
                    onClick={handleSearchToggle}
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  {isAuthenticated ? (
                    <div className="relative group/user h-full flex items-center">
                      <button className={`flex items-center gap-3 p-1.5 pr-3 rounded-xl transition-all ${scrolled || isSubPage || isAuthPage ? 'text-rh-teal hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
                      <div className="w-9 h-9 rounded-lg bg-rh-red flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-red-900/20 overflow-hidden shrink-0">
                        {user?.avatarUrl && !avatarFailed ? (
                          <img src={user.avatarUrl} alt={user?.fullName || 'Avatar'} className="w-full h-full object-cover" onError={() => setAvatarFailed(true)} />
                        ) : (
                          (user?.fullName || user?.email || 'U')[0].toUpperCase()
                        )}
                      </div>
                      <span className="text-sm font-bold truncate max-w-[120px] 2xl:max-w-[160px]">{user?.fullName || 'User Account'}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400 group-hover/user:rotate-180 transition-transform shrink-0" />
                    </button>

                    {/* Dropdown */}
                    <div className="absolute top-[85%] right-0 w-72 pt-5 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300 translate-y-3 group-hover/user:translate-y-0 z-[60]">
                      <div className="bg-white/95 backdrop-blur-xl rounded-[1.75rem] shadow-[0_1.875rem_4.375rem_rgba(0,0,0,0.15)] border border-gray-100 p-3 overflow-hidden">
                        <div className="px-5 py-5 bg-rh-light/30 rounded-[1.375rem] mb-2 border border-rh-teal/5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-rh-teal flex items-center justify-center text-white font-bold text-base shadow-lg shadow-rh-teal/20 overflow-hidden shrink-0">
                              {user?.avatarUrl && !avatarFailed ? (
                                <img src={user.avatarUrl} alt={user?.fullName || 'Avatar'} className="w-full h-full object-cover" onError={() => setAvatarFailed(true)} />
                              ) : (
                                (user?.fullName || user?.email || 'U')[0].toUpperCase()
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-rh-teal truncate">{user?.fullName || 'User Account'}</p>
                              <p className="text-[10px] font-bold text-rh-red uppercase tracking-widest">{user?.role}</p>
                            </div>
                          </div>
                          <p className="text-[11px] font-medium text-gray-400 truncate">{user?.email}</p>
                        </div>

                        <div className="space-y-1">
                          <Link to={user?.role === 'TALENT' ? '/talent-dashboard' : '/employer-dashboard'} className="flex items-center gap-3 px-5 py-3 rounded-[18px] text-gray-600 hover:bg-rh-light hover:text-rh-teal transition-all group/item">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover/item:bg-rh-teal/10 transition-colors">
                              <LayoutDashboard className="w-4 h-4 text-gray-400 group-hover/item:text-rh-teal" />
                            </div>
                            <span className="text-sm font-bold">Dashboard</span>
                          </Link>
                          <Link to="/manage-profile" className="flex items-center gap-3 px-5 py-3 rounded-[18px] text-gray-600 hover:bg-rh-light hover:text-rh-teal transition-all group/item">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover/item:bg-rh-teal/10 transition-colors">
                              <Settings className="w-4 h-4 text-gray-400 group-hover/item:text-rh-teal" />
                            </div>
                            <span className="text-sm font-bold">Manage Profile</span>
                          </Link>
                        </div>

                        <div className="h-px bg-gray-50 my-2 mx-4" />

                        <button
                          onClick={() => {
                            setOpenDropdown(null);
                            handleSignOut();
                          }}
                          className="w-full flex items-center gap-3 px-5 py-3 rounded-[18px] text-rh-red hover:bg-red-50 transition-all group/item"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                            <LogOut className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-bold">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  ) : (
                  <Link
                    to="/signin"
                    className={`text-[15px] xl:text-[16px] 2xl:text-[17px] font-[500] transition-all flex items-center h-full ${scrolled || isAuthPage || isSubPage ? 'text-rh-teal hover:text-rh-red' : 'text-white hover:text-rh-red'
                      } hover:underline hover:underline-offset-8`}
                  >
                    Sign in
                  </Link>
                  )}
                </div>

                {/* Mobile Toggle */}
                <div className="flex items-center gap-2 xl:hidden h-full">
                  {isAuthenticated && (
                    <div className="flex items-center gap-2 mr-1">
                      <Link to="/manage-profile" className={`flex items-center gap-2.5 p-1 sm:pr-2 rounded-xl border shadow-sm transition-all ${scrolled || isSubPage || isAuthPage ? 'bg-gray-50 border-gray-200 hover:bg-gray-100' : 'bg-white/10 border-white/10 hover:bg-white/20'}`}>
                        <div className="w-8 h-8 rounded-lg bg-rh-teal flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-rh-teal/20 overflow-hidden shrink-0">
                          {user?.avatarUrl && !avatarFailed ? (
                            <img src={user.avatarUrl} alt={user?.fullName || 'Avatar'} className="w-full h-full object-cover" onError={() => setAvatarFailed(true)} />
                          ) : (
                            (user?.fullName || user?.email || 'U')[0].toUpperCase()
                          )}
                        </div>
                        <span className={`hidden sm:block text-xs font-bold truncate sm:max-w-[140px] ${scrolled || isSubPage || isAuthPage ? 'text-[#081B2D]' : 'text-white'}`}>{user?.fullName || 'User Account'}</span>
                      </Link>
                    </div>
                  )}
                  <button
                    className={`p-2 rounded-full transition-colors ${scrolled || isSubPage || isAuthPage ? 'text-rh-teal hover:bg-gray-100' : 'text-white hover:bg-white/10'
                      }`}
                    onClick={handleSearchToggle}
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    className={`p-2 rounded-full transition-colors ${scrolled || isSubPage || isAuthPage ? 'text-rh-teal hover:bg-gray-100' : 'text-white hover:bg-white/10'
                      }`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                  >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            )
            }
          </div >
        </div >
      </div >

      {/* ─── Full-width Dropdown Panel (Search + Nav items) ─── */}
      <AnimatePresence>
        {
          activePanel && (
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className={`absolute top-full left-0 right-0 overflow-hidden shadow-2xl border-t z-40 transition-colors duration-300 ${scrolled || isSubPage || isAuthPage ? 'bg-white border-gray-100' : 'bg-[#12161A] border-white/10'
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
                        className={`w-full pl-12 md:pl-16 pr-6 py-4 md:py-6 rounded-2xl md:rounded-[2.5rem] border outline-none text-base md:text-xl transition-all ${scrolled || isSubPage || isAuthPage
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
                            <Link
                              key={link}
                              to={link === 'Browse jobs' ? '/jobs' : '/'}
                              onClick={() => {
                                setOpenDropdown(null);
                                setSearchOpen(false);
                              }}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${scrolled || isSubPage || isAuthPage
                                ? 'bg-gray-100 text-gray-800 hover:bg-rh-teal hover:text-white'
                                : 'bg-white/5 text-gray-200 hover:bg-white/20 hover:text-white'
                                }`}
                            >
                              {link}
                            </Link>
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
                          <Link
                            key={child.label}
                            to={child.href}
                            onClick={() => setOpenDropdown(null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${scrolled || isSubPage || isAuthPage
                              ? 'bg-gray-100 text-gray-800 hover:bg-rh-teal hover:text-white'
                              : 'bg-white/5 text-gray-200 hover:bg-white/20 hover:text-white'
                              }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )
        }
      </AnimatePresence >

      {/* ─── Mobile Menu ─── */}
      <AnimatePresence>
        {
          mobileOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed inset-0 top-[64px] z-40 xl:hidden overflow-y-auto transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${scrolled || isAuthPage || isSubPage ? 'bg-white' : 'bg-[#12161A]'
                }`}
            >
              <div className="flex flex-col min-h-[calc(100vh-64px)] px-6 py-2 pb-12">
                <div className="space-y-2">
                  <div className={`border-b ${scrolled ? 'border-gray-50' : 'border-white/5'}`}>
                    <Link
                      to="/"
                      onClick={() => setMobileOpen(false)}
                      className={`w-full block py-3 sm:py-4 text-base sm:text-lg lg:text-xl font-bold transition-colors ${scrolled || isAuthPage || isSubPage ? 'text-rh-teal' : 'text-white'} active:text-rh-red`}
                    >
                      Home
                    </Link>
                  </div>
                  {filteredNavItems.map((item) => (
                    <div
                      key={item.label}
                      className={`border-b last:border-none ${scrolled || isAuthPage || isSubPage ? 'border-gray-50' : 'border-white/5'}`}
                    >
                      <div className="flex items-center justify-between py-3 sm:py-4">
                        <Link
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`text-base sm:text-lg lg:text-xl font-bold transition-colors ${scrolled || isAuthPage || isSubPage ? 'text-rh-teal' : 'text-white'} active:text-rh-red`}
                        >
                          {item.label}
                        </Link>

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
                                <Link
                                  key={child.label}
                                  to={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${scrolled || isAuthPage || isSubPage
                                    ? 'bg-gray-100 text-gray-800 hover:bg-rh-teal hover:text-white'
                                    : 'bg-white/5 text-gray-300 hover:bg-white/20 hover:text-white'
                                    }`}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8 sm:pt-10 space-y-4">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-2xl border flex items-center gap-4 shadow-sm transition-all ${scrolled || isAuthPage || isSubPage ? 'bg-rh-light/40 border-rh-teal/10' : 'bg-white/5 border-white/10'}`}>
                        <div className="w-12 h-12 rounded-xl bg-rh-teal flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-rh-teal/20 overflow-hidden shrink-0">
                          {user?.avatarUrl && !avatarFailed ? (
                            <img src={user.avatarUrl} alt={user?.fullName || 'Avatar'} className="w-full h-full object-cover" onError={() => setAvatarFailed(true)} />
                          ) : (
                            (user?.fullName || user?.email || 'U')[0].toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-base font-bold truncate ${scrolled || isAuthPage || isSubPage ? 'text-rh-teal' : 'text-white'}`}>{user?.fullName || 'User Account'}</p>
                          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                          <span className="inline-block mt-1 px-2.5 py-0.5 bg-rh-red/10 text-rh-red rounded-lg text-[9px] font-bold uppercase tracking-widest">{user?.role}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Link
                          to={user?.role === 'TALENT' ? '/talent-dashboard' : '/employer-dashboard'}
                          onClick={() => setMobileOpen(false)}
                          className="block w-full"
                        >
                          <Button variant="outline" size="lg" className={`w-full py-4 sm:py-5 text-base sm:text-lg font-bold rounded-2xl border-2 flex items-center justify-center gap-2 shadow-sm transition-all ${scrolled || isAuthPage || isSubPage ? 'border-rh-teal/10 text-rh-teal hover:bg-rh-teal hover:text-white hover:border-rh-teal' : 'border-white/10 text-white hover:bg-white/10 hover:border-white/20'}`}>
                            <LayoutDashboard className="w-5 h-5" /> Dashboard
                          </Button>
                        </Link>
                        <Link
                          to="/manage-profile"
                          onClick={() => setMobileOpen(false)}
                          className="block w-full"
                        >
                          <Button variant="outline" size="lg" className={`w-full py-4 sm:py-5 text-base sm:text-lg font-bold rounded-2xl border-2 flex items-center justify-center gap-2 shadow-sm transition-all ${scrolled || isAuthPage || isSubPage ? 'border-gray-200 text-gray-700 hover:bg-gray-100' : 'border-white/10 text-white hover:bg-white/10 hover:border-white/20'}`}>
                            <Settings className="w-5 h-5" /> Manage Profile
                          </Button>
                        </Link>
                        <button
                          onClick={() => {
                            setMobileOpen(false);
                            handleSignOut();
                          }}
                          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm ${scrolled || isAuthPage || isSubPage ? 'bg-red-50 text-rh-red hover:bg-red-100' : 'bg-rh-red/10 border border-rh-red/20 text-rh-red hover:bg-rh-red/20'}`}
                        >
                          <LogOut className="w-5 h-5" /> Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to="/signin"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full text-center py-3 sm:py-4 transition-all"
                    >
                      <Button size="lg" className="w-full py-4 sm:py-5 text-base sm:text-lg font-bold rounded-2xl shadow-xl">
                        Sign In
                      </Button>
                    </Link>
                  )}
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
          )
        }
      </AnimatePresence >
    </header >
  );
}
