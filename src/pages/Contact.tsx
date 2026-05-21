import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Send, ArrowRight, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import { fadeUp } from '../utils/animations';
import { contactBoxes, contactDetails, subjectOptions } from '../data/index';
import { contactApi } from '../lib/contact';

export default function ContactPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subject, setSubject] = useState('General Inquiry');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await contactApi.submitMessage({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject,
        message: formData.message.trim(),
      });
      
      toast.success('Your message has been submitted successfully!');
      
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        message: '',
      });
      setSubject('General Inquiry');
      setValidationErrors({});
    } catch (err: any) {
      console.error('Contact submission error:', err);
      const backendMessage = err.response?.data?.message;
      if (Array.isArray(backendMessage)) {
        setSubmitError(backendMessage.join(', '));
      } else if (typeof backendMessage === 'string') {
        setSubmitError(backendMessage);
      } else {
        setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-rh-dark pt-32 pb-20 md:pt-48 md:pb-32 lg:pt-56 lg:pb-40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.pexels.com/photos/7682340/pexels-photo-7682340.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-rh-red/10 -skew-x-12 translate-x-1/2 hidden lg:block" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.1] tracking-tight mb-8">
              Let's start a <br />
              <span className="text-rh-red font-[300]">conversation</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed font-light">
              Whether you're looking for your next career move or seeking world-class talent, we're here to help you navigate the journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 md:py-32 bg-rh-light/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

            {/* Contact Info (Left) */}
            <div className="lg:col-span-5 space-y-12 sm:space-y-16">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-rh-teal mb-6">Contact Information</h2>
                <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                  Fill out the form and our team will get back to you within 24 hours. We're also available via email and phone during business hours.
                </p>
              </div>

              <div className="space-y-8 sm:space-y-10">
                {[
                  { icon: Mail, label: 'Email Us', value: contactDetails.email, color: 'text-rh-red' },
                  { icon: Phone, label: 'Call Us', value: contactDetails.phone, color: 'text-rh-teal' },
                  { icon: MapPin, label: 'Visit Us', value: contactDetails.address, color: 'text-rh-red' }
                ].map((item) => (
                  <div key={item.label} className="flex gap-6 group">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-rh-teal shrink-0 group-hover:bg-rh-red group-hover:text-white transition-all duration-500 border border-gray-50">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{item.label}</p>
                      <p className="text-sm sm:text-lg font-bold text-rh-teal">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 sm:p-10 bg-rh-teal rounded-[32px] text-white relative overflow-hidden shadow-2xl shadow-rh-teal/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rh-red/20 rounded-full blur-3xl -translate-y-16 translate-x-16" />
                <h4 className="text-xl sm:text-2xl font-bold mb-4 relative z-10">Global Presence</h4>
                <p className="text-white/60 text-sm leading-relaxed mb-8 relative z-10">We operate across 12 countries with dedicated teams in each region ensuring local expertise with global reach.</p>
                <div className="flex flex-wrap gap-3 relative z-10">
                  {['Australia', 'India', 'Singapore', 'UAE', 'UK', 'USA'].map(country => (
                    <span key={country} className="px-3 py-1.5 bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10">{country}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form (Right) */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[32px] sm:rounded-[48px] p-8 sm:p-12 md:p-16 shadow-2xl shadow-gray-200/50 border border-gray-100"
              >
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  {submitError && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Submission Failed</p>
                        <p className="text-red-500/90 mt-0.5">{submitError}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input
                        required
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. John Doe"
                        className={`w-full px-6 py-4 rounded-2xl outline-none transition-all text-sm font-medium border ${
                          validationErrors.fullName
                            ? 'border-red-500 bg-red-50/10 focus:ring-2 focus:ring-red-500/10 focus:border-red-500'
                            : 'border-transparent bg-rh-light focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20'
                        }`}
                      />
                      {validationErrors.fullName && (
                        <span className="text-xs text-red-500 flex items-center gap-1 mt-1 ml-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {validationErrors.fullName}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@company.com"
                        className={`w-full px-6 py-4 rounded-2xl outline-none transition-all text-sm font-medium border ${
                          validationErrors.email
                            ? 'border-red-500 bg-red-50/10 focus:ring-2 focus:ring-red-500/10 focus:border-red-500'
                            : 'border-transparent bg-rh-light focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20'
                        }`}
                      />
                      {validationErrors.email && (
                        <span className="text-xs text-red-500 flex items-center gap-1 mt-1 ml-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {validationErrors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 (000) 000 000"
                        className="w-full px-6 py-4 bg-rh-light border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                      <Dropdown
                        options={subjectOptions}
                        value={subject}
                        onChange={setSubject}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Your Message</label>
                    <textarea
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="How can we help you?"
                      className={`w-full h-32 sm:h-48 px-6 py-4 rounded-2xl outline-none transition-all text-sm font-medium resize-none border ${
                        validationErrors.message
                          ? 'border-red-500 bg-red-50/10 focus:ring-2 focus:ring-red-500/10 focus:border-red-500'
                          : 'border-transparent bg-rh-light focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20'
                      }`}
                    />
                    {validationErrors.message && (
                      <span className="text-xs text-red-500 flex items-center gap-1 mt-1 ml-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {validationErrors.message}
                      </span>
                    )}
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4.5 rounded-2xl shadow-xl shadow-rh-red/20 font-bold flex items-center justify-center gap-3 group"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations / FAQ Preview */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contactBoxes.map((box) => (
              <div key={box.title} className="p-10 rounded-[32px] bg-rh-light border border-gray-100 hover:bg-rh-teal hover:text-white transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-rh-red mb-8 group-hover:bg-rh-red group-hover:text-white transition-all">
                  <box.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold mb-4">{box.title}</h4>
                <p className="text-gray-500 group-hover:text-white/70 text-sm leading-relaxed mb-8 font-medium">{box.desc}</p>
                <div className="flex items-center gap-2 text-rh-red group-hover:text-white text-xs font-bold uppercase tracking-widest cursor-pointer">
                  {box.action} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
