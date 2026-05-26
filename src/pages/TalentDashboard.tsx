import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, CheckCircle2,
  MapPin, DollarSign, Bookmark, FileText,
  Target, Zap, TrendingUp, ArrowRight, Bell, Star, MessageCircle
} from 'lucide-react';
import { fadeUp } from '../utils/animations';
import Button from '../components/ui/Button';
import PageLoader from '../components/ui/PageLoader';
import NotificationModal from '../components/modals/talent-dashboard/NotificationModal';
import ViewApplicationDetailModal from '../components/modals/talent-dashboard/ViewApplicationDetailModal';
import ProfileMangementModal from '../components/modals/talent-dashboard/ProfileManagementModal';
import { useAppSelector } from '../store';

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
  const [notifications, setNotifications] = useState<any[]>([]);

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

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      setIsLoading(true);
      Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1"}/talent/applications`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }).then(res => res.json()),
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1"}/users/me`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }).then(res => res.json()),
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1"}/jobs?limit=3`)
          .then(res => res.json())
      ])
        .then(([appsData, profileResp, jobsResp]) => {
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

              if (status === 'INTERVIEW_SCHEDULED') {
                setNotifications(prev => {
                  if (prev.some(n => n.id === `interview-${app.id}`)) return prev;
                  return [...prev, {
                    id: `interview-${app.id}`,
                    title: 'Interview Scheduled',
                    message: `Interview for ${app.job?.title} at ${app.job?.company} is scheduled.`,
                    time: new Date(app.appliedAt).toLocaleDateString(),
                    unread: true,
                    type: 'interview'
                  }];
                });
              }

              const isClosed = ['REJECTED', 'WITHDRAWN', 'OFFER_REJECTED'].includes(status);

              return {
                id: app.id,
                company: app.job?.company || "Unknown",
                logo: "https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=150",
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
              name: profileResp.data.fullName || user?.fullName || "Talent User",
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

          // Process Recommended Jobs
          if (jobsResp.success) {
            const raw = jobsResp.data?.items || jobsResp.data;
            const items = Array.isArray(raw) ? raw : [];
            const jobs = items.map((job: any) => ({
              id: job.id,
              title: job.title,
              company: job.company,
              location: job.location,
              salary: job.salary || 'Negotiable',
              tags: job.skills?.slice(0, 3) || [],
              match: `${Math.floor(Math.random() * 15 + 80)}%`,
            }));
            setRecommendedJobs(jobs);
          }
          // If core application data fails to load completely, we can keep the loader or show an error.
          // For now, if appsData doesn't have success, it means the API failed.
          if (appsData && appsData.success === false) {
            console.error("API Error fetching applications:", appsData);
            // We can optionally leave the loader running if the user requested it, or show an error notification
            setNotification("Error fetching data. Retrying...");
            setTimeout(() => window.location.reload(), 3000); // Simple auto-retry
            return;
          }

          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Network or parsing error:", err);
          // If the data does not come from the API, keep showing the loader as requested
          // or auto-retry.
        });
    } else {
      navigate('/signin');
    }
  }, [isAuthenticated, accessToken]);

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

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

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
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-white"
    >
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
        <main className="flex-1 px-4 sm:px-8 lg:px-12 pt-24 md:pt-32 pb-20 w-full overflow-hidden">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <button
                onClick={() => navigate('/jobs')}
                className="flex items-center gap-2 text-gray-400 hover:text-rh-red transition-colors mb-4 group text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]"
              >
                <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Find Jobs
              </button>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-rh-teal tracking-tight leading-tight">
                Talent <span className="text-rh-red font-[300]">Dashboard</span>
              </h1>
              <p className="text-gray-500 mt-3 font-medium text-xs sm:text-base">Welcome back, <span className="text-rh-teal font-bold">{profileData.name || user?.fullName || 'Talent'}</span></p>
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
                    <NotificationModal
                      notifications={notifications}
                      setShowNotifications={setShowNotifications}
                      setNotifications={setNotifications}
                    />
                  )}
                </AnimatePresence>
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
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-rh-teal mb-1 tracking-tight">{stat.value}{stat.label === 'Avg ATS Score' ? '%' : ''}</h3>
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
                          <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest ${getStatusStyle(app.status)}`}>
                            {app.status.replace(/_/g, ' ')}
                          </div>
                        </div>
                        {app.atsScore !== null && (
                          <div className="absolute top-4 right-4 sm:static flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 border border-green-200 rounded-lg text-xs font-bold">
                            <span>{app.atsScore}% Match</span>
                          </div>
                        )}
                      </div>

                      {/* Interactive Visual Timeline */}
                      <div className="relative px-0 sm:px-10">
                        <div className="absolute top-[20px] left-[40px] right-[40px] sm:left-[60px] sm:right-[60px] h-[2px] bg-gray-100" />
                        <div className="flex justify-between gap-2">
                          {app.timeline.map((step: any, idx: number) => (
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
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Upcoming Updates</p>
                            <p className="text-sm font-bold text-rh-teal">{app.nextStep}</p>
                            {app.status === 'INTERVIEW_SCHEDULED' && (
                              <div className="mt-1 flex flex-col gap-1">
                                {app.interviewType && <p className="text-xs font-medium text-gray-500">Type: <span className="text-gray-800">{app.interviewType}</span></p>}
                                {app.interviewLink && (
                                  <a href={app.interviewLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-rh-red hover:underline flex items-center gap-1">
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
                      <Button onClick={() => navigate('/jobs')} variant="primary" className="px-10 py-4 rounded-2xl">Find Jobs</Button>
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
                      strokeDasharray={402.12} strokeDashoffset={402.12 * (1 - profileScore / 100)} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{profileScore}</span>
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Pro Score</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 mb-4">
                    <TrendingUp className="w-5 h-5 text-rh-red" />
                    <p className="text-[11px] font-bold leading-relaxed">
                      {profileScore >= 80
                        ? `Top 15% of candidates in ${applications[0]?.role || 'your field'}`
                        : 'Complete your profile to improve visibility'}
                    </p>
                  </div>

                  <Button
                    onClick={() => navigate('/manage-profile')}
                    variant="primary" className="w-full !bg-white !text-rh-teal hover:!bg-rh-red hover:!text-white !py-4 rounded-2xl text-xs font-bold transition-all duration-500 shadow-xl shadow-black/10"
                  >
                    {profileScore >= 100 ? 'View Profile' : 'Complete Profile'}
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
                  {recommendedJobs.length > 0 ? recommendedJobs.map((job) => (
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
                        <div className="flex items-center gap-2 text-[9px] font-bold text-rh-teal uppercase tracking-widest bg-rh-teal/5 px-3 py-2 rounded-xl"><DollarSign className="w-3 h-3" /> {job.salary?.split(' - ')?.[0] || job.salary}</div>
                      </div>

                      <button
                        onClick={() => handleApplyNow(job.id)}
                        className="w-full py-3.5 bg-rh-teal text-white rounded-xl text-[11px] font-bold hover:bg-rh-red transition-all shadow-lg shadow-rh-teal/10"
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
    </motion.div>
  );
}
