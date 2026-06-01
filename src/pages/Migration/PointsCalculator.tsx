import { useState, useMemo } from 'react';
import { Calculator, Award, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/seo/SEO';

interface CalculatorOption {
  label: string;
  points: number;
}

interface CalculatorSection {
  id: string;
  title: string;
  description?: string;
  options: Record<string, CalculatorOption>;
}

const AGE_SECTION: CalculatorSection = {
  id: 'age',
  title: 'Age Profile',
  description: 'Your age at the time you are invited to apply for the visa.',
  options: {
    '18-24': { label: '18 – 24 years old', points: 25 },
    '25-32': { label: '25 – 32 years old', points: 30 },
    '33-39': { label: '33 – 39 years old', points: 25 },
    '40-44': { label: '40 – 44 years old', points: 15 },
    '45-49': { label: '45 – 49 years old', points: 0 },
  }
};

const ENGLISH_SECTION: CalculatorSection = {
  id: 'english',
  title: 'English Language Ability',
  description: 'Test scores (IELTS, PTE, etc.) proving language capability.',
  options: {
    'superior': { label: 'Superior English (e.g. IELTS 8+, PTE 79+)', points: 20 },
    'proficient': { label: 'Proficient English (e.g. IELTS 7+, PTE 65+)', points: 10 },
    'competent': { label: 'Competent English (e.g. IELTS 6+, PTE 50+)', points: 0 },
  }
};

const OVERSEAS_WORK_SECTION: CalculatorSection = {
  id: 'overseasWork',
  title: 'Overseas Skilled Employment',
  description: 'Employment outside Australia in your nominated occupation (in last 10 years).',
  options: {
    'none': { label: 'Less than 3 years', points: 0 },
    '3-4': { label: '3 – 4 years', points: 5 },
    '5-7': { label: '5 – 7 years', points: 10 },
    '8+': { label: '8 or more years', points: 15 },
  }
};

const AUSTRALIAN_WORK_SECTION: CalculatorSection = {
  id: 'australianWork',
  title: 'Australian Skilled Employment',
  description: 'Employment inside Australia in your nominated occupation (in last 10 years).',
  options: {
    'none': { label: 'Less than 1 year', points: 0 },
    '1-2': { label: '1 – 2 years', points: 5 },
    '3-4': { label: '3 – 4 years', points: 10 },
    '5-7': { label: '5 – 7 years', points: 15 },
    '8+': { label: '8 or more years', points: 20 },
  }
};

const EDUCATION_SECTION: CalculatorSection = {
  id: 'education',
  title: 'Educational Qualifications',
  description: 'Your highest completed qualification from an eligible institution.',
  options: {
    'doctorate': { label: 'Doctorate / PhD', points: 20 },
    'bachelor': { label: 'Bachelor Degree', points: 15 },
    'diploma': { label: 'Advanced Diploma / Associate / Diploma / Trade Certificate', points: 10 },
    'none': { label: 'Other Qualifications', points: 0 },
  }
};

const STEM_SECTION: CalculatorSection = {
  id: 'stem',
  title: 'Specialist Education (STEM)',
  description: 'Masters by research or Doctoral degree from an Australian institution (STEM fields).',
  options: {
    'none': { label: 'Does not apply', points: 0 },
    'yes': { label: 'Eligible Postgraduate STEM Degree (2+ academic years in AU)', points: 10 },
  }
};

const AU_STUDY_SECTION: CalculatorSection = {
  id: 'auStudy',
  title: 'Australian Study Requirement',
  description: 'Completed one or more degrees/diplomas in Australia taking at least 2 academic years.',
  options: {
    'none': { label: 'Does not apply', points: 0 },
    'yes': { label: 'Met Australian study requirement', points: 5 },
  }
};

const COMMUNITY_LANG_SECTION: CalculatorSection = {
  id: 'communityLang',
  title: 'Credentialled Community Language',
  description: 'Accredited by the National Accreditation Authority for Translators and Interpreters (NAATI).',
  options: {
    'none': { label: 'Does not apply', points: 0 },
    'yes': { label: 'Accredited NAATI Translator / Interpreter', points: 5 },
  }
};

const PARTNER_SECTION: CalculatorSection = {
  id: 'partner',
  title: 'Partner Skills',
  description: 'Partner or single status points allocation.',
  options: {
    'skilled_partner': { label: 'Partner has Competent English AND positive Skills Assessment in nominated occupation', points: 10 },
    'english_partner': { label: 'Partner has Competent English (but no skills assessment)', points: 5 },
    'single_or_pr': { label: 'Single applicant OR Partner is Australian Citizen / PR holder', points: 10 },
    'none': { label: 'Partner does not have competent English / skills assessment', points: 0 },
  }
};

const NOMINATION_SECTION: CalculatorSection = {
  id: 'nomination',
  title: 'Nomination or Sponsorship',
  description: 'State nomination points (Subclass 190) or Regional sponsorship (Subclass 491).',
  options: {
    'none': { label: 'Independent subclass 189 / No nomination', points: 0 },
    '190': { label: 'State Nomination (Subclass 190 visa) - adds 5 points', points: 5 },
    '491': { label: 'Regional Sponsorship / Family Regional (Subclass 491 visa) - adds 15 points', points: 15 },
  }
};

const PROFESSIONAL_YEAR_SECTION: CalculatorSection = {
  id: 'professionalYear',
  title: 'Professional Year in Australia',
  description: 'Completed a Professional Year in Australia in your field (in last 4 years).',
  options: {
    'none': { label: 'Does not apply', points: 0 },
    'yes': { label: 'Completed Professional Year (Accounting, ICT, or Engineering)', points: 5 },
  }
};

export default function PointsCalculator() {
  const [selections, setSelections] = useState<Record<string, string>>({
    age: '25-32',
    english: 'competent',
    overseasWork: 'none',
    australianWork: 'none',
    education: 'bachelor',
    stem: 'none',
    auStudy: 'none',
    communityLang: 'none',
    partner: 'none',
    nomination: 'none',
    professionalYear: 'none',
  });

  const totalPoints = useMemo(() => {
    let score = 0;
    score += AGE_SECTION.options[selections.age]?.points || 0;
    score += ENGLISH_SECTION.options[selections.english]?.points || 0;
    
    // CAPPED: Department of Home Affairs caps combined work experience (overseas + AU) at 20 points maximum.
    const overseasPts = OVERSEAS_WORK_SECTION.options[selections.overseasWork]?.points || 0;
    const australianPts = AUSTRALIAN_WORK_SECTION.options[selections.australianWork]?.points || 0;
    score += Math.min(20, overseasPts + australianPts);

    score += EDUCATION_SECTION.options[selections.education]?.points || 0;
    score += STEM_SECTION.options[selections.stem]?.points || 0;
    score += AU_STUDY_SECTION.options[selections.auStudy]?.points || 0;
    score += COMMUNITY_LANG_SECTION.options[selections.communityLang]?.points || 0;
    score += PARTNER_SECTION.options[selections.partner]?.points || 0;
    score += NOMINATION_SECTION.options[selections.nomination]?.points || 0;
    score += PROFESSIONAL_YEAR_SECTION.options[selections.professionalYear]?.points || 0;
    return score;
  }, [selections]);

  const ratingInfo = useMemo(() => {
    if (totalPoints < 65) {
      return {
        label: 'Ineligible / Below Threshold',
        colorClass: 'text-rh-red bg-rh-red/5 border-rh-red/20',
        desc: 'You require at least 65 points to log an Expression of Interest (EOI). Consider improving English scores, acquiring experience, or gaining state nomination (+5 or +15 points).'
      };
    } else if (totalPoints < 80) {
      return {
        label: 'Eligible & Good Potential',
        colorClass: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        desc: 'You meet the minimum threshold of 65 points. Depending on your occupation, state nomination, and the current pool, you have a solid foundation to receive invitations.'
      };
    } else {
      return {
        label: 'Highly Competitive Profile',
        colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        desc: 'With 80+ points, you have an exceptionally competitive score that makes you highly attractive for subclasses 189 and 190. Excellent profile!'
      };
    }
  }, [totalPoints]);

  const handleSelectOption = (sectionId: string, optionKey: string) => {
    setSelections(prev => ({ ...prev, [sectionId]: optionKey }));
  };

  return (
    <>
      <SEO
        title="Points Calculator Australia Visa | Orange Global Migration"
        description="Estimate your GSM skilled migration visa points score instantly. Discover subclass 189, 190, 491 points requirements."
      />

      <main className="pt-24 pb-20 lg:pt-32 bg-gray-50/50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <span className="inline-block px-3 py-1.5 rounded-lg bg-rh-red/10 text-rh-red text-xs font-bold uppercase tracking-widest">
              Points Assessment Tool
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-rh-teal tracking-tight leading-tight max-w-4xl mx-auto">
              Skilled Migration Points Calculator
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-base">
              Calculate your points for subclasses 189, 190, and 491. Discover how age, experience, qualification, and partners impact your score.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Calculator Panel */}
            <div className="flex-1 space-y-6">
              {[
                AGE_SECTION,
                ENGLISH_SECTION,
                EDUCATION_SECTION,
                OVERSEAS_WORK_SECTION,
                AUSTRALIAN_WORK_SECTION,
                STEM_SECTION,
                AU_STUDY_SECTION,
                COMMUNITY_LANG_SECTION,
                PROFESSIONAL_YEAR_SECTION,
                PARTNER_SECTION,
                NOMINATION_SECTION
              ].map((section) => (
                <div key={section.id} className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm transition hover:shadow-md">
                  <h3 className="text-lg font-bold text-rh-teal mb-1 flex items-center gap-2">
                    {section.title}
                  </h3>
                  {section.description && (
                    <p className="text-xs text-gray-400 mb-5 leading-relaxed">{section.description}</p>
                  )}

                  <div className="grid gap-3">
                    {Object.entries(section.options).map(([key, opt]) => {
                      const isSelected = selections[section.id] === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleSelectOption(section.id, key)}
                          className={`w-full flex items-center justify-between text-left p-4 rounded-xl border transition-all text-sm leading-relaxed ${
                            isSelected
                              ? 'bg-rh-teal/5 border-rh-teal text-rh-teal font-bold shadow-sm shadow-rh-teal/5'
                              : 'bg-white hover:bg-gray-50 border-gray-150 text-gray-600'
                          }`}
                        >
                          <span className="pr-4">{opt.label}</span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
                            isSelected
                              ? 'bg-rh-teal text-white'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            +{opt.points} pts
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Summary Column (Sticky) */}
            <aside className="w-full lg:w-96 shrink-0 sticky top-32 space-y-6">
              
              {/* Total Score Panel */}
              <div className="bg-[#081B2D] text-white rounded-[2rem] p-8 border border-white/10 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-rh-red/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-rh-red" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white leading-tight">Your Score Tally</h4>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-0.5">GSM Visa Requirements</span>
                  </div>
                </div>

                <div className="text-center py-6">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Total Points Estimate</span>
                  <div className="flex items-baseline justify-center mt-2 gap-1.5">
                    <span className="text-7xl font-black text-white tracking-tight leading-none">{totalPoints}</span>
                    <span className="text-lg font-bold text-rh-red">/ 140</span>
                  </div>
                </div>

                <div className={`mt-6 border p-4 rounded-2xl leading-relaxed text-xs space-y-2 ${ratingInfo.colorClass}`}>
                  <div className="font-extrabold text-sm flex items-center gap-1.5">
                    <Award className="w-4 h-4 shrink-0" />
                    {ratingInfo.label}
                  </div>
                  <p className="opacity-90">{ratingInfo.desc}</p>
                </div>
              </div>

              {/* Consultation Card */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-150 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-rh-teal/10 flex items-center justify-center mx-auto mb-4">
                  <PhoneCall className="w-6 h-6 text-rh-teal" />
                </div>
                <h4 className="text-md font-bold text-rh-teal mb-2">Points are just one factor</h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  Points assessments are only predictions. Occupations lists, state quotas, and policy directives change frequently. Seek professional MARA advice.
                </p>
                <Link
                  to="/contact?type=consultation"
                  className="inline-flex items-center justify-center w-full px-5 py-3 border-2 border-rh-teal text-rh-teal hover:bg-rh-teal hover:text-white font-bold rounded-xl transition text-sm"
                >
                  Book consultation
                </Link>
              </div>

            </aside>
          </div>

        </div>
      </main>
    </>
  );
}
