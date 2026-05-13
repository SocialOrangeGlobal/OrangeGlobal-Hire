import type { Job, Stat, Testimonial, Industry, NavItem, MetricCard } from '../types';

export const navItems: NavItem[] = [
  {
    label: 'Find Jobs',
    href: '#jobs',
    children: [
      { label: 'Finance & Accounting', href: '#jobs?category=Finance%20&%20Accounting' },
      { label: 'Technology', href: '#jobs?category=Technology' },
      { label: 'Legal', href: '#jobs?category=Legal' },
      { label: 'Marketing & Creative', href: '#jobs?category=Marketing%20&%20Creative' },
      { label: 'Administrative', href: '#jobs?category=Administrative' },
    ],
  },
  {
    label: 'Hire Talent',
    href: '#hire-talent',
    children: [
      { label: 'Permanent Staffing', href: '#hire-talent' },
      { label: 'Contract Staffing', href: '#hire-talent' },
      { label: 'Executive Search', href: '#hire-talent' },
      { label: 'Project Solutions', href: '#hire-talent' },
    ],
  },
  {
    label: 'Explore Consulting Solutions',
    href: '#consulting',
    children: [
      { label: 'Business Transformation', href: '#consulting' },
      { label: 'Technology Solutions', href: '#consulting' },
      { label: 'Financial Management', href: '#consulting' },
    ],
  },
  {
    label: 'Discover Insights',
    href: '#insights',
    children: [
      { label: 'Salary Guide', href: '#insights' },
      { label: 'Hiring Trends', href: '#insights' },
      { label: 'Career Advice', href: '#insights' },
    ]
  },
  {
    label: 'Contact Us',
    href: '#contact',
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
    description: 'We are seeking a highly analytical and detail-oriented Senior Financial Analyst to join our team. The successful candidate will be responsible for financial modeling, budgeting, and providing strategic insights to drive business growth.',
    requirements: [
      'Bachelor’s degree in Finance, Accounting, or related field.',
      '5+ years of experience in financial analysis.',
      'Advanced proficiency in Excel and financial modeling software.',
      'Strong communication and presentation skills.'
    ],
    benefits: [
      'Comprehensive health, dental, and vision insurance.',
      '401(k) matching and retirement planning.',
      'Paid time off and flexible working hours.',
      'Professional development opportunities.'
    ],
    tags: ['Finance', 'Analysis', 'CPA', 'Strategy']
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
    description: 'Apex Technologies is looking for a Director of Engineering to lead our world-class development team. You will be responsible for setting technical direction, mentoring engineers, and overseeing the delivery of complex software systems.',
    requirements: [
      '10+ years of experience in software engineering.',
      '5+ years of experience in a leadership role.',
      'Proven track record of delivering scalable software solutions.',
      'Deep understanding of modern cloud architectures.'
    ],
    benefits: [
      'Competitive salary and equity package.',
      'Remote-first work culture.',
      'Health and wellness stipends.',
      'Annual team retreats.'
    ],
    tags: ['Leadership', 'Cloud', 'Engineering', 'Strategy']
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
    description: 'We are looking for a Corporate Counsel to provide legal guidance on a variety of corporate matters, including contracts, compliance, and employment law.',
    requirements: [
      'JD degree from an accredited law school.',
      'Admission to the state bar.',
      '3-5 years of corporate legal experience.',
      'Strong negotiation and drafting skills.'
    ],
    benefits: [
      'Excellent base salary and bonus potential.',
      'Comprehensive benefits package.',
      'Mentorship from senior legal partners.',
      'Subsidized legal education.'
    ],
    tags: ['Legal', 'Corporate', 'Compliance', 'Counsel']
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
    description: 'Brandwave Solutions is seeking a visionary VP of Marketing to lead our global brand strategy and growth initiatives.',
    requirements: [
      '8+ years of marketing experience.',
      'Proven success in scaling global brands.',
      'Strong analytical and leadership skills.'
    ],
    benefits: [
      'Generous PTO.',
      'Health insurance.',
      'Performance-based bonuses.'
    ],
    tags: ['Marketing', 'Branding', 'Growth', 'Executive']
  },
  {
    id: '5',
    title: 'Cloud Solutions Architect',
    company: 'SkyNet Systems',
    location: 'Denver, CO',
    salary: '$160,000 – $190,000',
    type: 'Full-time',
    mode: 'Remote',
    category: 'Technology',
    postedAt: '5 hours ago',
    description: 'Join Skynet Systems as a Lead Solutions Architect. You will design complex cloud-native architectures and lead our migration strategy.',
    requirements: ['AWS/Azure Certification', '8+ years experience', 'Terraform proficiency'],
    benefits: ['Equity', 'Unlimited PTO', 'Tech stipend'],
    tags: ['Cloud', 'AWS', 'Architecture']
  },
  {
    id: '6',
    title: 'Tax Manager',
    company: 'Deloitte & Touche',
    location: 'London, UK',
    salary: '£75,000 – £95,000',
    type: 'Full-time',
    mode: 'Hybrid',
    category: 'Finance & Accounting',
    postedAt: '12 hours ago',
    description: 'Leading our corporate tax advisory for major APAC clients.',
    requirements: ['ACA/ACCA qualified', 'Tax planning experience'],
    benefits: ['Global mobility', 'Private health'],
    tags: ['Tax', 'Accounting', 'Finance']
  },
  {
    id: '7',
    title: 'Product Designer',
    company: 'Creative Studio',
    location: 'Berlin, DE',
    salary: '€60,000 – €80,000',
    type: 'Contract',
    mode: 'Remote',
    category: 'Marketing & Creative',
    postedAt: '3 days ago',
    description: 'Help us define the next generation of mobile banking.',
    requirements: ['Figma expert', 'Design systems experience'],
    benefits: ['Flexible hours', 'Creative freedom'],
    tags: ['UI/UX', 'Figma', 'Design']
  },
  {
    id: '8',
    title: 'Investment Analyst',
    company: 'Vanguard Capital',
    location: 'Singapore',
    salary: '$110,000 – $140,000',
    type: 'Full-time',
    mode: 'On-site',
    category: 'Finance & Accounting',
    postedAt: '1 week ago',
    description: 'Focus on emerging market equities in the SEA region.',
    requirements: ['CFA Level 2+', 'Quant modeling skills'],
    benefits: ['Bonus pool', 'Family health'],
    tags: ['Investments', 'Equity', 'Analyst']
  }
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
