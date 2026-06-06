# Orange Global - Staffing & Talent Solutions Portal

![Orange Global Logo](public/images/brand-logo-dark.png)

A premium, high-fidelity recruitment and consulting platform designed for the modern global economy. This portal provides a seamless bridge between ambitious organizations and elite professionals through AI-enhanced screening, enterprise-grade talent solutions, and fully-featured management dashboards.

## 🚀 Key Features & Recent Updates

### ✨ Latest Enhancements
*   **Resume ATS Upload Improvements**: Strengthened validation on the Manage Profile section handling large PDF files (up to 5MB) for accurate ATS Match Score uploads without triggering bad payload errors.
*   **Dynamic Field Optimization**: Stabilized optional document upload payloads across SignUpTalent and User Edit flows to prevent empty strings from failing backend validation constraints.
*   **Payload Stability**: Resolved object literal property duplication issues inside the Manage Profile architecture to ensure clean JSON transmissions.
*   **Dynamic Search Overlay**: Implemented a premium, debounced search bar inside the main navigation bar. Typing queries matches both local site/visa pages (compiled dynamically from the navigation tree) and active job listings queried from the NestJS backend via a dedicated search API. Displays results in a dual-column responsive dropdown featuring category icons, badges, hover animations, and a sticky search header for optimized desktop, tablet, and mobile user experiences.
*   **Horizontal Stepper Navigation & Resume Auto-fill**: Implemented a responsive form multistepper for job applications. Utilizes smooth native horizontal swipe scrolling on mobile/tablet (with progress line segments) and dynamic flex wrapping with custom chevrons on desktop. Clicking any resume dynamically parses and auto-populates the entire form, while starting manual apply begins from a completely empty scratch state. Form navigation is fully unlocked across all tabs.
*   **Light Theme Date Pickers & Black Calendar Icons**: Integrated `[color-scheme:light]` on date input inputs (e.g. Date of Birth, testDate in Language Proficiency, and Passport Expiry). Restores a clear black/dark native calendar icon and ensures browser popups (`showPicker`) render in a beautiful light theme.
*   **Redirection Page Loader**: Added a dedicated coordinated loading screen (`PageLoader`) on `/apply-job` to track asynchronous profile and job fetches, eliminating "Job Not Found" page flickering.
*   **Smooth Talent Dashboard**: A highly polished, animated dashboard utilizing Framer Motion for seamless transitions, loading states, and robust error recovery.
*   **Application Tracking Timeline**: Candidates can track their applications in real-time through all stages (Applied, Under Review, Shortlisted, Interview Scheduled, Offer Sent).
*   **Interview Coordination**: A dedicated "Next Steps" section renders scheduled interview details, dates, and a one-click "Join Interview" button when applicable.
*   **Offer Management**: Visibility into Offer Sent details, with clear states for accepted, rejected, or withdrawn applications.
*   **Applied Status Indicators**: Job postings dynamically show an "Applied" badge instead of a "View" button for jobs the talent has already submitted an application for.

### 📊 Professional Dashboards
*   **Talent Command Hub**: A centralized portal for candidates to track applications, optimize their resumes, and receive smart job matches.
*   **Employer Command Center**: Comprehensive recruitment management for organizations to track vacancies, evaluate applicants, and schedule interviews.
*   **Visual Timelines**: Real-time interactive application tracking from screening to final result.

### 🤖 AI-Powered Support
*   **Orange AI Assistant**: A custom-built, floating AI chatbot providing instant support and contextual routing.
*   **Smart Matching**: Matches candidates to roles with high-precision scoring based on skills and expertise.
*   **Contextual Assistance**: Real-time typing simulations and branded design integration.

### 🔔 Advanced Notification System
*   **Interactive Dropdown**: A premium glassmorphic notification hub with real-time updates for interviews and matches.
*   **Read/Unread Management**: Visual indicators with soft-glow effects and "Mark All Read" functionality.
*   **Cross-Device Optimization**: Floating dropdown on desktop/tablet and full-screen focused modal on mobile.

### 👤 Profile & Portfolio Management
*   **Dual-Role Dashboard Control**: Comprehensive, dedicated user experience flows for both **Talents** (Candidates) and **Employers** (Corporates) managing their visual presence.
*   **Comprehensive Employer Profile**: Splits corporate overview into a beautifully ordered hierarchy featuring **Personal Details** (Full Name, Job Title, Hiring Needs, Business Email, and Business Phone) followed by a **Company Profile** (Company Name, Position Type, and Zip Code).
*   **Top Section Header Indicators**: Displays dynamic verified badges, user roles, email, phone number, job title (Briefcase icon), and location/zip code labels right within the top card for both candidate and employer roles.
*   **Fallback Initials System**: Displays the first character of the user's name as a beautiful CSS-styled profile circle when the custom avatar image or company logo has not been uploaded.
*   **Profile Score Engine**: Dynamic completion tracking with a visual meter and optimization suggestions.
*   **Mobile-First Responsive Layout**: Clean fluid-scaling container margins, paddings, and font sizes across mobile, tablet, and desktop viewports.
*   **Interactive Document Viewer Modal**: Supporting resume and section 9 uploaded documents (Passport, Visa, Educational Certificates, Employment Certificates, English Test, Professional Licenses) opening inside an overlay modal with smooth close animations.
*   **Skills Section Parity**: Aligned position and design of Skills section across Overview and Edit views using accordion containers.
*   **Date Formatter Engine**: Beautiful date text representation (e.g. "12 June 2026") replacing raw dash/slash patterns.
*   **Toast Alert System**: Modern popup notifications on successful uploads and actions leveraging `react-hot-toast`.
*   **Section-Based Editing**: Managed technical skills, work experience, and personal bio with a premium UI.

### 💼 Recruitment & Job Board
*   **Dynamic Discovery**: Real-time filtering by keywords, industry, and location.
*   **High-Fidelity Modals**: Feature-rich modals with social sharing and deep-link integration.
*   **Streamlined Apply Flow**: Multi-step registration for talent with AI-assisted resume scoring and an aesthetic, split-view inline inbox verification success screen matching the employer flow.
*   **Contact Integration**: Direct communication channels between users and the platform administrators via `src/lib/contact.ts` integration.

## 🏗️ Project Structure

```text
src/
├── components/
│   ├── layouts/       # Navbar, Footer
│   ├── modals/        # Reorganized modal system (Dashboards, Job Details, Solutions)
│   ├── sections/      # Hero, Stats, Services, CTA, FeaturedJobs
│   └── ui/            # Atomic UI components (Button, Badge, Dropdown, Chatbot)
├── pages/             # Page components mapped to React Router routes
│   ├── TalentDashboard    # Talent Command Hub
│   ├── EmployerDashboard  # Corporate Command Center
│   ├── Jobs/ApplyJob      # Recruitment board and application flow
│   ├── HireTalent         # Staffing solutions landing
│   ├── Consulting         # Strategy & implementation services
│   ├── Insights           # Knowledge hub and reports
│   └── Auth/SignUp        # Choice-based entry flows
├── hooks/             # Custom React hooks (useScrolled)
├── data/              # Centralized data store (src/data/index.ts)
├── types/             # Centralized TypeScript definitions (src/types/index.ts)
├── utils/             # Animations, formatters, and helpers
├── main.tsx           # Application entry point with BrowserRouter
└── App.tsx            # Declarative routing and layout orchestration
```

## 🛠️ Technology Stack

*   **Framework**: [React](https://reactjs.org/) 18+ with [Vite](https://vitejs.dev/)
*   **Routing**: [React Router DOM](https://reactrouter.com/) (Standard path-based navigation)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Mobile-First approach)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) (Spring physics & glassmorphism)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type safety)

## ⚙️ Environment Configuration

Create a `.env` file in the root directory based on `.env.example`. Ensure the following variables are configured:

```env
# Local Development API URL
VITE_API_URL=http://localhost:3001/api/v1

# Production Render API URL (Configure this in Vercel Environment Variables)
# VITE_API_URL=https://orangeglobal-backend.onrender.com/api/v1

# App Metadata
VITE_APP_NAME="Orange Global"
VITE_APP_DESCRIPTION="Premium Staffing and Recruitment Platform"

# Supabase Storage Configuration
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=replace_with_the_supabase_anon_key_here
```

## 🏁 Getting Started

### Prerequisites
*   Node.js (v18+)
*   npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/SocialOrangeGlobal/orange-global-hire.git
   cd orange-global-hire
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   
3. Run the development server:
   ```bash
   npm run dev
   ```

## 📱 Responsiveness
The portal utilizes a **mobile-first** design architecture. Navigation, modals, and complex dashboard elements (like the Notification Hub and Profile Drawer) dynamically reposition themselves—switching from floating elements on desktop to focused, full-screen modules on mobile devices.

## 🌍 Deployment & Branching Strategy

The Orange Global Frontend operates on a dual-branch enterprise CI/CD workflow managed via Vercel:

### 1. Production Environment (`main` Branch)
*   **Live URL**: [https://www.orangeglobal.co](https://www.orangeglobal.co)
*   **Purpose**: Stable, customer-facing production release.
*   **API Connection**: Connected to the live Render production backend (`https://orangeglobal-backend.onrender.com/api/v1`).
*   **Vercel Domain Setting**: Attached to `www.orangeglobal.co` with Git Branch set to `main`.

### 2. Testing / Staging Environment (`staging` Branch)
*   **Live URL**: [https://orangeglobal.co](https://orangeglobal.co)
*   **Purpose**: Pre-production quality assurance (QA) and mobile responsiveness verification.
*   **API Connection**: Connected to the live Render production backend (via Vercel `Preview` environment variables).
*   **Vercel Domain Setting**: Attached to `orange-global-hire.vercel.app` with Git Branch set to `staging`.

### 🔄 Deployment Workflow
1. All new feature development, UI updates, and resume intelligence enhancements are committed and pushed to the `staging` branch.
2. Vercel automatically deploys the `staging` branch to `https://orange-global-hire.vercel.app` for rigorous cross-device testing.
3. Once verified, a Pull Request (PR) is merged from `staging` into `main`, triggering a zero-downtime production release on `https://www.orangeglobal.co`.

---

© 2026 Orange Global. All rights reserved.
