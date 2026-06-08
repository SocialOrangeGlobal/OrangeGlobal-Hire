import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText, AlertCircle, Upload, User, Briefcase, Trash2, GraduationCap, Star, MessageSquare, CheckCircle2
} from 'lucide-react';
import Button from '../ui/Button';
import { fadeUp } from '../../utils/animations';

interface ApplyFormStepsProps {
  currentStep: number;
  applyMode: 'easy' | 'manual' | null;
  resumes: any[];
  selectedResumeId: string;
  setSelectedResumeId: (id: string) => void;
  profile: any;
  user: any;
  manualDetails: {
    fullName: string;
    email: string;
    phone: string;
    skills: string[];
    experienceSummary: string;
    experiences: any[];
    educations: any[];
    hobbies: string;
  };
  setManualDetails: React.Dispatch<React.SetStateAction<any>>;
  skillInput: string;
  setSkillInput: (val: string) => void;
  uploadingResume: boolean;
  resumeUploadError: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addSkill: () => void;
  removeSkill: (s: string) => void;
  addExperience: () => void;
  removeExperience: (idx: number) => void;
  addEducation: () => void;
  removeEducation: (idx: number) => void;
  coverLetter: string;
  setCoverLetter: (val: string) => void;
}

export const ApplyFormSteps: React.FC<ApplyFormStepsProps> = ({
  currentStep,
  applyMode,
  resumes,
  selectedResumeId,
  setSelectedResumeId,
  profile,
  user,
  manualDetails,
  setManualDetails,
  skillInput,
  setSkillInput,
  uploadingResume,
  resumeUploadError,
  fileInputRef,
  handleFileUpload,
  addSkill,
  removeSkill,
  addExperience,
  removeExperience,
  addEducation,
  removeEducation,
  coverLetter,
  setCoverLetter
}) => {
  return (
    <>
      {/* STEP 1: RESUME */}
      {currentStep === 1 && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
          <h3 className="text-2xl font-bold text-rh-teal flex items-center gap-3">
            <FileText className="text-rh-red w-6 h-6" /> Select or Upload Resume
          </h3>
          <p className="text-sm text-gray-500">Choose an existing resume or upload a new one to proceed.</p>

          {resumes.length === 0 ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-sm font-medium flex flex-col items-center justify-center text-center gap-4">
              <AlertCircle className="w-10 h-10" />
              <p>You don't have any uploaded resumes yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumes.map(r => (
                <div
                  key={r.id}
                  onClick={() => {
                    setSelectedResumeId(r.id);
                    if (applyMode === 'manual') {
                      setManualDetails((p: any) => ({
                        ...p,
                        fullName: r.parsedName || profile?.fullName || user?.fullName || '',
                        email: r.parsedEmail || profile?.workEmail || user?.email || '',
                        phone: r.parsedPhone || profile?.phone || '',
                        skills: r.parsedSkills?.length ? r.parsedSkills : (profile?.skills || []),
                        experienceSummary: r.parsedExperience?.toString() || profile?.totalExp || '',
                        experiences: profile?.experiences || [],
                        educations: profile?.educations || [],
                        hobbies: profile?.hobbies || ''
                      }));
                    }
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3
                                ${selectedResumeId === r.id ? 'border-rh-red bg-rh-red/5' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5
                                  ${selectedResumeId === r.id ? 'border-rh-red bg-rh-red' : 'border-gray-300'}`}>
                    {selectedResumeId === r.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${selectedResumeId === r.id ? 'text-rh-red' : 'text-rh-teal'}`}>{r.fileName}</p>
                    {r.isDefault && <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-1 block">Default</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              ref={fileInputRef as any}
              onChange={handleFileUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingResume}
              className="w-full p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-rh-red/50 hover:bg-rh-red/5 transition-all flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-rh-red disabled:opacity-50"
            >
              {uploadingResume ? (
                <div className="w-6 h-6 border-2 border-rh-red/30 border-t-rh-red rounded-full animate-spin" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
              <span className="text-sm font-bold">
                {uploadingResume ? 'Uploading...' : 'Upload New Resume (Max 5)'}
              </span>
              <span className="text-[10px] text-gray-400">Max Size: 5MB | Format: PDF, DOC, DOCX</span>
              {resumeUploadError && (
                <span className="text-xs text-red-500 font-semibold mt-1">{resumeUploadError}</span>
              )}
            </button>
            {resumes.length >= 5 && (
              <p className="text-xs text-red-500 mt-2 text-center">
                Maximum limit of 5 resumes reached. <a href="/talent/manage-profile" className="underline font-bold">Manage Profile</a> to delete old ones.
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* STEP 2: PERSONAL DETAILS */}
      {currentStep === 2 && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
          <h3 className="text-2xl font-bold text-rh-teal flex items-center gap-3">
            <User className="text-rh-red w-6 h-6" /> Personal Details
          </h3>
          <p className="text-sm text-gray-500">Review and verify your contact information and summary.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
              <input
                type="text"
                value={manualDetails.fullName}
                onChange={e => setManualDetails((p: any) => ({ ...p, fullName: e.target.value }))}
                className="w-full bg-[#F4F7FA] border-transparent focus:bg-white focus:border-rh-red/20 border-2 rounded-2xl py-3 px-5 outline-none transition-all text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Email</label>
              <input
                type="email"
                value={manualDetails.email}
                onChange={e => setManualDetails((p: any) => ({ ...p, email: e.target.value }))}
                className="w-full bg-[#F4F7FA] border-transparent focus:bg-white focus:border-rh-red/20 border-2 rounded-2xl py-3 px-5 outline-none transition-all text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Phone</label>
              <input
                type="text"
                value={manualDetails.phone}
                onChange={e => setManualDetails((p: any) => ({ ...p, phone: e.target.value }))}
                className="w-full bg-[#F4F7FA] border-transparent focus:bg-white focus:border-rh-red/20 border-2 rounded-2xl py-3 px-5 outline-none transition-all text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Total Experience (Years)</label>
              <input
                type="text"
                value={manualDetails.experienceSummary}
                onChange={e => setManualDetails((p: any) => ({ ...p, experienceSummary: e.target.value }))}
                className="w-full bg-[#F4F7FA] border-transparent focus:bg-white focus:border-rh-red/20 border-2 rounded-2xl py-3 px-5 outline-none transition-all text-sm font-medium"
              />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Hobbies & Other Details</label>
              <input
                type="text"
                value={manualDetails.hobbies}
                onChange={e => setManualDetails((p: any) => ({ ...p, hobbies: e.target.value }))}
                className="w-full bg-[#F4F7FA] border-transparent focus:bg-white focus:border-rh-red/20 border-2 rounded-2xl py-3 px-5 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 3: WORK EXPERIENCE */}
      {currentStep === 3 && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-rh-teal flex items-center gap-3">
              <Briefcase className="text-rh-red w-6 h-6" /> Work Experience
            </h3>
            <button type="button" onClick={addExperience} className="text-rh-red font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
              + Add Role
            </button>
          </div>
          <p className="text-sm text-gray-500">Provide details about your past employment history.</p>

          <div className="space-y-4">
            {manualDetails.experiences.map((exp, index) => (
              <div key={index} className="p-4 sm:p-6 bg-[#F9FBFF] rounded-2xl border border-gray-100 relative group">
                <button type="button" onClick={() => removeExperience(index)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-rh-red transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Title</label>
                    <input
                      value={exp.title || ''}
                      onChange={e => {
                        const newExps = [...manualDetails.experiences];
                        newExps[index].title = e.target.value;
                        setManualDetails((p: any) => ({ ...p, experiences: newExps }));
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company</label>
                    <input
                      value={exp.company || ''}
                      onChange={e => {
                        const newExps = [...manualDetails.experiences];
                        newExps[index].company = e.target.value;
                        setManualDetails((p: any) => ({ ...p, experiences: newExps }));
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Responsibilities</label>
                    <textarea
                      rows={3}
                      value={exp.responsibilities || ''}
                      onChange={e => {
                        const newExps = [...manualDetails.experiences];
                        newExps[index].responsibilities = e.target.value;
                        setManualDetails((p: any) => ({ ...p, experiences: newExps }));
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
            {manualDetails.experiences.length === 0 && (
              <div className="text-center p-8 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 text-sm font-medium">
                No work experience added yet.
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* STEP 4: EDUCATIONS */}
      {currentStep === 4 && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-rh-teal flex items-center gap-3">
              <GraduationCap className="text-rh-red w-6 h-6" /> Education
            </h3>
            <button type="button" onClick={addEducation} className="text-rh-red font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
              + Add Education
            </button>
          </div>
          <p className="text-sm text-gray-500">Provide details of your academic background.</p>

          <div className="space-y-4">
            {manualDetails.educations.map((edu, index) => (
              <div key={index} className="p-4 sm:p-6 bg-[#F9FBFF] rounded-2xl border border-gray-100 relative group">
                <button type="button" onClick={() => removeEducation(index)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-rh-red transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">School / University</label>
                    <input
                      value={edu.school || ''}
                      onChange={e => {
                        const newEdus = [...manualDetails.educations];
                        newEdus[index].school = e.target.value;
                        setManualDetails((p: any) => ({ ...p, educations: newEdus }));
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Degree</label>
                    <input
                      value={edu.degree || ''}
                      onChange={e => {
                        const newEdus = [...manualDetails.educations];
                        newEdus[index].degree = e.target.value;
                        setManualDetails((p: any) => ({ ...p, educations: newEdus }));
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Year</label>
                    <input
                      value={edu.year || ''}
                      onChange={e => {
                        const newEdus = [...manualDetails.educations];
                        newEdus[index].year = e.target.value;
                        setManualDetails((p: any) => ({ ...p, educations: newEdus }));
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            ))}
            {manualDetails.educations.length === 0 && (
              <div className="text-center p-8 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 text-sm font-medium">
                No education details added yet.
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* STEP 5: SKILLS */}
      {currentStep === 5 && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
          <h3 className="text-2xl font-bold text-rh-teal flex items-center gap-3">
            <Star className="text-rh-red w-6 h-6" /> Expertise & Skills
          </h3>
          <p className="text-sm text-gray-500">Add key skills to help the ATS match you with the job requirements.</p>

          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                placeholder="Type a skill and hit Enter or Add..."
                className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all font-medium"
              />
              <Button type="button" onClick={addSkill} variant="outline" className="px-8 border-2 border-gray-100 rounded-2xl font-bold">Add</Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 min-h-[60px] p-6 bg-white border border-gray-100 rounded-2xl">
              {manualDetails.skills.length > 0 ? manualDetails.skills.map((s) => (
                <span key={s} className="px-5 py-2.5 bg-rh-light text-rh-teal rounded-xl text-xs font-bold flex items-center gap-3 group">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)}>
                    <Trash2 className="w-4 h-4 text-gray-300 group-hover:text-rh-red transition-colors" />
                  </button>
                </span>
              )) : (
                <span className="text-gray-400 text-sm font-medium">No skills added.</span>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 6: COVER LETTER & MESSAGE */}
      {currentStep === 6 && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
          <h3 className="text-2xl font-bold text-rh-teal flex items-center gap-3">
            <MessageSquare className="text-rh-red w-6 h-6" /> Cover Letter
          </h3>
          <p className="text-sm text-gray-500">Provide an optional cover letter or personal note to the employer.</p>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Message to Employer</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full bg-[#F4F7FA] border-2 border-transparent focus:border-rh-red/20 focus:bg-white rounded-3xl py-6 px-8 outline-none transition-all text-sm font-medium h-48 resize-none"
              placeholder="Why are you the perfect fit for this role?"
            />
          </div>
        </motion.div>
      )}

      {/* STEP 7: REVIEW */}
      {currentStep === 7 && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
          <h3 className="text-2xl font-bold text-rh-teal flex items-center gap-3">
            <CheckCircle2 className="text-rh-red w-6 h-6" /> Final Review
          </h3>
          <p className="text-sm text-gray-500">Review your application details before submitting.</p>

          <div className="bg-[#F9FBFF] rounded-3xl p-6 md:p-8 border border-gray-100 space-y-8">
            <div>
              <h4 className="text-xs font-bold text-rh-red uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">Personal Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
                <div className="break-words"><span className="text-gray-400 block text-[10px] uppercase">Name</span>{manualDetails.fullName || '-'}</div>
                <div className="break-words"><span className="text-gray-400 block text-[10px] uppercase">Email</span>{manualDetails.email || '-'}</div>
                <div className="break-words"><span className="text-gray-400 block text-[10px] uppercase">Phone</span>{manualDetails.phone || '-'}</div>
                <div className="break-words"><span className="text-gray-400 block text-[10px] uppercase">Total Experience</span>{manualDetails.experienceSummary || '-'}</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-rh-red uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">Work Experience ({manualDetails.experiences.length})</h4>
              {manualDetails.experiences.length > 0 ? (
                <ul className="space-y-2 text-sm font-medium">
                  {manualDetails.experiences.map((exp, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-rh-red">•</span>
                      <div>
                        <span className="font-bold">{exp.title}</span> at <span className="text-gray-600">{exp.company}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <span className="text-sm text-gray-400">None added</span>}
            </div>

            <div>
              <h4 className="text-xs font-bold text-rh-red uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">Education ({manualDetails.educations.length})</h4>
              {manualDetails.educations.length > 0 ? (
                <ul className="space-y-2 text-sm font-medium">
                  {manualDetails.educations.map((edu, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-rh-red">•</span>
                      <div>
                        <span className="font-bold">{edu.degree}</span> from <span className="text-gray-600">{edu.school}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <span className="text-sm text-gray-400">None added</span>}
            </div>

            <div>
              <h4 className="text-xs font-bold text-rh-red uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">Skills ({manualDetails.skills.length})</h4>
              <div className="flex flex-wrap gap-2">
                {manualDetails.skills.length > 0 ? manualDetails.skills.map(s => (
                  <span key={s} className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-xs font-bold text-rh-teal">{s}</span>
                )) : <span className="text-sm text-gray-400">None added</span>}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};
