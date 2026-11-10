import React from 'react';
import {
  LayoutDashboard,
  Trophy,
  CreditCard,
  Users,
  Sliders
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

interface AdminBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const AdminBottomNav: React.FC<AdminBottomNavProps> = ({ activeTab, onSelectTab }) => {
  const { payments } = useAdminData();
  const pendingCount = payments.filter((p) => p.status === 'PENDING').length;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      badge: pendingCount > 0 ? pendingCount : null
    },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Sliders }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0f14]/95 backdrop-blur-lg border-t border-red-500/20 px-2 py-1.5 pb-safe transition-all shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-red-500 font-semibold scale-105'
                  : 'text-zinc-400 hover:text-zinc-200 active:scale-95'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-0.5 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]" />
              )}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'stroke-[2.5px] drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'stroke-[1.8px]'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-[15px] h-[15px] bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-wide ${isActive ? 'text-red-400 font-bold' : 'text-zinc-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
