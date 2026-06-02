import { useLocation } from 'react-router-dom';
import { CheckCircle2, Globe, ShieldCheck, ChevronDown, Info, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import migrationData from '../../data/migrationData.json';
import SEO from '../../components/seo/SEO';

/* ─── Types ───────────────────────────────────────────── */

interface KeyValue {
  label: string;
  value: string;
}

interface FAQEntry {
  question: string;
  answer: string[];
}

interface Section {
  id: string;
  title?: string;
  type: string;
  body?: string[];
  items?: string[] | FAQEntry[];
  keyValues?: KeyValue[];
  columns?: string[];
  rows?: Record<string, string>[];
}

interface VisaEntry {
  id: string;
  title: string;
  pageTitle: string;
  slug: string;
  url: string;
  category: string;
  summary: string;
  sections: Section[];
}

/* ─── Category → Hero Image Map ────────────────────────── */

const CATEGORY_IMAGES: Record<string, string> = {
  'Skilled Visa': '/images/visas/skilled-visa.png',
  'Employer Sponsored': '/images/visas/employer-sponsored.png',
  'Family visa': '/images/visas/family-visa.png',
  'Appeal & Review': '/images/visas/appeal-review.png',
  'Other Visas': '/images/visas/other-visas.png',
};

/* ─── FAQ Accordion ────────────────────────────────────── */
 
function FAQItem({ question, answer }: { question: string; answer: string[] }) {
  const [open, setOpen] = useState(false);
 
  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm hover:border-rh-teal/30 hover:shadow-md transition-all duration-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left bg-gray-50/80 hover:bg-white transition-colors"
      >
        <span className="font-semibold text-rh-teal text-sm xs:text-base md:text-[17px] leading-snug">{question}</span>
        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${open ? 'bg-rh-teal/10' : 'bg-white shadow-sm border border-gray-100'}`}>
          <ChevronDown className={`w-4.5 h-4.5 transition-transform duration-300 ${open ? 'rotate-180 text-rh-teal' : 'text-gray-400'}`} />
        </div>
      </button>
 
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-5 border-t border-gray-100 space-y-2 bg-white">
              {answer?.map((a, j) => (
                <p key={j} className="text-gray-600 text-xs xs:text-sm md:text-[15px] leading-relaxed m-0">{a}</p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
 
/* ─── Section Title ────────────────────────────────────── */
 
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
      <div className="w-1 h-5 sm:w-1.5 sm:h-7 bg-rh-red rounded-full shrink-0" />
      <h3 className="text-base xs:text-lg md:text-2xl font-bold text-rh-teal m-0 leading-tight">{children}</h3>
    </div>
  );
}
 
/* ─── Section Renderers ────────────────────────────────── */
 
function BodyBlock({ body }: { body: string[] }) {
  return (
    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
      {body.map((p, i) => (
        <p key={i} className="text-gray-600 leading-relaxed text-xs xs:text-sm md:text-[16px]">{p}</p>
      ))}
    </div>
  );
}
 
function ListBlock({ items }: { items: string[] }) {
  return (
    <div className="grid gap-2 mb-4 sm:mb-6">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-2.5 bg-gray-50/60 p-3 sm:p-4 rounded-xl border border-gray-100 hover:border-rh-teal/20 hover:bg-rh-teal/[0.03] transition-all duration-200"
        >
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-rh-red shrink-0 mt-0.5" />
          <span className="text-gray-700 text-xs xs:text-sm md:text-[15px] leading-relaxed">{item}</span>
        </div>
      ))}
    </div>
  );
}
 
function KeyValuesBlock({ keyValues }: { keyValues: KeyValue[] }) {
  // Use 2 cols for ≤4 items, 3 cols for more
  const gridCols = keyValues.length <= 4 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';
  return (
    <div className={`grid ${gridCols} gap-3 sm:gap-4 mb-4 sm:mb-6`}>
      {keyValues.map((kv, i) => (
        <div
          key={i}
          className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rh-teal bg-rh-teal/5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md inline-block mb-2 sm:mb-3">
            {kv.label}
          </span>
          <p className="text-gray-700 text-xs xs:text-sm md:text-[15px] leading-relaxed m-0">{kv.value}</p>
        </div>
      ))}
    </div>
  );
}
 
function TableBlock({ columns, rows }: { columns: string[]; rows: Record<string, string>[] }) {
  return (
    <div className="overflow-x-auto mb-4 sm:mb-6 rounded-2xl border border-gray-200 shadow-sm">
      <table className="w-full text-left border-collapse min-w-max">
        <thead>
          <tr className="bg-rh-teal text-white">
            {columns.map((col, i) => (
              <th key={i} className="p-3 sm:p-4 font-semibold text-xs sm:text-sm whitespace-nowrap first:rounded-tl-2xl last:rounded-tr-2xl">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-rh-teal/[0.03] transition-colors group">
              {columns.map((col, j) => (
                <td key={j} className="p-3 sm:p-4 text-xs xs:text-sm md:text-[15px] text-gray-600 group-hover:text-gray-800 transition-colors">{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Main VisaPage ────────────────────────────────────── */

export default function VisaPage() {
  const location = useLocation();
  const slug = location.pathname.split('/').filter(Boolean).pop();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const visa = (migrationData as VisaEntry[]).find((v) => {
    const urlParts = v.url?.split('/').filter(Boolean) || [];
    const dataSlug = v.slug || urlParts[urlParts.length - 1] || v.id;
    return dataSlug === slug || v.id === slug;
  });

  /* ─ 404 ─ */
  if (!visa) {
    return (
      <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center justify-center min-h-[420px]">
        <div className="w-16 h-16 rounded-2xl bg-rh-red/10 flex items-center justify-center mb-6">
          <Globe className="w-8 h-8 text-rh-red" />
        </div>
        <h2 className="text-2xl font-bold text-rh-teal mb-3">Visa Not Found</h2>
        <p className="text-gray-500 max-w-sm">We couldn't find the requested visa subclass. Please select a valid visa from the sidebar menu.</p>
      </div>
    );
  }

  const { summary, sections = [] } = visa;
  const heroImage = CATEGORY_IMAGES[visa.category] || CATEGORY_IMAGES['Other Visas'];

  return (
    <>
      <SEO
        title={`${visa.pageTitle || visa.title} | Orange Global Migration`}
        description={summary || `Information about ${visa.title} migration to Australia.`}
      />

      <motion.div
        key={slug}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full space-y-8"
      >
        {/* ─── Hero Banner ─── */}
        <div className="relative h-[180px] xs:h-[260px] md:h-[360px] w-full rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-md group">
          <img
            src={heroImage}
            alt={visa.category}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/85 via-gray-900/40 to-transparent" />
 
          <div className="absolute bottom-0 left-0 w-full p-4 xs:p-6 md:p-10 pb-6 md:pb-12">
            <span className="inline-block px-2 py-1 rounded bg-rh-red text-white text-[9px] sm:text-[11px] font-bold uppercase tracking-widest mb-2 sm:mb-3">
              {visa.category}
            </span>
            <h1 className="text-lg xs:text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl drop-shadow-sm">
              {visa.pageTitle || visa.title}
            </h1>
          </div>
        </div>
 
        {/* ─── Summary Card ─── */}
        {summary && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100">
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-rh-teal/10 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-rh-teal" />
              </div>
              <p className="text-gray-600 leading-relaxed text-xs xs:text-sm md:text-lg pt-0.5">{summary}</p>
            </div>
          </div>
        )}
 
        {/* ─── Refusal Appeal Dynamic Layout Info Grid ─── */}
        {slug === 'visa-refusal-appeal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full animate-fadeIn">
            {/* Fee Information Card */}
            <div className="bg-[#081B2D] text-white rounded-[1.5rem] sm:rounded-[2rem] p-5 md:p-8 border border-white/10 relative overflow-hidden shadow-md group w-full">
              <div className="absolute top-0 right-0 w-36 h-36 bg-rh-red/10 rounded-full blur-2xl -mr-12 -mt-12" />
              <h4 className="text-sm xs:text-base md:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rh-red/20 flex items-center justify-center">
                  <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rh-red" />
                </div>
                AAT Appeal Fees
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 relative z-10">
                <div className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                  <span className="text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 block">Standard Fee</span>
                  <span className="text-lg sm:text-2xl font-extrabold text-white mt-0.5 sm:mt-1 block">A$3,000</span>
                  <span className="text-[8px] sm:text-[10px] text-gray-400 mt-1 sm:mt-1.5 block leading-relaxed">Payable to the AAT for appeal processing.</span>
                </div>
 
                <div className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                  <span className="text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 block">Reduced Fee (50%)</span>
                  <span className="text-lg sm:text-2xl font-extrabold text-rh-red mt-0.5 sm:mt-1 block">A$1,500</span>
                  <span className="text-[8px] sm:text-[10px] text-gray-400 mt-1 sm:mt-1.5 block leading-relaxed">Under severe financial hardship criteria.</span>
                </div>
              </div>
              <div className="flex items-start gap-1.5 text-[9px] sm:text-xs text-gray-300 bg-white/5 p-2.5 sm:p-3 rounded-lg sm:rounded-xl leading-relaxed mt-3 sm:mt-4 relative z-10">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rh-red mt-0.5" />
                <span>Exceptions: Bridging visa appeals resulting in detention require no fee upfront.</span>
              </div>
            </div>
 
            {/* Time Limits Warning */}
            <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-5 md:p-8 border border-gray-150 shadow-sm flex flex-col justify-between w-full">
              <div>
                <h4 className="text-sm xs:text-base md:text-lg font-bold text-rh-teal mb-2.5 sm:mb-3 flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rh-teal/5 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rh-teal" />
                  </div>
                  Strict Time Limits Apply!
                </h4>
                <p className="text-xs xs:text-sm text-gray-600 leading-relaxed">
                  Applications for review MUST be lodged with the AAT within the statutory timeframes. The AAT has <strong>no jurisdiction</strong> to extend these limits.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                <div className="bg-rh-teal/5 p-2.5 sm:p-3 rounded-xl text-center">
                  <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Visa Refusal</span>
                  <span className="text-sm sm:text-base font-extrabold text-rh-teal mt-0.5 sm:mt-1 block">21 Days</span>
                </div>
                <div className="bg-rh-red/5 p-2.5 sm:p-3 rounded-xl text-center">
                  <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Visa Cancellation</span>
                  <span className="text-sm sm:text-base font-extrabold text-rh-red mt-0.5 sm:mt-1 block">7 Days</span>
                </div>
              </div>
            </div>
          </div>
        )}
 
        {/* ─── Standard Sections Rendering ─── */}
        <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 md:p-10 shadow-sm border border-gray-100">
          <div className="space-y-8 sm:space-y-12">
            {sections.map((section, idx) => {
              /* FAQ */
              if (section.type === 'faq' && section.items) {
                return (
                  <div key={idx} id={section.id} className="scroll-mt-24">
                    {section.title && <SectionTitle>{section.title}</SectionTitle>}
                    <div className="space-y-2.5 sm:space-y-3">
                      {(section.items as FAQEntry[]).map((faq, i) => (
                        <FAQItem key={i} question={faq.question} answer={faq.answer} />
                      ))}
                    </div>
                  </div>
                );
              }
 
              /* Table */
              if (section.type === 'table' && section.columns && section.rows) {
                return (
                  <div key={idx} id={section.id} className="scroll-mt-24">
                    {section.title && <SectionTitle>{section.title}</SectionTitle>}
                    {section.body && <BodyBlock body={section.body} />}
                    <TableBlock columns={section.columns} rows={section.rows} />
                  </div>
                );
              }
 
              /* richText / list / mixed — universal rendering */
              return (
                <div key={idx} id={section.id} className="scroll-mt-24">
                  {section.title && <SectionTitle>{section.title}</SectionTitle>}
                  {section.body && <BodyBlock body={section.body} />}
                  {section.items && (section.items as string[]).length > 0 && (
                    <ListBlock items={section.items as string[]} />
                  )}
                  {section.keyValues && section.keyValues.length > 0 && (
                    <KeyValuesBlock keyValues={section.keyValues} />
                  )}
                </div>
              );
            })}
          </div>
 
          {/* ─── Why Choose Orange Global ─── */}
          <div className="mt-12 sm:mt-16 bg-rh-light rounded-2xl p-4 sm:p-6 md:p-10 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-rh-red/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
 
            <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6 relative z-10">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl shadow-sm flex items-center justify-center">
                <ShieldCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-rh-teal" />
              </div>
              <h3 className="text-base sm:text-xl font-bold text-rh-teal">Why Choose Orange Global?</h3>
            </div>
 
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 relative z-10">
              {[
                'Comprehensive eligibility assessment',
                'End-to-end application management',
                'Registered Migration Agents (MARA)',
                'Priority document review',
                'Direct liaison with the Department',
                'Post-visa support services',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5 bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-white hover:border-rh-teal/20 hover:shadow-md transition-all duration-200">
                  <div className="w-6 h-6 rounded-full bg-rh-teal/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-rh-teal" />
                  </div>
                  <span className="text-gray-700 font-medium text-xs sm:text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
