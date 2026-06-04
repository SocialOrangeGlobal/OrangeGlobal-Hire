import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Send, ArrowRight, AlertCircle, MessageSquare, User, ChevronDown, ChevronUp, MessagesSquare
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import { fadeUp } from '../utils/animations';
import { contactBoxes, contactDetails } from '../data/index';
import { contactApi, ContactMessageItem } from '../lib/contact';
import { useAuth } from '../hooks/useAuth';

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [enquiryType, setEnquiryType] = useState(() => {
    if (typeParam === 'consultation' || typeParam === 'CONSULTATION') {
      return 'CONSULTATION';
    }
    return 'GENERAL_QUERY';
  });

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    message: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // User chat/history state
  const [userMessages, setUserMessages] = useState<ContactMessageItem[]>([]);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of active chat thread
  useEffect(() => {
    if (activeMessageId) {
      const timer = setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeMessageId, userMessages]);

  // Sync enquiryType when URL parameters change
  useEffect(() => {
    if (typeParam === 'consultation' || typeParam === 'CONSULTATION') {
      setEnquiryType('CONSULTATION');
    } else if (typeParam === 'general' || typeParam === 'GENERAL_QUERY') {
      setEnquiryType('GENERAL_QUERY');
    }
  }, [typeParam]);

  useEffect(() => {
    if (user) {
      fetchUserMessages();
    }
  }, [user]);

  const fetchUserMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const messages = await contactApi.getUserMessages();
      setUserMessages(messages);
    } catch (err) {
      console.error('Error fetching user messages:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    const handleNewChatReply = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { enquiryId, reply } = customEvent.detail;

      setUserMessages((prevMessages) =>
        prevMessages.map((msg) => {
          if (msg.id === enquiryId) {
            if (msg.replies?.some((r: any) => r.id === reply.id)) return msg;
            return {
              ...msg,
              replies: [...(msg.replies || []), reply]
            };
          }
          return msg;
        })
      );
    };

    window.addEventListener('ws_new_chat_reply', handleNewChatReply);
    return () => {
      window.removeEventListener('ws_new_chat_reply', handleNewChatReply);
    };
  }, []);

  const handleSendReply = async (messageId: string) => {
    if (!replyText.trim()) return;
    setIsSendingReply(true);
    try {
      const newReply = await contactApi.sendReply(messageId, replyText.trim());
      toast.success('Reply sent successfully!');
      setReplyText('');
      setUserMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            replies: [...msg.replies, newReply]
          };
        }
        return msg;
      }));
    } catch (err) {
      toast.error('Failed to send reply. Please try again.');
      console.error(err);
    } finally {
      setIsSendingReply(false);
    }
  };

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
        subject: enquiryType === 'CONSULTATION' ? 'One-on-One Migration Consultation' : 'General Inquiry Request',
        message: formData.message.trim(),
        type: enquiryType,
        userId: user?.id,
      });

      toast.success(
        enquiryType === 'CONSULTATION'
          ? 'Your consultation booking request has been submitted successfully!'
          : 'Your enquiry message has been submitted successfully!'
      );

      setFormData({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: '',
        message: '',
      });
      setValidationErrors({});

      if (user) {
        fetchUserMessages();
      }
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
              Whether you're looking for your next career move, booking a premium migration consultation, or seeking support, we're here to help.
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
                  {['Australia', 'India'].map(country => (
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

                  {/* Enquiry Type Toggle */}
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Enquiry Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setEnquiryType('GENERAL_QUERY')}
                        className={`py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all duration-300 border flex items-center justify-center gap-2 ${enquiryType === 'GENERAL_QUERY'
                          ? 'border-rh-teal bg-rh-teal/5 text-rh-teal shadow-md shadow-rh-teal/5 font-bold'
                          : 'border-gray-100 bg-rh-light text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        General Query
                      </button>
                      <button
                        type="button"
                        onClick={() => setEnquiryType('CONSULTATION')}
                        className={`py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all duration-300 border flex items-center justify-center gap-2 ${enquiryType === 'CONSULTATION'
                          ? 'border-rh-red bg-rh-red/5 text-rh-red shadow-md shadow-rh-red/5 font-bold'
                          : 'border-gray-100 bg-rh-light text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        <Mail className="w-4 h-4" />
                        Book Consultation
                      </button>
                    </div>
                  </div>

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
                        className={`w-full px-6 py-4 rounded-2xl outline-none transition-all text-sm font-medium border ${validationErrors.fullName
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
                        className={`w-full px-6 py-4 rounded-2xl outline-none transition-all text-sm font-medium border ${validationErrors.email
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
                    <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Your Message</label>
                    <textarea
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={enquiryType === 'CONSULTATION' ? "Please describe your case, visa preferences, or desired migration support..." : "How can we help you?"}
                      className={`w-full h-32 sm:h-48 px-6 py-4 rounded-2xl outline-none transition-all text-sm font-medium resize-none border ${validationErrors.message
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
                      className={`w-full py-4.5 rounded-2xl shadow-xl font-bold flex items-center justify-center gap-3 group transition-all duration-300 ${enquiryType === 'CONSULTATION'
                        ? 'bg-rh-red hover:bg-rh-red/90 shadow-rh-red/20'
                        : 'bg-rh-teal hover:bg-rh-teal/90 shadow-rh-teal/20'
                        }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          {enquiryType === 'CONSULTATION' ? 'Request Consultation' : 'Send Message'}
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

      {/* Auth Chat History Timeline (Interactive threaded support chat) */}
      {user && (
        <section className="py-20 md:py-24 bg-rh-light/20 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6 sm:px-8">
            <div className="text-center mb-12">
              <span className="px-4 py-1.5 bg-rh-teal/15 text-rh-teal rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">Support & Consultations</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-rh-teal">Your Live Enquiries</h2>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">View active conversations and get status updates from the Orange Global team.</p>
            </div>

            {isLoadingMessages ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="w-8 h-8 border-4 border-rh-teal/30 border-t-rh-teal rounded-full animate-spin mb-4" />
                <p className="text-sm font-semibold">Loading conversation history...</p>
              </div>
            ) : userMessages.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                <MessagesSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-bold text-lg">No conversations yet</p>
                <p className="text-gray-400 text-xs mt-1">Submit your first query or consultation request using the form above.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {userMessages.map((msg) => {
                  const isActive = activeMessageId === msg.id;
                  const repliesCount = msg.replies?.length || 0;
                  return (
                    <div
                      key={msg.id}
                      className={`bg-white rounded-[24px] border transition-all duration-300 overflow-hidden ${isActive
                        ? 'border-rh-teal shadow-xl ring-1 ring-rh-teal/10'
                        : 'border-gray-100 shadow-sm hover:border-gray-200'
                        }`}
                    >
                      {/* Thread Header Row */}
                      <div
                        onClick={() => {
                          setActiveMessageId(isActive ? null : msg.id);
                          setReplyText('');
                        }}
                        className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${msg.type === 'CONSULTATION'
                              ? 'bg-rh-red/10 border-rh-red/20 text-rh-red'
                              : 'bg-rh-teal/10 border-rh-teal/20 text-rh-teal'
                              }`}>
                              {msg.type === 'CONSULTATION' ? 'Consultation' : 'General Query'}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${msg.status === 'RESOLVED'
                              ? 'bg-green-50 border-green-200 text-green-600'
                              : msg.status === 'IN_PROGRESS'
                                ? 'bg-amber-50 border-amber-200 text-amber-600'
                                : 'bg-blue-50 border-blue-200 text-blue-600'
                              }`}>
                              {msg.status}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {new Date(msg.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <h3 className="font-bold text-rh-teal text-sm sm:text-base">{msg.subject}</h3>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                            <MessageSquare className="w-4 h-4 text-gray-300" />
                            <span>{repliesCount} {repliesCount === 1 ? 'reply' : 'replies'}</span>
                          </div>
                          <button className="w-8 h-8 rounded-full bg-rh-light flex items-center justify-center text-rh-teal hover:bg-rh-teal hover:text-white transition-all">
                            {isActive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Thread Content & Chat */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="border-t border-gray-100 bg-gray-50/40"
                          >
                            <div className="p-6 space-y-6">
                              {/* Original Message Section */}
                              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative">
                                <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                  <User className="w-3.5 h-3.5 text-gray-300" />
                                  <span>Original Query</span>
                                </div>
                                <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wide">Details</p>
                                <p className="text-sm text-rh-teal font-medium leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                              </div>

                              {/* Thread Replies */}
                              {msg.replies && msg.replies.length > 0 && (
                                <div className="space-y-4">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Conversation History</p>
                                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                                    {msg.replies.map((reply) => {
                                      const isAdmin = reply.senderRole === 'ADMIN';
                                      const senderName = isAdmin
                                        ? `${reply.sender?.adminProfile?.firstName || 'Orange'} ${reply.sender?.adminProfile?.lastName || 'Global'}`
                                        : (reply.sender?.talentProfile?.fullName || 'You');

                                      return (
                                        <div
                                          key={reply.id}
                                          className={`flex gap-3 max-w-[85%] ${isAdmin ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'
                                            }`}
                                        >
                                          {/* Mini avatar */}
                                          <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold border shadow-sm select-none ${isAdmin
                                            ? 'bg-rh-teal text-white border-rh-teal/10'
                                            : 'bg-rh-red text-white border-rh-red/10'
                                            }`}>
                                            {senderName.charAt(0)}
                                          </div>

                                          <div className="max-w-[calc(100%-2.5rem)]">
                                            <div className={`flex items-center gap-2 mb-1 text-[10px] font-bold ${isAdmin ? 'justify-start text-rh-teal' : 'justify-end text-rh-red'
                                              }`}>
                                              <span>{senderName}</span>
                                              <span className="text-gray-300 font-light">•</span>
                                              <span className="text-gray-400 font-medium">
                                                {new Date(reply.createdAt).toLocaleTimeString(undefined, {
                                                  hour: '2-digit',
                                                  minute: '2-digit'
                                                })}
                                              </span>
                                            </div>
                                            <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm border text-left whitespace-pre-wrap break-words ${isAdmin
                                              ? 'bg-gray-100 border-gray-200 text-gray-800 rounded-tl-none'
                                              : 'bg-rh-teal text-white border-rh-teal/10 rounded-tr-none'
                                              }`}>
                                              {reply.message}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                    <div ref={chatEndRef} />
                                  </div>
                                </div>
                              )}

                              {/* Action: Send a Reply */}
                              <div className="pt-4 border-t border-gray-100/80">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Send a follow-up reply</p>
                                <div className="flex gap-3">
                                  <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your reply here..."
                                    rows={1}
                                    className="flex-1 px-5 py-3 rounded-2xl border border-gray-100 bg-white focus:ring-2 focus:ring-rh-teal/10 focus:border-rh-teal outline-none text-sm font-semibold transition-all resize-none shadow-sm h-12 [&::-webkit-scrollbar]:w-[2px]"
                                  />
                                  <button
                                    disabled={isSendingReply || !replyText.trim()}
                                    onClick={() => handleSendReply(msg.id)}
                                    className="h-12 w-12 rounded-2xl bg-rh-teal text-white flex items-center justify-center hover:bg-rh-teal/90 shadow-lg shadow-rh-teal/15 disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none transition-all shrink-0"
                                  >
                                    {isSendingReply ? (
                                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                      <Send className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

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

