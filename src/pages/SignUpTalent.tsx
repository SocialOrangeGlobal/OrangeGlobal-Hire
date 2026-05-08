import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, FileText, CheckCircle, Plus, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Footer from '../components/layouts/Footer';

type Step = 'resume' | 'personal' | 'education' | 'skills' | 'experience' | 'success';

export default function SignUpTalent() {
  const [step, setStep] = useState<Step>('resume');
  const [extracting, setExtracting] = useState(false);

  const goBack = () => {
    if (step === 'resume') window.location.hash = '#signup-choice';
    if (step === 'personal') setStep('resume');
    if (step === 'education') setStep('personal');
    if (step === 'skills') setStep('education');
    if (step === 'experience') setStep('skills');
  };

  const handleResumeUpload = () => {
    setExtracting(true);
    // Mock extraction process
    setTimeout(() => {
      setExtracting(false);
      setStep('personal');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <header className="bg-white border-b border-gray-100 py-5 px-6 md:px-12 flex items-center justify-between relative z-20">
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }} className="flex items-center gap-2">
          <div className="w-40">
            <img src="/images/brand-logo-dark.png" alt="Orange Global" className="w-full h-auto object-contain" />
          </div>
        </a>
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }} className="text-sm font-bold text-gray-500 hover:text-rh-red flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </a>
      </header>

      <main className="flex-1 py-12 px-4 flex items-center justify-center pb-20">
        <div className="w-full max-w-3xl">
          {/* Progress Indicator */}
          {step !== 'resume' && step !== 'success' && (
            <div className="mb-12">
                <div className="flex justify-between mb-4">
                    {['Personal', 'Education', 'Skills', 'Experience'].map((s, i) => {
                        const steps: Step[] = ['personal', 'education', 'skills', 'experience'];
                        const currentIndex = steps.indexOf(step);
                        const isCompleted = i < currentIndex;
                        const isActive = i === currentIndex;
                        return (
                            <div key={s} className="flex flex-col items-center flex-1 relative">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-300 ${
                                    isActive ? 'bg-rh-red text-white' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : i + 1}
                                </div>
                                <span className={`text-xs mt-2 font-bold uppercase tracking-wider ${isActive ? 'text-rh-red' : 'text-gray-400'}`}>
                                    {s}
                                </span>
                                {i < 3 && (
                                    <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-200 -z-0">
                                        <div className={`h-full bg-emerald-500 transition-all duration-500 ${isCompleted ? 'w-full' : 'w-0'}`} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 'resume' && (
              <motion.div
                key="resume"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 text-center"
              >
                <h2 className="text-3xl font-light text-gray-900 mb-4">Let's build your profile</h2>
                <p className="text-gray-500 mb-10 max-w-md mx-auto">Upload your resume to pre-fill your details, or continue manually.</p>
                
                <div 
                  onClick={handleResumeUpload}
                  className={`border-2 border-dashed rounded-3xl p-12 mb-8 cursor-pointer transition-all ${
                    extracting ? 'bg-gray-50 border-rh-teal' : 'bg-[#eff2f6] border-gray-200 hover:border-rh-red/50 hover:bg-rh-red/5'
                  }`}
                >
                  {extracting ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-rh-teal border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-rh-teal font-bold">Extracting your details...</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                        <Upload className="w-10 h-10 text-rh-red" />
                      </div>
                      <h3 className="text-xl font-bold text-[#081B2D] mb-2">Upload Resume</h3>
                      <p className="text-sm text-gray-500">PDF, DOCX up to 10MB (Optional)</p>
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => setStep('personal')}
                    className="text-gray-500 font-bold hover:text-rh-red transition-colors"
                  >
                    Continue without resume
                  </button>
                  <div className="pt-8 border-t border-gray-100">
                    <button onClick={goBack} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mx-auto">
                        <ArrowLeft className="w-4 h-4" /> Back to Choice
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'personal' && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-[#081B2D] mb-8">Personal Details</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                        <input type="text" placeholder="John Doe" className="w-full px-5 py-4 bg-[#eff2f6] border-none rounded-2xl focus:ring-2 focus:ring-rh-red/20 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                        <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-5 py-4 bg-[#eff2f6] border-none rounded-2xl focus:ring-2 focus:ring-rh-red/20 transition-all" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Current Address</label>
                        <input type="text" placeholder="123 Street, City, Country" className="w-full px-5 py-4 bg-[#eff2f6] border-none rounded-2xl focus:ring-2 focus:ring-rh-red/20 transition-all" />
                    </div>
                </div>
                <div className="flex justify-between pt-6 border-t border-gray-100">
                    <button onClick={goBack} className="text-gray-500 font-bold hover:text-gray-900 flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                    <Button onClick={() => setStep('education')} variant="primary" className="px-12 py-4 font-bold">Continue</Button>
                </div>
              </motion.div>
            )}

            {step === 'education' && (
              <motion.div
                key="education"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-[#081B2D]">Education Details</h2>
                    <button className="text-rh-red font-bold flex items-center gap-1 text-sm bg-rh-red/5 px-4 py-2 rounded-xl hover:bg-rh-red/10 transition-colors">
                        <Plus className="w-4 h-4" /> Add More
                    </button>
                </div>
                <div className="space-y-6 mb-8">
                    <div className="p-6 bg-[#eff2f6] rounded-2xl relative group">
                        <button className="absolute top-4 right-4 text-gray-400 hover:text-rh-red opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase">Degree</label>
                                <input type="text" placeholder="Bachelor of Science" className="w-full bg-white px-4 py-3 rounded-xl border-none focus:ring-1 focus:ring-rh-red/30" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase">Institution</label>
                                <input type="text" placeholder="University of Technology" className="w-full bg-white px-4 py-3 rounded-xl border-none focus:ring-1 focus:ring-rh-red/30" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between pt-6 border-t border-gray-100">
                    <button onClick={goBack} className="text-gray-500 font-bold hover:text-gray-900 flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                    <Button onClick={() => setStep('skills')} variant="primary" className="px-12 py-4 font-bold">Continue</Button>
                </div>
              </motion.div>
            )}

            {step === 'skills' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-[#081B2D] mb-4">Skills</h2>
                <p className="text-gray-500 mb-8 text-sm">Add your technical and soft skills to stand out.</p>
                
                <div className="flex flex-wrap gap-3 mb-10">
                    {['React.js', 'TypeScript', 'Tailwind CSS', 'Project Management'].map(skill => (
                        <div key={skill} className="bg-white border border-gray-200 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold text-gray-700 shadow-sm">
                            {skill} <Trash2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-rh-red" />
                        </div>
                    ))}
                    <button className="bg-gray-100 text-gray-500 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-gray-200 transition-colors">
                        <Plus className="w-4 h-4" /> Add Skill
                    </button>
                </div>

                <div className="flex justify-between pt-6 border-t border-gray-100">
                    <button onClick={goBack} className="text-gray-500 font-bold hover:text-gray-900 flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                    <Button onClick={() => setStep('experience')} variant="primary" className="px-12 py-4 font-bold">Continue</Button>
                </div>
              </motion.div>
            )}

            {step === 'experience' && (
              <motion.div
                key="experience"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-[#081B2D]">Experiences</h2>
                    <button className="text-rh-red font-bold flex items-center gap-1 text-sm bg-rh-red/5 px-4 py-2 rounded-xl hover:bg-rh-red/10 transition-colors">
                        <Plus className="w-4 h-4" /> Add Experience
                    </button>
                </div>
                <div className="space-y-6 mb-8">
                    <div className="p-6 bg-[#eff2f6] rounded-2xl relative group">
                        <div className="grid gap-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Job Title</label>
                                    <input type="text" placeholder="Senior Developer" className="w-full bg-white px-4 py-3 rounded-xl border-none focus:ring-1 focus:ring-rh-red/30" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Company</label>
                                    <input type="text" placeholder="Tech Innovations Inc." className="w-full bg-white px-4 py-3 rounded-xl border-none focus:ring-1 focus:ring-rh-red/30" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                                <textarea rows={3} placeholder="Describe your responsibilities..." className="w-full bg-white px-4 py-3 rounded-xl border-none focus:ring-1 focus:ring-rh-red/30 resize-none" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between pt-6 border-t border-gray-100">
                    <button onClick={goBack} className="text-gray-500 font-bold hover:text-gray-900 flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                    <Button onClick={() => setStep('success')} variant="primary" className="px-12 py-4 font-bold">Complete Registration</Button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center"
              >
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-light text-gray-900 mb-4">Registration Successful!</h2>
                <p className="text-gray-500 mb-12 text-lg">Your profile has been created. Start exploring opportunities tailored for you.</p>
                <Button onClick={() => window.location.hash = ''} variant="primary" className="px-12 py-4 font-bold">Go to Dashboard</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
