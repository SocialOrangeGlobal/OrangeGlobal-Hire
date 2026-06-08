import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Zap, CheckCircle, Trash2, Target } from 'lucide-react';
import Button from '../ui/Button';

interface ResumeManagerProps {
  profile: any;
  resumeExtracting: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  mainResumeError: string;
  handleResumeUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSetDefaultResume: (id: string) => Promise<void>;
  handleDeleteResume: (id: string) => void;
  setSelectedDoc: (doc: { url: string; title: string } | null) => void;
  resumeScore: number | null;
  formatDateBeautifully: (dateStr: any) => string;
}

export const ResumeManager: React.FC<ResumeManagerProps> = ({
  profile,
  resumeExtracting,
  fileInputRef,
  mainResumeError,
  handleResumeUpload,
  handleSetDefaultResume,
  handleDeleteResume,
  setSelectedDoc,
  resumeScore,
  formatDateBeautifully,
}) => {
  return (
    <motion.div
      key="resume"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10"
    >
      <section className="bg-white rounded-[2rem] sm:rounded-[40px] p-6 sm:p-10 lg:p-16 shadow-sm border border-gray-100">
        <div className="mb-10 text-center max-w-xl mx-auto">
          <h3 className="text-3xl font-bold text-rh-teal mb-4">Resume Intelligence</h3>
          <p className="text-gray-500 font-medium leading-relaxed">
            Upload your resume to get an AI-powered score and see how you rank against global benchmarks.
          </p>
        </div>

        {(!profile?.resumes || profile.resumes.length === 0) && (
          <div className="w-full p-6 sm:p-8 bg-rh-red/5 rounded-3xl border border-rh-red/10 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left transition-all hover:bg-rh-red/[0.07] mb-8">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rh-red shadow-sm shrink-0 border border-rh-red/10">
              <FileText className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-base font-bold text-rh-teal">Upload Your Resume / CV</h4>
              <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-xl">
                You have not uploaded a resume yet. A default resume is required to apply for roles, unlock your dynamic profile score, and get analyzed by our premium AI Resume Intelligence engine.
              </p>
            </div>
          </div>
        )}

        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed ${mainResumeError ? 'border-red-400 bg-red-50/30' : 'border-gray-100 bg-[#F9FBFF]'} rounded-[40px] p-8 sm:p-16 text-center cursor-pointer hover:border-rh-teal/30 hover:bg-white transition-all group mb-12`}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf"
            onChange={handleResumeUpload}
          />
          {resumeExtracting ? (
            <div className="space-y-8">
              <div className="w-24 h-24 border-[6px] border-rh-teal border-t-transparent rounded-full animate-spin mx-auto shadow-sm" />
              <div className="space-y-2">
                <p className="text-rh-teal font-bold text-lg uppercase tracking-[0.2em] animate-pulse">
                  Analyzing Semantic Content...
                </p>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                  Identifying Keywords & Experience
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white shadow-xl rounded-[32px] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all text-rh-teal border border-gray-50 relative">
                <Upload className="w-8 h-8 sm:w-10 sm:h-10" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-rh-red text-white rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-rh-red/20">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-[#081B2D] mb-3">Drop your updated CV</h4>
              <p className={`text-xs sm:text-sm font-medium ${mainResumeError ? 'text-red-500 mb-6' : 'text-gray-400 mb-10'}`}>
                {mainResumeError ? mainResumeError : 'Max Size: 5MB | Format: PDF'}
              </p>
              <Button variant="primary" className="w-full sm:w-auto px-8 sm:px-16 py-4 sm:py-5 bg-rh-teal text-white rounded-2xl font-bold shadow-2xl shadow-rh-teal/10 justify-center">
                Browse Files
              </Button>
            </>
          )}
        </div>

        {profile?.resumes && profile.resumes.length > 0 && (
          <div className="mb-12 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm sm:text-md md:text-lg font-bold text-rh-teal flex items-center gap-2">
                <FileText className="w-5 h-5 text-rh-red" /> Uploaded Resumes ({profile.resumes.length}/5)
              </h4>
              <span className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-widest">
                Manage CVs
              </span>
            </div>
            <div className="space-y-4">
              {profile.resumes.map((resume: any) => (
                <div
                  key={resume.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-3xl border transition-all ${
                    resume.isDefault
                      ? 'bg-rh-light/40 border-rh-teal/20 shadow-md'
                      : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        resume.isDefault
                          ? 'bg-rh-teal text-white shadow-lg shadow-rh-teal/20'
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h5 className="font-bold text-[#081B2D] text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">
                          {resume.fileName}
                        </h5>
                        {resume.isDefault && (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-bold uppercase tracking-widest border border-emerald-100 shrink-0 flex items-center gap-1 whitespace-nowrap">
                            <CheckCircle className="w-3 h-3 shrink-0" /> Default CV
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 font-medium truncate">
                        Uploaded on {formatDateBeautifully(resume.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-50 mt-4 sm:mt-0 w-full sm:w-auto flex-1 sm:flex-none">
                    {resume.atsScore && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rh-red/5 border border-rh-red/10 rounded-xl shrink-0 w-fit">
                        <Zap className="w-3.5 h-3.5 text-rh-red shrink-0" />
                        <span className="text-xs font-bold text-rh-red">ATS {resume.atsScore}%</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 justify-end sm:shrink-0 w-full sm:w-auto">
                      {!resume.isDefault && (
                        <Button
                          type="button"
                          onClick={() => handleSetDefaultResume(resume.id)}
                          variant="outline"
                          className="flex-1 sm:flex-none px-4 py-2 border border-gray-200 hover:border-rh-teal hover:bg-rh-teal hover:text-white rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap justify-center"
                        >
                          Set Default
                        </Button>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedDoc({ url: resume.fileUrl, title: resume.fileName })}
                        className="p-2 text-gray-400 hover:text-rh-teal bg-gray-50 hover:bg-rh-light rounded-xl transition-all shrink-0"
                        title="View PDF"
                      >
                        <Target className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteResume(resume.id)}
                        className="p-2 text-gray-400 hover:text-rh-red bg-gray-50 hover:bg-red-50 rounded-xl transition-all shrink-0"
                        title="Delete Resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {resumeScore !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rh-teal rounded-[40px] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center gap-8 sm:gap-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />

            <div className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 shrink-0 mx-auto md:mx-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="88" fill="none" stroke="white" strokeWidth="12" className="opacity-10" />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="88"
                  fill="none"
                  stroke="#D71920"
                  strokeWidth="12"
                  strokeDasharray={552.92}
                  initial={{ strokeDashoffset: 552.92 }}
                  animate={{ strokeDashoffset: 552.92 * (1 - resumeScore / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-5xl lg:text-6xl font-bold">{resumeScore}</span>
                <span className="text-[10px] sm:text-xs font-bold text-white/60 uppercase tracking-widest mt-1">
                  AI Score
                </span>
              </div>
            </div>

            <div className="space-y-6 flex-1 text-center md:text-left">
              <h4 className="text-xl sm:text-3xl font-bold leading-tight">
                Excellent! Your resume is in the <span className="text-rh-red italic">Top 10%.</span>
              </h4>
              <p className="text-white/70 font-medium text-base sm:text-lg leading-relaxed">
                Your professional summary and technical stack are highly relevant to current global market demands.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-5 py-2.5 bg-white/10 rounded-xl text-xs font-bold border border-white/10 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Key Keywords Found
                </span>
                <span className="px-5 py-2.5 bg-white/10 rounded-xl text-xs font-bold border border-white/10 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Structure Optimized
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </motion.div>
  );
};
