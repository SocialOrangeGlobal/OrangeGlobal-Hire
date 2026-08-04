import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Briefcase,
  Upload, CheckCircle, Shield, Trash2, Plus,
  Settings, LogOut, Camera, FileText, Target,
  Loader2, TrendingUp, ShieldCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { logout, updateProfileSuccess } from '../store/slices/authSlice';
import { authApi } from '../lib/auth';
import { uploadFile, validateFileConstraints } from '../lib/storage';
import Button from '../components/ui/Button';
import PageLoader from '../components/ui/PageLoader';
import { toast } from 'react-hot-toast';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { nationalitiesList } from '../data';
import { Country, State, City } from 'country-state-city';
import { ProfileOverview } from '../components/profile/ProfileOverview';
import { ProfileEditForm } from '../components/profile/ProfileEditForm';
import { ResumeManager } from '../components/profile/ResumeManager';

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
  linkedin: z.string()
    .refine(val => !val || /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/i.test(val), {
      message: 'Please enter a valid LinkedIn URL'
    })
    .optional(),
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
  summary: z.string().max(200, 'Professional Summary cannot exceed 200 characters').optional(),
  isEmployed: z.string().min(1, 'Please indicate if you are currently employed'),
  workedOverseas: z.string().optional(),
  overseasCountries: z.string().optional(),
  highestQualification: z.string().min(1, 'Please select your highest qualification'),
  fieldOfStudy: z.string().min(1, 'Field of Study is required'),
  institutionName: z.string().optional(),
  graduationYear: z.string().optional(),
  hasLicences: z.string().optional(),
  licencesList: z.string().optional(),
  englishTest: z.string().min(1, 'Please select your English test status'),
  overallScore: z.string().optional(),
  testDate: z.string().optional(),
  visaStatus: z.string().min(1, 'Current Visa / Residency Status is required'),
  legalWorkRights: z.string().optional(),
  openToRelocation: z.string().min(1, 'Please indicate if you are open to relocation'),
  appliedAusVisa: z.string().optional(),
  visaTypeApplied: z.string().optional(),
  visaRefusal: z.string().optional(),
  visaRefusalDetails: z.string().max(200, 'Visa refusal details cannot exceed 200 characters').optional(),
  relocateAloneOrFamily: z.string().min(1, 'Please indicate if you are relocating alone or with family'),
  validPassport: z.string().optional(),
  passportExpiry: z.string().optional(),
  medicalBackgroundCheck: z.string().optional(),
  criminalConvictions: z.string().optional(),
  criminalDetails: z.string().max(200, 'Conviction details cannot exceed 200 characters').optional(),
  passportUrl: z.string().min(1, 'Passport document is required'),
  visaUrl: z.string().min(1, 'Visa / Residency permit document is required'),
  eduCertUrl: z.string().min(1, 'Educational Certificate document is required'),
  empCertUrl: z.string().min(1, 'Employment Certificate / Experience Letter is required'),
  englishTestUrl: z.string().optional(),
  licenceUrl: z.string().optional(),
  financialStatementUrl: z.string().optional(),
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
    } else {
      const expiryDate = new Date(data.passportExpiry);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expiryDate <= today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Passport Expiry Date must be a future date',
          path: ['passportExpiry'],
        });
      }
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
  const [resumeUploadError, setResumeUploadError] = useState('');
  const [mainResumeError, setMainResumeError] = useState('');
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



  // --- Forms ---
  const talentForm = useForm<TalentUpdateData>({
    resolver: zodResolver(talentUpdateSchema),
    mode: 'onChange',
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
      setProfile(data.profile);

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
        const nationalityExists = nationalitiesList.some(c => c.value === nationalityName);
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
          financialStatementUrl: p.financialStatementUrl || '',
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
          financialStatementUrl: 'documents',
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
    setMainResumeError('');
    if (file) {
      const error = validateFileConstraints(file, 'resumes', '.pdf');
      if (error) {
        setMainResumeError(error);
        event.target.value = '';
        return;
      }

      if ((profile?.resumes?.length || 0) >= 5) {
        setMainResumeError('Maximum 5 resumes allowed. Please delete an existing resume first.');
        event.target.value = '';
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
                <ProfileOverview
                  profile={profile}
                  isTalent={isTalent}
                  setActiveTab={setActiveTab}
                  setOpenSection={setOpenSection}
                  setSelectedDoc={setSelectedDoc}
                  formatDateBeautifully={formatDateBeautifully}
                />
              )}

              {activeTab === 'edit' && (
                <ProfileEditForm
                  isTalent={isTalent}
                  talentForm={talentForm}
                  employerForm={employerForm}
                  onUpdateSubmit={onUpdateSubmit}
                  onUpdateError={onUpdateError}
                  saving={saving}
                  setSaving={setSaving}
                  residenceCountryIso={residenceCountryIso}
                  setResidenceCountryIso={setResidenceCountryIso}
                  residenceStateIso={residenceStateIso}
                  setResidenceStateIso={setResidenceStateIso}
                  isCustomCity={isCustomCity}
                  setIsCustomCity={setIsCustomCity}
                  isCustomNationality={isCustomNationality}
                  setIsCustomNationality={setIsCustomNationality}
                  openSection={openSection}
                  setOpenSection={setOpenSection}
                  setActiveTab={setActiveTab}
                  skillInput={skillInput}
                  setSkillInput={setSkillInput}
                  addSkill={addSkill}
                  removeSkill={removeSkill}
                  watchedSkills={watchedSkills}
                  expFields={expFields}
                  appendExp={appendExp}
                  removeExp={removeExp}
                  eduFields={eduFields}
                  appendEdu={appendEdu}
                  removeEdu={removeEdu}
                  docUploadStates={docUploadStates}
                  setDocUploadStates={setDocUploadStates}
                  resumeUploadError={resumeUploadError}
                  setResumeUploadError={setResumeUploadError}
                  setResumeScore={setResumeScore}
                  setSelectedDoc={setSelectedDoc}
                  profile={profile}
                  fetchProfile={fetchProfile}
                  user={user}
                  dispatch={dispatch}
                  updateProfileSuccess={updateProfileSuccess}
                  handleDocumentUpload={handleDocumentUpload}
                />
              )}

              {activeTab === 'resume' && isTalent && (
                <ResumeManager
                  profile={profile}
                  resumeExtracting={resumeExtracting}
                  fileInputRef={fileInputRef}
                  mainResumeError={mainResumeError}
                  handleResumeUpload={handleResumeUpload}
                  handleSetDefaultResume={handleSetDefaultResume}
                  handleDeleteResume={handleDeleteResume}
                  setSelectedDoc={setSelectedDoc}
                  resumeScore={resumeScore}
                  formatDateBeautifully={formatDateBeautifully}
                />
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
                ) : /\.(doc|docx)(\?|$)/i.test(selectedDoc.url) ? (
                  <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(selectedDoc.url)}&embedded=true`} className="w-full h-[50vh] sm:h-[60vh] rounded-2xl shadow-sm border border-gray-100" />
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
