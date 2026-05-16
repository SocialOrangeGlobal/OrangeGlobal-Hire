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
  role: UserRole;
  createdAt: string;
}
