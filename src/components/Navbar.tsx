import { Bell, MessageCircle, Shield, User, Flame, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTournament } from '../context/TournamentContext';
import { BRAND } from '../assets/branding';

interface NavbarProps {
  onOpenNotifications: () => void;
  onOpenSupport: () => void;
  onOpenAuth: () => void;
  onOpenDownload: () => void;
  onSelectTab: (tab: string) => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNotifications,
  onOpenSupport,
  onOpenAuth,
  onOpenDownload,
  onSelectTab,
  onOpenAdmin
}) => {
  const { user, profile } = useAuth();
  const { unreadCount, appSettings } = useTournament();

  const handleWhatsAppClick = () => {
    const rawNumber = appSettings.whatsappSupportNumber.replace(/\D/g, '');
    const url = `https://wa.me/${rawNumber}?text=Assalam%20o%20Alaikum%20ADIL%20ESPORTS%20Support,%20I%20need%20help%20with%20Free%20Fire%20Tournament`;
    window.open(url, '_blank');
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0c0e12]/90 backdrop-blur-md border-b border-white/10 px-4 py-2.5 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center space-x-2.5 cursor-pointer active:scale-95 transition-transform"
        >
          <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-amber-500/40 shadow-sm shadow-amber-500/20 bg-black flex items-center justify-center">
            <img
              src={BRAND.logo}
              alt={BRAND.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-extrabold text-lg tracking-wider text-white font-heading">
                ADIL
              </span>
              <span className="font-extrabold text-lg tracking-wider text-amber-500 font-heading">
                ESPORTS
              </span>
              <Flame className="w-4 h-4 text-orange-500 animate-pulse inline" />
            </div>
            <p className="text-[10px] text-zinc-400 font-medium tracking-widest uppercase">
              Free Fire Arena
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1.5">
          {/* Download APK Button */}
          <button
            onClick={onOpenDownload}
            title="Download Android APK"
            className="flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-extrabold hover:bg-emerald-500/30 active:scale-95 transition-all shadow-sm shadow-emerald-500/10"
          >
            <Download className="w-3.5 h-3.5 animate-bounce" />
            <span className="font-heading">APK</span>
          </button>

          {/* Admin Panel Quick Access */}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              title="Admin Portal (Staff Only)"
              className="flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400 text-[11px] font-extrabold hover:bg-red-600/30 active:scale-95 transition-all shadow-sm shadow-red-500/10"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="font-heading">ADMIN</span>
            </button>
          )}

          {/* WhatsApp Support button */}
          <button
            onClick={handleWhatsAppClick}
            title="WhatsApp Support"
            className="w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/25 active:scale-95 transition-all"
          >
            <MessageCircle className="w-4.5 h-4.5" />
          </button>

          {/* Notifications button */}
          <button
            onClick={onOpenNotifications}
            title="Notifications"
            className="relative w-9 h-9 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 flex items-center justify-center hover:bg-zinc-800 active:scale-95 transition-all"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow-md animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User profile / login button */}
          {user ? (
            <button
              onClick={() => onSelectTab('profile')}
              className="flex items-center space-x-1.5 pl-1.5 pr-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold active:scale-95 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold text-[10px] overflow-hidden">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  profile?.fullName?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <span className="max-w-[70px] truncate text-[11px] font-medium text-zinc-200">
                {profile?.ffIgn || profile?.fullName?.split(' ')[0] || 'Gamer'}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs tracking-wide shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center space-x-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>LOGIN</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
