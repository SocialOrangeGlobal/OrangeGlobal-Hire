
import { motion } from 'framer-motion';
import { CheckCircle2, X, Clock, Calendar, TrendingUp, Download, MessageCircle, Target, Award, FileText, Link as LinkIcon } from 'lucide-react';
import Button from '../../ui/Button';

interface ApplicationDetail {
    id: string;
    role: string;
    company: string;
    status: string;
    date: string;
    nextStep: string;
    logo: string;
    atsScore?: number | null;
    atsBreakdown?: { skills?: number; keywords?: number; education?: number; experience?: number } | null;
    coverLetter?: string;
    adminNotes?: string;
    interviewDate?: string;
    interviewType?: string;
    interviewLink?: string;
    interviewNotes?: string;
    offerDetails?: string;
    timeline?: any[];
}

type Props = {
    selectedApp: ApplicationDetail;
    setSelectedApp: (app: ApplicationDetail | null) => void;
}

function ViewApplicationDetailModal({ selectedApp, setSelectedApp }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPLIED': return 'bg-blue-50 text-blue-600';
            case 'UNDER_REVIEW': return 'bg-yellow-50 text-yellow-600';
            case 'SHORTLISTED': return 'bg-purple-50 text-purple-600';
            case 'INTERVIEW_SCHEDULED': return 'bg-orange-50 text-orange-600';
            case 'INTERVIEW_COMPLETED': return 'bg-teal-50 text-teal-600';
            case 'OFFER_SENT': return 'bg-emerald-50 text-emerald-600';
            case 'OFFER_ACCEPTED': return 'bg-green-50 text-green-600';
            case 'REJECTED': return 'bg-red-50 text-red-600';
            default: return 'bg-rh-teal/5 text-rh-teal';
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedApp(null)}
                className="absolute inset-0 bg-rh-dark/60 backdrop-blur-md"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                className="relative bg-white w-full max-w-2xl rounded-[32px] md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col h-auto max-h-[85vh] md:max-h-[90vh] mx-auto my-auto"
            >
                {/* Header */}
                <div className="px-6 md:px-12 py-6 md:py-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="relative">
                            <img src={selectedApp.logo} className="w-10 h-10 md:w-20 md:h-20 rounded-xl md:rounded-[28px] object-cover shadow-xl" alt="" />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-rh-red rounded-lg flex items-center justify-center text-white border-2 border-white"><CheckCircle2 className="w-3 h-3" /></div>
                        </div>
                        <div>
                            <h2 className="text-md md:text-xl font-bold text-rh-teal leading-tight">{selectedApp.role}</h2>
                            <p className="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">{selectedApp.company}</p>
                        </div>
                    </div>
                    <button onClick={() => setSelectedApp(null)} className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-rh-red transition-all shadow-sm"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
                </div>

                <div className="p-6 md:p-12 overflow-y-auto custom-scrollbar flex-1">
                    <div className="space-y-8 md:space-y-12">
                        {/* Status & Date */}
                        <div className="grid grid-cols-2 gap-4 md:gap-8">
                            <div className="p-5 md:p-8 bg-rh-light/50 rounded-[24px] md:rounded-[32px] border border-gray-100 group hover:border-rh-red/20 transition-all">
                                <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 md:mb-3 flex items-center gap-2"><Clock className="w-3 h-3 text-rh-red" /> Application Status</p>
                                <div className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(selectedApp.status)}`}>
                                    {selectedApp.status.replace(/_/g, ' ')}
                                </div>
                            </div>
                            <div className="p-5 md:p-8 bg-rh-light/50 rounded-[24px] md:rounded-[32px] border border-gray-100 group hover:border-rh-teal/20 transition-all">
                                <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 md:mb-3 flex items-center gap-2"><Calendar className="w-3 h-3 text-rh-teal" /> Submission Date</p>
                                <p className="text-sm md:text-xl font-bold text-rh-teal">{selectedApp.date}</p>
                            </div>
                        </div>

                        {/* ATS Score Breakdown */}
                        {selectedApp.atsScore != null && (
                            <div className="space-y-4 md:space-y-6">
                                <h4 className="text-[10px] md:text-xs font-bold text-rh-red uppercase tracking-widest flex items-center gap-3">
                                    <div className="w-1 h-4 bg-rh-red rounded-full" /> ATS Match Score
                                </h4>
                                <div className="p-6 md:p-8 bg-rh-light/50 rounded-[24px] md:rounded-[32px] border border-gray-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <Target className="w-6 h-6 text-rh-red" />
                                            <span className="text-2xl md:text-3xl font-bold text-rh-teal">{selectedApp.atsScore}%</span>
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg ${selectedApp.atsScore >= 80 ? 'bg-green-50 text-green-600' :
                                            selectedApp.atsScore >= 60 ? 'bg-yellow-50 text-yellow-600' :
                                                'bg-red-50 text-red-600'
                                            }`}>
                                            {selectedApp.atsScore >= 80 ? 'Strong' : selectedApp.atsScore >= 60 ? 'Moderate' : 'Needs Work'}
                                        </span>
                                    </div>

                                    {selectedApp.atsBreakdown && (
                                        <div className="space-y-4">
                                            {Object.entries(selectedApp.atsBreakdown).map(([key, val]) => (
                                                <div key={key}>
                                                    <div className="flex justify-between text-xs mb-1.5">
                                                        <span className="font-bold text-gray-500 capitalize">{key}</span>
                                                        <span className="font-bold text-rh-teal">{val}%</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-500 ${(val as number) >= 80 ? 'bg-emerald-500' :
                                                                (val as number) >= 50 ? 'bg-yellow-400' :
                                                                    'bg-red-400'
                                                                }`}
                                                            style={{ width: `${val}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Interview Details */}
                        {selectedApp.interviewDate && (
                            <div className="space-y-4 md:space-y-6">
                                <h4 className="text-[10px] md:text-xs font-bold text-rh-red uppercase tracking-widest flex items-center gap-3">
                                    <div className="w-1 h-4 bg-rh-red rounded-full" /> Interview Details
                                </h4>
                                <div className="p-6 md:p-8 bg-rh-light/50 rounded-[24px] md:rounded-[32px] border border-gray-100 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date & Time</p>
                                            <p className="text-sm font-bold text-rh-teal">
                                                {new Date(selectedApp.interviewDate).toLocaleString('en-AU', {
                                                    day: '2-digit', month: 'short', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        {selectedApp.interviewType && (
                                            <div>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Type</p>
                                                <p className="text-sm font-bold text-rh-teal capitalize">{selectedApp.interviewType}</p>
                                            </div>
                                        )}
                                    </div>
                                    {selectedApp.interviewLink && (
                                        <a href={selectedApp.interviewLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-rh-red text-xs font-bold hover:underline">
                                            <LinkIcon className="w-3 h-3" /> Join Interview Link
                                        </a>
                                    )}
                                    {selectedApp.interviewNotes && (
                                        <p className="text-xs text-gray-500 italic leading-relaxed bg-white p-4 rounded-xl border border-gray-100">"{selectedApp.interviewNotes}"</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Offer Details */}
                        {selectedApp.offerDetails && (
                            <div className="space-y-4 md:space-y-6">
                                <h4 className="text-[10px] md:text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-3">
                                    <div className="w-1 h-4 bg-emerald-500 rounded-full" /> Offer Details
                                </h4>
                                <div className="p-6 md:p-8 bg-emerald-50/50 rounded-[24px] md:rounded-[32px] border border-emerald-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Award className="w-6 h-6 text-emerald-600" />
                                        <p className="font-bold text-emerald-700">Congratulations!</p>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">{selectedApp.offerDetails}</p>
                                </div>
                            </div>
                        )}

                        {/* Admin/Recruiter Notes */}
                        {selectedApp.adminNotes && (
                            <div className="space-y-4 md:space-y-6">
                                <h4 className="text-[10px] md:text-xs font-bold text-rh-red uppercase tracking-widest flex items-center gap-3">
                                    <div className="w-1 h-4 bg-rh-red rounded-full" /> Recruiter Notes
                                </h4>
                                <div className="p-6 md:p-10 bg-rh-teal/5 rounded-[24px] md:rounded-[40px] border border-rh-teal/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><MessageCircle className="w-12 h-12 md:w-20 md:h-20 text-rh-teal" /></div>
                                    <p className="text-gray-500 text-xs md:text-md font-medium leading-relaxed relative z-10 italic">
                                        "{selectedApp.adminNotes}"
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Cover Letter Preview */}
                        {selectedApp.coverLetter && (
                            <div className="space-y-4 md:space-y-6">
                                <h4 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-3">
                                    <div className="w-1 h-4 bg-gray-300 rounded-full" /> Your Cover Letter
                                </h4>
                                <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-[24px] md:rounded-[32px]">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Submitted Message</span>
                                    </div>
                                    <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{selectedApp.coverLetter}</p>
                                </div>
                            </div>
                        )}

                        {/* Next Steps */}
                        <div className="space-y-4 md:space-y-6">
                            <h4 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-3">
                                <div className="w-1 h-4 bg-gray-300 rounded-full" /> Next Steps
                            </h4>
                            <div className="flex items-center gap-4 p-4 md:p-6 bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-sm">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-rh-teal text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-rh-teal/10"><TrendingUp className="w-5 h-5 md:w-6 md:h-6" /></div>
                                <p className="text-xs md:text-base font-bold text-rh-teal">{selectedApp.nextStep}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 md:p-10 border-t border-gray-100 bg-white shrink-0 flex flex-col md:flex-row gap-4">
                    {selectedApp.interviewLink && selectedApp.status === 'INTERVIEW_SCHEDULED' ? (
                        <a href={selectedApp.interviewLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button variant="primary" className="w-full !py-4 md:!py-6 rounded-2xl md:rounded-full text-xs sm:text-sm md:text-md font-bold shadow-2xl shadow-rh-red/20 flex items-center justify-center gap-2 md:gap-3">
                                <LinkIcon className="w-5 h-5 md:w-6 md:h-6" /> Join Interview
                            </Button>
                        </a>
                    ) : (
                        <Button variant="outline" onClick={() => setSelectedApp(null)} className="flex-1 !py-4 md:!py-6 rounded-2xl md:rounded-full text-xs sm:text-sm md:text-md font-bold flex items-center justify-center gap-2 md:gap-3 border-gray-200 hover:bg-gray-50 text-gray-700">
                            Close Window
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default ViewApplicationDetailModal