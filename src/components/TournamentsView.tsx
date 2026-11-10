import React, { useState } from 'react';
import {
  Trophy,
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { Tournament, TournamentMode } from '../types';

interface TournamentsViewProps {
  onSelectTournament: (tournament: Tournament) => void;
  onJoinTournament: (tournament: Tournament) => void;
  onNavigateTab: (tab: string) => void;
}

export const TournamentsView: React.FC<TournamentsViewProps> = ({
  onSelectTournament,
  onJoinTournament,
  onNavigateTab
}) => {
  const { tournaments, userRegistrations } = useTournament();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<'ALL' | TournamentMode>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredTournaments = tournaments.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.map.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = selectedMode === 'ALL' || t.mode === selectedMode;
    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    return matchesSearch && matchesMode && matchesStatus;
  });

  const isUserRegistered = (tournamentId: string) => {
    return userRegistrations.some((r) => r.tournamentId === tournamentId);
  };

  return (
    <div className="space-y-5 pb-24 px-4 max-w-md mx-auto">
      {/* Header title */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-2xl font-black font-heading tracking-wide text-white flex items-center space-x-2">
            <span>TOURNAMENT</span>
            <span className="text-amber-500">ARENA</span>
          </h2>
          <p className="text-xs text-zinc-400">Join Solo, Duo, Squad Free Fire matches</p>
        </div>

        <div className="px-3 py-1 bg-zinc-900 border border-white/10 rounded-full text-xs font-mono font-bold text-amber-400">
          {filteredTournaments.length} Matches
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or map (Bermuda, Purgatory)..."
          className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Mode Filters */}
      <div className="grid grid-cols-4 gap-2">
        {(['ALL', 'SOLO', 'DUO', 'SQUAD'] as const).map((mode) => {
          const active = selectedMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`py-2 rounded-xl text-xs font-heading font-extrabold tracking-wider transition-all border ${
                active
                  ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/25 scale-[1.02]'
                  : 'bg-zinc-900 text-zinc-400 border-white/5 hover:text-white'
              }`}
            >
              {mode}
            </button>
          );
        })}
      </div>

      {/* Status Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'ALL', label: 'All Status' },
          { id: 'REGISTRATION_OPEN', label: 'Open' },
          { id: 'LIVE', label: 'Live' },
          { id: 'UPCOMING', label: 'Upcoming' },
          { id: 'COMPLETED', label: 'Completed' }
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedStatus(s.id)}
            className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors border ${
              selectedStatus === s.id
                ? 'bg-zinc-800 text-amber-400 border-amber-500/40'
                : 'bg-zinc-900 text-zinc-400 border-white/5 hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Tournament Cards List */}
      <div className="space-y-4">
        {filteredTournaments.length === 0 ? (
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-10 text-center text-zinc-500 text-xs space-y-2">
            <Trophy className="w-8 h-8 mx-auto text-zinc-600" />
            <p>No tournaments matching your search or filters.</p>
          </div>
        ) : (
          filteredTournaments.map((t) => {
            const registered = isUserRegistered(t.id);
            const isFull = t.filledSlots >= t.totalSlots;
            const isOpen = t.status === 'REGISTRATION_OPEN';

            return (
              <div
                key={t.id}
                className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 space-y-3.5 hover:border-amber-500/40 transition-all shadow-md group relative overflow-hidden"
              >
                {/* Accent glow corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider">
                        {t.mode}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-zinc-300 text-[10px] font-semibold flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        <span>{t.map}</span>
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          isOpen
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : t.status === 'LIVE'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="font-heading font-extrabold text-base text-white tracking-wide">
                      {t.title}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[9px] uppercase font-bold text-zinc-400 block">
                      Prize Pool
                    </span>
                    <span className="font-heading font-black text-amber-400 text-lg">
                      {t.prizePool} PKR
                    </span>
                  </div>
                </div>

                {/* Match Date, Time, and Entry fee */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <div className="flex items-center space-x-2 text-zinc-300">
                    <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{t.matchDate}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-zinc-300">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{t.matchTime}</span>
                  </div>
                </div>

                {/* Slots Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Slots: {t.filledSlots} / {t.totalSlots}</span>
                    </span>
                    <span className="font-medium text-amber-400">
                      Entry: <strong className="font-bold text-white">{t.entryFee} PKR</strong>
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (t.filledSlots / t.totalSlots) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => onSelectTournament(t)}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all text-center"
                  >
                    Details & Rules
                  </button>

                  {registered ? (
                    <button
                      onClick={() => onNavigateTab('my-matches')}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-extrabold transition-all text-center flex items-center justify-center space-x-1"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Registered</span>
                    </button>
                  ) : isFull ? (
                    <button
                      disabled
                      className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-500 text-xs font-bold"
                    >
                      Slots Full
                    </button>
                  ) : !isOpen ? (
                    <button
                      disabled
                      className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-500 text-xs font-bold"
                    >
                      Closed
                    </button>
                  ) : (
                    <button
                      onClick={() => onJoinTournament(t)}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-black text-xs font-black uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-1"
                    >
                      <span>JOIN NOW</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
