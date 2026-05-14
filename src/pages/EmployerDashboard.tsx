import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Users, CheckCircle2,
  ChevronRight, Plus, Search,
  Mail, Calendar,
  ArrowRight, Building2,
  Activity, Trash2, Edit3,
  PieChart, BarChart3, Download, MapPin
} from 'lucide-react';
import { fadeUp } from '../utils/animations';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import EditJobVacancyModal from '../components/modals/employer-dashboard/EditJobVacancyModal';
import ViewVacancyPoolModal from '../components/modals/employer-dashboard/ViewVacancyPoolModal';
import ViewApplicantProfileModal from '../components/modals/employer-dashboard/ViewApplicantProfileModal';
import InterviewSchedularModal from '../components/modals/employer-dashboard/InterviewSchedulerModal';
import DeleteConfirmationModal from '../components/modals/employer-dashboard/DeleteConfirmationModal';
import { employerDashboardJobs, employerDashboardApplicants } from '../data';

export default function EmployerDashboard() {
  // --- STATE ---
  const [jobs, setJobs] = useState(employerDashboardJobs);
  const [applicants, setApplicants] = useState(employerDashboardApplicants);
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

      {/* 1. EDIT VACANCY MODAL */}
      <AnimatePresence>
        {editingJob && (
          <EditJobVacancyModal editingJob={editingJob} setEditingJob={setEditingJob} handleUpdateJob={handleUpdateJob} />
        )}
      </AnimatePresence>

      {/* 2. VIEW VACANCY POOL MODAL */}
      <AnimatePresence>
        {viewingJob && (
          <ViewVacancyPoolModal
            viewingJob={viewingJob}
            applicants={applicants}
            setViewingJob={setViewingJob}
            setViewingApplicant={setViewingApplicant}
            handleUpdateApplicantStatus={handleUpdateApplicantStatus}
          />
        )}
      </AnimatePresence>

      {/* 3. APPLICANT PROFILE VIEW MODAL */}
      <AnimatePresence>
        {viewingApplicant && (
          <ViewApplicantProfileModal
            viewingApplicant={viewingApplicant}
            setViewingApplicant={setViewingApplicant}
            setSchedulingInterview={setSchedulingInterview}
          />
        )}
      </AnimatePresence>

      {/* 4. INTERVIEW SCHEDULER MODAL */}
      <AnimatePresence>
        {schedulingInterview && (
          <InterviewSchedularModal
            schedulingInterview={schedulingInterview}
            setSchedulingInterview={setSchedulingInterview}
            handleUpdateApplicantStatus={handleUpdateApplicantStatus}
            showNotification={showNotification}
            viewingApplicant={viewingApplicant}
            setViewingApplicant={setViewingApplicant}
          />
        )}
      </AnimatePresence>

      {/* 5. DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingJob && (
          <DeleteConfirmationModal deletingJob={deletingJob} setDeletingJob={setDeletingJob} confirmDeleteJob={confirmDeleteJob} />
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
