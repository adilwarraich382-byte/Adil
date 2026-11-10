import React from 'react';
import {
  X,
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldAlert,
  Flame,
  Award,
  Crosshair,
  ArrowRight
} from 'lucide-react';
import { Tournament } from '../types';
import { BRAND } from '../assets/branding';

interface TournamentDetailsModalProps {
  tournament: Tournament | null;
  isOpen: boolean;
  onClose: () => void;
  onJoin: (tournament: Tournament) => void;
  isRegistered?: boolean;
}

export const TournamentDetailsModal: React.FC<TournamentDetailsModalProps> = ({
  tournament,
  isOpen,
  onClose,
  onJoin,
  isRegistered
}) => {
  if (!isOpen || !tournament) return null;

  const isRegistrationOpen = tournament.status === 'REGISTRATION_OPEN';
  const isSlotsFull = tournament.filledSlots >= tournament.totalSlots;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4">
      <div className="bg-[#101319] border border-white/10 w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl relative text-zinc-200">
        {/* Banner with Overlay */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden">
          <img
            src={tournament.bannerUrl || BRAND.banner}
            alt={tournament.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101319] via-[#101319]/50 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md text-zinc-300 hover:text-white flex items-center justify-center transition-colors border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badges */}
          <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                {tournament.mode}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-zinc-200 text-[10px] font-semibold flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-red-500" />
                <span>{tournament.map}</span>
              </span>
            </div>

            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isRegistrationOpen
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-zinc-800 text-zinc-400 border border-white/10'
            }`}>
              {tournament.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Title & Entry Fee */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white font-heading tracking-wide">
                {tournament.title}
              </h2>
              <div className="flex items-center space-x-3 text-xs text-zinc-400 mt-1">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>{tournament.matchDate}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{tournament.matchTime}</span>
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-zinc-400 block uppercase">Entry Fee</span>
              <span className="text-xl font-extrabold text-amber-400 font-heading">
                {tournament.entryFee} PKR
              </span>
            </div>
          </div>

          {/* Prize Pool Breakdown Card */}
          <div className="bg-gradient-to-br from-amber-950/30 via-zinc-900 to-zinc-900 border border-amber-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Total Prize Pool
                </span>
              </div>
              <span className="text-2xl font-black text-gold-gradient font-heading">
                {tournament.prizePool} PKR
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 rounded-xl bg-black/40 border border-amber-500/20">
                <div className="flex items-center justify-center space-x-1 text-amber-400 text-xs font-bold mb-0.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>1ST PLACE</span>
                </div>
                <span className="text-sm font-extrabold text-white font-mono">
                  {tournament.firstPrize} PKR
                </span>
              </div>

              <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                <div className="flex items-center justify-center space-x-1 text-zinc-300 text-xs font-bold mb-0.5">
                  <Award className="w-3.5 h-3.5 text-zinc-400" />
                  <span>2ND PLACE</span>
                </div>
                <span className="text-sm font-extrabold text-white font-mono">
                  {tournament.secondPrize} PKR
                </span>
              </div>

              <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                <div className="flex items-center justify-center space-x-1 text-amber-700 text-xs font-bold mb-0.5">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  <span>3RD PLACE</span>
                </div>
                <span className="text-sm font-extrabold text-white font-mono">
                  {tournament.thirdPrize} PKR
                </span>
              </div>
            </div>

            {tournament.perKillPrize ? (
              <div className="flex items-center justify-between text-xs px-2 pt-1 text-amber-300 bg-amber-500/10 rounded-lg py-1.5 border border-amber-500/20">
                <span className="flex items-center space-x-1">
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Kill Bounty Reward:</span>
                </span>
                <span className="font-bold">{tournament.perKillPrize} PKR / Kill</span>
              </div>
            ) : null}
          </div>

          {/* Slots Progress */}
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5 text-zinc-300">
                <Users className="w-4 h-4 text-amber-400" />
                <span className="font-semibold">Registered Warriors:</span>
              </div>
              <span className="font-mono font-bold text-white">
                {tournament.filledSlots} / {tournament.totalSlots} Slots
              </span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (tournament.filledSlots / tournament.totalSlots) * 100)}%`
                }}
              />
            </div>
            <p className="text-[10px] text-zinc-400">
              {tournament.totalSlots - tournament.filledSlots} slots remaining before registration closes.
            </p>
          </div>

          {/* Tournament Rules */}
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-zinc-300">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>Official Match Rules</span>
            </div>
            <p className="text-xs text-zinc-400 whitespace-pre-line leading-relaxed">
              {tournament.rules ||
                '1. Mobile devices only. PC Emulators, iPads or modified APKs are strictly prohibited.\n2. Room ID and Password will be released 15 minutes before match time.\n3. Hackers, teaming, or abusive behavior results in immediate permanent ban without refund.\n4. Winners must record screenshot or video of final scoreboard.'}
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {isRegistered ? (
              <button
                disabled
                className="w-full py-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-extrabold text-sm uppercase tracking-wider"
              >
                ALREADY REGISTERED • CHECK MY MATCHES
              </button>
            ) : isSlotsFull ? (
              <button
                disabled
                className="w-full py-3.5 rounded-xl bg-zinc-800 text-zinc-500 font-extrabold text-sm uppercase tracking-wider"
              >
                TOURNAMENT SLOTS FULL
              </button>
            ) : !isRegistrationOpen ? (
              <button
                disabled
                className="w-full py-3.5 rounded-xl bg-zinc-800 text-zinc-500 font-extrabold text-sm uppercase tracking-wider"
              >
                REGISTRATION CLOSED
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onJoin(tournament);
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-black font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-orange-500/25 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              >
                <span>JOIN NOW FOR {tournament.entryFee} PKR</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
