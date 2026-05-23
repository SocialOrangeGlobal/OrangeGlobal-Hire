import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Building, Clock } from 'lucide-react';
import { staggerContainer, fadeUp } from '../../utils/animations';
import { jobs, jobCategories } from '../../data';
import Button from '../ui/Button';
import JobDetailsModal from '../modals/JobDetailsModal';
import type { Job } from '../../types';
import { useAppSelector } from '../../store';

export default function FeaturedJobs() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [jobsList, setJobsList] = useState<Job[]>(jobs);
  const [activeCategory, setActiveCategory] = useState(jobCategories[0]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Fetch from NestJS backend API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1"}/jobs?limit=100&published=true`;
        const res = await fetch(url);
        if (res.ok) {
          const result = await res.json();
          const items = result.data?.data?.items || [];

          if (items.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formattedJobs = items.map((item: any) => ({
              id: item.id,
              title: item.title,
              company: item.company,
              companyLogo: "https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=150",
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
                : JSON.parse(item.benefits || "[]")
            }));
            setJobsList(formattedJobs);
          }
        }
      } catch (err) {
        console.error("Failed to load featured jobs:", err);
      }
    };
    fetchJobs();
  }, []);

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
            <motion.h2 variants={fadeUp} className="text-3xl xs:text-4xl sm:text-5xl font-light text-rh-teal mt-2 md:mt-4 leading-tight">
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
            >
              View All Openings
            </Button>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="mb-8 md:mb-10 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 min-w-max">
            {jobCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-bold rounded-full transition-all ${activeCategory === category
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
          {filteredJobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
              className="group bg-white rounded-[20px] md:rounded-[24px] border border-gray-100 p-5 md:p-8 hover:shadow-xl hover:border-rh-teal/20 transition-all cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden"
            >
              {/* Left Side */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 md:mb-3">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-rh-teal bg-rh-teal/5 px-2.5 py-1 rounded-full">
                    {job.category}
                  </span>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-rh-red flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rh-red" /> {job.mode}
                  </span>
                </div>
                <h3 className="text-base md:text-xl font-bold text-rh-teal mb-2 md:mb-4 group-hover:text-rh-red transition-colors leading-tight">
                  {job.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 md:gap-x-8 gap-y-2 text-[11px] md:text-sm text-gray-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
                    {job.company}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-rh-teal font-bold bg-rh-teal/5 px-2 py-0.5 rounded-md lg:bg-transparent lg:px-0">
                    {job.salary}
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4 border-t border-gray-50 lg:border-none pt-4 lg:pt-0">
                <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-gray-400 shrink-0">
                  <Clock className="w-3 md:w-3.5 h-3 md:h-3.5" />
                  {job.postedAt}
                </div>

                <div className="flex items-center gap-2 transition-all duration-300 lg:opacity-0 lg:translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 w-full xs:w-auto">
                  <Button
                    variant="outline"
                    className="flex-1 xs:flex-none px-4 md:px-4 py-2 text-[10px] md:text-xs !rounded-full border-gray-200 hover:border-gray-300 hover:text-rh-red font-bold"
                    onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                  >
                    View
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1 xs:flex-none px-4 md:px-4 py-2 text-[10px] md:text-xs !rounded-full font-bold whitespace-nowrap shadow-lg shadow-rh-red/10 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); navigate(`/apply-job?id=${job.id}`); }}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>

              {/* Hover Line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-rh-red scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Button
            onClick={() => navigate('/jobs')}
            variant="outline"
            className="w-full py-4"
          >
            View All Openings
          </Button>
        </div>
      </div>

      <JobDetailsModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
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
