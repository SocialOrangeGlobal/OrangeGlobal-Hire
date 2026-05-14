import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import Button from '../ui/Button';
import { User, Calendar, Clock, CheckCircle2, Share2, Bookmark, MessageCircle } from 'lucide-react';

import { BlogInsight } from '../../types'

interface BlobDetailsModalProps {
    selectedBlog: BlogInsight;
    setSelectedBlog: (selectedBlog: BlogInsight | null) => void;
}

function BlobDetailsModal({ selectedBlog, setSelectedBlog }: BlobDetailsModalProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6 md:p-10">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedBlog(null)}
                className="absolute inset-0 bg-white/10 backdrop-blur-xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] bg-white rounded-none sm:rounded-[32px] md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Modal Body - Single Scrollable Column */}
                <div className="overflow-y-auto custom-scrollbar flex-1">
                    <style>{`
                  .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                  .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 20px; }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
                `}</style>

                    {/* Hero Section */}
                    <div className="relative h-64 sm:h-80 md:h-[450px]">
                        <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
                        <button
                            onClick={() => setSelectedBlog(null)}
                            className="absolute top-6 right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-rh-red hover:text-white transition-all group z-20"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
                            <span className="px-4 py-2 bg-rh-red text-white text-[10px] font-bold uppercase tracking-widest rounded-lg mb-6 inline-block">
                                {selectedBlog.category}
                            </span>
                            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-rh-teal leading-tight max-w-4xl">
                                {selectedBlog.title}
                            </h2>
                        </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-8 sm:p-12 md:p-16 max-w-4xl mx-auto">
                        <div className="flex flex-wrap items-center gap-6 sm:gap-12 py-8 border-y border-gray-50 mb-12">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rh-light flex items-center justify-center text-rh-teal">
                                    <User className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Author</p>
                                    <p className="text-sm sm:text-base font-bold text-rh-teal">{selectedBlog.author}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rh-light flex items-center justify-center text-rh-teal">
                                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Published</p>
                                    <p className="text-sm sm:text-base font-bold text-rh-teal">{selectedBlog.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rh-light flex items-center justify-center text-rh-teal">
                                    <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reading Time</p>
                                    <p className="text-sm sm:text-base font-bold text-rh-teal">{selectedBlog.readTime}</p>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-lg max-w-none">
                            {selectedBlog.content.map((para, i) => (
                                <p key={i} className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed mb-8 font-light">
                                    {para}
                                </p>
                            ))}
                        </div>

                        <div className="bg-rh-light/50 rounded-[32px] p-8 sm:p-12 mt-16 border border-gray-100">
                            <div className="flex items-center gap-4 mb-8">
                                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-rh-red" />
                                <h4 className="text-xl sm:text-2xl font-bold text-rh-teal tracking-tight">Executive Takeaways</h4>
                            </div>
                            <ul className="space-y-6">
                                {[
                                    'Master the core drivers of talent retention in 2026.',
                                    'Implement data-driven leadership frameworks.',
                                    'Leverage global market trends for competitive advantage.'
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-4 text-gray-600 text-sm sm:text-base md:text-lg items-start">
                                        <div className="w-2 h-2 bg-rh-red rounded-full mt-2.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Share & Actions */}
                        <div className="mt-16 pt-12 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Share this Insight:</span>
                                <div className="flex gap-2">
                                    {[Share2, Bookmark, MessageCircle].map((Icon, i) => (
                                        <button key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rh-light flex items-center justify-center text-rh-teal hover:bg-rh-red hover:text-white transition-all">
                                            <Icon className="w-5 h-5" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Button variant="primary" className="w-full sm:w-auto px-10 py-4 rounded-xl shadow-xl shadow-rh-red/20 font-bold">
                                Download Full Insight PDF
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default BlobDetailsModal