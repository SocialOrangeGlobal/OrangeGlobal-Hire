import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle, Plus, Trash2, User, GraduationCap, Briefcase, Star, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';

type Step = 'resume' | 'personal' | 'education' | 'skills' | 'experience' | 'success';

interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  responsibilities: string;
}

export default function SignUpTalent() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('resume');
  const [extracting, setExtracting] = useState(false);

  // Dynamic form state
  const [educations, setEducations] = useState<Education[]>([
    { id: '1', school: '', degree: '', year: '' }
  ]);
  const [skills, setSkills] = useState<string[]>(['Strategic Management', 'Market Analysis', 'Leadership']);
  const [skillInput, setSkillInput] = useState('');
  const [experiences, setExperiences] = useState<Experience[]>([
    { id: '1', title: '', company: '', responsibilities: '' }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const goBack = () => {
    if (step === 'resume') navigate('/signup-choice');
    if (step === 'personal') setStep('resume');
    if (step === 'education') setStep('personal');
    if (step === 'skills') setStep('education');
    if (step === 'experience') setStep('skills');
  };

  const handleResumeUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setExtracting(true);
      // Simulate parsing
      setTimeout(() => {
        setExtracting(false);
        setStep('personal');
      }, 2000);
    }
  };

  // Education Handlers
  const addEducation = () => {
    setEducations([...educations, { id: Date.now().toString(), school: '', degree: '', year: '' }]);
  };
  const removeEducation = (id: string) => {
    if (educations.length > 1) {
      setEducations(educations.filter(e => e.id !== id));
    }
  };
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducations(educations.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  // Skill Handlers
  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };
  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  // Experience Handlers
  const addExperience = () => {
    setExperiences([...experiences, { id: Date.now().toString(), title: '', company: '', responsibilities: '' }]);
  };
  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter(e => e.id !== id));
    }
  };
  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(experiences.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const stepsInfo = [
    { id: 'resume', title: 'Resume Upload', icon: <Upload className="w-5 h-5" /> },
    { id: 'personal', title: 'Personal Details', icon: <User className="w-5 h-5" /> },
    { id: 'education', title: 'Education', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'skills', title: 'Skills & Expertise', icon: <Star className="w-5 h-5" /> },
    { id: 'experience', title: 'Work Experience', icon: <Briefcase className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-white min-h-screen pt-20 lg:pt-0 flex flex-col lg:flex-row font-sans overflow-x-hidden">
      {/* Left Side: Professional Branding (Swapped for mobile consistency) */}
      <aside className="w-full lg:w-[40%] relative flex flex-col justify-between p-6 md:p-12 lg:p-16 overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-100 min-h-[450px] md:min-h-[550px] lg:min-h-screen shrink-0">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0 bg-rh-dark">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 lg:mb-12 mt-2 lg:mt-8 text-center lg:text-left"
          >
            <h1 className="text-xl lg:text-4xl font-medium text-white mb-3 lg:mb-4 tracking-tight leading-tight">
              Get Your
              <span className='text-rh-teal-lighter font-medium italic ml-2'>Dream Job!</span>
            </h1>
            <p className="text-gray-200 text-sm lg:text-base font-normal leading-relaxed max-w-xs mx-auto lg:mx-0 opacity-90">
              Get discovered by top employers across 40+ countries and join the global elite.
            </p>
          </motion.div>

          {/* Vertical Progress Tracker */}
          <div className="space-y-4 md:space-y-6 lg:space-y-12 relative mb-8 lg:mb-0 max-w-xs mx-auto lg:mx-0">
            {/* Background Line */}
            <div className="absolute left-[19px] lg:left-[23px] top-4 bottom-4 w-[1px] bg-white/10" />

            {stepsInfo.map((s, i) => {
              const currentIdx = stepsInfo.findIndex(item => item.id === step);
              const isCompleted = step === 'success' || i < currentIdx;
              const isActive = step !== 'success' && i === currentIdx;

              return (
                <div key={s.id} className="flex items-center gap-4 lg:gap-8 group relative z-10">
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-[14px] lg:rounded-[18px] flex items-center justify-center transition-all duration-500 border-2 shrink-0 ${isActive ? 'bg-rh-teal-lighter border-rh-teal-lighter text-white shadow-xl shadow-rh-teal-lighter/20 scale-105 lg:scale-110' :
                    isCompleted ? 'bg-rh-teal-lighter/20 border-rh-teal-lighter text-rh-teal-lighter shadow-lg shadow-rh-teal-lighter/5' :
                      'bg-white/5 border-white/10 text-white/40 group-hover:border-rh-teal-lighter/40'
                    }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4 lg:w-6 lg:h-6" /> : s.icon}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className={`text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.25em] mb-0.5 transition-colors ${isActive ? 'text-rh-teal-lighter' : isCompleted ? 'text-rh-teal-lighter opacity-80' : 'text-white/30'
                      }`}>{`Step 0${i + 1}`}</span>
                    <span className={`text-xs lg:text-base font-bold transition-colors ${isActive ? 'text-white' : isCompleted ? 'text-white/70' : 'text-white/40'
                      }`}>{s.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 mt-16 pt-8 border-t border-white/10 hidden lg:flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md shadow-sm flex items-center justify-center border border-white/5">
            <CheckCircle className="w-5 h-5 text-rh-teal-lighter" />
          </div>
          <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest leading-tight">
            Verified Professional <br /> Registration
          </p>
        </div>
      </aside>

      {/* Right Side: Step Content Card Area */}
      <main className="flex-1 bg-[#F8F9FA] p-4 md:p-12 lg:p-12 lg:overflow-y-auto custom-scrollbar flex items-center justify-center">
        <div className="w-full max-w-3xl py-8 md:py-12">
          <AnimatePresence mode="wait">
            {step === 'resume' && (
              <motion.div
                key="resume"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="bg-white rounded-[48px] p-10 lg:p-16 shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-100"
              >
                <div className="mb-8 lg:mb-12">
                  <h2 className="text-xl lg:text-3xl font-bold text-rh-teal mb-4">Upload Resume</h2>
                  <p className="text-gray-500 font-medium">Get a head start by pre-filling your profile with your CV.</p>
                </div>

                <div
                  className="border-2 border-dashed border-gray-100 bg-[#F9FBFF] rounded-[24px] p-8 sm:p-14 lg:p-20 text-center cursor-pointer hover:border-rh-teal/30 hover:bg-white transition-all group mb-10"
                  onClick={handleResumeUploadClick}
                >
                  {extracting ? (
                    <div className="space-y-6">
                      <div className="w-16 h-16 border-[5px] border-rh-teal border-t-transparent rounded-full animate-spin mx-auto shadow-sm" />
                      <p className="text-rh-teal font-bold text-sm uppercase tracking-widest">Analyzing Documents...</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white shadow-sm rounded-[24px] flex items-center justify-center mx-auto mb-6 sm:mb-8 group-hover:scale-110 transition-transform text-rh-teal border border-gray-50">
                        <Upload className="w-8 h-8 sm:w-10 sm:h-10" />
                      </div>
                      <h3 className="text-base sm:text-xl font-bold text-[#081B2D] mb-2">Drop your resume here</h3>
                      <p className="text-gray-400 text-[10px] sm:text-sm mb-8 sm:mb-10">PDF or Word documents (Max 10MB)</p>
                      <Button variant="primary" className="px-10 sm:px-14 py-3 sm:py-4.5 bg-rh-teal hover:bg-[#0E8A8F] text-white rounded-2xl shadow-2xl shadow-rh-teal/10 font-bold text-[13px] sm:text-base">Select File</Button>
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-8 items-center border-t border-gray-50 pt-5">
                  <button onClick={() => setStep('personal')} className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.2em] hover:text-rh-teal transition-colors">
                    Continue without Resume
                  </button>
                  <button onClick={goBack} className="text-gray-400 font-bold hover:text-rh-red transition-colors flex items-center gap-2 group text-sm">
                    <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />  Back to Choice
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'personal' && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 lg:p-16 shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-100"
              >
                <div className="mb-8 sm:mb-12 border-b border-gray-50 pb-6">
                  <h2 className="text-xl sm:text-3xl font-bold text-rh-teal mb-2">Personal Details</h2>
                  <p className="text-gray-500 text-[13px] sm:text-base font-medium">Please provide your contact information.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 sm:gap-y-10 mb-8 sm:mb-12">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input type="text" placeholder="e.g. John Doe" className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Work Email</label>
                    <input type="email" placeholder="john@example.com" className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Current Location</label>
                    <input type="text" placeholder="City, Country" className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 sm:pt-10 border-t border-gray-50">
                  <button onClick={goBack} className="text-gray-400 font-bold hover:text-rh-red flex items-center gap-2 transition-colors order-2 sm:order-1">
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <Button onClick={() => setStep('education')} variant="primary" className="w-full sm:w-auto px-12 py-3.5 sm:py-4.5 bg-rh-teal hover:bg-[#0E8A8F] text-white rounded-2xl shadow-xl shadow-rh-teal/10 font-bold text-sm sm:text-base order-1 sm:order-2">Continue</Button>
                </div>
              </motion.div>
            )}

            {step === 'education' && (
              <motion.div
                key="education"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 lg:p-16 shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12 border-b border-gray-50 pb-6">
                  <div>
                    <h2 className="text-xl sm:text-3xl font-bold text-rh-teal mb-2">Education</h2>
                    <p className="text-gray-500 text-[13px] sm:text-base font-medium">Tell us about your academic background.</p>
                  </div>
                  <button
                    onClick={addEducation}
                    className="text-rh-teal font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1 self-start sm:self-center"
                  >
                    <Plus className="w-3 h-3" /> Add More
                  </button>
                </div>

                <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12">
                  {educations.map((edu, idx) => (
                    <div key={edu.id} className="p-6 sm:p-10 bg-[#F9FBFF] rounded-[32px] sm:rounded-[40px] border border-gray-100 relative group">
                      {educations.length > 1 && (
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-300 hover:text-rh-red transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                      <div className="grid gap-6 sm:gap-8">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">University / College</label>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                            placeholder="e.g. Harvard University"
                            className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-[13px] sm:text-sm font-medium placeholder:text-gray-300"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Degree</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              placeholder="e.g. Master of Science"
                              className="w-full px-5 py-3 sm:px-6 sm:py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-[13px] sm:text-sm font-medium placeholder:text-gray-300"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Graduation Year</label>
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                              placeholder="YYYY"
                              className="w-full px-5 py-3 sm:px-6 sm:py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-[13px] sm:text-sm font-medium placeholder:text-gray-300"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 sm:pt-10 border-t border-gray-50">
                  <button onClick={goBack} className="text-gray-400 font-bold hover:text-rh-red flex items-center gap-2 transition-colors order-2 sm:order-1">
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <Button onClick={() => setStep('skills')} variant="primary" className="w-full sm:w-auto px-12 py-3 sm:py-4.5 bg-rh-teal hover:bg-[#0E8A8F] text-white rounded-2xl shadow-xl shadow-rh-teal/10 font-bold text-[13px] sm:text-base order-1 sm:order-2">Continue</Button>
                </div>
              </motion.div>
            )}

            {step === 'skills' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 lg:p-16 shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-100"
              >
                <div className="mb-8 sm:mb-12 border-b border-gray-50 pb-6">
                  <h2 className="text-xl sm:text-3xl font-bold text-rh-teal mb-2">Skills & Expertise</h2>
                  <p className="text-gray-500 text-[13px] sm:text-base font-medium">Highlight your specialized skills.</p>
                </div>

                <div className="space-y-8 sm:space-y-12 mb-8 sm:mb-12">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      placeholder="e.g. Product Strategy, React..."
                      className="flex-1 px-5 py-3 sm:px-6 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all text-gray-900 text-[13px] sm:text-sm font-medium placeholder:text-gray-300"
                    />
                    <Button onClick={addSkill} variant="outline" className="w-full sm:w-auto px-12 py-3 sm:py-4 rounded-2xl border-2 border-gray-100 text-[#081B2D] font-bold hover:bg-rh-teal hover:text-white hover:border-rh-teal transition-all text-[13px] sm:text-sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {skills.map(s => (
                      <span key={s} className="px-4 py-2.5 sm:px-8 sm:py-3.5 bg-white border border-gray-100 rounded-xl sm:rounded-2xl text-[11px] sm:text-sm font-bold text-gray-600 flex items-center gap-3 sm:gap-4 shadow-sm hover:border-rh-teal/30 transition-all group">
                        {s}
                        <button onClick={() => removeSkill(s)}>
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300 group-hover:text-rh-red cursor-pointer transition-colors" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 sm:pt-10 border-t border-gray-50">
                  <button onClick={goBack} className="text-gray-400 font-bold hover:text-rh-red flex items-center gap-2 transition-colors order-2 sm:order-1">
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <Button onClick={() => setStep('experience')} variant="primary" className="w-full sm:w-auto px-12 py-3 sm:py-4.5 bg-rh-teal hover:bg-[#0E8A8F] text-white rounded-2xl shadow-xl shadow-rh-teal/10 font-bold text-[13px] sm:text-base order-1 sm:order-2">Continue</Button>
                </div>
              </motion.div>
            )}

            {step === 'experience' && (
              <motion.div
                key="experience"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 lg:p-16 shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12 border-b border-gray-50 pb-6">
                  <div>
                    <h2 className="text-xl sm:text-3xl font-bold text-rh-teal mb-2">Work Experience</h2>
                    <p className="text-gray-500 text-[13px] sm:text-base font-medium">Detail your professional journey.</p>
                  </div>
                  <button
                    onClick={addExperience}
                    className="text-rh-teal font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1 self-start sm:self-center"
                  >
                    <Plus className="w-3 h-3" /> Add Position
                  </button>
                </div>

                <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12">
                  {experiences.map((exp, idx) => (
                    <div key={exp.id} className="p-6 sm:p-10 bg-[#F9FBFF] rounded-[32px] sm:rounded-[40px] border border-gray-100 relative group">
                      {experiences.length > 1 && (
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-300 hover:text-rh-red transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                      <div className="grid gap-6 sm:gap-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Title</label>
                            <input
                              type="text"
                              value={exp.title}
                              onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                              placeholder="e.g. Project Lead"
                              className="w-full px-5 py-3 sm:px-6 sm:py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-[13px] sm:text-sm font-medium placeholder:text-gray-300"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              placeholder="e.g. Tech Global"
                              className="w-full px-5 py-3 sm:px-6 sm:py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-[13px] sm:text-sm font-medium placeholder:text-gray-300"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Key Responsibilities</label>
                          <textarea
                            rows={5}
                            value={exp.responsibilities}
                            onChange={(e) => updateExperience(exp.id, 'responsibilities', e.target.value)}
                            placeholder="Describe your achievements..."
                            className="w-full px-5 py-3 sm:px-6 sm:py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-[13px] sm:text-sm font-medium resize-none placeholder:text-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 sm:pt-10 border-t border-gray-50">
                  <button onClick={goBack} className="text-gray-400 font-bold hover:text-rh-red flex items-center gap-2 transition-colors order-2 sm:order-1">
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <Button onClick={() => setStep('success')} variant="primary" className="w-full sm:w-auto px-12 py-3.5 sm:py-5 bg-rh-teal hover:bg-[#0E8A8F] text-white rounded-[20px] shadow-2xl shadow-rh-teal/20 font-bold text-[13px] sm:text-base order-1 sm:order-2">Complete Registration</Button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[40px] sm:rounded-[60px] p-8 sm:p-16 lg:p-24 shadow-[0_30px_60px_rgb(0,0,0,0.05)] border border-gray-50 text-center"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-emerald-50 text-emerald-500 rounded-[32px] sm:rounded-[44px] flex items-center justify-center mx-auto mb-6 sm:mb-10 shadow-xl shadow-emerald-500/5 border border-emerald-100">
                  <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-light text-[#081B2D] mb-4 sm:mb-6 tracking-tight leading-tight">Registration Complete!</h2>
                <p className="text-gray-500 mb-8 sm:mb-14 text-base sm:text-lg font-medium max-w-md mx-auto leading-relaxed">Your professional talent profile has been verified. You can now access global opportunities tailored to your expertise.</p>
                <Button onClick={() => navigate('/talent-dashboard')} variant="primary" className="w-full sm:w-auto px-12 sm:px-16 py-4 sm:py-6 bg-rh-teal hover:bg-[#0E8A8F] text-white rounded-[20px] sm:rounded-[28px] shadow-2xl shadow-rh-teal/20 font-bold text-lg sm:text-xl">Go to Dashboard</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
