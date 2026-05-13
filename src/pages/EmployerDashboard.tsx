import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Users, Clock, CheckCircle2,
  ChevronRight, Plus, Search, Filter,
  Mail, Calendar, ExternalLink,
  TrendingUp, ArrowRight, Zap, Building2,
  FileText, Activity, Trash2, Edit3, X,
  PieChart, BarChart3, Download, MapPin,
  DollarSign, Star, Send, ShieldCheck,
  User, Link as LinkIcon, MessageSquare
} from 'lucide-react';
import { fadeUp, scaleIn } from '../utils/animations';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';

// --- INITIAL MOCK DATA ---

const INITIAL_JOBS = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    department: 'Technology',
    type: 'Full-time',
    location: 'Remote',
    salary: '$120k - $150k',
    applicantsCount: 45,
    status: 'Active',
    postedAt: '2 days ago',
    health: 92,
    vacancies: 3,
    description: 'We are looking for a Senior Frontend Developer to join our core product team. You will be responsible for building high-performance, scalable web applications using React and TypeScript.',
    requirements: ['5+ years React experience', 'Expert TypeScript skills', 'Experience with Framer Motion'],
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js']
  },
  {
    id: 2,
    title: 'Financial Risk Analyst',
    department: 'Finance',
    type: 'Remote',
    location: 'London, UK',
    salary: '$90k - $120k',
    applicantsCount: 28,
    status: 'Active',
    postedAt: '5 days ago',
    health: 78,
    vacancies: 1,
    description: 'TechCorp is seeking a Financial Risk Analyst to help identify, assess and prioritize functional and financial risks.',
    requirements: ['CFA or equivalent', 'Python for data analysis', '3+ years in fintech'],
    skills: ['Risk Modeling', 'Python', 'SQL', 'Excel']
  },
  {
    id: 3,
    title: 'Product Design Lead',
    department: 'Design',
    type: 'Full-time',
    location: 'Hybrid',
    salary: '$140k - $180k',
    applicantsCount: 12,
    status: 'Reviewing',
    postedAt: '1 week ago',
    health: 45,
    vacancies: 2,
    description: 'Lead our design team in creating world-class user experiences for our global client base.',
    requirements: ['Portfolio showing B2B SaaS', 'Leadership experience', 'Figma mastery'],
    skills: ['UI/UX', 'Figma', 'Prototyping', 'User Research']
  },
];

const INITIAL_APPLICANTS = [
  {
    id: 1,
    jobId: 1,
    name: 'Sarah Jenkins',
    role: 'Senior Frontend Developer',
    match: '98%',
    status: 'New',
    avatar: 'https://i.pravatar.cc/100?img=32',
    email: 'sarah@example.com',
    experience: '8 years',
    location: 'Berlin, Germany',
    skills: ['React', 'TypeScript', 'Node.js', 'Redux'],
    education: 'MSc Computer Science',
    bio: 'Experienced frontend lead with a passion for clean code and high-performance animations.',
    portfolio: 'sarahcodes.dev',
    social: { linkedin: '#', github: '#' }
  },
  {
    id: 2,
    jobId: 1,
    name: 'Michael Chen',
    role: 'Senior Frontend Developer',
    match: '92%',
    status: 'Shortlisted',
    avatar: 'https://i.pravatar.cc/100?img=12',
    email: 'michael@example.com',
    experience: '6 years',
    location: 'Singapore',
    skills: ['React', 'Vue', 'AWS', 'Docker'],
    education: 'BSc Software Engineering',
    bio: 'Fullstack-leaning frontend dev with strong cloud infrastructure knowledge.',
    portfolio: 'mchen.io',
    social: { linkedin: '#', github: '#' }
  },
  {
    id: 3,
    jobId: 2,
    name: 'Emma Wilson',
    role: 'Financial Risk Analyst',
    match: '85%',
    status: 'Interviewing',
    avatar: 'https://i.pravatar.cc/100?img=44',
    email: 'emma@example.com',
    experience: '4 years',
    location: 'New York, USA',
    skills: ['Risk Management', 'Python', 'Quant Analysis'],
    education: 'MBA Finance',
    bio: 'Quant-focused analyst with experience in high-frequency trading environments.',
    portfolio: 'emmafin.com',
    social: { linkedin: '#', github: '#' }
  },
];

export default function EmployerDashboard() {
  // --- STATE ---
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Modals / Selection State
  const [editingJob, setEditingJob] = useState<any>(null);
  const [viewingJob, setViewingJob] = useState<any>(null);
  const [viewingApplicant, setViewingApplicant] = useState<any>(null);
  const [schedulingInterview, setSchedulingInterview] = useState<any>(null);
  const [deletingJob, setDeletingJob] = useState<any>(null);

  // --- LOGIC ---
  const stats = useMemo(() => {
    return [
      { label: 'Active Jobs', value: jobs.filter(j => j.status === 'Active').length, icon: Briefcase, color: 'text-rh-red', bg: 'bg-rh-red/5', trend: '+1' },
      { label: 'Applicants', value: applicants.length, icon: Users, color: 'text-rh-teal', bg: 'bg-rh-teal/5', trend: '+3' },
      { label: 'Interviews', value: applicants.filter(a => a.status === 'Interviewing').length, icon: Calendar, color: 'text-rh-red', bg: 'bg-rh-red/5', trend: '+2' },
      { label: 'Hired', value: 8, icon: CheckCircle2, color: 'text-rh-teal', bg: 'bg-rh-teal/5', trend: '+1' },
    ];
  }, [jobs, applicants]);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateJob = (updatedJob: any) => {
    setJobs(jobs.map(j => j.id === updatedJob.id ? updatedJob : j));
    setEditingJob(null);
    showNotification('Job details updated successfully');
  };

  const handleDeleteJob = (job: any) => {
    setDeletingJob(job);
  };

  const confirmDeleteJob = () => {
    if (deletingJob) {
      setJobs(jobs.filter(j => j.id !== deletingJob.id));
      setDeletingJob(null);
      showNotification('Job vacancy deleted successfully');
    }
  };

  const handleUpdateApplicantStatus = (id: number, newStatus: string) => {
    setApplicants(applicants.map(a => a.id === id ? { ...a, status: newStatus } : a));
    showNotification(`Applicant marked as ${newStatus}`);
  };

  const handlePostJob = () => {
    window.location.hash = '#post-vacancy?from=employer-dashboard';
  };

  // --- RENDER HELPERS ---
  const renderJobCard = (job: any) => (
    <div key={job.id} className="p-6 sm:p-10 hover:bg-rh-light/20 transition-all duration-300 group relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
        <div className="flex-1 cursor-pointer" onClick={() => setViewingJob(job)}>
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <h3 className="text-base sm:text-xl md:text-2xl font-bold text-rh-teal group-hover:text-rh-red transition-colors">{job.title}</h3>
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-rh-teal/5 text-rh-teal text-[8px] sm:text-[9px] font-bold rounded-full uppercase tracking-widest">{job.status}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] sm:text-xs md:text-sm text-gray-500 font-medium">
            <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300" /> {job.department}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300" /> {job.location}</span>
            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300" /> {job.applicantsCount} Applicants</span>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-10 border-t md:border-none pt-4 md:pt-0">
          <div className="hidden sm:block text-right">
            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
              <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pipeline Health</span>
              <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${job.health > 80 ? 'bg-emerald-500' : 'bg-rh-red'} transition-all`} style={{ width: `${job.health}%` }} />
              </div>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-rh-teal">{job.health}% optimized</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setViewingJob(job)}
              className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 bg-rh-teal text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm font-bold hover:bg-rh-teal/90 transition-all shadow-lg shadow-rh-teal/10"
            >
              View Pool
            </button>
            <button
              onClick={() => setEditingJob(job)}
              className="p-2 sm:p-2.5 hover:bg-rh-red/5 rounded-lg sm:rounded-xl text-gray-400 hover:text-rh-red transition-all"
            >
              <Edit3 className="w-4 h-4 sm:w-5 h-5" />
            </button>
            <button
              onClick={() => handleDeleteJob(job)}
              className="p-2 sm:p-2.5 hover:bg-rh-red/5 rounded-lg sm:rounded-xl text-gray-300 hover:text-rh-red transition-all"
            >
              <Trash2 className="w-4 h-4 sm:w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-rh-teal text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-rh-red" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row min-h-screen">
        <main className="flex-1 px-4 sm:px-8 lg:px-12 pt-32 pb-20">

          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <button
                onClick={() => window.location.hash = ''}
                className="flex items-center gap-2 text-gray-400 hover:text-rh-red transition-colors mb-4 group text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]"
              >
                <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Home
              </button>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-rh-teal tracking-tight leading-tight">
                Corporate <span className="text-rh-red font-[300]">Command Center</span>
              </h1>
              <p className="text-gray-500 mt-3 font-medium text-xs sm:text-base">Welcome back, <span className="text-rh-teal font-bold">TechCorp Solutions</span></p>
            </motion.div>

            <div className="flex items-center gap-4">
              <Button
                onClick={handlePostJob}
                variant="primary"
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow-2xl shadow-rh-red/20 text-[10px] sm:text-sm font-bold bg-rh-red hover:bg-rh-red/90 group"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" /> Post New Job
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-16">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-rh-light/30 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 border border-rh-teal/5 group hover:bg-white hover:shadow-2xl hover:shadow-rh-teal/5 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 ${stat.bg} ${stat.color} rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12`}><stat.icon className="w-5 h-5 sm:w-7 sm:h-7" /></div>
                  <div className="text-right"><span className="text-[8px] sm:text-[10px] font-bold text-rh-red bg-rh-red/5 px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg uppercase tracking-widest">{stat.trend}</span></div>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-rh-teal mb-1 tracking-tight">{stat.value}</h3>
                <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            <div className="xl:col-span-8 space-y-10">
              <div className="bg-white rounded-[32px] sm:rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-10 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rh-teal rounded-lg sm:rounded-xl flex items-center justify-center text-white"><Activity className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                    <h2 className="text-lg sm:text-2xl font-bold text-rh-teal">Hiring Pulse</h2>
                  </div>
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search jobs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full sm:w-64 pl-10 pr-6 py-2.5 bg-rh-light border-none rounded-xl text-[10px] sm:text-xs font-medium focus:ring-2 focus:ring-rh-red/20 outline-none" />
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {filteredJobs.length > 0 ? filteredJobs.map(renderJobCard) : <div className="p-20 text-center text-gray-400 font-medium">No vacancies found</div>}
                </div>
              </div>

              {/* Recruitment Velocity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-rh-teal rounded-[40px] p-10 text-white relative overflow-hidden group">
                  <PieChart className="text-rh-red w-8 h-8 sm:w-10 sm:h-10 mb-6" />
                  <h3 className="text-xl sm:text-2xl font-bold mb-4">Diversity Report</h3>
                  <p className="text-white/60 text-xs sm:text-sm mb-8 leading-relaxed">Your candidate pipeline has reached parity targets in 3/4 core departments.</p>
                  <button className="flex items-center gap-3 text-xs sm:text-sm font-bold text-white group-hover:gap-5 transition-all">Download PDF <Download className="w-4 h-4" /></button>
                </div>
                <div className="bg-rh-red rounded-[40px] p-10 text-white relative overflow-hidden group">
                  <BarChart3 className="text-white w-8 h-8 sm:w-10 sm:h-10 mb-6" />
                  <h3 className="text-xl sm:text-2xl font-bold mb-4">Hiring Speed</h3>
                  <p className="text-white/80 text-xs sm:text-sm mb-8 leading-relaxed">Time-to-hire has decreased by 4.2 days since implementing AI screening.</p>
                  <button className="flex items-center gap-3 text-xs sm:text-sm font-bold text-white group-hover:gap-5 transition-all">View Benchmark <ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {/* Global Applicant Pool */}
            <div className="xl:col-span-4">
              <div className="bg-rh-light/20 rounded-[40px] border border-rh-teal/5 p-6 sm:p-10 sticky top-32">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3"><Users className="w-4 h-4 sm:w-5 sm:h-5 text-rh-red" /><h2 className="text-lg sm:text-xl font-bold text-rh-teal">Recent Pool</h2></div>
                  <span className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg sm:rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-bold text-rh-teal shadow-sm">{applicants.length}</span>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  {applicants.slice(0, 5).map((applicant) => (
                    <div key={applicant.id} className="bg-white p-4 sm:p-6 rounded-[24px] sm:rounded-[28px] border border-gray-100 hover:border-rh-red/20 transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-rh-teal/5 cursor-pointer" onClick={() => setViewingApplicant(applicant)}>
                      <div className="flex items-center gap-4 sm:gap-5 mb-4 sm:mb-6">
                        <img src={applicant.avatar} alt={applicant.name} className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm md:text-base font-bold text-rh-teal truncate group-hover:text-rh-red transition-colors">{applicant.name}</h4>
                          <p className="text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest">{applicant.match} Match Score</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                        <Dropdown options={[{ value: 'New', label: 'New' }, { value: 'Shortlisted', label: 'Shortlisted' }, { value: 'Interviewing', label: 'Interviewing' }, { value: 'Rejected', label: 'Rejected' }]} value={applicant.status} onChange={(val) => handleUpdateApplicantStatus(applicant.id, val)} className="flex-1" />
                        <div className="flex gap-1.5 sm:gap-2 shrink-0">
                          <a href={`mailto:${applicant.email}`} className="p-2 sm:p-2.5 bg-rh-light text-gray-400 hover:text-rh-teal rounded-lg sm:rounded-xl transition-all"><Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></a>
                          <button className="p-2 sm:p-2.5 bg-rh-teal text-white rounded-lg sm:rounded-xl hover:bg-rh-red transition-all shadow-lg shadow-rh-teal/10" onClick={() => setViewingApplicant(applicant)}><ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- MODALS --- */}

      {/* 1. EDIT JOB MODAL */}
      {/* 1. EDIT VACANCY MODAL */}
      <AnimatePresence>
        {editingJob && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingJob(null)} className="absolute inset-0 bg-rh-dark/60 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white w-full max-w-4xl rounded-t-[32px] md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col mt-auto md:m-auto h-[90vh] md:h-auto max-h-[90vh]"
            >
              <div className="px-6 md:px-12 py-6 md:py-10 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-rh-light rounded-xl md:rounded-2xl flex items-center justify-center text-rh-red shrink-0">
                    <Edit3 className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-3xl font-bold text-rh-teal">Edit Vacancy</h2>
                    <p className="text-[10px] md:text-sm text-gray-400 font-medium uppercase tracking-widest mt-1">Full hiring logic management</p>
                  </div>
                </div>
                <button onClick={() => setEditingJob(null)} className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-rh-red transition-all"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
              </div>

              <div className="p-6 md:p-12 overflow-y-auto custom-scrollbar flex-1">
                <div className="space-y-8 md:space-y-12">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Title</label>
                    <input type="text" value={editingJob.title} onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })} className="w-full px-5 md:px-6 py-4 md:py-5 bg-rh-light border-none rounded-xl md:rounded-2xl text-xs md:text-base font-bold text-rh-teal outline-none focus:ring-2 focus:ring-rh-red/20" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                    <div className="space-y-2">
                      <Dropdown
                        label="Status"
                        options={[{ value: 'Active', label: 'Active' }, { value: 'Reviewing', label: 'Reviewing' }, { value: 'On Hold', label: 'On Hold' }, { value: 'Closed', label: 'Closed' }]}
                        value={editingJob.status}
                        onChange={(val) => setEditingJob({ ...editingJob, status: val })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Dropdown
                        label="Department"
                        options={[{ value: 'Technology', label: 'Technology' }, { value: 'Finance', label: 'Finance' }, { value: 'Design', label: 'Design' }]}
                        value={editingJob.department}
                        onChange={(val) => setEditingJob({ ...editingJob, department: val })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Vacancies</label>
                      <input type="number" min="1" value={editingJob.vacancies || 1} onChange={(e) => setEditingJob({ ...editingJob, vacancies: parseInt(e.target.value) })} className="w-full px-5 md:px-6 py-4 md:py-5 bg-rh-light border-none rounded-xl md:rounded-2xl text-xs md:text-base font-bold text-rh-teal outline-none focus:ring-2 focus:ring-rh-red/20" />
                    </div>
                  </div>

                  <div className="space-y-4 pb-10">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Description</label>
                    <textarea rows={6} value={editingJob.description} onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })} className="w-full px-5 md:px-6 py-4 md:py-5 bg-rh-light border-none rounded-xl md:rounded-2xl text-xs md:text-base font-medium text-rh-teal outline-none focus:ring-2 focus:ring-rh-red/20 resize-none leading-relaxed" />
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-10 border-t border-gray-100 bg-white shrink-0">
                <Button onClick={() => handleUpdateJob(editingJob)} variant="primary" className="w-full py-4 md:py-6 rounded-xl md:rounded-3xl text-sm md:text-lg font-bold shadow-xl shadow-rh-red/20">Save Vacancy Details</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. VIEW VACANCY POOL MODAL */}
      <AnimatePresence>
        {viewingJob && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingJob(null)} className="absolute inset-0 bg-rh-dark/60 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-rh-light w-full max-w-7xl rounded-t-[32px] md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[95vh] md:h-[90vh] mt-auto md:m-auto"
            >
              <button onClick={() => setViewingJob(null)} className="absolute top-6 md:top-8 right-6 md:right-8 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-rh-red transition-all shadow-xl z-20"><X className="w-5 h-5 md:w-6 md:h-6" /></button>

              {/* Left Sidebar: Job Info (Reverted to original logic/style) */}
              <div className="w-full md:w-1/3 bg-white p-6 md:p-10 border-b md:border-b-0 md:border-r border-gray-100 overflow-y-auto custom-scrollbar shrink-0">
                <div className="mb-8 md:mb-10">
                  <span className="px-3 py-1 bg-rh-red/10 text-rh-red text-[8px] md:text-[10px] font-bold rounded-full uppercase tracking-widest mb-3 md:mb-4 inline-block">{viewingJob.status}</span>
                  <h2 className="text-xl md:text-3xl font-bold text-rh-teal mb-4">{viewingJob.title}</h2>
                  <div className="space-y-3 md:space-y-4 text-[10px] md:text-sm text-gray-500 font-medium">
                    <p className="flex items-center gap-2 md:gap-3"><Building2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> {viewingJob.department}</p>
                    <p className="flex items-center gap-2 md:gap-3"><MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" /> {viewingJob.location}</p>
                    <p className="flex items-center gap-2 md:gap-3"><DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4" /> {viewingJob.salary}</p>
                  </div>
                </div>
                <div className="space-y-6 md:space-y-8">
                  <div>
                    <h4 className="text-[8px] md:text-[10px] font-bold text-rh-teal uppercase tracking-widest mb-3 md:mb-4">Required Skills</h4>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">{viewingJob.skills.map((s: any) => <span key={s} className="px-2 md:px-3 py-1 bg-rh-light text-gray-500 text-[8px] md:text-[10px] font-bold rounded-lg">{s}</span>)}</div>
                  </div>
                  <div>
                    <h4 className="text-[8px] md:text-[10px] font-bold text-rh-teal uppercase tracking-widest mb-3 md:mb-4">Description</h4>
                    <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed">{viewingJob.description}</p>
                  </div>
                </div>
              </div>

              {/* Main Content Area: Applicant Pool */}
              <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar bg-rh-light/10">
                <div className="flex items-center justify-between mb-8 md:mb-10">
                  <h3 className="text-lg md:text-2xl font-bold text-rh-teal">Applicant Pool <span className="text-rh-red">({applicants.filter(a => a.jobId === viewingJob.id).length})</span></h3>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                  {applicants.filter(a => a.jobId === viewingJob.id).map(applicant => (
                    <motion.div key={applicant.id} whileHover={{ y: -5 }} className="bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] shadow-sm border border-transparent hover:border-rh-red/20 transition-all group cursor-pointer" onClick={() => setViewingApplicant(applicant)}>
                      <div className="flex items-center gap-4 md:gap-5 mb-4 md:mb-6">
                        <div className="relative">
                          <img src={applicant.avatar} className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl object-cover" alt="" />
                          <div className="absolute -top-1.5 md:-top-2 -right-1.5 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-rh-red text-white text-[7px] md:text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white">{applicant.match}</div>
                        </div>
                        <div>
                          <h4 className="font-bold text-rh-teal text-sm md:text-lg group-hover:text-rh-red transition-colors">{applicant.name}</h4>
                          <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{applicant.experience} Exp • {applicant.location}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 md:gap-1.5 mb-4 md:mb-6">
                        {applicant.skills.slice(0, 3).map((s: any) => <span key={s} className="px-2 py-0.5 md:px-2 md:py-1 bg-rh-light text-gray-400 text-[7px] md:text-[9px] font-bold rounded-md">{s}</span>)}
                      </div>
                      <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-gray-50">
                        <Dropdown options={[{ value: 'New', label: 'New' }, { value: 'Shortlisted', label: 'Shortlisted' }, { value: 'Interviewing', label: 'Interviewing' }]} value={applicant.status} onChange={(val) => handleUpdateApplicantStatus(applicant.id, val)} className="w-24 md:w-32" />
                        <button className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs font-bold text-rh-teal hover:text-rh-red transition-colors">Profile <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3" /></button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. APPLICANT PROFILE VIEW MODAL */}
      <AnimatePresence>
        {viewingApplicant && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingApplicant(null)} className="absolute inset-0 bg-rh-dark/60 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white w-full max-w-5xl rounded-t-[32px] md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col mt-auto md:m-auto h-[90vh] md:h-auto max-h-[90vh]"
            >
              <button onClick={() => setViewingApplicant(null)} className="absolute top-6 md:top-8 right-6 md:right-8 w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-rh-red z-20 transition-all shadow-sm"><X className="w-5 h-5 md:w-6 md:h-6" /></button>

              <div className="p-6 md:p-12 lg:p-16 overflow-y-auto custom-scrollbar flex-1">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-12 md:mb-20 items-center md:items-start text-center md:text-left">
                  <div className="relative group shrink-0">
                    <img src={viewingApplicant.avatar} className="w-32 h-32 md:w-48 md:h-48 rounded-[32px] md:rounded-[56px] object-cover shadow-2xl" alt="" />
                    <div className="absolute inset-0 rounded-[32px] md:rounded-[56px] ring-1 ring-inset ring-black/5" />
                    <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 bg-rh-red text-white p-2 md:p-4 rounded-xl md:rounded-3xl shadow-xl shadow-rh-red/20"><ShieldCheck className="w-4 h-4 md:w-6 md:h-6" /></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                      <span className="px-3 py-1 bg-rh-red text-white text-[9px] md:text-xs font-bold rounded-full uppercase tracking-wider shadow-lg shadow-rh-red/20">98% Match</span>
                      <span className="px-3 py-1 bg-rh-teal/5 text-rh-teal text-[9px] md:text-xs font-bold rounded-full uppercase tracking-wider">{viewingApplicant.status}</span>
                    </div>
                    <h2 className="text-3xl md:text-6xl font-light text-rh-teal tracking-tight mb-4 md:mb-6">{viewingApplicant.name}</h2>
                    <p className="text-gray-400 text-sm md:text-xl font-medium mb-8 md:mb-10">{viewingApplicant.role} • {viewingApplicant.experience} Experience</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-3xl">
                      {[
                        { label: 'Location', val: viewingApplicant.location, icon: MapPin },
                        { label: 'Education', val: viewingApplicant.education, icon: Building2 },
                        { label: 'Availability', val: viewingApplicant.availability, icon: Clock },
                        { label: 'Contact', val: viewingApplicant.email, icon: Mail }
                      ].map((info, i) => (
                        <div key={i} className="space-y-1">
                          <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{info.label}</p>
                          <p className="text-[11px] md:text-sm font-bold text-rh-teal truncate">{info.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-20">
                  <div className="lg:col-span-2 space-y-12 md:space-y-16">
                    <section>
                      <h4 className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-3 mb-8 md:mb-10">
                        <div className="w-1.5 h-6 bg-rh-red rounded-full" /> Expertise & Skills
                      </h4>
                      <div className="flex flex-wrap gap-2 md:gap-4">
                        {viewingApplicant.skills.map((skill: any) => (
                          <span key={skill} className="px-4 md:px-6 py-2 md:py-3 bg-rh-light rounded-xl md:rounded-2xl text-[10px] md:text-sm font-bold text-rh-teal border border-rh-teal/5 hover:border-rh-red/20 transition-all">{skill}</span>
                        ))}
                      </div>
                    </section>
                    <section>
                      <h4 className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-3 mb-8 md:mb-10">
                        <div className="w-1.5 h-6 bg-rh-red rounded-full" /> Professional Summary
                      </h4>
                      <p className="text-gray-500 text-sm md:text-xl font-light leading-relaxed">Highly experienced {viewingApplicant.role} with a proven track record of delivering scalable solutions in {viewingApplicant.location}. Expert in core technologies and leadership.</p>
                    </section>
                  </div>

                  <div className="space-y-6 md:space-y-8">
                    <div className="bg-rh-light/50 rounded-[32px] md:rounded-[48px] p-8 md:p-12 text-center border border-gray-100">
                      <h4 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Match Score</h4>
                      <p className="text-4xl md:text-7xl font-bold text-rh-red mb-4">{viewingApplicant.match}</p>
                      <p className="text-[10px] md:text-xs font-bold text-rh-teal/60 uppercase tracking-widest">Recommended Candidate</p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <Button onClick={() => setSchedulingInterview(viewingApplicant)} variant="primary" className="w-full h-14 md:h-20 rounded-2xl md:rounded-[32px] text-xs sm:text-sm md:text-lg font-bold shadow-2xl shadow-rh-red/20 flex items-center justify-center gap-2 md:gap-3"><Calendar className="w-5 h-5 md:w-6 md:h-6" /> Schedule Interview</Button>
                      <a href={`mailto:${viewingApplicant.email}`} className="w-full h-14 md:h-20 bg-rh-teal text-white rounded-2xl md:rounded-[32px] text-xs sm:text-sm md:text-lg font-bold flex items-center justify-center gap-2 md:gap-3 hover:bg-rh-red transition-all shadow-xl shadow-rh-teal/10"><Mail className="w-5 h-5 md:w-6 md:h-6" /> Send Message</a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. INTERVIEW SCHEDULER MODAL */}
      {/* 4. INTERVIEW SCHEDULER MODAL */}
      <AnimatePresence>
        {schedulingInterview && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSchedulingInterview(null)} className="absolute inset-0 bg-rh-dark/60 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white w-full max-w-2xl rounded-t-[32px] md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col mt-auto md:m-auto h-[80vh] md:h-auto max-h-[85vh]"
            >
              <div className="px-6 md:px-12 py-6 md:py-12 border-b border-gray-100 flex flex-col items-center shrink-0 bg-white relative">
                <button onClick={() => setSchedulingInterview(null)} className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-rh-red transition-all"><X className="w-5 h-5" /></button>
                <div className="w-12 h-12 md:w-20 md:h-20 bg-rh-red/5 rounded-xl md:rounded-[32px] flex items-center justify-center text-rh-red mb-4 md:mb-8">
                  <Calendar className="w-6 h-6 md:w-10 md:h-10" />
                </div>
                <h2 className="text-xl md:text-4xl font-bold text-rh-teal mb-1 md:mb-3">Set Interview</h2>
                <p className="text-[10px] md:text-base text-gray-400 font-medium">Inviting {schedulingInterview.name} to panel</p>
              </div>

              <div className="p-6 md:p-12 overflow-y-auto custom-scrollbar flex-1">
                <div className="space-y-8 md:space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Date</label>
                      <input type="date" className="w-full px-6 py-4 bg-rh-light border-none rounded-2xl text-sm font-bold text-rh-teal outline-none focus:ring-2 focus:ring-rh-red/20" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Time</label>
                      <input type="time" className="w-full px-6 py-4 bg-rh-light border-none rounded-2xl text-sm font-bold text-rh-teal outline-none focus:ring-2 focus:ring-rh-red/20" />
                    </div>
                  </div>
                  <div className="space-y-3 pb-6">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Link (Meet/Zoom)</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="https://meet.google.com/..." className="w-full pl-14 pr-6 py-4 bg-rh-light border-none rounded-2xl text-sm font-bold text-rh-teal outline-none focus:ring-2 focus:ring-rh-red/20" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-10 border-t border-gray-100 bg-white shrink-0">
                <Button onClick={() => { showNotification(`Interview scheduled with ${schedulingInterview.name}`); setSchedulingInterview(null); setViewingApplicant(null); handleUpdateApplicantStatus(schedulingInterview.id, 'Interviewing'); }} variant="primary" className="w-full !py-4 md:!py-6 rounded-2xl md:rounded-[32px] text-xs sm:text-sm md:text-lg font-bold shadow-2xl shadow-rh-red/20 flex items-center justify-center gap-2">Send Interview Invite</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingJob && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6 lg:p-12 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeletingJob(null)} className="absolute inset-0 bg-rh-dark/60 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[32px] md:rounded-[48px] shadow-2xl overflow-hidden p-8 md:p-12 text-center"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-rh-red/5 rounded-[32px] flex items-center justify-center text-rh-red mx-auto mb-8">
                <Trash2 className="w-10 h-10 md:w-12 md:h-12" />
              </div>

              <h2 className="text-2xl md:text-4xl font-bold text-rh-teal mb-4 md:mb-6 leading-tight">Remove Vacancy?</h2>
              <p className="text-gray-500 text-sm md:text-lg font-medium mb-10 md:mb-12 px-4">
                Are you sure you want to delete <span className="text-rh-teal font-bold">"{deletingJob.title}"</span>? This action is permanent and will remove all applicant associations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setDeletingJob(null)}
                  className="flex-1 py-4 md:py-6 bg-rh-light text-rh-teal rounded-2xl md:rounded-[32px] text-xs sm:text-sm md:text-lg font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 md:gap-3"
                >
                  <ShieldCheck className="w-4 h-4 md:w-6 md:h-6" /> Keep Vacancy
                </button>
                <button
                  onClick={confirmDeleteJob}
                  className="flex-1 py-4 md:py-6 bg-rh-red text-white rounded-2xl md:rounded-[32px] text-xs sm:text-sm md:text-lg font-bold shadow-xl shadow-rh-red/20 hover:bg-rh-red/90 transition-all flex items-center justify-center gap-2 md:gap-3"
                >
                  <Trash2 className="w-4 h-4 md:w-6 md:h-6" /> Delete Permanently
                </button>
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
      `}} />
    </div>
  );
}
