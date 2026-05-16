import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, GraduationCap, Briefcase, Star,
  Upload, CheckCircle, Shield, Trash2, Plus,
  Settings, LogOut, Camera, FileText, Target, Zap,
  Loader2, Save, Info, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { logout, updateProfileSuccess } from '../store/slices/authSlice';
import { authApi } from '../lib/auth';
import { uploadFile } from '../lib/storage';
import Button from '../components/ui/Button';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Dropdown from '../components/ui/Dropdown';
import { signUpPositionType } from '../data';

// --- Schemas ---
const talentUpdateSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  location: z.string().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
  resumeUrl: z.string().optional(),
  educations: z.array(z.object({
    school: z.string().min(1, 'School is required'),
    degree: z.string().min(1, 'Degree is required'),
    year: z.string().min(4, 'Valid year required'),
  })),
  skills: z.array(z.string()).min(1, 'Please add at least one skill'),
  experiences: z.array(z.object({
    title: z.string().min(1, 'Job title is required'),
    company: z.string().min(1, 'Company is required'),
    responsibilities: z.string().min(10, 'Please describe your role'),
  })),
});

const employerUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  businessPhone: z.string().optional(),
  companyLogo: z.string().optional(),
  companyName: z.string().min(2, 'Company name is required'),
  jobTitle: z.string().min(2, 'Your job title is required'),
  jobTitleToHire: z.string().min(2, 'Job title to hire is required'),
  zipCode: z.string().min(2, 'Zip code is required'),
  positionType: z.string().min(1, 'Please select a position type'),
});

type TalentUpdateData = z.infer<typeof talentUpdateSchema>;
type EmployerUpdateData = z.infer<typeof employerUpdateSchema>;

export default function ManageProfile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'resume'>('overview');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeExtracting, setResumeExtracting] = useState(false);
  const [resumeScore, setResumeScore] = useState<number | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isTalent = user?.role === 'TALENT';

  // --- Forms ---
  const talentForm = useForm<TalentUpdateData>({
    resolver: zodResolver(talentUpdateSchema),
    defaultValues: {
      educations: [],
      experiences: [],
      skills: []
    }
  });

  const employerForm = useForm<EmployerUpdateData>({
    resolver: zodResolver(employerUpdateSchema),
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control: talentForm.control,
    name: 'educations'
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control: talentForm.control,
    name: 'experiences'
  });

  const watchedSkills = talentForm.watch('skills');

  // --- Effects ---
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await authApi.getMe();
      console.log("Data: ", data);
      setProfile(data.profile);
      console.log("Profile: ", profile);

      if (data.role === 'TALENT') {
        const p = data.profile;
        const locationString = p.location && typeof p.location === 'object'
          ? `${p.location.city || ''}${p.location.city && p.location.country ? ', ' : ''}${p.location.country || ''}`
          : (p.location || '');

        talentForm.reset({
          fullName: p.fullName || '',
          location: locationString,
          phone: p.phone || '',
          avatarUrl: p.avatarUrl || '',
          resumeUrl: p.resumeUrl || '',
          educations: p.educations || [],
          skills: p.skills || [],
          experiences: p.experiences || [],
        });
        const defaultResume = p.resumes?.find((r: any) => r.isDefault) || p.resumes?.[0];
        if (defaultResume?.atsScore) {
          setResumeScore(defaultResume.atsScore);
        } else if (p.resumeUrl) {
          setResumeScore(85);
        }
      } else {
        const p = data.profile || {};
        employerForm.reset({
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          businessPhone: p.businessPhone || '',
          companyLogo: p.companyLogo || '',
          companyName: p.companyName || '',
          jobTitle: p.jobTitle || '',
          jobTitleToHire: p.jobTitleToHire || '',
          zipCode: p.zipCode || '',
          positionType: p.positionType || '',
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const onUpdateSubmit = async (data: any) => {
    setSaving(true);
    try {
      await authApi.updateProfile(data);

      // Update local Redux state for the header/navbar
      const nameUpdate = isTalent ? data.fullName : `${data.firstName} ${data.lastName}`;
      const avatarUpdate = isTalent ? data.avatarUrl : data.companyLogo;
      dispatch(updateProfileSuccess({ fullName: nameUpdate, avatarUrl: avatarUpdate }));

      await fetchProfile();
      setActiveTab('overview');
    } catch (err) {
      console.error('Update failed', err);
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if ((profile?.resumes?.length || 0) >= 5) {
        alert('Maximum 5 resumes allowed. Please delete an existing resume first.');
        return;
      }

      setResumeExtracting(true);
      try {
        const timestamp = Date.now();
        const fileName = `${user?.id}-${timestamp}-${file.name.replace(/\s+/g, '-')}`;
        const url = await uploadFile(file, 'resumes', fileName);

        const newResume = await authApi.addResume({
          fileName: file.name,
          fileUrl: url,
        });

        if (newResume?.atsScore) {
          setResumeScore(newResume.atsScore);
        }
        await fetchProfile();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to upload resume');
      } finally {
        setResumeExtracting(false);
      }
    }
  };

  const handleSetDefaultResume = async (resumeId: string) => {
    try {
      await authApi.setDefaultResume(resumeId);
      await fetchProfile();
    } catch (err) {
      alert('Failed to set default resume');
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await authApi.deleteResume(resumeId);
      await fetchProfile();
    } catch (err) {
      alert('Failed to delete resume');
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !watchedSkills.includes(skillInput.trim())) {
      talentForm.setValue('skills', [...watchedSkills, skillInput.trim()], { shouldValidate: true });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    talentForm.setValue('skills', watchedSkills.filter(s => s !== skill), { shouldValidate: true });
  };

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/');
  };

  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const timestamp = Date.now();
      const fileName = `${user?.id}-${timestamp}-${file.name}`;
      const url = await uploadFile(file, 'profile-pictures', fileName);

      // Update both forms just in case
      talentForm.setValue('avatarUrl', url);
      employerForm.setValue('companyLogo', url);

      // Save to backend immediately or wait for form submit?
      // User expected it to be "allowed", usually immediate is better for profile pics
      await authApi.updateProfile({ avatarUrl: url, companyLogo: url });
      dispatch(updateProfileSuccess({ avatarUrl: url }));

      // Refresh profile data
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert('Failed to upload profile picture');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <Loader2 className="w-12 h-12 text-rh-teal animate-spin" />
      </div>
    );
  }

  const completion = profile?.profileScore || (isTalent ? 85 : 90);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-[0_1.25rem_3.75rem_rgba(0,0,0,0.03)] border border-gray-100 mb-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-rh-teal/5 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-rh-red/5 rounded-full -ml-32 -mb-32 blur-3xl" />

          <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
            <div className="relative group">
              <div className="w-32 h-32 lg:w-44 lg:h-44 rounded-[2.5rem] bg-rh-light overflow-hidden shadow-2xl ring-8 ring-white transition-transform duration-500 group-hover:scale-105 relative">
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
                <img
                  src={profile?.avatarUrl || profile?.companyLogo || `https://i.pravatar.cc/300?u=${user?.email}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute -bottom-2 -right-2 p-4 bg-rh-red text-white rounded-2xl shadow-xl hover:bg-[#B41419] transition-all hover:scale-110 cursor-pointer z-30">
                <Camera className="w-5 h-5" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
              </label>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                <h1 className="text-3xl lg:text-5xl font-bold text-rh-teal tracking-tight">
                  {isTalent ? profile?.fullName : `${profile?.firstName} ${profile?.lastName}`}
                </h1>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[0.625rem] font-bold uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified Profile
                  </span>
                  <span className="px-4 py-1.5 bg-rh-teal/5 text-rh-teal rounded-xl text-[0.625rem] font-bold uppercase tracking-widest border border-rh-teal/10">
                    {user?.role}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-rh-red" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                {profile?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-rh-red" />
                    <span className="text-sm">{profile.phone || profile.businessPhone}</span>
                  </div>
                )}
                {profile?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rh-red" />
                    <span className="text-sm">
                      {isTalent
                        ? `${profile.location.city}, ${profile.location.country}`
                        : profile.zipCode}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-rh-teal rounded-[2rem] p-8 text-white min-w-[15rem] w-full lg:w-auto shadow-2xl shadow-rh-teal/20">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/60">Profile Strength</h4>
                <Shield className="w-5 h-5 text-rh-red" />
              </div>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-5xl font-bold tracking-tighter">{completion}%</span>
                <span className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> +5%
                </span>
              </div>
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completion}%` }}
                  className="h-full bg-rh-red rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Tabs */}
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-[32px] p-4 shadow-sm border border-gray-100 space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'overview' ? 'bg-rh-teal text-white shadow-xl shadow-rh-teal/10' : 'text-gray-500 hover:bg-rh-light hover:text-rh-teal'}`}
              >
                <User className="w-5 h-5" /> Profile Overview
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'edit' ? 'bg-rh-teal text-white shadow-xl shadow-rh-teal/10' : 'text-gray-500 hover:bg-rh-light hover:text-rh-teal'}`}
              >
                <Settings className="w-5 h-5" /> Edit Profile
              </button>
              {isTalent && (
                <button
                  onClick={() => setActiveTab('resume')}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'resume' ? 'bg-rh-teal text-white shadow-xl shadow-rh-teal/10' : 'text-gray-500 hover:bg-rh-light hover:text-rh-teal'}`}
                >
                  <FileText className="w-5 h-5" /> Resume & Score
                </button>
              )}
              <div className="h-px bg-gray-50 my-4" />
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-rh-red font-bold text-sm hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>

            <div className="mt-8 bg-rh-teal rounded-[32px] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform"><Target className="w-24 h-24" /></div>
              <h4 className="text-lg font-bold mb-4 relative z-10">Need Help?</h4>
              <p className="text-white/70 text-sm mb-6 relative z-10 leading-relaxed font-medium">Our expert consultants can help you optimize your profile for global roles.</p>
              <Button onClick={() => navigate("/contact")} className="w-full !text-black bg-white text-rh-teal hover:bg-rh-red !hover:text-white rounded-xl py-3 text-xs font-bold">Contact Support</Button>
            </div>
          </aside>

          {/* Tab Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {isTalent ? (
                    <>
                      {/* Talent Overview */}
                      <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xl font-bold text-rh-teal flex items-center gap-3">
                            <Star className="w-6 h-6 text-rh-red" /> Expertise & Skills
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {profile?.skills?.map((skill: string) => (
                            <span key={skill} className="px-6 py-3 bg-rh-light text-rh-teal rounded-2xl text-xs font-bold border border-rh-teal/5">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </section>

                      <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xl font-bold text-rh-teal flex items-center gap-3">
                            <GraduationCap className="w-6 h-6 text-rh-red" /> Education
                          </h3>
                        </div>
                        <div className="space-y-6">
                          {profile?.educations?.map((edu: any, idx: number) => (
                            <div key={idx} className="flex gap-6 p-6 bg-rh-light/30 rounded-[32px] border border-gray-50">
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
                      </section>

                      <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xl font-bold text-rh-teal flex items-center gap-3">
                            <Briefcase className="w-6 h-6 text-rh-red" /> Work Experience
                          </h3>
                        </div>
                        <div className="space-y-8">
                          {profile?.experiences?.map((exp: any, idx: number) => (
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
                      </section>
                    </>
                  ) : (
                    <>
                      {/* Employer Overview */}
                      <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xl font-bold text-rh-teal flex items-center gap-3">
                            <Briefcase className="w-6 h-6 text-rh-red" /> Company Details
                          </h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Company Name</p>
                            <p className="text-lg font-bold text-rh-teal">{profile?.companyName}</p>
                          </div>
                          <div className="p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Job Title</p>
                            <p className="text-lg font-bold text-rh-teal">{profile?.jobTitle}</p>
                          </div>
                          <div className="p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Hiring Needs</p>
                            <p className="text-lg font-bold text-rh-teal">{profile?.jobTitleToHire}</p>
                          </div>
                          <div className="p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Position Type</p>
                            <p className="text-lg font-bold text-rh-teal">{profile?.positionType}</p>
                          </div>
                        </div>
                      </section>
                    </>
                  )}
                </motion.div>
              )}

              {activeTab === 'edit' && (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 border-b border-gray-50 pb-6">
                    <h3 className="text-2xl font-bold text-rh-teal">Update Information</h3>
                    <div className="flex items-center gap-2 text-rh-red text-xs font-bold uppercase tracking-widest self-start sm:self-auto">
                      <Info className="w-4 h-4 shrink-0" />
                      Changes will be saved to your profile
                    </div>
                  </div>

                  {isTalent ? (
                    <form onSubmit={talentForm.handleSubmit(onUpdateSubmit)} className="space-y-10">
                      <input type="hidden" {...talentForm.register('avatarUrl')} />
                      <input type="hidden" {...talentForm.register('resumeUrl')} />
                      {/* Resume Upload Section */}
                      <div className="bg-[#F9FBFF] rounded-[2rem] p-8 border border-rh-teal/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rh-teal/5 rounded-full -mr-16 -mt-16 blur-2xl" />

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-rh-teal">
                              <FileText className="w-7 h-7" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-rh-teal mb-0.5">Your Resume</h4>
                              <p className="text-xs text-gray-500 font-medium">Update your professional CV here</p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mt-6 sm:mt-0">
                            <input
                              id="resume-upload-edit"
                              type="file"
                              className="hidden"
                              accept=".pdf,.doc,.docx"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if ((profile?.resumes?.length || 0) >= 5) {
                                    alert('Maximum 5 resumes allowed. Please delete an existing resume first.');
                                    return;
                                  }
                                  try {
                                    setSaving(true);
                                    const timestamp = Date.now();
                                    const fileName = `${user?.id}-${timestamp}-${file.name.replace(/\s+/g, '-')}`;
                                    const url = await uploadFile(file, 'resumes', fileName);
                                    talentForm.setValue('resumeUrl', url);

                                    // Add to resumes list & calculate ATS score
                                    const newResume = await authApi.addResume({
                                      fileName: file.name,
                                      fileUrl: url,
                                    });
                                    if (newResume?.atsScore) {
                                      setResumeScore(newResume.atsScore);
                                    }
                                    await fetchProfile();
                                    alert('Resume uploaded successfully!');
                                  } catch (err: any) {
                                    alert(err.response?.data?.message || 'Failed to upload resume');
                                  } finally {
                                    setSaving(false);
                                  }
                                }
                              }}
                            />
                            <Button
                              type="button"
                              onClick={() => document.getElementById('resume-upload-edit')?.click()}
                              variant="outline"
                              className="w-full sm:w-auto px-6 py-3 border-2 border-rh-teal/10 hover:border-rh-teal hover:bg-rh-teal hover:text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center"
                            >
                              <Upload className="w-4 h-4 mr-2" /> Upload New
                            </Button>

                            {talentForm.watch('resumeUrl') && (
                              <a
                                href={talentForm.watch('resumeUrl')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-6 py-3 bg-white text-rh-teal rounded-xl font-bold text-sm shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-center gap-2"
                              >
                                <Target className="w-4 h-4" /> View Current
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                          <input {...talentForm.register('fullName')} className="w-full px-6 py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all font-medium" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone</label>
                          <input {...talentForm.register('phone')} className="w-full px-6 py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all font-medium" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Location (City, Country)</label>
                          <input {...talentForm.register('location')} className="w-full px-6 py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all font-medium" />
                        </div>
                      </div>

                      {/* Skills Section */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-rh-teal uppercase tracking-widest">Skills</h4>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                            placeholder="Add a skill..."
                            className="flex-1 px-6 py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all font-medium"
                          />
                          <Button type="button" onClick={addSkill} variant="outline" className="px-8 border-2 border-gray-100 rounded-2xl font-bold">Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {watchedSkills.map(s => (
                            <span key={s} className="px-5 py-2.5 bg-rh-light text-rh-teal rounded-xl text-xs font-bold flex items-center gap-3 group">
                              {s}
                              <button type="button" onClick={() => removeSkill(s)}><Trash2 className="w-4 h-4 text-gray-300 group-hover:text-rh-red transition-colors" /></button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Education Section */}
                      <div className="space-y-6 pt-10 border-t border-gray-50">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-rh-teal uppercase tracking-widest">Education</h4>
                          <button type="button" onClick={() => appendEdu({ school: '', degree: '', year: '' })} className="text-rh-red font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                            <Plus className="w-4 h-4" /> Add Education
                          </button>
                        </div>
                        <div className="space-y-4">
                          {eduFields.map((field, index) => (
                            <div key={field.id} className="p-6 bg-[#F9FBFF] rounded-2xl border border-gray-100 relative group">
                              <button type="button" onClick={() => removeEdu(index)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-rh-red transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2 space-y-1.5">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">School / University</label>
                                  <input {...talentForm.register(`educations.${index}.school`)} className="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium" />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Degree</label>
                                  <input {...talentForm.register(`educations.${index}.degree`)} className="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium" />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Year</label>
                                  <input {...talentForm.register(`educations.${index}.year`)} className="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Experience Section */}
                      <div className="space-y-6 pt-10 border-t border-gray-50">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-rh-teal uppercase tracking-widest">Work Experience</h4>
                          <button type="button" onClick={() => appendExp({ title: '', company: '', responsibilities: '' })} className="text-rh-red font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                            <Plus className="w-4 h-4" /> Add Experience
                          </button>
                        </div>
                        <div className="space-y-4">
                          {expFields.map((field, index) => (
                            <div key={field.id} className="p-6 bg-[#F9FBFF] rounded-2xl border border-gray-100 relative group">
                              <button type="button" onClick={() => removeExp(index)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-rh-red transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Title</label>
                                  <input {...talentForm.register(`experiences.${index}.title`)} className="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium" />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company</label>
                                  <input {...talentForm.register(`experiences.${index}.company`)} className="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium" />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Responsibilities</label>
                                  <textarea rows={3} {...talentForm.register(`experiences.${index}.responsibilities`)} className="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium resize-none" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-10 border-t border-gray-50">
                        <Button type="button" onClick={() => setActiveTab('overview')} variant="outline" className="w-full sm:w-auto px-10 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 justify-center">Discard</Button>
                        <Button type="submit" disabled={saving} variant="primary" className="w-full sm:w-auto px-12 py-4 bg-rh-teal text-white rounded-2xl font-bold shadow-xl shadow-rh-teal/10 flex items-center justify-center gap-2">
                          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={employerForm.handleSubmit(onUpdateSubmit)} className="space-y-10">
                      <input type="hidden" {...employerForm.register('companyLogo')} />
                      {/* Employer Avatar Upload */}
                      <div className="bg-rh-light/30 rounded-[2rem] p-8 border border-rh-teal/5 relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                          <div className="flex items-center gap-6">
                            <div className="relative group">
                              <div className="w-20 h-20 rounded-2xl bg-white overflow-hidden shadow-md border-4 border-white">
                                {employerForm.watch('companyLogo') ? (
                                  <img src={employerForm.watch('companyLogo')} alt="Company Logo" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                    <User className="w-8 h-8" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-rh-teal mb-0.5">Professional Photo</h4>
                              <p className="text-xs text-gray-500 font-medium">Add a photo to build trust with talent</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            onClick={() => document.getElementById('employer-avatar-upload')?.click()}
                            variant="primary"
                            className="px-8 py-3.5 bg-rh-teal hover:bg-[#0E8A8F] text-white rounded-xl font-bold text-sm shadow-lg shadow-rh-teal/10"
                          >
                            <Camera className="w-4 h-4 mr-2" /> Change Photo
                            <input
                              id="employer-avatar-upload"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    setSaving(true);
                                    const url = await uploadFile(file, 'profile-pictures', `${user?.id}-${Date.now()}-${file.name}`);
                                    employerForm.setValue('companyLogo', url);
                                    await authApi.updateProfile({ companyLogo: url, avatarUrl: url });
                                    dispatch(updateProfileSuccess({ avatarUrl: url }));
                                    fetchProfile();
                                  } catch (err) {
                                    alert('Failed to upload photo');
                                  } finally {
                                    setSaving(false);
                                  }
                                }
                              }}
                            />
                          </Button>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                          <input {...employerForm.register('firstName')} className="w-full px-6 py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all font-medium" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                          <input {...employerForm.register('lastName')} className="w-full px-6 py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all font-medium" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Business Phone</label>
                          <input {...employerForm.register('businessPhone')} className="w-full px-6 py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all font-medium" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
                          <input {...employerForm.register('companyName')} className="w-full px-6 py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all font-medium" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Position Type</label>
                          <Controller
                            name="positionType"
                            control={employerForm.control}
                            render={({ field }) => (
                              <Dropdown
                                options={signUpPositionType}
                                value={field.value}
                                onChange={field.onChange}
                                className="border-transparent bg-[#F4F7FA] focus:bg-white"
                              />
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Your Job Title</label>
                          <input {...employerForm.register('jobTitle')} className="w-full px-6 py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all font-medium" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Title to Hire</label>
                          <input {...employerForm.register('jobTitleToHire')} className="w-full px-6 py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all font-medium" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Zip Code</label>
                          <input {...employerForm.register('zipCode')} className="w-full px-6 py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all font-medium" />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-10 border-t border-gray-50">
                        <Button type="button" onClick={() => setActiveTab('overview')} variant="outline" className="w-full sm:w-auto px-10 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 justify-center">Discard</Button>
                        <Button type="submit" disabled={saving} variant="primary" className="w-full sm:w-auto px-12 py-4 bg-rh-teal text-white rounded-2xl font-bold shadow-xl shadow-rh-teal/10 flex items-center justify-center gap-2">
                          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
                        </Button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}

              {activeTab === 'resume' && isTalent && (
                <motion.div
                  key="resume"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <section className="bg-white rounded-[40px] p-10 lg:p-16 shadow-sm border border-gray-100">
                    <div className="mb-10 text-center max-w-xl mx-auto">
                      <h3 className="text-3xl font-bold text-rh-teal mb-4">Resume Intelligence</h3>
                      <p className="text-gray-500 font-medium leading-relaxed">Upload your resume to get an AI-powered score and see how you rank against global benchmarks.</p>
                    </div>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-100 bg-[#F9FBFF] rounded-[40px] p-8 sm:p-16 text-center cursor-pointer hover:border-rh-teal/30 hover:bg-white transition-all group mb-12"
                    >
                      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleResumeUpload} />
                      {resumeExtracting ? (
                        <div className="space-y-8">
                          <div className="w-24 h-24 border-[6px] border-rh-teal border-t-transparent rounded-full animate-spin mx-auto shadow-sm" />
                          <div className="space-y-2">
                            <p className="text-rh-teal font-bold text-lg uppercase tracking-[0.2em] animate-pulse">Analyzing Semantic Content...</p>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Identifying Keywords & Experience</p>
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
                          <p className="text-gray-400 text-xs sm:text-sm mb-10 font-medium">PDF Documents only (Max 10MB)</p>
                          <Button variant="primary" className="w-full sm:w-auto px-8 sm:px-16 py-4 sm:py-5 bg-rh-teal text-white rounded-2xl font-bold shadow-2xl shadow-rh-teal/10 justify-center">Browse Files</Button>
                        </>
                      )}
                    </div>

                    {profile?.resumes && profile.resumes.length > 0 && (
                      <div className="mb-12 space-y-4">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-sm sm:text-md md:text-lg font-bold text-rh-teal flex items-center gap-2">
                            <FileText className="w-5 h-5 text-rh-red" /> Uploaded Resumes ({profile.resumes.length}/5)
                          </h4>
                          <span className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-widest">Manage CVs</span>
                        </div>
                        <div className="space-y-4">
                          {profile.resumes.map((resume: any) => (
                            <div key={resume.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-3xl border transition-all ${resume.isDefault ? 'bg-rh-light/40 border-rh-teal/20 shadow-md' : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'}`}>
                              <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${resume.isDefault ? 'bg-rh-teal text-white shadow-lg shadow-rh-teal/20' : 'bg-gray-50 text-gray-400'}`}>
                                  <FileText className="w-6 h-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h5 className="font-bold text-[#081B2D] text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">{resume.fileName}</h5>
                                    {resume.isDefault && (
                                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-bold uppercase tracking-widest border border-emerald-100 shrink-0 flex items-center gap-1 whitespace-nowrap">
                                        <CheckCircle className="w-3 h-3 shrink-0" /> Default CV
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-400 font-medium truncate">Uploaded on {new Date(resume.createdAt).toLocaleDateString()}</p>
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
                                  <a
                                    href={resume.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-gray-400 hover:text-rh-teal bg-gray-50 hover:bg-rh-light rounded-xl transition-all shrink-0"
                                    title="View PDF"
                                  >
                                    <Target className="w-4 h-4" />
                                  </a>
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
                              cx="100" cy="100" r="88" fill="none" stroke="#D71920" strokeWidth="12"
                              strokeDasharray={552.92}
                              initial={{ strokeDashoffset: 552.92 }}
                              animate={{ strokeDashoffset: 552.92 * (1 - resumeScore / 100) }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl sm:text-5xl lg:text-6xl font-bold">{resumeScore}</span>
                            <span className="text-[10px] sm:text-xs font-bold text-white/60 uppercase tracking-widest mt-1">AI Score</span>                          </div>
                        </div>

                        <div className="space-y-6 flex-1 text-center md:text-left">
                          <h4 className="text-2xl sm:text-3xl font-bold leading-tight">Excellent! Your resume is in the <span className="text-rh-red italic">Top 10%.</span></h4>
                          <p className="text-white/70 font-medium text-base sm:text-lg leading-relaxed">Your professional summary and technical stack are highly relevant to current global market demands.</p>
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
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
