import { motion } from 'framer-motion';
import { BarChart3, Users, TrendingUp, Filter, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { staggerContainer, fadeUp, slideInRight } from '../../utils/animations';
import { dashboardMetrics } from '../../data';
import SectionLabel from '../ui/SectionLabel';
import Button from '../ui/Button';

export default function DashboardPreview() {
  return (
    <section className="bg-rh-dark py-20 md:py-32 overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-rh-teal/10 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-rh-red/10 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Text Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="lg:w-5/12 text-center lg:text-left"
          >
            <motion.div variants={fadeUp} className="flex justify-center lg:justify-start">
              <SectionLabel className="text-white bg-white/10 border-white/20">Employer Platform</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mt-5 mb-6 leading-tight">
              Total visibility into your hiring pipeline.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base md:text-lg text-gray-400 mb-8 md:mb-10 leading-relaxed mx-auto lg:mx-0 max-w-xl">
              Our enterprise client portal gives you real-time analytics, candidate tracking, and seamless communication. Manage your entire recruitment lifecycle from a single, intuitive interface.
            </motion.p>

            <motion.div variants={fadeUp} className="space-y-4 mb-10 text-left max-w-md mx-auto lg:mx-0">
              {[
                'Real-time candidate tracking',
                'Advanced diversity analytics',
                'Custom reporting dashboards',
                'Integrated interview scheduling'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-rh-red shrink-0" />
                  <span className="text-gray-300 font-medium text-sm md:text-base">{feature}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp}>
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Request a Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Dashboard UI */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:w-7/12 w-full"
          >
            <div className="bg-[#161b22] border border-white/10 rounded-[24px] md:rounded-[32px] shadow-2xl p-5 md:p-8">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6 md:mb-8 pb-5 md:pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-rh-teal/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-rh-teal" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-white font-bold">Recruitment Analytics</h3>
                    <p className="text-[10px] md:text-xs text-gray-400">Last 30 Days</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                    <Filter className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
                  </button>
                  <button className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                    <MoreHorizontal className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                {dashboardMetrics.map((metric, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 rounded-[16px] md:rounded-[20px] p-4 md:p-5 hover:bg-white/10 transition-colors cursor-default">
                    <p className="text-[10px] md:text-xs font-semibold text-gray-400 mb-1 md:mb-2 uppercase tracking-wider">{metric.label}</p>
                    <div className="flex items-end justify-between">
                      <div className="text-xl md:text-2xl font-bold text-white tabular-nums">{metric.value}</div>
                      <div className={`text-[10px] md:text-xs font-bold flex items-center gap-0.5 md:gap-1 ${metric.trend === 'up' ? 'text-emerald-400' : 'text-rh-red'}`}>
                        {metric.trend === 'up' ? <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" /> : null}
                        {metric.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Active Pipeline List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] md:text-sm font-bold text-white uppercase tracking-wider">Active Candidates</h4>
                  <button className="text-[10px] md:text-xs font-bold text-rh-teal hover:text-white transition-colors">View All</button>
                </div>
                <div className="space-y-2 md:space-y-3">
                  {[
                    { name: 'Elena Rodriguez', role: 'VP Engineering', stage: 'Final Interview', progress: 85 },
                    { name: 'Marcus Chen', role: 'Senior Designer', stage: 'Technical Assessment', progress: 60 },
                    { name: 'Sarah Jenkins', role: 'Marketing Director', stage: 'Screening', progress: 25 },
                  ].map((candidate, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 rounded-[12px] md:rounded-[16px] p-3 md:p-4 flex items-center gap-3 md:gap-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-rh-teal to-blue-600 flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-bold text-white truncate">{candidate.name}</p>
                        <p className="text-[10px] md:text-xs text-gray-400 truncate">{candidate.role}</p>
                      </div>
                      <div className="hidden xs:block w-24 md:w-32">
                        <div className="flex justify-between text-[8px] md:text-[10px] text-gray-400 mb-1 font-semibold uppercase">
                          <span className="truncate">{candidate.stage}</span>
                        </div>
                        <div className="h-1 md:h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rh-teal rounded-full"
                            style={{ width: `${candidate.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
