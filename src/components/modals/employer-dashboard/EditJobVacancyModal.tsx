import { motion } from 'framer-motion'
import { Edit3, X } from 'lucide-react'
import Dropdown from '../../ui/Dropdown'
import Button from '../../ui/Button'

function EditJobVacancyModal({ editingJob, setEditingJob, handleUpdateJob }: any) {
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingJob(null)} className="absolute inset-0 bg-rh-dark/60 backdrop-blur-md" />
            <motion.div
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative bg-white w-full max-w-4xl rounded-t-[32px] md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col mt-auto md:m-auto h-[90vh] md:h-auto max-h-[90vh]"
            >
                <div className="px-6 md:px-12 py-6 md:py-8 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-rh-light rounded-xl md:rounded-2xl flex items-center justify-center text-rh-red shrink-0">
                            <Edit3 className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-rh-teal">Edit Job Vacancy</h2>
                            <p className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Full hiring logic management</p>
                        </div>
                    </div>
                    <button onClick={() => setEditingJob(null)} className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-rh-red transition-all"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
                </div>

                <div className="p-6 md:p-12 overflow-y-auto custom-scrollbar flex-1">
                    <div className="space-y-8 md:space-y-12">
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Title</label>
                            <input type="text" value={editingJob.title} onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })} className="w-full px-5 md:px-6 py-4 md:py-5 bg-rh-light border-none rounded-xl md:rounded-2xl text-xs md:text-base font-bold text-rh-teal outline-none focus:ring-2 focus:ring-rh-red/20" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                            <div className="space-y-2">
                                <Dropdown
                                    label="Status"
                                    options={[{ value: 'Active', label: 'Active' }, { value: 'Reviewing', label: 'Reviewing' }, { value: 'On Hold', label: 'On Hold' }, { value: 'Closed', label: 'Closed' }]}
                                    value={editingJob.status}
                                    onChange={(val) => setEditingJob({ ...editingJob, status: val })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Dropdown
                                    label="Department"
                                    options={[{ value: 'Technology', label: 'Technology' }, { value: 'Finance', label: 'Finance' }, { value: 'Design', label: 'Design' }]}
                                    value={editingJob.department}
                                    onChange={(val) => setEditingJob({ ...editingJob, department: val })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Vacancies</label>
                                <input type="number" min="1" value={editingJob.vacancies || 1} onChange={(e) => setEditingJob({ ...editingJob, vacancies: parseInt(e.target.value) })} className="w-full px-5 md:px-6 py-4 md:py-5 bg-rh-light border-none rounded-xl md:rounded-2xl text-xs md:text-base font-bold text-rh-teal outline-none focus:ring-2 focus:ring-rh-red/20" />
                            </div>
                        </div>

                        <div className="space-y-4 pb-10">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Description</label>
                            <textarea rows={6} value={editingJob.description} onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })} className="w-full px-5 md:px-6 py-4 md:py-5 bg-rh-light border-none rounded-xl md:rounded-2xl text-xs md:text-base font-medium text-rh-teal outline-none focus:ring-2 focus:ring-rh-red/20 resize-none leading-relaxed" />
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-10 border-t border-gray-100 bg-white shrink-0">
                    <Button onClick={() => handleUpdateJob(editingJob)} variant="primary" className="w-full py-4 md:py-6 rounded-xl md:rounded-3xl text-sm md:text-lg font-bold shadow-xl shadow-rh-red/20">Save Vacancy Details</Button>
                </div>
            </motion.div>
        </div>
    )
}

export default EditJobVacancyModal