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
import SignIn from './pages/SignIn';
import SignUpEmployer from './pages/SignUpEmployer';
import SignUpTalent from './pages/SignUpTalent';
import SignUpChoice from './pages/SignUpChoice';

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentHash === '#signin') {
    return <SignIn />;
  }
  if (currentHash === '#signup-employer') {
    return <SignUpEmployer />;
  }
  if (currentHash === '#signup-talent') {
    return <SignUpTalent />;
  }
  if (currentHash === '#signup-choice') {
    return <SignUpChoice />;
  }

  return (
    <div className="font-sans text-gray-900 bg-white">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Services />
        <WhyChooseUs />
        <FeaturedJobs />
        <Testimonials />
        <Industries />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}

export default App;
