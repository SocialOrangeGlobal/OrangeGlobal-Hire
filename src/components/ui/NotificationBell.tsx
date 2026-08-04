import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useSocket } from '../../contexts/SocketContext';
import { useNavigate } from 'react-router-dom';

const typeConfig: Record<string, { icon: string; bg: string; text: string }> = {
  NEW_APPLICATION: { icon: "📋", bg: "bg-blue-100", text: "text-blue-600" },
  APPLICATION_UPDATE: { icon: "🔄", bg: "bg-orange-100", text: "text-orange-600" },
  SYSTEM_ALERT: { icon: "🔔", bg: "bg-purple-100", text: "text-purple-600" },
  MESSAGE: { icon: "💬", bg: "bg-green-100", text: "text-green-600" },
};

function getRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationBell({ isDarkText = false }: { isDarkText?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useSocket();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (id: string, link?: string) => {
    await markAsRead(id);
    setIsOpen(false);
    if (link) {
      navigate(link);
    }
  };

  const cfg = (type: string) => typeConfig[type] ?? typeConfig.SYSTEM_ALERT;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative transition-colors flex items-center justify-center p-2 rounded-full hover:bg-black/5 ${
          isDarkText ? 'text-rh-teal hover:text-rh-red' : 'text-white hover:text-rh-red'
        } ${isOpen ? 'bg-black/5' : ''}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rh-red border-2 border-white rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed top-[80px] left-4 right-4 sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-3 sm:w-[400px] bg-white/95 backdrop-blur-xl rounded-[1.75rem] shadow-[0_1.875rem_4.375rem_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-[70] transform sm:origin-top-right transition-all max-h-[calc(100vh-100px)] sm:max-h-[520px] flex flex-col">
          
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
            <h3 className="font-bold text-rh-teal text-base">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-bold text-rh-red hover:text-red-700 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <ul className="overflow-y-auto flex-1 divide-y divide-gray-50 mb-14">
            {notifications.length === 0 ? (
              <li className="flex flex-col items-center justify-center py-14 text-gray-400">
                <Bell className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm font-medium">No notifications yet</p>
              </li>
            ) : (
              notifications.map((notification) => {
                const config = cfg(notification.type);
                return (
                  <li key={notification.id}>
                    <button
                      onClick={() => handleNotificationClick(notification.id, notification.link)}
                      className={`flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-gray-50 ${
                        !notification.isRead ? "bg-orange-50/30" : ""
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center shrink-0 w-10 h-10 rounded-full ${config.bg} ${config.text} text-lg`}
                      >
                        {config.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p
                            className={`text-sm truncate ${
                              !notification.isRead
                                ? "font-bold text-gray-900"
                                : "font-medium text-gray-700"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">
                            {getRelativeTime(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
          
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100 shrink-0">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/notifications');
              }}
              className="w-full py-2 text-sm font-bold text-rh-red bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
