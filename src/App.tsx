import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Hero from './components/sections/Hero';
import Stats from './components/sections/Stats';
import Services from './components/sections/Services';
import WhyChooseUs from './components/sections/WhyChooseUs';
import FeaturedJobs from './components/sections/FeaturedJobs';
import Testimonials from './components/sections/Testimonials';
import Industries from './components/sections/Industries';
import Cta from './components/sections/Cta';
import Footer from './components/layouts/Footer';
import Chatbot from './components/ui/Chatbot';
import SignIn from './pages/SignIn';
import SignUpEmployer from './pages/SignUpEmployer';
import SignUpTalent from './pages/SignUpTalent';
import SignUpChoice from './pages/SignUpChoice';
import Jobs from './pages/Jobs';
import HireTalent from './pages/HireTalent';
import Consulting from './pages/Consulting';
import Insights from './pages/Insights';
import ApplyJob from './pages/ApplyJob';
import PostVacancy from './pages/PostVacancy';
import ForgotPassword from './pages/ForgotPassword';
import Contact from './pages/Contact';
import EmployerDashboard from './pages/EmployerDashboard';
import TalentDashboard from './pages/TalentDashboard';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import { Toaster } from 'react-hot-toast';

const LandingPage = () => (
  <>
    <Hero />
    <Stats />
    <Services />
    <WhyChooseUs />
    <FeaturedJobs />
    <Testimonials />
    <Industries />
    <Cta />
  </>
);

import { AuthProvider } from './hooks/useAuth';

import ManageProfile from './pages/ManageProfile';

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AuthProvider>
      <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col relative">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup-employer" element={<SignUpEmployer />} />
            <Route path="/signup-talent" element={<SignUpTalent />} />
            <Route path="/signup-choice" element={<SignUpChoice />} />
            <Route path="/manage-profile" element={<ManageProfile />} />
            <Route path="/employer-dashboard/*" element={<EmployerDashboard />} />
            <Route path="/talent-dashboard/*" element={<TalentDashboard />} />
            <Route path="/jobs/*" element={<Jobs />} />
            <Route path="/hire-talent/*" element={<HireTalent />} />
            <Route path="/consulting/*" element={<Consulting />} />
            <Route path="/insights/*" element={<Insights />} />
            <Route path="/apply-job/*" element={<ApplyJob />} />
            <Route path="/post-vacancy/*" element={<PostVacancy />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}

export default App;
