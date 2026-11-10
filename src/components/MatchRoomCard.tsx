import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Copy,
  Check,
  AlertTriangle,
  Clock,
  Gamepad2,
  HelpCircle,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import { Registration, RoomCredential } from '../types';
import { useTournament } from '../context/TournamentContext';

interface MatchRoomCardProps {
  registration: Registration;
  matchDate?: string;
  matchTime?: string;
}

export const MatchRoomCard: React.FC<MatchRoomCardProps> = ({
  registration,
  matchDate,
  matchTime
}) => {
  const { getRoomCredentials, appSettings } = useTournament();
  const [credentials, setCredentials] = useState<RoomCredential | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const isApproved = registration.status === 'APPROVED';

  useEffect(() => {
    let isMounted = true;
    if (isApproved) {
      setLoading(true);
      getRoomCredentials(registration.tournamentId)
        .then((creds) => {
          if (isMounted) {
            setCredentials(creds);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isApproved, registration.tournamentId, getRoomCredentials]);

  const handleCopyId = () => {
    if (!credentials?.roomId) return;
    navigator.clipboard.writeText(credentials.roomId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyPass = () => {
    if (!credentials?.roomPassword) return;
    navigator.clipboard.writeText(credentials.roomPassword);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  const handleSupportWhatsApp = () => {
    const rawNumber = appSettings.whatsappSupportNumber.replace(/\D/g, '');
    const url = `https://wa.me/${rawNumber}?text=Help%20Room%20Credentials%20for%20Tournament%20ID%20${registration.tournamentId}`;
    window.open(url, '_blank');
  };

  // If not approved, show locked state
  if (!isApproved) {
    return (
      <div className="bg-zinc-900/80 border border-white/5 rounded-2xl p-4 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
          <Lock className="w-5 h-5 text-amber-500/70" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Room Credentials Locked
          </h4>
          <p className="text-[11px] text-zinc-500 mt-1 max-w-xs mx-auto">
            Room ID and Password will unlock automatically here as soon as the Admin approves your EasyPaisa payment.
          </p>
        </div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-400 font-semibold">
          <Clock className="w-3 h-3" />
          <span>Awaiting Admin Verification</span>
        </div>
      </div>
    );
  }

  // If approved but credentials haven't been published yet by admin
  if (loading) {
    return (
      <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-2">
        <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400">Loading custom room credentials...</p>
      </div>
    );
  }

  if (!credentials) {
    return (
      <div className="bg-[#121f18] border border-emerald-500/40 rounded-2xl p-4 space-y-3">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Registration Confirmed</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Your payment has been <strong className="text-emerald-400">APPROVED</strong>! Match room credentials will be generated and published here <strong>15 minutes before match start</strong> ({matchTime || 'scheduled time'}).
        </p>
        <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-xs">
          <span className="text-zinc-400">Match Schedule:</span>
          <span className="text-amber-400 font-bold">{matchDate} - {matchTime}</span>
        </div>
      </div>
    );
  }

  // Room Credentials Available
  return (
    <div className="bg-gradient-to-b from-[#141d18] to-[#0f1412] border-2 border-emerald-500/50 rounded-2xl p-4 space-y-4 shadow-xl shadow-emerald-950/40 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-black tracking-wider uppercase">
          <Unlock className="w-4 h-4" />
          <span>MATCH ROOM UNLOCKED</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">
          Match: {credentials.matchTime || matchTime}
        </span>
      </div>

      {/* Room ID and Password Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Room ID */}
        <div className="bg-black/60 border border-emerald-500/40 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Free Fire Room ID</span>
          <div className="my-1.5">
            <span className="font-mono text-lg font-black text-white tracking-widest selection:bg-emerald-500">
              {credentials.roomId}
            </span>
          </div>
          <button
            onClick={handleCopyId}
            className="flex items-center justify-center space-x-1 py-1.5 rounded-lg bg-emerald-500 text-black font-extrabold text-[11px] uppercase active:scale-95 transition-all shadow-md"
          >
            {copiedId ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>COPIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPY ID</span>
              </>
            )}
          </button>
        </div>

        {/* Room Password */}
        <div className="bg-black/60 border border-emerald-500/40 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Room Password</span>
          <div className="my-1.5">
            <span className="font-mono text-lg font-black text-amber-400 tracking-widest selection:bg-amber-500">
              {credentials.roomPassword}
            </span>
          </div>
          <button
            onClick={handleCopyPass}
            className="flex items-center justify-center space-x-1 py-1.5 rounded-lg bg-amber-500 text-black font-extrabold text-[11px] uppercase active:scale-95 transition-all shadow-md"
          >
            {copiedPass ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>COPIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPY PASS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1.5 text-xs">
        <h5 className="font-bold text-white flex items-center space-x-1 text-[11px] uppercase tracking-wide">
          <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>How to join in Free Fire:</span>
        </h5>
        <ol className="text-[11px] text-zinc-300 space-y-1 pl-4 list-decimal">
          <li>Open <strong>Free Fire</strong> on your mobile phone.</li>
          <li>Tap on <strong>Modes</strong> &gt; select <strong>Custom</strong>.</li>
          <li>Tap <strong>Search</strong> icon & paste the <strong>Room ID</strong> above.</li>
          <li>Enter the <strong>Password</strong> & take your assigned slot.</li>
        </ol>
      </div>

      {/* WhatsApp Help */}
      <button
        onClick={handleSupportWhatsApp}
        className="w-full py-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white font-medium text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
      >
        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
        <span>Need help joining the custom room? Contact Support</span>
      </button>
    </div>
  );
};
