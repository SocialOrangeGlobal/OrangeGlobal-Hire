import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCheck, ArrowLeft, Search, Zap, Calendar, CheckCircle2,
  Briefcase, Clock, Filter, RefreshCw, Bell, AlertCircle
} from 'lucide-react';
import { useSocket, Notification } from '../contexts/SocketContext';
import { fadeUp } from '../utils/animations';
import { useAppSelector } from '../store';

const typeConfig: Record<
  string,
  { 
    icon: React.ReactNode; 
    iconBg: string; 
    iconColor: string; 
    badgeClass: string;
    label: string;
  }
> = {
  NEW_APPLICATION: {
    icon: <Briefcase className="w-4 h-4" />,
    iconBg: 'bg-blue-50 border border-blue-100',
    iconColor: 'text-blue-600',
    badgeClass: 'bg-blue-50 text-blue-600 border border-blue-100',
    label: 'Application',
  },
  APPLICATION_UPDATE: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    iconBg: 'bg-orange-50 border border-orange-100',
    iconColor: 'text-[#ff5900]',
    badgeClass: 'bg-orange-50 text-[#ff5900] border border-orange-100/50',
    label: 'Status Update',
  },
  SYSTEM_ALERT: {
    icon: <Zap className="w-4 h-4" />,
    iconBg: 'bg-amber-50 border border-amber-100',
    iconColor: 'text-amber-600',
    badgeClass: 'bg-amber-50 text-amber-700 border border-amber-100',
    label: 'Alert',
  },
  MESSAGE: {
    icon: <Calendar className="w-4 h-4" />,
    iconBg: 'bg-purple-50 border border-purple-100',
    iconColor: 'text-purple-600',
    badgeClass: 'bg-purple-50 text-purple-600 border border-purple-100',
    label: 'Message',
  },
};

function getRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { notifications, unreadCount, isConnected, markAsRead, markAllAsRead } = useSocket();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read' | 'applications' | 'alerts'>('all');
  const [markingAll, setMarkingAll] = useState(false);

  const cfg = (type: string) => typeConfig[type] ?? typeConfig.SYSTEM_ALERT;

  const handleItemClick = async (n: Notification) => {
    if (!n.isRead) {
      await markAsRead(n.id);
    }
    if (n.link) {
      navigate(n.link);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await markAllAsRead();
    } catch (e) {
      console.error(e);
    } finally {
      setMarkingAll(false);
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      switch (activeTab) {
        case 'unread':
          return !n.isRead;
        case 'read':
          return n.isRead;
        case 'applications':
          return n.type === 'NEW_APPLICATION' || n.type === 'APPLICATION_UPDATE';
        case 'alerts':
          return n.type === 'SYSTEM_ALERT' || n.type === 'MESSAGE';
        default:
          return true;
      }
    });
  }, [notifications, searchQuery, activeTab]);

  const stats = useMemo(() => {
    const readCount = notifications.length - unreadCount;
    const alertCount = notifications.filter(n => n.type === 'SYSTEM_ALERT' || n.type === 'MESSAGE').length;
    const appCount = notifications.filter(n => n.type === 'NEW_APPLICATION' || n.type === 'APPLICATION_UPDATE').length;
    return { readCount, alertCount, appCount };
  }, [notifications, unreadCount]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-[#ff5900] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#004b4d] mb-2">Sign In Required</h2>
          <p className="text-gray-500 mb-6 text-sm">Please sign in to view your account notification stream.</p>
          <button
            onClick={() => navigate('/signin')}
            className="w-full bg-[#004b4d] hover:bg-[#ff5900] text-white py-3 rounded-xl font-semibold transition-all shadow-sm"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] pt-24 md:pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Navigation back and header layout */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <button
              onClick={() => navigate('/talent-dashboard')}
              className="flex items-center gap-2 text-gray-400 hover:text-[#ff5900] transition-colors mb-3 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#004b4d] tracking-tight leading-tight">
              Notifications <span className="text-[#ff5900] font-[300]">Log</span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm font-medium">
              Manage your real-time application updates and alerts.
            </p>
          </motion.div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-[#ff5900] hover:border-[#ff5900]/20 transition-all shadow-sm text-sm font-bold self-start md:self-auto"
            >
              {markingAll ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#ff5900]" />
              ) : (
                <CheckCheck className="w-4 h-4 text-[#ff5900]" />
              )}
              Mark all read
            </button>
          )}
        </div>

        {/* Dynamic Board grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm space-y-6">
              {/* Connection status indicator */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Sync Status</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Connected
                </span>
              </div>

              {/* Minimalist Search bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search log..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#004b4d] focus:ring-1 focus:ring-[#004b4d] outline-none transition-all placeholder-gray-400"
                />
              </div>

              {/* Compact Sidebar Filters list */}
              <div className="space-y-1">
                {[
                  { id: 'all', label: 'All Activities', count: notifications.length },
                  { id: 'unread', label: 'Unread Log', count: unreadCount },
                  { id: 'read', label: 'Read Archive', count: stats.readCount },
                  { id: 'applications', label: 'Applications', count: stats.appCount },
                  { id: 'alerts', label: 'Alerts & Info', count: stats.alertCount },
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#004b4d] text-white shadow-sm'
                          : 'text-gray-600 hover:bg-[#FAFBFB] hover:text-[#004b4d]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                          isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stream of log items */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden min-h-[500px]">
              {/* Table header meta info */}
              <div className="border-b border-gray-100 px-6 py-4 bg-[#FAFBFB] flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-gray-400" />
                  Showing {filteredNotifications.length} entries
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-bold text-[#ff5900] hover:underline"
                  >
                    Reset filter
                  </button>
                )}
              </div>

              {/* Inner entries feed list */}
              <div className="divide-y divide-gray-100">
                <AnimatePresence initial={false}>
                  {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <Bell className="w-10 h-10 text-gray-300 mb-3 animate-pulse" />
                      <h3 className="text-base font-bold text-[#004b4d] mb-1">No matches found</h3>
                      <p className="text-xs text-gray-400 max-w-xs">
                        Try checking other filters or clear the filter query.
                      </p>
                    </div>
                  ) : (
                    filteredNotifications.map((n) => {
                      const c = cfg(n.type);
                      return (
                        <div
                          key={n.id}
                          onClick={() => handleItemClick(n)}
                          className={`w-full flex gap-5 px-6 sm:px-8 py-5.5 text-left transition-all hover:bg-gray-50/50 cursor-pointer border-l-4 border-transparent ${
                            !n.isRead 
                              ? 'bg-[#004b4d]/[0.015] !border-l-[#ff5900]' 
                              : 'hover:border-l-gray-300'
                          }`}
                        >
                          {/* Circle Avatar Icon wrapper */}
                          <div
                            className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm self-start mt-0.5 ${c.iconBg} ${c.iconColor}`}
                          >
                            {c.icon}
                          </div>

                          {/* Content structure */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1.5">
                              <div>
                                <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-1.5 ${c.badgeClass}`}>
                                  {c.label}
                                </span>
                                <h3
                                  className={`text-sm sm:text-base leading-snug font-sans tracking-tight ${
                                    !n.isRead ? 'font-bold text-[#081B2D]' : 'font-medium text-gray-700'
                                  }`}
                                >
                                  {n.title}
                                </h3>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-start sm:mt-1.5 text-gray-400 font-semibold text-xs">
                                <Clock className="w-3.5 h-3.5 text-gray-300" />
                                <span>{getRelativeTime(n.createdAt)}</span>
                                {!n.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-[#ff5900] shadow-[0_0_8px_rgba(255,89,0,0.5)] animate-pulse" />
                                )}
                              </div>
                            </div>

                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium mb-1">
                              {n.message}
                            </p>

                            {n.link && (
                              <span className="inline-flex items-center gap-1 text-xs text-[#ff5900] font-bold mt-2.5 hover:underline">
                                View details
                                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
