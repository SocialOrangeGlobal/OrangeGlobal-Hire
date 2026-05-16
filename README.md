# Orange Global - Staffing & Talent Solutions Portal

![Orange Global Logo](public/images/brand-logo-dark.png)

A premium, high-fidelity recruitment and consulting platform designed for the modern global economy. This portal provides a seamless bridge between ambitious organizations and elite professionals through AI-enhanced screening, enterprise-grade talent solutions, and fully-featured management dashboards.

## 🚀 Key Features

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
*   **Profile Score Engine**: Dynamic completion tracking with a visual meter and optimization suggestions.
*   **Responsive Profile Drawers**: High-fidelity right-side drawer for quick access to professional info and contact details.
*   **Section-Based Editing**: Managed technical skills, work experience, and personal bio with a premium UI.

### 💼 Recruitment & Job Board
*   **Dynamic Discovery**: Real-time filtering by keywords, industry, and location.
*   **High-Fidelity Modals**: Feature-rich modals with social sharing and deep-link integration.
*   **Streamlined Apply Flow**: Multi-step registration for talent with AI-assisted resume scoring.

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
*   **Live URL**: [https://orange-global-hire.vercel.app](https://orange-global-hire.vercel.app)
*   **Purpose**: Pre-production quality assurance (QA) and mobile responsiveness verification.
*   **API Connection**: Connected to the live Render production backend (via Vercel `Preview` environment variables).
*   **Vercel Domain Setting**: Attached to `orange-global-hire.vercel.app` with Git Branch set to `staging`.

### 🔄 Deployment Workflow
1. All new feature development, UI updates, and resume intelligence enhancements are committed and pushed to the `staging` branch.
2. Vercel automatically deploys the `staging` branch to `https://orange-global-hire.vercel.app` for rigorous cross-device testing.
3. Once verified, a Pull Request (PR) is merged from `staging` into `main`, triggering a zero-downtime production release on `https://www.orangeglobal.co`.

---

© 2026 Orange Global. All rights reserved.
