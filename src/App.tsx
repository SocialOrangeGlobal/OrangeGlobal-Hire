import { useState, useEffect } from 'react';
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
import ForgotPassword from './pages/ForgotPassword';

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderContent = () => {
    if (currentHash === '#signin') return <SignIn />;
    if (currentHash === '#signup-employer') return <SignUpEmployer />;
    if (currentHash === '#signup-talent') return <SignUpTalent />;
    if (currentHash === '#signup-choice') return <SignUpChoice />;

    // Nav Items
    if (currentHash.startsWith('#jobs')) return <Jobs />;
    if (currentHash.startsWith('#hire-talent')) return <HireTalent />;
    if (currentHash.startsWith('#consulting')) return <Consulting />;
    if (currentHash.startsWith('#insights')) return <Insights />;
    if (currentHash.startsWith('#apply-job')) return <ApplyJob />;
    if (currentHash === '#forgot-password') return <ForgotPassword />;

    return (
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
  };

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-1">
        {renderContent()}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;
