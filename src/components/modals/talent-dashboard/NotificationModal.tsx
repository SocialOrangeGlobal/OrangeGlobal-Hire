import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCheck, Briefcase, Zap, Calendar, CheckCircle2 } from 'lucide-react';
import { useSocket, Notification } from '../../../contexts/SocketContext';

// ── Type → visual config ─────────────────────────────────────────────────────
const typeConfig: Record<
  string,
  { icon: React.ReactNode; bg: string; ring: string }
> = {
  NEW_APPLICATION: {
    icon: <Briefcase className="w-4 h-4" />,
    bg: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    ring: 'ring-blue-100 dark:ring-blue-900/30',
  },
  APPLICATION_UPDATE: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    bg: 'bg-orange-50 text-rh-red dark:bg-orange-950/20 dark:text-rh-red',
    ring: 'ring-orange-100 dark:ring-orange-900/30',
  },
  SYSTEM_ALERT: {
    icon: <Zap className="w-4 h-4" />,
    bg: 'bg-teal-50 text-rh-teal dark:bg-teal-950/20 dark:text-rh-teal',
    ring: 'ring-teal-100 dark:ring-teal-900/30',
  },
  MESSAGE: {
    icon: <Calendar className="w-4 h-4" />,
    bg: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    ring: 'ring-purple-100 dark:ring-purple-900/30',
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

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useSocket();

  // Close dropdown on clicking outside panel AND outside of the Bell button
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const panel = document.querySelector('.notifications-panel');
      const bellBtn = document.querySelector('.notification-bell-btn');
      if (
        panel &&
        !panel.contains(event.target as Node) &&
        bellBtn &&
        !bellBtn.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const cfg = (type: string) => typeConfig[type] ?? typeConfig.SYSTEM_ALERT;

  const handleItemClick = async (n: Notification) => {
    if (!n.isRead) await markAsRead(n.id);
    if (n.link && n.link !== '/talent-dashboard') {
      window.location.href = n.link;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ type: 'spring', damping: 24, stiffness: 360 }}
          className="notifications-panel absolute right-0 mt-3 w-[335px] sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col max-h-[520px] origin-top-right"
        >
          {/* ── Header ────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0 bg-gradient-to-r from-rh-teal/5 to-transparent">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rh-teal/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-rh-teal" />
              </div>
              <div>
                <h3 className="font-bold text-rh-teal text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-[10px] text-gray-400 -mt-0.5">
                    {unreadCount} unread
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="flex items-center gap-1 text-[10px] font-bold text-rh-red uppercase tracking-wider hover:underline"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Notification list ──────────────────────────────────────── */}
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center text-gray-400">
                <div className="w-14 h-14 rounded-2xl bg-rh-light flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-500 mb-1">
                  No notifications yet
                </p>
                <p className="text-xs text-gray-400">
                  We'll notify you when something important happens
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((n) => {
                  const c = cfg(n.type);
                  return (
                    <button
                      key={n.id}
                      onClick={() => handleItemClick(n)}
                      className={`w-full flex gap-3.5 px-5 py-3.5 text-left transition-all hover:bg-gray-50 group ${
                        !n.isRead
                          ? 'bg-gradient-to-r from-rh-teal/[0.03] to-transparent'
                          : ''
                      }`}
                    >
                      {/* Icon */}
                      <span
                        className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5 ${c.bg} ring-1 ${c.ring}`}
                      >
                        {c.icon}
                      </span>

                      {/* Content */}
                      <span className="flex-1 min-w-0">
                        <span className="flex items-start justify-between gap-1 mb-0.5">
                          <span
                            className={`text-sm leading-snug ${
                              !n.isRead
                                ? 'font-bold text-rh-teal'
                                : 'font-medium text-gray-700'
                            }`}
                          >
                            {n.title}
                          </span>
                          {!n.isRead && (
                            <span className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-rh-red shadow-sm" />
                          )}
                        </span>
                        <span className="block text-xs text-gray-500 mb-1 line-clamp-2 leading-relaxed">
                          {n.message}
                        </span>
                        <span className="block text-[10px] font-medium text-gray-400">
                          {getRelativeTime(n.createdAt)}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Footer ────────────────────────────────────────────────── */}
          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 shrink-0 bg-gray-50/50">
              <p className="text-[10px] text-center text-gray-400">
                Showing latest {notifications.length} notifications
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}