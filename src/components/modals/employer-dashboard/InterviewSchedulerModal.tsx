import { motion } from 'framer-motion'
import { Calendar, Link as LinkIcon, X } from 'lucide-react'
import Button from '../../ui/Button'

interface InterviewSchedulerModalProps {
    schedulingInterview: any;
    setSchedulingInterview: (interview: any) => void;
    handleUpdateApplicantStatus: (id: number, status: string) => void;
    showNotification: (message: string) => void;
    viewingApplicant: any;
    setViewingApplicant: (applicant: any) => void;
}

function InterviewSchedulerModal({ schedulingInterview, setSchedulingInterview, handleUpdateApplicantStatus, showNotification, setViewingApplicant }: InterviewSchedulerModalProps) {
    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSchedulingInterview(null)} className="absolute inset-0 bg-rh-dark/60 backdrop-blur-md" />
            <motion.div
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative bg-white w-full max-w-2xl rounded-t-[32px] md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col mt-auto md:m-auto h-[80vh] md:h-auto max-h-[85vh]"
            >
                <div className="px-6 md:px-12 py-6 md:py-8 border-b border-gray-100 flex flex-col items-center shrink-0 bg-white relative">
                    <button onClick={() => setSchedulingInterview(null)} className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-rh-red transition-all"><X className="w-5 h-5" /></button>
                    <div className="w-12 h-12 md:w-15 md:h-15 bg-rh-red/5 rounded-xl md:rounded-[32px] flex items-center justify-center text-rh-red mb-4">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl md:text-3xl font-bold text-rh-teal mb-1 md:mb-3">Set Interview</h2>
                    <p className="text-[10px] md:text-sm text-gray-400 font-medium">Inviting {schedulingInterview.name} to panel</p>
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
    )
}

export default InterviewSchedulerModal