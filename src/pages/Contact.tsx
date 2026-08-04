import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, ArrowRight, AlertCircle, MessageSquare, MessagesSquare, Search, Clock, ChevronLeft } from 'lucide-react';
import { Check, CheckCheck } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of active chat thread
  useEffect(() => {
    if (activeMessageId) {
      const timer = setTimeout(() => {
        if (chatEndRef.current) {
          const container = chatEndRef.current.parentElement;
          if (container) {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeMessageId, userMessages]);

  useEffect(() => {
    const enquiryIdParam = searchParams.get('id');
    if (enquiryIdParam && userMessages.length > 0) {
      setActiveMessageId(enquiryIdParam);
    }
  }, [searchParams, userMessages]);

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

    const handleNewNotification = (e: Event) => {
      const customEvent = e as CustomEvent;
      const notif = customEvent.detail;
      if (notif.type === 'MESSAGE' && notif.link === '/contact') {
        fetchUserMessages();
      }
    };

    const handleChatRead = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { threadId } = customEvent.detail;
      setUserMessages(prev => prev.map(msg => {
        if (msg.id === threadId) {
          return {
            ...msg,
            replies: msg.replies?.map(r => ({ ...r, isRead: true }))
          };
        }
        return msg;
      }));
    };

    const handleChatTyping = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { threadId, isTyping } = customEvent.detail;
      setTypingUsers(prev => ({ ...prev, [threadId]: isTyping }));
    };

    window.addEventListener('ws_chat_read', handleChatRead);
    window.addEventListener('ws_chat_typing', handleChatTyping);
    window.addEventListener('ws_new_chat_reply', handleNewChatReply);
    window.addEventListener('ws_new_notification', handleNewNotification);
    return () => {
      window.removeEventListener('ws_chat_read', handleChatRead);
      window.removeEventListener('ws_chat_typing', handleChatTyping);
      window.removeEventListener('ws_new_chat_reply', handleNewChatReply);
      window.removeEventListener('ws_new_notification', handleNewNotification);
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
      {user && (() => {
        let supportEnquiries = userMessages.filter(msg => msg.type !== 'DIRECT_MESSAGE');

        // Sort by latest update
        supportEnquiries.sort((a, b) => {
          const aLast = a.replies?.length ? new Date(a.replies[a.replies.length - 1].createdAt).getTime() : new Date(a.createdAt).getTime();
          const bLast = b.replies?.length ? new Date(b.replies[b.replies.length - 1].createdAt).getTime() : new Date(b.createdAt).getTime();
          return bLast - aLast;
        });

        const filteredEnquiries = supportEnquiries.filter(msg =>
          msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.message.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const activeMessage = supportEnquiries.find(m => m.id === activeMessageId);

        return (
          <section className="py-20 md:py-24 bg-rh-light/20 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <span className="px-4 py-1.5 bg-rh-red/10 text-rh-red border border-rh-red/20 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">Support & Consultations</span>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Your Live Enquiries</h2>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">View active conversations and get status updates from the Orange Global team.</p>
              </div>

              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 flex overflow-hidden h-[calc(100vh-200px)] lg:h-[calc(100vh-280px)] min-h-[500px] max-h-[800px]">
                {/* Sidebar */}
                <div className={`w-full md:w-[320px] lg:w-[380px] border-r border-gray-100 flex flex-col shrink-0 transition-transform ${activeMessageId ? 'hidden md:flex' : 'flex'}`}>
                  <div className="p-4 sm:p-6 border-b border-gray-100 bg-white">
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search enquiries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rh-red/20 focus:border-rh-red transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {isLoadingMessages ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <div className="w-8 h-8 border-4 border-rh-teal/30 border-t-rh-teal rounded-full animate-spin mb-4" />
                      </div>
                    ) : filteredEnquiries.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-400">
                        <MessagesSquare className="w-10 h-10 mb-3 opacity-50" />
                        <p className="text-sm font-medium">No conversations found</p>
                      </div>
                    ) : (
                      <div className="p-3 space-y-1">
                        {filteredEnquiries.map((msg) => {
                          const isActive = msg.id === activeMessageId;
                          const lastReply = msg.replies && msg.replies.length > 0 ? msg.replies[msg.replies.length - 1] : null;
                          const previewText = lastReply ? lastReply.message : msg.message;

                          return (
                            <button
                              key={msg.id}
                              onClick={() => { setActiveMessageId(msg.id); setReplyText(''); }}
                              className={`w-full text-left p-4 rounded-2xl transition-all ${isActive ? 'bg-rh-red/5 ring-1 ring-rh-red/20' : 'hover:bg-gray-50'}`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${msg.status === 'RESOLVED' ? 'bg-green-50 border-green-200 text-green-600' : msg.status === 'IN_PROGRESS' ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                                  {msg.status}
                                </span>
                                <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0 flex items-center gap-1 font-medium pl-1">
                                  {new Date(lastReply ? lastReply.createdAt : msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              <h4 className={`font-bold text-sm truncate pr-2 max-w-[75%] mb-1 ${isActive ? 'text-rh-red' : 'text-gray-900'}`}>
                                {msg.subject ? msg.subject.replace(/Direct Message/gi, 'Chat') : ''}
                              </h4>
                              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                {previewText}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Chat Area */}
                <div className={`flex-1 flex flex-col bg-[#F8FAFC] relative ${!activeMessageId ? 'hidden md:flex' : 'flex'}`}>
                  {!activeMessage ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white">
                      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <MessagesSquare className="w-10 h-10 text-gray-300" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Your Live Enquiries</h3>
                      <p className="text-sm">Select a conversation from the left to view details or chat.</p>
                    </div>
                  ) : (
                    <>
                      {/* Chat Header */}
                      <div className="h-[76px] px-6 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setActiveMessageId(null)}
                            className="md:hidden w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="font-bold text-gray-900 text-sm max-w-[140px] sm:max-w-[200px] md:max-w-xs truncate">{activeMessage.subject ? activeMessage.subject.replace(/Direct Message/gi, 'Chat') : ''}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border shrink-0 ${activeMessage.status === 'RESOLVED' ? 'bg-green-50 border-green-200 text-green-600' : activeMessage.status === 'IN_PROGRESS' ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                                {activeMessage.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Created {new Date(activeMessage.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Chat Messages Container */}
                      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full relative z-10">
                        {/* Original Message Context */}
                        <div className="flex justify-center mb-6 sm:mb-8">
                          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 max-w-[95%] sm:max-w-lg w-full shadow-sm text-center">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Original Query</p>
                            <p className="text-xs sm:text-sm text-gray-800 whitespace-pre-wrap">{activeMessage.message}</p>
                          </div>
                        </div>

                        {/* Replies List */}
                        {activeMessage.replies?.map((reply, idx) => {
                          const isAdmin = reply.senderRole === 'ADMIN' || (reply as any).sender_role === 'ADMIN' || reply.sender?.role === 'ADMIN' || reply.senderRole === 'admin';
                          const senderName = isAdmin
                            ? `${reply.sender?.adminProfile?.firstName || 'Orange'} ${reply.sender?.adminProfile?.lastName || 'Global'}`
                            : (reply.sender?.talentProfile?.fullName || 'You');

                          return (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              key={reply.id || idx}
                              className={`flex gap-2 sm:gap-3 max-w-[95%] sm:max-w-[85%] lg:max-w-[75%] ${isAdmin ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'}`}
                            >
                              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold shadow-sm select-none ${isAdmin
                                ? 'bg-gray-900 text-white'
                                : 'bg-gradient-to-br from-rh-teal to-[#1aa19d] text-white'
                                }`}>
                                {senderName.charAt(0)}
                              </div>

                              <div className="max-w-[calc(100%-2.5rem)]">
                                <div className={`flex items-center gap-2 mb-1 text-[10px] font-bold ${isAdmin ? 'justify-start text-gray-500' : 'justify-end text-rh-teal'}`}>
                                  <span>{senderName}</span>
                                  <span className="text-gray-300 font-light">•</span>
                                  <span>
                                    {new Date(reply.createdAt).toLocaleTimeString(undefined, {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <div className={`p-4 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm ${isAdmin
                                  ? 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'
                                  : 'bg-rh-light border border-rh-teal/10 text-gray-800 rounded-2xl rounded-tr-sm'
                                  }`}>
                                  {reply.message}
                                </div>
                                {!isAdmin && (
                                  <div className="flex items-center ml-1">
                                    {reply.isRead ? <CheckCheck className="w-3 h-3 text-blue-400" /> : <Check className="w-3 h-3 text-white/70" />}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                        {typingUsers[activeMessage.id] && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 sm:gap-3 max-w-[95%] sm:max-w-[85%] lg:max-w-[75%] mr-auto text-left">
                            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold shadow-sm select-none bg-gray-900 text-white">
                              O
                            </div>
                            <div className="max-w-[calc(100%-2.5rem)]">
                              <div className="flex items-center gap-2 mb-1 text-[10px] font-bold justify-start text-gray-500">
                                <span>Orange Global</span>
                              </div>
                              <div className="p-4 bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1 h-[40px]">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Chat Input Area */}
                      {activeMessage.status !== 'RESOLVED' && (
                        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                          <div className="flex items-end gap-3 max-w-4xl mx-auto relative">
                            <textarea
                              value={replyText}
                              onChange={(e) => {
                                setReplyText(e.target.value);
                                if (!typingTimeoutRef.current) {
                                  contactApi.triggerTyping(activeMessage.id, true).catch(() => { });
                                } else {
                                  clearTimeout(typingTimeoutRef.current);
                                }
                                typingTimeoutRef.current = setTimeout(() => {
                                  contactApi.triggerTyping(activeMessage.id, false).catch(() => { });
                                  typingTimeoutRef.current = null;
                                }, 2000);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendReply(activeMessage.id);
                                }
                              }}
                              placeholder="Type a message..."
                              rows={1}
                              style={{ minHeight: '52px', maxHeight: '150px' }}
                              className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-teal/20 focus:border-rh-teal outline-none text-sm font-medium transition-all resize-none [&::-webkit-scrollbar]:w-[4px]"
                            />
                            <button
                              disabled={isSendingReply || !replyText.trim()}
                              onClick={() => handleSendReply(activeMessage.id)}
                              className="h-[52px] w-[52px] rounded-2xl bg-rh-teal text-white flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-rh-teal/20 disabled:opacity-50 disabled:shadow-none transition-all shrink-0"
                            >
                              {isSendingReply ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <Send className="w-5 h-5 ml-1" />
                              )}
                            </button>
                          </div>
                          <p className="text-center text-[10px] text-gray-400 mt-2 font-medium">Press Enter to send, Shift + Enter for new line</p>
                        </div>
                      )}

                      {activeMessage.status === 'RESOLVED' && (
                        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center shrink-0">
                          <p className="text-sm font-medium text-gray-500">This enquiry has been resolved. You can no longer reply.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

              </div>
            </div>
          </section>
        );
      })()}

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

