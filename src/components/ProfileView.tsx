import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Gamepad2,
  Calendar,
  Edit3,
  LogOut,
  Shield,
  HelpCircle,
  FileText,
  DollarSign,
  Smartphone,
  ChevronRight,
  MessageCircle,
  X,
  Check,
  AlertCircle,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTournament } from '../context/TournamentContext';
import { BRAND } from '../assets/branding';

interface ProfileViewProps {
  onOpenAuth: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenSupport: () => void;
  onOpenPolicies: (type: 'rules' | 'terms' | 'privacy' | 'refund' | 'apk') => void;
  onOpenDownload?: () => void;
  onOpenAdmin?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenAuth,
  onNavigateTab,
  onOpenSupport,
  onOpenPolicies,
  onOpenDownload,
  onOpenAdmin
}) => {
  const { user, profile, logout, updateUserProfile } = useAuth();
  const { userRegistrations, userPayments, appSettings } = useTournament();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFullName, setEditFullName] = useState(profile?.fullName || '');
  const [editWhatsapp, setEditWhatsapp] = useState(profile?.whatsapp || '');
  const [editFfUid, setEditFfUid] = useState(profile?.ffUid || '');
  const [editFfIgn, setEditFfIgn] = useState(profile?.ffIgn || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user) {
    return (
      <div className="pb-24 px-4 max-w-md mx-auto text-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-amber-500">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-black text-white">
            GAMER PROFILE
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            Log in to manage your Free Fire UID, view payment history, and connect with ADIL ESPORTS support.
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
        >
          LOGIN OR CREATE ACCOUNT
        </button>
      </div>
    );
  }

  const handleOpenEdit = () => {
    setEditFullName(profile?.fullName || '');
    setEditWhatsapp(profile?.whatsapp || '');
    setEditFfUid(profile?.ffUid || '');
    setEditFfIgn(profile?.ffIgn || '');
    setSaveSuccess(false);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateUserProfile({
        fullName: editFullName.trim(),
        whatsapp: editWhatsapp.trim(),
        ffUid: editFfUid.trim(),
        ffIgn: editFfIgn.trim()
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setIsEditModalOpen(false);
      }, 1000);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleWhatsAppClick = () => {
    const rawNumber = appSettings.whatsappSupportNumber.replace(/\D/g, '');
    const url = `https://wa.me/${rawNumber}?text=Assalam%20o%20Alaikum%20ADIL%20ESPORTS%20Support`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-5 pb-28 px-4 max-w-md mx-auto">
      {/* Profile Card */}
      <div className="relative bg-gradient-to-b from-[#181a24] to-[#0f1118] border border-amber-500/30 rounded-3xl p-5 shadow-xl text-center space-y-3 overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-amber-500/10 blur-2xl pointer-events-none" />

        {/* Avatar */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-[#0d0f12] rounded-[14px] overflow-hidden flex items-center justify-center font-heading font-black text-2xl text-amber-400">
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
              ) : (
                profile?.fullName?.charAt(0).toUpperCase() || 'A'
              )}
            </div>
          </div>
          <button
            onClick={handleOpenEdit}
            className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-amber-500 text-black hover:bg-amber-400 shadow-md active:scale-95 transition-all"
            title="Edit Profile"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Name and In Game Title */}
        <div>
          <h2 className="text-xl font-heading font-black text-white tracking-wide">
            {profile?.fullName || 'Free Fire Warrior'}
          </h2>
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold mt-1">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>IGN: {profile?.ffIgn || 'Not Set'}</span>
          </div>
        </div>

        {/* Free Fire UID and WhatsApp details */}
        <div className="grid grid-cols-2 gap-2 text-left pt-2 text-xs">
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Free Fire UID</span>
            <span className="font-mono text-white font-bold">{profile?.ffUid || 'Click Edit'}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold block">WhatsApp</span>
            <span className="font-mono text-white font-bold truncate block">{profile?.whatsapp || 'Click Edit'}</span>
          </div>
        </div>

        <div className="text-[11px] text-zinc-400 pt-1">
          Registered: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Active Member'}
        </div>
      </div>

      {/* History Counters */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigateTab('my-matches')}
          className="bg-zinc-900/90 border border-white/10 rounded-2xl p-3 text-left hover:border-amber-500/30 transition-all active:scale-95"
        >
          <span className="text-[10px] text-zinc-400 uppercase font-bold block">Tournament History</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-heading font-black text-white">
              {userRegistrations.length} Matches
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('my-matches')}
          className="bg-zinc-900/90 border border-white/10 rounded-2xl p-3 text-left hover:border-amber-500/30 transition-all active:scale-95"
        >
          <span className="text-[10px] text-zinc-400 uppercase font-bold block">Payment History</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-heading font-black text-emerald-400">
              {userPayments.length} TRX
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </div>
        </button>
      </div>

      {/* Android Mobile APK & Install Banner */}
      <div
        onClick={() => (onOpenDownload ? onOpenDownload() : onOpenPolicies('apk'))}
        className="cursor-pointer bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between hover:border-emerald-500/50 transition-all active:scale-95"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="text-xs text-left">
            <h4 className="font-heading font-bold text-white text-sm">
              Download Android APK
            </h4>
            <p className="text-[11px] text-zinc-400">Download APK v1.0 or Install to Home Screen</p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-extrabold text-[11px] uppercase tracking-wider flex items-center space-x-1 shadow-md">
          <Download className="w-3.5 h-3.5" />
          <span>DOWNLOAD</span>
        </div>
      </div>

      {/* Support & Policies Menu */}
      <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-2 space-y-1">
        <button
          onClick={handleWhatsAppClick}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800 transition-colors text-xs text-left"
        >
          <div className="flex items-center space-x-3 text-zinc-200">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">WhatsApp Customer Support ({appSettings.whatsappSupportNumber})</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>

        <button
          onClick={onOpenSupport}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800 transition-colors text-xs text-left"
        >
          <div className="flex items-center space-x-3 text-zinc-200">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="font-medium">FAQs & Payment Instructions</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>

        <button
          onClick={() => onOpenPolicies('rules')}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800 transition-colors text-xs text-left"
        >
          <div className="flex items-center space-x-3 text-zinc-200">
            <Shield className="w-4 h-4 text-red-400" />
            <span className="font-medium">Official Tournament Rules</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>

        <button
          onClick={() => onOpenPolicies('refund')}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800 transition-colors text-xs text-left"
        >
          <div className="flex items-center space-x-3 text-zinc-200">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">Refund Policy</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>

        <button
          onClick={() => onOpenPolicies('terms')}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800 transition-colors text-xs text-left"
        >
          <div className="flex items-center space-x-3 text-zinc-200">
            <FileText className="w-4 h-4 text-zinc-400" />
            <span className="font-medium">Terms & Conditions & Privacy</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>

        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-red-950/20 border border-red-500/30 hover:bg-red-950/40 transition-colors text-xs text-left text-red-300"
          >
            <div className="flex items-center space-x-3">
              <Shield className="w-4 h-4 text-red-500" />
              <div>
                <span className="font-bold text-red-200 block">Adil Esports Admin Portal</span>
                <span className="text-[10px] text-zinc-400">Manage Tournaments, Verify Payments & Rooms</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </button>
        )}
      </div>

      {/* Logout button */}
      <button
        onClick={logout}
        className="w-full py-3 rounded-xl bg-zinc-900 border border-red-500/30 text-red-400 font-heading font-extrabold text-xs uppercase tracking-wider hover:bg-red-950/20 active:scale-95 transition-all flex items-center justify-center space-x-2"
      >
        <LogOut className="w-4 h-4" />
        <span>LOGOUT FROM ACCOUNT</span>
      </button>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#12151c] border border-white/10 w-full max-w-sm rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-white text-base">
                EDIT GAMER PROFILE
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  required
                  value={editWhatsapp}
                  onChange={(e) => setEditWhatsapp(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Free Fire UID</label>
                <input
                  type="text"
                  required
                  value={editFfUid}
                  onChange={(e) => setEditFfUid(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Free Fire IGN (In-Game Name)</label>
                <input
                  type="text"
                  required
                  value={editFfIgn}
                  onChange={(e) => setEditFfIgn(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              {saveSuccess && (
                <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-center text-xs">
                  Profile updated successfully!
                </div>
              )}

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold uppercase tracking-wider text-xs active:scale-95 transition-all shadow-md"
              >
                {isUpdating ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
