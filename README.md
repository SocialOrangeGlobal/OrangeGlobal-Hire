# Orange Global - Staffing & Talent Solutions Portal

![Orange Global Logo](public/images/brand-logo-dark.png)

A premium, high-fidelity recruitment and consulting platform designed for the modern global economy. This portal provides a seamless bridge between ambitious organizations and elite professionals through AI-enhanced screening and enterprise-grade talent solutions.

## 🚀 Key Features

### 🤖 AI-Powered Support
*   **Orange AI Assistant**: A custom-built, floating AI chatbot that provides instant support.
*   **Smart Contextual Routing**: Guides users to the correct portal sections (Jobs, Hiring, Consulting) based on natural language queries.
*   **Branded Experience**: Fully integrated into the `rh-red` design system with professional animations and real-time typing simulations.

### 💼 Recruitment & Job Board
*   **Dynamic Job Discovery**: Real-time filtering by keywords and location.
*   **Job Details Modal**: High-fidelity, responsive modal with full social sharing capabilities (LinkedIn, Twitter/X, Facebook).
*   **Apply Flow**: Streamlined application process with multi-step talent registration.

### 🏢 Enterprise Solutions
*   **Hire Talent Portal**: Specialized staffing solutions (Permanent, Executive Search, Contract).
*   **Consulting Services**: Strategic frameworks for business transformation and technology solutions.
*   **Insights Engine**: Market analysis, salary guides, and leadership resources.

### 🔐 Advanced Authentication
*   **Multi-Role Access**: Dedicated flows for both Talent and Employers.
*   **Secure Recovery**: Fully functional "Forgot Password" flow with email verification states.
*   **Responsive UI**: Optimized for all viewports—from mobile smartphones to ultra-wide desktop monitors.

## 🏗️ Project Structure

```text
src/
├── components/
│   ├── layouts/       # Navbar, Footer
│   ├── sections/      # Hero, Stats, Services, CTA, etc.
│   └── ui/            # Reusable components (Button, Modal, Badge)
├── pages/             # Page components (Jobs, HireTalent, SignIn, etc.)
├── hooks/             # Custom React hooks (useScrolled)
├── data/              # Static content and navigation mapping
├── utils/             # Helper functions and animation variants
├── types/             # TypeScript interfaces and types
└── App.tsx            # Root component with HashRouter logic
```

## 🛠️ Technology Stack

*   **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
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
The portal uses a **mobile-first** design approach. Navigation transitions to a clean mobile drawer at the `xl` (1280px) breakpoint to ensure perfect usability on tablets and smaller laptops.

---

© 2026 Orange Global. All rights reserved.
