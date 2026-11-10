import React, { useState } from 'react';
import {
  Flame,
  Trophy,
  Users,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Zap,
  Radio,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Download,
  ArrowDownToLine
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTournament } from '../context/TournamentContext';
import { Tournament, TournamentMode } from '../types';
import { BRAND } from '../assets/branding';

interface HomeViewProps {
  onSelectTournament: (tournament: Tournament) => void;
  onJoinTournament: (tournament: Tournament) => void;
  onNavigateTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenDownload?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTournament,
  onJoinTournament,
  onNavigateTab,
  onOpenAuth,
  onOpenDownload
}) => {
  const { user, profile } = useAuth();
  const { tournaments, announcements, userRegistrations, appSettings } = useTournament();

  const [modeFilter, setModeFilter] = useState<'ALL' | TournamentMode>('ALL');

  // Filter tournaments
  const filteredTournaments = tournaments.filter((t) => {
    if (modeFilter === 'ALL') return true;
    return t.mode === modeFilter;
  });

  const featuredTournament = tournaments.find((t) => t.status === 'REGISTRATION_OPEN') || tournaments[0];
  const liveMatches = tournaments.filter((t) => t.status === 'LIVE');
  const upcomingMatches = tournaments.filter((t) => t.status === 'UPCOMING' || t.status === 'REGISTRATION_OPEN');

  // Total prize pool dynamically calculated from Firestore
  const totalPrizePool = tournaments.reduce((acc, curr) => acc + (curr.prizePool || 0), 0);

  const isUserRegistered = (tournamentId: string) => {
    return userRegistrations.some((r) => r.tournamentId === tournamentId);
  };

  return (
    <div className="space-y-6 pb-24 px-4 max-w-md mx-auto">
      {/* Announcements Ticker / Banner */}
      {announcements.length > 0 && (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-950/60 via-amber-950/40 to-black border border-amber-500/30 p-3 shadow-md">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
            <span>Official Announcement</span>
          </div>
          <p className="text-xs text-zinc-200 line-clamp-2 leading-relaxed">
            {announcements[0].content}
          </p>
        </div>
      )}

      {/* Welcome & Profile Quick Bar */}
      <div className="bg-gradient-to-r from-zinc-900 via-[#14171f] to-zinc-900 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 shadow-md shadow-amber-500/20">
            <div className="w-full h-full bg-[#0d0f12] rounded-[10px] overflow-hidden flex items-center justify-center font-bold text-amber-400 text-lg">
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
              ) : (
                profile?.fullName?.charAt(0).toUpperCase() || 'G'
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-zinc-400">Welcome,</span>
              <span className="text-xs font-bold text-white">
                {profile?.ffIgn || profile?.fullName || 'Gamer'}
              </span>
            </div>
            {profile?.ffUid ? (
              <p className="text-[11px] font-mono text-amber-400 font-semibold tracking-wide">
                UID: {profile.ffUid}
              </p>
            ) : (
              <p className="text-[10px] text-zinc-500">Free Fire Battle Royale</p>
            )}
          </div>
        </div>

        {user ? (
          <button
            onClick={() => onNavigateTab('my-matches')}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold active:scale-95 transition-all flex items-center space-x-1"
          >
            <span>My Matches</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black text-xs font-extrabold shadow-md active:scale-95 transition-all"
          >
            JOIN NOW
          </button>
        )}
      </div>

      {/* Download Android APK Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#121c17] via-[#0d1411] to-[#121a1f] border border-emerald-500/40 p-4 shadow-lg shadow-emerald-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
              <Smartphone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-500 text-black">
                  ANDROID APK
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">v1.0.0</span>
              </div>
              <h4 className="font-heading font-black text-sm text-white tracking-wide mt-0.5">
                ADIL ESPORTS Official App
              </h4>
              <p className="text-[11px] text-zinc-400">
                Install on Android for instant Match Room alerts & EasyPaisa tracking
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 flex items-center space-x-2">
          <button
            onClick={onOpenDownload}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>DOWNLOAD APK (24.8 MB)</span>
          </button>
          <button
            onClick={onOpenDownload}
            className="py-2.5 px-3 rounded-xl bg-zinc-900 border border-white/15 text-zinc-300 hover:text-white text-xs font-bold active:scale-95 transition-all text-center"
          >
            Install Guide
          </button>
        </div>
      </div>

      {/* Metrics Row: Prize Pool, Live Count, EasyPaisa Guarantee */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-zinc-900/90 border border-white/5 rounded-2xl p-3 text-center">
          <span className="text-[9px] uppercase font-bold text-zinc-400 block tracking-wider">
            Total Prize Pool
          </span>
          <span className="font-heading font-black text-base text-amber-400 tracking-wide mt-0.5 block">
            {totalPrizePool.toLocaleString()} PKR
          </span>
        </div>

        <div className="bg-zinc-900/90 border border-white/5 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center space-x-1 text-[9px] uppercase font-bold text-red-400 tracking-wider">
            <Radio className="w-2.5 h-2.5 animate-pulse" />
            <span>Live Matches</span>
          </div>
          <span className="font-heading font-black text-base text-white tracking-wide mt-0.5 block">
            {liveMatches.length} Ongoing
          </span>
        </div>

        <div className="bg-zinc-900/90 border border-white/5 rounded-2xl p-3 text-center">
          <span className="text-[9px] uppercase font-bold text-emerald-400 block tracking-wider">
            Verified Payments
          </span>
          <span className="font-heading font-black text-base text-zinc-200 tracking-wide mt-0.5 block">
            EasyPaisa
          </span>
        </div>
      </div>

      {/* Featured Tournament Banner */}
      {featuredTournament && (
        <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-xl shadow-amber-950/30 group">
          <div className="relative h-48 w-full">
            <img
              src={featuredTournament.bannerUrl || BRAND.banner}
              alt={featuredTournament.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1014] via-[#0e1014]/60 to-transparent" />
          </div>

          <div className="absolute top-3 left-3 flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold tracking-wider uppercase flex items-center space-x-1 shadow-md">
              <Flame className="w-3 h-3 animate-bounce" />
              <span>FEATURED TOURNAMENT</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-amber-400 text-[10px] font-bold">
              {featuredTournament.mode}
            </span>
          </div>

          <div className="absolute bottom-3 left-4 right-4 space-y-2">
            <h3 className="font-heading font-black text-lg text-white tracking-wide line-clamp-1 drop-shadow-md">
              {featuredTournament.title}
            </h3>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3 text-zinc-300">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-red-500" />
                  <span>{featuredTournament.map}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-amber-500" />
                  <span>{featuredTournament.matchTime}</span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-zinc-400 block uppercase">Prize Pool</span>
                <span className="font-heading font-black text-amber-400 text-base">
                  {featuredTournament.prizePool} PKR
                </span>
              </div>
            </div>

            <div className="pt-1 flex items-center space-x-2">
              <button
                onClick={() => onSelectTournament(featuredTournament)}
                className="flex-1 py-2 px-3 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all border border-white/10 text-center"
              >
                VIEW RULES & DETAILS
              </button>
              <button
                onClick={() => onJoinTournament(featuredTournament)}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black text-xs font-black uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-1"
              >
                <span>JOIN FOR {featuredTournament.entryFee} PKR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode Filters (SOLO, DUO, SQUAD) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="font-heading font-extrabold text-base tracking-wide text-white">
              SELECT GAME MODE
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('tournaments')}
            className="text-xs text-amber-400 font-bold hover:underline"
          >
            See All ({tournaments.length})
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {(['ALL', 'SOLO', 'DUO', 'SQUAD'] as const).map((mode) => {
            const active = modeFilter === mode;
            return (
              <button
                key={mode}
                onClick={() => setModeFilter(mode)}
                className={`py-2 rounded-xl text-xs font-heading font-bold tracking-wider transition-all border ${
                  active
                    ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20 scale-[1.02]'
                    : 'bg-zinc-900 text-zinc-400 border-white/5 hover:text-white'
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tournament Cards List */}
      <div className="space-y-3">
        {filteredTournaments.length === 0 ? (
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 text-center text-zinc-500 text-xs">
            No tournaments currently available for {modeFilter} mode.
          </div>
        ) : (
          filteredTournaments.slice(0, 4).map((t) => {
            const registered = isUserRegistered(t.id);
            const isFull = t.filledSlots >= t.totalSlots;
            const isOpen = t.status === 'REGISTRATION_OPEN';

            return (
              <div
                key={t.id}
                className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 space-y-3 hover:border-amber-500/30 transition-all shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-extrabold uppercase">
                        {t.mode}
                      </span>
                      <span className="text-[11px] text-zinc-400 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        <span>{t.map}</span>
                      </span>
                    </div>
                    <h4 className="font-heading font-bold text-white text-sm line-clamp-1">
                      {t.title}
                    </h4>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[9px] uppercase text-zinc-400 block">Prize</span>
                    <span className="font-heading font-extrabold text-amber-400 text-base">
                      {t.prizePool} PKR
                    </span>
                  </div>
                </div>

                {/* Slots bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>Slots: {t.filledSlots} / {t.totalSlots}</span>
                    <span className="font-mono text-zinc-300">
                      {t.matchDate} • {t.matchTime}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full"
                      style={{
                        width: `${Math.min(100, (t.filledSlots / t.totalSlots) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => onSelectTournament(t)}
                    className="flex-1 py-2 rounded-xl bg-zinc-800 text-zinc-200 text-xs font-semibold hover:bg-zinc-700 transition-all text-center"
                  >
                    Details
                  </button>

                  {registered ? (
                    <button
                      onClick={() => onNavigateTab('my-matches')}
                      className="flex-1 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold transition-all text-center flex items-center justify-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Registered</span>
                    </button>
                  ) : isFull ? (
                    <button
                      disabled
                      className="flex-1 py-2 rounded-xl bg-zinc-800 text-zinc-500 text-xs font-bold"
                    >
                      Slots Full
                    </button>
                  ) : (
                    <button
                      onClick={() => onJoinTournament(t)}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black text-xs font-extrabold tracking-wider uppercase shadow-md active:scale-95 transition-all text-center"
                    >
                      Join ({t.entryFee} PKR)
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/30 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs">
          <h5 className="font-bold text-white uppercase tracking-wide">
            100% Guaranteed Cash Prize Payouts
          </h5>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Prizes are transferred directly to winning players via EasyPaisa within 30 minutes of match completion.
          </p>
        </div>
      </div>
    </div>
  );
};
