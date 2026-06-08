import { LucideIcon } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

// Contact Types
export interface ContactDetail {
  email: string;
  phone: string;
  address: string;
}

export interface ContactBox {
  icon: LucideIcon;
  title: string;
  desc: string;
  action: string;
}

// Job Types
export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Temporary';
  mode: 'Remote' | 'Hybrid' | 'On-site';
  category: string;
  publishedAt?: string;  // primary — date job was published
  postedAt?: string;     // kept for static mock data backward compat
  featured?: boolean;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  tags?: string[];
  applicationsCount?: number;
  deadline?: string;
  skills?: string[];
  vacancies?: number;
  industry?: string;
  _postedAtRaw?: number; // internal sort key
}

// Employer Dashboard Applicant Types
export type EmployerDashboardApplicant = {
  id: number;
  jobId: number;
  name: string;
  role: string;
  match: string;
  status: string;
  avatar: string;
  email: string;
  experience: string;
  location: string;
  skills: string[];
  education: string;
  bio: string;
  portfolio: string;
  social: {
    linkedin: string;
    github: string;
  };
};

export interface EmployerDashboardJob {
  id: number;
  title: string;
  department: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Temporary' | 'Remote';
  location: string;
  salary: string;
  applicantsCount: number;
  status: string;
  postedAt: string;
  health: number;
  vacancies: number;
  description: string;
  requirements: string[];
  skills: string[];
};

// Talent Dashoard Types

export interface TimeLine {
  step: string;
  date: string;
  completed?: boolean;
  current?: boolean;
  pending?: boolean;
}

export interface TalentDashboardApplicant {
  id: number;
  company: string;
  logo: string;
  role: string;
  status: string;
  date: string;
  nextStep: string;
  isBookmarked: boolean;
  timeline: TimeLine[];
}

export interface TalentDashboardJob {
  id: number,
  title: string,
  company: string,
  location: string,
  salary: string,
  tags: string[],
  match: string
}

// Service Types
export interface Service {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
  image?: string;
  link: string;
}

// Feature Types
export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

// Stat Types
export interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  type: 'candidate' | 'employer';
  avatar: string;
}

// Industry Types
export interface Industry {
  id: string;
  name: string;
  icon: string;
  count: number;
  image?: string;
}

// Navigation Item Types
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  megaMenu?: boolean;
}

// Applicant Types
export interface Applicant {
  id: number;
  jobId: number;
  name: string;
  role: string;
  match: string;
  status: string;
  avatar: string;
  email: string;
  experience: string;
  location: string;
  skills: string[];
  education: string;
  bio: string;
  portfolio: string;
  social: {
    linkedin: string;
    github: string;
  };
}

// Solution Types
export interface Solution {
  title: string;
  icon: LucideIcon;
  color: string;
  desc: string;
}

export interface SolutionDetail {
  title: string;
  description: string;
  longDescription: string;
  icon: any;
  metrics: string;
  features: string[];
  process: { step: string; text: string }[];
}

// Blog Insight Types
export interface BlogInsight {
  id: string;
  category: string;
  title: string;
  desc: string;
  content: string[];
  image: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface VideoInsight {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  category: string;
  trendingTitle: string;
  trendingTag: string;
}

// Message Types
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Dropdown Types
export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  searchable?: boolean;
}

// Badge Types
export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'red' | 'green' | 'blue' | 'gray' | 'navy';
  className?: string;
}

// Button Types
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

// Section Label Types
export interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}