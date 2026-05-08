import type { Job, Stat, Testimonial, Industry, NavItem, MetricCard } from '../types';

export const navItems: NavItem[] = [
  {
    label: 'Find Jobs',
    href: '#jobs',
    children: [
      { label: 'Finance & Accounting', href: '#' },
      { label: 'Technology', href: '#' },
      { label: 'Legal', href: '#' },
      { label: 'Marketing & Creative', href: '#' },
      { label: 'Administrative', href: '#' },
    ],
  },
  {
    label: 'Hire Talent',
    href: '#services',
    children: [
      { label: 'Permanent Staffing', href: '#' },
      { label: 'Contract Staffing', href: '#' },
      { label: 'Executive Search', href: '#' },
      { label: 'Project Solutions', href: '#' },
    ],
  },
  {
    label: 'Explore Consulting Solutions',
    href: '#consulting',
    children: [
      { label: 'Business Transformation', href: '#' },
      { label: 'Technology Solutions', href: '#' },
      { label: 'Financial Management', href: '#' },
    ],
  },
  {
    label: 'Discover Insights',
    href: '#insights',
    children: [
      { label: 'Salary Guide', href: '#' },
      { label: 'Hiring Trends', href: '#' },
      { label: 'Career Advice', href: '#' },
    ]
  },
];

export const stats: Stat[] = [
  { value: '75', label: 'Years of Experience', suffix: '+' },
  { value: '1.2', label: 'Placements Completed', suffix: 'M+' },
  { value: '400', label: 'Recruiters Worldwide', suffix: '+' },
  { value: '97', label: 'Client Satisfaction', suffix: '%' },
];

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Senior Financial Analyst',
    company: 'Global Capital Partners',
    location: 'New York, NY',
    salary: '$95,000 – $120,000',
    type: 'Full-time',
    mode: 'Hybrid',
    category: 'Finance & Accounting',
    postedAt: '2 days ago',
    featured: true,
  },
  {
    id: '2',
    title: 'Director of Engineering',
    company: 'Apex Technologies',
    location: 'San Francisco, CA',
    salary: '$180,000 – $220,000',
    type: 'Full-time',
    mode: 'Remote',
    category: 'Technology',
    postedAt: '1 day ago',
    featured: true,
  },
  {
    id: '3',
    title: 'Corporate Counsel',
    company: 'Meridian Legal Group',
    location: 'Chicago, IL',
    salary: '$140,000 – $170,000',
    type: 'Full-time',
    mode: 'On-site',
    category: 'Legal',
    postedAt: '3 days ago',
    featured: true,
  },
  {
    id: '4',
    title: 'VP of Marketing',
    company: 'Brandwave Solutions',
    location: 'Austin, TX',
    salary: '$130,000 – $160,000',
    type: 'Full-time',
    mode: 'Hybrid',
    category: 'Marketing & Creative',
    postedAt: '4 days ago',
  },
  {
    id: '5',
    title: 'Chief Financial Officer',
    company: 'Horizon Healthcare',
    location: 'Boston, MA',
    salary: '$200,000 – $260,000',
    type: 'Full-time',
    mode: 'On-site',
    category: 'Finance & Accounting',
    postedAt: '5 days ago',
    featured: true,
  },
  {
    id: '6',
    title: 'Cloud Infrastructure Lead',
    company: 'DataBridge Corp',
    location: 'Seattle, WA',
    salary: '$155,000 – $185,000',
    type: 'Full-time',
    mode: 'Remote',
    category: 'Technology',
    postedAt: '1 day ago',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: 'Orange Global delivered an exceptional CFO candidate within three weeks. Their understanding of our financial sector requirements was remarkable — far beyond any agency we have worked with previously.',
    author: 'Margaret Chen',
    role: 'Chief Human Resources Officer',
    company: 'Pinnacle Financial Group',
    type: 'employer',
    avatar: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '2',
    quote: 'After 12 years in corporate law, I was hesitant about using a staffing firm. Orange Global changed my perspective entirely. They placed me in a senior counsel role that exceeded my expectations in every dimension.',
    author: 'David Okafor',
    role: 'Senior Counsel',
    company: 'Meridian Legal Group',
    type: 'candidate',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '3',
    quote: 'We scaled our engineering team from 20 to 85 engineers in one fiscal year thanks to Orange Global. The quality of candidates was consistently high and the process was remarkably efficient.',
    author: 'Sarah Whitmore',
    role: 'VP of People Operations',
    company: 'Apex Technologies',
    type: 'employer',
    avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

export const industries: Industry[] = [
  { id: '1', name: 'Banking & Finance', icon: 'building-2', count: 1240, image: '/images/services/finance.png' },
  { id: '2', name: 'Technology', icon: 'cpu', count: 2180, image: '/images/services/tech.png' },
  { id: '3', name: 'Healthcare', icon: 'heart-pulse', count: 890, image: '/images/industries/healthcare.png' },
  { id: '4', name: 'Manufacturing', icon: 'factory', count: 640, image: '/images/industries/manufacturing.png' },
  { id: '5', name: 'Legal', icon: 'scale', count: 420, image: '/images/services/legal.png' },
  { id: '6', name: 'Retail & Consumer', icon: 'shopping-bag', count: 780, image: '/images/industries/retail.png' },
  { id: '7', name: 'Real Estate', icon: 'layers', count: 1560, image: '/images/industries/real_estate.png' },
  { id: '8', name: 'Energy', icon: 'network', count: 350, image: '/images/industries/energy.png' },
];

export const dashboardMetrics: MetricCard[] = [
  { label: 'Active Placements', value: '248', change: '+12%', trend: 'up' },
  { label: 'Candidates Screened', value: '1,840', change: '+24%', trend: 'up' },
  { label: 'Avg. Time to Hire', value: '18 days', change: '-3 days', trend: 'up' },
  { label: 'Offer Acceptance Rate', value: '91%', change: '+4%', trend: 'up' },
];

export const trustedCompanies = [
  'Deloitte', 'Goldman Sachs', 'Microsoft', 'Johnson & Johnson', 'Citigroup', 'Boeing',
];

export const jobCategories = [
  'All Jobs',
  'Finance & Accounting',
  'Technology',
  'Legal',
  'Marketing & Creative',
  'Administrative',
  'Executive Search',
];
