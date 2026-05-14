import { motion } from 'framer-motion'
import { ShieldCheck, Trash2 } from 'lucide-react'

interface DeleteConfirmationModalProps {
    deletingJob: any;
    setDeletingJob: (job: any) => void;
    confirmDeleteJob: () => void;
}

function DeleteConfirmationModal({ deletingJob, setDeletingJob, confirmDeleteJob }: DeleteConfirmationModalProps) {
    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6 lg:p-12 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeletingJob(null)} className="absolute inset-0 bg-rh-dark/60 backdrop-blur-md" />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-lg rounded-[32px] md:rounded-[48px] shadow-2xl overflow-hidden p-8 md:p-12 text-center"
            >
                <div className="w-20 h-20 bg-rh-red/5 rounded-[32px] flex items-center justify-center text-rh-red mx-auto mb-8">
                    <Trash2 className="w-10 h-10" />
                </div>

                <h2 className="text-2xl md:text-2xl font-bold text-rh-teal mb-4 md:mb-6 leading-tight">Remove Vacancy?</h2>
                <p className="text-gray-500 text-sm md:text-md font-medium mb-10 md:mb-12 px-4">
                    Are you sure you want to delete <span className="text-rh-teal font-bold">"{deletingJob.title}"</span>? This action is permanent and will remove all applicant associations.
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        onClick={() => setDeletingJob(null)}
                        className="flex-1 py-4 md:py-6 bg-rh-light text-rh-teal rounded-2xl md:rounded-[32px] text-xs sm:text-sm md:text-md font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 md:gap-3"
                    >
                        <ShieldCheck className="w-4 h-4" /> Keep Vacancy
                    </button>
                    <button
                        onClick={confirmDeleteJob}
                        className="flex-1 py-4 md:py-6 bg-rh-red text-white rounded-2xl md:rounded-[32px] text-xs sm:text-sm md:text-md font-bold shadow-xl shadow-rh-red/20 hover:bg-rh-red/90 transition-all flex items-center justify-center gap-2 md:gap-3"
                    >
                        <Trash2 className="w-4 h-4" /> Delete Permanently
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default DeleteConfirmationModal