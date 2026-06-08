import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { staggerContainer, fadeUp } from '../../utils/animations';
import { jobs, jobCategories } from '../../data';
import Button from '../ui/Button';
import JobDetailsModal from '../modals/JobDetailsModal';
import type { Job } from '../../types';
import { useAppSelector } from '../../store';

export default function FeaturedJobs() {
  const navigate = useNavigate();
  const { isAuthenticated, user, accessToken } = useAppSelector((state) => state.auth);
  const [jobsList, setJobsList] = useState<Job[]>(jobs);
  const [activeCategory, setActiveCategory] = useState(jobCategories[0]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch from NestJS backend API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const url = `${import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1"}/jobs?limit=100&published=true`;
        const res = await fetch(url);
        if (res.ok) {
          const result = await res.json();
          const items = result?.data?.data?.items || [];

          if (items.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formattedJobs = items.map((item: any) => ({
              id: item.id,
              title: item.title,
              company: item.company,
              companyLogo: item.companyLogo || "https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=150",
              location: item.location,
              salary: item.salary || "Negotiable",
              type: item.type,
              mode: item.mode,
              category: item.category,
              postedAt: new Date(item.postedAt).toLocaleDateString("en-AU", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              }),
              description: item.description,
              requirements: Array.isArray(item.requirements)
                ? item.requirements
                : JSON.parse(item.requirements || "[]"),
              benefits: Array.isArray(item.benefits)
                ? item.benefits
                : JSON.parse(item.benefits || "[]"),
              applicationsCount: item._count?.applications || 0,
              deadline: item.applicationDeadline
                ? new Date(item.applicationDeadline).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })
                : undefined,
              skills: Array.isArray(item.skills)
                ? item.skills
                : JSON.parse(item.skills || "[]"),
              vacancies: item.vacancies || 1,
            }));
            setJobsList(formattedJobs);
          }
        }
      } catch (err) {
        console.error("Failed to load featured jobs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!isAuthenticated || !accessToken) return;
      try {
        const url = `${import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1"}/talent/applications`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
        if (res.ok) {
          const result = await res.json();
          const appliedIds = result?.data?.map((app: any) => app.jobId) || [];
          setAppliedJobIds(new Set(appliedIds));
        }
      } catch (err) {
        console.error("Failed to load applications:", err);
      }
    };

    fetchApplications();
  }, [isAuthenticated, accessToken]);

  if (isAuthenticated && user?.role === 'EMPLOYER') return null;

  const filteredJobs = activeCategory === 'All Jobs'
    ? jobsList
    : jobsList.filter(job => job.category === activeCategory);

  return (
    <section id="jobs" className="bg-rh-light py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 md:mb-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-2xl"
          >
            <motion.h2 variants={fadeUp} className="text-2xl xs:text-3xl sm:text-5xl font-light text-rh-teal mt-2 md:mt-4 leading-tight">
              Featured jobs from <span className="text-rh-red font-[300] tracking-tight">top employers</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden sm:block"
          >
            <Button
              onClick={() => navigate('/jobs')}
              variant="outline"
              className="text-xs sm:text-sm font-bold"
            >
              View All Openings
            </Button>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="mb-6 md:mb-10 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 min-w-max">
            {jobCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative px-3.5 py-2 md:px-5 md:py-2.5 text-[10px] md:text-sm font-bold rounded-full transition-all ${activeCategory === category
                  ? 'text-rh-teal bg-white shadow-sm'
                  : 'text-gray-500 hover:text-rh-teal hover:bg-white/50'
                  }`}
              >
                {category}
                {activeCategory === category && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-rh-teal rounded-full mx-4"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-[24px] border border-gray-100 shadow-sm min-h-[300px]">
              <Loader2 className="w-10 h-10 text-rh-teal animate-spin mb-4" />
              <p className="text-gray-500 font-semibold text-xs sm:text-sm">Retrieving active career opportunities...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-[24px] border border-gray-100 shadow-sm min-h-[300px]">
              <p className="text-gray-400 font-bold mb-2">No jobs found in this category.</p>
              <p className="text-gray-300 text-xs font-semibold">Please check back later or try a different filter.</p>
            </div>
          ) : (
            filteredJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                className="group bg-white rounded-[16px] sm:rounded-[20px] md:rounded-[24px] border border-gray-100 p-4 sm:p-5 md:p-8 hover:shadow-xl hover:border-rh-teal/20 transition-all cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden"
              >
                {/* Left Side */}
                <div className="flex-1 flex gap-3 sm:gap-5 items-start">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 shrink-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-100 bg-white flex items-center justify-center shadow-sm overflow-hidden mt-1">
                    <img
                      src={job.companyLogo}
                      alt={`${job.company} Logo`}
                      className="h-full w-full object-contain p-1 md:p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5 md:mb-3">
                      <span className="text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider text-rh-teal bg-rh-teal/5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                        {job.category}
                      </span>
                      <span className="text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider text-rh-red flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rh-red" /> {job.mode}
                      </span>
                      {appliedJobIds.has(job.id) && (
                        <span className="text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Applied
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base md:text-xl font-bold text-rh-teal mb-1.5 md:mb-4 group-hover:text-rh-red transition-colors leading-tight">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-8 gap-y-1.5 text-[9px] sm:text-xs md:text-sm text-gray-500 font-medium">
                      {/* <div className="flex items-center gap-1">
                        <Building className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-gray-400" />
                        {job.company}
                      </div> */}
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-gray-400" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1 text-rh-teal font-bold bg-rh-teal/5 px-1.5 py-0.5 rounded-md lg:bg-transparent lg:px-0">
                        {job.salary}
                      </div>
                      {job.deadline && (
                        <div className="flex items-center gap-1 text-rh-red font-medium">
                          Due: {job.deadline}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4 border-t border-gray-50 lg:border-none pt-4 lg:pt-0">
                  <div className="flex items-center gap-1 text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-400 shrink-0">
                    <Clock className="w-3 md:w-3.5 h-3 md:h-3.5" />
                    {job.postedAt}
                  </div>

                  <div className="flex items-center gap-2 transition-all duration-300 lg:opacity-0 lg:translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 w-full xs:w-auto">
                    {appliedJobIds.has(job.id) ? (
                      <div className="flex items-center gap-2 w-full xs:w-auto">
                        <div className="hidden xs:flex items-center gap-1 px-2.5 py-1 bg-rh-red rounded-full shadow-sm shadow-rh-red/20">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                          <span className="text-[8px] sm:text-[10px] text-white font-bold uppercase tracking-wider">Applied</span>
                        </div>
                        <Button
                          variant="outline"
                          className="flex-1 xs:flex-none px-3.5 py-1.5 text-[9px] sm:text-xs !rounded-full font-bold whitespace-nowrap !border-rh-teal !text-rh-teal hover:!bg-rh-teal/10 cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); navigate('/talent-dashboard'); }}
                        >
                          View Application
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1 xs:flex-none px-3.5 py-1.5 text-[9px] sm:text-xs !rounded-full border-gray-200 hover:border-gray-300 hover:text-rh-red font-bold"
                          onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                        >
                          View
                        </Button>
                        <Button
                          variant="primary"
                          className="flex-1 xs:flex-none px-3.5 py-1.5 text-[9px] sm:text-xs !rounded-full font-bold whitespace-nowrap shadow-lg shadow-rh-red/10 cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); navigate(`/apply-job?id=${job.id}`); }}
                        >
                          Apply Now
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Hover Line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rh-red scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
              </motion.div>
            ))
          )}
        </div>

        <div className="mt-8 sm:hidden">
          <Button
            onClick={() => navigate('/jobs')}
            variant="outline"
            className="w-full !h-auto !py-3.5 text-xs xs:text-sm font-bold"
          >
            View All Openings
          </Button>
        </div>
      </div>

      <JobDetailsModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        isApplied={selectedJob ? appliedJobIds.has(selectedJob.id) : false}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </section>
  );
}
