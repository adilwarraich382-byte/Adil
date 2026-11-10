import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Send,
  User,
  Gamepad2,
  Phone,
  Calendar,
  X,
  ShieldAlert
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Payment, PaymentStatus } from '../../types';
import { AdminScreenshotModal } from './AdminScreenshotModal';

export const AdminPaymentsView: React.FC = () => {
  const {
    payments,
    users,
    registrations,
    approvePayment,
    rejectPayment,
    checkDuplicateTrx
  } = useAdminData();

  const [activeTab, setActiveTab] = useState<'ALL' | PaymentStatus>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectScreenshot, setInspectScreenshot] = useState<{
    url: string;
    sender: string;
    trx: string;
  } | null>(null);

  // Rejection modal
  const [rejectingPayment, setRejectingPayment] = useState<Payment | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Invalid Transaction ID or payment not received on 03456311135.');
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  // Processing state
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    const matchesTab = activeTab === 'ALL' || p.status === activeTab;
    const matchesSearch =
      p.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.senderPhone.includes(searchQuery) ||
      p.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tournamentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleApprove = async (payment: Payment) => {
    // Check if duplicate TRX exists that has already been approved
    const duplicates = checkDuplicateTrx(payment.transactionId, payment.id);
    const approvedDupe = duplicates.find((d) => d.status === 'APPROVED');
    if (approvedDupe) {
      alert(
        `SECURITY WARNING: Transaction ID "${payment.transactionId}" was ALREADY APPROVED for user ${approvedDupe.senderName}! You cannot approve a duplicate transaction.`
      );
      return;
    }

    setProcessingId(payment.id);
    try {
      await approvePayment(payment);
    } catch (err) {
      console.error('Error approving payment:', err);
      alert('Failed to approve payment. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingPayment) return;

    setIsSubmittingReject(true);
    try {
      await rejectPayment(rejectingPayment, rejectionReason);
      setRejectingPayment(null);
    } catch (err) {
      console.error('Error rejecting payment:', err);
      alert('Failed to reject payment.');
    } finally {
      setIsSubmittingReject(false);
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black">
            <CheckCircle2 className="w-3 h-3" />
            <span>APPROVED</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/50 text-red-400 text-[10px] font-black animate-pulse">
            <Clock className="w-3 h-3" />
            <span>PENDING VERIFICATION</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-bold">
            <XCircle className="w-3 h-3" />
            <span>REJECTED</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 pb-28 px-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-2xl font-black font-heading tracking-wide text-white flex items-center space-x-2">
            <span>PAYMENT</span>
            <span className="text-red-500">APPROVALS</span>
          </h2>
          <p className="text-xs text-zinc-400">EasyPaisa Transaction ID Verification</p>
        </div>

        <div className="px-3 py-1 bg-zinc-900 border border-white/10 rounded-full text-xs font-mono font-bold text-amber-400">
          {payments.filter((p) => p.status === 'PENDING').length} Pending
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-zinc-900 rounded-xl border border-white/5">
        {[
          { id: 'PENDING', label: 'Pending' },
          { id: 'ALL', label: 'All' },
          { id: 'APPROVED', label: 'Approved' },
          { id: 'REJECTED', label: 'Rejected' }
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 rounded-lg text-xs font-heading font-extrabold tracking-wider transition-all ${
                active
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search TRX ID, Sender Name, Mobile, or Tournament..."
          className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
        />
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.length === 0 ? (
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-10 text-center text-zinc-500 text-xs space-y-2">
            <CreditCard className="w-8 h-8 mx-auto text-zinc-600" />
            <p>No payments found matching the current tab and filter.</p>
          </div>
        ) : (
          filteredPayments.map((pay) => {
            const userProfile = users.find((u) => u.uid === pay.userId);
            const registration = registrations.find((r) => r.id === pay.registrationId);
            const duplicates = checkDuplicateTrx(pay.transactionId, pay.id);
            const isDupe = duplicates.length > 0;
            const isProcessing = processingId === pay.id;

            return (
              <div
                key={pay.id}
                className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 space-y-3.5 shadow-md relative overflow-hidden"
              >
                {/* Duplicate Alert */}
                {isDupe && (
                  <div className="p-2.5 bg-red-950/80 border border-red-500 rounded-xl flex items-start space-x-2 text-xs text-red-200 font-bold animate-pulse">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span>DUPLICATE WARNING:</span>
                      <p className="font-normal text-[11px] text-red-300">
                        {duplicates.length} other submission(s) use TRX ID "{pay.transactionId}". Verify receipt screenshot carefully!
                      </p>
                    </div>
                  </div>
                )}

                {/* Top Status & Tournament */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">
                      {pay.tournamentTitle}
                    </span>
                    <span className="font-mono text-xs text-zinc-400">
                      Fee: {pay.entryFee} PKR
                    </span>
                  </div>
                  {getStatusBadge(pay.status)}
                </div>

                {/* Player Profile Details */}
                <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Player Account:</span>
                    </span>
                    <span className="font-bold text-white">
                      {userProfile?.fullName || registration?.userName || pay.senderName}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-zinc-500 block">Free Fire UID</span>
                      <span className="font-mono font-bold text-amber-400">
                        {userProfile?.ffUid || registration?.ffUid || 'N/A'}
                      </span>
                    </div>

                    <div>
                      <span className="text-zinc-500 block">In-Game Name</span>
                      <span className="font-bold text-zinc-200">
                        {userProfile?.ffIgn || registration?.ffIgn || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {registration?.teammateNames && (
                    <div className="pt-1 border-t border-white/5 text-[11px]">
                      <span className="text-zinc-500 block">Squad / Duo Teammates:</span>
                      <p className="text-zinc-300 whitespace-pre-line">{registration.teammateNames}</p>
                    </div>
                  )}
                </div>

                {/* EasyPaisa Payment Box */}
                <div className="bg-[#121c17] p-3 rounded-xl border border-emerald-500/30 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center pb-1 border-b border-white/5">
                    <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                      EasyPaisa Transfer Proof
                    </span>
                    <span className="font-mono font-black text-white text-sm">
                      {pay.amountPaid} PKR
                    </span>
                  </div>

                  <div className="flex justify-between text-zinc-300">
                    <span className="text-zinc-400">Sender Name:</span>
                    <span className="font-bold text-white">{pay.senderName}</span>
                  </div>

                  <div className="flex justify-between text-zinc-300">
                    <span className="text-zinc-400">Sender Mobile:</span>
                    <span className="font-mono text-zinc-200">{pay.senderPhone}</span>
                  </div>

                  <div className="flex justify-between text-zinc-300">
                    <span className="text-zinc-400">Transaction ID (TRX):</span>
                    <span className="font-mono text-amber-400 font-black tracking-wider selection:bg-amber-500 selection:text-black">
                      {pay.transactionId}
                    </span>
                  </div>

                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>Submitted:</span>
                    <span>
                      {new Date(pay.submittedAt).toLocaleDateString()} at{' '}
                      {new Date(pay.submittedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {pay.rejectionReason && (
                    <div className="p-2 bg-red-950/60 border border-red-500/40 rounded-lg text-red-300 text-[11px] mt-1">
                      <strong>Rejection Reason:</strong> {pay.rejectionReason}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
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
                      className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4 text-amber-400" />
                      <span>Receipt</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-zinc-500 italic py-2">No Image</span>
                  )}

                  {pay.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => {
                          setRejectingPayment(pay);
                          setRejectionReason('Invalid Transaction ID or payment not received on 03456311135.');
                        }}
                        disabled={isProcessing}
                        className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-md"
                      >
                        REJECT
                      </button>

                      <button
                        onClick={() => handleApprove(pay)}
                        disabled={isProcessing}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-1 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>APPROVE</span>
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <div className="flex-1 text-right text-[11px] text-zinc-500">
                      Reviewed by {pay.reviewedBy || 'Admin'}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Rejection Reason Modal */}
      {rejectingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#12151c] border border-red-500/40 w-full max-w-sm rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-heading font-black text-red-400 text-base flex items-center space-x-1.5">
                <XCircle className="w-5 h-5 text-red-500" />
                <span>REJECT PAYMENT</span>
              </h4>
              <button
                onClick={() => setRejectingPayment(null)}
                className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-3 text-xs">
              <p className="text-zinc-300">
                Provide the specific reason for rejecting the payment for{' '}
                <strong className="text-white">{rejectingPayment.senderName}</strong> (TRX:{' '}
                {rejectingPayment.transactionId}). This will be sent directly to the player.
              </p>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">
                  Rejection Reason *
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500 text-xs"
                />
              </div>

              {/* Quick Reason Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  'Fake TRX ID',
                  'Amount less than entry fee',
                  'Duplicate TRX used by another player',
                  'Screenshot unreadable'
                ].map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setRejectionReason(reason)}
                    className="px-2 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-[10px] hover:bg-zinc-700"
                  >
                    {reason}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingPayment(null)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReject}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-extrabold uppercase shadow-lg shadow-red-600/30"
                >
                  {isSubmittingReject ? 'Rejecting...' : 'CONFIRM REJECT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Screenshot Modal */}
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
