import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building, DollarSign, Clock, ChevronRight } from 'lucide-react';
import { staggerContainer, fadeUp } from '../../utils/animations';
import { jobs, jobCategories } from '../../data';
import SectionLabel from '../ui/SectionLabel';
import Button from '../ui/Button';

export default function FeaturedJobs() {
  const [activeCategory, setActiveCategory] = useState(jobCategories[0]);

  const filteredJobs = activeCategory === 'All Jobs'
    ? jobs
    : jobs.filter(job => job.category === activeCategory);

  return (
    <section id="jobs" className="bg-rh-light py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-2xl"
          >
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-light text-gray-900 mt-4 leading-tight">
              Featured jobs from <span className="text-rh-red font-[300] tracking-tight">top employers</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button variant="outline" className="hidden sm:flex">
              View All Openings
            </Button>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="mb-10 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {jobCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative px-5 py-2.5 text-sm font-bold rounded-full transition-all ${activeCategory === category
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
              className="group bg-white rounded-[24px] border border-gray-100 p-6 sm:p-8 hover:shadow-xl hover:border-rh-teal/20 transition-all cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden"
            >
              {/* Left Side */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-rh-teal bg-rh-teal/5 px-3 py-1 rounded-full">
                    {job.category}
                  </span>
                  {job.featured && (
                    <span className="text-xs font-bold uppercase tracking-wider text-rh-red flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rh-red" /> Featured
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-rh-teal mb-4 group-hover:text-rh-red transition-colors">
                  {job.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-sm text-gray-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-gray-400" />
                    {job.company}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {job.location} <span className="text-gray-300 ml-1">• {job.mode}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    {job.salary}
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex flex-col sm:flex-row lg:flex-col lg:items-end justify-between gap-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  {job.postedAt}
                </div>
                <Button variant="primary" className="opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                  Apply Now
                </Button>
              </div>

              {/* Hover Line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-rh-red scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 sm:hidden flex justify-center">
          <Button variant="outline" className="w-full">
            View All Openings
          </Button>
        </div>
      </div>
    </section>
  );
}
