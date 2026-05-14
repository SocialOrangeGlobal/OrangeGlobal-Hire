import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight
} from 'lucide-react';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import { fadeUp, scaleIn } from '../utils/animations';
import { contactBoxes, contactDetails, subjectOptions } from '../data/index';

export default function ContactPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState('General Inquiry');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div
          initial="hidden" animate="visible" variants={scaleIn}
          className="max-w-xl w-full text-center"
        >
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-inner border border-green-100">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-rh-teal mb-6 tracking-tight">Message Received!</h2>
          <p className="text-gray-500 text-lg leading-relaxed mb-12">
            Thank you for reaching out. Our team has received your inquiry and will get back to you within 24 business hours.
          </p>
          <Button variant="primary" onClick={() => navigate('/')} className="px-12 py-4 rounded-2xl">Return to Home</Button>
        </motion.div>
      </div>
    );
  }

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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input
                        required type="text"
                        placeholder="e.g. John Doe"
                        className="w-full px-6 py-4 bg-rh-light border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input
                        required type="email"
                        placeholder="john@company.com"
                        className="w-full px-6 py-4 bg-rh-light border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input
                        type="tel"
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
                      placeholder="How can we help you?"
                      className="w-full h-32 sm:h-48 px-6 py-4 bg-rh-light border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/10 focus:border-rh-red/20 outline-none transition-all text-sm font-medium resize-none"
                    />
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
