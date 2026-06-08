import React from 'react';
import { motion as motionFramer } from 'framer-motion';
import {
  Upload, Eye, EyeOff, AlertCircle, CheckCircle, Loader2
} from 'lucide-react';
import Dropdown from '../ui/Dropdown';
import { State, City } from 'country-state-city';

interface SignupFormStepsProps {
  step: number;
  formData: any;
  errors: { [key: string]: string };
  updateForm: (field: string, value: any) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  isCustomNationality: boolean;
  setIsCustomNationality: (val: boolean) => void;
  isCustomCity: boolean;
  setIsCustomCity: (val: boolean) => void;
  residenceCountryIso: string;
  setResidenceCountryIso: (val: string) => void;
  residenceStateIso: string;
  setResidenceStateIso: (val: string) => void;
  countriesData: any[];
  nationalitiesList: any[];
  handleCountryChange: (c: string) => void;
  handleStateChange: (s: string) => void;
  handleCityChange: (c: string) => void;
  handleFileChange: (field: string, e: React.ChangeEvent<HTMLInputElement>, acceptStr?: string) => void;
  experienceYears: string[];
  uploadProgress: string;
}

export const SignupFormSteps: React.FC<SignupFormStepsProps> = ({
  step,
  formData,
  errors,
  updateForm,
  showPassword,
  setShowPassword,
  isCustomNationality,
  setIsCustomNationality,
  isCustomCity,
  setIsCustomCity,
  residenceCountryIso,
  residenceStateIso,
  countriesData,
  nationalitiesList,
  handleCountryChange,
  handleStateChange,
  handleCityChange,
  handleFileChange,
  experienceYears,
  uploadProgress
}) => {

  const renderInput = ({ label, field, placeholder, type = "text", required = false }: any) => (
    <div className="space-y-1 sm:space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 block ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={formData[field]}
        onChange={e => updateForm(field, e.target.value)}
        onClick={type === 'date' ? (e) => {
          try {
            e.currentTarget.showPicker();
          } catch (err) {
            console.warn(err);
          }
        } : undefined}
        onFocus={type === 'date' ? (e) => {
          try {
            e.currentTarget.showPicker();
          } catch (err) {
            console.warn(err);
          }
        } : undefined}
        placeholder={placeholder}
        className={`w-full px-4 py-3 sm:px-5 sm:py-4 bg-[#F4F7FA] border rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 transition-all text-gray-900 text-xs sm:text-sm font-medium placeholder:text-gray-300 [color-scheme:light] ${errors[field] ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-transparent focus:border-rh-teal/20'}`}
      />
      {errors[field] && (
        <motionFramer.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors[field]}
        </motionFramer.p>
      )}
    </div>
  );

  const renderSelect = ({ label, field, options, required = false }: any) => {
    const formattedOptions = options.map((o: string) => ({ label: o, value: o }));
    return (
      <div className="space-y-1 sm:space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 block ml-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className={`rounded-xl sm:rounded-2xl border ${errors[field] ? 'border-red-500 bg-red-50/10' : 'border-transparent'}`}>
          <Dropdown
            label=""
            value={formData[field]}
            onChange={(val: string) => updateForm(field, val)}
            options={formattedOptions}
            placeholder="Select an option"
            searchable={options.length > 8}
          />
        </div>
        {errors[field] && (
          <motionFramer.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors[field]}
          </motionFramer.p>
        )}
      </div>
    );
  };

  const renderCustomSelect = ({ label, field, options, value, onChange, required = false }: any) => {
    return (
      <div className="space-y-1 sm:space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 block ml-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className={`rounded-xl sm:rounded-2xl border ${errors[field] ? 'border-red-500 bg-red-50/10' : 'border-transparent'}`}>
          <Dropdown
            label=""
            value={value !== undefined ? value : formData[field]}
            onChange={onChange ? onChange : (val: string) => updateForm(field, val)}
            options={options}
            placeholder={`Select ${label}`}
            searchable={true}
          />
        </div>
        {errors[field] && (
          <motionFramer.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors[field]}
          </motionFramer.p>
        )}
      </div>
    );
  };

  const renderRadioGroup = ({ label, field, options, required = false }: any) => (
    <div className="space-y-1 sm:space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 block ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={`flex flex-wrap gap-2 sm:gap-4 p-1 rounded-2xl border ${errors[field] ? 'border-red-500 bg-red-50/10' : 'border-transparent'}`}>
        {options.map((o: string) => (
          <label key={o} className={`flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border cursor-pointer transition-all ${formData[field] === o ? 'border-rh-teal bg-rh-teal/5 text-rh-teal' : 'border-gray-200 hover:border-rh-teal/30 text-gray-600'}`}>
            <input type="radio" name={field} value={o} checked={formData[field] === o} onChange={e => updateForm(field, e.target.value)} className="hidden" />
            <span className="text-xs sm:text-sm font-bold">{o}</span>
          </label>
        ))}
      </div>
      {errors[field] && (
        <motionFramer.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors[field]}
        </motionFramer.p>
      )}
    </div>
  );

  const renderFileUpload = ({ label, field, accept = ".pdf,.doc,.docx", required = false }: any) => {
    const hasFile = !!formData[field];
    return (
      <div className={`border-2 border-dashed rounded-2xl sm:rounded-[24px] p-5 sm:p-6 text-center hover:border-rh-teal/30 hover:bg-white transition-all ${errors[field] ? 'border-red-500 bg-red-50/10' : hasFile ? 'border-emerald-500/40 bg-emerald-50/20' : 'border-gray-200 bg-[#F9FBFF]'
        }`}>
        <label className="cursor-pointer block">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 shadow-sm rounded-xl sm:rounded-[16px] flex items-center justify-center mx-auto mb-2 sm:mb-3 border transition-all ${hasFile ? 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/10' : 'bg-white text-rh-teal border-gray-50'
            }`}>
            {hasFile ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" /> : <Upload className="w-4 h-4 sm:w-5 sm:h-5" />}
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-[#081B2D] mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </h3>
          {hasFile ? (
            <div className="space-y-1.5 animate-fadeIn">
              <p className="text-emerald-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                Selected successfully
              </p>
              <p className="text-rh-teal text-xs font-bold truncate max-w-[200px] mx-auto bg-white/60 px-3 py-1 rounded-xl border border-emerald-100">
                {formData[field]?.name}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-gray-400 text-[10px] sm:text-xs mb-1">Click to select file</p>
              <span className="text-gray-400 text-[9px] sm:text-[10px] mb-2 sm:mb-3 opacity-80">
                Max Size: 5MB | Format: {accept.replace(/\./g, '').toUpperCase()}
              </span>
            </div>
          )}
          <input type="file" className="hidden" accept={accept} onChange={e => handleFileChange(field, e, accept)} />
        </label>
        {errors[field] && (
          <motionFramer.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-2 flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors[field]}
          </motionFramer.p>
        )}
      </div>
    );
  };

  return (
    <>
      {/* SECTION 1 */}
      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 animate-fadeIn">
          {renderInput({ label: "Full Name (As per Passport)", field: "fullName", placeholder: "e.g. John Doe", required: true })}
          {renderInput({ label: "Email Address", field: "email", placeholder: "john@example.com", type: "email", required: true })}
          <div className="space-y-1 sm:space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 block ml-1">Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => updateForm('password', e.target.value)} placeholder="At least 8 characters" className={`w-full px-4 py-3 sm:px-5 sm:py-4 bg-[#F4F7FA] border rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 transition-all text-gray-900 text-xs sm:text-sm font-medium placeholder:text-gray-300 ${errors.password ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-transparent focus:border-rh-teal/20'}`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rh-teal transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
            {errors.password && (
              <motionFramer.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.password}
              </motionFramer.p>
            )}
          </div>
          {renderInput({ label: "Date of Birth", field: "dob", placeholder: "YYYY-MM-DD", type: "date", required: true })}
          {renderInput({ label: "Age", field: "age", placeholder: "e.g. 28", type: "number" })}
          {renderSelect({ label: "Gender", field: "gender", options: ["Male", "Female", "Other", "Prefer not to say"] })}
          {isCustomNationality ? (
            <div className="space-y-1 sm:space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 block ml-1">
                Specify Nationality <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={e => updateForm('nationality', e.target.value)}
                  placeholder="Type nationality..."
                  className={`w-full px-4 py-3 sm:px-5 sm:py-4 bg-[#F4F7FA] border rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 transition-all text-gray-900 text-xs sm:text-sm font-medium placeholder:text-gray-300 ${errors.nationality ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-transparent focus:border-rh-teal/20'}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomNationality(false);
                    updateForm('nationality', '');
                  }}
                  className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all"
                >
                  Reset
                </button>
              </div>
              {errors.nationality && (
                <motionFramer.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.nationality}
                </motionFramer.p>
              )}
            </div>
          ) : (
            renderCustomSelect({
              label: "Nationality",
              field: "nationality",
              options: [
                ...nationalitiesList,
                { label: "Other (Specify)", value: "Other" }
              ],
              value: formData.nationality,
              onChange: (val: string) => {
                if (val === 'Other') {
                  setIsCustomNationality(true);
                  updateForm('nationality', '');
                } else {
                  updateForm('nationality', val);
                }
              },
              required: true
            })
          )}
          {renderCustomSelect({
            label: "Country of Residence",
            field: "countryOfResidence",
            options: countriesData.map(c => ({ label: c.name, value: c.name })),
            value: formData.countryOfResidence,
            onChange: handleCountryChange,
            required: true
          })}
          {residenceCountryIso && (State.getStatesOfCountry(residenceCountryIso) || []).length > 0 && (
            renderCustomSelect({
              label: "State / Province",
              field: "state",
              options: (State.getStatesOfCountry(residenceCountryIso) || []).map(s => ({ label: s.name, value: s.name })),
              value: (State.getStatesOfCountry(residenceCountryIso) || []).find(s => s.isoCode === residenceCountryIso)?.name || '',
              onChange: handleStateChange,
              required: false
            })
          )}
          {residenceCountryIso && (
            isCustomCity || (residenceStateIso ? (City.getCitiesOfState(residenceCountryIso, residenceStateIso) || []).length === 0 : (City.getCitiesOfCountry(residenceCountryIso) || []).length === 0) ? (
              <div className="space-y-1 sm:space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 block ml-1">
                  City <span className="text-gray-400">(Specify)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => updateForm('city', e.target.value)}
                    placeholder="Type city..."
                    className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 transition-all text-gray-900 text-xs sm:text-sm font-medium placeholder:text-gray-300"
                  />
                  {(residenceStateIso ? (City.getCitiesOfState(residenceCountryIso, residenceStateIso) || []).length > 0 : (City.getCitiesOfCountry(residenceCountryIso) || []).length > 0) && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCity(false);
                        updateForm('city', '');
                      }}
                      className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all"
                    >
                      List
                    </button>
                  )}
                </div>
              </div>
            ) : (
              renderCustomSelect({
                label: "City",
                field: "city",
                options: [
                  ...(residenceStateIso ? (City.getCitiesOfState(residenceCountryIso, residenceStateIso) || []) : (City.getCitiesOfCountry(residenceCountryIso) || [])).map(c => ({ label: c.name, value: c.name })),
                  { label: "Other (Specify)", value: "Other" }
                ],
                value: formData.city,
                onChange: handleCityChange,
                required: false
              })
            )
          )}
          {renderInput({ label: "WhatsApp Number (with country code)", field: "whatsapp", placeholder: "+971 50 000 0000", type: "tel", required: true })}
          {renderInput({ label: "LinkedIn Profile URL", field: "linkedin", placeholder: "https://linkedin.com/in/username", type: "url" })}
        </div>
      )}

      {/* SECTION 2 */}
      {step === 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 animate-fadeIn">
          <div className="sm:col-span-2">
            {renderRadioGroup({ label: "What type of opportunity are you looking for?", field: "opportunityType", options: ["Full-Time Onsite", "Remote", "Hybrid", "Contract / Project-Based"], required: true })}
          </div>
          {renderInput({ label: "Preferred Industry / Sector", field: "preferredIndustry", placeholder: "e.g. Healthcare, IT, Finance", required: true })}
          {renderInput({ label: "Preferred Role / Job Title", field: "preferredRole", placeholder: "e.g. Senior Software Engineer", required: true })}
          {renderInput({ label: "Preferred Salary", field: "preferredSalary", placeholder: "e.g. $80,000 - $100,000 USD/year" })}
          {renderInput({ label: "Earliest Start Date / Notice Period", field: "startDate", placeholder: "e.g. 30 Days / Immediate" })}
        </div>
      )}

      {/* SECTION 3 */}
      {step === 3 && (
        <div className="space-y-6 sm:space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
            {renderRadioGroup({ label: "Are you currently employed?", field: "isEmployed", options: ["Yes", "No"], required: true })}
            {formData.isEmployed === 'Yes' && (
              <>
                {renderInput({ label: "Current Job Title", field: "jobTitle", placeholder: "e.g. Engineering Manager", required: true })}
                {renderInput({ label: "Current Employer Name", field: "employerName", placeholder: "e.g. Tech Global", required: true })}
                {renderCustomSelect({
                  label: "Country of Employment",
                  field: "employmentCountry",
                  options: countriesData.map(c => ({ label: c.name, value: c.name })),
                  value: formData.employmentCountry,
                  onChange: (val: string) => updateForm('employmentCountry', val),
                  required: false
                })}
                {renderSelect({ label: "Total Years of Experience", field: "totalExp", options: experienceYears, required: true })}
                {renderSelect({ label: "Relevant Years of Experience", field: "relevantExp", options: experienceYears })}
              </>
            )}
          </div>
          <div className="space-y-1 sm:space-y-2">
            <div className="flex justify-between items-center ml-1 mb-1 sm:mb-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                Professional Summary / Key Achievements
              </label>
              <span className={`text-[10px] font-bold ${formData.summary.length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
                {formData.summary.length}/200
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={200}
              value={formData.summary}
              onChange={e => updateForm('summary', e.target.value)}
              placeholder="Briefly highlight your core expertise and major achievements..."
              className={`w-full px-4 py-3 sm:px-5 sm:py-4 bg-[#F4F7FA] border rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 transition-all text-gray-900 text-xs sm:text-sm font-medium placeholder:text-gray-300 resize-none ${errors.summary ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-transparent focus:border-rh-teal/20'}`}
            />
            {errors.summary && (
              <motionFramer.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.summary}
              </motionFramer.p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
            {renderRadioGroup({ label: "Have you worked overseas before?", field: "workedOverseas", options: ["Yes", "No"] })}
            {formData.workedOverseas === "Yes" && renderCustomSelect({
              label: "Which countries?",
              field: "overseasCountries",
              options: countriesData.map(c => ({ label: c.name, value: c.name })),
              value: formData.overseasCountries,
              onChange: (val: string) => updateForm('overseasCountries', val),
              required: false
            })}
          </div>
        </div>
      )}

      {/* SECTION 4 */}
      {step === 4 && (
        <div className="space-y-6 sm:space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
            {renderSelect({ label: "Highest Qualification Achieved", field: "highestQualification", options: ["High School / Diploma", "Bachelor's Degree", "Master's Degree", "PhD / Doctorate", "Professional Certification"], required: true })}
            {renderInput({ label: "Field of Study / Major", field: "fieldOfStudy", placeholder: "e.g. Computer Science", required: true })}
            {renderInput({ label: "Institution Name", field: "institutionName", placeholder: "e.g. Stanford University", required: false })}
            {renderInput({ label: "Graduation Year", field: "graduationYear", placeholder: "e.g. 2021", type: "number" })}
            {renderRadioGroup({ label: "Do you hold any professional licences or registrations?", field: "hasLicences", options: ["Yes", "No"] })}
            {formData.hasLicences === "Yes" && renderInput({ label: "List Licences & Issuing Authorities", field: "licencesList", placeholder: "e.g. CPA (AICPA), PMP (PMI)" })}
          </div>
        </div>
      )}

      {/* SECTION 5 */}
      {step === 5 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 animate-fadeIn">
          {renderSelect({ label: "Have you taken an English Language Proficiency Test?", field: "englishTest", options: ["IELTS", "TOEFL", "PTE", "OET", "None"], required: true })}
          {formData.englishTest && formData.englishTest !== "None" && (
            <>
              {renderInput({ label: "Overall Score / Band", field: "overallScore", placeholder: "e.g. 7.5" })}
              {renderInput({ label: "Test Date / Validity", field: "testDate", placeholder: "YYYY-MM-DD", type: "date" })}
            </>
          )}
        </div>
      )}

      {/* SECTION 6 */}
      {step === 6 && (
        <div className="space-y-6 sm:space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
            {renderInput({ label: "Current Visa / Residency Status", field: "visaStatus", placeholder: "e.g. Employment Pass / Citizen", required: true })}
            {renderInput({ label: "Legal Work Rights in Target Country", field: "legalWorkRights", placeholder: "e.g. Require Sponsorship / Permanent Resident", required: false })}
            {renderRadioGroup({ label: "Are you open to relocation?", field: "openToRelocation", options: ["Yes", "No"], required: true })}
          </div>

          <div className="space-y-4">
            {renderRadioGroup({ label: "Have you applied for an Australian Visa before?", field: "appliedAusVisa", options: ["Yes", "No"] })}
            {formData.appliedAusVisa === "Yes" && renderInput({ label: "Which Visa Subclass?", field: "visaTypeApplied", placeholder: "e.g. Subclass 482, 189, 190" })}
          </div>

          <div className="space-y-4">
            {renderRadioGroup({ label: "Have you ever had a visa refusal or cancellation for any country?", field: "visaRefusal", options: ["Yes", "No"] })}
            {formData.visaRefusal === "Yes" && (
              <div className="space-y-1 sm:space-y-2">
                <div className="flex justify-between items-center ml-1 mb-1 sm:mb-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Please provide details of the visa refusal/cancellation
                  </label>
                  <span className={`text-[10px] font-bold ${formData.visaRefusalDetails.length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
                    {formData.visaRefusalDetails.length}/200
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={200}
                  value={formData.visaRefusalDetails}
                  onChange={e => updateForm('visaRefusalDetails', e.target.value)}
                  placeholder="Explain the reasons and country..."
                  className={`w-full px-4 py-3 sm:px-5 sm:py-4 bg-[#F4F7FA] border rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 transition-all text-gray-900 text-xs sm:text-sm font-medium placeholder:text-gray-300 resize-none ${errors.visaRefusalDetails ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-transparent focus:border-rh-teal/20'}`}
                />
                {errors.visaRefusalDetails && (
                  <motionFramer.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.visaRefusalDetails}
                  </motionFramer.p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 7 */}
      {step === 7 && (
        <div className="space-y-6 sm:space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
            {renderSelect({ label: "If relocating, will you relocate alone or with family?", field: "relocateAloneOrFamily", options: ["Alone", "With Partner", "With Family (Partner & Children)"], required: true })}
            {renderRadioGroup({ label: "Do you hold a valid passport?", field: "validPassport", options: ["Yes", "No"] })}
            {formData.validPassport === "Yes" && renderInput({ label: "Passport Expiry Date", field: "passportExpiry", placeholder: "YYYY-MM-DD", type: "date", required: true })}
            {renderRadioGroup({ label: "Are you willing to undergo a medical and background check?", field: "medicalBackgroundCheck", options: ["Yes", "No"] })}
            {renderRadioGroup({ label: "Do you have any criminal convictions?", field: "criminalConvictions", options: ["Yes", "No"] })}
          </div>
          {formData.criminalConvictions === "Yes" && (
            <div className="space-y-1 sm:space-y-2">
              <div className="flex justify-between items-center ml-1 mb-1 sm:mb-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  Please provide details of convictions
                </label>
                <span className={`text-[10px] font-bold ${formData.criminalDetails.length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formData.criminalDetails.length}/200
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={200}
                value={formData.criminalDetails}
                onChange={e => updateForm('criminalDetails', e.target.value)}
                placeholder="Provide details..."
                className={`w-full px-4 py-3 sm:px-5 sm:py-4 bg-[#F4F7FA] border rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 transition-all text-gray-900 text-xs sm:text-sm font-medium placeholder:text-gray-300 resize-none ${errors.criminalDetails ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-transparent focus:border-rh-teal/20'}`}
              />
              {errors.criminalDetails && (
                <motionFramer.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.criminalDetails}
                </motionFramer.p>
              )}
            </div>
          )}
        </div>
      )}

      {/* SECTION 8 */}
      {step === 8 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 animate-fadeIn">
          {renderFileUpload({ label: "Resume / CV", field: "resumeFile", required: true })}
          {renderFileUpload({ label: "Passport Copy (Bio-Data Page)", field: "passportFile", required: true })}
          {renderFileUpload({ label: "Current Visa / Residency Permit / Work Permit", field: "visaFile", required: true })}
          {renderFileUpload({ label: "Educational Certificates", field: "eduCertFile", required: true })}
          {renderFileUpload({ label: "Employment Certificates / Experience Letters", field: "empCertFile", required: true })}
          {renderFileUpload({ label: "English Test Results", field: "englishTestFile", required: false })}
          {renderFileUpload({ label: "Professional Licences / Certifications", field: "licenceFile", required: false })}
        </div>
      )}

      {/* SECTION 9 */}
      {step === 9 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="space-y-2">
            <label className={`flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl border bg-[#F9FBFF] cursor-pointer hover:border-rh-teal/30 transition-all ${errors.declarationTrue ? 'border-red-500 bg-red-50/10' : 'border-gray-100'}`}>
              <input type="checkbox" checked={formData.declarationTrue} onChange={e => updateForm('declarationTrue', e.target.checked)} className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-rh-teal rounded border-gray-300 focus:ring-rh-teal/20 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-600 leading-relaxed">
                I confirm that the information and documents provided are true and accurate to the best of my knowledge. I understand that submission of this form does not guarantee employment, visa approval, or employer sponsorship. <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.declarationTrue && (
              <motionFramer.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.declarationTrue}
              </motionFramer.p>
            )}
          </div>

          <div className="space-y-2">
            <label className={`flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl border bg-[#F9FBFF] cursor-pointer hover:border-rh-teal/30 transition-all ${errors.declarationConsent ? 'border-red-500 bg-red-50/10' : 'border-gray-100'}`}>
              <input type="checkbox" checked={formData.declarationConsent} onChange={e => updateForm('declarationConsent', e.target.checked)} className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-rh-teal rounded border-gray-300 focus:ring-rh-teal/20 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-600 leading-relaxed">
                I consent to Orange Global sharing my profile and supporting documents with potential employers and recruitment partners for assessment purposes. <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.declarationConsent && (
              <motionFramer.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.declarationConsent}
              </motionFramer.p>
            )}
          </div>

          {/* Anti-spam honeypot field (hidden from users, filled by bots) */}
          <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
            <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" value={formData.honeypot} onChange={e => updateForm('honeypot', e.target.value)} />
          </div>

          {uploadProgress && (
            <div className="p-4 bg-rh-teal/5 border border-rh-teal/20 rounded-xl sm:rounded-2xl flex items-center gap-3 text-rh-teal font-medium text-xs sm:text-sm animate-pulse">
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin shrink-0" />
              <span>{uploadProgress}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};
