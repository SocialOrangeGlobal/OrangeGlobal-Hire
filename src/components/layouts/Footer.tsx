import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { footerLinks, contactDetails } from '../../data';
import { useAppSelector } from '../../store';
import toast from 'react-hot-toast';
import { contactApi } from '../../lib/contact';

export default function Footer() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [formLoadedAt] = useState(() => Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredFooterLinks = Object.entries(footerLinks).filter(([group]) => {
    if (!isAuthenticated && group === 'Services') return false;
    return true;
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setIsSubmitting(true);
    try {
      await contactApi.submitMessage({
        fullName: 'Newsletter Subscriber',
        email: email.trim(),
        subject: 'Newsletter Subscription',
        message: `New newsletter subscription from: ${email.trim()}`,
        type: 'NEWSLETTER',
        website: honeypot || undefined,
        _formLoadedAt: formLoadedAt,
      });
      toast.success('Successfully subscribed to the newsletter!');
      setEmail('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#0A0D10] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img src="/images/logo-icon.png" alt="Logo" className="w-24 sm:w-20 lg:w-24 shrink-0" />
              <p className="text-gray-400 text-sm leading-relaxed text-center sm:text-left max-w-sm">
                Orange Global is a <a href="https://orangeglobal.in/" target="_blank" rel="noopener noreferrer" className="text-rh-red hover:underline">leading staffing & talent solutions</a> provider dedicated to connecting top talent with world-class opportunities.
              </p>
            </div>

            <div className="space-y-6 mt-8">
              <div className="flex items-start gap-4 text-sm text-gray-400 group cursor-pointer justify-start">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-rh-red transition-all duration-300 shrink-0">
                  <Phone className="w-4 h-4 text-rh-red group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/40 mb-1">Call Us</span>
                  <span className="group-hover:text-white transition-colors font-medium">{contactDetails.phone}</span>
                </div>
              </div>
              <div className="flex items-start gap-4 text-sm text-gray-400 group cursor-pointer justify-start">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-rh-red transition-all duration-300 shrink-0">
                  <Mail className="w-4 h-4 text-rh-red group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/40 mb-1">Email Us</span>
                  <span className="group-hover:text-white transition-colors font-medium break-all">{contactDetails.email}</span>
                </div>
              </div>
              <div className="flex items-start gap-4 text-sm text-gray-400 group cursor-pointer justify-start">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-rh-red transition-all duration-300 shrink-0">
                  <MapPin className="w-4 h-4 text-rh-red group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/40 mb-1">Visit Us</span>
                  <span className="group-hover:text-white transition-colors font-medium leading-relaxed">{contactDetails.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links */}
          {filteredFooterLinks.map(([group, links]) => (
            <div key={group} className="flex flex-col text-center sm:text-left mt-8">
              <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-white mb-8 border-b border-white/5 pb-3 inline-block sm:self-start">
                {group}
              </h3>
              <ul className="space-y-4">
                {links.map((link) => {
                  let href = "/";
                  // Services
                  if (link === 'Find Jobs') {
                    href = "/jobs";
                  } else if (link === 'Permanent Staffing' || link === 'Contract Staffing' || link === 'Executive Search' || link === 'Managed Staffing') {
                    href = "/jobs";
                  } else if (link === 'Project Solutions' || link === 'Consulting') {
                    href = "/consulting";
                  } else if (link === 'Insights') {
                    href = "/insights";
                  }
                  // Migration
                  else if (link === 'Skilled Migration') {
                    href = "/migration";
                  } else if (link === 'Points Calculator') {
                    href = "/migration/points-calculator";
                  } else if (link === 'Profile Evaluation') {
                    href = "/migration/profile-evaluation";
                  } else if (link === 'AAT Review') {
                    href = "/migration/appeal-review/visa-refusal-appeal/aat-review";
                  }
                  // Industries
                  else if (link === 'Banking & Finance' || link === 'Technology' || link === 'Healthcare' || link === 'Legal' || link === 'Manufacturing' || link === 'Retail') {
                    href = "/jobs";
                  }
                  // Resources
                  else if (link === 'Salary Guide' || link === 'Job Market Report' || link === 'Hiring Insights' || link === 'Career Advice' || link === 'Blog' || link === 'Webinars') {
                    href = "/insights";
                  }

                  return (
                    <li key={link}>
                      <Link to={href} className="text-[13px] text-gray-400 hover:text-rh-red hover:translate-x-1 transition-all inline-block">
                        {link}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="py-12 border-b border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-md text-center lg:text-left">
              <h3 className="font-bold text-xl text-white mb-2 tracking-tight">Stay ahead of the market</h3>
              <p className="text-gray-400 leading-relaxed">Get exclusive salary data, hiring trends, and career insights delivered to your inbox.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 items-center justify-center">
              {/* Honeypot field - invisible to humans, filled by spam bots */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="relative w-full sm:w-80">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  disabled={isSubmitting}
                  className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rh-red/50 focus:bg-white/10 transition-all shadow-inner disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-10 py-4 bg-rh-red hover:bg-red-700 text-white text-sm font-bold rounded-2xl transition-all whitespace-nowrap shadow-xl shadow-red-900/20 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <p className="text-[13px] text-gray-500 font-medium">
              &copy; 2026 Orange Global. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://www.linkedin.com/company/orangeglobal-co/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-rh-red hover:text-white transition-all duration-300 shadow-lg"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-x-8 gap-y-4">
            <Link to="/privacy-policy" className="text-[12px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="text-[12px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
