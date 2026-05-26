import { motion } from 'framer-motion';
import { Briefcase, Award, Plus, ChevronRight, X, Settings, Code, Shield, MapPinIcon, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    about: string;
    completion: number;
    skills: string[];
    experience: any[];
    education: any[];
    avatarUrl: string;
}

function ProfileManagementModal({ setShowProfile, profileData }: { setShowProfile: (show: boolean) => void, profileData: ProfileData }) {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowProfile(false)}
                className="absolute inset-0 bg-rh-dark/60 backdrop-blur-md"
            />
            <motion.div
                initial={{
                    opacity: 0,
                    y: "100%"
                }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                    opacity: 0,
                    y: "100%"
                }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="relative bg-white w-full max-w-4xl lg:max-w-5xl md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col h-full md:h-auto md:max-h-[90vh] mx-auto mt-auto md:m-auto"
            >
                {/* Profile Header */}
                <div className="px-6 md:px-12 py-6 md:py-10 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between shrink-0 bg-rh-light/20 relative overflow-hidden gap-4">
                    <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-rh-red/5 rounded-full -mr-24 md:-mr-32 -mt-24 md:-mt-32 blur-3xl" />
                    <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 relative z-10 w-full sm:w-auto text-center sm:text-left">
                        <div className="relative">
                            {profileData.avatarUrl ? (
                                <img src={profileData.avatarUrl} className="w-20 h-20 md:w-32 md:h-32 rounded-2xl md:rounded-[32px] object-cover shadow-2xl ring-4 ring-white" alt="" />
                            ) : (
                                <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl md:rounded-[32px] bg-rh-teal flex items-center justify-center text-white font-bold text-3xl md:text-6xl shadow-2xl ring-4 ring-white">
                                    {(profileData.name || 'T')[0].toUpperCase()}
                                </div>
                            )}
                            <button
                                onClick={() => { setShowProfile(false); navigate('/manage-profile'); }}
                                className="absolute -bottom-1 -right-1 p-2 md:p-3 bg-rh-red text-white rounded-lg md:rounded-2xl shadow-xl hover:scale-110 transition-transform"
                            >
                                <Settings className="w-3 h-3 md:w-5 md:h-5" />
                            </button>
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-4xl font-bold text-rh-teal truncate max-w-full sm:max-w-[300px] lg:max-w-none">{profileData.name || 'Talent User'}</h2>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] md:text-sm mt-1 md:mt-2">{profileData.title || 'Job Seeker'}</p>
                            <div className="flex items-center justify-center sm:justify-start gap-2 md:gap-4 mt-2 md:mt-4">
                                <div className="px-2 py-0.5 md:px-3 md:py-1 bg-emerald-50 text-emerald-600 rounded-md md:rounded-lg text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Active</div>
                                {profileData.location && (
                                    <div className="flex items-center gap-1 text-[8px] md:text-[10px] font-bold text-rh-teal uppercase tracking-widest"><MapPinIcon className="w-2 h-2 md:w-3 md:h-3" /> {profileData.location}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setShowProfile(false)} className="absolute sm:static top-4 right-4 sm:top-auto sm:right-auto w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-rh-red transition-all shadow-xl relative z-10"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                        {/* Left Column: Details */}
                        <div className="lg:col-span-8 space-y-8 md:space-y-12">
                            <section>
                                <div className="flex items-center justify-between mb-4 md:mb-6">
                                    <h3 className="text-lg md:text-xl font-bold text-rh-teal flex items-center gap-2 md:gap-3"><Award className="w-5 h-5 md:w-6 md:h-6 text-rh-red" /> Education</h3>
                                    <button onClick={() => { setShowProfile(false); navigate('/manage-profile'); }} className="p-2 bg-rh-red/5 text-rh-red rounded-lg hover:bg-rh-red hover:text-white transition-all"><Plus className="w-3 h-3 md:w-4 md:h-4" /></button>
                                </div>
                                <div className="space-y-3 md:space-y-4">
                                    {profileData.education?.length > 0 ? profileData.education.map((edu, idx) => (
                                        <div key={idx} className="p-5 md:p-8 bg-white border border-gray-100 rounded-[24px] md:rounded-[32px] hover:border-rh-teal/20 transition-all flex items-center justify-between group shadow-sm hover:shadow-xl hover:shadow-rh-teal/5">
                                            <div className="flex items-center gap-4 md:gap-6">
                                                <div className="w-10 h-10 md:w-14 md:h-14 bg-rh-light rounded-xl md:rounded-2xl flex items-center justify-center text-rh-teal group-hover:bg-rh-teal group-hover:text-white transition-all"><Award className="w-5 h-5 md:w-7 md:h-7" /></div>
                                                <div>
                                                    <h4 className="font-bold text-rh-teal text-sm md:text-lg">{edu.degree || edu.title || 'Untitled Degree'}</h4>
                                                    <p className="text-[8px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5 md:mt-1">{edu.institution || edu.school || 'Institution'} {edu.year ? `• ${edu.year}` : ''}</p>
                                                </div>
                                            </div>
                                            <button className="text-gray-300 hover:text-rh-teal transition-colors"><ChevronRight className="w-4 h-4 md:w-6 md:h-6" /></button>
                                        </div>
                                    )) : (
                                        <div className="text-center py-8 text-gray-400 text-sm bg-rh-light/20 rounded-[24px] border border-dashed border-gray-200">
                                            No education added yet.
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg md:text-xl font-bold text-rh-teal flex items-center gap-2 md:gap-3 mb-4 md:mb-6"><Code className="w-5 h-5 md:w-6 md:h-6 text-rh-red" /> Skills</h3>
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    {profileData.skills.length > 0 ? profileData.skills.map(skill => (
                                        <span key={skill} className="px-4 py-2 md:px-6 md:py-3 bg-rh-teal/5 text-rh-teal rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold border border-rh-teal/10 hover:bg-rh-red hover:text-white transition-all cursor-default">
                                            {skill}
                                        </span>
                                    )) : (
                                        <span className="text-sm text-gray-400">No skills added yet.</span>
                                    )}
                                    <button onClick={() => { setShowProfile(false); navigate('/manage-profile'); }} className="px-4 py-2 md:px-6 md:py-3 border-2 border-dashed border-gray-200 text-gray-400 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold hover:border-rh-red hover:text-rh-red transition-all">+ Add</button>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center justify-between mb-4 md:mb-6">
                                    <h3 className="text-lg md:text-xl font-bold text-rh-teal flex items-center gap-2 md:gap-3"><Award className="w-5 h-5 md:w-6 md:h-6 text-rh-red" /> Experience</h3>
                                    <button onClick={() => { setShowProfile(false); navigate('/manage-profile'); }} className="p-2 bg-rh-red/5 text-rh-red rounded-lg hover:bg-rh-red hover:text-white transition-all"><Plus className="w-3 h-3 md:w-4 md:h-4" /></button>
                                </div>
                                <div className="space-y-3 md:space-y-4">
                                    {profileData.experience.length > 0 ? profileData.experience.map((exp, idx) => (
                                        <div key={idx} className="p-5 md:p-8 bg-white border border-gray-100 rounded-[24px] md:rounded-[32px] hover:border-rh-red/20 transition-all flex items-center justify-between group shadow-sm hover:shadow-xl hover:shadow-rh-teal/5">
                                            <div className="flex items-center gap-4 md:gap-6">
                                                <div className="w-10 h-10 md:w-14 md:h-14 bg-rh-light rounded-xl md:rounded-2xl flex items-center justify-center text-rh-teal group-hover:bg-rh-red group-hover:text-white transition-all"><Briefcase className="w-5 h-5 md:w-7 md:h-7" /></div>
                                                <div>
                                                    <h4 className="font-bold text-rh-teal text-sm md:text-lg">{exp.title || exp.role || 'Untitled Role'}</h4>
                                                    <p className="text-[8px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5 md:mt-1">{exp.company || 'Company'} {exp.period ? `• ${exp.period}` : ''}</p>
                                                </div>
                                            </div>
                                            <button className="text-gray-300 hover:text-rh-red transition-colors"><ChevronRight className="w-4 h-4 md:w-6 md:h-6" /></button>
                                        </div>
                                    )) : (
                                        <div className="text-center py-8 text-gray-400 text-sm bg-rh-light/20 rounded-[24px] border border-dashed border-gray-200">
                                            No experience added yet.
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Score & Contact */}
                        <div className="lg:col-span-4 space-y-6 md:space-y-8">
                            {/* Completion Card */}
                            <div className="p-8 md:p-10 bg-rh-teal rounded-[32px] md:rounded-[40px] text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform"><Shield className="w-16 md:w-24 h-16 md:h-24" /></div>
                                <h4 className="text-lg md:text-xl font-bold mb-6 md:mb-8">Score</h4>
                                <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 md:mb-8">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/10 md:hidden" />
                                        <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="10" className="text-white/10 hidden md:block" />

                                        <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-rh-red md:hidden"
                                            strokeDasharray={351.8} strokeDashoffset={351.8 * (1 - profileData.completion / 100)} strokeLinecap="round" />
                                        <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="10" className="text-rh-red hidden md:block"
                                            strokeDasharray={439.8} strokeDashoffset={439.8 * (1 - profileData.completion / 100)} strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl md:text-5xl font-bold">{profileData.completion}%</span>
                                        <span className="text-[8px] md:text-[10px] font-bold text-white/60 uppercase tracking-widest mt-0.5 md:mt-1">Complete</span>
                                    </div>
                                </div>
                                <p className="text-[8px] md:text-[10px] font-bold leading-relaxed text-center text-white/80">
                                    {profileData.completion >= 100 ? 'Profile is fully complete!' : 'Complete your profile to reach 100%!'}
                                </p>
                            </div>

                            {/* Contact Card */}
                            <div className="p-6 md:p-8 bg-rh-light/40 rounded-[32px] md:rounded-[40px] border border-rh-teal/5 space-y-4 md:space-y-6">
                                <h4 className="text-[10px] md:text-sm font-bold text-rh-teal uppercase tracking-widest mb-2 md:mb-4">Contact Info</h4>
                                <div className="space-y-3 md:space-y-4">
                                    <div className="flex items-center gap-3 md:gap-4 group">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg md:rounded-xl flex items-center justify-center text-rh-red shadow-sm group-hover:bg-rh-red group-hover:text-white transition-all"><Mail className="w-4 h-4 md:w-5 md:h-5" /></div>
                                        <p className="text-[10px] md:text-xs font-bold text-rh-teal break-all">{profileData.email || 'Not set'}</p>
                                    </div>
                                    <div className="flex items-center gap-3 md:gap-4 group">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg md:rounded-xl flex items-center justify-center text-rh-teal shadow-sm group-hover:bg-rh-red group-hover:text-white transition-all"><Phone className="w-4 h-4 md:w-5 md:h-5" /></div>
                                        <p className="text-[10px] md:text-xs font-bold text-rh-teal">{profileData.phone || 'Not set'}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => { setShowProfile(false); navigate('/manage-profile'); }}
                                className="w-full py-4 md:py-6 bg-rh-teal text-white rounded-2xl md:rounded-[32px] font-bold shadow-2xl shadow-rh-teal/20 hover:bg-rh-red transition-all flex items-center justify-center gap-2 md:gap-3 group text-xs md:text-base"
                            >
                                <Settings className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform" /> Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default ProfileManagementModal