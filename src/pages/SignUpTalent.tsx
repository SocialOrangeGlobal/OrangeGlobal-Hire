import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Upload, CheckCircle, User, Briefcase,
  Globe, GraduationCap, CheckCircle2, Languages, ShieldCheck, Plane, FileCheck, Loader2, AlertCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import { authApi } from '../lib/auth';
import { uploadFile, validateFileConstraints } from '../lib/storage';
import { useAppDispatch } from '../store';
import { setError as setAuthError } from '../store/slices/authSlice';
import { SignUpTalentDto } from '../types/auth';
import { useGlobalLoader } from '../components/ui/GlobalLoader';
import { Country, State } from 'country-state-city';
import { nationalitiesList } from '../data';
import { SignupFormSteps } from '../components/signup/SignupFormSteps';

const experienceYears = [
  "Less than 1 Year",
  "1 Year",
  "2 Years",
  "3 Years",
  "4 Years",
  "5 Years",
  "6 Years",
  "7 Years",
  "8 Years",
  "9 Years",
  "10+ Years"
];

export default function SignUpTalent() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { executeWithLoader } = useGlobalLoader();

  const [residenceCountryIso, setResidenceCountryIso] = useState<string>('');
  const [residenceStateIso, setResidenceStateIso] = useState<string>('');
  const [isCustomNationality, setIsCustomNationality] = useState<boolean>(false);
  const [isCustomCity, setIsCustomCity] = useState<boolean>(false);

  const countriesData = Country.getAllCountries();

  const handleCountryChange = (countryName: string) => {
    updateForm('countryOfResidence', countryName);
    const countryObj = countriesData.find(c => c.name === countryName);
    if (countryObj) {
      setResidenceCountryIso(countryObj.isoCode);
    } else {
      setResidenceCountryIso('');
    }
    setResidenceStateIso('');
    updateForm('city', '');
    setIsCustomCity(false);
  };

  const handleStateChange = (stateName: string) => {
    const statesList = State.getStatesOfCountry(residenceCountryIso);
    const stateObj = statesList.find(s => s.name === stateName);
    if (stateObj) {
      setResidenceStateIso(stateObj.isoCode);
    } else {
      setResidenceStateIso('');
    }
    updateForm('city', '');
    setIsCustomCity(false);
  };

  const handleCityChange = (cityName: string) => {
    if (cityName === 'Other') {
      setIsCustomCity(true);
      updateForm('city', '');
    } else {
      setIsCustomCity(false);
      updateForm('city', cityName);
    }
  };

  const [formData, setFormData] = useState({
    fullName: '', dob: '', age: '', gender: '', nationality: '', countryOfResidence: '', city: '', whatsapp: '', email: '', password: '', linkedin: '', phone: '',
    opportunityType: '', preferredIndustry: '', preferredRole: '', preferredSalary: '', startDate: '',
    jobTitle: '', employerName: '', employmentCountry: '', totalExp: '', relevantExp: '', summary: '', isEmployed: '', workedOverseas: '', overseasCountries: '',
    highestQualification: '', fieldOfStudy: '', institutionName: '', graduationYear: '', hasLicences: '', licencesList: '',
    englishTest: '', overallScore: '', testDate: '',
    visaStatus: '', legalWorkRights: '', openToRelocation: '', appliedAusVisa: '', visaTypeApplied: '', visaRefusal: '', visaRefusalDetails: '',
    relocateAloneOrFamily: '', validPassport: '', passportExpiry: '', medicalBackgroundCheck: '', criminalConvictions: '', criminalDetails: '',
    declarationTrue: false, declarationConsent: false, honeypot: '',

    resumeFile: null as File | null,
    passportFile: null as File | null,
    visaFile: null as File | null,
    eduCertFile: null as File | null,
    empCertFile: null as File | null,
    englishTestFile: null as File | null,
    licenceFile: null as File | null,
  });

  const updateForm = (field: string, value: any) => {
    let finalValue = value;
    if (field === 'whatsapp' || field === 'phone') {
      if (typeof value === 'string') {
        finalValue = value.replace(/[^\d+\s\-]/g, '');
      }
    }
    setFormData(prev => {
      const updated = { ...prev, [field]: finalValue };
      if (field === 'dob') {
        if (finalValue) {
          const birthDate = new Date(finalValue);
          if (!isNaN(birthDate.getTime())) {
            const today = new Date();
            let computedAge = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              computedAge--;
            }
            updated.age = computedAge >= 0 ? computedAge.toString() : '';
          }
        } else {
          updated.age = '';
        }
      }
      return updated;
    });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (field === 'dob' && errors.age) {
      setErrors(prev => ({ ...prev, age: '' }));
    }
    if (submitError) setSubmitError('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFileChange = (field: string, e: React.ChangeEvent<HTMLInputElement>, acceptStr?: string) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const error = validateFileConstraints(file, 'talent-documents', acceptStr);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
        e.target.value = '';
        setFormData(prev => ({ ...prev, [field]: null }));
        return;
      }
    }
    updateForm(field, file);
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
      if (!formData.email.trim()) {
        newErrors.email = 'Email Address is required.';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address.';
      }
      if (!formData.password || formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long.';
      if (!formData.dob.trim()) newErrors.dob = 'Date of Birth is required.';
      if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required.';
      if (!formData.countryOfResidence.trim()) newErrors.countryOfResidence = 'Country of Residence is required.';
      if (!formData.whatsapp.trim()) {
        newErrors.whatsapp = 'WhatsApp Number is required.';
      } else {
        const digitCount = formData.whatsapp.replace(/\D/g, '').length;
        if (digitCount < 5) {
          newErrors.whatsapp = 'WhatsApp Number must be at least 5 digits.';
        }
      }
    }
    if (currentStep === 2) {
      if (!formData.opportunityType) newErrors.opportunityType = 'Please select an opportunity type.';
      if (!formData.preferredIndustry.trim()) newErrors.preferredIndustry = 'Preferred Industry is required.';
      if (!formData.preferredRole.trim()) newErrors.preferredRole = 'Preferred Role is required.';
    }
    if (currentStep === 3) {
      if (!formData.isEmployed) newErrors.isEmployed = 'Please indicate if you are currently employed.';
      if (formData.isEmployed === 'Yes') {
        if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Current Job Title is required.';
        if (!formData.employerName.trim()) newErrors.employerName = 'Current Employer Name is required.';
        if (!formData.totalExp.trim()) newErrors.totalExp = 'Total Years of Experience is required.';
      }
      if (formData.summary && formData.summary.length > 200) {
        newErrors.summary = 'Professional Summary cannot exceed 200 characters.';
      }
    }
    if (currentStep === 4) {
      if (!formData.highestQualification) newErrors.highestQualification = 'Please select your highest qualification.';
      if (!formData.fieldOfStudy.trim()) newErrors.fieldOfStudy = 'Field of Study is required.';
    }
    if (currentStep === 5) {
      if (!formData.englishTest) newErrors.englishTest = 'Please select your English test status.';
    }
    if (currentStep === 6) {
      if (!formData.visaStatus.trim()) newErrors.visaStatus = 'Current Visa / Residency Status is required.';
      if (!formData.openToRelocation) newErrors.openToRelocation = 'Please indicate if you are open to relocation.';
      if (formData.visaRefusal === 'Yes' && formData.visaRefusalDetails && formData.visaRefusalDetails.length > 200) {
        newErrors.visaRefusalDetails = 'Visa refusal details cannot exceed 200 characters.';
      }
    }
    if (currentStep === 7) {
      if (!formData.relocateAloneOrFamily) newErrors.relocateAloneOrFamily = 'Please indicate if you are relocating alone or with family.';
      if (formData.validPassport === 'Yes') {
        if (!formData.passportExpiry.trim()) {
          newErrors.passportExpiry = 'Passport Expiry Date is required.';
        } else {
          const expiryDate = new Date(formData.passportExpiry);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (expiryDate <= today) {
            newErrors.passportExpiry = 'Passport Expiry Date must be a future date.';
          }
        }
      }
      if (formData.criminalConvictions === 'Yes' && formData.criminalDetails && formData.criminalDetails.length > 200) {
        newErrors.criminalDetails = 'Conviction details cannot exceed 200 characters.';
      }
    }
    if (currentStep === 8) {
      if (!formData.resumeFile) newErrors.resumeFile = 'Please upload your Resume / CV.';
      if (!formData.passportFile) newErrors.passportFile = 'Please upload your Passport Copy.';
      if (!formData.visaFile) newErrors.visaFile = 'Please upload your Current Visa / Residency Permit.';
      if (!formData.eduCertFile) newErrors.eduCertFile = 'Please upload your Educational Certificates.';
      if (!formData.empCertFile) newErrors.empCertFile = 'Please upload your Employment Certificates / Experience Letters.';
    }
    if (currentStep === 9) {
      if (!formData.declarationTrue) newErrors.declarationTrue = 'You must confirm the accuracy of your information.';
      if (!formData.declarationConsent) newErrors.declarationConsent = 'You must consent to sharing your profile.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    const isValid = validateStep(step);
    if (!isValid) {
      setSubmitError('Please correct the highlighted errors below before proceeding.');
      scrollToTop();
      return;
    }
    setSubmitError('');
    setStep(prev => prev + 1);
    scrollToTop();
  };

  const goBack = () => {
    if (step === 1) {
      navigate('/signup-choice');
    } else {
      setStep(prev => prev - 1);
      scrollToTop();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (formData.honeypot) return; // Anti-spam

    // Final validation check before submit
    for (let s = 1; s <= 9; s++) {
      const isValid = validateStep(s);
      if (!isValid) {
        setSubmitError(`Please correct the highlighted errors in Step ${s}.`);
        setStep(s);
        scrollToTop();
        return;
      }
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      await executeWithLoader(
        'Uploading credentials & completing registration...',
        async () => {
          const fileUploadPromises: Promise<{ field: string; url: string }>[] = [];

          const uploadFileIfPresent = (file: File | null, fieldName: string) => {
            if (!file) return;
            const promise = (async () => {
              const timestamp = Date.now();
              const fileName = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
              const url = await uploadFile(file, 'talent-documents', fileName);
              return { field: fieldName, url };
            })();
            fileUploadPromises.push(promise);
          };

          uploadFileIfPresent(formData.resumeFile, 'resumeUrl');
          uploadFileIfPresent(formData.passportFile, 'passportUrl');
          uploadFileIfPresent(formData.visaFile, 'visaUrl');
          uploadFileIfPresent(formData.eduCertFile, 'eduCertUrl');
          uploadFileIfPresent(formData.empCertFile, 'empCertUrl');
          uploadFileIfPresent(formData.englishTestFile, 'englishTestUrl');
          uploadFileIfPresent(formData.licenceFile, 'licenceUrl');

          if (fileUploadPromises.length > 0) {
            setUploadProgress(`Uploading ${fileUploadPromises.length} documents to secure cloud storage...`);
          } else {
            setUploadProgress('Preparing application data...');
          }

          const uploadResults = await Promise.all(fileUploadPromises);

          const docUrls: { [key: string]: string } = {
            resumeUrl: '', passportUrl: '', visaUrl: '', eduCertUrl: '', empCertUrl: '', englishTestUrl: '', licenceUrl: ''
          };

          uploadResults.forEach(item => {
            docUrls[item.field] = item.url;
          });

          setUploadProgress('Submitting application...');

          const payload: SignUpTalentDto = {
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            phone: formData.whatsapp || formData.phone,
            location: `${formData.city ? formData.city + ', ' : ''}${formData.countryOfResidence || formData.nationality || ''}`,
            educations: formData.highestQualification || formData.institutionName ? [{
              school: formData.institutionName || 'Not specified',
              degree: [formData.highestQualification, formData.fieldOfStudy].filter(Boolean).join(' - ') || 'Not specified',
              year: formData.graduationYear || new Date().getFullYear().toString(),
            }] : [],
            skills: [formData.preferredRole, formData.preferredIndustry, formData.opportunityType].filter(Boolean) as string[],
            experiences: formData.jobTitle || formData.employerName ? [{
              title: formData.jobTitle || 'Not specified',
              company: formData.employerName || 'Not specified',
              responsibilities: formData.summary || 'Not specified',
            }] : [],
            resumeUrl: docUrls.resumeUrl || undefined,
            avatarUrl: undefined,

            dob: formData.dob, age: formData.age, gender: formData.gender, nationality: formData.nationality,
            countryOfResidence: formData.countryOfResidence, whatsapp: formData.whatsapp, linkedin: formData.linkedin,
            opportunityType: formData.opportunityType, preferredIndustry: formData.preferredIndustry, preferredRole: formData.preferredRole,
            preferredSalary: formData.preferredSalary, startDate: formData.startDate, jobTitle: formData.jobTitle,
            employerName: formData.employerName, employmentCountry: formData.employmentCountry, totalExp: formData.totalExp,
            relevantExp: formData.relevantExp, summary: formData.summary, isEmployed: formData.isEmployed, workedOverseas: formData.workedOverseas,
            overseasCountries: formData.overseasCountries, highestQualification: formData.highestQualification, fieldOfStudy: formData.fieldOfStudy,
            institutionName: formData.institutionName, graduationYear: formData.graduationYear, hasLicences: formData.hasLicences,
            licencesList: formData.licencesList, englishTest: formData.englishTest, overallScore: formData.overallScore, testDate: formData.testDate,
            visaStatus: formData.visaStatus, legalWorkRights: formData.legalWorkRights, openToRelocation: formData.openToRelocation,
            appliedAusVisa: formData.appliedAusVisa, visaTypeApplied: formData.visaTypeApplied, visaRefusal: formData.visaRefusal,
            visaRefusalDetails: formData.visaRefusalDetails, relocateAloneOrFamily: formData.relocateAloneOrFamily, validPassport: formData.validPassport,
            passportExpiry: formData.passportExpiry, medicalBackgroundCheck: formData.medicalBackgroundCheck, criminalConvictions: formData.criminalConvictions,
            criminalDetails: formData.criminalDetails, passportUrl: docUrls.passportUrl, visaUrl: docUrls.visaUrl, eduCertUrl: docUrls.eduCertUrl,
            empCertUrl: docUrls.empCertUrl, englishTestUrl: docUrls.englishTestUrl, licenceUrl: docUrls.licenceUrl,
            declarationTrue: formData.declarationTrue ? 'Yes' : 'No', declarationConsent: formData.declarationConsent ? 'Yes' : 'No'
          };

          await authApi.signUpTalent(payload);
        },
        2200
      );
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Registration Error:', err.response?.data || err);
      const backendMessage = err.response?.data?.message;
      const msg = Array.isArray(backendMessage)
        ? backendMessage.join(', ')
        : backendMessage || err.message || 'Registration failed. Please try again.';
      setSubmitError(msg);
      dispatch(setAuthError(msg));
      scrollToTop();
    } finally {
      setSubmitting(false);
      setUploadProgress('');
    }
  };

  const stepsInfo = [
    { id: 1, title: 'Personal Info', icon: <User className="w-5 h-5 text-rh-teal" /> },
    { id: 2, title: 'Employment Preferences', icon: <Briefcase className="w-5 h-5 text-rh-teal" /> },
    { id: 3, title: 'Current Employment Details', icon: <Globe className="w-5 h-5 text-rh-teal" /> },
    { id: 4, title: 'Education & Qualifications', icon: <GraduationCap className="w-5 h-5 text-rh-teal" /> },
    { id: 5, title: 'Language Proficiency', icon: <Languages className="w-5 h-5 text-rh-teal" /> },
    { id: 6, title: 'Visa & Work Rights', icon: <ShieldCheck className="w-5 h-5 text-rh-teal" /> },
    { id: 7, title: 'Relocation & Availability', icon: <Plane className="w-5 h-5 text-rh-teal" /> },
    { id: 8, title: 'Document Uploads', icon: <Upload className="w-5 h-5 text-rh-teal" /> },
    { id: 9, title: 'Declarations & Submit', icon: <FileCheck className="w-5 h-5 text-rh-teal" /> },
  ];

  /* Render helper functions removed (delegated to components) */


  return (
    <div className="bg-white min-h-screen pt-16 lg:pt-0 flex flex-col lg:flex-row font-sans overflow-x-hidden">
      {/* Left Side: Professional Branding */}
      <aside className="w-full lg:w-[40%] relative flex flex-col justify-between p-6 md:p-10 lg:p-16 overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-100 min-h-[220px] md:min-h-[280px] lg:min-h-screen shrink-0 bg-rh-dark">
        <div className="absolute inset-0 z-0 bg-rh-dark">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 lg:mb-12 mt-2 lg:mt-8 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white mb-2 lg:mb-4 tracking-tight leading-tight">
              Get Your <span className='text-rh-teal-lighter font-medium italic lg:ml-2'>Dream Job!</span>
            </h1>
            <p className="text-gray-200 text-xs sm:text-sm lg:text-base font-normal leading-relaxed max-w-xs mx-auto lg:mx-0 opacity-90">
              Get discovered by top employers across Australia and join the global elite.
            </p>
          </motion.div>

          {/* Desktop Stepper Progress */}
          <div className="hidden lg:block space-y-8 relative mb-8 max-w-xs mx-auto lg:mx-0">
            <div className="absolute left-[23px] top-4 bottom-4 w-[1px] bg-white/10" />
            {stepsInfo.map(s => {
              const isCompleted = isSuccess || step > s.id;
              const isActive = !isSuccess && step === s.id;
              return (
                <div key={s.id} className="flex items-center gap-8 group relative z-10">
                  <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-all duration-500 border-2 shrink-0 ${isActive ? 'bg-rh-teal-lighter border-rh-teal-lighter text-white shadow-xl shadow-rh-teal-lighter/20 scale-110' : isCompleted ? 'bg-rh-teal-lighter/20 border-rh-teal-lighter text-rh-teal-lighter shadow-lg shadow-rh-teal-lighter/5' : 'bg-white/5 border-white/10 text-white/40 group-hover:border-rh-teal-lighter/40'}`}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : s.icon}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 transition-colors ${isActive ? 'text-rh-teal-lighter' : isCompleted ? 'text-rh-teal-lighter opacity-80' : 'text-white/30'}`}>{`Step 0${s.id}`}</span>
                    <span className={`text-base font-bold transition-colors ${isActive ? 'text-white' : isCompleted ? 'text-white/70' : 'text-white/40'}`}>{s.title}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 mt-auto pt-6 border-t border-white/10 hidden lg:flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md shadow-sm flex items-center justify-center border border-white/5 shrink-0">
              <CheckCircle className="w-5 h-5 text-rh-teal-lighter" />
            </div>
            <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest leading-tight">Verified Professional <br /> Registration</p>
          </div>
        </div>
      </aside>

      {/* Right Side: Form Wizard */}
      <main className="flex-1 bg-[#F8F9FA] p-4 md:p-8 lg:p-16 lg:overflow-y-auto custom-scrollbar flex items-center justify-center">
        <div className="w-full max-w-4xl py-4 md:py-8">
          {/* Mobile/Tablet Stepper Header */}
          {!isSuccess && (
            <div className="lg:hidden bg-rh-dark p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-lg mb-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="text-[10px] sm:text-xs font-bold text-rh-teal-lighter uppercase tracking-widest">Step {step} of 9</span>
                  <span className="text-xs sm:text-sm font-bold text-white">{stepsInfo[step - 1]?.title}</span>
                </div>
                <div className="w-full bg-white/20 h-1.5 sm:h-2 rounded-full overflow-hidden">
                  <div className="bg-rh-teal-lighter h-full transition-all duration-300" style={{ width: `${(step / 9) * 100}%` }} />
                </div>
              </div>
            </div>
          )}

          {submitError && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-5 py-4 sm:px-6 sm:py-4 rounded-xl sm:rounded-[24px] text-xs sm:text-sm font-medium mb-6 sm:mb-8 animate-shake shadow-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl sm:rounded-[32px] lg:rounded-[48px] p-8 sm:p-12 lg:p-20 shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-100 text-center"
              >
                <div className="w-24 h-24 bg-rh-teal/10 text-rh-teal rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-rh-teal/10 border border-rh-teal/10">
                  <ShieldCheck className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-rh-teal mb-4 animate-fadeIn">Check your inbox!</h2>
                <p className="text-gray-500 mb-4 text-sm sm:text-lg font-medium max-w-md mx-auto leading-relaxed">
                  We've sent a verification link to your registered email address.
                </p>
                <p className="text-gray-400 mb-10 text-xs sm:text-sm font-medium max-w-md mx-auto">
                  Please verify your email first, then you'll be able to sign in and start tracking your dream job matches.
                </p>
                <Button
                  onClick={() => navigate('/signin')}
                  variant="primary"
                  className="px-12 py-4 bg-rh-teal hover:bg-[#0E8A8F] text-white rounded-2xl shadow-2xl shadow-rh-teal/20 font-bold text-base sm:text-lg w-full sm:w-auto"
                >
                  Go to Sign In
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl sm:rounded-[32px] lg:rounded-[48px] p-5 sm:p-8 lg:p-16 shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-100"
              >
                <div className="mb-6 sm:mb-10 border-b border-gray-50 pb-4 sm:pb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-rh-teal mb-1 sm:mb-2">{stepsInfo[step - 1]?.title}</h2>
                    <p className="text-gray-500 text-xs sm:text-sm lg:text-base font-medium">Please provide accurate details for your application.</p>
                  </div>
                  <div className="hidden sm:flex w-10 h-10 rounded-2xl bg-rh-teal/10 items-center justify-center text-rh-teal font-bold text-sm shrink-0">
                    {step}/9
                  </div>
                </div>

                <div className="space-y-6 sm:space-y-10 mb-8 sm:mb-12">
                    <SignupFormSteps
                      step={step}
                      formData={formData}
                      errors={errors}
                      updateForm={updateForm}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                      isCustomNationality={isCustomNationality}
                      setIsCustomNationality={setIsCustomNationality}
                      isCustomCity={isCustomCity}
                      setIsCustomCity={setIsCustomCity}
                      residenceCountryIso={residenceCountryIso}
                      setResidenceCountryIso={setResidenceCountryIso}
                      residenceStateIso={residenceStateIso}
                      setResidenceStateIso={setResidenceStateIso}
                      countriesData={countriesData}
                      nationalitiesList={nationalitiesList}
                      handleCountryChange={handleCountryChange}
                      handleStateChange={handleStateChange}
                      handleCityChange={handleCityChange}
                      handleFileChange={handleFileChange}
                      experienceYears={experienceYears}
                      uploadProgress={uploadProgress}
                    />
                </div>

                {/* Navigation Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 pt-6 sm:pt-10 border-t border-gray-50">
                  <button type="button" onClick={goBack} disabled={submitting} className="text-gray-400 font-bold hover:text-rh-dark flex items-center justify-center gap-2 transition-colors order-2 sm:order-1 disabled:opacity-50 w-full sm:w-auto py-3 sm:py-0 text-sm sm:text-base">
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Back
                  </button>
                  {step < 9 ? (
                    <Button type="button" onClick={nextStep} variant="primary" className="w-full sm:w-auto px-10 sm:px-12 py-3.5 sm:py-4.5 bg-rh-teal hover:bg-[#0E8A8F] text-white rounded-xl sm:rounded-2xl shadow-xl shadow-rh-teal/10 font-bold text-xs sm:text-base order-1 sm:order-2 text-center justify-center">
                      Continue
                    </Button>
                  ) : (
                    <Button type="button" onClick={() => handleSubmit()} disabled={submitting} variant="primary" className="w-full sm:w-auto px-10 sm:px-12 py-3.5 sm:py-4.5 bg-rh-teal hover:bg-[#0E8A8F] text-white rounded-xl sm:rounded-2xl shadow-xl shadow-rh-teal/20 font-bold text-xs sm:text-base order-1 sm:order-2 flex items-center justify-center gap-2 min-w-[220px]">
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : 'SUBMIT APPLICATION'}
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
