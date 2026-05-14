import { motion } from 'framer-motion'
import { Calendar, User, Zap, X } from 'lucide-react';

interface NotificationModalProps {
    notifications: any[];
    setShowNotifications: (show: boolean) => void;
    setNotifications: (notifications: any[]) => void;
}

function NotificationModal({ notifications, setShowNotifications, setNotifications }: NotificationModalProps) {
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
                    y: window.innerWidth < 1024 ? 100 : 10,
                    scale: window.innerWidth < 1024 ? 1 : 0.95,
                    x: window.innerWidth < 1024 ? '-50%' : 0
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    x: window.innerWidth < 1024 ? '-50%' : 0
                }}
                exit={{
                    opacity: 0,
                    y: window.innerWidth < 1024 ? 100 : 10,
                    scale: window.innerWidth < 1024 ? 1 : 0.95,
                    x: window.innerWidth < 1024 ? '-50%' : 0
                }}
                className="fixed lg:absolute top-[10%] lg:top-full left-1/2 lg:left-auto lg:right-0 mt-4 w-[90%] sm:w-[450px] lg:w-[400px] bg-white rounded-[32px] shadow-2xl border border-gray-100 z-[150] overflow-hidden flex flex-col max-h-[80vh] lg:max-h-[500px]"
            >
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-rh-light/30 shrink-0">
                    <h3 className="font-bold text-rh-teal">Notifications</h3>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                            className="text-[10px] font-bold text-rh-red uppercase tracking-widest hover:underline"
                        >
                            Mark all read
                        </button>
                        <button onClick={() => setShowNotifications(false)} className="lg:hidden p-2 bg-white rounded-full shadow-sm">
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
                <div className="overflow-y-auto custom-scrollbar flex-1">
                    {notifications.map(n => (
                        <div key={n.id} className={`p-6 border-b border-gray-50 hover:bg-rh-light/20 transition-colors relative cursor-pointer group ${n.unread ? 'bg-rh-teal/5' : ''}`}>
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'interview' ? 'bg-orange-100 text-orange-600' :
                                    n.type === 'match' ? 'bg-rh-red/10 text-rh-red' : 'bg-rh-teal/10 text-rh-teal'
                                    }`}>
                                    {n.type === 'interview' ? <Calendar className="w-6 h-6" /> :
                                        n.type === 'match' ? <Zap className="w-6 h-6" /> : <User className="w-6 h-6" />}
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
                    ))}
                </div>
                <button className="w-full py-5 bg-rh-teal text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-rh-red transition-all shrink-0">
                    View All Notifications
                </button>
            </motion.div>
        </>
    )
}

export default NotificationModal