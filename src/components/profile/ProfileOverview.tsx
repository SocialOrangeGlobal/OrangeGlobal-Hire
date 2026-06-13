import React from 'react';
import { motion } from 'framer-motion';
import {
  User, GraduationCap, Briefcase, Star,
  AlertCircle, FileText, Target, ShieldCheck, Plane, FileCheck, Languages, Linkedin
} from 'lucide-react';

interface ProfileOverviewProps {
  profile: any;
  isTalent: boolean;
  setActiveTab: (tab: 'overview' | 'edit' | 'resume') => void;
  setOpenSection: (section: string) => void;
  setSelectedDoc: (doc: { url: string; title: string } | null) => void;
  formatDateBeautifully: (dateStr: any) => string;
}

export const ProfileOverview: React.FC<ProfileOverviewProps> = ({
  profile,
  isTalent,
  setActiveTab,
  setOpenSection,
  setSelectedDoc,
  formatDateBeautifully,
}) => {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {isTalent ? (
        <>
          {/* Profile Action Center */}
          {((!profile?.skills || profile.skills.length < 4) || (!profile?.resumes || profile.resumes.length === 0)) && (
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-md border-2 border-rh-red/20 space-y-4">
              <h3 className="text-md sm:text-lg font-bold text-rh-teal flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rh-red" /> Complete Your Profile
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                Your profile is currently incomplete. To unlock full recruitment matching and allow global employers to find you, please complete the following steps:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {(!profile?.skills || profile.skills.length < 4) && (
                  <div className="p-5 bg-rh-red/5 border border-rh-red/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rh-red border border-rh-red/10 shrink-0">
                        <Star className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="text-center sm:text-left">
                        <h4 className="text-xs font-bold text-rh-teal">
                          {!profile?.skills || profile.skills.length === 0 ? 'Add Skills' : 'Add More Skills'}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {!profile?.skills || profile.skills.length === 0
                            ? 'Domain expertise is missing'
                            : `Excellent start (${profile?.skills?.length} added)! Add more to reach 100%`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('edit');
                        setOpenSection('skills');
                        setTimeout(() => {
                          const el = document.getElementById('skills-accordion-trigger');
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }, 150);
                      }}
                      className="px-4 py-2 bg-rh-teal text-white rounded-lg text-[10px] font-bold shadow hover:bg-[#0E8A8F] transition-all whitespace-nowrap"
                    >
                      {!profile?.skills || profile.skills.length === 0 ? 'Add Now' : 'Optimize Now'}
                    </button>
                  </div>
                )}

                {(!profile?.resumes || profile.resumes.length === 0) && (
                  <div className="p-5 bg-rh-red/5 border border-rh-red/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rh-red border border-rh-red/10 shrink-0">
                        <FileText className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="text-center sm:text-left">
                        <h4 className="text-xs font-bold text-rh-teal">Upload Resume</h4>
                        <p className="text-[10px] text-gray-400 font-medium">CV is required for applications</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('resume');
                      }}
                      className="px-4 py-2 bg-rh-teal text-white rounded-lg text-[10px] font-bold shadow hover:bg-[#0E8A8F] transition-all whitespace-nowrap"
                    >
                      Upload Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Personal & Contact Details */}
          <section className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-rh-teal flex items-center gap-2 sm:gap-3">
                <User className="w-6 h-6 text-rh-red" /> Personal & Contact Details
              </h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date of Birth</p>
                <p className="text-base font-bold text-rh-teal">{formatDateBeautifully(profile?.dob)}</p>
              </div>
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Age</p>
                <p className="text-base font-bold text-rh-teal">{profile?.age || 'Not specified'}</p>
              </div>
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gender</p>
                <p className="text-base font-bold text-rh-teal">{profile?.gender || 'Not specified'}</p>
              </div>
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nationality</p>
                <p className="text-base font-bold text-rh-teal">{profile?.nationality || 'Not specified'}</p>
              </div>
              <div className="p-4 sm:p-6 bg-[#F9FBFF] rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Country of Residence</p>
                <p className="text-base font-bold text-rh-teal">{profile?.countryOfResidence || 'Not specified'}</p>
              </div>
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                <p className="text-base font-bold text-rh-teal">{profile?.phone || 'Not specified'}</p>
              </div>
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">WhatsApp</p>
                <p className="text-base font-bold text-rh-teal">{profile?.whatsapp || 'Not specified'}</p>
              </div>
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50 md:col-span-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">LinkedIn Profile</p>
                {profile?.linkedin ? (
                  <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-rh-teal hover:underline break-all flex items-center gap-1.5">
                    <Linkedin className="w-4 h-4 shrink-0" />
                    {profile.linkedin}
                  </a>
                ) : (
                  <p className="text-base font-bold text-rh-teal">Not specified</p>
                )}
              </div>
            </div>
          </section>

          {/* Job Preferences */}
          <section className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-rh-teal flex items-center gap-2 sm:gap-3">
                <Target className="w-6 h-6 text-rh-red" /> Employment Preferences
              </h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Opportunity Type</p>
                <p className="text-base font-bold text-rh-teal">{profile?.opportunityType || 'Not specified'}</p>
              </div>
              <div className="p-4 sm:p-6 bg-[#F9FBFF] rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Preferred Industry</p>
                <p className="text-base font-bold text-rh-teal">{profile?.preferredIndustry || 'Not specified'}</p>
              </div>
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Preferred Role</p>
                <p className="text-base font-bold text-rh-teal">{profile?.preferredRole || 'Not specified'}</p>
              </div>
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Preferred Salary</p>
                <p className="text-base font-bold text-rh-teal">{profile?.preferredSalary || 'Not specified'}</p>
              </div>
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Start Date / Notice Period</p>
                <p className="text-base font-bold text-rh-teal">{formatDateBeautifully(profile?.startDate)}</p>
              </div>
            </div>
          </section>

          {/* Current Employment Details */}
          <section className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-rh-teal flex items-center gap-2 sm:gap-3">
                <Briefcase className="w-6 h-6 text-rh-red" /> Current Employment & History
              </h3>
            </div>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Currently Employed?</p>
                  <p className="text-base font-bold text-rh-teal">{profile?.isEmployed || 'Not specified'}</p>
                </div>
                {profile?.isEmployed === 'Yes' && (
                  <>
                    <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Job Title</p>
                      <p className="text-base font-bold text-rh-teal">{profile?.jobTitle || 'Not specified'}</p>
                    </div>
                    <div className="p-4 sm:p-6 bg-[#F9FBFF] rounded-3xl border border-gray-50">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Employer Name</p>
                      <p className="text-base font-bold text-rh-teal">{profile?.employerName || 'Not specified'}</p>
                    </div>
                    <div className="p-4 sm:p-6 bg-[#F9FBFF] rounded-3xl border border-gray-50">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Country of Employment</p>
                      <p className="text-base font-bold text-rh-teal">{profile?.employmentCountry || 'Not specified'}</p>
                    </div>
                  </>
                )}
                <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Experience</p>
                  <p className="text-base font-bold text-rh-teal">{profile?.totalExp || 'Not specified'}</p>
                </div>
                <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Relevant Experience</p>
                  <p className="text-base font-bold text-rh-teal">{profile?.relevantExp || 'Not specified'}</p>
                </div>
                <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Worked Overseas?</p>
                  <p className="text-base font-bold text-rh-teal">{profile?.workedOverseas || 'Not specified'}</p>
                </div>
                {profile?.workedOverseas === 'Yes' && (
                  <div className="p-4 sm:p-6 bg-[#F9FBFF] rounded-3xl border border-gray-50 md:col-span-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Overseas Countries</p>
                    <p className="text-base font-bold text-rh-teal">{profile?.overseasCountries || 'Not specified'}</p>
                  </div>
                )}
              </div>

              {profile?.summary && (
                <div className="p-8 bg-[#F9FBFF] rounded-[32px] border border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Professional Summary</p>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed">{profile.summary}</p>
                </div>
              )}

              {profile?.experiences && profile.experiences.length > 0 && (
                <div className="pt-6 border-t border-gray-50 space-y-6">
                  <h4 className="text-sm font-bold text-rh-teal uppercase tracking-widest ml-1">Work History Timeline</h4>
                  {profile.experiences.map((exp: any, idx: number) => (
                    <div key={idx} className="relative pl-10 border-l-2 border-rh-light ml-4">
                      <div className="absolute top-0 left-0 -translate-x-[50%] w-8 h-8 bg-white border-2 border-rh-red rounded-full flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-rh-red rounded-full" />
                      </div>
                      <div className="bg-rh-light/30 p-8 rounded-[32px] border border-gray-50">
                        <h4 className="font-bold text-rh-teal text-xl mb-1">{exp.title}</h4>
                        <p className="text-rh-red font-bold text-sm mb-4">{exp.company}</p>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium">{exp.responsibilities}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Expertise & Skills */}
          <section className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-rh-teal flex items-center gap-2 sm:gap-3">
                <Star className="w-6 h-6 text-rh-red" /> Expertise & Skills
              </h3>
            </div>
            <div className="flex flex-col gap-6 w-full">
              {profile?.skills && profile.skills.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-3">
                    {profile.skills.map((skill: string) => (
                      <span key={skill} className="px-6 py-3 bg-rh-light text-rh-teal rounded-2xl text-xs font-bold border border-rh-teal/5">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {profile.skills.length < 4 && (
                    <div className="w-full p-6 sm:p-8 bg-rh-red/5 rounded-3xl border border-rh-red/10 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left transition-all hover:bg-rh-red/[0.07] animate-fadeIn">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rh-red shadow-sm shrink-0 border border-rh-red/10">
                        <Star className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="text-base font-bold text-rh-teal">Add More Skills & Expertise</h4>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-xl">
                          Great start! You have added {profile.skills.length} skills. Please add at least 4 skills to optimize your profile to 100% completion and allow recruiters to discover your expertise!
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('edit');
                          setOpenSection('skills');
                          setTimeout(() => {
                            const el = document.getElementById('skills-accordion-trigger');
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }, 150);
                        }}
                        className="px-5 py-2.5 bg-rh-teal text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#0E8A8F] transition-all whitespace-nowrap"
                      >
                        Add More Now
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full p-6 sm:p-8 bg-rh-red/5 rounded-3xl border border-rh-red/10 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left transition-all hover:bg-rh-red/[0.07]">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rh-red shadow-sm shrink-0 border border-rh-red/10">
                    <Star className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-base font-bold text-rh-teal">Add Your Expertise & Skills</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-xl">
                      Highlight your core technical capabilities and domain expertise. Adding at least one skill increases profile visibility by 40% and is required to unlock your full Profile Completion Score.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('edit');
                      setTimeout(() => {
                        document.getElementById('skills-accordion-trigger')?.scrollIntoView({ behavior: 'smooth' });
                      }, 150);
                    }}
                    className="px-5 py-2.5 bg-rh-teal text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#0E8A8F] transition-all whitespace-nowrap"
                  >
                    Add Skills Now
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Education & Qualifications */}
          <section className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-rh-teal flex items-center gap-2 sm:gap-3">
                <GraduationCap className="w-6 h-6 text-rh-red" /> Education & Qualifications
              </h3>
            </div>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Highest Qualification</p>
                  <p className="text-base font-bold text-rh-teal">{profile?.highestQualification || 'Not specified'}</p>
                </div>
                <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Field of Study</p>
                  <p className="text-base font-bold text-rh-teal">{profile?.fieldOfStudy || 'Not specified'}</p>
                </div>
                <div className="p-4 sm:p-6 bg-[#F9FBFF] rounded-3xl border border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Institution</p>
                  <p className="text-base font-bold text-rh-teal">{profile?.institutionName || 'Not specified'}</p>
                </div>
                <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Graduation Year</p>
                  <p className="text-base font-bold text-rh-teal">{profile?.graduationYear || 'Not specified'}</p>
                </div>
                <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Hold Licences?</p>
                  <p className="text-base font-bold text-rh-teal">{profile?.hasLicences || 'Not specified'}</p>
                </div>
                {profile?.hasLicences === 'Yes' && (
                  <div className="p-4 sm:p-6 bg-[#F9FBFF] rounded-3xl border border-gray-50 md:col-span-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Licences & Registrations</p>
                    <p className="text-base font-bold text-rh-teal">{profile?.licencesList || 'Not specified'}</p>
                  </div>
                )}
              </div>

              {profile?.educations && profile.educations.length > 0 && (
                <div className="pt-6 border-t border-gray-50 space-y-6">
                  <h4 className="text-sm font-bold text-rh-teal uppercase tracking-widest ml-1">Academic Timeline</h4>
                  <div className="space-y-4">
                    {profile.educations.map((edu: any, idx: number) => (
                      <div key={idx} className="flex gap-6 p-4 sm:p-6 bg-rh-light/30 rounded-[32px] border border-gray-50">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-rh-teal shadow-sm border border-gray-50">
                          <GraduationCap className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="font-bold text-rh-teal text-lg">{edu.school}</h4>
                          <p className="text-gray-500 font-semibold">{edu.degree} • <span className="text-rh-red">{edu.year}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Language Proficiency */}
          <section className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-rh-teal flex items-center gap-2 sm:gap-3">
                <Languages className="w-6 h-6 text-rh-red" /> Language Proficiency
              </h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">English Test Status</p>
                <p className="text-base font-bold text-rh-teal">{profile?.englishTest || 'Not specified'}</p>
              </div>
              {profile?.englishTest && profile.englishTest !== 'None' && (
                <>
                  <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Overall Score / Band</p>
                    <p className="text-base font-bold text-rh-teal">{profile?.overallScore || 'Not specified'}</p>
                  </div>
                  <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Test Date / Validity</p>
                    <p className="text-base font-bold text-rh-teal">{formatDateBeautifully(profile?.testDate)}</p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Visa & Work Rights */}
          <section className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-rh-teal flex items-center gap-2 sm:gap-3">
                <ShieldCheck className="w-6 h-6 text-rh-red" /> Visa & Work Rights
              </h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Visa Status</p>
                <p className="text-base font-bold text-rh-teal">{profile?.visaStatus || 'Not specified'}</p>
              </div>
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Work Rights in Target Country</p>
                <p className="text-base font-bold text-rh-teal">{profile?.legalWorkRights || 'Not specified'}</p>
              </div>
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Australian Visa History?</p>
                <p className="text-base font-bold text-rh-teal">{profile?.appliedAusVisa || 'Not specified'}</p>
              </div>
              {profile?.appliedAusVisa === 'Yes' && (
                <div className="p-4 sm:p-6 bg-[#F9FBFF] rounded-3xl border border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Australian Visa Subclass</p>
                  <p className="text-base font-bold text-rh-teal">{profile?.visaTypeApplied || 'Not specified'}</p>
                </div>
              )}
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Had Visa Refusals?</p>
                <p className="text-base font-bold text-rh-teal">{profile?.visaRefusal || 'Not specified'}</p>
              </div>
              {profile?.visaRefusal === 'Yes' && (
                <div className="p-4 sm:p-6 bg-[#F9FBFF] rounded-3xl border border-gray-50 md:col-span-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Visa Refusal Details</p>
                  <p className="text-sm font-bold text-rh-teal leading-relaxed">{profile?.visaRefusalDetails || 'Not specified'}</p>
                </div>
              )}
            </div>
          </section>

          {/* Relocation & Background */}
          <section className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-rh-teal flex items-center gap-2 sm:gap-3">
                <Plane className="w-6 h-6 text-rh-red" /> Relocation & Background
              </h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Open to Relocation?</p>
                <p className="text-base font-bold text-rh-teal">{profile?.openToRelocation || 'Not specified'}</p>
              </div>
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Relocate Alone / Family</p>
                <p className="text-base font-bold text-rh-teal">{profile?.relocateAloneOrFamily || 'Not specified'}</p>
              </div>
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Valid Passport?</p>
                <p className="text-base font-bold text-rh-teal">{profile?.validPassport || 'Not specified'}</p>
              </div>
              {profile?.validPassport === 'Yes' && (
                <div className="p-4 sm:p-6 bg-[#F9FBFF] rounded-3xl border border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Passport Expiry Date</p>
                  <p className="text-base font-bold text-rh-teal">{formatDateBeautifully(profile?.passportExpiry)}</p>
                </div>
              )}
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Consent to Medical Check?</p>
                <p className="text-base font-bold text-rh-teal">{profile?.medicalBackgroundCheck || 'Not specified'}</p>
              </div>
              <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Criminal Convictions?</p>
                <p className="text-base font-bold text-rh-teal">{profile?.criminalConvictions || 'Not specified'}</p>
              </div>
              {profile?.criminalConvictions === 'Yes' && (
                <div className="p-4 sm:p-6 bg-[#F9FBFF] rounded-3xl border border-gray-50 md:col-span-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Criminal Record Details</p>
                  <p className="text-sm font-bold text-rh-teal leading-relaxed">{profile?.criminalDetails || 'Not specified'}</p>
                </div>
              )}
            </div>
          </section>

          {/* Supporting Documents */}
          <section className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-rh-teal flex items-center gap-2 sm:gap-3">
                <FileCheck className="w-6 h-6 text-rh-red" /> Supporting Documents
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {profile?.passportUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedDoc({ url: profile.passportUrl, title: 'Passport Copy' })}
                  className="w-full text-left flex items-center justify-between p-4 sm:p-6 bg-rh-light/30 hover:bg-rh-light/60 transition-all rounded-3xl border border-gray-50 group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-rh-teal" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Bio-Data Page</p>
                      <p className="text-sm font-bold text-rh-teal group-hover:text-rh-red transition-colors">Passport Copy</p>
                    </div>
                  </div>
                  <Target className="w-5 h-5 text-gray-300 group-hover:text-rh-red transition-colors" />
                </button>
              )}
              {profile?.visaUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedDoc({ url: profile.visaUrl, title: 'Current Visa Document' })}
                  className="w-full text-left flex items-center justify-between p-4 sm:p-6 bg-rh-light/30 hover:bg-rh-light/60 transition-all rounded-3xl border border-gray-50 group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-rh-teal" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Permit / Residency</p>
                      <p className="text-sm font-bold text-rh-teal group-hover:text-rh-red transition-colors">Current Visa Document</p>
                    </div>
                  </div>
                  <Target className="w-5 h-5 text-gray-300 group-hover:text-rh-red transition-colors" />
                </button>
              )}
              {profile?.eduCertUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedDoc({ url: profile.eduCertUrl, title: 'Educational Certificates' })}
                  className="w-full text-left flex items-center justify-between p-4 sm:p-6 bg-rh-light/30 hover:bg-rh-light/60 transition-all rounded-3xl border border-gray-50 group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-rh-teal" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Degree / Certificate</p>
                      <p className="text-sm font-bold text-rh-teal group-hover:text-rh-red transition-colors">Educational Certificates</p>
                    </div>
                  </div>
                  <Target className="w-5 h-5 text-gray-300 group-hover:text-rh-red transition-colors" />
                </button>
              )}
              {profile?.empCertUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedDoc({ url: profile.empCertUrl, title: 'Employment Certificates' })}
                  className="w-full text-left flex items-center justify-between p-4 sm:p-6 bg-rh-light/30 hover:bg-rh-light/60 transition-all rounded-3xl border border-gray-50 group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-rh-teal" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Experience Letter / Reference</p>
                      <p className="text-sm font-bold text-rh-teal group-hover:text-rh-red transition-colors">Employment Certificates</p>
                    </div>
                  </div>
                  <Target className="w-5 h-5 text-gray-300 group-hover:text-rh-red transition-colors" />
                </button>
              )}
              {profile?.englishTestUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedDoc({ url: profile.englishTestUrl, title: 'English Language Results' })}
                  className="w-full text-left flex items-center justify-between p-4 sm:p-6 bg-rh-light/30 hover:bg-rh-light/60 transition-all rounded-3xl border border-gray-50 group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-rh-teal" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">IELTS / PTE / OET Results</p>
                      <p className="text-sm font-bold text-rh-teal group-hover:text-rh-red transition-colors">English Language Results</p>
                    </div>
                  </div>
                  <Target className="w-5 h-5 text-gray-300 group-hover:text-rh-red transition-colors" />
                </button>
              )}
              {profile?.licenceUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedDoc({ url: profile.licenceUrl, title: 'Licences & Certifications' })}
                  className="w-full text-left flex items-center justify-between p-4 sm:p-6 bg-rh-light/30 hover:bg-rh-light/60 transition-all rounded-3xl border border-gray-50 group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-rh-teal" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Professional Registration</p>
                      <p className="text-sm font-bold text-rh-teal group-hover:text-rh-red transition-colors">Licences & Certifications</p>
                    </div>
                  </div>
                  <Target className="w-5 h-5 text-gray-300 group-hover:text-rh-red transition-colors" />
                </button>
              )}
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Employer Overview */}
          <div className="space-y-8">
            {/* Contact Representative Details Card */}
            <section className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100 animate-fadeIn">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-rh-teal flex items-center gap-2 sm:gap-3">
                  <User className="w-6 h-6 text-rh-red" />Personal Details
                </h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                  <p className="text-base font-bold text-rh-teal">{profile?.firstName} {profile?.lastName}</p>
                </div>
                <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Representative Title</p>
                  <p className="text-base font-bold text-rh-teal">{profile?.jobTitle || 'Not specified'}</p>
                </div>
                <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                  <p className="text-base font-bold text-rh-teal">{profile?.businessPhone || 'Not specified'}</p>
                </div>
              </div>
            </section>

            {/* Corporate Profile Card */}
            <section className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100 animate-fadeIn">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-rh-teal flex items-center gap-2 sm:gap-3">
                  <Briefcase className="w-6 h-6 text-rh-red" />Corporate Profile
                </h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Company Registered Name</p>
                  <p className="text-base font-bold text-rh-teal">{profile?.companyName || 'Not specified'}</p>
                </div>
                <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Staff Count Segment</p>
                  <p className="text-base font-bold text-rh-teal">{profile?.positionType || 'Not specified'}</p>
                </div>
                <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Hiring For Roles</p>
                  <p className="text-base font-bold text-rh-teal">{profile?.jobTitleToHire || 'Not specified'}</p>
                </div>
                <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Zip Code / Location</p>
                  <p className="text-base font-bold text-rh-teal">{profile?.zipCode || 'Not specified'}</p>
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </motion.div>
  );
};
