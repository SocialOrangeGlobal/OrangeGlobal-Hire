import React from 'react';
import { Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  User, Briefcase, Star, GraduationCap, Languages,
  ShieldCheck, Plane, FileCheck, AlertCircle, Trash2, Plus,
  Upload, Save, Loader2, Camera, CheckCircle, Target, FileText
} from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import { signUpPositionType, nationalitiesList } from '../../data';
import { uploadFile, validateFileConstraints } from '../../lib/storage';
import { authApi } from '../../lib/auth';
import { toast } from 'react-hot-toast';

interface ProfileEditFormProps {
  isTalent: boolean;
  talentForm: any;
  employerForm: any;
  onUpdateSubmit: (data: any) => Promise<void>;
  onUpdateError: (errors: any) => void;
  saving: boolean;
  setSaving: (val: boolean) => void;
  residenceCountryIso: string;
  setResidenceCountryIso: (val: string) => void;
  residenceStateIso: string;
  setResidenceStateIso: (val: string) => void;
  isCustomCity: boolean;
  setIsCustomCity: (val: boolean) => void;
  isCustomNationality: boolean;
  setIsCustomNationality: (val: boolean) => void;
  openSection: string;
  setOpenSection: (val: string) => void;
  setActiveTab: (tab: 'overview' | 'edit' | 'resume') => void;
  skillInput: string;
  setSkillInput: (val: string) => void;
  addSkill: () => void;
  removeSkill: (skill: string) => void;
  watchedSkills: string[];
  expFields: any[];
  appendExp: (exp: any) => void;
  removeExp: (index: number) => void;
  eduFields: any[];
  appendEdu: (edu: any) => void;
  removeEdu: (index: number) => void;
  docUploadStates: Record<string, 'success' | 'failed'>;
  setDocUploadStates: React.Dispatch<React.SetStateAction<Record<string, 'success' | 'failed'>>>;
  resumeUploadError: string;
  setResumeUploadError: (val: string) => void;
  setResumeScore: (val: number | null) => void;
  setSelectedDoc: (doc: { url: string; title: string } | null) => void;
  profile: any;
  fetchProfile: () => Promise<void>;
  user: any;
  dispatch: any;
  updateProfileSuccess: any;
  handleDocumentUpload: (field: string, file: File, folder: string) => Promise<void>;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  isTalent,
  talentForm,
  employerForm,
  onUpdateSubmit,
  onUpdateError,
  saving,
  setSaving,
  residenceCountryIso,
  setResidenceCountryIso,
  residenceStateIso,
  setResidenceStateIso,
  isCustomCity,
  setIsCustomCity,
  isCustomNationality,
  setIsCustomNationality,
  openSection,
  setOpenSection,
  setActiveTab,
  skillInput,
  setSkillInput,
  addSkill,
  removeSkill,
  watchedSkills,
  expFields,
  appendExp,
  removeExp,
  eduFields,
  appendEdu,
  removeEdu,
  docUploadStates,
  setDocUploadStates,
  resumeUploadError,
  setResumeUploadError,
  setResumeScore,
  setSelectedDoc,
  profile,
  fetchProfile,
  user,
  dispatch,
  updateProfileSuccess,
  handleDocumentUpload
}) => {

  const renderEditInput = (label: string, name: string, placeholder?: string, type: string = "text", required: boolean = false) => {
    const isPhoneNumber = name === 'phone' || name === 'whatsapp' || name === 'businessPhone';
    const formToUse = isTalent ? talentForm : employerForm;
    const error = (formToUse.formState.errors as any)[name];
    return (
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
        <input
          type={type}
          placeholder={placeholder}
          {...(isTalent
            ? talentForm.register(name as any, isPhoneNumber ? {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = e.target.value.replace(/[^\d+\s\-]/g, '');
              }
            } : undefined)
            : employerForm.register(name as any, isPhoneNumber ? {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = e.target.value.replace(/[^\d+\s\-]/g, '');
              }
            } : undefined)
          )}
          onClick={type === "date" ? (e) => {
            try {
              e.currentTarget.showPicker();
            } catch (err) { }
          } : undefined}
          onFocus={type === "date" ? (e) => {
            try {
              e.currentTarget.showPicker();
            } catch (err) { }
          } : undefined}
          className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border ${error ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all font-medium [color-scheme:light]`}
        />
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error.message}
          </motion.p>
        )}
      </div>
    );
  };

  const renderEditSelect = (label: string, name: string, options: string[], required: boolean = false, searchable: boolean = false) => {
    const error = (talentForm.formState.errors as any)[name];
    return (
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
        <div className={`rounded-2xl border ${error ? 'border-red-500 bg-red-50/10' : 'border-transparent'}`}>
          <Controller
            name={name as any}
            control={talentForm.control}
            render={({ field }) => (
              <Dropdown
                options={options.map(o => ({ label: o, value: o }))}
                value={field.value || ''}
                onChange={field.onChange}
                searchable={searchable}
                className="border-transparent bg-[#F4F7FA] focus:bg-white"
              />
            )}
          />
        </div>
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error.message}
          </motion.p>
        )}
      </div>
    );
  };

  const renderEditRadio = (label: string, name: string, options: string[], required: boolean = false) => {
    const error = (talentForm.formState.errors as any)[name];
    return (
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
        <Controller
          name={name as any}
          control={talentForm.control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-3">
              {options.map(o => (
                <button
                  key={o}
                  type="button"
                  onClick={() => field.onChange(o)}
                  className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border text-sm font-bold transition-all ${field.value === o
                    ? 'border-rh-teal bg-rh-teal/5 text-rh-teal'
                    : error
                      ? 'border-red-300 hover:border-red-400 text-gray-600 bg-white'
                      : 'border-gray-200 hover:border-rh-teal/30 text-gray-600 bg-white'
                    }`}
                >
                  {o}
                </button>
              ))}
            </div>
          )}
        />
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error.message}
          </motion.p>
        )}
      </div>
    );
  };

  const renderEditTextarea = (label: string, name: string, placeholder?: string, rows: number = 3, required: boolean = false) => {
    const error = (talentForm.formState.errors as any)[name];
    const textVal = talentForm.watch(name as any) || '';
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center ml-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
          <span className={`text-[10px] font-bold ${textVal.length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
            {textVal.length}/200
          </span>
        </div>
        <textarea
          rows={rows}
          maxLength={200}
          placeholder={placeholder}
          {...talentForm.register(name as any)}
          className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border ${error ? 'border-red-500 bg-red-50/10' : 'border-transparent'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all font-medium resize-none`}
        />
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error.message}
          </motion.p>
        )}
      </div>
    );
  };

  const renderEditDocUpload = (label: string, name: string, folder: string, required: boolean = false, accept: string = ".pdf,.doc,.docx,.jpg,.jpeg,.png") => {
    const url = talentForm.watch(name as any);
    const inputId = `doc-upload-${name}`;
    const error = (talentForm.formState.errors as any)[name];
    const sessionState = docUploadStates[name] || 'idle';

    let cardClass = 'border-rh-teal/5 bg-[#F9FBFF]';
    let blurClass = 'bg-rh-teal/5';
    let iconClass = 'bg-white text-rh-teal border-gray-50';
    let iconElement = <FileText className="w-7 h-7" />;
    let textElement = url ? (
      <p className="text-xs text-gray-500 font-medium">Update your uploaded {label.toLowerCase()} document here</p>
    ) : (
      <p className="text-xs text-gray-500 font-medium">No document uploaded yet</p>
    );
    let buttonClass = 'border-rh-teal/10 hover:border-rh-teal hover:bg-rh-teal hover:text-white text-rh-teal';
    let buttonText = url ? 'Update' : 'Upload';

    if (error) {
      cardClass = 'border-red-500 bg-red-50/10';
      blurClass = 'bg-red-500/5';
    } else if (sessionState === 'success') {
      cardClass = 'border-emerald-500/30 bg-emerald-50/20';
      blurClass = 'bg-emerald-500/5';
      iconClass = 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/10';
      iconElement = <CheckCircle className="w-7 h-7 animate-pulse" />;
      textElement = (
        <p className="text-emerald-600 text-xs font-bold flex items-center gap-1.5 mt-0.5 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Document uploaded successfully
        </p>
      );
      buttonClass = 'border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white text-emerald-600';
      buttonText = 'Update';
    } else if (sessionState === 'failed') {
      cardClass = 'border-red-500 bg-red-50/10';
      blurClass = 'bg-red-500/5';
      iconClass = 'bg-red-500 text-white border-red-500 shadow-red-500/10';
      iconElement = <AlertCircle className="w-7 h-7" />;
      textElement = (
        <p className="text-red-600 text-xs font-bold flex items-center gap-1.5 mt-0.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" /> Upload failed. Please try again.
        </p>
      );
      buttonClass = 'border-red-500/20 hover:border-red-500 hover:bg-red-500 hover:text-white text-red-600';
      buttonText = 'Try Again';
    }

    return (
      <div className="space-y-1 w-full animate-fadeIn">
        <div className={`rounded-[2rem] p-8 border relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 transition-all ${cardClass}`}>
          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none ${blurClass}`} />

          <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto">
            <div className={`w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center border shrink-0 transition-all ${iconClass}`}>
              {iconElement}
            </div>
            <div>
              <h4 className="text-lg font-bold text-rh-teal mb-0.5">
                {label} {required && <span className="text-red-500">*</span>}
              </h4>
              {textElement}
              <span className="text-[10px] text-gray-400 mt-1 block opacity-80">Max Size: 5MB | Format: {accept.replace(/\./g, '').toUpperCase()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mt-6 sm:mt-0 relative z-10">
            <input
              id={inputId}
              type="file"
              className="hidden"
              accept={accept}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const error = validateFileConstraints(file, folder, accept);
                  if (error) {
                    talentForm.setError(name as any, { type: 'manual', message: error });
                    e.target.value = '';
                    return;
                  }
                  talentForm.clearErrors(name as any);
                  await handleDocumentUpload(name, file, folder);
                }
              }}
            />
            <Button
              type="button"
              onClick={() => document.getElementById(inputId)?.click()}
              variant="outline"
              className={`w-full sm:w-auto px-6 py-3 border-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center ${buttonClass}`}
            >
              <Upload className="w-4 h-4 mr-2" /> {buttonText}
            </Button>
            {url && (
              <button
                type="button"
                onClick={() => setSelectedDoc({ url, title: label })}
                className="w-full sm:w-auto px-6 py-3 bg-white text-rh-teal rounded-xl font-bold text-sm shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Target className="w-4 h-4" /> View
              </button>
            )}
          </div>
        </div>
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error.message as string}
          </motion.p>
        )}
      </div>
    );
  };

  return (
    <motion.div
      key="edit"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-[2rem] sm:rounded-[40px] p-6 sm:p-10 shadow-sm border border-gray-100"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 border-b border-gray-50 pb-6">
        <h3 className="text-2xl font-bold text-rh-teal">Edit Profile Information</h3>
        <div className="flex items-center gap-2 text-rh-red text-xs font-bold uppercase tracking-widest self-start sm:self-auto">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Changes will be saved to your profile
        </div>
      </div>

      {isTalent ? (
        <form onSubmit={talentForm.handleSubmit(onUpdateSubmit, onUpdateError)} className="space-y-10">
          <input type="hidden" {...talentForm.register('avatarUrl')} />
          <input type="hidden" {...talentForm.register('resumeUrl')} />

          {/* Accordion Wrapper */}
          <div className="space-y-6">
            {/* 1. Personal & Contact Details */}
            <div className={`border border-gray-100 rounded-3xl shadow-sm bg-white transition-all ${openSection === 'personal' ? 'relative z-30 overflow-visible' : 'overflow-hidden'}`}>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'personal' ? '' : 'personal')}
                className="w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 bg-gray-50/50 hover:bg-gray-50 transition-all font-bold text-rh-teal text-base border-b border-gray-100/50"
              >
                <span className="flex items-center gap-3">
                  <User className="w-5 h-5 text-rh-red" /> 1. Personal & Contact Details
                </span>
                <span className="text-xl text-gray-400">{openSection === 'personal' ? '−' : '+'}</span>
              </button>
              {openSection === 'personal' && (
                <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white animate-fadeIn">
                  <div className="grid md:grid-cols-2 gap-6">
                    {renderEditInput("Full Name (As per Passport)", "fullName", undefined, "text", true)}
                    {renderEditInput("Phone Number", "phone", undefined, "text", true)}
                    {renderEditInput("Date of Birth", "dob", "YYYY-MM-DD", "date", true)}
                    {renderEditInput("Age", "age", "e.g. 28")}
                    {renderEditSelect("Gender", "gender", ["Male", "Female", "Other", "Prefer not to say"])}

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nationality<span className="text-red-500 ml-0.5">*</span></label>
                      <Controller
                        name="nationality"
                        control={talentForm.control}
                        render={({ field }) => {
                          const options = [
                            ...nationalitiesList,
                            { label: 'Other (Specify)', value: 'Other' }
                          ];
                          return (
                            <div className="space-y-3">
                              <div className={`rounded-2xl border ${talentForm.formState.errors.nationality ? 'border-red-500 bg-red-50/10' : 'border-transparent'}`}>
                                <Dropdown
                                  options={options}
                                  value={isCustomNationality ? 'Other' : field.value || ''}
                                  onChange={(val) => {
                                    if (val === 'Other') {
                                      setIsCustomNationality(true);
                                      field.onChange('');
                                    } else {
                                      setIsCustomNationality(false);
                                      field.onChange(val);
                                    }
                                  }}
                                  searchable={true}
                                  placeholder="Select Nationality"
                                  className="border-transparent bg-[#F4F7FA] focus:bg-white"
                                />
                              </div>
                              {isCustomNationality && (
                                <input
                                  type="text"
                                  value={field.value || ''}
                                  onChange={(e) => field.onChange(e.target.value)}
                                  placeholder="Enter custom nationality"
                                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all font-medium"
                                />
                              )}
                            </div>
                          );
                        }}
                      />
                      {talentForm.formState.errors.nationality && (
                        <p className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {talentForm.formState.errors.nationality.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Country of Residence<span className="text-red-500 ml-0.5">*</span></label>
                      <Controller
                        name="countryOfResidence"
                        control={talentForm.control}
                        render={({ field }) => {
                          const countries = Country.getAllCountries();
                          const options = countries.map(c => ({ label: c.name, value: c.name }));
                          return (
                            <div className={`rounded-2xl border ${talentForm.formState.errors.countryOfResidence ? 'border-red-500 bg-red-50/10' : 'border-transparent'}`}>
                              <Dropdown
                                options={options}
                                value={field.value || ''}
                                onChange={(val) => {
                                  field.onChange(val);
                                  const countryObj = countries.find(c => c.name === val);
                                  if (countryObj) {
                                    setResidenceCountryIso(countryObj.isoCode);
                                  } else {
                                    setResidenceCountryIso('');
                                  }
                                  setResidenceStateIso('');
                                  talentForm.setValue('state', '');
                                  talentForm.setValue('city', '');
                                  setIsCustomCity(false);
                                }}
                                searchable={true}
                                placeholder="Select Country"
                                className="border-transparent bg-[#F4F7FA] focus:bg-white"
                              />
                            </div>
                          );
                        }}
                      />
                      {talentForm.formState.errors.countryOfResidence && (
                        <p className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {talentForm.formState.errors.countryOfResidence.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">State / Province</label>
                      <Controller
                        name="state"
                        control={talentForm.control}
                        render={({ field }) => {
                          const statesList = residenceCountryIso ? State.getStatesOfCountry(residenceCountryIso) : [];
                          const options = statesList.map(s => ({ label: s.name, value: s.name }));
                          return (
                            <Dropdown
                              options={options}
                              value={field.value || ''}
                              onChange={(val) => {
                                field.onChange(val);
                                const stateObj = statesList.find(s => s.name === val);
                                if (stateObj) {
                                  setResidenceStateIso(stateObj.isoCode);
                                } else {
                                  setResidenceStateIso('');
                                }
                                talentForm.setValue('city', '');
                                setIsCustomCity(false);
                              }}
                              searchable={true}
                              placeholder={residenceCountryIso ? "Select State / Province" : "Please select a country first"}
                              className={!residenceCountryIso ? "opacity-60 pointer-events-none" : ""}
                            />
                          );
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
                      <Controller
                        name="city"
                        control={talentForm.control}
                        render={({ field }) => {
                          let citiesList: any[] = [];
                          if (residenceCountryIso) {
                            citiesList = (residenceStateIso
                              ? City.getCitiesOfState(residenceCountryIso, residenceStateIso)
                              : City.getCitiesOfCountry(residenceCountryIso)) || [];
                          }
                          const options = [
                            ...(citiesList || []).map(c => ({ label: c.name, value: c.name })),
                            { label: 'Other (Specify)', value: 'Other' }
                          ];
                          return (
                            <div className="space-y-3">
                              <Dropdown
                                options={options}
                                value={isCustomCity ? 'Other' : field.value || ''}
                                onChange={(val) => {
                                  if (val === 'Other') {
                                    setIsCustomCity(true);
                                    field.onChange('');
                                  } else {
                                    setIsCustomCity(false);
                                    field.onChange(val);
                                  }
                                }}
                                searchable={true}
                                placeholder={residenceCountryIso ? "Select City" : "Please select a country first"}
                                className={!residenceCountryIso ? "opacity-60 pointer-events-none" : ""}
                              />
                              {isCustomCity && (
                                <input
                                  type="text"
                                  value={field.value || ''}
                                  onChange={(e) => field.onChange(e.target.value)}
                                  placeholder="Enter custom city"
                                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all font-medium"
                                />
                              )}
                            </div>
                          );
                        }}
                      />
                    </div>

                    {renderEditInput("WhatsApp Number (with country code)", "whatsapp", "+971 50 000 0000", "text", true)}
                    {renderEditInput("LinkedIn Profile URL", "linkedin", "https://linkedin.com/in/username")}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Employment Preferences */}
            <div className={`border border-gray-100 rounded-3xl shadow-sm bg-white transition-all ${openSection === 'preferences' ? 'relative z-30 overflow-visible' : 'overflow-hidden'}`}>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'preferences' ? '' : 'preferences')}
                className="w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 bg-gray-50/50 hover:bg-gray-50 transition-all font-bold text-rh-teal text-base border-b border-gray-100/50"
              >
                <span className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-rh-red" /> 2. Employment Preferences
                </span>
                <span className="text-xl text-gray-400">{openSection === 'preferences' ? '−' : '+'}</span>
              </button>
              {openSection === 'preferences' && (
                <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white animate-fadeIn">
                  <div className="space-y-6">
                    {renderEditRadio("What type of opportunity are you looking for?", "opportunityType", ["Full-Time Onsite", "Remote", "Hybrid", "Contract / Project-Based"], true)}
                    <div className="grid md:grid-cols-2 gap-6">
                      {renderEditInput("Preferred Industry / Sector", "preferredIndustry", "e.g. Healthcare, IT, Finance", "text", true)}
                      {renderEditInput("Preferred Role / Job Title", "preferredRole", "e.g. Senior Software Engineer", "text", true)}
                      {renderEditInput("Preferred Salary", "preferredSalary", "e.g. $80,000 - $100,000 USD/year")}
                      {renderEditInput("Earliest Start Date / Notice Period", "startDate", "e.g. 30 Days / Immediate")}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Current Employment & History */}
            <div className={`border border-gray-100 rounded-3xl shadow-sm bg-white transition-all ${openSection === 'current' ? 'relative z-30 overflow-visible' : 'overflow-hidden'}`}>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'current' ? '' : 'current')}
                className="w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 bg-gray-50/50 hover:bg-gray-50 transition-all font-bold text-rh-teal text-base border-b border-gray-100/50"
              >
                <span className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-rh-red" /> 3. Current Employment & History
                </span>
                <span className="text-xl text-gray-400">{openSection === 'current' ? '−' : '+'}</span>
              </button>
              {openSection === 'current' && (
                <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white animate-fadeIn">
                  <div className="space-y-6">
                    {renderEditRadio("Are you currently employed?", "isEmployed", ["Yes", "No"], true)}

                    {talentForm.watch('isEmployed') === 'Yes' && (
                      <div className="grid md:grid-cols-2 gap-6 p-4 sm:p-6 bg-[#F9FBFF] rounded-2xl border border-gray-100">
                        {renderEditInput("Current Job Title", "jobTitle", "e.g. Engineering Manager", "text", true)}
                        {renderEditInput("Current Employer Name", "employerName", "e.g. Tech Global", "text", true)}
                        {renderEditInput("Country of Employment", "employmentCountry", "e.g. Singapore")}
                        {renderEditInput("Total Years of Experience", "totalExp", "e.g. 8 Years", "text", true)}
                        {renderEditInput("Relevant Years of Experience", "relevantExp", "e.g. 6 Years")}
                      </div>
                    )}

                    {renderEditTextarea("Professional Summary / Key Achievements", "summary", "Briefly highlight your core expertise and major achievements...")}

                    <div className="grid md:grid-cols-2 gap-6">
                      {renderEditRadio("Have you worked overseas before?", "workedOverseas", ["Yes", "No"])}
                      {talentForm.watch('workedOverseas') === 'Yes' && renderEditSelect("Which countries?", "overseasCountries", Country.getAllCountries().map(c => c.name), false, true)}
                    </div>

                    {/* Work Experience List */}
                    <div className="space-y-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-rh-teal uppercase tracking-widest">Work History Timeline</h4>
                        <button type="button" onClick={() => appendExp({ title: '', company: '', responsibilities: '' })} className="text-rh-red font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                          <Plus className="w-4 h-4" /> Add Experience
                        </button>
                      </div>
                      <div className="space-y-4">
                        {expFields.map((field, index) => {
                          const expErr = talentForm.formState.errors.experiences?.[index];
                          return (
                            <div key={field.id} className="p-4 sm:p-6 bg-[#F9FBFF] rounded-2xl border border-gray-100 relative group">
                              <button type="button" onClick={() => removeExp(index)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-rh-red transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Title</label>
                                  <input {...talentForm.register(`experiences.${index}.title`)} className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white border ${expErr?.title ? 'border-red-500 bg-red-50/10' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium`} />
                                  {expErr?.title && (
                                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {expErr.title.message}
                                    </motion.p>
                                  )}
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company</label>
                                  <input {...talentForm.register(`experiences.${index}.company`)} className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white border ${expErr?.company ? 'border-red-500 bg-red-50/10' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium`} />
                                  {expErr?.company && (
                                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {expErr.company.message}
                                    </motion.p>
                                  )}
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Responsibilities</label>
                                  <textarea rows={3} {...talentForm.register(`experiences.${index}.responsibilities`)} className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white border ${expErr?.responsibilities ? 'border-red-500 bg-red-50/10' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium resize-none`} />
                                  {expErr?.responsibilities && (
                                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {expErr.responsibilities.message}
                                    </motion.p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Expertise & Skills */}
            <div id="skills-accordion-section" className={`border border-gray-100 rounded-3xl shadow-sm bg-white transition-all ${openSection === 'skills' ? 'relative z-30 overflow-visible' : 'overflow-hidden'}`}>
              <button
                id="skills-accordion-trigger"
                type="button"
                onClick={() => setOpenSection(openSection === 'skills' ? '' : 'skills')}
                className="w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 bg-gray-50/50 hover:bg-gray-50 transition-all font-bold text-rh-teal text-base border-b border-gray-100/50"
              >
                <span className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-rh-red" /> 4. Expertise & Skills
                </span>
                <span className="text-xl text-gray-400">{openSection === 'skills' ? '−' : '+'}</span>
              </button>
              {openSection === 'skills' && (
                <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white animate-fadeIn">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="Add a skill..."
                      className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-[#F4F7FA] border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal/20 transition-all font-medium animate-fadeIn"
                    />
                    <Button type="button" onClick={addSkill} variant="outline" className="px-8 border-2 border-gray-100 rounded-2xl font-bold">Add</Button>
                  </div>
                  {talentForm.formState.errors.skills && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {talentForm.formState.errors.skills.message}
                    </motion.p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-6">
                    {watchedSkills.map(s => (
                      <span key={s} className="px-5 py-2.5 bg-rh-light text-rh-teal rounded-xl text-xs font-bold flex items-center gap-3 group">
                        {s}
                        <button type="button" onClick={() => removeSkill(s)}><Trash2 className="w-4 h-4 text-gray-300 group-hover:text-rh-red transition-colors" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 5. Education & Qualifications */}
            <div className={`border border-gray-100 rounded-3xl shadow-sm bg-white transition-all ${openSection === 'education' ? 'relative z-30 overflow-visible' : 'overflow-hidden'}`}>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'education' ? '' : 'education')}
                className="w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 bg-gray-50/50 hover:bg-gray-50 transition-all font-bold text-rh-teal text-base border-b border-gray-100/50"
              >
                <span className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-rh-red" /> 5. Education & Qualifications
                </span>
                <span className="text-xl text-gray-400">{openSection === 'education' ? '−' : '+'}</span>
              </button>
              {openSection === 'education' && (
                <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white animate-fadeIn">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {renderEditSelect("Highest Qualification Achieved", "highestQualification", ["High School / Diploma", "Bachelor's Degree", "Master's Degree", "PhD / Doctorate", "Professional Certification"], true)}
                      {renderEditInput("Field of Study / Major", "fieldOfStudy", "e.g. Computer Science", "text", true)}
                      {renderEditInput("Institution Name", "institutionName", "e.g. Stanford University", "text", true)}
                      {renderEditInput("Graduation Year", "graduationYear", "e.g. 2021")}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {renderEditRadio("Do you hold any professional licences or registrations?", "hasLicences", ["Yes", "No"])}
                      {talentForm.watch('hasLicences') === 'Yes' && renderEditInput("List Licences & Issuing Authorities", "licencesList", "e.g. CPA (AICPA), PMP (PMI)")}
                    </div>

                    {/* Education List */}
                    <div className="space-y-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-rh-teal uppercase tracking-widest">Academic History</h4>
                        <button type="button" onClick={() => appendEdu({ school: '', degree: '', year: '' })} className="text-rh-red font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                          <Plus className="w-4 h-4" /> Add Education
                        </button>
                      </div>
                      <div className="space-y-4">
                        {eduFields.map((field, index) => {
                          const eduErr = talentForm.formState.errors.educations?.[index];
                          return (
                            <div key={field.id} className="p-4 sm:p-6 bg-[#F9FBFF] rounded-2xl border border-gray-100 relative group">
                              <button type="button" onClick={() => removeEdu(index)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-rh-red transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2 space-y-1.5">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">School / University</label>
                                  <input {...talentForm.register(`educations.${index}.school`)} className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white border ${eduErr?.school ? 'border-red-500 bg-red-50/10' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium`} />
                                  {eduErr?.school && (
                                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {eduErr.school.message}
                                    </motion.p>
                                  )}
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Degree</label>
                                  <input {...talentForm.register(`educations.${index}.degree`)} className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white border ${eduErr?.degree ? 'border-red-500 bg-red-50/10' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium`} />
                                  {eduErr?.degree && (
                                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {eduErr.degree.message}
                                    </motion.p>
                                  )}
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Year</label>
                                  <input {...talentForm.register(`educations.${index}.year`)} className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white border ${eduErr?.year ? 'border-red-500 bg-red-50/10' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-rh-teal/10 transition-all text-sm font-medium`} />
                                  {eduErr?.year && (
                                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {eduErr.year.message}
                                    </motion.p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Language Proficiency */}
            <div className={`border border-gray-100 rounded-3xl shadow-sm bg-white transition-all ${openSection === 'language' ? 'relative z-30 overflow-visible' : 'overflow-hidden'}`}>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'language' ? '' : 'language')}
                className="w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 bg-gray-50/50 hover:bg-gray-50 transition-all font-bold text-rh-teal text-base border-b border-gray-100/50"
              >
                <span className="flex items-center gap-3">
                  <Languages className="w-5 h-5 text-rh-red" /> 6. Language Proficiency
                </span>
                <span className="text-xl text-gray-400">{openSection === 'language' ? '−' : '+'}</span>
              </button>
              {openSection === 'language' && (
                <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white animate-fadeIn">
                  <div className="grid md:grid-cols-2 gap-6">
                    {renderEditSelect("English Test Status", "englishTest", ["IELTS", "TOEFL", "PTE", "OET", "None"], true)}
                    {talentForm.watch('englishTest') && talentForm.watch('englishTest') !== 'None' && (
                      <>
                        {renderEditInput("Overall Score / Band", "overallScore", "e.g. 7.5")}
                        {renderEditInput("Test Date / Validity", "testDate", "YYYY-MM-DD", "date")}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 7. Visa & Work Rights */}
            <div className={`border border-gray-100 rounded-3xl shadow-sm bg-white transition-all ${openSection === 'visa' ? 'relative z-30 overflow-visible' : 'overflow-hidden'}`}>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'visa' ? '' : 'visa')}
                className="w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 bg-gray-50/50 hover:bg-gray-50 transition-all font-bold text-rh-teal text-base border-b border-gray-100/50"
              >
                <span className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-rh-red" /> 7. Visa & Work Rights
                </span>
                <span className="text-xl text-gray-400">{openSection === 'visa' ? '−' : '+'}</span>
              </button>
              {openSection === 'visa' && (
                <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white animate-fadeIn">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {renderEditInput("Current Visa / Residency Status", "visaStatus", "e.g. Employment Pass / Citizen", "text", true)}
                      {renderEditInput("Legal Work Rights in Target Country", "legalWorkRights", "e.g. Require Sponsorship / Permanent Resident", "text", false)}
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {renderEditRadio("Are you open to relocation?", "openToRelocation", ["Yes", "No"], true)}
                    </div>
                    {/* Applied Australian Visa — conditional below */}
                    <div className="space-y-4">
                      {renderEditRadio("Have you applied for an Australian Visa before?", "appliedAusVisa", ["Yes", "No"])}
                      {talentForm.watch('appliedAusVisa') === 'Yes' && renderEditInput("Which Visa Subclass?", "visaTypeApplied", "e.g. Subclass 482, 189, 190")}
                    </div>
                    {/* Visa refusal — conditional below */}
                    <div className="space-y-4">
                      {renderEditRadio("Have you ever had a visa refusal or cancellation for any country?", "visaRefusal", ["Yes", "No"])}
                      {talentForm.watch('visaRefusal') === 'Yes' && renderEditTextarea("Please provide details of the visa refusal/cancellation", "visaRefusalDetails", "Explain the reasons and country...")}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 8. Relocation & Availability */}
            <div className={`border border-gray-100 rounded-3xl shadow-sm bg-white transition-all ${openSection === 'relocation' ? 'relative z-30 overflow-visible' : 'overflow-hidden'}`}>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'relocation' ? '' : 'relocation')}
                className="w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 bg-gray-50/50 hover:bg-gray-50 transition-all font-bold text-rh-teal text-base border-b border-gray-100/50"
              >
                <span className="flex items-center gap-3">
                  <Plane className="w-5 h-5 text-rh-red" /> 8. Relocation & Availability
                </span>
                <span className="text-xl text-gray-400">{openSection === 'relocation' ? '−' : '+'}</span>
              </button>
              {openSection === 'relocation' && (
                <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white animate-fadeIn">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {renderEditSelect("If relocating, will you relocate alone or with family?", "relocateAloneOrFamily", ["Alone", "With Partner", "With Family (Partner & Children)"], true)}
                      {renderEditRadio("Do you hold a valid passport?", "validPassport", ["Yes", "No"])}
                      {talentForm.watch('validPassport') === 'Yes' && renderEditInput("Passport Expiry Date", "passportExpiry", "YYYY-MM-DD", "date", true)}
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {renderEditRadio("Are you willing to undergo a medical and background check?", "medicalBackgroundCheck", ["Yes", "No"])}
                      {renderEditRadio("Do you have any criminal convictions?", "criminalConvictions", ["Yes", "No"])}
                    </div>
                    {talentForm.watch('criminalConvictions') === 'Yes' && renderEditTextarea("Please provide details of convictions", "criminalDetails", "Provide details...")}
                  </div>
                </div>
              )}
            </div>

            {/* 9. Uploaded Documents */}
            <div className={`border border-gray-100 rounded-3xl shadow-sm bg-white transition-all ${openSection === 'documents' ? 'relative z-30 overflow-visible' : 'overflow-hidden'}`}>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'documents' ? '' : 'documents')}
                className="w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 bg-gray-50/50 hover:bg-gray-50 transition-all font-bold text-rh-teal text-base border-b border-gray-100/50"
              >
                <span className="flex items-center gap-3">
                  <FileCheck className="w-5 h-5 text-rh-red" /> 9. Uploaded Documents
                </span>
                <span className="text-xl text-gray-400">{openSection === 'documents' ? '−' : '+'}</span>
              </button>
              {openSection === 'documents' && (
                <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white animate-fadeIn">
                  {/* Resume Section inside documents */}
                  {(() => {
                    const url = talentForm.watch('resumeUrl');
                    const sessionState = docUploadStates['resumeUrl'] || 'idle';
                    const hasResume = !!url;
                    const error = talentForm.formState.errors.resumeUrl;

                    let cardClass = 'border-rh-teal/5 bg-[#F9FBFF]';
                    let blurClass = 'bg-rh-teal/5';
                    let iconClass = 'bg-white text-rh-teal border-gray-50';
                    let iconElement = <FileText className="w-7 h-7" />;
                    let textElement = hasResume ? (
                      <p className="text-xs text-gray-500 font-medium">Update your professional CV here</p>
                    ) : (
                      <p className="text-xs text-gray-500 font-medium">No resume uploaded yet</p>
                    );
                    let buttonClass = 'border-rh-teal/10 hover:border-rh-teal hover:bg-rh-teal hover:text-white text-rh-teal';
                    let buttonText = hasResume ? 'Update' : 'Upload';

                    if (error || resumeUploadError) {
                      cardClass = 'border-red-500 bg-red-50/10';
                      blurClass = 'bg-red-500/5';
                    } else if (sessionState === 'success') {
                      cardClass = 'border-emerald-500/30 bg-emerald-50/20';
                      blurClass = 'bg-emerald-500/5';
                      iconClass = 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/10';
                      iconElement = <CheckCircle className="w-7 h-7 animate-pulse" />;
                      textElement = (
                        <p className="text-emerald-600 text-xs font-bold flex items-center gap-1.5 mt-0.5 animate-fadeIn">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Resume uploaded successfully
                        </p>
                      );
                      buttonClass = 'border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white text-emerald-600';
                      buttonText = 'Update';
                    } else if (sessionState === 'failed') {
                      cardClass = 'border-red-500 bg-red-50/10';
                      blurClass = 'bg-red-500/5';
                      iconClass = 'bg-red-500 text-white border-red-500 shadow-red-500/10';
                      iconElement = <AlertCircle className="w-7 h-7" />;
                      textElement = (
                        <p className="text-red-600 text-xs font-bold flex items-center gap-1.5 mt-0.5 animate-fadeIn">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" /> Upload failed. Please try again.
                        </p>
                      );
                      buttonClass = 'border-red-500/20 hover:border-red-500 hover:bg-red-500 hover:text-white text-red-600';
                      buttonText = 'Try Again';
                    }

                    return (
                      <div className="space-y-1 w-full animate-fadeIn">
                        <div className={`rounded-[2rem] p-8 border relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 transition-all ${cardClass}`}>
                          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none ${blurClass}`} />

                          <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto">
                            <div className={`w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center border shrink-0 transition-all ${iconClass}`}>
                              {iconElement}
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-rh-teal mb-0.5">Your Resume <span className="text-red-500">*</span></h4>
                              {textElement}
                              <span className="text-[10px] text-gray-400 mt-1 block opacity-80">Max Size: 5MB | Format: PDF, DOC, DOCX</span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mt-6 sm:mt-0 relative z-10">
                            <input
                              id="resume-upload-edit"
                              type="file"
                              className="hidden"
                              accept=".pdf,.doc,.docx"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const error = validateFileConstraints(file, 'resumes', '.pdf,.doc,.docx');
                                  if (error) {
                                    setResumeUploadError(error);
                                    e.target.value = '';
                                    return;
                                  }
                                  setResumeUploadError('');
                                  talentForm.clearErrors('resumeUrl');
                                  if ((profile?.resumes?.length || 0) >= 5) {
                                    toast.error('Maximum 5 resumes allowed. Please delete an existing resume first.');
                                    return;
                                  }
                                  try {
                                    setSaving(true);
                                    const timestamp = Date.now();
                                    const fileName = `${user?.id}-${timestamp}-${file.name.replace(/\s+/g, '-')}`;
                                    const url = await uploadFile(file, 'resumes', fileName);
                                    talentForm.setValue('resumeUrl', url, { shouldDirty: true });

                                    // Add to resumes list & calculate ATS score
                                    const newResume = await authApi.addResume({
                                      fileName: file.name,
                                      fileUrl: url,
                                    });
                                    if (newResume?.atsScore) {
                                      setResumeScore(newResume.atsScore);
                                    }
                                    setDocUploadStates(prev => ({ ...prev, resumeUrl: 'success' }));
                                    await fetchProfile();
                                    toast.success('Resume uploaded successfully!');
                                  } catch (err: any) {
                                    setDocUploadStates(prev => ({ ...prev, resumeUrl: 'failed' }));
                                    toast.error(err.response?.data?.message || 'Failed to upload resume');
                                  } finally {
                                    setSaving(false);
                                  }
                                }
                              }}
                            />
                            <Button
                              type="button"
                              onClick={() => document.getElementById('resume-upload-edit')?.click()}
                              variant="outline"
                              className={`w-full sm:w-auto px-6 py-3 border-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center ${buttonClass}`}
                            >
                              <Upload className="w-4 h-4 mr-2" /> {buttonText}
                            </Button>

                            {hasResume && (
                              <button
                                type="button"
                                onClick={() => setSelectedDoc({ url: talentForm.watch('resumeUrl') || '', title: 'Your Resume' })}
                                className="w-full sm:w-auto px-6 py-3 bg-white text-rh-teal rounded-xl font-bold text-sm shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-center gap-2"
                              >
                                <Target className="w-4 h-4" /> View
                              </button>
                            )}
                          </div>
                        </div>
                        {(error || resumeUploadError) && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {resumeUploadError || error?.message}
                          </motion.p>
                        )}
                      </div>
                    );
                  })()}

                  <div className="space-y-6 pt-4">
                    {renderEditDocUpload("Passport Copy (Bio-Data Page)", "passportUrl", "talent-documents", true)}
                    {renderEditDocUpload("Current Visa / Residency Permit / Work Permit", "visaUrl", "talent-documents", true)}
                    {renderEditDocUpload("Educational Certificates", "eduCertUrl", "talent-documents", true)}
                    {renderEditDocUpload("Employment Certificates / Experience Letters", "empCertUrl", "talent-documents", true)}
                    {renderEditDocUpload("English Test Results", "englishTestUrl", "talent-documents", false)}
                    {renderEditDocUpload("Professional Licences / Certifications", "licenceUrl", "talent-documents", false)}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-10 border-t border-gray-50">
            <Button type="button" onClick={() => setActiveTab('overview')} variant="outline" className="w-full sm:w-auto px-10 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 justify-center">Discard</Button>
            <Button type="submit" disabled={saving} variant="primary" className="w-full sm:w-auto px-12 py-4 bg-rh-teal text-white rounded-2xl font-bold shadow-xl shadow-rh-teal/10 flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={employerForm.handleSubmit(onUpdateSubmit, onUpdateError)} className="space-y-10">
          <input type="hidden" {...employerForm.register('companyLogo')} />
          {/* Employer Avatar Upload */}
          <div className="bg-rh-light/30 rounded-[2rem] p-8 border border-rh-teal/5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl bg-white overflow-hidden shadow-md border-4 border-white">
                    {employerForm.watch('companyLogo') ? (
                      <img src={employerForm.watch('companyLogo') || ''} alt="Company Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-rh-teal mb-0.5">Professional Photo</h4>
                  <p className="text-xs text-gray-500 font-medium">Add a photo to build trust with talent</p>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => document.getElementById('employer-avatar-upload')?.click()}
                variant="primary"
                className="px-8 py-3.5 bg-rh-teal hover:bg-[#0E8A8F] text-white rounded-xl font-bold text-sm shadow-lg shadow-rh-teal/10"
              >
                <Camera className="w-4 h-4 mr-2" /> Change Photo
                <input
                  id="employer-avatar-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        setSaving(true);
                        const url = await uploadFile(file, 'company-logo', `${user?.id}-${Date.now()}-${file.name}`);
                        employerForm.setValue('companyLogo', url);
                        await authApi.updateProfile({ companyLogo: url, avatarUrl: url });
                        dispatch(updateProfileSuccess({ avatarUrl: url }));
                        fetchProfile();
                      } catch (err) {
                        alert('Failed to upload photo');
                      } finally {
                        setSaving(false);
                      }
                    }
                  }}
                />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {renderEditInput("First Name", "firstName", "e.g. John", "text", true)}
            {renderEditInput("Last Name", "lastName", "e.g. Doe", "text", true)}
            {renderEditInput("Business Email", "businessEmail", "e.g. john@company.com", "email", true)}
            {renderEditInput("Business Phone", "businessPhone", "e.g. +1 555 0123", "text", true)}
            {renderEditInput("Company Name", "companyName", "e.g. Acme Corp", "text", true)}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Position Type <span className="text-red-500">*</span></label>
              <div className={`rounded-2xl border ${employerForm.formState.errors.positionType ? 'border-red-500 bg-red-50/10' : 'border-transparent'}`}>
                <Controller
                  name="positionType"
                  control={employerForm.control}
                  render={({ field }) => (
                    <Dropdown
                      options={signUpPositionType}
                      value={field.value}
                      onChange={field.onChange}
                      className="border-transparent bg-[#F4F7FA] focus:bg-white"
                    />
                  )}
                />
              </div>
              {employerForm.formState.errors.positionType && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1.5 ml-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {employerForm.formState.errors.positionType.message}
                </motion.p>
              )}
            </div>

            {renderEditInput("Your Job Title", "jobTitle", "e.g. HR Director", "text", true)}
            {renderEditInput("Job Title to Hire", "jobTitleToHire", "e.g. React Developer", "text", true)}
            {renderEditInput("Zip Code", "zipCode", "e.g. 90210", "text", true)}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-10 border-t border-gray-50">
            <Button type="button" onClick={() => setActiveTab('overview')} variant="outline" className="w-full sm:w-auto px-10 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 justify-center">Discard</Button>
            <Button type="submit" disabled={saving} variant="primary" className="w-full sm:w-auto px-12 py-4 bg-rh-teal text-white rounded-2xl font-bold shadow-xl shadow-rh-teal/10 flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
            </Button>
          </div>
        </form>
      )}
    </motion.div>
  );
};
