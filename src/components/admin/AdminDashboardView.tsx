import React, { useState } from 'react';
import {
  Users,
  Trophy,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowRight,
  ShieldCheck,
  Eye,
  Sliders,
  Plus,
  Radio,
  Flame
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Payment } from '../../types';
import { AdminScreenshotModal } from './AdminScreenshotModal';

interface AdminDashboardViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenCreateTournament: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onNavigateTab,
  onOpenCreateTournament
}) => {
  const {
    tournaments,
    payments,
    registrations,
    users,
    approvePayment,
    rejectPayment,
    checkDuplicateTrx
  } = useAdminData();

  const [inspectScreenshot, setInspectScreenshot] = useState<{
    url: string;
    sender: string;
    trx: string;
  } | null>(null);

  const [processingId, setProcessingId] = useState<string | null>(null);

  // Metrics
  const totalUsersCount = users.length;
  const totalTournamentsCount = tournaments.length;
  const totalRegistrationsCount = registrations.length;

  const pendingPayments = payments.filter((p) => p.status === 'PENDING');
  const approvedPayments = payments.filter((p) => p.status === 'APPROVED');
  const rejectedPayments = payments.filter((p) => p.status === 'REJECTED');

  // Total revenue from approved payments
  const totalRevenue = approvedPayments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);

  // Total prize pool to pay across active/ongoing tournaments
  const totalPrizeToPay = tournaments
    .filter((t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED')
    .reduce((sum, t) => sum + (t.prizePool || 0), 0);

  const handleQuickApprove = async (payment: Payment) => {
    setProcessingId(payment.id);
    try {
      await approvePayment(payment);
    } catch (err) {
      console.error('Quick approve error:', err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-28 px-4 max-w-md mx-auto">
      {/* Red Alert Banner for Pending Approvals */}
      {pendingPayments.length > 0 ? (
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-[#1e0d0d] border-2 border-red-500 rounded-2xl p-4 shadow-xl shadow-red-950/50 space-y-2 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-red-300">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <h3 className="font-heading font-black text-white text-base tracking-wide">
                ACTION REQUIRED: {pendingPayments.length} PENDING PAYMENTS
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('payments')}
              className="text-xs text-white font-extrabold underline uppercase"
            >
              Review All
            </button>
          </div>
          <p className="text-xs text-red-200">
            Players are waiting for EasyPaisa verification before match custom rooms lock!
          </p>
        </div>
      ) : (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>All EasyPaisa Payments Cleared & Up to Date</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">0 in queue</span>
        </div>
      )}

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Users */}
        <div
          onClick={() => onNavigateTab('users')}
          className="bg-zinc-900/90 border border-white/10 rounded-2xl p-3.5 space-y-1 hover:border-amber-500/40 transition-all cursor-pointer shadow-md"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Gamers</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <span className="font-heading font-black text-2xl text-white block">
            {totalUsersCount}
          </span>
          <span className="text-[10px] text-zinc-500 block">Registered Players</span>
        </div>

        {/* Total Tournaments */}
        <div
          onClick={() => onNavigateTab('tournaments')}
          className="bg-zinc-900/90 border border-white/10 rounded-2xl p-3.5 space-y-1 hover:border-amber-500/40 transition-all cursor-pointer shadow-md"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Tournaments</span>
            <Trophy className="w-4 h-4 text-red-500" />
          </div>
          <span className="font-heading font-black text-2xl text-white block">
            {totalTournamentsCount}
          </span>
          <span className="text-[10px] text-zinc-500 block">Solo / Duo / Squad</span>
        </div>

        {/* Total Revenue */}
        <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-2xl p-3.5 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              Total Revenue
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-heading font-black text-2xl text-emerald-400 block font-mono">
            {totalRevenue.toLocaleString()} <span className="text-xs">PKR</span>
          </span>
          <span className="text-[10px] text-zinc-500 block">From Approved Fees</span>
        </div>

        {/* Total Prize Pool */}
        <div className="bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-3.5 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
              Prize Commitment
            </span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <span className="font-heading font-black text-2xl text-amber-400 block font-mono">
            {totalPrizeToPay.toLocaleString()} <span className="text-xs">PKR</span>
          </span>
          <span className="text-[10px] text-zinc-500 block">Active Prize Pools</span>
        </div>
      </div>

      {/* Quick Action Buttons Bar */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={onOpenCreateTournament}
          className="py-3 px-3 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>NEW TOURNAMENT</span>
        </button>

        <button
          onClick={() => onNavigateTab('settings')}
          className="py-3 px-3 rounded-xl bg-zinc-900 border border-white/15 text-white font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
        >
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>APP SETTINGS & PRICING</span>
        </button>
      </div>

      {/* Pending Approvals List (Quick Verify Section) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <h3 className="font-heading font-extrabold text-base tracking-wide text-white uppercase">
              PENDING EASYPAISA VERIFICATION
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('payments')}
            className="text-xs text-amber-400 font-bold hover:underline"
          >
            View All ({pendingPayments.length})
          </button>
        </div>

        {pendingPayments.length === 0 ? (
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 text-center text-zinc-500 text-xs">
            No payments currently waiting for review. All clean!
          </div>
        ) : (
          <div className="space-y-3">
            {pendingPayments.slice(0, 3).map((pay) => {
              const duplicates = checkDuplicateTrx(pay.transactionId, pay.id);
              const isDupe = duplicates.length > 0;
              const isProcessing = processingId === pay.id;

              return (
                <div
                  key={pay.id}
                  className="bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-4 space-y-3 shadow-md"
                >
                  {/* Duplicate warning badge */}
                  {isDupe && (
                    <div className="p-2 bg-red-950/80 border border-red-500 rounded-xl flex items-center space-x-1.5 text-[11px] text-red-200 font-bold">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>DUPLICATE WARNING: Same TRX ID found in database!</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-400 block">
                        {pay.tournamentTitle}
                      </span>
                      <h4 className="font-bold text-white text-sm">
                        {pay.senderName} ({pay.senderPhone})
                      </h4>
                      <p className="text-[11px] font-mono text-zinc-300">
                        TRX: <strong className="text-amber-400">{pay.transactionId}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-black text-emerald-400 text-base">
                        {pay.amountPaid} PKR
                      </span>
                      <span className="text-[9px] text-zinc-500 block">
                        {new Date(pay.submittedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center space-x-2 pt-1">
                    {pay.screenshotUrl ? (
                      <button
                        onClick={() =>
                          setInspectScreenshot({
                            url: pay.screenshotUrl!,
                            sender: pay.senderName,
                            trx: pay.transactionId
                          })
                        }
                        className="py-2 px-3 rounded-xl bg-zinc-800 text-zinc-200 text-xs font-semibold hover:bg-zinc-700 flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Screenshot</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-zinc-500 italic py-2">No receipt image</span>
                    )}

                    <button
                      onClick={() => handleQuickApprove(pay)}
                      disabled={isProcessing}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center space-x-1 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>QUICK APPROVE</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Latest Users Summary */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-base tracking-wide text-white uppercase">
            RECENT REGISTERED GAMERS
          </h3>
          <button
            onClick={() => onNavigateTab('users')}
            className="text-xs text-amber-400 font-bold hover:underline"
          >
            Manage Users
          </button>
        </div>

        <div className="bg-zinc-900/90 border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden">
          {users.slice(0, 4).map((u) => (
            <div key={u.uid} className="p-3 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-black flex items-center justify-center text-xs">
                  {u.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h5 className="font-bold text-white line-clamp-1">{u.fullName}</h5>
                  <p className="text-[10px] font-mono text-zinc-400">
                    UID: {u.ffUid || 'N/A'} • IGN: {u.ffIgn || 'N/A'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Screenshot Viewer Modal */}
      {inspectScreenshot && (
        <AdminScreenshotModal
          screenshotUrl={inspectScreenshot.url}
          senderName={inspectScreenshot.sender}
          trxId={inspectScreenshot.trx}
          onClose={() => setInspectScreenshot(null)}
        />
      )}
    </div>
  );
};
