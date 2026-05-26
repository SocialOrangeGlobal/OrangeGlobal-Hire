import { motion } from 'framer-motion'
import { Calendar, User, Zap, X, Bell, Briefcase, CheckCircle2 } from 'lucide-react';

interface NotificationModalProps {
    notifications: any[];
    setShowNotifications: (show: boolean) => void;
    setNotifications: (notifications: any[]) => void;
}

function NotificationModal({ notifications, setShowNotifications, setNotifications }: NotificationModalProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'interview': return <Calendar className="w-6 h-6" />;
            case 'match': return <Zap className="w-6 h-6" />;
            case 'offer': return <CheckCircle2 className="w-6 h-6" />;
            case 'application': return <Briefcase className="w-6 h-6" />;
            default: return <User className="w-6 h-6" />;
        }
    };

    const getIconStyle = (type: string) => {
        switch (type) {
            case 'interview': return 'bg-orange-100 text-orange-600';
            case 'match': return 'bg-rh-red/10 text-rh-red';
            case 'offer': return 'bg-emerald-100 text-emerald-600';
            case 'application': return 'bg-blue-100 text-blue-600';
            default: return 'bg-rh-teal/10 text-rh-teal';
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowNotifications(false)}
                className="fixed inset-0 bg-rh-dark/40 backdrop-blur-sm z-[140] lg:bg-transparent lg:backdrop-blur-none"
            />
            <motion.div
                initial={{
                    opacity: 0,
                    y: window.innerWidth < 1024 ? "100%" : 10,
                    scale: window.innerWidth < 1024 ? 1 : 0.95,
                    x: window.innerWidth < 1024 ? "-50%" : 0
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    x: window.innerWidth < 1024 ? "-50%" : 0
                }}
                exit={{
                    opacity: 0,
                    y: window.innerWidth < 1024 ? "100%" : 10,
                    scale: window.innerWidth < 1024 ? 1 : 0.95,
                    x: window.innerWidth < 1024 ? "-50%" : 0
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed lg:absolute bottom-0 lg:top-full left-1/2 lg:left-auto lg:right-0 lg:mt-4 w-full sm:w-[450px] lg:w-[400px] bg-white rounded-t-[32px] lg:rounded-[32px] shadow-2xl border-t lg:border border-gray-100 z-[150] overflow-hidden flex flex-col h-[70vh] lg:max-h-[500px]"
            >
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-rh-light/30 shrink-0">
                    <h3 className="font-bold text-rh-teal">Notifications</h3>
                    <div className="flex items-center gap-4">
                        {notifications.length > 0 && (
                            <button
                                onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                                className="text-[10px] font-bold text-rh-red uppercase tracking-widest hover:underline"
                            >
                                Mark all read
                            </button>
                        )}
                        <button onClick={() => setShowNotifications(false)} className="lg:hidden p-2 bg-white rounded-full shadow-sm">
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
                <div className="overflow-y-auto custom-scrollbar flex-1">
                    {notifications.length > 0 ? notifications.map(n => (
                        <div key={n.id} className={`p-6 border-b border-gray-50 hover:bg-rh-light/20 transition-colors relative cursor-pointer group ${n.unread ? 'bg-rh-teal/5' : ''}`}>
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getIconStyle(n.type)}`}>
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-rh-teal">{n.title}</h4>
                                            {n.unread && <div className="w-2 h-2 bg-rh-red rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] shrink-0" />}
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-medium shrink-0">{n.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{n.message}</p>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <Bell className="w-12 h-12 text-gray-200 mb-4" />
                            <p className="text-sm font-medium">No notifications yet</p>
                            <p className="text-xs text-gray-300 mt-1">You'll see updates here when they arrive.</p>
                        </div>
                    )}
                </div>
                {notifications.length > 0 && (
                    <button className="w-full py-5 bg-rh-teal text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-rh-red transition-all shrink-0">
                        View All Notifications
                    </button>
                )}
            </motion.div>
        </>
    )
}

export default NotificationModal