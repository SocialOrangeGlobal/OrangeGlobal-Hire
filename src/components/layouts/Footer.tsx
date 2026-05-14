import { Linkedin, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { footerLinks } from '../../data';

export default function Footer() {
  return (
    <footer className="bg-[#0A0D10] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-12 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2">
              <img src="/images/logo-icon.png" alt="Logo" className="w-20 sm:w-25 lg:w-30" />
              <p className="text-gray-400 text-sm leading-relaxed text-center sm:text-left max-w-sm">
                Orange Global is a <a href="https://orangeglobal.in/" className="text-rh-red hover:underline">leading staffing & talent solutions</a>
              </p>
            </div>

            <div className="space-y-5 mt-8">
              <div className="flex items-center gap-4 text-sm text-gray-400 group cursor-pointer justify-center sm:justify-start">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-rh-red transition-all duration-300">
                  <Phone className="w-4 h-4 text-rh-red group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/40">Call Us</span>
                  <span className="group-hover:text-white transition-colors font-medium">+61 4515197266</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400 group cursor-pointer justify-center sm:justify-start">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-rh-red transition-all duration-300">
                  <Mail className="w-4 h-4 text-rh-red group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/40">Email Us</span>
                  <span className="group-hover:text-white transition-colors font-medium">info@orangeglobal.in</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400 group cursor-pointer justify-center sm:justify-start">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-rh-red transition-all duration-300">
                  <MapPin className="w-4 h-4 text-rh-red group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/40">Visit Us</span>
                  <span className="group-hover:text-white transition-colors font-medium">Level 7, 276 Flinders Street, Melbourne 3000 VIC, Australia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group} className="flex flex-col text-center sm:text-left mt-8">
              <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-white mb-8 border-b border-white/5 pb-3 inline-block sm:self-start">
                {group}
              </h3>
              <ul className="space-y-4">
                {links.map((link) => {
                  let href = "#";
                  if (link === 'Permanent Staffing' || link === 'Managed Staffing' || link === 'Executive Search') href = "#hire-talent";
                  if (link === 'Project Solutions') href = "#consulting";
                  if (link === 'Careers at Orange Global') href = "#jobs";
                  if (link === 'Hiring Insights' || link === 'Blog' || link === 'Job Market Report' || link === 'Salary Guide') href = "#insights";

                  return (
                    <li key={link}>
                      <a href={href} className="text-[13px] text-gray-400 hover:text-rh-red hover:translate-x-1 transition-all inline-block">
                        {link}
                      </a>
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
              <h3 className="font-bold text-2xl text-white mb-3 tracking-tight">Stay ahead of the market</h3>
              <p className="text-gray-400 leading-relaxed">Get exclusive salary data, hiring trends, and career insights delivered to your inbox.</p>
            </div>
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 items-center justify-center">
              <div className="relative w-full sm:w-80">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  placeholder="Enter your work email"
                  className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rh-red/50 focus:bg-white/10 transition-all shadow-inner"
                />
              </div>
              <button className="w-full sm:w-auto px-10 py-4 bg-rh-red hover:bg-red-700 text-white text-sm font-bold rounded-2xl transition-all whitespace-nowrap shadow-xl shadow-red-900/20 active:scale-95">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <p className="text-[13px] text-gray-500 font-medium">
              &copy; 2026 Orange Global. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {[Linkedin, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-rh-red hover:text-white transition-all duration-300 shadow-lg">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-x-8 gap-y-4">
            {['Privacy Policy', 'Terms of Use', 'Accessibility', 'Sitemap'].map((item) => (
              <a key={item} href="#" className="text-[12px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
