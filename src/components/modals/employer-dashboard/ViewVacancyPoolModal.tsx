import { ArrowRight, Building2, DollarSign, MapPin, X } from 'lucide-react'
import { motion } from 'framer-motion'
import Dropdown from '../../ui/Dropdown'

import { Applicant } from '../../../types'

interface ViewVacancyPoolModalProps {
    viewingJob: any;
    applicants: Applicant[];
    setViewingJob: (job: any) => void;
    setViewingApplicant: (applicant: Applicant) => void;
    handleUpdateApplicantStatus: (id: number, status: string) => void;
}

function ViewVacancyPoolModal({
    viewingJob,
    applicants,
    setViewingJob,
    setViewingApplicant,
    handleUpdateApplicantStatus
}: ViewVacancyPoolModalProps) {
    return (
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
                            <div className="flex flex-wrap gap-1.5 md:gap-2">{viewingJob.skills.map((s: string) => <span key={s} className="px-2 md:px-3 py-1 bg-rh-light text-gray-500 text-[8px] md:text-[10px] font-bold rounded-lg">{s}</span>)}</div>
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
                        {applicants.filter(a => a.jobId === viewingJob.id).map((applicant: Applicant) => (
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
                                    {applicant.skills.slice(0, 3).map((s: string) => <span key={s} className="px-2 py-0.5 md:px-2 md:py-1 bg-rh-light text-gray-400 text-[7px] md:text-[9px] font-bold rounded-md">{s}</span>)}
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
    )
}

export default ViewVacancyPoolModal