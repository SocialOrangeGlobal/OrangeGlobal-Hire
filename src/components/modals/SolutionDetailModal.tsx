import { motion } from 'framer-motion'
import { X, Target, BarChart3, Workflow, CheckCircle2 } from 'lucide-react'
import Button from '../ui/Button'

interface SolutionDetail {
    title: string;
    description: string;
    longDescription: string;
    icon: any;
    metrics: string;
    features: string[];
    process: { step: string; text: string }[];
}

interface SolutionDetailModalProps {
    setSelectedSolution: (solution: SolutionDetail | null) => void,
    selectedSolution: SolutionDetail
}

function SolutionDetailModal({ setSelectedSolution, selectedSolution }: SolutionDetailModalProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedSolution(null)}
                className="absolute inset-0 bg-white/10 backdrop-blur-xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[32px] md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Modal Header */}
                <div className="relative p-6 sm:p-8 md:p-12 border-b border-gray-50 shrink-0">
                    <button
                        onClick={() => setSelectedSolution(null)}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-rh-light transition-colors group"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-rh-red" />
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-rh-light rounded-2xl flex items-center justify-center text-rh-red">
                            <selectedSolution.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-rh-teal">{selectedSolution.title}</h2>
                            <p className="text-rh-red font-bold text-[10px] sm:text-xs uppercase tracking-widest mt-1">{selectedSolution.metrics}</p>
                        </div>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 sm:p-8 md:p-12 overflow-y-auto custom-scrollbar flex-1">
                    <style>{`
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E7EB;
                    border-radius: 20px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D1D5DB;
                  }
                `}</style>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                        {/* Left Column: Description & Features */}
                        <div className="lg:col-span-7 space-y-8 sm:space-y-10">
                            <div className="space-y-4">
                                <h4 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Target className="w-4 h-4 text-rh-red" /> Overview
                                </h4>
                                <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed font-medium">
                                    {selectedSolution.longDescription}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-rh-red" /> Key Features
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    {selectedSolution.features.map((feature) => (
                                        <div key={feature} className="flex items-center gap-3 p-3 sm:p-4 bg-rh-light/50 rounded-xl sm:rounded-2xl border border-rh-teal/5">
                                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-rh-red shrink-0" />
                                            <span className="text-xs sm:text-sm font-bold text-rh-teal">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Process */}
                        <div className="lg:col-span-5">
                            <div className="bg-rh-light rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 border border-gray-100">
                                <h4 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6 sm:mb-8">
                                    <Workflow className="w-4 h-4 text-rh-red" /> Our Process
                                </h4>
                                <div className="space-y-6 sm:space-y-8 relative">
                                    <div className="absolute left-4 sm:left-5 top-8 bottom-8 w-[2px] bg-rh-teal/10" />
                                    {selectedSolution.process.map((p, idx) => (
                                        <div key={idx} className="relative flex gap-4 sm:gap-6 items-center">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-md flex items-center justify-center text-rh-red font-bold text-xs sm:text-sm z-10 shrink-0">
                                                {p.step}
                                            </div>
                                            <span className="text-xs sm:text-sm md:text-base font-bold text-rh-teal">{p.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 sm:p-8 md:p-10 bg-rh-light/30 border-t border-gray-50 shrink-0">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm font-medium text-center sm:text-left">
                            Ready to scale your team with {selectedSolution.title}?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <Button
                                variant="primary"
                                onClick={() => {
                                    window.location.hash = '#employer-dashboard';
                                    setSelectedSolution(null);
                                }}
                                className="px-8 sm:px-10 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm"
                            >
                                Go to Dashboard
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setSelectedSolution(null)}
                                className="px-8 sm:px-10 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm bg-white"
                            >
                                Close Details
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default SolutionDetailModal