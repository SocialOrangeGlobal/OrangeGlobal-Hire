import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, Minus } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Orange, your AI guide. How can I help you build your team or find your next global opportunity today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Don't show on Auth pages
  const isAuthPage = ['#signin', '#signup-employer', '#signup-talent', '#signup-choice', '#forgot-password'].some(path => currentHash.startsWith(path));
  if (isAuthPage) return null;

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('job') || lowerInput.includes('vacancy')) {
      return "You can explore all our global openings on the Jobs page! We have active roles across Tech, Finance, and Legal sectors.";
    }
    if (lowerInput.includes('hire') || lowerInput.includes('talent')) {
      return "Orange Global provides elite staffing solutions. You can post a vacancy on our 'Hire Talent' page or talk to our consultants for executive search.";
    }
    if (lowerInput.includes('consulting')) {
      return "Our consulting team specializes in business transformation and global delivery models. Check the 'Consulting' page for our full framework.";
    }
    if (lowerInput.includes('salary') || lowerInput.includes('report')) {
      return "Our latest Salary Guides and Market Reports are available in the 'Insights' section. Stay ahead of the market curve!";
    }
    return "That's a great question! Orange Global is a leading talent solutions provider. I recommend checking our Services or Insights sections for deep domain knowledge.";
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[calc(100vw-32px)] sm:w-[360px] md:w-[380px] h-[70vh] sm:h-[500px] md:h-[520px] bg-white rounded-[24px] sm:rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-rh-red p-4 sm:p-6 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 relative">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 border-2 border-rh-red rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg leading-none">Orange</h3>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-white/60 font-bold">AI Assistant</span>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <button onClick={() => setIsOpen(false)} className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors">
                  <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 custom-scrollbar bg-[#F8F9FA]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rh-red/5 flex items-center justify-center shrink-0 border border-rh-red/10">
                      <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rh-red" />
                    </div>
                  )}
                  <div className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-[16px] sm:rounded-[20px] text-[13px] sm:text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                    ? 'bg-rh-red text-white rounded-br-none'
                    : 'bg-white text-rh-teal border border-gray-100 rounded-bl-none'
                    }`}>
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rh-red/10 flex items-center justify-center shrink-0 border border-rh-red/5">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rh-red" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rh-red/5 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rh-red" />
                  </div>
                  <div className="bg-white border border-gray-100 p-3 sm:p-4 rounded-[16px] sm:rounded-[20px] rounded-bl-none flex gap-1">
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-rh-red/30 rounded-full animate-bounce" />
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-rh-red/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-rh-red/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 bg-white border-t border-gray-100 shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Orange anything..."
                  className="w-full pl-4 sm:pl-6 pr-12 sm:pr-14 py-3 sm:py-4 bg-[#F4F7FA] border-none rounded-xl sm:rounded-2xl text-[13px] sm:text-sm focus:ring-2 focus:ring-rh-red/20 outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-rh-red text-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-rh-red/20 disabled:opacity-50 disabled:shadow-none transition-all hover:bg-red-700"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </form>
              <div className="mt-2 sm:mt-3 flex items-center justify-center gap-1.5 opacity-40">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rh-red" />
                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-rh-teal">Powered by Orange AI</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rh-red text-white flex items-center justify-center shadow-2xl shadow-rh-red/30 relative group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6 sm:w-7 sm:h-7" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-rh-teal border-2 border-white rounded-full animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-16 sm:right-20 bg-rh-teal text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 pointer-events-none shadow-xl">
            Chat with Orange
            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 border-l-4 border-l-rh-teal border-t-4 border-t-transparent border-b-4 border-b-transparent" />
          </div>
        )}
      </motion.button>
    </div>
  );
}
