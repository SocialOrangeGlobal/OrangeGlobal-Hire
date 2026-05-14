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
│   ├── modals/        # Centralized modal components (Dashboard, Job Details, Profile)
│   ├── sections/      # Hero, Stats, Services, CTA, DashboardPreview
│   └── ui/            # Reusable components (Button, Badge, Dropdown, Chatbot)
├── pages/             
│   ├── TalentDashboard    # Talent Command Hub with application tracking
│   ├── EmployerDashboard  # Recruitment management for companies
│   ├── Jobs/ApplyJob      # Job board and multi-step application flow
│   ├── HireTalent         # Enterprise staffing solution services
│   ├── Consulting         # Strategic business transformation frameworks
│   ├── Insights           # Market analysis and leadership resources
│   └── Auth/SignUp        # Choice-based authentication flows (Talent vs Employer)
├── hooks/             # Custom React hooks (useScrolled)
├── data/              # Centralized mock data, content mapping, and nav structures
├── utils/             # Helper functions and Framer Motion animation variants
├── types/             # Centralized TypeScript interfaces for all components and pages
└── App.tsx            # HashRouter logic and root application structure
```

## 🛠️ Technology Stack

*   **Framework**: [React](https://reactjs.org/) 18+ with [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Mobile-First approach)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) (Spring physics & glassmorphism)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🏁 Getting Started

### Prerequisites
*   Node.js (v18+)
*   npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/orange-global-hire.git
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

---

© 2026 Orange Global. All rights reserved.
