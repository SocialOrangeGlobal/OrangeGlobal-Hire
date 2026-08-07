import { useState, useEffect, useRef } from 'react';
import { motion} from 'framer-motion';
import { Send, ChevronLeft, Search, MessagesSquare, ArrowLeft, Clock, Check, CheckCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { contactApi, ContactMessageItem } from '../lib/contact';
import { fadeUp } from '../utils/animations';

const DirectMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  useEffect(() => {
    const enquiryIdParam = searchParams.get("id");
    const focusParam = searchParams.get("focus");
    if (enquiryIdParam && messages.length > 0) {
      setActiveMessageId(enquiryIdParam);
      setSearchParams({}, { replace: true });
      if (focusParam === "true") {
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 500);
      }
    }
  }, [searchParams, messages, setSearchParams]);

  useEffect(() => {
    if (activeMessageId) {
      // Mark as read
      contactApi.markAsRead(activeMessageId).then(() => {
        setMessages(prev => prev.map(msg => {
          if (msg.id === activeMessageId) {
            return {
              ...msg,
              replies: msg.replies?.map(r => {
                // If it's a message from the OTHER person (admin), mark locally as read to hide badge
                const isAdmin = r.senderRole === 'ADMIN' || (r as any).sender_role === 'ADMIN' || r.sender?.role === 'ADMIN' || r.senderRole === 'admin';
                if (isAdmin) return { ...r, isRead: true };
                return r;
              })
            };
          }
          return msg;
        }));
      }).catch(console.error);
    }
  }, [activeMessageId]);

  useEffect(() => {
    if (activeMessageId && chatEndRef.current) {
      setTimeout(() => {
        if (chatEndRef.current) {
          const container = chatEndRef.current.parentElement;
          if (container) {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
          }
        }
      }, 300);
    }
  }, [activeMessageId, messages]);

  useEffect(() => {
    const handleNewChatReply = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { enquiryId, reply } = customEvent.detail;

      setMessages((prevMessages) => {
        const exists = prevMessages.some(msg => msg.id === enquiryId);
        if (!exists) {
          fetchMessages();
          return prevMessages;
        }
        return prevMessages.map((msg) => {
          if (msg.id === enquiryId) {
            if (msg.replies?.some((r: any) => r.id === reply.id)) return msg;
            return {
              ...msg,
              replies: [...(msg.replies || []), reply]
            };
          }
          return msg;
        });
      });
    };

    const handleNewNotification = (e: Event) => {
      const customEvent = e as CustomEvent;
      const notif = customEvent.detail;
      if (notif.type === 'MESSAGE' && notif.link.includes('/direct-messages')) {
        fetchMessages();
      }
    };

    const handleChatRead = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { threadId } = customEvent.detail;
      setMessages(prev => prev.map(msg => {
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

  const fetchMessages = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const data = await contactApi.getUserMessages();
      const directMessages = data.filter((msg) => msg.type === 'DIRECT_MESSAGE');
      
      // Sort by latest update (either latest reply or creation date)
      directMessages.sort((a, b) => {
        const aLast = a.replies?.length ? new Date(a.replies[a.replies.length - 1].createdAt).getTime() : new Date(a.createdAt).getTime();
        const bLast = b.replies?.length ? new Date(b.replies[b.replies.length - 1].createdAt).getTime() : new Date(b.createdAt).getTime();
        return bLast - aLast;
      });
      
      setMessages(directMessages);
      
      if (directMessages.length > 0 && !activeMessageId) {
        // optionally set the first message active, but we might want them to see list first on mobile.
        // setActiveMessageId(directMessages[0].id);
      }
    } catch (error: any) {
      console.error('Error fetching direct messages:', error);
      toast.error('Failed to load your messages');
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const handleSendReply = async (messageId: string) => {
    if (!replyText.trim()) return;

    setIsSendingReply(true);
    try {
      await contactApi.sendReply(messageId, replyText.trim());
      setReplyText('');
      // Optimistic update could happen here, but we can also fetch all or wait for WS
      // For instant feedback without waiting for WS/Fetch:
      await fetchMessages(true);
    } catch (error: any) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    } finally {
      setIsSendingReply(false);
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeMessage = messages.find(m => m.id === activeMessageId);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      {/* Header section */}
      <section className="bg-rh-dark pt-24 pb-12 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.pexels.com/photos/7682340/pexels-photo-7682340.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-rh-red/10 -skew-x-12 translate-x-1/2 hidden lg:block" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex items-center justify-between">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <Link to="/manage-profile" className="inline-flex items-center text-rh-red font-bold text-sm hover:text-white transition-colors mb-3 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Profile
            </Link>
            <h1 className="text-3xl sm:text-4xl font-light text-white leading-tight tracking-tight">
              All <span className="text-rh-red font-medium">Chats</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Chat App Layout */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 flex overflow-hidden h-[calc(100vh-200px)] lg:h-[calc(100vh-280px)] min-h-[500px]">
          
          {/* Sidebar */}
          <div className={`w-full md:w-[320px] lg:w-[380px] border-r border-gray-100 flex flex-col shrink-0 transition-transform ${activeMessageId ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rh-red/20 focus:border-rh-red transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <div className="w-8 h-8 border-4 border-rh-teal/30 border-t-rh-teal rounded-full animate-spin mb-4" />
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-400">
                  <MessagesSquare className="w-10 h-10 mb-3 opacity-50" />
                  <p className="text-sm font-medium">No messages found</p>
                </div>
              ) : (
                <div className="p-3 space-y-1">
                  {filteredMessages.map((msg) => {
                    const isActive = msg.id === activeMessageId;
                    const lastReply = msg.replies && msg.replies.length > 0 ? msg.replies[msg.replies.length - 1] : null;
                    const previewText = lastReply ? lastReply.message : msg.message;
                    
                    return (
                      <button
                        key={msg.id}
                        onClick={() => setActiveMessageId(msg.id)}
                        className={`w-full text-left p-4 rounded-2xl transition-all ${isActive ? 'bg-rh-red/5 ring-1 ring-rh-red/20' : 'hover:bg-gray-50'}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`font-bold text-sm truncate pr-2 max-w-[75%] ${isActive ? 'text-rh-red' : 'text-gray-900'}`}>
                            {msg.subject ? msg.subject.replace(/Direct Message/gi, 'Chat') : 'Chat'}
                          </h4>
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-gray-400 whitespace-nowrap font-medium mb-1">
                              {new Date(lastReply ? lastReply.createdAt : msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                            {msg.replies?.filter(r => {
                              const isAdmin = r.senderRole === 'ADMIN' || (r as any).sender_role === 'ADMIN' || r.sender?.role === 'ADMIN' || r.senderRole === 'admin';
                              return isAdmin && !r.isRead;
                            }).length > 0 && (
                              <span className="bg-rh-teal text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                {msg.replies.filter(r => {
                                  const isAdmin = r.senderRole === 'ADMIN' || (r as any).sender_role === 'ADMIN' || r.sender?.role === 'ADMIN' || r.senderRole === 'admin';
                                  return isAdmin && !r.isRead;
                                }).length}
                              </span>
                            )}
                          </div>
                        </div>
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
          <div className={`flex-1 flex flex-col bg-gray-50/50 relative overflow-hidden ${!activeMessageId ? 'hidden md:flex' : 'flex'}`}>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-rh-red bg-transparent relative z-10">
                <div className="w-12 h-12 border-4 border-rh-red/20 border-t-rh-red rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Loading conversation...</p>
              </div>
            ) : !activeMessage ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-transparent relative z-10">
                <div className="w-24 h-24 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mb-6">
                  <MessagesSquare className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Your Messages</h3>
                <p className="text-sm">Select a conversation from the left to start chatting.</p>
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
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-rh-dark text-white flex items-center justify-center text-xs font-bold shrink-0">O</div>
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 text-sm max-w-[140px] sm:max-w-[200px] md:max-w-xs truncate">{activeMessage.subject ? activeMessage.subject.replace(/Direct Message/gi, 'Chat') : 'Chat'}</h3>
                            <span className="px-2 py-0.5 bg-rh-red/10 text-rh-red text-[9px] font-bold uppercase tracking-wider rounded-full shrink-0">Support</span>
                          </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Started {new Date(activeMessage.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full relative z-10">

                  {/* Replies List */}
                  {activeMessage.replies?.map((reply, idx) => {
                    const isAdmin = reply.senderRole?.toUpperCase() === 'ADMIN' || (reply as any).sender_role?.toUpperCase() === 'ADMIN' || reply.sender?.role?.toUpperCase() === 'ADMIN';
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
                          : 'bg-gradient-to-br from-rh-red to-[#ff7a33] text-white'
                          }`}>
                          {senderName.charAt(0)}
                        </div>

                        <div className="max-w-[calc(100%-2.5rem)]">
                          <div className={`flex items-center gap-2 mb-1 text-[10px] font-bold ${isAdmin ? 'justify-start text-gray-500' : 'justify-end text-rh-red/80'}`}>
                            <span>{senderName}</span>
                            <span className="text-gray-300 font-light">•</span>
                            <span>
                              {new Date(reply.createdAt).toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className={`p-3.5 sm:p-4 text-sm leading-relaxed whitespace-pre-wrap shadow-sm text-left w-fit break-words ${isAdmin
                            ? 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'
                            : 'bg-gradient-to-br from-rh-red to-[#ff7a33] text-white rounded-2xl rounded-tr-sm shadow-rh-red/10'
                            }`}>
                            {reply.message}
                          </div>
                          {!isAdmin && (
                            <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-gray-400 font-medium pr-1">
                              {reply.isRead ? 'Read' : 'Sent'}
                              {reply.isRead ? (
                                <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
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
                        <div className="p-4 bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1 h-[40px]">
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
                <div className="p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 shrink-0 relative z-10">
                  <div className="flex items-end gap-3 max-w-4xl mx-auto relative">
                    <textarea
                      ref={textareaRef}
                      value={replyText}
                      onChange={(e) => {
                        setReplyText(e.target.value);
                        const target = e.target;
                        target.style.height = 'auto';
                        target.style.height = Math.min(target.scrollHeight, 150) + 'px';
                        if (!typingTimeoutRef.current) {
                          contactApi.triggerTyping(activeMessage.id, true).catch(() => {});
                        } else {
                          clearTimeout(typingTimeoutRef.current);
                        }
                        typingTimeoutRef.current = setTimeout(() => {
                          contactApi.triggerTyping(activeMessage.id, false).catch(() => {});
                          typingTimeoutRef.current = null;
                        }, 2000);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply(activeMessage.id);
                          setTimeout(() => {
                            if (e.target instanceof HTMLTextAreaElement) {
                              e.target.style.height = 'auto';
                            }
                          }, 0);
                        }
                      }}
                      placeholder="Type a message..."
                      rows={1}
                      style={{ minHeight: '52px', maxHeight: '150px' }}
                      className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-2xl focus:bg-white focus:ring-2 focus:ring-rh-red/20 focus:border-rh-red outline-none text-sm font-medium transition-colors resize-none overflow-y-auto [&::-webkit-scrollbar]:w-[4px]"
                    />
                    <button
                      disabled={isSendingReply || !replyText.trim()}
                      onClick={(e) => {
                        handleSendReply(activeMessage.id);
                        const textarea = e.currentTarget.parentElement?.querySelector('textarea');
                        if (textarea) textarea.style.height = 'auto';
                      }}
                      className="h-[52px] w-[52px] rounded-2xl bg-gradient-to-r from-rh-red to-[#ff7a33] text-white flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-rh-red/20 disabled:opacity-50 disabled:shadow-none transition-all shrink-0"
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
              </>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};

export default DirectMessages;
