export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Temporary';
  mode: 'Remote' | 'Hybrid' | 'On-site';
  category: string;
  postedAt: string;
  featured?: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  image?: string;
}

export interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  type: 'candidate' | 'employer';
  avatar: string;
}

export interface Industry {
  id: string;
  name: string;
  icon: string;
  count: number;
  image?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface MetricCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}
