import React from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Unlock,
  Trash2,
  Info
} from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const { notifications, markNotificationRead, clearAllNotifications } = useTournament();

  if (!isOpen) return null;

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'PAYMENT_APPROVED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'PAYMENT_REJECTED':
        return <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />;
      case 'ROOM_PUBLISHED':
        return <Unlock className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'PAYMENT_SUBMITTED':
        return <Clock className="w-4 h-4 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-[#101319] border border-white/10 w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl relative text-zinc-200">
        {/* Header */}
        <div className="sticky top-0 bg-[#101319]/95 backdrop-blur-md px-5 py-3.5 border-b border-white/10 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <Bell className="w-4.5 h-4.5 text-amber-500" />
            <h3 className="font-heading font-black text-white text-base tracking-wide">
              NOTIFICATIONS
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded bg-zinc-800"
              >
                Mark All Read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs space-y-2">
              <Bell className="w-8 h-8 mx-auto text-zinc-600" />
              <p>No notifications yet. You'll be alerted when your payment is verified or room details are ready.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (!n.read) markNotificationRead(n.id);
                  if (n.type === 'ROOM_PUBLISHED' || n.type === 'PAYMENT_APPROVED') {
                    onClose();
                    onNavigateTab('my-matches');
                  }
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-zinc-900/40 border-white/5 opacity-80'
                    : 'bg-zinc-900 border-amber-500/30 shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">{getNotifIcon(n.type)}</div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white line-clamp-1">{n.title}</h4>
                      <span className="text-[10px] text-zinc-500 shrink-0 ml-2">
                        {new Date(n.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-zinc-300 mt-1 leading-relaxed text-[11px]">{n.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
