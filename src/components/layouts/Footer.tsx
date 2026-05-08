import { Briefcase, Linkedin, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  Services: ['Permanent Staffing', 'Contract Staffing', 'Executive Search', 'Project Solutions', 'Managed Staffing'],
  Industries: ['Banking & Finance', 'Technology', 'Healthcare', 'Legal', 'Manufacturing', 'Retail'],
  Company: ['About Orange Global', 'Our Approach', 'Leadership', 'Press Room', 'Careers at Orange Global', 'Social Responsibility'],
  Resources: ['Salary Guide', 'Job Market Report', 'Hiring Insights', 'Career Advice', 'Blog', 'Webinars'],
};

export default function Footer() {
  return (
    <footer className="bg-rh-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5">
              <div className="w-48">
                <img src="/images/brand-logo-light.png" alt="Logo" />
              </div>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Connecting exceptional professionals with world-class organizations since 1948. Your career, our expertise.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-rh-red" />
                <span>+91-1204232996, +91-70655-57774</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-rh-red" />
                <span>info@orangeglobal.in</span>
              </div>
              <div className="flex items-center  gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-rh-red" />
                <span>Chandigarh, India</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {[Linkedin, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/50 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div className='mt-12' key={group}>
              <h3 className="font-bold text-sm uppercase tracking-wider text-white mb-4">{group}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="py-8 border-b border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-base text-white mb-1">Stay ahead of the market</h3>
              <p className="text-sm text-gray-400">Get salary data, hiring trends, and insights delivered monthly.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-5 py-3 bg-white/10 border border-white/20 rounded-full text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
              />
              <button className="px-6 py-3 bg-rh-red hover:bg-red-700 text-white text-sm font-semibold rounded-full transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; 2026 Orange Global, All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Use', 'Accessibility', 'Sitemap'].map((item) => (
              <a key={item} href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
