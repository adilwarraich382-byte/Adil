import React from 'react';
import { Home, Trophy, Swords, Crown, User } from 'lucide-react';
import { useTournament } from '../context/TournamentContext';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const { userRegistrations } = useTournament();

  const pendingOrApprovedMatchesCount = userRegistrations.filter(
    (r) => r.status === 'PENDING' || r.status === 'APPROVED'
  ).length;

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    {
      id: 'my-matches',
      label: 'My Matches',
      icon: Swords,
      badge: pendingOrApprovedMatchesCount > 0 ? pendingOrApprovedMatchesCount : null
    },
    { id: 'winners', label: 'Winners', icon: Crown },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0f14]/95 backdrop-blur-lg border-t border-white/10 px-2 py-1.5 pb-safe transition-all shadow-2xl">
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
                  ? 'text-amber-400 font-semibold scale-105'
                  : 'text-zinc-400 hover:text-zinc-200 active:scale-95'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-0.5 bg-amber-500 rounded-full shadow-[0_0_8px_#f59e0b]" />
              )}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'stroke-[2.5px] drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'stroke-[1.8px]'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-[15px] h-[15px] bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-wide ${isActive ? 'text-amber-400' : 'text-zinc-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
