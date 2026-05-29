import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Upload, CheckCircle, User, Briefcase,
  Globe, GraduationCap, CheckCircle2, Languages, ShieldCheck, Plane, FileCheck, Loader2, Eye, EyeOff, AlertCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import { authApi } from '../lib/auth';
import { uploadFile } from '../lib/storage';
import { useAppDispatch } from '../store';
import { setError as setAuthError } from '../store/slices/authSlice';
import { SignUpTalentDto } from '../types/auth';
import { useGlobalLoader } from '../components/ui/GlobalLoader';
import { Country, State, City } from 'country-state-city';
import { nationalitiesList } from '../data';

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

  const handleFileChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
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
      const backendMessage = err.response?.data?.message;
      const msg = Array.isArray(backendMessage)
        ? backendMessage.join(', ')
        : backendMessage || 'Registration failed. Please try again.';
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

  const renderInput = ({ label, field, placeholder, type = "text", required = false }: any) => (
    <div className="space-y-1 sm:space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 block ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={(formData as any)[field]}
        onChange={e => updateForm(field, e.target.value)}
        onClick={type === 'date' ? (e) => {
          try {
            e.currentTarget.showPicker();
          } catch (err) {
            console.warn(err);
          }
        } : undefined}
        onFocus={type === 'date' ? (e) => {
          try {
            e.currentTarget.showPicker();
          } catch (err) {
            console.warn(err);
          }
        } : undefined}
        placeholder={placeholder}
        className={`w-full px-4 py-3 sm:px-5 sm:py-4 bg-[#F4F7FA] border rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 transition-all text-gray-900 text-xs sm:text-sm font-medium placeholder:text-gray-300 [color-scheme:light] ${errors[field] ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-transparent focus:border-rh-teal/20'}`}
      />
      {errors[field] && (
        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors[field]}
        </motion.p>
      )}
    </div>
  );

  const renderSelect = ({ label, field, options, required = false }: any) => {
    const formattedOptions = options.map((o: string) => ({ label: o, value: o }));
    return (
      <div className="space-y-1 sm:space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 block ml-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className={`rounded-xl sm:rounded-2xl border ${errors[field] ? 'border-red-500 bg-red-50/10' : 'border-transparent'}`}>
          <Dropdown
            label=""
            value={(formData as any)[field]}
            onChange={(val: string) => updateForm(field, val)}
            options={formattedOptions}
            placeholder="Select an option"
            searchable={options.length > 8}
          />
        </div>
        {errors[field] && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors[field]}
          </motion.p>
        )}
      </div>
    );
  };

  const renderCustomSelect = ({ label, field, options, value, onChange, required = false }: any) => {
    return (
      <div className="space-y-1 sm:space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 block ml-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className={`rounded-xl sm:rounded-2xl border ${errors[field] ? 'border-red-500 bg-red-50/10' : 'border-transparent'}`}>
          <Dropdown
            label=""
            value={value !== undefined ? value : (formData as any)[field]}
            onChange={onChange ? onChange : (val: string) => updateForm(field, val)}
            options={options}
            placeholder={`Select ${label}`}
            searchable={true}
          />
        </div>
        {errors[field] && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors[field]}
          </motion.p>
        )}
      </div>
    );
  };

  const renderRadioGroup = ({ label, field, options, required = false }: any) => (
    <div className="space-y-1 sm:space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 block ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={`flex flex-wrap gap-2 sm:gap-4 p-1 rounded-2xl border ${errors[field] ? 'border-red-500 bg-red-50/10' : 'border-transparent'}`}>
        {options.map((o: string) => (
          <label key={o} className={`flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border cursor-pointer transition-all ${(formData as any)[field] === o ? 'border-rh-teal bg-rh-teal/5 text-rh-teal' : 'border-gray-200 hover:border-rh-teal/30 text-gray-600'}`}>
            <input type="radio" name={field} value={o} checked={(formData as any)[field] === o} onChange={e => updateForm(field, e.target.value)} className="hidden" />
            <span className="text-xs sm:text-sm font-bold">{o}</span>
          </label>
        ))}
      </div>
      {errors[field] && (
        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors[field]}
        </motion.p>
      )}
    </div>
  );

  const renderFileUpload = ({ label, field, accept = ".pdf,.doc,.docx", required = false }: any) => {
    const hasFile = !!(formData as any)[field];
    return (
      <div className={`border-2 border-dashed rounded-2xl sm:rounded-[24px] p-5 sm:p-6 text-center hover:border-rh-teal/30 hover:bg-white transition-all ${errors[field] ? 'border-red-500 bg-red-50/10' : hasFile ? 'border-emerald-500/40 bg-emerald-50/20' : 'border-gray-200 bg-[#F9FBFF]'
        }`}>
        <label className="cursor-pointer block">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 shadow-sm rounded-xl sm:rounded-[16px] flex items-center justify-center mx-auto mb-2 sm:mb-3 border transition-all ${hasFile ? 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/10' : 'bg-white text-rh-teal border-gray-50'
            }`}>
            {hasFile ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" /> : <Upload className="w-4 h-4 sm:w-5 sm:h-5" />}
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-[#081B2D] mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </h3>
          {hasFile ? (
            <div className="space-y-1.5 animate-fadeIn">
              <p className="text-emerald-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                Selected successfully
              </p>
              <p className="text-rh-teal text-xs font-bold truncate max-w-[200px] mx-auto bg-white/60 px-3 py-1 rounded-xl border border-emerald-100">
                {(formData as any)[field]?.name}
              </p>
            </div>
          ) : (
            <p className="text-gray-400 text-[10px] sm:text-xs mb-2 sm:mb-3">Click to select file</p>
          )}
          <input type="file" className="hidden" accept={accept} onChange={e => handleFileChange(field, e)} />
        </label>
        {errors[field] && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-2 flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors[field]}
          </motion.p>
        )}
      </div>
    );
  };


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
                  {/* SECTION 1 */}
                  {step === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                      {renderInput({ label: "Full Name (As per Passport)", field: "fullName", placeholder: "e.g. John Doe", required: true })}
                      {renderInput({ label: "Email Address", field: "email", placeholder: "john@example.com", type: "email", required: true })}
                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 block ml-1">Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => updateForm('password', e.target.value)} placeholder="At least 8 characters" className={`w-full px-4 py-3 sm:px-5 sm:py-4 bg-[#F4F7FA] border rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 transition-all text-gray-900 text-xs sm:text-sm font-medium placeholder:text-gray-300 ${errors.password ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-transparent focus:border-rh-teal/20'}`} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rh-teal transition-colors">
                            {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                          </button>
                        </div>
                        {errors.password && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.password}
                          </motion.p>
                        )}
                      </div>
                      {renderInput({ label: "Date of Birth", field: "dob", placeholder: "YYYY-MM-DD", type: "date", required: true })}
                      {renderInput({ label: "Age", field: "age", placeholder: "e.g. 28", type: "number" })}
                      {renderSelect({ label: "Gender", field: "gender", options: ["Male", "Female", "Other", "Prefer not to say"] })}
                      {isCustomNationality ? (
                        <div className="space-y-1 sm:space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 block ml-1">
                            Specify Nationality <span className="text-red-500">*</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={formData.nationality}
                              onChange={e => updateForm('nationality', e.target.value)}
                              placeholder="Type nationality..."
                              className={`w-full px-4 py-3 sm:px-5 sm:py-4 bg-[#F4F7FA] border rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 transition-all text-gray-900 text-xs sm:text-sm font-medium placeholder:text-gray-300 ${errors.nationality ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-transparent focus:border-rh-teal/20'}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setIsCustomNationality(false);
                                updateForm('nationality', '');
                              }}
                              className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all"
                            >
                              Reset
                            </button>
                          </div>
                          {errors.nationality && (
                            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.nationality}
                            </motion.p>
                          )}
                        </div>
                      ) : (
                        renderCustomSelect({
                          label: "Nationality",
                          field: "nationality",
                          options: [
                            ...nationalitiesList,
                            { label: "Other (Specify)", value: "Other" }
                          ],
                          value: formData.nationality,
                          onChange: (val: string) => {
                            if (val === 'Other') {
                              setIsCustomNationality(true);
                              updateForm('nationality', '');
                            } else {
                              updateForm('nationality', val);
                            }
                          },
                          required: true
                        })
                      )}
                      {renderCustomSelect({
                        label: "Country of Residence",
                        field: "countryOfResidence",
                        options: countriesData.map(c => ({ label: c.name, value: c.name })),
                        value: formData.countryOfResidence,
                        onChange: handleCountryChange,
                        required: true
                      })}
                      {residenceCountryIso && (State.getStatesOfCountry(residenceCountryIso) || []).length > 0 && (
                        renderCustomSelect({
                          label: "State / Province",
                          field: "state",
                          options: (State.getStatesOfCountry(residenceCountryIso) || []).map(s => ({ label: s.name, value: s.name })),
                          value: (State.getStatesOfCountry(residenceCountryIso) || []).find(s => s.isoCode === residenceStateIso)?.name || '',
                          onChange: handleStateChange,
                          required: false
                        })
                      )}
                      {residenceCountryIso && (
                        isCustomCity || (residenceStateIso ? (City.getCitiesOfState(residenceCountryIso, residenceStateIso) || []).length === 0 : (City.getCitiesOfCountry(residenceCountryIso) || []).length === 0) ? (
                          <div className="space-y-1 sm:space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 block ml-1">
                              City <span className="text-gray-400">(Specify)</span>
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={formData.city}
                                onChange={e => updateForm('city', e.target.value)}
                                placeholder="Type city..."
                                className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 transition-all text-gray-900 text-xs sm:text-sm font-medium placeholder:text-gray-300"
                              />
                              {(residenceStateIso ? (City.getCitiesOfState(residenceCountryIso, residenceStateIso) || []).length > 0 : (City.getCitiesOfCountry(residenceCountryIso) || []).length > 0) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsCustomCity(false);
                                    updateForm('city', '');
                                  }}
                                  className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all"
                                >
                                  List
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          renderCustomSelect({
                            label: "City",
                            field: "city",
                            options: [
                              ...(residenceStateIso ? (City.getCitiesOfState(residenceCountryIso, residenceStateIso) || []) : (City.getCitiesOfCountry(residenceCountryIso) || [])).map(c => ({ label: c.name, value: c.name })),
                              { label: "Other (Specify)", value: "Other" }
                            ],
                            value: formData.city,
                            onChange: handleCityChange,
                            required: false
                          })
                        )
                      )}
                      {renderInput({ label: "WhatsApp Number (with country code)", field: "whatsapp", placeholder: "+971 50 000 0000", type: "tel", required: true })}
                      {renderInput({ label: "LinkedIn Profile URL", field: "linkedin", placeholder: "https://linkedin.com/in/username", type: "url" })}
                    </div>
                  )}

                  {/* SECTION 2 */}
                  {step === 2 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                      <div className="sm:col-span-2">
                        {renderRadioGroup({ label: "What type of opportunity are you looking for?", field: "opportunityType", options: ["Full-Time Onsite", "Remote", "Hybrid", "Contract / Project-Based"], required: true })}
                      </div>
                      {renderInput({ label: "Preferred Industry / Sector", field: "preferredIndustry", placeholder: "e.g. Healthcare, IT, Finance", required: true })}
                      {renderInput({ label: "Preferred Role / Job Title", field: "preferredRole", placeholder: "e.g. Senior Software Engineer", required: true })}
                      {renderInput({ label: "Preferred Salary", field: "preferredSalary", placeholder: "e.g. $80,000 - $100,000 USD/year" })}
                      {renderInput({ label: "Earliest Start Date / Notice Period", field: "startDate", placeholder: "e.g. 30 Days / Immediate" })}
                    </div>
                  )}

                  {/* SECTION 3 */}
                  {step === 3 && (
                    <div className="space-y-6 sm:space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                        {renderRadioGroup({ label: "Are you currently employed?", field: "isEmployed", options: ["Yes", "No"], required: true })}
                        {formData.isEmployed === 'Yes' && (
                          <>
                            {renderInput({ label: "Current Job Title", field: "jobTitle", placeholder: "e.g. Engineering Manager", required: true })}
                            {renderInput({ label: "Current Employer Name", field: "employerName", placeholder: "e.g. Tech Global", required: true })}
                            {renderCustomSelect({
                              label: "Country of Employment",
                              field: "employmentCountry",
                              options: countriesData.map(c => ({ label: c.name, value: c.name })),
                              value: formData.employmentCountry,
                              onChange: (val: string) => updateForm('employmentCountry', val),
                              required: false
                            })}
                            {renderSelect({ label: "Total Years of Experience", field: "totalExp", options: experienceYears, required: true })}
                            {renderSelect({ label: "Relevant Years of Experience", field: "relevantExp", options: experienceYears })}
                          </>
                        )}
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex justify-between items-center ml-1 mb-1 sm:mb-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                            Professional Summary / Key Achievements
                          </label>
                          <span className={`text-[10px] font-bold ${formData.summary.length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
                            {formData.summary.length}/200
                          </span>
                        </div>
                        <textarea
                          rows={4}
                          maxLength={200}
                          value={formData.summary}
                          onChange={e => updateForm('summary', e.target.value)}
                          placeholder="Briefly highlight your core expertise and major achievements..."
                          className={`w-full px-4 py-3 sm:px-5 sm:py-4 bg-[#F4F7FA] border rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 transition-all text-gray-900 text-xs sm:text-sm font-medium placeholder:text-gray-300 resize-none ${errors.summary ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-transparent focus:border-rh-teal/20'}`}
                        />
                        {errors.summary && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.summary}
                          </motion.p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                        {renderRadioGroup({ label: "Have you worked overseas before?", field: "workedOverseas", options: ["Yes", "No"] })}
                        {formData.workedOverseas === "Yes" && renderCustomSelect({
                          label: "Which countries?",
                          field: "overseasCountries",
                          options: countriesData.map(c => ({ label: c.name, value: c.name })),
                          value: formData.overseasCountries,
                          onChange: (val: string) => updateForm('overseasCountries', val),
                          required: false
                        })}
                      </div>
                    </div>
                  )}

                  {/* SECTION 4 */}
                  {step === 4 && (
                    <div className="space-y-6 sm:space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                        {renderSelect({ label: "Highest Qualification Achieved", field: "highestQualification", options: ["High School / Diploma", "Bachelor's Degree", "Master's Degree", "PhD / Doctorate", "Professional Certification"], required: true })}
                        {renderInput({ label: "Field of Study / Major", field: "fieldOfStudy", placeholder: "e.g. Computer Science", required: true })}
                        {renderInput({ label: "Institution Name", field: "institutionName", placeholder: "e.g. Stanford University", required: false })}
                        {renderInput({ label: "Graduation Year", field: "graduationYear", placeholder: "e.g. 2021", type: "number" })}
                        {renderRadioGroup({ label: "Do you hold any professional licences or registrations?", field: "hasLicences", options: ["Yes", "No"] })}
                        {formData.hasLicences === "Yes" && renderInput({ label: "List Licences & Issuing Authorities", field: "licencesList", placeholder: "e.g. CPA (AICPA), PMP (PMI)" })}
                      </div>
                    </div>
                  )}

                  {/* SECTION 5 */}
                  {step === 5 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                      {renderSelect({ label: "Have you taken an English Language Proficiency Test?", field: "englishTest", options: ["IELTS", "TOEFL", "PTE", "OET", "None"], required: true })}
                      {formData.englishTest && formData.englishTest !== "None" && (
                        <>
                          {renderInput({ label: "Overall Score / Band", field: "overallScore", placeholder: "e.g. 7.5" })}
                          {renderInput({ label: "Test Date / Validity", field: "testDate", placeholder: "YYYY-MM-DD", type: "date" })}
                        </>
                      )}
                    </div>
                  )}

                  {/* SECTION 6 */}
                  {step === 6 && (
                    <div className="space-y-6 sm:space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                        {renderInput({ label: "Current Visa / Residency Status", field: "visaStatus", placeholder: "e.g. Employment Pass / Citizen", required: true })}
                        {renderInput({ label: "Legal Work Rights in Target Country", field: "legalWorkRights", placeholder: "e.g. Require Sponsorship / Permanent Resident", required: false })}
                        {renderRadioGroup({ label: "Are you open to relocation?", field: "openToRelocation", options: ["Yes", "No"], required: true })}
                      </div>

                      {/* Australian Visa — conditional below */}
                      <div className="space-y-4">
                        {renderRadioGroup({ label: "Have you applied for an Australian Visa before?", field: "appliedAusVisa", options: ["Yes", "No"] })}
                        {formData.appliedAusVisa === "Yes" && renderInput({ label: "Which Visa Subclass?", field: "visaTypeApplied", placeholder: "e.g. Subclass 482, 189, 190" })}
                      </div>

                      {/* Visa refusal — conditional below */}
                      <div className="space-y-4">
                        {renderRadioGroup({ label: "Have you ever had a visa refusal or cancellation for any country?", field: "visaRefusal", options: ["Yes", "No"] })}
                        {formData.visaRefusal === "Yes" && (
                          <div className="space-y-1 sm:space-y-2">
                            <div className="flex justify-between items-center ml-1 mb-1 sm:mb-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                                Please provide details of the visa refusal/cancellation
                              </label>
                              <span className={`text-[10px] font-bold ${formData.visaRefusalDetails.length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
                                {formData.visaRefusalDetails.length}/200
                              </span>
                            </div>
                            <textarea
                              rows={3}
                              maxLength={200}
                              value={formData.visaRefusalDetails}
                              onChange={e => updateForm('visaRefusalDetails', e.target.value)}
                              placeholder="Explain the reasons and country..."
                              className={`w-full px-4 py-3 sm:px-5 sm:py-4 bg-[#F4F7FA] border rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 transition-all text-gray-900 text-xs sm:text-sm font-medium placeholder:text-gray-300 resize-none ${errors.visaRefusalDetails ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-transparent focus:border-rh-teal/20'}`}
                            />
                            {errors.visaRefusalDetails && (
                              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.visaRefusalDetails}
                              </motion.p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SECTION 7 */}
                  {step === 7 && (
                    <div className="space-y-6 sm:space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                        {renderSelect({ label: "If relocating, will you relocate alone or with family?", field: "relocateAloneOrFamily", options: ["Alone", "With Partner", "With Family (Partner & Children)"], required: true })}
                        {renderRadioGroup({ label: "Do you hold a valid passport?", field: "validPassport", options: ["Yes", "No"] })}
                        {formData.validPassport === "Yes" && renderInput({ label: "Passport Expiry Date", field: "passportExpiry", placeholder: "YYYY-MM-DD", type: "date", required: true })}
                        {renderRadioGroup({ label: "Are you willing to undergo a medical and background check?", field: "medicalBackgroundCheck", options: ["Yes", "No"] })}
                        {renderRadioGroup({ label: "Do you have any criminal convictions?", field: "criminalConvictions", options: ["Yes", "No"] })}
                      </div>
                      {formData.criminalConvictions === "Yes" && (
                        <div className="space-y-1 sm:space-y-2">
                          <div className="flex justify-between items-center ml-1 mb-1 sm:mb-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                              Please provide details of convictions
                            </label>
                            <span className={`text-[10px] font-bold ${formData.criminalDetails.length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
                              {formData.criminalDetails.length}/200
                            </span>
                          </div>
                          <textarea
                            rows={3}
                            maxLength={200}
                            value={formData.criminalDetails}
                            onChange={e => updateForm('criminalDetails', e.target.value)}
                            placeholder="Provide details..."
                            className={`w-full px-4 py-3 sm:px-5 sm:py-4 bg-[#F4F7FA] border rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 transition-all text-gray-900 text-xs sm:text-sm font-medium placeholder:text-gray-300 resize-none ${errors.criminalDetails ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-transparent focus:border-rh-teal/20'}`}
                          />
                          {errors.criminalDetails && (
                            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.criminalDetails}
                            </motion.p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SECTION 8 */}
                  {step === 8 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                      {renderFileUpload({ label: "Resume / CV", field: "resumeFile", required: true })}
                      {renderFileUpload({ label: "Passport Copy (Bio-Data Page)", field: "passportFile", required: true })}
                      {renderFileUpload({ label: "Current Visa / Residency Permit / Work Permit", field: "visaFile", required: true })}
                      {renderFileUpload({ label: "Educational Certificates", field: "eduCertFile", required: false })}
                      {renderFileUpload({ label: "Employment Certificates / Experience Letters", field: "empCertFile", required: false })}
                      {renderFileUpload({ label: "English Test Results", field: "englishTestFile", required: false })}
                      {renderFileUpload({ label: "Professional Licences / Certifications", field: "licenceFile", required: false })}
                    </div>
                  )}

                  {/* SECTION 9 */}
                  {step === 9 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className={`flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl border bg-[#F9FBFF] cursor-pointer hover:border-rh-teal/30 transition-all ${errors.declarationTrue ? 'border-red-500 bg-red-50/10' : 'border-gray-100'}`}>
                          <input type="checkbox" checked={formData.declarationTrue} onChange={e => updateForm('declarationTrue', e.target.checked)} className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-rh-teal rounded border-gray-300 focus:ring-rh-teal/20 shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-gray-600 leading-relaxed">
                            I confirm that the information and documents provided are true and accurate to the best of my knowledge. I understand that submission of this form does not guarantee employment, visa approval, or employer sponsorship. <span className="text-red-500">*</span>
                          </span>
                        </label>
                        {errors.declarationTrue && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.declarationTrue}
                          </motion.p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className={`flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl border bg-[#F9FBFF] cursor-pointer hover:border-rh-teal/30 transition-all ${errors.declarationConsent ? 'border-red-500 bg-red-50/10' : 'border-gray-100'}`}>
                          <input type="checkbox" checked={formData.declarationConsent} onChange={e => updateForm('declarationConsent', e.target.checked)} className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-rh-teal rounded border-gray-300 focus:ring-rh-teal/20 shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-gray-600 leading-relaxed">
                            I consent to Orange Global sharing my profile and supporting documents with potential employers and recruitment partners for assessment purposes. <span className="text-red-500">*</span>
                          </span>
                        </label>
                        {errors.declarationConsent && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.declarationConsent}
                          </motion.p>
                        )}
                      </div>

                      {/* Anti-spam honeypot field (hidden from users, filled by bots) */}
                      <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
                        <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" value={formData.honeypot} onChange={e => updateForm('honeypot', e.target.value)} />
                      </div>

                      {uploadProgress && (
                        <div className="p-4 bg-rh-teal/5 border border-rh-teal/20 rounded-xl sm:rounded-2xl flex items-center gap-3 text-rh-teal font-medium text-xs sm:text-sm animate-pulse">
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin shrink-0" />
                          <span>{uploadProgress}</span>
                        </div>
                      )}
                    </div>
                  )}
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
