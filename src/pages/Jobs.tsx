import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, Clock, Building2, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import JobDetailsModal from '../components/modals/JobDetailsModal';
import { fadeUp } from '../utils/animations';
import type { Job } from '../types';

const ITEMS_PER_PAGE = 4;

export default function JobsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [jobsList, setJobsList] = useState<Job[]>([]);

  // Fetch from NestJS backend API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1"}/jobs?limit=100&published=true`;
        const res = await fetch(url);
        if (res.ok) {
          const result = await res.json();
          const items = result.data?.items || [];
          
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
      } catch (err) {
        console.error("Failed to load jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  // Check for category in URL params
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategories([category]);
    }
  }, [searchParams]);

  // Filter and Sort Jobs
  const allFilteredJobs = useMemo(() => {
    let result = jobsList.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = job.location.toLowerCase().includes(locationQuery.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(job.category);
      const matchesMode = selectedModes.length === 0 || selectedModes.includes(job.mode);

      return matchesSearch && matchesLocation && matchesCategory && matchesMode;
    });

    if (sortBy === 'latest') {
      result = [...result].reverse();
    } else if (sortBy === 'salary-high') {
      result = [...result].sort((a, b) => {
        const getVal = (s: string) => parseInt(s.replace(/[^0-9]/g, '')) || 0;
        return getVal(b.salary) - getVal(a.salary);
      });
    }

    return result;
  }, [jobsList, searchQuery, locationQuery, selectedCategories, selectedModes, sortBy]);

  const totalPages = Math.ceil(allFilteredJobs.length / ITEMS_PER_PAGE);
  const currentJobs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return allFilteredJobs.slice(start, start + ITEMS_PER_PAGE);
  }, [allFilteredJobs, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, locationQuery, selectedCategories, selectedModes, sortBy]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleMode = (mode: string) => {
    setSelectedModes(prev =>
      prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]
    );
  };

  const navigateToApply = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    navigate(`/apply-job?id=${jobId}`);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-rh-dark pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-4xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-white mb-8 tracking-tight leading-[1.1]">
              Your career, <br />
              <span className="text-rh-red font-[300]">reimagined from here</span>
            </h1>

            {/* <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <Button
                onClick={() => navigate('/talent-dashboard')}
                variant="primary"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white !text-rh-teal hover:bg-rh-light font-bold flex items-center gap-2"
              >
                View Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </div> */}

            <div className="relative bg-[#1a1f24]/40 backdrop-blur-3xl p-1.5 rounded-[20px] md:rounded-[28px] border border-white/10 flex flex-col md:flex-row items-center gap-1 md:gap-1.5 shadow-2xl z-20 overflow-hidden">
              <div className="flex-1 flex items-center px-4 md:px-6 gap-3 w-full border-b md:border-b-0 md:border-r border-white/5 py-1 md:py-0">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Job title or keywords"
                  className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500 py-3 md:py-4 text-sm md:text-base appearance-none"
                />
              </div>
              <div className="flex-1 flex items-center px-4 md:px-6 gap-3 w-full py-1 md:py-0">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Location"
                  className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500 py-3 md:py-4 text-sm md:text-base appearance-none"
                />
              </div>
              <Button variant="primary" className="w-full md:w-auto px-8 md:px-12 py-3.5 md:py-5 rounded-[18px] md:rounded-[24px] shadow-2xl shadow-rh-red/20 text-sm md:text-base font-bold whitespace-nowrap">Search Jobs</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-rh-light min-h-[800px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10">

            <aside className="w-full lg:w-72 shrink-0">
              <div className="sticky top-32 space-y-12">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-rh-teal flex items-center gap-2">
                    <Filter className="w-5 h-5 text-rh-red" /> Filters
                  </h3>
                  <button
                    onClick={() => { setSelectedCategories([]); setSelectedModes([]); }}
                    className="text-xs font-bold text-rh-red uppercase tracking-widest hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Department</h4>
                  <div className="space-y-4">
                    {['Technology', 'Finance & Accounting', 'Legal', 'Marketing & Creative'].map(cat => (
                      <label key={cat} className="flex items-center gap-4 cursor-pointer group">
                        <div
                          onClick={() => toggleCategory(cat)}
                          className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${selectedCategories.includes(cat) ? 'bg-rh-red border-rh-red' : 'bg-white border-gray-200 group-hover:border-rh-red/30'
                            }`}
                        >
                          {selectedCategories.includes(cat) && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${selectedCategories.includes(cat) ? 'text-rh-teal font-bold' : 'text-gray-500 group-hover:text-rh-teal'}`}>
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Work Mode</h4>
                  <div className="space-y-4">
                    {['Remote', 'Hybrid', 'On-site'].map(mode => (
                      <label key={mode} className="flex items-center gap-4 cursor-pointer group">
                        <div
                          onClick={() => toggleMode(mode)}
                          className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${selectedModes.includes(mode) ? 'bg-rh-teal border-rh-teal' : 'bg-white border-gray-200 group-hover:border-rh-teal/30'
                            }`}
                        >
                          {selectedModes.includes(mode) && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${selectedModes.includes(mode) ? 'text-rh-teal font-bold' : 'text-gray-500 group-hover:text-rh-teal'}`}>
                          {mode}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-rh-teal rounded-[32px] p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rh-red/20 rounded-full blur-2xl -translate-y-12 translate-x-12" />
                  <h4 className="text-xl font-bold mb-4 leading-tight">Can't find the perfect role?</h4>
                  <p className="text-white/60 text-sm mb-6 leading-relaxed">Join our talent database and get notified when matching roles open up.</p>
                  <Button variant="primary" className="w-full !py-3.5 !rounded-xl !bg-white !text-rh-teal hover:!bg-rh-red hover:!text-white transition-all">Subscribe Now</Button>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-xl font-bold text-rh-teal">Showing {allFilteredJobs.length} Jobs</h2>
                  <p className="text-gray-500 text-xs mt-1">Based on your current filters</p>
                </div>

                <div className="flex items-center gap-6">
                  <Dropdown
                    options={[
                      { value: 'latest', label: 'Latest Positions' },
                      { value: 'salary-high', label: 'Highest Salary' },
                      { value: 'relevant', label: 'Most Relevant' }
                    ]}
                    value={sortBy}
                    onChange={setSortBy}
                    className="w-64"
                  />
                </div>
              </div>

              <div className="space-y-6">
                {currentJobs.length > 0 ? currentJobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedJob(job)}
                    className="group bg-white rounded-[20px] md:rounded-[24px] border border-gray-100 p-5 md:p-8 hover:shadow-xl hover:border-rh-teal/20 transition-all cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden"
                  >
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
                          <Building2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
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
                          onClick={(e) => navigateToApply(e, job.id)}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-rh-red scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
                  </motion.div>
                )) : (
                  <div className="text-center py-32 bg-white rounded-[48px] border border-dashed border-gray-200">
                    <Briefcase className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-rh-teal mb-3">No results found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">Try broadening your search or resetting the filters to discover more roles.</p>
                    <Button variant="outline" onClick={() => { setSearchQuery(''); setLocationQuery(''); }} className="mt-8 px-10 py-4 rounded-xl">Clear All Search</Button>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-20 flex items-center justify-center gap-3">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-rh-teal disabled:opacity-30 disabled:cursor-not-allowed hover:border-rh-red hover:text-rh-red transition-all shadow-sm"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-12 h-12 rounded-2xl font-bold transition-all shadow-sm ${currentPage === i + 1
                        ? 'bg-rh-red text-white'
                        : 'bg-white border border-gray-100 text-gray-400 hover:border-rh-red hover:text-rh-red'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-rh-teal disabled:opacity-30 disabled:cursor-not-allowed hover:border-rh-red hover:text-rh-red transition-all shadow-sm"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Full Details Overlay */}
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
    </div>
  );
}
