import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, GraduationCap, Briefcase, Star,
  Upload, CheckCircle, Shield, Trash2, Plus,
  Settings, LogOut, Camera, FileText, Target, Zap,
  Loader2, Save, Info, TrendingUp, AlertCircle,
  Languages, ShieldCheck, Plane, FileCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { logout, updateProfileSuccess } from '../store/slices/authSlice';
import { authApi } from '../lib/auth';
import { uploadFile } from '../lib/storage';
import Button from '../components/ui/Button';
import PageLoader from '../components/ui/PageLoader';
import { toast } from 'react-hot-toast';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Dropdown from '../components/ui/Dropdown';
import { signUpPositionType } from '../data';
import { Country, State, City } from 'country-state-city';

const toDateInput = (raw: string): string => {
  if (!raw || typeof raw !== "string") return "";
  const s = raw.trim();
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (s.includes("T")) return s.split("T")[0];
  const slashDMY = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
  if (slashDMY) return `${slashDMY[3]}-${slashDMY[2].padStart(2, "0")}-${slashDMY[1].padStart(2, "0")}`;
  const dashDMY = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(s);
  if (dashDMY) return `${dashDMY[3]}-${dashDMY[2].padStart(2, "0")}-${dashDMY[1].padStart(2, "0")}`;
  return "";
};

// --- Schemas ---
const talentUpdateSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  location: z.string().optional(),
  phone: z.string()
    .min(1, 'Phone number is required')
    .refine((val) => val.replace(/\D/g, '').length >= 5, {
      message: 'Phone number must have at least 5 digits',
    }),
  avatarUrl: z.string().optional(),
  resumeUrl: z.string().min(1, 'Resume / CV is required'),
  educations: z.array(z.object({
    school: z.string().min(1, 'School is required'),
    degree: z.string().min(1, 'Degree is required'),
    year: z.string().min(4, 'Valid year required'),
  })),
  skills: z.array(z.string()).max(25, 'You can add a maximum of 25 skills'),
  experiences: z.array(z.object({
    title: z.string().min(1, 'Job title is required'),
    company: z.string().min(1, 'Company is required'),
    responsibilities: z.string().min(10, 'Please describe your role'),
  })),
  dob: z.string().min(1, 'Date of Birth is required'),
  age: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().min(1, 'Nationality is required'),
  countryOfResidence: z.string().min(1, 'Country of Residence is required'),
  city: z.string().optional(),
  state: z.string().optional(),
  whatsapp: z.string()
    .min(1, 'WhatsApp number is required')
    .refine((val) => val.replace(/\D/g, '').length >= 5, {
      message: 'WhatsApp number must have at least 5 digits',
    }),
  linkedin: z.string().optional(),
  opportunityType: z.string().min(1, 'Please select an opportunity type'),
  preferredIndustry: z.string().min(1, 'Preferred Industry is required'),
  preferredRole: z.string().min(1, 'Preferred Role is required'),
  preferredSalary: z.string().optional(),
  startDate: z.string().optional(),
  jobTitle: z.string().optional(),
  employerName: z.string().optional(),
  employmentCountry: z.string().optional(),
  totalExp: z.string().optional(),
  relevantExp: z.string().optional(),
  summary: z.string().optional(),
  isEmployed: z.string().min(1, 'Please indicate if you are currently employed'),
  workedOverseas: z.string().optional(),
  overseasCountries: z.string().optional(),
  highestQualification: z.string().min(1, 'Please select your highest qualification'),
  fieldOfStudy: z.string().min(1, 'Field of Study is required'),
  institutionName: z.string().min(1, 'Institution Name is required'),
  graduationYear: z.string().optional(),
  hasLicences: z.string().optional(),
  licencesList: z.string().optional(),
  englishTest: z.string().min(1, 'Please select your English test status'),
  overallScore: z.string().optional(),
  testDate: z.string().optional(),
  visaStatus: z.string().min(1, 'Current Visa / Residency Status is required'),
  legalWorkRights: z.string().min(1, 'Legal Work Rights information is required'),
  openToRelocation: z.string().min(1, 'Please indicate if you are open to relocation'),
  appliedAusVisa: z.string().optional(),
  visaTypeApplied: z.string().optional(),
  visaRefusal: z.string().optional(),
  visaRefusalDetails: z.string().optional(),
  relocateAloneOrFamily: z.string().optional(),
  validPassport: z.string().min(1, 'Please indicate if you hold a valid passport'),
  passportExpiry: z.string().optional(),
  medicalBackgroundCheck: z.string().optional(),
  criminalConvictions: z.string().optional(),
  criminalDetails: z.string().optional(),
  passportUrl: z.string().min(1, 'Passport document is required'),
  visaUrl: z.string().min(1, 'Visa / Residency permit document is required'),
  eduCertUrl: z.string().optional(),
  empCertUrl: z.string().optional(),
  englishTestUrl: z.string().optional(),
  licenceUrl: z.string().optional(),
  declarationTrue: z.string().optional(),
  declarationConsent: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.isEmployed === 'Yes') {
    if (!data.jobTitle || !data.jobTitle.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Current Job Title is required',
        path: ['jobTitle'],
      });
    }
    if (!data.employerName || !data.employerName.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Current Employer Name is required',
        path: ['employerName'],
      });
    }
    if (!data.totalExp || !data.totalExp.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Total Years of Experience is required',
        path: ['totalExp'],
      });
    }
  }
  if (data.validPassport === 'Yes') {
    if (!data.passportExpiry || !data.passportExpiry.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passport Expiry Date is required',
        path: ['passportExpiry'],
      });
    }
  }
});

const employerUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  businessPhone: z.string()
    .min(1, 'Business phone is required')
    .refine((val) => val.replace(/\D/g, '').length >= 5, {
      message: 'Business phone must have at least 5 digits',
    }),
  companyLogo: z.string().optional(),
  companyName: z.string().min(2, 'Company name is required'),
  jobTitle: z.string().min(2, 'Your job title is required'),
  jobTitleToHire: z.string().min(2, 'Job title to hire is required'),
  zipCode: z.string().min(2, 'Zip code is required'),
  positionType: z.string().min(1, 'Please select a position type'),
});

type TalentUpdateData = z.infer<typeof talentUpdateSchema>;
type EmployerUpdateData = z.infer<typeof employerUpdateSchema>;

const formatDateBeautifully = (dateStr: any): string => {
  if (!dateStr) return 'Not specified';

  if (typeof dateStr !== 'string' && !(dateStr instanceof Date)) return 'Not specified';

  const str = typeof dateStr === 'string' ? dateStr.trim() : '';

  if (str && !/\d/.test(str)) {
    return str;
  }

  try {
    let dateObj: Date;

    const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (dmyMatch) {
      const day = parseInt(dmyMatch[1], 10);
      const month = parseInt(dmyMatch[2], 10) - 1;
      const year = parseInt(dmyMatch[3], 10);
      dateObj = new Date(year, month, day);
    } else {
      dateObj = new Date(dateStr);
    }

    if (isNaN(dateObj.getTime())) {
      return typeof dateStr === 'string' ? dateStr : (dateStr instanceof Date ? dateStr.toLocaleDateString() : 'Not specified');
    }

    const day = dateObj.getDate();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    return `${day} ${month} ${year}`;
  } catch (e) {
    return typeof dateStr === 'string' ? dateStr : (dateStr instanceof Date ? dateStr.toLocaleDateString() : 'Not specified');
  }
};

const calculateDynamicProfileScore = (profileData: any): number => {
  if (!profileData) return 0;

  let score = 0;

  // 1. Personal & Contact Details (Weight: 20)
  const personalFields = [
    profileData.fullName,
    profileData.dob,
    profileData.nationality,
    profileData.countryOfResidence
  ];
  const personalFilledCount = personalFields.filter(Boolean).length;
  score += (personalFilledCount / personalFields.length) * 20;

  // 2. Job Preferences / Employment Preferences (Weight: 15)
  const prefFields = [
    profileData.opportunityType,
    profileData.preferredIndustry,
    profileData.preferredRole
  ];
  const prefFilledCount = prefFields.filter(Boolean).length;
  score += (prefFilledCount / prefFields.length) * 15;

  // 3. Current Employment & History (Weight: 15)
  if (profileData.isEmployed === 'Yes') {
    const empFields = [
      profileData.jobTitle,
      profileData.employerName,
      profileData.totalExp
    ];
    const empFilledCount = empFields.filter(Boolean).length;
    score += (empFilledCount / empFields.length) * 15;
  } else if (profileData.isEmployed === 'No') {
    score += 15;
  } else {
    score += 5; // Partial credit
  }

  // 4. Expertise & Skills (Weight: 15)
  if (profileData.skills && profileData.skills.length > 0) {
    if (profileData.skills.length >= 4) {
      score += 15;
    } else {
      score += 8; // Partial score for 1-3 skills
    }
  }

  // 5. Education & Qualifications (Weight: 15)
  const eduFields = [
    profileData.highestQualification,
    profileData.fieldOfStudy,
    profileData.institutionName
  ];
  const eduFilledCount = eduFields.filter(Boolean).length;
  score += (eduFilledCount / eduFields.length) * 15;

  // 6. Resumes (Weight: 20)
  if (profileData.resumes && profileData.resumes.length > 0) {
    score += 20;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
};

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

  const [residenceCountryIso, setResidenceCountryIso] = useState<string>('');
  const [residenceStateIso, setResidenceStateIso] = useState<string>('');
  const [isCustomCity, setIsCustomCity] = useState<boolean>(false);
  const [isCustomNationality, setIsCustomNationality] = useState<boolean>(false);

  const [openSection, setOpenSection] = useState<string>('personal');
  const [selectedDoc, setSelectedDoc] = useState<{ url: string; title: string } | null>(null);
  const [deletingResumeId, setDeletingResumeId] = useState<string | null>(null);
  const [docUploadStates, setDocUploadStates] = useState<Record<string, 'success' | 'failed'>>({});
  const [avatarFailed, setAvatarFailed] = useState(false);

  const handleDocumentUpload = async (field: string, file: File, folder: string) => {
    try {
      setSaving(true);
      const timestamp = Date.now();
      const fileName = `${user?.id}-${timestamp}-${file.name.replace(/\s+/g, '-')}`;
      const url = await uploadFile(file, folder, fileName);
      talentForm.setValue(field as any, url, { shouldDirty: true });
      setDocUploadStates(prev => ({ ...prev, [field]: 'success' }));
      toast.success('Document uploaded successfully!');
    } catch (err: any) {
      setDocUploadStates(prev => ({ ...prev, [field]: 'failed' }));
      toast.error('Failed to upload document: ' + (err.message || err));
    } finally {
      setSaving(false);
    }
  };

  const renderEditInput = (label: string, name: string, placeholder?: string, type: string = "text", required: boolean = false) => {
    const isPhoneNumber = name === 'phone' || name === 'whatsapp' || name === 'businessPhone';
    const formToUse = isTalent ? talentForm : employerForm;
    const error = (formToUse.formState.errors as any)[name];
    return (
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
        <input
          type={type}
          placeholder={placeholder}
          {...(isTalent
            ? talentForm.register(name as any, isPhoneNumber ? {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = e.target.value.replace(/[^\d+\s\-]/g, '');
              }
            } : undefined)
            : employerForm.register(name as any, isPhoneNumber ? {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = e.target.value.replace(/[^\d+\s\-]/g, '');
              }
            } : undefined)
          )}
          onClick={type === "date" ? (e) => {
            try {
              e.currentTarget.showPicker();
            } catch (err) { }
          } : undefined}
          onFocus={type === "date" ? (e) => {
            try {
              e.currentTarget.showPicker();
            } catch (err) { }
          } : undefined}
          className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border ${error ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all font-medium dark:[color-scheme:dark]`}
        />
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error.message}
          </motion.p>
        )}
      </div>
    );
  };

  const renderEditSelect = (label: string, name: string, options: string[], required: boolean = false) => {
    const error = (talentForm.formState.errors as any)[name];
    return (
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
        <div className={`rounded-2xl border ${error ? 'border-red-500 bg-red-50/10' : 'border-transparent'}`}>
          <Controller
            name={name as any}
            control={talentForm.control}
            render={({ field }) => (
              <Dropdown
                options={options.map(o => ({ label: o, value: o }))}
                value={field.value || ''}
                onChange={field.onChange}
                className="border-transparent bg-[#F4F7FA] focus:bg-white"
              />
            )}
          />
        </div>
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error.message}
          </motion.p>
        )}
      </div>
    );
  };

  const renderEditRadio = (label: string, name: string, options: string[], required: boolean = false) => {
    const error = (talentForm.formState.errors as any)[name];
    return (
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
        <Controller
          name={name as any}
          control={talentForm.control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-3">
              {options.map(o => (
                <button
                  key={o}
                  type="button"
                  onClick={() => field.onChange(o)}
                  className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border text-sm font-bold transition-all ${field.value === o
                      ? 'border-rh-teal bg-rh-teal/5 text-rh-teal'
                      : error
                        ? 'border-red-300 hover:border-red-400 text-gray-600 bg-white'
                        : 'border-gray-200 hover:border-rh-teal/30 text-gray-600 bg-white'
                    }`}
                >
                  {o}
                </button>
              ))}
            </div>
          )}
        />
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error.message}
          </motion.p>
        )}
      </div>
    );
  };

  const renderEditTextarea = (label: string, name: string, placeholder?: string, rows: number = 3, required: boolean = false) => {
    const error = (talentForm.formState.errors as any)[name];
    return (
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
        <textarea
          rows={rows}
          placeholder={placeholder}
          {...talentForm.register(name as any)}
          className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border ${error ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all font-medium resize-none`}
        />
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error.message}
          </motion.p>
        )}
      </div>
    );
  };

  const renderEditDocUpload = (label: string, name: string, folder: string, required: boolean = false, accept: string = ".pdf,.doc,.docx,.jpg,.jpeg,.png") => {
    const url = talentForm.watch(name as any);
    const inputId = `doc-upload-${name}`;
    const error = (talentForm.formState.errors as any)[name];
    const sessionState = docUploadStates[name] || 'idle';

    let cardClass = 'border-rh-teal/5 bg-[#F9FBFF]';
    let blurClass = 'bg-rh-teal/5';
    let iconClass = 'bg-white text-rh-teal border-gray-50';
    let iconElement = <FileText className="w-7 h-7" />;
    let textElement = url ? (
      <p className="text-xs text-gray-500 font-medium">Update your uploaded {label.toLowerCase()} document here</p>
    ) : (
      <p className="text-xs text-gray-500 font-medium">No document uploaded yet</p>
    );
    let buttonClass = 'border-rh-teal/10 hover:border-rh-teal hover:bg-rh-teal hover:text-white text-rh-teal';
    let buttonText = url ? 'Update' : 'Upload';

    if (error) {
      cardClass = 'border-red-500 bg-red-50/10';
      blurClass = 'bg-red-500/5';
    } else if (sessionState === 'success') {
      cardClass = 'border-emerald-500/30 bg-emerald-50/20';
      blurClass = 'bg-emerald-500/5';
      iconClass = 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/10';
      iconElement = <CheckCircle className="w-7 h-7 animate-pulse" />;
      textElement = (
        <p className="text-emerald-600 text-xs font-bold flex items-center gap-1.5 mt-0.5 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Document uploaded successfully
        </p>
      );
      buttonClass = 'border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white text-emerald-600';
      buttonText = 'Update';
    } else if (sessionState === 'failed') {
      cardClass = 'border-red-500 bg-red-50/10';
      blurClass = 'bg-red-500/5';
      iconClass = 'bg-red-500 text-white border-red-500 shadow-red-500/10';
      iconElement = <AlertCircle className="w-7 h-7" />;
      textElement = (
        <p className="text-red-600 text-xs font-bold flex items-center gap-1.5 mt-0.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" /> Upload failed. Please try again.
        </p>
      );
      buttonClass = 'border-red-500/20 hover:border-red-500 hover:bg-red-500 hover:text-white text-red-600';
      buttonText = 'Try Again';
    }

    return (
      <div className="space-y-1 w-full animate-fadeIn">
        <div className={`rounded-[2rem] p-8 border relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 transition-all ${cardClass}`}>
          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none ${blurClass}`} />

          <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto">
            <div className={`w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center border shrink-0 transition-all ${iconClass}`}>
              {iconElement}
            </div>
            <div>
              <h4 className="text-lg font-bold text-rh-teal mb-0.5">
                {label} {required && <span className="text-red-500">*</span>}
              </h4>
              {textElement}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mt-6 sm:mt-0 relative z-10">
            <input
              id={inputId}
              type="file"
              className="hidden"
              accept={accept}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  await handleDocumentUpload(name, file, folder);
                }
              }}
            />
            <Button
              type="button"
              onClick={() => document.getElementById(inputId)?.click()}
              variant="outline"
              className={`w-full sm:w-auto px-6 py-3 border-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center ${buttonClass}`}
            >
              <Upload className="w-4 h-4 mr-2" /> {buttonText}
            </Button>
            {url && (
              <button
                type="button"
                onClick={() => setSelectedDoc({ url, title: label })}
                className="w-full sm:w-auto px-6 py-3 bg-white text-rh-teal rounded-xl font-bold text-sm shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Target className="w-4 h-4" /> View
              </button>
            )}
          </div>
        </div>
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error.message as string}
          </motion.p>
        )}
      </div>
    );
  };

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

  const watchedDob = talentForm.watch('dob');
  useEffect(() => {
    if (watchedDob) {
      const birthDateVal = toDateInput(watchedDob);
      if (birthDateVal) {
        const birthDate = new Date(birthDateVal);
        if (!isNaN(birthDate.getTime())) {
          const today = new Date();
          let computedAge = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            computedAge--;
          }
          if (computedAge >= 0) {
            const currentAge = talentForm.getValues('age');
            if (currentAge !== computedAge.toString()) {
              talentForm.setValue('age', computedAge.toString(), { shouldDirty: true, shouldValidate: true });
            }
          }
        }
      }
    } else {
      const currentAge = talentForm.getValues('age');
      if (currentAge) {
        talentForm.setValue('age', '', { shouldDirty: true, shouldValidate: true });
      }
    }
  }, [watchedDob, talentForm]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await authApi.getMe();
      console.log("Data: ", data);
      setProfile(data.profile);
      console.log("Profile: ", profile);

      if (data.role === 'TALENT') {
        const p = data.profile || {};
        const locationString = p.location && typeof p.location === 'object'
          ? `${p.location.city || ''}${p.location.city && p.location.country ? ', ' : ''}${p.location.country || ''}`
          : (p.location || '');

        const countryName = p.location && typeof p.location === 'object' ? (p.location.country || '') : (p.countryOfResidence || '');
        const stateName = p.location && typeof p.location === 'object' ? (p.location.state || '') : '';
        const cityName = p.location && typeof p.location === 'object' ? (p.location.city || '') : '';

        // Find country IsoCode
        const countriesList = Country.getAllCountries();
        const countryObj = countriesList.find(c => c.name === countryName);
        const cIso = countryObj ? countryObj.isoCode : '';
        setResidenceCountryIso(cIso);

        // Find state IsoCode
        let sIso = '';
        if (cIso && stateName) {
          const statesList = State.getStatesOfCountry(cIso);
          const stateObj = statesList.find(s => s.name === stateName);
          sIso = stateObj ? stateObj.isoCode : '';
        }
        setResidenceStateIso(sIso);

        // Check if city is custom
        if (cIso && cityName) {
          const citiesList = sIso
            ? City.getCitiesOfState(cIso, sIso)
            : City.getCitiesOfCountry(cIso);
          const cityExists = (citiesList || []).some(c => c.name === cityName);
          setIsCustomCity(!cityExists);
        } else {
          setIsCustomCity(false);
        }

        const nationalityName = p.nationality || '';
        const nationalityExists = countriesList.some(c => c.name === nationalityName);
        setIsCustomNationality(nationalityName ? !nationalityExists : false);

        talentForm.reset({
          fullName: p.fullName || '',
          location: locationString,
          phone: p.phone || '',
          avatarUrl: p.avatarUrl || '',
          resumeUrl: p.resumeUrl || '',
          educations: p.educations || [],
          skills: p.skills || [],
          experiences: p.experiences || [],
          dob: toDateInput(p.dob || ''),
          age: p.age || '',
          gender: p.gender || '',
          nationality: p.nationality || '',
          countryOfResidence: p.countryOfResidence || '',
          city: cityName,
          state: stateName,
          whatsapp: p.whatsapp || '',
          linkedin: p.linkedin || '',
          opportunityType: p.opportunityType || '',
          preferredIndustry: p.preferredIndustry || '',
          preferredRole: p.preferredRole || '',
          preferredSalary: p.preferredSalary || '',
          startDate: p.startDate || '',
          jobTitle: p.jobTitle || '',
          employerName: p.employerName || '',
          employmentCountry: p.employmentCountry || '',
          totalExp: p.totalExp || '',
          relevantExp: p.relevantExp || '',
          summary: p.summary || '',
          isEmployed: p.isEmployed || '',
          workedOverseas: p.workedOverseas || '',
          overseasCountries: p.overseasCountries || '',
          highestQualification: p.highestQualification || '',
          fieldOfStudy: p.fieldOfStudy || '',
          institutionName: p.institutionName || '',
          graduationYear: p.graduationYear || '',
          hasLicences: p.hasLicences || '',
          licencesList: p.licencesList || '',
          englishTest: p.englishTest || '',
          overallScore: p.overallScore || '',
          testDate: p.testDate || '',
          visaStatus: p.visaStatus || '',
          legalWorkRights: p.legalWorkRights || '',
          openToRelocation: p.openToRelocation || '',
          appliedAusVisa: p.appliedAusVisa || '',
          visaTypeApplied: p.visaTypeApplied || '',
          visaRefusal: p.visaRefusal || '',
          visaRefusalDetails: p.visaRefusalDetails || '',
          relocateAloneOrFamily: p.relocateAloneOrFamily || '',
          validPassport: p.validPassport || '',
          passportExpiry: toDateInput(p.passportExpiry || ''),
          medicalBackgroundCheck: p.medicalBackgroundCheck || '',
          criminalConvictions: p.criminalConvictions || '',
          criminalDetails: p.criminalDetails || '',
          passportUrl: p.passportUrl || '',
          visaUrl: p.visaUrl || '',
          eduCertUrl: p.eduCertUrl || '',
          empCertUrl: p.empCertUrl || '',
          englishTestUrl: p.englishTestUrl || '',
          licenceUrl: p.licenceUrl || '',
          declarationTrue: p.declarationTrue || '',
          declarationConsent: p.declarationConsent || '',
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
      if (isTalent) {
        data.location = `${data.city ? data.city + ', ' : ''}${data.countryOfResidence || ''}`;
      }
      await authApi.updateProfile(data);

      // Update local Redux state for the header/navbar
      const nameUpdate = isTalent ? data.fullName : `${data.firstName} ${data.lastName}`;
      const avatarUpdate = isTalent ? data.avatarUrl : data.companyLogo;
      dispatch(updateProfileSuccess({ fullName: nameUpdate, avatarUrl: avatarUpdate }));

      toast.success('Profile updated successfully!');
      await fetchProfile();
      setActiveTab('overview');
    } catch (err: any) {
      console.error('Update failed', err);
      toast.error(err.response?.data?.message || 'Failed to update profile. Please verify that all required fields and documents are completed.');
    } finally {
      setSaving(false);
    }
  };

  const onUpdateError = (errors: any) => {
    console.error('Validation errors:', errors);
    toast.error('Please check all sections. Some required details or documents are missing.');

    if (isTalent) {
      const errorKeys = Object.keys(errors);
      if (errorKeys.length > 0) {
        const firstError = errorKeys[0];
        const fieldToSection: Record<string, string> = {
          fullName: 'personal',
          dob: 'personal',
          age: 'personal',
          gender: 'personal',
          nationality: 'personal',
          countryOfResidence: 'personal',
          whatsapp: 'personal',
          linkedin: 'personal',

          opportunityType: 'preferences',
          preferredIndustry: 'preferences',
          preferredRole: 'preferences',
          preferredSalary: 'preferences',
          startDate: 'preferences',

          isEmployed: 'current',
          jobTitle: 'current',
          employerName: 'current',
          totalExp: 'current',
          summary: 'current',

          skills: 'skills',

          highestQualification: 'education',
          fieldOfStudy: 'education',
          institutionName: 'education',
          graduationYear: 'education',
          hasLicences: 'education',

          englishTest: 'language',
          overallScore: 'language',

          relocateAloneOrFamily: 'relocation',
          validPassport: 'relocation',
          passportExpiry: 'relocation',
          medicalBackgroundCheck: 'relocation',
          criminalConvictions: 'relocation',

          resumeUrl: 'documents',
          passportUrl: 'documents',
          visaUrl: 'documents',
          eduCertUrl: 'documents',
          empCertUrl: 'documents',
          englishTestUrl: 'documents',
          licenceUrl: 'documents',
        };

        const targetSection = fieldToSection[firstError];
        if (targetSection) {
          setOpenSection(targetSection);
          setTimeout(() => {
            const firstErrorEl = document.getElementsByName(firstError)[0] || document.getElementById('doc-upload-' + firstError);
            if (firstErrorEl) {
              firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 150);
        }
      }
    }
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if ((profile?.resumes?.length || 0) >= 5) {
        toast.error('Maximum 5 resumes allowed. Please delete an existing resume first.');
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
        toast.success('Resume uploaded successfully!');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to upload resume');
      } finally {
        setResumeExtracting(false);
      }
    }
  };

  const handleSetDefaultResume = async (resumeId: string) => {
    try {
      await authApi.setDefaultResume(resumeId);
      await fetchProfile();
      toast.success('Default resume set successfully!');
    } catch (err) {
      toast.error('Failed to set default resume');
    }
  };

  const handleDeleteResume = (resumeId: string) => {
    setDeletingResumeId(resumeId);
  };

  const confirmDeleteResume = async () => {
    if (!deletingResumeId) return;
    try {
      setSaving(true);
      await authApi.deleteResume(deletingResumeId);
      await fetchProfile();
      toast.success('Resume deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete resume');
    } finally {
      setSaving(false);
      setDeletingResumeId(null);
    }
  };

  const addSkill = () => {
    const newSkill = skillInput.trim();
    if (!newSkill) return;
    if (watchedSkills.length >= 25) {
      toast.error('You can add a maximum of 25 skills.');
      return;
    }
    if (watchedSkills.includes(newSkill)) {
      toast.error('This skill is already added.');
      return;
    }
    talentForm.setValue('skills', [...watchedSkills, newSkill], { shouldValidate: true });
    setSkillInput('');
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
      const folder = user?.role === 'TALENT' ? 'profile-pictures' : 'company-logo';
      const url = await uploadFile(file, folder, fileName);

      // Update both forms just in case
      talentForm.setValue('avatarUrl', url);
      employerForm.setValue('companyLogo', url);

      // Save to backend immediately or wait for form submit?
      // User expected it to be "allowed", usually immediate is better for profile pics
      await authApi.updateProfile({ avatarUrl: url, companyLogo: url });
      dispatch(updateProfileSuccess({ avatarUrl: url }));
      setAvatarFailed(false);

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
    return <PageLoader fullScreen={true} message="Loading Profile..." subMessage="Fetching your details" />;
  }

  const completion = isTalent ? calculateDynamicProfileScore(profile) : (profile?.profileScore || 90);

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
                {(profile?.avatarUrl || profile?.companyLogo) && !avatarFailed ? (
                  <img
                    src={profile.avatarUrl || profile.companyLogo}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarFailed(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-rh-teal flex items-center justify-center text-white font-bold text-5xl sm:text-6xl shadow-inner animate-fadeIn">
                    {(isTalent ? profile?.fullName : `${profile?.firstName} ${profile?.lastName}` || user?.email || 'U')[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 p-4 bg-rh-red text-white rounded-2xl shadow-xl hover:bg-[#B41419] transition-all hover:scale-110 cursor-pointer z-30">
                <Camera className="w-5 h-5" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
              </label>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-rh-teal tracking-tight">
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

              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-gray-500 font-medium mt-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-rh-red" />
                  <span className="text-sm">{user?.email || profile?.workEmail || profile?.businessEmail}</span>
                </div>
                {(profile?.phone || profile?.businessPhone) && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-rh-red" />
                    <span className="text-sm">{profile?.phone || profile?.businessPhone}</span>
                  </div>
                )}
                {(profile?.jobTitle || profile?.preferredRole) && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-rh-red" />
                    <span className="text-sm">{profile?.jobTitle || profile?.preferredRole}</span>
                  </div>
                )}
                {(profile?.location || profile?.zipCode) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rh-red" />
                    <span className="text-sm">
                      {isTalent
                        ? (profile?.location && typeof profile.location === 'object'
                          ? `${profile.location.city || ''}, ${profile.location.country || ''}`
                          : (profile?.location || 'Not specified'))
                        : (profile?.zipCode || 'Not specified')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-rh-teal rounded-[2rem] p-6 sm:p-8 text-white min-w-[15rem] w-full lg:w-auto shadow-2xl shadow-rh-teal/20">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/60">Profile Strength</h4>
                <Shield className="w-5 h-5 text-rh-red" />
              </div>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl sm:text-5xl font-bold tracking-tighter">{completion}%</span>
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
            <div className="bg-white rounded-[32px] p-3 sm:p-4 shadow-sm border border-gray-100 space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'overview' ? 'bg-rh-teal text-white shadow-xl shadow-rh-teal/10' : 'text-gray-500 hover:bg-rh-light hover:text-rh-teal'}`}
              >
                <User className="w-5 h-5" /> Profile Overview
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className={`w-full flex items-center gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'edit' ? 'bg-rh-teal text-white shadow-xl shadow-rh-teal/10' : 'text-gray-500 hover:bg-rh-light hover:text-rh-teal'}`}
              >
                <Settings className="w-5 h-5" /> Edit Profile
              </button>
              {isTalent && (
                <button
                  onClick={() => setActiveTab('resume')}
                  className={`w-full flex items-center gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'resume' ? 'bg-rh-teal text-white shadow-xl shadow-rh-teal/10' : 'text-gray-500 hover:bg-rh-light hover:text-rh-teal'}`}
                >
                  <FileText className="w-5 h-5" /> Resume & Score
                </button>
              )}
              <div className="h-px bg-gray-50 my-4" />
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl text-rh-red font-bold text-sm hover:bg-red-50 transition-all"
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
                              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-rh-teal hover:underline break-all block">
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
                          {profile?.englishTest && profile.englishTest !== 'None / English is Native Language' && (
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
                              <p className="text-base font-bold text-rh-teal">
                                {[profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || 'Not specified'}
                              </p>
                            </div>
                            <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Job Title</p>
                              <p className="text-base font-bold text-rh-teal">{profile?.jobTitle || 'Not specified'}</p>
                            </div>
                            <div className="p-4 sm:p-6 bg-[#F9FBFF] rounded-3xl border border-gray-50">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Job Title to Hire</p>
                              <p className="text-base font-bold text-rh-teal">{profile?.jobTitleToHire || 'Not specified'}</p>
                            </div>
                            <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Business Email</p>
                              <p className="text-base font-bold text-rh-teal">{profile?.businessEmail || user?.email || 'Not specified'}</p>
                            </div>
                            <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Business Phone</p>
                              <p className="text-base font-bold text-rh-teal">{profile?.businessPhone || 'Not specified'}</p>
                            </div>
                          </div>
                        </section>

                        {/* Company Profile Card */}
                        <section className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100 animate-fadeIn">
                          <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-rh-teal flex items-center gap-2 sm:gap-3">
                              <Briefcase className="w-6 h-6 text-rh-red" /> Company Profile
                            </h3>
                          </div>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="p-4 sm:p-6 bg-rh-light/30 rounded-3xl border border-gray-50">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Company Name</p>
                              <p className="text-base font-bold text-rh-teal">{profile?.companyName || 'Not specified'}</p>
                            </div>
                            <div className="p-4 sm:p-6 bg-[#F9FBFF] rounded-3xl border border-gray-50">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Position Type</p>
                              <p className="text-base font-bold text-rh-teal">{profile?.positionType || 'Not specified'}</p>
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
              )}

              {activeTab === 'edit' && (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-[2rem] sm:rounded-[40px] p-6 sm:p-10 shadow-sm border border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 border-b border-gray-50 pb-6">
                    <h3 className="text-2xl font-bold text-rh-teal">Edit Profile Information</h3>
                    <div className="flex items-center gap-2 text-rh-red text-xs font-bold uppercase tracking-widest self-start sm:self-auto">
                      <Info className="w-4 h-4 shrink-0" />
                      Changes will be saved to your profile
                    </div>
                  </div>

                  {isTalent ? (
                    <form onSubmit={talentForm.handleSubmit(onUpdateSubmit, onUpdateError)} className="space-y-10">
                      <input type="hidden" {...talentForm.register('avatarUrl')} />
                      <input type="hidden" {...talentForm.register('resumeUrl')} />

                      {/* Accordion Wrapper */}
                      <div className="space-y-6">
                        {/* 1. Personal & Contact Details */}
                        <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm bg-white">
                          <button
                            type="button"
                            onClick={() => setOpenSection(openSection === 'personal' ? '' : 'personal')}
                            className="w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 bg-gray-50/50 hover:bg-gray-50 transition-all font-bold text-rh-teal text-base border-b border-gray-100/50"
                          >
                            <span className="flex items-center gap-3">
                              <User className="w-5 h-5 text-rh-red" /> 1. Personal & Contact Details
                            </span>
                            <span className="text-xl text-gray-400">{openSection === 'personal' ? '−' : '+'}</span>
                          </button>
                          {openSection === 'personal' && (
                            <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white animate-fadeIn">
                              <div className="grid md:grid-cols-2 gap-6">
                                {renderEditInput("Full Name (As per Passport)", "fullName", undefined, "text", true)}
                                {renderEditInput("Phone Number", "phone", undefined, "text", true)}
                                {renderEditInput("Date of Birth", "dob", "YYYY-MM-DD", "date", true)}
                                {renderEditInput("Age", "age", "e.g. 28")}
                                {renderEditSelect("Gender", "gender", ["Male", "Female", "Other", "Prefer not to say"])}

                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nationality<span className="text-red-500 ml-0.5">*</span></label>
                                  <Controller
                                    name="nationality"
                                    control={talentForm.control}
                                    render={({ field }) => {
                                      const countries = Country.getAllCountries();
                                      const options = [
                                        ...countries.map(c => ({ label: c.name, value: c.name })),
                                        { label: 'Other (Specify)', value: 'Other' }
                                      ];
                                      return (
                                        <div className="space-y-3">
                                          <div className={`rounded-2xl border ${talentForm.formState.errors.nationality ? 'border-red-500 bg-red-50/10' : 'border-transparent'}`}>
                                            <Dropdown
                                              options={options}
                                              value={isCustomNationality ? 'Other' : field.value || ''}
                                              onChange={(val) => {
                                                if (val === 'Other') {
                                                  setIsCustomNationality(true);
                                                  field.onChange('');
                                                } else {
                                                  setIsCustomNationality(false);
                                                  field.onChange(val);
                                                }
                                              }}
                                              searchable={true}
                                              placeholder="Select Nationality"
                                              className="border-transparent bg-[#F4F7FA] focus:bg-white"
                                            />
                                          </div>
                                          {isCustomNationality && (
                                            <input
                                              type="text"
                                              value={field.value || ''}
                                              onChange={(e) => field.onChange(e.target.value)}
                                              placeholder="Enter custom nationality"
                                              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all font-medium"
                                            />
                                          )}
                                        </div>
                                      );
                                    }}
                                  />
                                  {talentForm.formState.errors.nationality && (
                                    <p className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {talentForm.formState.errors.nationality.message}
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Country of Residence<span className="text-red-500 ml-0.5">*</span></label>
                                  <Controller
                                    name="countryOfResidence"
                                    control={talentForm.control}
                                    render={({ field }) => {
                                      const countries = Country.getAllCountries();
                                      const options = countries.map(c => ({ label: c.name, value: c.name }));
                                      return (
                                        <div className={`rounded-2xl border ${talentForm.formState.errors.countryOfResidence ? 'border-red-500 bg-red-50/10' : 'border-transparent'}`}>
                                          <Dropdown
                                            options={options}
                                            value={field.value || ''}
                                            onChange={(val) => {
                                              field.onChange(val);
                                              const countryObj = countries.find(c => c.name === val);
                                              if (countryObj) {
                                                setResidenceCountryIso(countryObj.isoCode);
                                              } else {
                                                setResidenceCountryIso('');
                                              }
                                              setResidenceStateIso('');
                                              talentForm.setValue('state', '');
                                              talentForm.setValue('city', '');
                                              setIsCustomCity(false);
                                            }}
                                            searchable={true}
                                            placeholder="Select Country"
                                            className="border-transparent bg-[#F4F7FA] focus:bg-white"
                                          />
                                        </div>
                                      );
                                    }}
                                  />
                                  {talentForm.formState.errors.countryOfResidence && (
                                    <p className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {talentForm.formState.errors.countryOfResidence.message}
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">State / Province</label>
                                  <Controller
                                    name="state"
                                    control={talentForm.control}
                                    render={({ field }) => {
                                      const statesList = residenceCountryIso ? State.getStatesOfCountry(residenceCountryIso) : [];
                                      const options = statesList.map(s => ({ label: s.name, value: s.name }));
                                      return (
                                        <Dropdown
                                          options={options}
                                          value={field.value || ''}
                                          onChange={(val) => {
                                            field.onChange(val);
                                            const stateObj = statesList.find(s => s.name === val);
                                            if (stateObj) {
                                              setResidenceStateIso(stateObj.isoCode);
                                            } else {
                                              setResidenceStateIso('');
                                            }
                                            talentForm.setValue('city', '');
                                            setIsCustomCity(false);
                                          }}
                                          searchable={true}
                                          placeholder={residenceCountryIso ? "Select State / Province" : "Please select a country first"}
                                          className={!residenceCountryIso ? "opacity-60 pointer-events-none" : ""}
                                        />
                                      );
                                    }}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
                                  <Controller
                                    name="city"
                                    control={talentForm.control}
                                    render={({ field }) => {
                                      let citiesList: any[] = [];
                                      if (residenceCountryIso) {
                                        citiesList = (residenceStateIso
                                          ? City.getCitiesOfState(residenceCountryIso, residenceStateIso)
                                          : City.getCitiesOfCountry(residenceCountryIso)) || [];
                                      }
                                      const options = [
                                        ...(citiesList || []).map(c => ({ label: c.name, value: c.name })),
                                        { label: 'Other (Specify)', value: 'Other' }
                                      ];
                                      return (
                                        <div className="space-y-3">
                                          <Dropdown
                                            options={options}
                                            value={isCustomCity ? 'Other' : field.value || ''}
                                            onChange={(val) => {
                                              if (val === 'Other') {
                                                setIsCustomCity(true);
                                                field.onChange('');
                                              } else {
                                                setIsCustomCity(false);
                                                field.onChange(val);
                                              }
                                            }}
                                            searchable={true}
                                            placeholder={residenceCountryIso ? "Select City" : "Please select a country first"}
                                            className={!residenceCountryIso ? "opacity-60 pointer-events-none" : ""}
                                          />
                                          {isCustomCity && (
                                            <input
                                              type="text"
                                              value={field.value || ''}
                                              onChange={(e) => field.onChange(e.target.value)}
                                              placeholder="Enter custom city"
                                              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all font-medium"
                                            />
                                          )}
                                        </div>
                                      );
                                    }}
                                  />
                                </div>

                                {renderEditInput("WhatsApp Number (with country code)", "whatsapp", "+971 50 000 0000", "text", true)}
                                {renderEditInput("LinkedIn Profile URL", "linkedin", "https://linkedin.com/in/username")}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 2. Employment Preferences */}
                        <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm bg-white">
                          <button
                            type="button"
                            onClick={() => setOpenSection(openSection === 'preferences' ? '' : 'preferences')}
                            className="w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 bg-gray-50/50 hover:bg-gray-50 transition-all font-bold text-rh-teal text-base border-b border-gray-100/50"
                          >
                            <span className="flex items-center gap-3">
                              <Target className="w-5 h-5 text-rh-red" /> 2. Employment Preferences
                            </span>
                            <span className="text-xl text-gray-400">{openSection === 'preferences' ? '−' : '+'}</span>
                          </button>
                          {openSection === 'preferences' && (
                            <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white animate-fadeIn">
                              <div className="space-y-6">
                                {renderEditRadio("What type of opportunity are you looking for?", "opportunityType", ["Full-Time Onsite", "Remote", "Hybrid", "Contract / Project-Based"], true)}
                                <div className="grid md:grid-cols-2 gap-6">
                                  {renderEditInput("Preferred Industry / Sector", "preferredIndustry", "e.g. Healthcare, IT, Finance", "text", true)}
                                  {renderEditInput("Preferred Role / Job Title", "preferredRole", "e.g. Senior Software Engineer", "text", true)}
                                  {renderEditInput("Preferred Salary Range & Currency", "preferredSalary", "e.g. $80,000 - $100,000 USD/year")}
                                  {renderEditInput("Earliest Start Date / Notice Period", "startDate", "e.g. 30 Days / Immediate")}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 3. Current Employment & History */}
                        <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm bg-white">
                          <button
                            type="button"
                            onClick={() => setOpenSection(openSection === 'current' ? '' : 'current')}
                            className="w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 bg-gray-50/50 hover:bg-gray-50 transition-all font-bold text-rh-teal text-base border-b border-gray-100/50"
                          >
                            <span className="flex items-center gap-3">
                              <Briefcase className="w-5 h-5 text-rh-red" /> 3. Current Employment & History
                            </span>
                            <span className="text-xl text-gray-400">{openSection === 'current' ? '−' : '+'}</span>
                          </button>
                          {openSection === 'current' && (
                            <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white animate-fadeIn">
                              <div className="space-y-6">
                                {renderEditRadio("Are you currently employed?", "isEmployed", ["Yes", "No"], true)}

                                {talentForm.watch('isEmployed') === 'Yes' && (
                                  <div className="grid md:grid-cols-2 gap-6 p-4 sm:p-6 bg-[#F9FBFF] rounded-2xl border border-gray-100">
                                    {renderEditInput("Current Job Title", "jobTitle", "e.g. Engineering Manager", "text", true)}
                                    {renderEditInput("Current Employer Name", "employerName", "e.g. Tech Global", "text", true)}
                                    {renderEditInput("Country of Employment", "employmentCountry", "e.g. Singapore")}
                                    {renderEditInput("Total Years of Experience", "totalExp", "e.g. 8 Years", "text", true)}
                                    {renderEditInput("Relevant Years of Experience", "relevantExp", "e.g. 6 Years")}
                                  </div>
                                )}

                                {renderEditTextarea("Professional Summary / Key Achievements", "summary", "Briefly highlight your core expertise and major achievements...")}

                                <div className="grid md:grid-cols-2 gap-6">
                                  {renderEditRadio("Have you worked overseas before?", "workedOverseas", ["Yes", "No"])}
                                  {talentForm.watch('workedOverseas') === 'Yes' && renderEditInput("Which countries?", "overseasCountries", "e.g. USA, UK, Germany")}
                                </div>

                                {/* Work Experience List */}
                                <div className="space-y-6 pt-6 border-t border-gray-100">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-rh-teal uppercase tracking-widest">Work History Timeline</h4>
                                    <button type="button" onClick={() => appendExp({ title: '', company: '', responsibilities: '' })} className="text-rh-red font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                                      <Plus className="w-4 h-4" /> Add Experience
                                    </button>
                                  </div>
                                  <div className="space-y-4">
                                    {expFields.map((field, index) => {
                                      const expErr = talentForm.formState.errors.experiences?.[index];
                                      return (
                                        <div key={field.id} className="p-4 sm:p-6 bg-[#F9FBFF] rounded-2xl border border-gray-100 relative group">
                                          <button type="button" onClick={() => removeExp(index)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-rh-red transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                          <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Title</label>
                                              <input {...talentForm.register(`experiences.${index}.title`)} className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white border ${expErr?.title ? 'border-red-500 bg-red-50/10' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium`} />
                                              {expErr?.title && (
                                                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {expErr.title.message}
                                                </motion.p>
                                              )}
                                            </div>
                                            <div className="space-y-1.5">
                                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company</label>
                                              <input {...talentForm.register(`experiences.${index}.company`)} className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white border ${expErr?.company ? 'border-red-500 bg-red-50/10' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium`} />
                                              {expErr?.company && (
                                                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {expErr.company.message}
                                                </motion.p>
                                              )}
                                            </div>
                                            <div className="md:col-span-2 space-y-1.5">
                                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Responsibilities</label>
                                              <textarea rows={3} {...talentForm.register(`experiences.${index}.responsibilities`)} className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white border ${expErr?.responsibilities ? 'border-red-500 bg-red-50/10' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium resize-none`} />
                                              {expErr?.responsibilities && (
                                                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {expErr.responsibilities.message}
                                                </motion.p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 4. Expertise & Skills */}
                        <div id="skills-accordion-section" className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm bg-white">
                          <button
                            id="skills-accordion-trigger"
                            type="button"
                            onClick={() => setOpenSection(openSection === 'skills' ? '' : 'skills')}
                            className="w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 bg-gray-50/50 hover:bg-gray-50 transition-all font-bold text-rh-teal text-base border-b border-gray-100/50"
                          >
                            <span className="flex items-center gap-3">
                              <Star className="w-5 h-5 text-rh-red" /> 4. Expertise & Skills
                            </span>
                            <span className="text-xl text-gray-400">{openSection === 'skills' ? '−' : '+'}</span>
                          </button>
                          {openSection === 'skills' && (
                            <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white animate-fadeIn">
                              <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                  value={skillInput}
                                  onChange={(e) => setSkillInput(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                  placeholder="Add a skill..."
                                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all font-medium animate-fadeIn"
                                />
                                <Button type="button" onClick={addSkill} variant="outline" className="px-8 border-2 border-gray-100 rounded-2xl font-bold">Add</Button>
                              </div>
                              {talentForm.formState.errors.skills && (
                                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {talentForm.formState.errors.skills.message}
                                </motion.p>
                              )}
                              <div className="flex flex-wrap gap-2 mt-6">
                                {watchedSkills.map(s => (
                                  <span key={s} className="px-5 py-2.5 bg-rh-light text-rh-teal rounded-xl text-xs font-bold flex items-center gap-3 group">
                                    {s}
                                    <button type="button" onClick={() => removeSkill(s)}><Trash2 className="w-4 h-4 text-gray-300 group-hover:text-rh-red transition-colors" /></button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 5. Education & Qualifications */}
                        <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm bg-white">
                          <button
                            type="button"
                            onClick={() => setOpenSection(openSection === 'education' ? '' : 'education')}
                            className="w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 bg-gray-50/50 hover:bg-gray-50 transition-all font-bold text-rh-teal text-base border-b border-gray-100/50"
                          >
                            <span className="flex items-center gap-3">
                              <GraduationCap className="w-5 h-5 text-rh-red" /> 5. Education & Qualifications
                            </span>
                            <span className="text-xl text-gray-400">{openSection === 'education' ? '−' : '+'}</span>
                          </button>
                          {openSection === 'education' && (
                            <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white animate-fadeIn">
                              <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                  {renderEditSelect("Highest Qualification Achieved", "highestQualification", ["High School / Diploma", "Bachelor's Degree", "Master's Degree", "PhD / Doctorate", "Professional Certification"], true)}
                                  {renderEditInput("Field of Study / Major", "fieldOfStudy", "e.g. Computer Science", "text", true)}
                                  {renderEditInput("Institution Name", "institutionName", "e.g. Stanford University", "text", true)}
                                  {renderEditInput("Graduation Year", "graduationYear", "e.g. 2021")}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                  {renderEditRadio("Do you hold any professional licences or registrations?", "hasLicences", ["Yes", "No"])}
                                  {talentForm.watch('hasLicences') === 'Yes' && renderEditInput("List Licences & Issuing Authorities", "licencesList", "e.g. CPA (AICPA), PMP (PMI)")}
                                </div>

                                {/* Education List */}
                                <div className="space-y-6 pt-6 border-t border-gray-100">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-rh-teal uppercase tracking-widest">Academic History</h4>
                                    <button type="button" onClick={() => appendEdu({ school: '', degree: '', year: '' })} className="text-rh-red font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                                      <Plus className="w-4 h-4" /> Add Education
                                    </button>
                                  </div>
                                  <div className="space-y-4">
                                    {eduFields.map((field, index) => {
                                      const eduErr = talentForm.formState.errors.educations?.[index];
                                      return (
                                        <div key={field.id} className="p-4 sm:p-6 bg-[#F9FBFF] rounded-2xl border border-gray-100 relative group">
                                          <button type="button" onClick={() => removeEdu(index)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-rh-red transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                          <div className="grid md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2 space-y-1.5">
                                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">School / University</label>
                                              <input {...talentForm.register(`educations.${index}.school`)} className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white border ${eduErr?.school ? 'border-red-500 bg-red-50/10' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium`} />
                                              {eduErr?.school && (
                                                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {eduErr.school.message}
                                                </motion.p>
                                              )}
                                            </div>
                                            <div className="space-y-1.5">
                                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Degree</label>
                                              <input {...talentForm.register(`educations.${index}.degree`)} className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white border ${eduErr?.degree ? 'border-red-500 bg-red-50/10' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium`} />
                                              {eduErr?.degree && (
                                                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {eduErr.degree.message}
                                                </motion.p>
                                              )}
                                            </div>
                                            <div className="space-y-1.5">
                                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Year</label>
                                              <input {...talentForm.register(`educations.${index}.year`)} className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white border ${eduErr?.year ? 'border-red-500 bg-red-50/10' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium`} />
                                              {eduErr?.year && (
                                                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {eduErr.year.message}
                                                </motion.p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 6. Language Proficiency */}
                        <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm bg-white">
                          <button
                            type="button"
                            onClick={() => setOpenSection(openSection === 'language' ? '' : 'language')}
                            className="w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 bg-gray-50/50 hover:bg-gray-50 transition-all font-bold text-rh-teal text-base border-b border-gray-100/50"
                          >
                            <span className="flex items-center gap-3">
                              <Languages className="w-5 h-5 text-rh-red" /> 6. Language Proficiency
                            </span>
                            <span className="text-xl text-gray-400">{openSection === 'language' ? '−' : '+'}</span>
                          </button>
                          {openSection === 'language' && (
                            <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white animate-fadeIn">
                              <div className="grid md:grid-cols-2 gap-6">
                                {renderEditSelect("English Test Status", "englishTest", ["IELTS", "TOEFL", "PTE", "OET", "None / English is Native Language"], true)}
                                {talentForm.watch('englishTest') && talentForm.watch('englishTest') !== 'None / English is Native Language' && (
                                  <>
                                    {renderEditInput("Overall Score / Band", "overallScore", "e.g. 7.5")}
                                    {renderEditInput("Test Date / Validity", "testDate", "e.g. Oct 2023")}
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 7. Visa & Work Rights */}
                        <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm bg-white">
                          <button
                            type="button"
                            onClick={() => setOpenSection(openSection === 'visa' ? '' : 'visa')}
                            className="w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 bg-gray-50/50 hover:bg-gray-50 transition-all font-bold text-rh-teal text-base border-b border-gray-100/50"
                          >
                            <span className="flex items-center gap-3">
                              <ShieldCheck className="w-5 h-5 text-rh-red" /> 7. Visa & Work Rights
                            </span>
                            <span className="text-xl text-gray-400">{openSection === 'visa' ? '−' : '+'}</span>
                          </button>
                          {openSection === 'visa' && (
                            <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white animate-fadeIn">
                              <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                  {renderEditInput("Current Visa / Residency Status", "visaStatus", "e.g. Employment Pass / Citizen", "text", true)}
                                  {renderEditInput("Legal Work Rights in Target Country", "legalWorkRights", "e.g. Require Sponsorship / Permanent Resident", "text", true)}
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                  {renderEditRadio("Are you open to relocation?", "openToRelocation", ["Yes", "No"], true)}
                                  {renderEditRadio("Have you applied for an Australian Visa before?", "appliedAusVisa", ["Yes", "No"])}
                                  {talentForm.watch('appliedAusVisa') === 'Yes' && renderEditInput("Which Visa Subclass?", "visaTypeApplied", "e.g. Subclass 482, 189, 190")}
                                </div>
                                <div className="space-y-4">
                                  {renderEditRadio("Have you ever had a visa refusal or cancellation for any country?", "visaRefusal", ["Yes", "No"])}
                                  {talentForm.watch('visaRefusal') === 'Yes' && renderEditTextarea("Please provide details of the visa refusal/cancellation", "visaRefusalDetails", "Explain the reasons and country...")}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 8. Relocation & Availability */}
                        <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm bg-white">
                          <button
                            type="button"
                            onClick={() => setOpenSection(openSection === 'relocation' ? '' : 'relocation')}
                            className="w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 bg-gray-50/50 hover:bg-gray-50 transition-all font-bold text-rh-teal text-base border-b border-gray-100/50"
                          >
                            <span className="flex items-center gap-3">
                              <Plane className="w-5 h-5 text-rh-red" /> 8. Relocation & Availability
                            </span>
                            <span className="text-xl text-gray-400">{openSection === 'relocation' ? '−' : '+'}</span>
                          </button>
                          {openSection === 'relocation' && (
                            <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white animate-fadeIn">
                              <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                  {renderEditSelect("If relocating, will you relocate alone or with family?", "relocateAloneOrFamily", ["Alone", "With Partner", "With Family (Partner & Children)"])}
                                  {renderEditRadio("Do you hold a valid passport?", "validPassport", ["Yes", "No"], true)}
                                  {talentForm.watch('validPassport') === 'Yes' && renderEditInput("Passport Expiry Date", "passportExpiry", "YYYY-MM-DD", "date", true)}
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                  {renderEditRadio("Are you willing to undergo a medical and background check?", "medicalBackgroundCheck", ["Yes", "No"])}
                                  {renderEditRadio("Do you have any criminal convictions?", "criminalConvictions", ["Yes", "No"])}
                                </div>
                                {talentForm.watch('criminalConvictions') === 'Yes' && renderEditTextarea("Please provide details of convictions", "criminalDetails", "Provide details...")}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 9. Uploaded Documents */}
                        <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm bg-white">
                          <button
                            type="button"
                            onClick={() => setOpenSection(openSection === 'documents' ? '' : 'documents')}
                            className="w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 bg-gray-50/50 hover:bg-gray-50 transition-all font-bold text-rh-teal text-base border-b border-gray-100/50"
                          >
                            <span className="flex items-center gap-3">
                              <FileCheck className="w-5 h-5 text-rh-red" /> 9. Uploaded Documents
                            </span>
                            <span className="text-xl text-gray-400">{openSection === 'documents' ? '−' : '+'}</span>
                          </button>
                          {openSection === 'documents' && (
                            <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white animate-fadeIn">
                              {/* Resume Section inside documents */}
                              {/* Resume Section inside documents */}
                              {(() => {
                                const url = talentForm.watch('resumeUrl');
                                const sessionState = docUploadStates['resumeUrl'] || 'idle';
                                const hasResume = !!url;
                                const error = talentForm.formState.errors.resumeUrl;

                                let cardClass = 'border-rh-teal/5 bg-[#F9FBFF]';
                                let blurClass = 'bg-rh-teal/5';
                                let iconClass = 'bg-white text-rh-teal border-gray-50';
                                let iconElement = <FileText className="w-7 h-7" />;
                                let textElement = hasResume ? (
                                  <p className="text-xs text-gray-500 font-medium">Update your professional CV here</p>
                                ) : (
                                  <p className="text-xs text-gray-500 font-medium">No resume uploaded yet</p>
                                );
                                let buttonClass = 'border-rh-teal/10 hover:border-rh-teal hover:bg-rh-teal hover:text-white text-rh-teal';
                                let buttonText = hasResume ? 'Update' : 'Upload';

                                if (error) {
                                  cardClass = 'border-red-500 bg-red-50/10';
                                  blurClass = 'bg-red-500/5';
                                } else if (sessionState === 'success') {
                                  cardClass = 'border-emerald-500/30 bg-emerald-50/20';
                                  blurClass = 'bg-emerald-500/5';
                                  iconClass = 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/10';
                                  iconElement = <CheckCircle className="w-7 h-7 animate-pulse" />;
                                  textElement = (
                                    <p className="text-emerald-600 text-xs font-bold flex items-center gap-1.5 mt-0.5 animate-fadeIn">
                                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Resume uploaded successfully
                                    </p>
                                  );
                                  buttonClass = 'border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white text-emerald-600';
                                  buttonText = 'Update';
                                } else if (sessionState === 'failed') {
                                  cardClass = 'border-red-500 bg-red-50/10';
                                  blurClass = 'bg-red-500/5';
                                  iconClass = 'bg-red-500 text-white border-red-500 shadow-red-500/10';
                                  iconElement = <AlertCircle className="w-7 h-7" />;
                                  textElement = (
                                    <p className="text-red-600 text-xs font-bold flex items-center gap-1.5 mt-0.5 animate-fadeIn">
                                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" /> Upload failed. Please try again.
                                    </p>
                                  );
                                  buttonClass = 'border-red-500/20 hover:border-red-500 hover:bg-red-500 hover:text-white text-red-600';
                                  buttonText = 'Try Again';
                                }

                                return (
                                  <div className="space-y-1 w-full animate-fadeIn">
                                    <div className={`rounded-[2rem] p-8 border relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 transition-all ${cardClass}`}>
                                      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none ${blurClass}`} />

                                      <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto">
                                        <div className={`w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center border shrink-0 transition-all ${iconClass}`}>
                                          {iconElement}
                                        </div>
                                        <div>
                                          <h4 className="text-lg font-bold text-rh-teal mb-0.5">Your Resume <span className="text-red-500">*</span></h4>
                                          {textElement}
                                        </div>
                                      </div>

                                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mt-6 sm:mt-0 relative z-10">
                                        <input
                                          id="resume-upload-edit"
                                          type="file"
                                          className="hidden"
                                          accept=".pdf,.doc,.docx"
                                          onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              if ((profile?.resumes?.length || 0) >= 5) {
                                                toast.error('Maximum 5 resumes allowed. Please delete an existing resume first.');
                                                return;
                                              }
                                              try {
                                                setSaving(true);
                                                const timestamp = Date.now();
                                                const fileName = `${user?.id}-${timestamp}-${file.name.replace(/\s+/g, '-')}`;
                                                const url = await uploadFile(file, 'resumes', fileName);
                                                talentForm.setValue('resumeUrl', url, { shouldDirty: true });

                                                // Add to resumes list & calculate ATS score
                                                const newResume = await authApi.addResume({
                                                  fileName: file.name,
                                                  fileUrl: url,
                                                });
                                                if (newResume?.atsScore) {
                                                  setResumeScore(newResume.atsScore);
                                                }
                                                setDocUploadStates(prev => ({ ...prev, resumeUrl: 'success' }));
                                                await fetchProfile();
                                                toast.success('Resume uploaded successfully!');
                                              } catch (err: any) {
                                                setDocUploadStates(prev => ({ ...prev, resumeUrl: 'failed' }));
                                                toast.error(err.response?.data?.message || 'Failed to upload resume');
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
                                          className={`w-full sm:w-auto px-6 py-3 border-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center ${buttonClass}`}
                                        >
                                          <Upload className="w-4 h-4 mr-2" /> {buttonText}
                                        </Button>

                                        {hasResume && (
                                          <button
                                            type="button"
                                            onClick={() => setSelectedDoc({ url: talentForm.watch('resumeUrl') || '', title: 'Your Resume' })}
                                            className="w-full sm:w-auto px-6 py-3 bg-white text-rh-teal rounded-xl font-bold text-sm shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-center gap-2"
                                          >
                                            <Target className="w-4 h-4" /> View
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                    {error && (
                                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error.message}
                                      </motion.p>
                                    )}
                                  </div>
                                );
                              })()}

                              <div className="space-y-6 pt-4">
                                {renderEditDocUpload("Passport Copy (Bio-Data Page)", "passportUrl", "talent-documents", true)}
                                {renderEditDocUpload("Current Visa / Residency Permit / Work Permit", "visaUrl", "talent-documents", true)}
                                {renderEditDocUpload("Educational Certificates", "eduCertUrl", "talent-documents", false)}
                                {renderEditDocUpload("Employment Certificates / Experience Letters", "empCertUrl", "talent-documents", false)}
                                {renderEditDocUpload("English Test Results", "englishTestUrl", "talent-documents", false)}
                                {renderEditDocUpload("Professional Licences / Certifications", "licenceUrl", "talent-documents", false)}
                              </div>
                            </div>
                          )}
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
                    <form onSubmit={employerForm.handleSubmit(onUpdateSubmit, onUpdateError)} className="space-y-10">
                      <input type="hidden" {...employerForm.register('companyLogo')} />
                      {/* Employer Avatar Upload */}
                      <div className="bg-rh-light/30 rounded-[2rem] p-8 border border-rh-teal/5 relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                          <div className="flex items-center gap-6">
                            <div className="relative group">
                              <div className="w-20 h-20 rounded-2xl bg-white overflow-hidden shadow-md border-4 border-white">
                                {employerForm.watch('companyLogo') ? (
                                  <img src={employerForm.watch('companyLogo') || ''} alt="Company Logo" className="w-full h-full object-cover" />
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
                                    const url = await uploadFile(file, 'company-logo', `${user?.id}-${Date.now()}-${file.name}`);
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
                      </div>                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name <span className="text-red-500">*</span></label>
                          <input {...employerForm.register('firstName')} className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border ${employerForm.formState.errors.firstName ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all font-medium`} />
                          {employerForm.formState.errors.firstName && (
                            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {employerForm.formState.errors.firstName.message}
                            </motion.p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name <span className="text-red-500">*</span></label>
                          <input {...employerForm.register('lastName')} className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border ${employerForm.formState.errors.lastName ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all font-medium`} />
                          {employerForm.formState.errors.lastName && (
                            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {employerForm.formState.errors.lastName.message}
                            </motion.p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Business Phone <span className="text-red-500">*</span></label>
                          <input {...employerForm.register('businessPhone', {
                            onChange: (e) => {
                              e.target.value = e.target.value.replace(/[^\d+\s\-]/g, '');
                            }
                          })} className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border ${employerForm.formState.errors.businessPhone ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all font-medium`} />
                          {employerForm.formState.errors.businessPhone && (
                            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {employerForm.formState.errors.businessPhone.message}
                            </motion.p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Business Email (Registered / Non-editable)</label>
                          <input
                            type="text"
                            value={profile?.businessEmail || user?.email || ''}
                            disabled
                            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-400 cursor-not-allowed font-medium shadow-inner"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company Name <span className="text-red-500">*</span></label>
                          <input {...employerForm.register('companyName')} className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border ${employerForm.formState.errors.companyName ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all font-medium`} />
                          {employerForm.formState.errors.companyName && (
                            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {employerForm.formState.errors.companyName.message}
                            </motion.p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Position Type <span className="text-red-500">*</span></label>
                          <div className={`rounded-2xl border ${employerForm.formState.errors.positionType ? 'border-red-500 bg-red-50/10' : 'border-transparent'}`}>
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
                          {employerForm.formState.errors.positionType && (
                            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {employerForm.formState.errors.positionType.message}
                            </motion.p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Your Job Title <span className="text-red-500">*</span></label>
                          <input {...employerForm.register('jobTitle')} className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border ${employerForm.formState.errors.jobTitle ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all font-medium`} />
                          {employerForm.formState.errors.jobTitle && (
                            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {employerForm.formState.errors.jobTitle.message}
                            </motion.p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Title to Hire <span className="text-red-500">*</span></label>
                          <input {...employerForm.register('jobTitleToHire')} className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border ${employerForm.formState.errors.jobTitleToHire ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all font-medium`} />
                          {employerForm.formState.errors.jobTitleToHire && (
                            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {employerForm.formState.errors.jobTitleToHire.message}
                            </motion.p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Zip Code <span className="text-red-500">*</span></label>
                          <input {...employerForm.register('zipCode')} className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border ${employerForm.formState.errors.zipCode ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 transition-all font-medium`} />
                          {employerForm.formState.errors.zipCode && (
                            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {employerForm.formState.errors.zipCode.message}
                            </motion.p>
                          )}
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
                  <section className="bg-white rounded-[2rem] sm:rounded-[40px] p-6 sm:p-6 sm:p-10 lg:p-16 shadow-sm border border-gray-100">
                    <div className="mb-10 text-center max-w-xl mx-auto">
                      <h3 className="text-3xl font-bold text-rh-teal mb-4">Resume Intelligence</h3>
                      <p className="text-gray-500 font-medium leading-relaxed">Upload your resume to get an AI-powered score and see how you rank against global benchmarks.</p>
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
                                  <p className="text-xs text-gray-400 font-medium truncate">Uploaded on {formatDateBeautifully(resume.createdAt)}</p>
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
                              cx="100" cy="100" r="88" fill="none" stroke="#D71920" strokeWidth="12"
                              strokeDasharray={552.92}
                              initial={{ strokeDashoffset: 552.92 }}
                              animate={{ strokeDashoffset: 552.92 * (1 - resumeScore / 100) }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl sm:text-5xl lg:text-6xl font-bold">{resumeScore}</span>
                            <span className="text-[10px] sm:text-xs font-bold text-white/60 uppercase tracking-widest mt-1">AI Score</span>                          </div>
                        </div>

                        <div className="space-y-6 flex-1 text-center md:text-left">
                          <h4 className="text-xl sm:text-3xl font-bold leading-tight">Excellent! Your resume is in the <span className="text-rh-red italic">Top 10%.</span></h4>
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

      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 sm:p-8 border-b border-gray-100 gap-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rh-teal/5 flex items-center justify-center text-rh-teal shrink-0">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-xl font-bold text-rh-teal truncate">{selectedDoc.title}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="p-2 sm:p-2.5 text-gray-400 hover:text-rh-red hover:bg-red-50 rounded-xl transition-all shrink-0"
                  >
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6 rotate-45" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-gray-50/50 p-4 sm:p-8 min-h-[50vh]">
                {/\.(jpeg|jpg|gif|png)(\?|$)/i.test(selectedDoc.url) ? (
                  <img src={selectedDoc.url} alt={selectedDoc.title} className="max-w-full rounded-2xl shadow-sm mx-auto" />
                ) : /\.pdf(\?|$)/i.test(selectedDoc.url) ? (
                  <iframe src={selectedDoc.url} className="w-full h-[50vh] sm:h-[60vh] rounded-2xl shadow-sm border border-gray-100" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                    <FileText className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium mb-4">Preview not available for this file type.</p>
                    <a
                      href={selectedDoc.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-rh-teal text-white rounded-xl font-bold shadow-md hover:bg-[#0E8A8F] transition-all"
                    >
                      <Upload className="w-5 h-5 rotate-180" /> Download to View
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingResumeId && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingResumeId(null)}
              className="absolute inset-0"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden p-8 sm:p-12 text-center z-10"
            >
              <div className="w-20 h-20 bg-rh-red/5 rounded-[2rem] flex items-center justify-center text-rh-red mx-auto mb-8">
                <Trash2 className="w-10 h-10" />
              </div>

              <h2 className="text-2xl font-bold text-rh-teal mb-4 leading-tight">Delete Resume?</h2>
              <p className="text-gray-500 text-sm font-medium mb-10 px-4">
                Are you sure you want to delete this resume? This action is permanent and cannot be undone.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setDeletingResumeId(null)}
                  className="flex-1 py-4 bg-[#F4F7FA] text-rh-teal rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Cancel
                </button>
                <button
                  onClick={confirmDeleteResume}
                  className="flex-1 py-4 bg-rh-red text-white rounded-2xl text-sm font-bold shadow-xl shadow-rh-red/20 hover:bg-rh-red/90 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete Permanently
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
