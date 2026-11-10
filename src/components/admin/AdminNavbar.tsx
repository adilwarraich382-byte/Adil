import React from 'react';
import {
  ShieldAlert,
  LogOut,
  Download,
  CreditCard,
  Flame,
  Radio,
  Bell
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import { ADMIN_BRAND } from '../../assets/branding';

interface AdminNavbarProps {
  onSelectTab: (tab: string) => void;
  onOpenApkModal: () => void;
  onOpenAnnounceModal: () => void;
  onSwitchToUserApp?: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  onSelectTab,
  onOpenApkModal,
  onOpenAnnounceModal,
  onSwitchToUserApp
}) => {
  const { adminUser, adminProfile, logoutAdmin } = useAdminAuth();
  const { payments } = useAdminData();

  const pendingPaymentsCount = payments.filter((p) => p.status === 'PENDING').length;

  return (
    <header className="sticky top-0 z-30 bg-[#0b0d13]/95 backdrop-blur-md border-b border-red-500/20 px-4 py-2.5 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center space-x-2.5 cursor-pointer active:scale-95 transition-transform"
        >
          <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-red-500/50 shadow-md shadow-red-500/20 bg-black flex items-center justify-center">
            <img
              src={ADMIN_BRAND.logo}
              alt={ADMIN_BRAND.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-wider text-white font-heading">
                ADIL
              </span>
              <span className="font-extrabold text-base tracking-wider text-red-500 font-heading">
                ADMIN
              </span>
              <span className="px-1.5 py-0.2 rounded bg-red-600/30 border border-red-500/40 text-[9px] font-black text-red-400 uppercase">
                CONTROL
              </span>
            </div>
            <p className="text-[9px] text-zinc-400 font-medium tracking-widest uppercase">
              Free Fire Arena Management
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1.5">
          {/* Switch to User App button */}
          {onSwitchToUserApp && (
            <button
              onClick={onSwitchToUserApp}
              title="Switch to User Tournament App"
              className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-extrabold text-[10px] flex items-center space-x-1 hover:bg-amber-500/30 active:scale-95 transition-all shadow-sm shadow-amber-500/10 font-heading"
            >
              <span>🎮 USER APP</span>
            </button>
          )}

          {/* Pending Payments Red Alert Button */}
          {pendingPaymentsCount > 0 && (
            <button
              onClick={() => onSelectTab('payments')}
              title="Pending Payments Alert"
              className="relative px-2 py-1 rounded-lg bg-red-600 text-white font-black text-[10px] flex items-center space-x-1 shadow-md shadow-red-600/40 animate-pulse active:scale-95 transition-all"
            >
              <CreditCard className="w-3 h-3" />
              <span>{pendingPaymentsCount} PENDING</span>
            </button>
          )}

          {/* Broadcast Announcement Button */}
          <button
            onClick={onOpenAnnounceModal}
            title="Broadcast Announcement"
            className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 text-amber-400 hover:text-white flex items-center justify-center active:scale-95 transition-all"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Download Admin APK */}
          <button
            onClick={onOpenApkModal}
            title="Download Admin APK"
            className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/30 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Logout */}
          <button
            onClick={logoutAdmin}
            title="Logout Admin"
            className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-red-400 flex items-center justify-center active:scale-95 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
