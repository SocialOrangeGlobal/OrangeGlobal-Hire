import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Clock, CheckCircle2,
  ChevronRight, Search, Filter,
  MapPin, DollarSign, Bookmark,
  Send, AlertCircle, FileText,
  Target, Zap, TrendingUp, ArrowRight,
  User, Bell, Star, X, Download, MessageCircle,
  Calendar, Settings, LogOut, Mail, Phone, Globe, MapPin as MapPinIcon,
  Shield, Award, GraduationCap, Code,
  Plus
} from 'lucide-react';
import { fadeUp, scaleIn } from '../utils/animations';
import Button from '../components/ui/Button';

import Dropdown from '../components/ui/Dropdown';

// Initial Mock Data
const INITIAL_APPLICATIONS = [
  {
    id: 1,
    company: 'TechScale Global',
    logo: 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=100',
    role: 'Senior Frontend Developer',
    status: 'Interviewing',
    date: 'Applied 4 days ago',
    nextStep: 'Technical Round - Tomorrow, 2:00 PM',
    isBookmarked: true,
    timeline: [
      { step: 'Applied', date: 'Oct 12', completed: true },
      { step: 'Screening', date: 'Oct 15', completed: true },
      { step: 'Interview', date: 'Oct 18', current: true },
      { step: 'Final Result', date: 'TBD', pending: true },
    ]
  },
  {
    id: 2,
    company: 'FinEdge Corp',
    logo: 'https://images.pexels.com/photos/3182761/pexels-photo-3182761.jpeg?auto=compress&cs=tinysrgb&w=100',
    role: 'Full Stack Engineer',
    status: 'Under Review',
    date: 'Applied 1 week ago',
    nextStep: 'Waiting for recruiter feedback',
    isBookmarked: false,
    timeline: [
      { step: 'Applied', date: 'Oct 08', completed: true },
      { step: 'Screening', date: 'Processing', current: true },
      { step: 'Interview', date: '-', pending: true },
      { step: 'Final Result', date: '-', pending: true },
    ]
  },
];

const INITIAL_JOBS = [
  { id: 1, title: 'Lead Web Architect', company: 'Innovation Hub', location: 'Remote', salary: '$160k - $200k', tags: ['React', 'Node.js'], match: '98%' },
  { id: 2, title: 'Senior UI Developer', company: 'Creative Digital', location: 'Hybrid', salary: '$130k - $150k', tags: ['Figma', 'React'], match: '92%' },
];

export default function TalentDashboard() {
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [recommendedJobs, setRecommendedJobs] = useState(INITIAL_JOBS);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Interview Scheduled', message: 'Technical round with TechScale Global is confirmed for tomorrow.', time: '2 mins ago', unread: true, type: 'interview' },
    { id: 2, title: 'New Job Match', message: 'Senior UI Developer at Creative Digital matches 92% of your profile.', time: '1 hour ago', unread: true, type: 'match' },
    { id: 3, title: 'Profile Viewed', message: 'A recruiter from FinEdge Corp viewed your profile.', time: '5 hours ago', unread: false, type: 'view' },
  ]);

  const [profileData, setProfileData] = useState({
    name: 'Alex Thompson',
    title: 'Senior Frontend Developer',
    email: 'alex.thompson@example.com',
    phone: '+1 (555) 000-0000',
    location: 'San Francisco, CA',
    about: 'Passionate Senior Frontend Developer with 8+ years of experience in building scalable web applications. Expert in React, TypeScript, and modern CSS architectures.',
    completion: 85,
    skills: ['React', 'TypeScript', 'Node.js', 'TailwindCSS', 'Figma'],
    experience: [
      { id: 1, role: 'Senior Frontend Dev', company: 'Innovation Labs', period: '2020 - Present' },
      { id: 2, role: 'Web Developer', company: 'Digital Dreams', period: '2017 - 2020' }
    ]
  });

  const stats = useMemo(() => [
    { label: 'Applications', value: applications.length, icon: Briefcase, color: 'text-rh-red', bg: 'bg-rh-red/5' },
    { label: 'Interviews', value: applications.filter(a => a.status === 'Interviewing').length, icon: Bell, color: 'text-rh-teal', bg: 'bg-rh-teal/5' },
    { label: 'Job Matches', value: 42, icon: Zap, color: 'text-rh-red', bg: 'bg-rh-red/5' },
    { label: 'Resume Score', value: 85, icon: Target, color: 'text-rh-teal', bg: 'bg-rh-teal/5' },
  ], [applications]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleBookmark = (id: number) => {
    setApplications(applications.map(app =>
      app.id === id ? { ...app, isBookmarked: !app.isBookmarked } : app
    ));
    showNotification('Bookmark updated');
  };

  const handleApplyNow = (jobId: number) => {
    showNotification('Application submitted successfully!');
    setRecommendedJobs(recommendedJobs.filter(j => j.id !== jobId));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-rh-red text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row min-h-screen">

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-8 lg:px-12 pt-32 pb-20">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <button
                onClick={() => window.location.hash = '#jobs'}
                className="flex items-center gap-2 text-gray-400 hover:text-rh-red transition-colors mb-4 group text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]"
              >
                <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Find Jobs
              </button>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-rh-teal tracking-tight leading-tight">
                Talent <span className="text-rh-red font-[300]">Command Hub</span>
              </h1>
              <p className="text-gray-500 mt-3 font-medium text-xs sm:text-base">Welcome back, <span className="text-rh-teal font-bold">Alex Thompson</span></p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all relative ${showNotifications ? 'bg-rh-red text-white' : 'bg-rh-light text-rh-teal hover:bg-rh-red/10'}`}
                >
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                  {notifications.some(n => n.unread) && (
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rh-red border-2 border-white rounded-full" />
                  )}
                </button>

                {/* Notifications Dropdown / Modal */}
                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowNotifications(false)}
                        className="fixed inset-0 bg-rh-dark/40 backdrop-blur-sm z-[140] lg:bg-transparent lg:backdrop-blur-none"
                      />
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: window.innerWidth < 1024 ? 100 : 10,
                          scale: window.innerWidth < 1024 ? 1 : 0.95,
                          x: window.innerWidth < 1024 ? '-50%' : 0
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          x: window.innerWidth < 1024 ? '-50%' : 0
                        }}
                        exit={{
                          opacity: 0,
                          y: window.innerWidth < 1024 ? 100 : 10,
                          scale: window.innerWidth < 1024 ? 1 : 0.95,
                          x: window.innerWidth < 1024 ? '-50%' : 0
                        }}
                        className="fixed lg:absolute top-[10%] lg:top-full left-1/2 lg:left-auto lg:right-0 mt-4 w-[90%] sm:w-[450px] lg:w-[400px] bg-white rounded-[32px] shadow-2xl border border-gray-100 z-[150] overflow-hidden flex flex-col max-h-[80vh] lg:max-h-[500px]"
                      >
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-rh-light/30 shrink-0">
                          <h3 className="font-bold text-rh-teal">Notifications</h3>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                              className="text-[10px] font-bold text-rh-red uppercase tracking-widest hover:underline"
                            >
                              Mark all read
                            </button>
                            <button onClick={() => setShowNotifications(false)} className="lg:hidden p-2 bg-white rounded-full shadow-sm">
                              <X className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                        <div className="overflow-y-auto custom-scrollbar flex-1">
                          {notifications.map(n => (
                            <div key={n.id} className={`p-6 border-b border-gray-50 hover:bg-rh-light/20 transition-colors relative cursor-pointer group ${n.unread ? 'bg-rh-teal/5' : ''}`}>
                              <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'interview' ? 'bg-orange-100 text-orange-600' :
                                  n.type === 'match' ? 'bg-rh-red/10 text-rh-red' : 'bg-rh-teal/10 text-rh-teal'
                                  }`}>
                                  {n.type === 'interview' ? <Calendar className="w-6 h-6" /> :
                                    n.type === 'match' ? <Zap className="w-6 h-6" /> : <User className="w-6 h-6" />}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-sm font-bold text-rh-teal">{n.title}</h4>
                                      {n.unread && <div className="w-2 h-2 bg-rh-red rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] shrink-0" />}
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-medium shrink-0">{n.time}</span>
                                  </div>
                                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{n.message}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button className="w-full py-5 bg-rh-teal text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-rh-red transition-all shrink-0">
                          View All Notifications
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-rh-teal">{profileData.name}</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Verified Expert</p>
                </div>
                <div className="relative group cursor-pointer" onClick={() => setShowProfile(true)}>
                  <img src="https://i.pravatar.cc/100?img=11" alt="Profile" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover ring-2 ring-rh-teal/5 group-hover:ring-rh-red/20 transition-all shadow-lg shadow-rh-teal/5" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-md" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* User Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-16">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-rh-light/30 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 border border-rh-teal/5 group hover:bg-white hover:shadow-2xl hover:shadow-rh-teal/5 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 ${stat.bg} ${stat.color} rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12`}>
                    <stat.icon className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-rh-teal mb-1 tracking-tight">{stat.value}{stat.label === 'Resume Score' ? '%' : ''}</h3>
                <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Active Applications with Full Interaction */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

            <div className="xl:col-span-8 space-y-10">
              <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl font-bold text-rh-teal flex items-center gap-4">
                    <FileText className="w-6 h-6 text-rh-red" /> My Applications
                  </h2>
                </div>

                <div className="p-10 space-y-16">
                  {applications.length > 0 ? applications.map((app) => (
                    <div key={app.id} className="relative group">
                      {/* App Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-4 sm:gap-6">
                          <img src={app.logo} alt={app.company} className="w-12 h-12 sm:w-16 sm:h-16 rounded-[16px] sm:rounded-[20px] object-cover" />
                          <div>
                            <h3 className="text-md md:text-lg sm:text-xl font-bold text-rh-teal group-hover:text-rh-red transition-colors cursor-pointer">{app.role}</h3>
                            <p className="text-xs sm:text-sm font-medium text-gray-400">{app.company} • {app.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-none pt-4 sm:pt-0">
                          <button
                            onClick={() => toggleBookmark(app.id)}
                            className={`p-2.5 sm:p-3 rounded-xl transition-all ${app.isBookmarked ? 'bg-rh-red/10 text-rh-red' : 'bg-rh-light text-gray-300 hover:text-rh-red'}`}
                          >
                            <Bookmark className={`w-4 h-4 sm:w-5 h-5 ${app.isBookmarked ? 'fill-current' : ''}`} />
                          </button>
                          <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest ${app.status === 'Interviewing' ? 'bg-orange-50 text-orange-600' : 'bg-rh-teal/5 text-rh-teal'
                            }`}>
                            {app.status}
                          </div>
                        </div>
                      </div>

                      {/* Interactive Visual Timeline */}
                      <div className="relative px-0 sm:px-10">
                        <div className="absolute top-[20px] left-[40px] right-[40px] sm:left-[60px] sm:right-[60px] h-[2px] bg-gray-100" />
                        <div className="flex justify-between gap-2">
                          {app.timeline.map((step, idx) => (
                            <div key={idx} className="relative flex flex-col items-center z-10 flex-1">
                              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 sm:border-4 border-white shadow-sm transition-all duration-500 ${step.completed ? 'bg-emerald-500 text-white' :
                                step.current ? 'bg-rh-red text-white scale-110 shadow-lg shadow-rh-red/20' :
                                  'bg-gray-200 text-gray-400'
                                }`}>
                                {step.completed ? <CheckCircle2 className="w-4 h-4 sm:w-5 h-5" /> : <span className="text-[10px] sm:text-xs font-bold">{idx + 1}</span>}
                              </div>
                              <p className={`mt-3 sm:mt-4 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest sm:tracking-[0.2em] text-center ${step.current ? 'text-rh-red' : 'text-gray-400'
                                }`}>
                                {step.step}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Next Step Interaction */}
                      <div className="mt-10 p-4 md:p-6 bg-rh-light/30 rounded-[28px] flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-rh-teal/5 group-hover:border-rh-red/20 transition-all duration-500">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rh-red shadow-sm">
                            <Star className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Upcoming Milestone</p>
                            <p className="text-sm font-bold text-rh-teal">{app.nextStep}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-6 py-3 bg-white text-rh-teal rounded-xl text-xs font-bold hover:bg-rh-teal hover:text-white transition-all shadow-sm"
                          >
                            View Details
                          </button>
                          <button className="p-3 bg-rh-teal text-white rounded-xl hover:bg-rh-red transition-all shadow-lg shadow-rh-teal/10">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-20 bg-rh-light/20 rounded-[40px] border border-dashed border-gray-200">
                      <Briefcase className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-rh-teal mb-2">No active applications</h3>
                      <p className="text-gray-500 mb-8">Start your journey by exploring active roles.</p>
                      <Button onClick={() => window.location.hash = '#jobs'} variant="primary" className="px-10 py-4 rounded-2xl">Find Jobs</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Functional Sidebar */}
            <div className="xl:col-span-4 space-y-10">
              {/* Interactive Profile Score */}
              <div className="bg-rh-teal rounded-[40px] p-10 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <h3 className="text-2xl font-bold mb-6">Resume Analytics</h3>
                <div className="relative w-36 h-36 mx-auto mb-10">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="64" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/10" />
                    <circle cx="72" cy="72" r="64" fill="none" stroke="currentColor" strokeWidth="8" className="text-rh-red"
                      strokeDasharray={402.12} strokeDashoffset={402.12 * (1 - 0.85)} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">85</span>
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Pro Score</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 mb-4">
                    <TrendingUp className="w-5 h-5 text-rh-red" />
                    <p className="text-[11px] font-bold leading-relaxed">Top 15% of candidates in {applications[0]?.role || 'your field'}</p>
                  </div>

                  <Dropdown
                    options={[
                      { value: 'frontend', label: 'Frontend Focus' },
                      { value: 'fullstack', label: 'Fullstack Focus' },
                      { value: 'management', label: 'Management' }
                    ]}
                    value="frontend"
                    onChange={(val) => showNotification(`Strategy changed to ${val}`)}
                    className="mb-6"
                  />

                  <Button variant="primary" className="w-full !bg-white !text-rh-teal hover:!bg-rh-red hover:!text-white !py-4 rounded-2xl text-xs font-bold transition-all duration-500 shadow-xl shadow-black/10">
                    Optimize Now
                  </Button>
                </div>
              </div>

              {/* Functional Job Matches */}
              <div className="bg-rh-light/20 rounded-[40px] border border-rh-teal/5 p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-rh-teal">Top Matches</h3>
                  <Zap className="w-5 h-5 text-rh-red animate-pulse" />
                </div>
                <div className="space-y-6">
                  {recommendedJobs.map((job) => (
                    <div key={job.id} className="bg-white p-6 rounded-[28px] border border-gray-100 hover:border-rh-red/20 transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-rh-teal/5">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-widest">{job.match} Match</span>
                        <div className="flex gap-2">
                          <button className="text-gray-300 hover:text-rh-red transition-colors"><Bookmark className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <h4 className="font-bold text-rh-teal mb-1 group-hover:text-rh-red transition-colors">{job.title}</h4>
                      <p className="text-[11px] font-bold text-gray-400 mb-6">{job.company}</p>

                      <div className="grid grid-cols-2 gap-2 mb-8">
                        <div className="flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest bg-rh-light px-3 py-2 rounded-xl"><MapPin className="w-3 h-3" /> {job.location}</div>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-rh-teal uppercase tracking-widest bg-rh-teal/5 px-3 py-2 rounded-xl"><DollarSign className="w-3 h-3" /> {job.salary.split(' - ')[0]}</div>
                      </div>

                      <button
                        onClick={() => handleApplyNow(job.id)}
                        className="w-full py-3.5 bg-rh-teal text-white rounded-xl text-[11px] font-bold hover:bg-rh-red transition-all shadow-lg shadow-rh-teal/10"
                      >
                        Submit Application
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Modal: Application Detail View */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-rh-dark/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white w-full max-w-2xl rounded-t-[32px] md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col mt-auto md:m-auto h-[85vh] md:h-auto max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 md:px-12 py-6 md:py-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="relative">
                    <img src={selectedApp.logo} className="w-10 h-10 md:w-20 md:h-20 rounded-xl md:rounded-[28px] object-cover shadow-xl" alt="" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-rh-red rounded-lg flex items-center justify-center text-white border-2 border-white"><CheckCircle2 className="w-3 h-3" /></div>
                  </div>
                  <div>
                    <h2 className="text-md md:text-xl font-bold text-rh-teal leading-tight">{selectedApp.role}</h2>
                    <p className="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">{selectedApp.company}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedApp(null)} className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-rh-red transition-all shadow-sm"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
              </div>

              <div className="p-6 md:p-12 overflow-y-auto custom-scrollbar flex-1">
                <div className="space-y-8 md:space-y-12">
                  <div className="grid grid-cols-2 gap-4 md:gap-8">
                    <div className="p-5 md:p-8 bg-rh-light/50 rounded-[24px] md:rounded-[32px] border border-gray-100 group hover:border-rh-red/20 transition-all">
                      <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 md:mb-3 flex items-center gap-2"><Clock className="w-3 h-3 text-rh-red" /> Application Status</p>
                      <p className="text-sm md:text-xl font-bold text-rh-teal">{selectedApp.status}</p>
                    </div>
                    <div className="p-5 md:p-8 bg-rh-light/50 rounded-[24px] md:rounded-[32px] border border-gray-100 group hover:border-rh-teal/20 transition-all">
                      <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 md:mb-3 flex items-center gap-2"><Calendar className="w-3 h-3 text-rh-teal" /> Submission Date</p>
                      <p className="text-sm md:text-xl font-bold text-rh-teal">{selectedApp.date.replace('Applied ', '')}</p>
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    <h4 className="text-[10px] md:text-xs font-bold text-rh-red uppercase tracking-widest flex items-center gap-3">
                      <div className="w-1 h-4 bg-rh-red rounded-full" /> Recruitment Insights
                    </h4>
                    <div className="p-6 md:p-10 bg-rh-teal/5 rounded-[24px] md:rounded-[40px] border border-rh-teal/10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><MessageCircle className="w-12 h-12 md:w-20 md:h-20 text-rh-teal" /></div>
                      <p className="text-gray-500 text-xs md:text-md font-medium leading-relaxed relative z-10 italic">
                        "Excellent technical performance in the initial screening. Moving forward to the panel interview phase. Please ensure your portfolio and recent case studies are ready for detailed review by the leadership team."
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    <h4 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-3">
                      <div className="w-1 h-4 bg-gray-300 rounded-full" /> Next Steps
                    </h4>
                    <div className="flex items-center gap-4 p-4 md:p-6 bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-sm">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-rh-teal text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-rh-teal/10"><TrendingUp className="w-5 h-5 md:w-6 md:h-6" /></div>
                      <p className="text-xs md:text-base font-bold text-rh-teal">{selectedApp.nextStep}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 md:p-10 border-t border-gray-100 bg-white shrink-0 flex flex-col md:flex-row gap-4">
                <Button variant="primary" className="flex-1 !py-4 md:!py-6 rounded-2xl md:rounded-full text-xs sm:text-sm md:text-md font-bold shadow-2xl shadow-rh-red/20 flex items-center justify-center gap-2 md:gap-3">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6" /> Schedule Prep Call
                </Button>
                <button className="px-4 py-4 bg-rh-light text-rh-teal rounded-full hover:bg-rh-teal hover:text-white transition-all flex items-center justify-center gap-2 md:gap-3 font-bold text-xs sm:text-sm md:text-md border border-gray-100 shadow-sm group">
                  <Download className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Profile Management Module */}
      <AnimatePresence>
        {showProfile && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowProfile(false)}
              className="absolute inset-0 bg-rh-dark/60 backdrop-blur-md"
            />
            <motion.div
              initial={{
                opacity: 0,
                x: window.innerWidth < 1024 ? 0 : "100%",
                y: window.innerWidth < 1024 ? "100%" : 0
              }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{
                opacity: 0,
                x: window.innerWidth < 1024 ? 0 : "100%",
                y: window.innerWidth < 1024 ? "100%" : 0
              }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative bg-white w-full max-w-4xl lg:max-w-2xl xl:max-w-3xl md:rounded-t-[48px] lg:rounded-l-[48px] lg:rounded-tr-none shadow-2xl overflow-hidden flex flex-col h-full lg:ml-auto"
            >
              {/* Profile Header */}
              <div className="px-6 md:px-12 py-6 md:py-10 border-b border-gray-100 flex items-center justify-between shrink-0 bg-rh-light/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-rh-red/5 rounded-full -mr-24 md:-mr-32 -mt-24 md:-mt-32 blur-3xl" />
                <div className="flex items-center gap-4 md:gap-6 relative z-10">
                  <div className="relative">
                    <img src="https://i.pravatar.cc/200?img=11" className="w-16 h-16 md:w-32 md:h-32 rounded-2xl md:rounded-[32px] object-cover shadow-2xl ring-4 ring-white" alt="" />
                    <button className="absolute -bottom-1 -right-1 p-2 md:p-3 bg-rh-red text-white rounded-lg md:rounded-2xl shadow-xl hover:scale-110 transition-transform"><Settings className="w-3 h-3 md:w-5 md:h-5" /></button>
                  </div>
                  <div>
                    <h2 className="text-xl md:text-4xl font-bold text-rh-teal truncate max-w-[150px] sm:max-w-none">{profileData.name}</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[8px] md:text-sm mt-1 md:mt-2">{profileData.title}</p>
                    <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-4">
                      <div className="px-2 py-0.5 md:px-3 md:py-1 bg-emerald-50 text-emerald-600 rounded-md md:rounded-lg text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Active</div>
                      <div className="flex items-center gap-1 text-[8px] md:text-[10px] font-bold text-rh-teal uppercase tracking-widest"><MapPinIcon className="w-2 h-2 md:w-3 md:h-3" /> {profileData.location}</div>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowProfile(false)} className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-rh-red transition-all shadow-xl relative z-10"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                  {/* Left Column: Details */}
                  <div className="lg:col-span-8 space-y-8 md:space-y-12">
                    <section>
                      <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h3 className="text-lg md:text-xl font-bold text-rh-teal flex items-center gap-2 md:gap-3"><User className="w-5 h-5 md:w-6 md:h-6 text-rh-red" /> About Me</h3>
                        <button className="text-[8px] md:text-[10px] font-bold text-rh-red uppercase tracking-widest hover:underline">Edit</button>
                      </div>
                      <p className="text-gray-500 leading-relaxed text-xs md:text-base font-medium bg-rh-light/30 p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-rh-teal/5 italic">
                        "{profileData.about}"
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg md:text-xl font-bold text-rh-teal flex items-center gap-2 md:gap-3 mb-4 md:mb-6"><Code className="w-5 h-5 md:w-6 md:h-6 text-rh-red" /> Skills</h3>
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {profileData.skills.map(skill => (
                          <span key={skill} className="px-4 py-2 md:px-6 md:py-3 bg-rh-teal/5 text-rh-teal rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold border border-rh-teal/10 hover:bg-rh-red hover:text-white transition-all cursor-default">
                            {skill}
                          </span>
                        ))}
                        <button className="px-4 py-2 md:px-6 md:py-3 border-2 border-dashed border-gray-200 text-gray-400 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold hover:border-rh-red hover:text-rh-red transition-all">+ Add</button>
                      </div>
                    </section>

                    <section>
                      <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h3 className="text-lg md:text-xl font-bold text-rh-teal flex items-center gap-2 md:gap-3"><Award className="w-5 h-5 md:w-6 md:h-6 text-rh-red" /> Experience</h3>
                        <button className="p-2 bg-rh-red/5 text-rh-red rounded-lg hover:bg-rh-red hover:text-white transition-all"><Plus className="w-3 h-3 md:w-4 md:h-4" /></button>
                      </div>
                      <div className="space-y-3 md:space-y-4">
                        {profileData.experience.map(exp => (
                          <div key={exp.id} className="p-5 md:p-8 bg-white border border-gray-100 rounded-[24px] md:rounded-[32px] hover:border-rh-red/20 transition-all flex items-center justify-between group shadow-sm hover:shadow-xl hover:shadow-rh-teal/5">
                            <div className="flex items-center gap-4 md:gap-6">
                              <div className="w-10 h-10 md:w-14 md:h-14 bg-rh-light rounded-xl md:rounded-2xl flex items-center justify-center text-rh-teal group-hover:bg-rh-red group-hover:text-white transition-all"><Briefcase className="w-5 h-5 md:w-7 md:h-7" /></div>
                              <div>
                                <h4 className="font-bold text-rh-teal text-sm md:text-lg">{exp.role}</h4>
                                <p className="text-[8px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5 md:mt-1">{exp.company} • {exp.period}</p>
                              </div>
                            </div>
                            <button className="text-gray-300 hover:text-rh-red transition-colors"><ChevronRight className="w-4 h-4 md:w-6 md:h-6" /></button>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Score & Contact */}
                  <div className="lg:col-span-4 space-y-6 md:space-y-8">
                    {/* Completion Card */}
                    <div className="p-8 md:p-10 bg-rh-teal rounded-[32px] md:rounded-[40px] text-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform"><Shield className="w-16 md:w-24 h-16 md:h-24" /></div>
                      <h4 className="text-lg md:text-xl font-bold mb-6 md:mb-8">Score</h4>
                      <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 md:mb-8">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/10 md:hidden" />
                          <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="10" className="text-white/10 hidden md:block" />

                          <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-rh-red md:hidden"
                            strokeDasharray={351.8} strokeDashoffset={351.8 * (1 - profileData.completion / 100)} strokeLinecap="round" />
                          <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="10" className="text-rh-red hidden md:block"
                            strokeDasharray={439.8} strokeDashoffset={439.8 * (1 - profileData.completion / 100)} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl md:text-5xl font-bold">{profileData.completion}%</span>
                          <span className="text-[8px] md:text-[10px] font-bold text-white/60 uppercase tracking-widest mt-0.5 md:mt-1">Complete</span>
                        </div>
                      </div>
                      <p className="text-[8px] md:text-[10px] font-bold leading-relaxed text-center text-white/80">Complete experience to reach 100%!</p>
                    </div>

                    {/* Contact Card */}
                    <div className="p-6 md:p-8 bg-rh-light/40 rounded-[32px] md:rounded-[40px] border border-rh-teal/5 space-y-4 md:space-y-6">
                      <h4 className="text-[10px] md:text-sm font-bold text-rh-teal uppercase tracking-widest mb-2 md:mb-4">Contact Info</h4>
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center gap-3 md:gap-4 group">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg md:rounded-xl flex items-center justify-center text-rh-red shadow-sm group-hover:bg-rh-red group-hover:text-white transition-all"><Mail className="w-4 h-4 md:w-5 md:h-5" /></div>
                          <p className="text-[10px] md:text-xs font-bold text-rh-teal break-all">{profileData.email}</p>
                        </div>
                        <div className="flex items-center gap-3 md:gap-4 group">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg md:rounded-xl flex items-center justify-center text-rh-teal shadow-sm group-hover:bg-rh-red group-hover:text-white transition-all"><Phone className="w-4 h-4 md:w-5 md:h-5" /></div>
                          <p className="text-[10px] md:text-xs font-bold text-rh-teal">{profileData.phone}</p>
                        </div>
                      </div>
                    </div>

                    <button className="w-full py-4 md:py-6 bg-rh-teal text-white rounded-2xl md:rounded-[32px] font-bold shadow-2xl shadow-rh-teal/20 hover:bg-rh-red transition-all flex items-center justify-center gap-2 md:gap-3 group text-xs md:text-base">
                      <LogOut className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{
        __html: `
       .custom-scrollbar::-webkit-scrollbar { width: 8px; }
       .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
       .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 20px; }
       .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
       .no-scrollbar::-webkit-scrollbar { display: none; }
       .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
