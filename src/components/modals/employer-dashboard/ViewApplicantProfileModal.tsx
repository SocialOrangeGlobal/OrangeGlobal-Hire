import React from 'react'
import { motion } from 'framer-motion'
import { X, ShieldCheck, MapPin, Building2, Clock, Mail, Calendar } from 'lucide-react'
import Button from '../../ui/Button'

interface ViewApplicantProfileModalProps {
    viewingApplicant: any
    setViewingApplicant: React.Dispatch<React.SetStateAction<any | null>>
    setSchedulingInterview: React.Dispatch<React.SetStateAction<any | null>>
}

function ViewApplicantProfileModal({ viewingApplicant, setViewingApplicant, setSchedulingInterview }: ViewApplicantProfileModalProps) {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 lg:p-12 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingApplicant(null)} className="absolute inset-0 bg-rh-dark/60 backdrop-blur-md" />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative bg-white w-full max-w-5xl rounded-[32px] md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col h-auto max-h-[85vh]"
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
                                <Button onClick={() => setSchedulingInterview(viewingApplicant)} variant="primary" className="w-full h-14 md:h-20 rounded-2xl md:rounded-[32px] text-xs sm:text-sm md:text-md font-bold shadow-2xl shadow-rh-red/20 flex items-center justify-center gap-2 md:gap-3"><Calendar className="w-5 h-5 md:w-6 md:h-6" /> Schedule Interview</Button>
                                <a href={`mailto:${viewingApplicant.email}`} className="w-full h-14 md:h-20 bg-rh-teal text-white rounded-2xl md:rounded-[32px] text-xs sm:text-sm md:text-md font-bold flex items-center justify-center gap-2 md:gap-3 hover:bg-rh-red transition-all shadow-xl shadow-rh-teal/10"><Mail className="w-5 h-5 md:w-6 md:h-6" /> Send Message</a>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default ViewApplicantProfileModal