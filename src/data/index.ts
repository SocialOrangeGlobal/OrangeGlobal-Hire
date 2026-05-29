import type { ContactDetail, ContactBox, Job, Stat, Testimonial, Industry, NavItem, Service, Feature, Solution, DropdownOption, EmployerDashboardApplicant, EmployerDashboardJob, SolutionDetail, BlogInsight, VideoInsight, TalentDashboardApplicant, TalentDashboardJob } from '../types';
import { MessageSquare, BarChart2, Code2, Scale, Megaphone, ClipboardList, Star, Cpu, Clock, Globe, ShieldCheck, Lightbulb, Database, Rocket, BarChart3, Users, Zap } from 'lucide-react';

// Contact Data
export const contactDetails: ContactDetail = {
  email: "info@orangeglobal.co",
  phone: "+61 451 519 726",
  address: "Level 7, 276 Flinders Street, Melbourne 3000 VIC, Australia"
};

export const contactBoxes: ContactBox[] = [
  { icon: MessageSquare, title: 'Chat with us', desc: 'Our chatbot is available 24/7 for quick answers to common questions.', action: 'Start Chat' },
  { icon: Globe, title: 'Global Offices', desc: 'Find contact details for our regional offices around the world.', action: 'View Locations' },
  { icon: Clock, title: 'Support Hours', desc: 'Our dedicated support team is available Mon-Fri, 9am - 6pm (AEST).', action: 'Learn More' }
];

export const subjectOptions: DropdownOption[] = [
  { value: 'General Inquiry', label: 'General Inquiry' },
  { value: 'Hiring Talent', label: 'Hiring Talent' },
  { value: 'Finding a Job', label: 'Finding a Job' },
  { value: 'Partnership', label: 'Partnership' },
  { value: 'Other', label: 'Other' }
];

// Nav Data
export const navItems: NavItem[] = [
  {
    label: 'Find Jobs',
    href: '/jobs',
    children: [
      { label: 'Finance & Accounting', href: '/jobs?category=Finance%20&%20Accounting' },
      { label: 'Technology', href: '/jobs?category=Technology' },
      { label: 'Legal', href: '/jobs?category=Legal' },
      { label: 'Marketing & Creative', href: '/jobs?category=Marketing%20&%20Creative' },
      { label: 'Administrative', href: '/jobs?category=Administrative' },
    ],
  },
  {
    label: 'Hire Talent',
    href: '/hire-talent',
    children: [
      { label: 'Permanent Staffing', href: '/hire-talent' },
      { label: 'Contract Staffing', href: '/hire-talent' },
      { label: 'Executive Search', href: '/hire-talent' },
      { label: 'Project Solutions', href: '/hire-talent' },
    ],
  },
  // {
  //   label: 'Migration',
  //   href: '/migration',
  //   children: [
  //     { label: 'Business Transformation', href: '/migration' },
  //     { label: 'Technology Solutions', href: '/migration' },
  //     { label: 'Financial Management', href: '/migration' },
  //   ],
  // },
  {
    label: 'Consulting',
    href: '/consulting',
    children: [
      { label: 'Business Transformation', href: '/consulting' },
      { label: 'Technology Solutions', href: '/consulting' },
      { label: 'Financial Management', href: '/consulting' },
    ],
  },
  {
    label: 'Insights',
    href: '/insights',
    children: [
      { label: 'Salary Guide', href: '/insights' },
      { label: 'Hiring Trends', href: '/insights' },
      { label: 'Career Advice', href: '/insights' },
    ]
  },
  {
    label: 'Contact Us',
    href: '/contact',
  },
];

// Footer Data
export const footerLinks: Record<string, string[]> = {
  Services: ['Permanent Staffing', 'Contract Staffing', 'Executive Search', 'Project Solutions', 'Managed Staffing'],
  Industries: ['Banking & Finance', 'Technology', 'Healthcare', 'Legal', 'Manufacturing', 'Retail'],
  Company: ['About Orange Global', 'Our Approach', 'Leadership', 'Press Room', 'Careers at Orange Global', 'Social Responsibility'],
  Resources: ['Salary Guide', 'Job Market Report', 'Hiring Insights', 'Career Advice', 'Blog', 'Webinars'],
};

// Stats Data
export const stats: Stat[] = [
  { value: '75', label: 'Years of Experience', suffix: '+' },
  { value: '1.2', label: 'Placements Completed', suffix: 'M+' },
  { value: '400', label: 'Recruiters Worldwide', suffix: '+' },
  { value: '97', label: 'Client Satisfaction', suffix: '%' },
];

// Jobs Data
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

// Employer Dashboard Jobs
export const employerDashboardJobs: EmployerDashboardJob[] = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    department: 'Technology',
    type: 'Full-time',
    location: 'Remote',
    salary: '$120k - $150k',
    applicantsCount: 45,
    status: 'Active',
    postedAt: '2 days ago',
    health: 92,
    vacancies: 3,
    description: 'We are looking for a Senior Frontend Developer to join our core product team. You will be responsible for building high-performance, scalable web applications using React and TypeScript.',
    requirements: ['5+ years React experience', 'Expert TypeScript skills', 'Experience with Framer Motion'],
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js']
  },
  {
    id: 2,
    title: 'Financial Risk Analyst',
    department: 'Finance',
    type: 'Remote',
    location: 'London, UK',
    salary: '$90k - $120k',
    applicantsCount: 28,
    status: 'Active',
    postedAt: '5 days ago',
    health: 78,
    vacancies: 1,
    description: 'TechCorp is seeking a Financial Risk Analyst to help identify, assess and prioritize functional and financial risks.',
    requirements: ['CFA or equivalent', 'Python for data analysis', '3+ years in fintech'],
    skills: ['Risk Modeling', 'Python', 'SQL', 'Excel']
  },
  {
    id: 3,
    title: 'Product Design Lead',
    department: 'Design',
    type: 'Full-time',
    location: 'Hybrid',
    salary: '$140k - $180k',
    applicantsCount: 12,
    status: 'Reviewing',
    postedAt: '1 week ago',
    health: 45,
    vacancies: 2,
    description: 'Lead our design team in creating world-class user experiences for our global client base.',
    requirements: ['Portfolio showing B2B SaaS', 'Leadership experience', 'Figma mastery'],
    skills: ['UI/UX', 'Figma', 'Prototyping', 'User Research']
  },
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

// Sign Up Employer Data
export const signUpPositionType: DropdownOption[] = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'remote', label: 'Remote' }
];

// Post Vacancy Data
export const postVacancyJobCategories: DropdownOption[] = [
  { value: 'Technology', label: 'Technology' },
  { value: 'Finance', label: 'Finance & Accounting' },
  { value: 'Legal', label: 'Legal' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Executive', label: 'Executive Search' }
];

export const postVacancyWorkMode: DropdownOption[] = [
  { value: 'Remote', label: 'Remote' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'On-site', label: 'On-site' }
];

// Employer Dashboard Applicants
export const employerDashboardApplicants: EmployerDashboardApplicant[] = [
  {
    id: 1,
    jobId: 1,
    name: 'Sarah Jenkins',
    role: 'Senior Frontend Developer',
    match: '98%',
    status: 'New',
    avatar: 'https://i.pravatar.cc/100?img=32',
    email: 'sarah@example.com',
    experience: '8 years',
    location: 'Berlin, Germany',
    skills: ['React', 'TypeScript', 'Node.js', 'Redux'],
    education: 'MSc Computer Science',
    bio: 'Experienced frontend lead with a passion for clean code and high-performance animations.',
    portfolio: 'sarahcodes.dev',
    social: { linkedin: '#', github: '#' }
  },
  {
    id: 2,
    jobId: 1,
    name: 'Michael Chen',
    role: 'Senior Frontend Developer',
    match: '92%',
    status: 'Shortlisted',
    avatar: 'https://i.pravatar.cc/100?img=12',
    email: 'michael@example.com',
    experience: '6 years',
    location: 'Singapore',
    skills: ['React', 'Vue', 'AWS', 'Docker'],
    education: 'BSc Software Engineering',
    bio: 'Fullstack-leaning frontend dev with strong cloud infrastructure knowledge.',
    portfolio: 'mchen.io',
    social: { linkedin: '#', github: '#' }
  },
  {
    id: 3,
    jobId: 2,
    name: 'Emma Wilson',
    role: 'Financial Risk Analyst',
    match: '85%',
    status: 'Interviewing',
    avatar: 'https://i.pravatar.cc/100?img=44',
    email: 'emma@example.com',
    experience: '4 years',
    location: 'New York, USA',
    skills: ['Risk Management', 'Python', 'Quant Analysis'],
    education: 'MBA Finance',
    bio: 'Quant-focused analyst with experience in high-frequency trading environments.',
    portfolio: 'emmafin.com',
    social: { linkedin: '#', github: '#' }
  },
];

// Talent Dashboard Jobs and Applicant Data
export const talentDashboardApplicants: TalentDashboardApplicant[] = [
  {
    id: 1,
    company: 'TechScale Global',
    logo: 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=100',
    role: 'Senior Frontend Developer',
    status: 'Interviewing',
    date: 'Applied 4 days ago',
    nextStep: 'Technical Round - Tomorrow, 2:00 PM',
    isBookmarked: true,
    timeline: [
      { step: 'Applied', date: 'Oct 12', completed: true },
      { step: 'Screening', date: 'Oct 15', completed: true },
      { step: 'Interview', date: 'Oct 18', current: true },
      { step: 'Final Result', date: 'TBD', pending: true },
    ]
  },
  {
    id: 2,
    company: 'FinEdge Corp',
    logo: 'https://images.pexels.com/photos/3182761/pexels-photo-3182761.jpeg?auto=compress&cs=tinysrgb&w=100',
    role: 'Full Stack Engineer',
    status: 'Under Review',
    date: 'Applied 1 week ago',
    nextStep: 'Waiting for recruiter feedback',
    isBookmarked: false,
    timeline: [
      { step: 'Applied', date: 'Oct 08', completed: true },
      { step: 'Screening', date: 'Processing', current: true },
      { step: 'Interview', date: '-', pending: true },
      { step: 'Final Result', date: '-', pending: true },
    ]
  },
];

export const talentDashboardJobs: TalentDashboardJob[] = [
  { id: 1, title: 'Lead Web Architect', company: 'Innovation Hub', location: 'Remote', salary: '$160k - $200k', tags: ['React', 'Node.js'], match: '98%' },
  { id: 2, title: 'Senior UI Developer', company: 'Creative Digital', location: 'Hybrid', salary: '$130k - $150k', tags: ['Figma', 'React'], match: '92%' },
];

// Services Data
export const services: Service[] = [
  {
    id: 1,
    icon: BarChart2,
    title: 'Finance & Accounting',
    description: 'From CFOs to staff accountants, we connect organizations with financial professionals who drive fiscal performance.',
    image: '/images/services/finance.png',
    link: '/hire-talent',
  },
  {
    id: 2,
    icon: Code2,
    title: 'Technology',
    description: 'Source elite engineers, architects, and IT leaders who can scale your technical infrastructure.',
    image: '/images/services/tech.png',
    link: '/hire-talent',
  },
  {
    id: 3,
    icon: Scale,
    title: 'Legal',
    description: 'Place attorneys, paralegals, and compliance officers from in-house counsel to major law firms.',
    image: '/images/services/legal.png',
    link: '/hire-talent',
  },
  {
    id: 4,
    icon: Megaphone,
    title: 'Marketing & Creative',
    description: 'Build brand-defining teams with strategists, designers, and content professionals who deliver results.',
    image: '/images/services/marketing.png',
    link: '/hire-talent',
  },
  {
    id: 5,
    icon: ClipboardList,
    title: 'Administrative Support',
    description: 'Match your organization with executive assistants, office managers, and operations professionals.',
    image: '/images/services/admin.png',
    link: '/hire-talent',
  },
  {
    id: 6,
    icon: Star,
    title: 'Executive Search',
    description: 'Our retained executive search practice identifies and secures transformational C-suite and VP-level leaders.',
    image: '/images/services/executive.png',
    link: '/hire-talent',
  },
];

// Features Data
export const features: Feature[] = [
  {
    icon: Cpu,
    title: 'AI-Powered Matching',
    description: 'Our proprietary algorithms analyze thousands of data points to find the perfect cultural and technical fit.',
  },
  {
    icon: Clock,
    title: 'Faster Hiring Cycle',
    description: 'Reduce time-to-hire by up to 40% with our pre-vetted network of passive candidates.',
  },
  {
    icon: Globe,
    title: 'Global Network',
    description: 'Access top talent across 400+ markets worldwide with localized expertise in every region.',
  },
  {
    icon: ShieldCheck,
    title: 'Risk-Free Guarantee',
    description: 'Every placement comes with a satisfaction guarantee. If it is not a fit, we will replace them at no cost.',
  },
];

export const featuredInsights: Feature[] = [
  { title: 'Data-Driven Insights', icon: BarChart3, description: 'We utilize deep market analytics to inform every strategic decision.' },
  { title: 'Global Delivery Model', icon: Globe, description: 'Deploying specialized teams across timezones for 24/7 project momentum.' }
];

// Experience Levels Data
export const experienceLevels: DropdownOption[] = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior Level (6+ years)' },
  { value: 'lead', label: 'Director / Executive' }
];

// Testimonials Data
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

// Solutions Data
export const solutions: Solution[] = [
  {
    title: 'Business Transformation',
    icon: Lightbulb,
    desc: 'Redesigning operational models to drive efficiency and sustainable growth in a digital-first economy.',
    color: 'bg-orange-50 text-orange-600'
  },
  {
    title: 'Technology Solutions',
    icon: Database,
    desc: 'Cloud migration, cybersecurity audits, and bespoke software architecture tailored to your unique scaling needs.',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Financial Management',
    icon: BarChart3,
    desc: 'Strategic financial planning, risk assessment, and interim CFO leadership for mid-to-large cap organizations.',
    color: 'bg-emerald-50 text-emerald-600'
  },
  {
    title: 'Digital Strategy',
    icon: Rocket,
    desc: 'Comprehensive digital roadmaps that align technology investment with core business objectives and market trends.',
    color: 'bg-purple-50 text-purple-600'
  }
];

export const hireTalentSolutionCards: SolutionDetail[] = [
  {
    title: 'Permanent Staffing',
    description: 'Our proprietary screening process ensures you find leaders who align with your culture and business goals.',
    longDescription: 'Permanent staffing is about more than just filling a seat; it\'s about finding the future of your company. We leverage deep industry insights and cultural mapping to ensure every hire is a long-term success story.',
    icon: Users,
    metrics: '97% retention rate',
    features: ['Culture-Fit Assessment', 'Skill Validation', 'Long-term Guarantee'],
    process: [
      { step: '01', text: 'Needs Analysis' },
      { step: '02', text: 'Talent Sourcing' },
      { step: '03', text: 'Deep Interviewing' }
    ]
  },
  {
    title: 'Executive Search',
    description: 'Identifying and attracting transformational C-suite talent through extensive global networks and research.',
    longDescription: 'C-suite leadership requires a surgical approach. We act as your brand ambassadors in the executive market, identifying "passive" talent that isn\'t on job boards but is ready for their next big challenge.',
    icon: ShieldCheck,
    metrics: 'Avg. 35 days to close',
    features: ['Confidential Searches', 'Global Network Access', 'Leadership Benchmarking'],
    process: [
      { step: '01', text: 'Market Mapping' },
      { step: '02', text: 'Discreet Outreach' },
      { step: '03', text: 'Board Presentation' }
    ]
  },
  {
    title: 'Contract Solutions',
    description: 'Agile staffing solutions to manage project peaks, leave coverage, or specialized skill requirements.',
    longDescription: 'In today\'s dynamic market, agility is a competitive advantage. Our contract solutions provide high-caliber talent on-demand, allowing you to scale up or down without the long-term overhead.',
    icon: Zap,
    metrics: '48h talent matching',
    features: ['Rapid Deployment', 'Compliance Management', 'Flexible Terms'],
    process: [
      { step: '01', text: 'Skill Specification' },
      { step: '02', text: 'Database Matching' },
      { step: '03', text: 'Instant Onboarding' }
    ]
  }
];

// Industries Data
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

// Trusted Companies Data
export const trustedCompanies = [
  'Deloitte', 'Goldman Sachs', 'Microsoft', 'Johnson & Johnson', 'Citigroup', 'Boeing',
];

// Insights Data
export const videoInsights: VideoInsight[] = [
  {
    id: '1',
    title: 'Navigating Regulatory Changes in Global Finance',
    thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '45:00',
    category: 'Finance',
    trendingTitle: 'How AI is redefining the role of the CFO',
    trendingTag: 'Market Analysis • 5 Min Read'
  },
  {
    id: '2',
    title: 'The Future of AI in Talent Acquisition',
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    duration: '32:15',
    category: 'Technology',
    trendingTitle: 'Recruitment marketing: A guide for 2026',
    trendingTag: 'Digital Strategy • 8 Min Read'
  },
  {
    id: '3',
    title: 'Leadership Strategies for Distributed Teams',
    thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '28:40',
    category: 'Leadership',
    trendingTitle: 'Remote work culture: Long-term success factors',
    trendingTag: 'Culture Guide • 12 Min Read'
  }
];

export const blogsInsights: BlogInsight[] = [
  // Technology Category
  {
    id: 'tech-1',
    category: 'Technology',
    title: 'Retaining Elite Engineering Talent in 2026',
    desc: 'New strategies for reducing turnover in the world\'s most competitive labor market.',
    content: [
      'The landscape of engineering recruitment has shifted dramatically. It\'s no longer just about the stack or the salary—it\'s about the impact and the environment.',
      'In our 2026 survey, we found that 68% of senior engineers prioritize autonomy and "maker time" over standard benefits packages.',
      'To stay ahead, organizations must implement deep-work blocks, fractional leadership models, and clear career pathing that doesn\'t always lead to management.'
    ],
    image: 'https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'Sarah Whitmore',
    date: 'May 12, 2026',
    readTime: '6 min read',
    tags: ['Engineering', 'Retention', 'HR Tech']
  },
  {
    id: 'tech-2',
    category: 'Technology',
    title: 'The Impact of Generative AI on Developer Velocity',
    desc: 'Analyzing how AI-pair programming is changing output expectations and team structures.',
    content: [
      'Generative AI has moved from a novelty to a necessity in high-performing engineering teams.',
      'We track how teams are leveraging Copilots to reduce boilerplate and focus on architectural complexity.',
      'The new bottleneck isn\'t writing code—it\'s reviewing and validating it. This shift requires a new type of senior oversight.'
    ],
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'David Chen',
    date: 'May 15, 2026',
    readTime: '7 min read',
    tags: ['AI', 'Development', 'Productivity']
  },
  {
    id: 'tech-3',
    category: 'Technology',
    title: 'Scaling Infrastructure for Global SaaS',
    desc: 'Lessons from the field on managing multi-region deployments at scale.',
    content: [
      'Scaling infrastructure globally requires a deep understanding of data sovereignty and latency.',
      'We explore the evolution of edge computing and its role in delivering consistent experiences across continents.',
      'Automation at the terraform level is no longer optional—it\'s the backbone of global operations.'
    ],
    image: 'https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'Alex Rivera',
    date: 'May 18, 2026',
    readTime: '9 min read',
    tags: ['Infrastructure', 'SaaS', 'Cloud']
  },

  // Finance Category
  {
    id: 'fin-1',
    category: 'Finance',
    title: '2026 Global Salary Guide: High-Growth Sectors',
    desc: 'Comprehensive analysis of compensation trends across tech, finance, and legal markets.',
    content: [
      'Financial services are seeing a resurgence in demand for specialized quant and risk profiles.',
      'We analyze how high-interest rate environments have shifted the bonus structures for mid-market investment banks.',
      'A detailed breakdown of compensation packages in London, New York, and Singapore hubs shows a 12% YOY increase for specialized roles.'
    ],
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'Michael Dalton',
    date: 'May 10, 2026',
    readTime: '8 min read',
    tags: ['Finance', 'Salary Guide', 'Economy']
  },
  {
    id: 'fin-2',
    category: 'Finance',
    title: 'Crypto Regulation and the Future of FinTech',
    desc: 'How institutional frameworks are bringing stability to the digital asset market.',
    content: [
      'Regulation is finally catching up with innovation, providing the guardrails needed for institutional adoption.',
      'We examine the impact of central bank digital currencies on traditional payment rails.',
      'FinTechs that prioritize compliance are winning the trust of major institutional partners.'
    ],
    image: 'https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'Elena Rossi',
    date: 'May 20, 2026',
    readTime: '10 min read',
    tags: ['FinTech', 'Crypto', 'Regulation']
  },
  {
    id: 'fin-3',
    category: 'Finance',
    title: 'Sustainable Investing: Beyond the Buzzwords',
    desc: 'The data-driven approach to ESG that is driving returns for institutional investors.',
    content: [
      'ESG is evolving from a marketing label to a core component of risk management.',
      'We look at the metrics that actually matter for long-term sustainability and performance.',
      'Institutional investors are demanding higher transparency and standardized reporting on carbon footprints.'
    ],
    image: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'James Wilson',
    date: 'May 22, 2026',
    readTime: '7 min read',
    tags: ['ESG', 'Investing', 'Sustainability']
  },

  // Leadership Category
  {
    id: 'lead-1',
    category: 'Leadership',
    title: 'The Rise of Fractional Leadership in APAC',
    desc: 'Why organizations are turning to part-time executive talent to drive strategic initiatives.',
    content: [
      'Fractional leadership is becoming the standard for startups scaling in the APAC region.',
      'Experienced C-suite talent is now offering their expertise to multiple organizations simultaneously, providing high-level strategy without the full-time overhead.',
      'This model allows for faster decision-making and access to veteran wisdom for growing teams.'
    ],
    image: 'https://images.pexels.com/photos/3184301/pexels-photo-3184301.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'Chen Wei',
    date: 'May 08, 2026',
    readTime: '5 min read',
    tags: ['Leadership', 'Strategy', 'APAC']
  },
  {
    id: 'lead-2',
    category: 'Leadership',
    title: 'Leading Through Uncertainty: A CEO Playbook',
    desc: 'Strategic frameworks for maintaining morale and momentum in shifting markets.',
    content: [
      'Uncertainty is the only constant. Great leaders build resilient systems that thrive on change.',
      'Communication is the primary tool for a CEO. Transparency build trust, while clarity builds action.',
      'We outline the "Agile Leadership" framework used by Fortune 500 CEOs to navigate global shifts.'
    ],
    image: 'https://images.pexels.com/photos/3182811/pexels-photo-3182811.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'Robert Vance',
    date: 'May 25, 2026',
    readTime: '12 min read',
    tags: ['CEO', 'Leadership', 'Management']
  },
  {
    id: 'lead-3',
    category: 'Leadership',
    title: 'Building a High-Trust Culture Remotely',
    desc: 'New methodologies for creating connection and accountability across borders.',
    content: [
      'Trust is the currency of remote work. Without it, the entire system collapses into micro-management.',
      'We share the specific rituals used by remote-first companies to maintain cultural cohesion.',
      'Accountability should be measured by outcomes, not hours logged on a dashboard.'
    ],
    image: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'Laura Mendez',
    date: 'May 28, 2026',
    readTime: '8 min read',
    tags: ['Culture', 'Remote', 'Trust']
  }
];

// Badge Variants Data
export const badgeVariants: Record<'default' | 'red' | 'green' | 'blue' | 'gray' | 'navy', string> = {
  default: 'bg-gray-100 text-gray-700',
  red: 'bg-red-50 text-[#D71920]',
  green: 'bg-emerald-50 text-emerald-700',
  blue: 'bg-blue-50 text-blue-700',
  gray: 'bg-slate-100 text-slate-600',
  navy: 'bg-[#081B2D] text-white',
};

// Button Variants Data
export const buttonVariants: Record<string, string> = {
  primary: 'bg-rh-red hover:bg-red-700 text-white focus-visible:ring-rh-red',
  secondary: 'bg-rh-teal hover:bg-teal-800 text-white focus-visible:ring-rh-teal',
  outline: 'border-2 border-rh-teal text-rh-teal hover:bg-rh-teal hover:text-white focus-visible:ring-rh-teal',
  ghost: 'text-rh-teal hover:bg-gray-100 focus-visible:ring-rh-teal',
  danger: 'bg-rh-red hover:bg-red-700 text-white',
};

export const buttonSizes: Record<string, string> = {
  sm: 'h-8 px-3 text-[12px]',
  md: 'h-10 px-5 text-[14px]',
  lg: 'h-12 px-7 text-[15px]',
};

export const nationalitiesList = [
  { label: "Afghan", value: "Afghan" },
  { label: "Albanian", value: "Albanian" },
  { label: "Algerian", value: "Algerian" },
  { label: "American", value: "American" },
  { label: "Andorran", value: "Andorran" },
  { label: "Angolan", value: "Angolan" },
  { label: "Argentinian", value: "Argentinian" },
  { label: "Armenian", value: "Armenian" },
  { label: "Australian", value: "Australian" },
  { label: "Austrian", value: "Austrian" },
  { label: "Azerbaijani", value: "Azerbaijani" },
  { label: "Bahamian", value: "Bahamian" },
  { label: "Bahraini", value: "Bahraini" },
  { label: "Bangladeshi", value: "Bangladeshi" },
  { label: "Barbadian", value: "Barbadian" },
  { label: "Belgian", value: "Belgian" },
  { label: "Belizean", value: "Belizean" },
  { label: "Beninese", value: "Beninese" },
  { label: "Bhutanese", value: "Bhutanese" },
  { label: "Bolivian", value: "Bolivian" },
  { label: "Bosnian", value: "Bosnian" },
  { label: "Brazilian", value: "Brazilian" },
  { label: "British", value: "British" },
  { label: "Bruneian", value: "Bruneian" },
  { label: "Bulgarian", value: "Bulgarian" },
  { label: "Burkinese", value: "Burkinese" },
  { label: "Burundian", value: "Burundian" },
  { label: "Cambodian", value: "Cambodian" },
  { label: "Cameroonian", value: "Cameroonian" },
  { label: "Canadian", value: "Canadian" },
  { label: "Cape Verdean", value: "Cape Verdean" },
  { label: "Central African", value: "Central African" },
  { label: "Chadian", value: "Chadian" },
  { label: "Chilean", value: "Chilean" },
  { label: "Chinese", value: "Chinese" },
  { label: "Colombian", value: "Colombian" },
  { label: "Comoran", value: "Comoran" },
  { label: "Congolese", value: "Congolese" },
  { label: "Costa Rican", value: "Costa Rican" },
  { label: "Croatian", value: "Croatian" },
  { label: "Cuban", value: "Cuban" },
  { label: "Cypriot", value: "Cypriot" },
  { label: "Czech", value: "Czech" },
  { label: "Danish", value: "Danish" },
  { label: "Djiboutian", value: "Djiboutian" },
  { label: "Dominican", value: "Dominican" },
  { label: "Dutch", value: "Dutch" },
  { label: "East Timorese", value: "East Timorese" },
  { label: "Ecuadorian", value: "Ecuadorian" },
  { label: "Egyptian", value: "Egyptian" },
  { label: "Emirati", value: "Emirati" },
  { label: "Equatorial Guinean", value: "Equatorial Guinean" },
  { label: "Eritrean", value: "Eritrean" },
  { label: "Estonian", value: "Estonian" },
  { label: "Ethiopian", value: "Ethiopian" },
  { label: "Fijian", value: "Fijian" },
  { label: "Filipino", value: "Filipino" },
  { label: "Finnish", value: "Finnish" },
  { label: "French", value: "French" },
  { label: "Gabonese", value: "Gabonese" },
  { label: "Gambian", value: "Gambian" },
  { label: "Georgian", value: "Georgian" },
  { label: "German", value: "German" },
  { label: "Ghanaian", value: "Ghanaian" },
  { label: "Greek", value: "Greek" },
  { label: "Grenadian", value: "Grenadian" },
  { label: "Guatemalan", value: "Guatemalan" },
  { label: "Guinean", value: "Guinean" },
  { label: "Guyanese", value: "Guyanese" },
  { label: "Haitian", value: "Haitian" },
  { label: "Honduran", value: "Honduran" },
  { label: "Hungarian", value: "Hungarian" },
  { label: "Icelandic", value: "Icelandic" },
  { label: "Indian", value: "Indian" },
  { label: "Indonesian", value: "Indonesian" },
  { label: "Iranian", value: "Iranian" },
  { label: "Iraqi", value: "Iraqi" },
  { label: "Irish", value: "Irish" },
  { label: "Israeli", value: "Israeli" },
  { label: "Italian", value: "Italian" },
  { label: "Ivorian", value: "Ivorian" },
  { label: "Jamaican", value: "Jamaican" },
  { label: "Japanese", value: "Japanese" },
  { label: "Jordanian", value: "Jordanian" },
  { label: "Kazakh", value: "Kazakh" },
  { label: "Kenyan", value: "Kenyan" },
  { label: "Kuwaiti", value: "Kuwaiti" },
  { label: "Kyrgyz", value: "Kyrgyz" },
  { label: "Laotian", value: "Laotian" },
  { label: "Latvian", value: "Latvian" },
  { label: "Lebanese", value: "Lebanese" },
  { label: "Liberian", value: "Liberian" },
  { label: "Libyan", value: "Libyan" },
  { label: "Liechtenstein citizen", value: "Liechtenstein citizen" },
  { label: "Lithuanian", value: "Lithuanian" },
  { label: "Luxembourger", value: "Luxembourger" },
  { label: "Macedonian", value: "Macedonian" },
  { label: "Malagasy", value: "Malagasy" },
  { label: "Malawian", value: "Malawian" },
  { label: "Malaysian", value: "Malaysian" },
  { label: "Maldivian", value: "Maldivian" },
  { label: "Malian", value: "Malian" },
  { label: "Maltese", value: "Maltese" },
  { label: "Mauritanian", value: "Mauritanian" },
  { label: "Mauritian", value: "Mauritian" },
  { label: "Mexican", value: "Mexican" },
  { label: "Moldovan", value: "Moldovan" },
  { label: "Monacan", value: "Monacan" },
  { label: "Mongolian", value: "Mongolian" },
  { label: "Montenegrin", value: "Montenegrin" },
  { label: "Moroccan", value: "Moroccan" },
  { label: "Mozambican", value: "Mozambican" },
  { label: "Myanmar", value: "Myanmar" },
  { label: "Namibian", value: "Namibian" },
  { label: "Nepalese", value: "Nepalese" },
  { label: "New Zealander", value: "New Zealander" },
  { label: "Nicaraguan", value: "Nicaraguan" },
  { label: "Nigerian", value: "Nigerian" },
  { label: "North Korean", value: "North Korean" },
  { label: "Norwegian", value: "Norwegian" },
  { label: "Omani", value: "Omani" },
  { label: "Pakistani", value: "Pakistani" },
  { label: "Panamanian", value: "Panamanian" },
  { label: "Papua New Guinean", value: "Papua New Guinean" },
  { label: "Paraguayan", value: "Paraguayan" },
  { label: "Peruvian", value: "Peruvian" },
  { label: "Polish", value: "Polish" },
  { label: "Portuguese", value: "Portuguese" },
  { label: "Qatari", value: "Qatari" },
  { label: "Romanian", value: "Romanian" },
  { label: "Russian", value: "Russian" },
  { label: "Rwandan", value: "Rwandan" },
  { label: "Saudi", value: "Saudi" },
  { label: "Senegalese", value: "Senegalese" },
  { label: "Serbian", value: "Serbian" },
  { label: "Seychellois", value: "Seychellois" },
  { label: "Sierra Leonean", value: "Sierra Leonean" },
  { label: "Singaporean", value: "Singaporean" },
  { label: "Slovak", value: "Slovak" },
  { label: "Slovenian", value: "Slovenian" },
  { label: "Solomon Islander", value: "Solomon Islander" },
  { label: "Somali", value: "Somali" },
  { label: "South African", value: "South African" },
  { label: "South Korean", value: "South Korean" },
  { label: "Spanish", value: "Spanish" },
  { label: "Sri Lankan", value: "Sri Lankan" },
  { label: "Sudanese", value: "Sudanese" },
  { label: "Surinamese", value: "Surinamese" },
  { label: "Swazi", value: "Swazi" },
  { label: "Swedish", value: "Swedish" },
  { label: "Swiss", value: "Swiss" },
  { label: "Syrian", value: "Syrian" },
  { label: "Taiwanese", value: "Taiwanese" },
  { label: "Tajik", value: "Tajik" },
  { label: "Tanzanian", value: "Tanzanian" },
  { label: "Thai", value: "Thai" },
  { label: "Togolese", value: "Togolese" },
  { label: "Tongan", value: "Tongan" },
  { label: "Trinidadian/Tobagonian", value: "Trinidadian/Tobagonian" },
  { label: "Tunisian", value: "Tunisian" },
  { label: "Turkish", value: "Turkish" },
  { label: "Tuvaluan", value: "Tuvaluan" },
  { label: "Ugandan", value: "Ugandan" },
  { label: "Ukrainian", value: "Ukrainian" },
  { label: "Uruguayan", value: "Uruguayan" },
  { label: "Uzbek", value: "Uzbek" },
  { label: "Vanuatuan", value: "Vanuatuan" },
  { label: "Venezuelan", value: "Venezuelan" },
  { label: "Vietnamese", value: "Vietnamese" },
  { label: "Yemeni", value: "Yemeni" },
  { label: "Zambian", value: "Zambian" },
  { label: "Zimbabwean", value: "Zimbabwean" }
];
