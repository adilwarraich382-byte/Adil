import React, { useState } from 'react';
import {
  X,
  Bell,
  Megaphone,
  Send,
  CheckCircle2,
  Users,
  Flame,
  Radio,
  Trash2
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

interface AdminAnnounceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAnnounceModal: React.FC<AdminAnnounceModalProps> = ({ isOpen, onClose }) => {
  const {
    announcements,
    publishAnnouncement,
    deleteAnnouncement,
    broadcastNotificationToAll,
    sendNotificationToUser,
    users,
    tournaments
  } = useAdminData();

  const [activeTab, setActiveTab] = useState<'announcement' | 'notification'>('announcement');

  // Announcement fields
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annType, setAnnType] = useState<'BANNER' | 'GENERAL' | 'URGENT'>('BANNER');

  // Direct Notification fields
  const [notifTarget, setNotifTarget] = useState<'ALL' | string>('ALL');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    setIsSending(true);
    try {
      await publishAnnouncement(annTitle.trim(), annContent.trim(), annType);
      setSuccessMsg('Announcement published to User App homepage!');
      setAnnTitle('');
      setAnnContent('');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Error publishing announcement:', err);
      alert('Failed to publish announcement.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    setIsSending(true);
    try {
      if (notifTarget === 'ALL') {
        await broadcastNotificationToAll(notifTitle.trim(), notifMessage.trim());
        setSuccessMsg(`Broadcast sent to all ${users.length} active players!`);
      } else {
        await sendNotificationToUser(notifTarget, notifTitle.trim(), notifMessage.trim(), 'SYSTEM');
        setSuccessMsg('Direct notification dispatched to selected user!');
      }
      setNotifTitle('');
      setNotifMessage('');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Error sending notification:', err);
      alert('Failed to send notification.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4">
      <div className="bg-[#101319] border border-white/10 w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl relative text-zinc-200">
        <div className="sticky top-0 bg-[#101319]/95 backdrop-blur-md px-5 py-3.5 border-b border-white/10 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <Megaphone className="w-5 h-5 text-red-500" />
            <h3 className="font-heading font-black text-white text-base">
              BROADCAST COMMAND
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="grid grid-cols-2 p-2 mx-5 mt-4 bg-zinc-900 rounded-xl border border-white/5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('announcement')}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'announcement'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Home Announcements
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notification')}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'notification'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Send Push Alert
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {successMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-center flex items-center justify-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'announcement' ? (
            /* Home Announcement */
            <form onSubmit={handleCreateAnnouncement} className="space-y-3.5">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. 🔥 Grand Sunday Duo Cup Registration Open!"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Announcement Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['BANNER', 'GENERAL', 'URGENT'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAnnType(t)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        annType === t
                          ? 'bg-amber-500 text-black border-amber-400'
                          : 'bg-zinc-900 text-zinc-400 border-white/5'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Message Content *
                </label>
                <textarea
                  rows={3}
                  required
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Enter broadcast message details..."
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-black font-extrabold uppercase tracking-wider text-xs shadow-lg active:scale-95 transition-all"
              >
                {isSending ? 'Publishing...' : 'POST ANNOUNCEMENT TO USER APP'}
              </button>

              {/* Current Active Announcements */}
              <div className="pt-3 border-t border-white/5 space-y-2">
                <h5 className="font-heading font-black text-white text-xs uppercase tracking-wider">
                  ACTIVE BROADCASTS ({announcements.length})
                </h5>
                {announcements.map((a) => (
                  <div
                    key={a.id}
                    className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-start justify-between space-x-2"
                  >
                    <div>
                      <h6 className="font-bold text-white line-clamp-1">{a.title}</h6>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">{a.content}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteAnnouncement(a.id)}
                      className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </form>
          ) : (
            /* Direct Notification Form */
            <form onSubmit={handleSendNotification} className="space-y-3.5">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Target Recipient *</label>
                <select
                  value={notifTarget}
                  onChange={(e) => setNotifTarget(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="ALL">ALL USERS ({users.length} Players)</option>
                  {users.map((u) => (
                    <option key={u.uid} value={u.uid}>
                      Single: {u.fullName} (UID: {u.ffUid || u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Alert Title *</label>
                <input
                  type="text"
                  required
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="e.g. Match Room ID Published"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Alert Message *</label>
                <textarea
                  rows={3}
                  required
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="Enter alert text to show in user notification center..."
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white text-xs"
                />
              </div>

              {/* Quick Template Chips */}
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 block">Quick Notification Templates:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { t: 'Room Published', m: 'Match room ID and password are now unlocked in My Matches!' },
                    { t: 'Time Changed', m: 'Match start time has been updated by 15 minutes. Check schedule!' },
                    { t: 'Prize Dispatched', m: 'Your tournament cash prize was sent via EasyPaisa!' }
                  ].map((chip) => (
                    <button
                      key={chip.t}
                      type="button"
                      onClick={() => {
                        setNotifTitle(chip.t);
                        setNotifMessage(chip.m);
                      }}
                      className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 text-[10px] hover:bg-zinc-700"
                    >
                      {chip.t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-black font-extrabold uppercase tracking-wider text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Sending Alert...' : 'SEND IN-APP NOTIFICATION'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
