import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, CheckCircle2,
  MapPin, DollarSign, Bookmark, FileText,
  Target, Zap, TrendingUp, ArrowRight, Bell, Star
} from 'lucide-react';
import { fadeUp } from '../utils/animations';
import Button from '../components/ui/Button';
import PageLoader from '../components/ui/PageLoader';
import NotificationModal from '../components/modals/talent-dashboard/NotificationModal';
import ViewApplicationDetailModal from '../components/modals/talent-dashboard/ViewApplicationDetailModal';
import ProfileMangementModal from '../components/modals/talent-dashboard/ProfileManagementModal';
import { useAppSelector } from '../store';
import { useSocket } from '../contexts/SocketContext';

export default function TalentDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, accessToken } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { notifications, unreadCount } = useSocket();
  const prevNotificationsLength = useRef(notifications.length);

  const [profileData, setProfileData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    about: '',
    completion: 0,
    skills: [] as string[],
    experience: [] as any[],
    education: [] as any[],
    avatarUrl: '',
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchJobsOnce = useCallback(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1"}/jobs?limit=3`)
      .then(res => res.json())
      .then(jobsResp => {
        if (jobsResp.success) {
          const raw = jobsResp.data?.items || jobsResp.data;
          const items = Array.isArray(raw) ? raw : [];
          const jobsList = items.map((job: any) => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary || 'Negotiable',
            tags: job.skills?.slice(0, 3) || [],
            match: `${Math.floor(Math.random() * 15 + 80)}%`,
          }));
          setRecommendedJobs(jobsList);
        }
      })
      .catch(err => console.error("Error fetching recommended jobs:", err));
  }, []);

  useEffect(() => {
    fetchJobsOnce();
  }, [fetchJobsOnce]);

  const loadData = useCallback((showLoader = true) => {
    if (!isAuthenticated || !accessToken) {
      return;
    }
    if (showLoader) {
      setIsLoading(true);
    }
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1"}/talent/applications`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).then(res => res.json()),
      fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1"}/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).then(res => res.json())
    ])
      .then(([appsData, profileResp]) => {
        // Process Applications
        if (appsData.success) {
          const apps = appsData.data.map((app: any) => {
            const status = app.status;
            let nextStep = "Awaiting Review";
            if (status === 'UNDER_REVIEW') nextStep = "In Review";
            else if (status === 'SHORTLISTED') nextStep = "Pending Interview Schedule";
            else if (status === 'INTERVIEW_SCHEDULED') nextStep = `Interview on ${app.interviewDate ? new Date(app.interviewDate).toLocaleString('en-AU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'TBD'}`;
            else if (status === 'INTERVIEW_COMPLETED') nextStep = "Pending Decision";
            else if (status === 'OFFER_SENT') nextStep = "Review Offer";
            else if (status === 'OFFER_ACCEPTED') nextStep = "Onboarding";
            else if (status === 'REJECTED') nextStep = "Application Rejected";
            else if (status === 'WITHDRAWN') nextStep = "Application Withdrawn";
            else if (status === 'OFFER_REJECTED') nextStep = "Offer Declined";

            const isClosed = ['REJECTED', 'WITHDRAWN', 'OFFER_REJECTED'].includes(status);

            return {
              id: app.id,
              company: app.job?.company || "Unknown",
              logo: app.job?.companyLogo || "https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=150",
              role: app.job?.title || "Unknown",
              status: app.status,
              date: new Date(app.appliedAt).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" }),
              nextStep: nextStep,
              atsScore: app.atsScore || null,
              atsBreakdown: app.atsBreakdown?.breakdown || null,
              coverLetter: app.coverLetter || '',
              adminNotes: app.adminNotes || '',
              interviewDate: app.interviewDate,
              interviewType: app.interviewType,
              interviewLink: app.interviewLink,
              interviewNotes: app.interviewNotes,
              offerDetails: app.offerDetails,
              isBookmarked: false,
              timeline: [
                { step: 'Applied', date: new Date(app.appliedAt).toLocaleDateString(), completed: true },
                { step: 'Review', date: isClosed ? 'Closed' : 'Pending', completed: !isClosed && status !== 'APPLIED', current: status === 'APPLIED' },
                { step: 'Interview', date: app.interviewDate ? new Date(app.interviewDate).toLocaleDateString() : (isClosed ? 'Closed' : 'TBD'), completed: ['INTERVIEW_COMPLETED', 'OFFER_SENT', 'OFFER_ACCEPTED'].includes(status), current: ['SHORTLISTED', 'INTERVIEW_SCHEDULED'].includes(status) },
                { step: 'Decision', date: isClosed ? 'Closed' : 'TBD', completed: status === 'OFFER_ACCEPTED', current: status === 'OFFER_SENT' || status === 'INTERVIEW_COMPLETED' || isClosed },
              ]
            };
          });
          setApplications(apps);
        }

        // Process Profile
        if (profileResp.success) {
          const p = profileResp.data.profile;
          setProfileData({
            name: profileResp.data.fullName || "Talent User",
            title: p?.jobTitle || p?.preferredRole || 'Job Seeker',
            email: profileResp.data.email,
            phone: p?.phone || '',
            location: typeof p?.location === 'object' && p?.location ? [p.location.city, p.location.country].filter(Boolean).join(', ') : (p?.location || p?.city || ''),
            about: p?.bio || p?.summary || '',
            completion: p?.profileScore || 0,
            skills: p?.skills || [],
            experience: (p?.experiences as any[]) || [],
            education: (p?.educations as any[]) || [],
            avatarUrl: profileResp.data.avatarUrl || '',
          });
        }

        if (appsData && appsData.success === false) {
          console.error("API Error fetching applications:", appsData);
          setNotification("Error fetching data. Retrying...");
          setTimeout(() => window.location.reload(), 3000);
          return;
        }

        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Network or parsing error:", err);
      });
  }, [isAuthenticated, accessToken]);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      navigate('/signin');
      return;
    }
    loadData(true);
  }, [isAuthenticated, accessToken, navigate, loadData]);

  useEffect(() => {
    if (notifications.length > prevNotificationsLength.current) {
      loadData(false);
      showNotification('Dashboard updated in real-time');
    }
    prevNotificationsLength.current = notifications.length;
  }, [notifications, loadData]);

  const stats = useMemo(() => {
    const interviewCount = applications.filter(a => ['INTERVIEW_SCHEDULED', 'SHORTLISTED'].includes(a.status)).length;
    const avgAts = applications.length > 0
      ? Math.round(applications.reduce((sum, a) => sum + (a.atsScore || 0), 0) / applications.length)
      : 0;

    return [
      { label: 'Applications', value: applications.length, icon: Briefcase, color: 'text-rh-red', bg: 'bg-rh-red/5' },
      { label: 'Interviews', value: interviewCount, icon: Bell, color: 'text-rh-teal', bg: 'bg-rh-teal/5' },
      { label: 'Job Matches', value: recommendedJobs.length, icon: Zap, color: 'text-rh-red', bg: 'bg-rh-red/5' },
      { label: 'Avg ATS Score', value: avgAts, icon: Target, color: 'text-rh-teal', bg: 'bg-rh-teal/5' },
    ];
  }, [applications, recommendedJobs]);

  const toggleBookmark = (id: string) => {
    setApplications(applications.map(app =>
      app.id === id ? { ...app, isBookmarked: !app.isBookmarked } : app
    ));
    showNotification('Bookmark updated');
  };

  const handleApplyNow = (jobId: string) => {
    navigate(`/apply-job?id=${jobId}`);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'APPLIED': return 'bg-blue-50 text-blue-600';
      case 'UNDER_REVIEW': return 'bg-yellow-50 text-yellow-600';
      case 'SHORTLISTED': return 'bg-purple-50 text-purple-600';
      case 'INTERVIEW_SCHEDULED': return 'bg-orange-50 text-orange-600';
      case 'INTERVIEW_COMPLETED': return 'bg-teal-50 text-teal-600';
      case 'OFFER_SENT': return 'bg-emerald-50 text-emerald-600';
      case 'OFFER_ACCEPTED': return 'bg-green-50 text-green-600';
      case 'REJECTED': return 'bg-red-50 text-red-600';
      case 'WITHDRAWN': return 'bg-gray-50 text-gray-600';
      default: return 'bg-rh-teal/5 text-rh-teal';
    }
  };

  const profileScore = profileData.completion;

  if (isLoading) {
    return <PageLoader message="Preparing your dashboard..." subMessage="Fetching jobs and matching profile data" />;
  }

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
        <main className="flex-1 px-4 sm:px-8 lg:px-12 pt-24 md:pt-32 pb-20 w-full">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8 sm:mb-16">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="w-full">
              <div className="flex items-center gap-3 mb-2 sm:mb-0 sm:flex-col sm:items-start">
                <button
                  onClick={() => navigate('/jobs')}
                  className="sm:hidden flex items-center justify-center text-gray-400 hover:text-rh-red transition-colors"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <button
                  onClick={() => navigate('/jobs')}
                  className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-rh-red transition-colors mb-4 group text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]"
                >
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Find Jobs
                </button>
                <h1 className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-rh-teal tracking-tight leading-tight">
                  Talent <span className="text-rh-red font-[300]">Dashboard</span>
                </h1>
              </div>
              <p className="text-gray-500 mt-2 sm:mt-3 font-medium text-xs sm:text-base">Welcome back, <span className="text-rh-teal font-bold">{profileData.name || user?.fullName || 'Talent'}</span></p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="relative z-30">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`notification-bell-btn p-3.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all relative ${showNotifications ? 'bg-rh-red text-white' : 'bg-rh-light text-rh-teal hover:bg-rh-red/10'}`}
                >
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-rh-red text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Modal */}
                <NotificationModal
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                />
              </div>

              <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-rh-teal">{profileData.name}</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{profileScore >= 80 ? 'Verified Expert' : 'Building Profile'}</p>
                </div>
                <div className="relative group cursor-pointer" onClick={() => setShowProfile(true)}>
                  {profileData.avatarUrl ? (
                    <img src={profileData.avatarUrl} alt="Profile" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover ring-2 ring-rh-teal/5 group-hover:ring-rh-red/20 transition-all shadow-lg shadow-rh-teal/5" />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rh-teal flex items-center justify-center text-white font-bold text-lg ring-2 ring-rh-teal/5 group-hover:ring-rh-red/20 transition-all shadow-lg shadow-rh-teal/5">
                      {(profileData.name || 'T')[0].toUpperCase()}
                    </div>
                  )}
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${profileScore >= 80 ? 'bg-emerald-500' : 'bg-orange-400'} border-2 border-white rounded-full shadow-md`} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* User Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-16">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-rh-light/30 rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 border border-rh-teal/5 group hover:bg-white hover:shadow-2xl hover:shadow-rh-teal/5 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-6">
                  <div className={`w-9 h-9 sm:w-14 sm:h-14 ${stat.bg} ${stat.color} rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12`}>
                    <stat.icon className="w-4.5 h-4.5 sm:w-7 sm:h-7" />
                  </div>
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-lg sm:text-3xl md:text-4xl font-bold text-rh-teal mb-0.5 sm:mb-1 tracking-tight">{stat.value}{stat.label === 'Avg ATS Score' ? '%' : ''}</h3>
                <p className="text-[8px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Active Applications with Full Interaction */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

            <div className="xl:col-span-8 space-y-10">
              <div className="bg-white rounded-[24px] sm:rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-10 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="text-lg md:text-2xl font-bold text-rh-teal flex items-center gap-4">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-rh-red" /> My Applications
                  </h2>
                </div>

                <div className="p-4 sm:p-10 space-y-6 sm:space-y-16">
                  {applications.length > 0 ? applications.map((app) => (
                    <div key={app.id} className="relative group">
                      {/* App Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-10">
                        <div className="flex items-center gap-3 sm:gap-6">
                          <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-[20px] bg-rh-light flex items-center justify-center text-rh-teal shrink-0">
                            <Briefcase className="w-5 h-5 sm:w-8 sm:h-8" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5 mb-0.5 sm:mb-1">
                              <h3 className="text-xs xs:text-sm sm:text-xl font-bold text-rh-teal group-hover:text-rh-red transition-colors cursor-pointer">{app.role}</h3>
                              {app.atsScore !== null && (
                                <span className="shrink-0 px-1.5 py-0.5 bg-green-50 text-green-600 border border-green-200 rounded-md text-[8px] sm:text-xs font-bold">
                                  {app.atsScore}% Match
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] sm:text-sm font-medium text-gray-400">{app.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-none pt-3 sm:pt-0">
                          <button
                            onClick={() => toggleBookmark(app.id)}
                            className={`p-1.5 sm:p-3 rounded-lg sm:rounded-xl transition-all ${app.isBookmarked ? 'bg-rh-red/10 text-rh-red' : 'bg-rh-light text-gray-300 hover:text-rh-red'}`}
                          >
                            <Bookmark className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${app.isBookmarked ? 'fill-current' : ''}`} />
                          </button>
                          <div className={`px-2.5 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-xl text-[8px] sm:text-xs font-bold uppercase tracking-widest ${getStatusStyle(app.status)}`}>
                            {app.status.replace(/_/g, ' ')}
                          </div>
                        </div>
                      </div>

                      {/* Interactive Visual Timeline */}
                      <div className="relative px-0 sm:px-10">
                        <div className="absolute top-[9px] sm:top-[20px] left-[12.5%] right-[12.5%] h-[1.5px] sm:h-[2px] bg-gray-100" />
                        <div className="flex justify-between gap-1">
                          {app.timeline.map((step: any, idx: number) => (
                            <div key={idx} className="relative flex flex-col items-center z-10 flex-1">
                              <div className={`w-5 h-5 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border sm:border-4 border-white shadow-sm transition-all duration-500 ${step.completed ? 'bg-emerald-500 text-white' :
                                step.current ? 'bg-rh-red text-white scale-110 shadow-lg shadow-rh-red/20' :
                                  'bg-gray-200 text-gray-400'
                                }`}>
                                {step.completed ? <CheckCircle2 className="w-2.5 h-2.5 sm:w-5 sm:h-5" /> : <span className="text-[7px] sm:text-xs font-bold">{idx + 1}</span>}
                              </div>
                              <p className={`mt-1.5 sm:mt-4 text-[6px] sm:text-[10px] font-bold uppercase tracking-widest sm:tracking-[0.2em] text-center ${step.current ? 'text-rh-red' : 'text-gray-400'
                                }`}>
                                {step.step}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Next Step Interaction */}
                      <div className="mt-6 p-3 sm:p-6 bg-rh-light/30 rounded-[16px] sm:rounded-[28px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-rh-teal/5 group-hover:border-rh-red/20 transition-all duration-500">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl flex items-center justify-center text-rh-red shadow-sm">
                            <Star className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                          </div>
                          <div>
                            <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upcoming Updates</p>
                            <p className="text-[10px] sm:text-sm font-bold text-rh-teal">{app.nextStep}</p>
                            {app.status === 'INTERVIEW_SCHEDULED' && (
                              <div className="mt-0.5 flex flex-col gap-0.5">
                                {app.interviewType && <p className="text-[8px] sm:text-xs font-medium text-gray-500">Type: <span className="text-gray-800">{app.interviewType}</span></p>}
                                {app.interviewLink && (
                                  <a href={app.interviewLink} target="_blank" rel="noopener noreferrer" className="text-[8px] sm:text-xs font-bold text-rh-red hover:underline flex items-center gap-1">
                                    Join Interview Link
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="w-full sm:w-auto px-4 py-2 bg-white text-rh-teal rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-bold hover:bg-rh-teal hover:text-white transition-all shadow-sm border border-gray-100"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-20 bg-rh-light/20 rounded-[40px] border border-dashed border-gray-200">
                      <Briefcase className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-rh-teal mb-2">No active applications</h3>
                      <p className="text-gray-500 mb-8">Start your journey by exploring active roles.</p>
                      <Button onClick={() => navigate('/jobs')} variant="primary" className="px-10 py-4 rounded-2xl">Find Jobs</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Functional Sidebar */}
            <div className="xl:col-span-4 space-y-6 sm:space-y-10">
              {/* Interactive Profile Score */}
              <div className="bg-rh-teal rounded-[20px] sm:rounded-[40px] p-5 sm:p-10 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <h3 className="text-base sm:text-2xl font-bold mb-4 sm:mb-6">Resume Analytics</h3>
                <div className="relative w-24 h-24 sm:w-36 sm:h-36 mx-auto mb-4 sm:mb-10">
                  <svg viewBox="0 0 144 144" className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="64" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/10" />
                    <circle cx="72" cy="72" r="64" fill="none" stroke="currentColor" strokeWidth="8" className="text-rh-red"
                      strokeDasharray={402.12} strokeDashoffset={402.12 * (1 - profileScore / 100)} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-4xl font-bold">{profileScore}</span>
                    <span className="text-[8px] sm:text-[10px] font-bold text-white/60 uppercase tracking-widest">Pro Score</span>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 mb-3 sm:mb-4">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-rh-red shrink-0" />
                    <p className="text-[8.5px] sm:text-[11px] font-bold leading-relaxed">
                      {profileScore >= 80
                        ? `Top 15% of candidates in ${applications[0]?.role || 'your field'}`
                        : 'Complete your profile to improve visibility'}
                    </p>
                  </div>

                  <Button
                    onClick={() => navigate('/manage-profile')}
                    variant="primary" className="w-full !bg-white !text-rh-teal hover:!bg-rh-red hover:!text-white !py-2.5 sm:!py-4 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold transition-all duration-500 shadow-xl shadow-black/10"
                  >
                    {profileScore >= 100 ? 'View Profile' : 'Complete Profile'}
                  </Button>
                </div>
              </div>

              {/* Functional Job Matches */}
              <div className="bg-rh-light/20 rounded-[20px] sm:rounded-[40px] p-5 sm:p-10">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-xl font-bold text-rh-teal">Top Matches</h3>
                  <Zap className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-rh-red animate-pulse" />
                </div>
                <div className="space-y-4 sm:space-y-6">
                  {recommendedJobs.length > 0 ? recommendedJobs.map((job) => (
                    <div key={job.id} className="bg-white p-4 sm:p-6 rounded-[20px] sm:rounded-[28px] border border-gray-100 hover:border-rh-red/20 transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-rh-teal/5">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <span className="text-[8px] sm:text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg uppercase tracking-widest">{job.match} Match</span>
                        <div className="flex gap-2">
                          <button className="text-gray-300 hover:text-rh-red transition-colors"><Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                        </div>
                      </div>
                      <h4 className="text-xs sm:text-base font-bold text-rh-teal mb-0.5 sm:mb-1 group-hover:text-rh-red transition-colors">{job.title}</h4>
                      <p className="text-[9px] sm:text-[11px] font-bold text-gray-400 mb-4 sm:mb-6">{job.company}</p>

                      <div className="grid grid-cols-2 gap-2 mb-6 sm:mb-8">
                        <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-widest bg-rh-light px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl"><MapPin className="w-3 h-3 text-gray-400" /> {job.location}</div>
                        <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] font-bold text-rh-teal uppercase tracking-widest bg-rh-teal/5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl"><DollarSign className="w-3 h-3 text-rh-teal" /> {job.salary?.split(' - ')?.[0] || job.salary}</div>
                      </div>

                      <button
                        onClick={() => handleApplyNow(job.id)}
                        className="w-full py-2.5 sm:py-3.5 bg-rh-teal text-white rounded-lg sm:rounded-xl text-[9px] sm:text-[11px] font-bold hover:bg-rh-red transition-all shadow-lg shadow-rh-teal/10"
                      >
                        Apply Now
                      </button>
                    </div>
                  )) : (
                    <div className="text-center py-10 text-gray-400">
                      <Zap className="w-10 h-10 mx-auto mb-4 text-gray-200" />
                      <p className="text-sm font-medium">No job matches yet. Check back soon!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Modal: Application Detail View */}
      <AnimatePresence>
        {selectedApp && (
          <ViewApplicationDetailModal selectedApp={selectedApp} setSelectedApp={setSelectedApp} />
        )}
      </AnimatePresence>

      {/* Modal: Profile Management Module */}
      <AnimatePresence>
        {showProfile && (
          <ProfileMangementModal setShowProfile={setShowProfile} profileData={profileData} />
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
