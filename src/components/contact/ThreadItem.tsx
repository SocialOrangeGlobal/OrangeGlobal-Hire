import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, MessageSquare, Send, User } from 'lucide-react';

interface ThreadItemProps {
  msg: any;
  isActive: boolean;
  setActiveMessageId: (id: string | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  isSendingReply: boolean;
  handleSendReply: (id: string) => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

export default function ThreadItem({
  msg,
  isActive,
  setActiveMessageId,
  replyText,
  setReplyText,
  isSendingReply,
  handleSendReply,
  chatEndRef,
}: ThreadItemProps) {
  const repliesCount = msg.replies?.length || 0;

  return (
    <div
      className={`bg-white rounded-[24px] border transition-all duration-500 ease-out overflow-hidden ${
        isActive
          ? 'border-rh-red/30 shadow-2xl shadow-rh-red/5 ring-4 ring-rh-red/5'
          : 'border-gray-100 shadow-sm hover:shadow-md hover:border-rh-red/30'
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
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                msg.type === 'CONSULTATION'
                  ? 'bg-rh-red/10 border-rh-red/20 text-rh-red'
                  : msg.type === 'DIRECT_MESSAGE'
                  ? 'bg-purple-50 border-purple-200 text-purple-600'
                  : 'bg-gray-100 border-gray-200 text-gray-600'
              }`}
            >
              {msg.type === 'CONSULTATION' ? 'Consultation' : msg.type === 'DIRECT_MESSAGE' ? 'Chat' : 'General Query'}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                msg.status === 'RESOLVED'
                  ? 'bg-green-50 border-green-200 text-green-600'
                  : msg.status === 'IN_PROGRESS'
                  ? 'bg-amber-50 border-amber-200 text-amber-600'
                  : 'bg-blue-50 border-blue-200 text-blue-600'
              }`}
            >
              {msg.status}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              {new Date(msg.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">{msg.subject}</h3>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            <MessageSquare className="w-4 h-4 text-gray-300" />
            <span>
              {repliesCount} {repliesCount === 1 ? 'reply' : 'replies'}
            </span>
          </div>
          <button
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isActive ? 'bg-rh-red text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-rh-red hover:text-white'
            }`}
          >
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
              {/* Thread Replies */}
              {msg.replies && msg.replies.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                    Conversation History
                  </p>
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                    {msg.replies.map((reply: any) => {
                      const isAdmin =
                        reply.senderRole === 'ADMIN' ||
                        (reply as any).sender_role === 'ADMIN' ||
                        reply.sender?.role === 'ADMIN' ||
                        reply.senderRole === 'admin';
                      const senderName = isAdmin
                        ? `${reply.sender?.adminProfile?.firstName || 'Orange'} ${
                            reply.sender?.adminProfile?.lastName || 'Global'
                          }`
                        : reply.sender?.talentProfile?.fullName || 'You';

                      return (
                        <div
                          key={reply.id}
                          className={`flex gap-3 max-w-[85%] ${
                            isAdmin ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'
                          }`}
                        >
                          {/* Mini avatar */}
                          <div
                            className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold border shadow-sm select-none ${
                              isAdmin
                                ? 'bg-gray-800 text-white border-gray-900/10'
                                : 'bg-gradient-to-br from-rh-red to-[#ff7a33] text-white border-transparent'
                            }`}
                          >
                            {senderName.charAt(0)}
                          </div>

                          <div className="max-w-[calc(100%-2.5rem)]">
                            <div
                              className={`flex items-center gap-2 mb-1 text-[10px] font-bold ${
                                isAdmin ? 'justify-start text-gray-800' : 'justify-end text-rh-red'
                              }`}
                            >
                              <span>{senderName}</span>
                              <span className="text-gray-300 font-light">•</span>
                              <span className="text-gray-400 font-medium">
                                {new Date(reply.createdAt).toLocaleTimeString(undefined, {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <div
                              className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm border text-left whitespace-pre-wrap break-words ${
                                isAdmin
                                  ? 'bg-gray-100 border-gray-200 text-gray-800 rounded-tl-none'
                                  : 'bg-gradient-to-r from-rh-red to-[#ff7a33] text-white border-transparent shadow-md rounded-tr-none'
                              }`}
                            >
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
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Send a reply</p>
                <div className="flex gap-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    rows={1}
                    className="flex-1 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-rh-red/20 focus:border-rh-red outline-none text-sm font-semibold transition-all resize-none shadow-inner h-12 [&::-webkit-scrollbar]:w-[2px]"
                  />
                  <button
                    disabled={isSendingReply || !replyText.trim()}
                    onClick={() => handleSendReply(msg.id)}
                    className="h-12 w-12 rounded-2xl bg-gradient-to-r from-rh-red to-[#ff7a33] text-white flex items-center justify-center hover:shadow-lg hover:shadow-rh-red/30 disabled:opacity-50 disabled:shadow-none transition-all shrink-0"
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
}
