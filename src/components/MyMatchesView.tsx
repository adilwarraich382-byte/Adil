import React, { useState } from 'react';
import {
  Swords,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trophy,
  ArrowRight,
  RefreshCw,
  Calendar,
  Lock,
  Unlock,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTournament } from '../context/TournamentContext';
import { MatchRoomCard } from './MatchRoomCard';
import { RegistrationStatus } from '../types';

interface MyMatchesViewProps {
  onJoinMore: () => void;
  onOpenAuth: () => void;
  onSelectTournamentById: (tournamentId: string) => void;
}

export const MyMatchesView: React.FC<MyMatchesViewProps> = ({
  onJoinMore,
  onOpenAuth,
  onSelectTournamentById
}) => {
  const { user } = useAuth();
  const { userRegistrations, tournaments, userPayments, appSettings } = useTournament();

  const [filterTab, setFilterTab] = useState<'ALL' | RegistrationStatus | 'COMPLETED'>('ALL');
  const [selectedMatchForRoom, setSelectedMatchForRoom] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="pb-24 px-4 max-w-md mx-auto text-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-amber-500">
          <Swords className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-black text-white">
            TRACK YOUR TOURNAMENTS
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            Please log in to your account to view your registered matches, EasyPaisa verification statuses, and match room passwords.
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
        >
          LOGIN TO VIEW MATCHES
        </button>
      </div>
    );
  }

  // Filter registrations
  const filteredRegistrations = userRegistrations.filter((r) => {
    if (filterTab === 'ALL') return true;
    if (filterTab === 'COMPLETED') {
      const tourney = tournaments.find((t) => t.id === r.tournamentId);
      return tourney?.status === 'COMPLETED';
    }
    return r.status === filterTab;
  });

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>APPROVED</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-bold animate-pulse">
            <Clock className="w-3 h-3" />
            <span>VERIFICATION PENDING</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-bold">
            <XCircle className="w-3 h-3" />
            <span>REJECTED</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-bold">
            <span>CANCELLED</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 pb-24 px-4 max-w-md mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-2xl font-black font-heading tracking-wide text-white flex items-center space-x-2">
            <span>MY</span>
            <span className="text-amber-500">MATCHES</span>
          </h2>
          <p className="text-xs text-zinc-400">Live EasyPaisa status & Match Room IDs</p>
        </div>

        <div className="px-3 py-1 bg-zinc-900 border border-white/10 rounded-full text-xs font-mono font-bold text-amber-400">
          {userRegistrations.length} Total
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'ALL', label: 'All' },
          { id: 'PENDING', label: 'Pending' },
          { id: 'APPROVED', label: 'Approved' },
          { id: 'REJECTED', label: 'Rejected' },
          { id: 'COMPLETED', label: 'Completed' }
        ].map((tab) => {
          const active = filterTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition-all border ${
                active
                  ? 'bg-amber-500 text-black border-amber-400 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 border-white/5 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Registrations List */}
      <div className="space-y-4">
        {filteredRegistrations.length === 0 ? (
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-10 text-center text-zinc-500 text-xs space-y-3">
            <Swords className="w-8 h-8 mx-auto text-zinc-600" />
            <p>No matches found under {filterTab} status.</p>
            <button
              onClick={onJoinMore}
              className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/25 active:scale-95 transition-all"
            >
              Explore Available Tournaments
            </button>
          </div>
        ) : (
          filteredRegistrations.map((reg) => {
            const tourney = tournaments.find((t) => t.id === reg.tournamentId);
            const payment = userPayments.find((p) => p.registrationId === reg.id || p.id === reg.paymentId);
            const isRoomOpen = selectedMatchForRoom === reg.id;

            return (
              <div
                key={reg.id}
                className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 space-y-3.5 shadow-md relative overflow-hidden"
              >
                {/* Status Bar */}
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase">
                    {reg.tournamentMode}
                  </span>
                  {getStatusBadge(reg.status)}
                </div>

                {/* Tournament title and schedule */}
                <div>
                  <h3 className="font-heading font-extrabold text-base text-white">
                    {reg.tournamentTitle}
                  </h3>
                  <div className="flex items-center space-x-3 text-xs text-zinc-400 mt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>{tourney?.matchDate || 'Scheduled'}</span>
                    </span>
                    <span>•</span>
                    <span>{tourney?.matchTime || 'TBA'}</span>
                    <span>•</span>
                    <span className="text-zinc-300 font-medium">Slot #{reg.slotNumber || 1}</span>
                  </div>
                </div>

                {/* Payment & EasyPaisa status card */}
                {payment && (
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1.5 text-xs">
                    <div className="flex justify-between text-zinc-300">
                      <span className="text-zinc-400">EasyPaisa TRX ID:</span>
                      <span className="font-mono text-amber-400 font-bold">{payment.transactionId}</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span className="text-zinc-400">Amount Paid:</span>
                      <span className="font-bold text-white">{payment.amountPaid} PKR</span>
                    </div>

                    {/* Status Message Explanation */}
                    {reg.status === 'PENDING' && (
                      <div className="pt-1 text-[11px] text-amber-300 flex items-start space-x-1">
                        <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                        <span>
                          Payment verification in progress. The ADIL ESPORTS admin is reviewing your payment.
                        </span>
                      </div>
                    )}

                    {reg.status === 'APPROVED' && (
                      <div className="pt-1 text-[11px] text-emerald-400 flex items-start space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>
                          Payment verified! Your registration is 100% confirmed. Access custom room details below.
                        </span>
                      </div>
                    )}

                    {reg.status === 'REJECTED' && (
                      <div className="pt-1 p-2 bg-red-950/40 border border-red-500/30 rounded-lg text-[11px] text-red-300 space-y-1">
                        <div className="flex items-center space-x-1 font-bold text-red-400">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Rejection Reason:</span>
                        </div>
                        <p>{payment.rejectionReason || reg.rejectionReason || 'Invalid Transaction ID or payment not received on 03456311135.'}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Match Room Expand / Collapse Section */}
                <div className="pt-1 space-y-2">
                  <button
                    onClick={() => setSelectedMatchForRoom(isRoomOpen ? null : reg.id)}
                    className={`w-full py-2.5 px-4 rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-between ${
                      reg.status === 'APPROVED'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20 active:scale-95'
                        : 'bg-zinc-800 text-zinc-400 border border-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {reg.status === 'APPROVED' ? (
                        <Unlock className="w-4 h-4 text-emerald-300" />
                      ) : (
                        <Lock className="w-4 h-4 text-zinc-500" />
                      )}
                      <span>
                        {reg.status === 'APPROVED'
                          ? isRoomOpen
                            ? 'HIDE MATCH ROOM CREDENTIALS'
                            : 'VIEW ROOM ID & PASSWORD'
                          : isRoomOpen
                          ? 'HIDE ROOM STATUS'
                          : 'CHECK ROOM ACCESS STATUS'}
                      </span>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 transform transition-transform ${
                        isRoomOpen ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {/* Render Room Component */}
                  {isRoomOpen && (
                    <div className="pt-2">
                      <MatchRoomCard
                        registration={reg}
                        matchDate={tourney?.matchDate}
                        matchTime={tourney?.matchTime}
                      />
                    </div>
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
