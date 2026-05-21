export type UserRole = 'TALENT' | 'EMPLOYER';

export interface SignInDto {
  email: string;
  password?: string; // Optional because some forms might not have it during partial steps
  role: UserRole;
}

export interface EducationEntry {
  school: string;
  degree: string;
  year: string;
}

export interface ExperienceEntry {
  title: string;
  company: string;
  responsibilities: string;
}

export interface SignUpTalentDto {
  email: string;
  password?: string;
  fullName: string;
  location?: string;
  phone?: string;
  educations?: EducationEntry[];
  skills?: string[];
  experiences?: ExperienceEntry[];
  resumeUrl?: string;
  avatarUrl?: string;
  companyLogo?: string;

  dob?: string;
  age?: string;
  gender?: string;
  nationality?: string;
  countryOfResidence?: string;
  whatsapp?: string;
  linkedin?: string;
  opportunityType?: string;
  preferredIndustry?: string;
  preferredRole?: string;
  preferredSalary?: string;
  startDate?: string;
  jobTitle?: string;
  employerName?: string;
  employmentCountry?: string;
  totalExp?: string;
  relevantExp?: string;
  summary?: string;
  isEmployed?: string;
  workedOverseas?: string;
  overseasCountries?: string;
  highestQualification?: string;
  fieldOfStudy?: string;
  institutionName?: string;
  graduationYear?: string;
  hasLicences?: string;
  licencesList?: string;
  englishTest?: string;
  overallScore?: string;
  testDate?: string;
  visaStatus?: string;
  legalWorkRights?: string;
  openToRelocation?: string;
  appliedAusVisa?: string;
  visaTypeApplied?: string;
  visaRefusal?: string;
  visaRefusalDetails?: string;
  relocateAloneOrFamily?: string;
  validPassport?: string;
  passportExpiry?: string;
  medicalBackgroundCheck?: string;
  criminalConvictions?: string;
  criminalDetails?: string;
  passportUrl?: string;
  visaUrl?: string;
  eduCertUrl?: string;
  empCertUrl?: string;
  englishTestUrl?: string;
  licenceUrl?: string;
  declarationTrue?: string;
  declarationConsent?: string;
}

export interface SignUpEmployerDto {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  businessPhone?: string;
  companyName: string;
  jobTitle?: string;
  jobTitleToHire?: string;
  zipCode?: string;
  positionType?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  companyLogo?: string;
  role: UserRole;
  createdAt: string;
}
