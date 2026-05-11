# Orange Global Hire - Staffing Portal

![Orange Global Logo](public/images/brand-logo-dark.png)

A premium, enterprise-grade staffing and recruitment portal built with React, TypeScript, and Tailwind CSS. This platform connects exceptional professionals with world-class organizations, featuring a modern, responsive design and high-end interactive components.

## 🚀 Latest Updates
- **Full Responsive Overhaul**: Optimized all authentication pages (SignIn, SignUpChoice, SignUpEmployer, SignUpTalent) for 320px+ viewports.
- **Improved Global Branding**: Refined Navbar and Footer with adaptive logo sizing, circular branding icons, and a cohesive design system.
- **Enhanced Mobile UX**: Standardized touch targets, fluid grids, and responsive padding across the entire multi-step registration flow.
- **Layout Consistency**: Implemented unified page structures (`min-h-screen pt-20`) to eliminate horizontal scrolling and layout shifts.

## 🛠️ Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Carousels**: [Swiper](https://swiperjs.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏗️ Project Structure

```text
src/
├── components/         # Reusable UI components
│   ├── layouts/        # Global layouts (Navbar, Footer)
│   ├── sections/       # Feature-specific page sections
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   └── Testimonials.tsx
│   └── ui/             # Atomic UI elements (Button, Badge)
├── pages/              # Full page views
│   ├── SignIn.tsx      # Multi-tenant login
│   ├── SignUpChoice.tsx# Auth entry point
│   ├── SignUpEmployer.tsx
│   └── SignUpTalent.tsx# Complex multi-step onboarding
├── data/               # Static configuration and constants
├── hooks/              # Shared custom React hooks
├── types/              # Global TypeScript definitions
└── utils/              # Animation variants and helper functions
```

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SocialOrangeGlobal/OrangeGlobal-Hire.git

   cd OrangeGlobal-Hire
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

© 2026 Orange Global. All rights reserved.
