
import { motion } from 'framer-motion';
import { CheckCircle2, X, Clock, Calendar, TrendingUp, Download, MessageCircle } from 'lucide-react';
import Button from '../../ui/Button';

interface ApplicationDetail {
    id: string;
    role: string;
    company: string;
    status: string;
    date: string;
    nextStep: string;
    logo: string;
}

type Props = {
    selectedApp: ApplicationDetail;
    setSelectedApp: (app: ApplicationDetail | null) => void;
}

function ViewApplicationDetailModal({ selectedApp, setSelectedApp }: Props) {
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedApp(null)}
                className="absolute inset-0 bg-rh-dark/60 backdrop-blur-md"
            />
            <motion.div
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative bg-white w-full max-w-2xl rounded-t-[32px] md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col mt-auto md:m-auto h-[85vh] md:h-auto max-h-[90vh]"
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
                        <div className="grid grid-cols-2 gap-4 md:gap-8">
                            <div className="p-5 md:p-8 bg-rh-light/50 rounded-[24px] md:rounded-[32px] border border-gray-100 group hover:border-rh-red/20 transition-all">
                                <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 md:mb-3 flex items-center gap-2"><Clock className="w-3 h-3 text-rh-red" /> Application Status</p>
                                <p className="text-sm md:text-xl font-bold text-rh-teal">{selectedApp.status}</p>
                            </div>
                            <div className="p-5 md:p-8 bg-rh-light/50 rounded-[24px] md:rounded-[32px] border border-gray-100 group hover:border-rh-teal/20 transition-all">
                                <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 md:mb-3 flex items-center gap-2"><Calendar className="w-3 h-3 text-rh-teal" /> Submission Date</p>
                                <p className="text-sm md:text-xl font-bold text-rh-teal">{selectedApp.date.replace('Applied ', '')}</p>
                            </div>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                            <h4 className="text-[10px] md:text-xs font-bold text-rh-red uppercase tracking-widest flex items-center gap-3">
                                <div className="w-1 h-4 bg-rh-red rounded-full" /> Recruitment Insights
                            </h4>
                            <div className="p-6 md:p-10 bg-rh-teal/5 rounded-[24px] md:rounded-[40px] border border-rh-teal/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><MessageCircle className="w-12 h-12 md:w-20 md:h-20 text-rh-teal" /></div>
                                <p className="text-gray-500 text-xs md:text-md font-medium leading-relaxed relative z-10 italic">
                                    "Excellent technical performance in the initial screening. Moving forward to the panel interview phase. Please ensure your portfolio and recent case studies are ready for detailed review by the leadership team."
                                </p>
                            </div>
                        </div>

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
                    <Button variant="primary" className="flex-1 !py-4 md:!py-6 rounded-2xl md:rounded-full text-xs sm:text-sm md:text-md font-bold shadow-2xl shadow-rh-red/20 flex items-center justify-center gap-2 md:gap-3">
                        <Calendar className="w-5 h-5 md:w-6 md:h-6" /> Schedule Prep Call
                    </Button>
                    <button className="px-4 py-4 bg-rh-light text-rh-teal rounded-full hover:bg-rh-teal hover:text-white transition-all flex items-center justify-center gap-2 md:gap-3 font-bold text-xs sm:text-sm md:text-md border border-gray-100 shadow-sm group">
                        <Download className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-y-0.5 transition-transform" />
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default ViewApplicationDetailModal