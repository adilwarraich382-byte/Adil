import React, { useState } from 'react';
import {
  Users,
  Search,
  Gamepad2,
  Phone,
  Mail,
  Calendar,
  Shield,
  ShieldAlert,
  Ban,
  CheckCircle,
  Eye,
  X,
  CreditCard
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { UserProfile, Payment, Registration } from '../../types';

export const AdminUsersView: React.FC = () => {
  const { users, payments, registrations, toggleBlockUser } = useAdminData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserDetail, setSelectedUserDetail] = useState<UserProfile | null>(null);

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = u.fullName?.toLowerCase().includes(q);
    const emailMatch = u.email?.toLowerCase().includes(q);
    const phoneMatch = u.whatsapp?.includes(q);
    const uidMatch = u.ffUid?.includes(q);
    const ignMatch = u.ffIgn?.toLowerCase().includes(q);
    return nameMatch || emailMatch || phoneMatch || uidMatch || ignMatch;
  });

  const getUserMatchesCount = (uid: string) => {
    return registrations.filter((r) => r.userId === uid).length;
  };

  const getUserPayments = (uid: string): Payment[] => {
    return payments.filter((p) => p.userId === uid);
  };

  return (
    <div className="space-y-5 pb-28 px-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-2xl font-black font-heading tracking-wide text-white flex items-center space-x-2">
            <span>GAMER</span>
            <span className="text-red-500">MANAGEMENT</span>
          </h2>
          <p className="text-xs text-zinc-400">View player identities, histories, and blocks</p>
        </div>

        <div className="px-3 py-1 bg-zinc-900 border border-white/10 rounded-full text-xs font-mono font-bold text-amber-400">
          {users.length} Registered
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Name, Free Fire UID, IGN, WhatsApp, Email..."
          className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
        />
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-10 text-center text-zinc-500 text-xs space-y-2">
            <Users className="w-8 h-8 mx-auto text-zinc-600" />
            <p>No users matching "{searchQuery}".</p>
          </div>
        ) : (
          filteredUsers.map((u) => {
            const matchesCount = getUserMatchesCount(u.uid);
            const userPaymentsList = getUserPayments(u.uid);
            const isBlocked = Boolean(u.isBlocked);

            return (
              <div
                key={u.uid}
                className={`bg-zinc-900/90 border rounded-2xl p-4 space-y-3 shadow-md transition-all ${
                  isBlocked ? 'border-red-600/50 opacity-75' : 'border-white/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 p-0.5 shrink-0">
                      <div className="w-full h-full bg-[#0d0f12] rounded-[10px] overflow-hidden flex items-center justify-center font-bold text-white text-sm">
                        {u.photoURL ? (
                          <img src={u.photoURL} alt="" className="w-full h-full object-cover" />
                        ) : (
                          u.fullName?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-white text-sm line-clamp-1">{u.fullName}</h4>
                        {u.role === 'admin' && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-extrabold text-[9px] uppercase">
                            ADMIN
                          </span>
                        )}
                        {isBlocked && (
                          <span className="px-1.5 py-0.2 rounded bg-red-600/30 text-red-400 font-bold text-[9px] uppercase">
                            BLOCKED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 font-mono truncate">{u.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedUserDetail(u)}
                    className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
                    title="View Full Profile"
                  >
                    <Eye className="w-4 h-4 text-amber-400" />
                  </button>
                </div>

                {/* Free Fire UID and IGN */}
                <div className="grid grid-cols-2 gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Free Fire UID</span>
                    <span className="font-mono font-bold text-amber-400">
                      {u.ffUid || 'Not Set'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">IGN</span>
                    <span className="font-bold text-zinc-200 truncate block">
                      {u.ffIgn || 'Not Set'}
                    </span>
                  </div>
                </div>

                {/* Contact and Stats */}
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>{u.whatsapp || 'No WhatsApp'}</span>
                  </span>

                  <span className="font-semibold text-zinc-300">
                    {matchesCount} Tournaments • {userPaymentsList.length} Payments
                  </span>
                </div>

                {/* Block / Unblock Action */}
                <div className="pt-1 flex items-center justify-between border-t border-white/5">
                  <span className="text-[10px] text-zinc-500">
                    Joined {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                  </span>

                  {u.role !== 'admin' && (
                    <button
                      onClick={() => toggleBlockUser(u.uid, isBlocked)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        isBlocked
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                          : 'bg-red-950/60 border border-red-500/30 text-red-400 hover:bg-red-900/40'
                      }`}
                    >
                      {isBlocked ? 'Unblock Player' : 'Block Player'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* USER DETAIL MODAL */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#12151c] border border-white/10 w-full max-w-sm rounded-2xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-heading font-black text-white text-base">GAMER DOSSIER</h4>
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-zinc-900 rounded-xl space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase block">Full Name</span>
                <span className="font-bold text-white text-sm">{selectedUserDetail.fullName}</span>
                <span className="text-zinc-400 block font-mono">{selectedUserDetail.email}</span>
                <span className="text-emerald-400 font-mono block">
                  WhatsApp: {selectedUserDetail.whatsapp}
                </span>
              </div>

              <div className="p-3 bg-black/50 rounded-xl border border-white/5 space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase block">Free Fire Identity</span>
                <div className="flex justify-between font-mono">
                  <span className="text-zinc-400">UID:</span>
                  <span className="font-bold text-amber-400">{selectedUserDetail.ffUid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">In-Game Name:</span>
                  <span className="font-bold text-white">{selectedUserDetail.ffIgn}</span>
                </div>
              </div>

              {/* Payment History for this User */}
              <div className="space-y-2">
                <h5 className="font-heading font-black text-white uppercase tracking-wider text-xs">
                  EasyPaisa Payment Submissions
                </h5>
                {getUserPayments(selectedUserDetail.uid).length === 0 ? (
                  <p className="text-zinc-500 italic">No payments on record.</p>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
                    {getUserPayments(selectedUserDetail.uid).map((p) => (
                      <div
                        key={p.id}
                        className="p-2 rounded-lg bg-zinc-900 border border-white/5 flex justify-between items-center text-[11px]"
                      >
                        <div>
                          <span className="font-mono text-amber-400 font-bold block">
                            TRX: {p.transactionId}
                          </span>
                          <span className="text-zinc-400">{p.tournamentTitle}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-white block">{p.amountPaid} PKR</span>
                          <span
                            className={`text-[9px] font-bold ${
                              p.status === 'APPROVED'
                                ? 'text-emerald-400'
                                : p.status === 'PENDING'
                                ? 'text-amber-400'
                                : 'text-red-400'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedUserDetail(null)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 text-zinc-200 font-bold"
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
