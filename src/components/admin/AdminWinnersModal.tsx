import React, { useState } from 'react';
import {
  X,
  Award,
  Crown,
  Trophy,
  DollarSign,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Tournament, WinnerEntry } from '../../types';

interface AdminWinnersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminWinnersModal: React.FC<AdminWinnersModalProps> = ({ isOpen, onClose }) => {
  const { tournaments, publishTournamentResult, markPrizePaid } = useAdminData();

  const [selectedTourneyId, setSelectedTourneyId] = useState<string>(tournaments[0]?.id || '');

  // 1st place
  const [p1Name, setP1Name] = useState('');
  const [p1Uid, setP1Uid] = useState('');
  const [p1Prize, setP1Prize] = useState<number>(300);
  const [p1Kills, setP1Kills] = useState<number>(10);

  // 2nd place
  const [p2Name, setP2Name] = useState('');
  const [p2Uid, setP2Uid] = useState('');
  const [p2Prize, setP2Prize] = useState<number>(150);
  const [p2Kills, setP2Kills] = useState<number>(7);

  // 3rd place
  const [p3Name, setP3Name] = useState('');
  const [p3Uid, setP3Uid] = useState('');
  const [p3Prize, setP3Prize] = useState<number>(50);
  const [p3Kills, setP3Kills] = useState<number>(5);

  const [notes, setNotes] = useState('All prizes dispatched via EasyPaisa to verified squad leaders.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Prize mark paid section
  const [trxRef, setTrxRef] = useState('');

  if (!isOpen) return null;

  const selectedTourney = tournaments.find((t) => t.id === selectedTourneyId) || tournaments[0];

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTourney) {
      alert('Please select a tournament.');
      return;
    }
    if (!p1Name || !p1Uid) {
      alert('Please specify the 1st place champion name and Free Fire UID.');
      return;
    }

    setIsSubmitting(true);
    try {
      const winnersList: WinnerEntry[] = [
        {
          position: 1,
          playerName: p1Name.trim(),
          ffUid: p1Uid.trim(),
          prizeAmount: Number(p1Prize),
          kills: Number(p1Kills)
        }
      ];

      if (p2Name.trim()) {
        winnersList.push({
          position: 2,
          playerName: p2Name.trim(),
          ffUid: p2Uid.trim() || 'N/A',
          prizeAmount: Number(p2Prize),
          kills: Number(p2Kills)
        });
      }

      if (p3Name.trim()) {
        winnersList.push({
          position: 3,
          playerName: p3Name.trim(),
          ffUid: p3Uid.trim() || 'N/A',
          prizeAmount: Number(p3Prize),
          kills: Number(p3Kills)
        });
      }

      await publishTournamentResult({
        tournamentId: selectedTourney.id,
        tournamentTitle: selectedTourney.title,
        tournamentMode: selectedTourney.mode,
        matchDate: selectedTourney.matchDate,
        map: selectedTourney.map,
        winners: winnersList,
        notes: notes.trim()
      });

      // Also record 1st place prize distribution
      if (trxRef) {
        await markPrizePaid({
          tournamentId: selectedTourney.id,
          winnerUid: p1Uid,
          playerName: p1Name,
          ffUid: p1Uid,
          prizeAmount: Number(p1Prize),
          transactionRef: trxRef
        });
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error publishing results:', err);
      alert('Failed to publish results.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4">
      <div className="bg-[#101319] border border-white/10 w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl relative text-zinc-200">
        <div className="sticky top-0 bg-[#101319]/95 backdrop-blur-md px-5 py-3.5 border-b border-white/10 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-heading font-black text-white text-base">
              PUBLISH WINNERS & RESULTS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handlePublish} className="p-5 space-y-4 text-xs">
          {/* Select Tournament */}
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">
              Select Completed Tournament *
            </label>
            <select
              value={selectedTourneyId}
              onChange={(e) => setSelectedTourneyId(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white font-heading font-bold"
            >
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.mode} • {t.matchDate})
                </option>
              ))}
            </select>
          </div>

          {/* 1st Place */}
          <div className="bg-amber-950/20 border border-amber-500/40 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center space-x-1.5 text-amber-400 font-heading font-black text-xs uppercase">
              <Crown className="w-4 h-4" />
              <span>1st Place Champion (Required)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                placeholder="Player / Team Name"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-bold"
              />
              <input
                type="text"
                required
                value={p1Uid}
                onChange={(e) => setP1Uid(e.target.value)}
                placeholder="Free Fire UID"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-0.5">Prize Won (PKR)</label>
                <input
                  type="number"
                  value={p1Prize}
                  onChange={(e) => setP1Prize(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-amber-400 font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-0.5">Kills</label>
                <input
                  type="number"
                  value={p1Kills}
                  onChange={(e) => setP1Kills(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* 2nd Place */}
          <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-3.5 space-y-2">
            <span className="font-heading font-bold text-zinc-300 text-xs block uppercase">
              2nd Place Runner-Up
            </span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                placeholder="2nd Player Name"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white"
              />
              <input
                type="text"
                value={p2Uid}
                onChange={(e) => setP2Uid(e.target.value)}
                placeholder="Free Fire UID"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={p2Prize}
                onChange={(e) => setP2Prize(Number(e.target.value))}
                placeholder="Prize PKR"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-mono"
              />
              <input
                type="number"
                value={p2Kills}
                onChange={(e) => setP2Kills(Number(e.target.value))}
                placeholder="Kills"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-mono"
              />
            </div>
          </div>

          {/* 3rd Place */}
          <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-3.5 space-y-2">
            <span className="font-heading font-bold text-amber-700 text-xs block uppercase">
              3rd Place
            </span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={p3Name}
                onChange={(e) => setP3Name(e.target.value)}
                placeholder="3rd Player Name"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white"
              />
              <input
                type="text"
                value={p3Uid}
                onChange={(e) => setP3Uid(e.target.value)}
                placeholder="Free Fire UID"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-mono"
              />
            </div>
          </div>

          {/* EasyPaisa Prize Transaction Reference */}
          <div className="p-3 bg-black/50 rounded-xl border border-emerald-500/30 space-y-1.5">
            <span className="text-[11px] font-bold text-emerald-400 block uppercase">
              Prize Payout Reference (EasyPaisa TRX)
            </span>
            <input
              type="text"
              value={trxRef}
              onChange={(e) => setTrxRef(e.target.value.toUpperCase())}
              placeholder="e.g. EP-984729103"
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
            />
            <p className="text-[10px] text-zinc-500">
              Optional: records payout proof in prize_distributions collection.
            </p>
          </div>

          {success && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-center flex items-center justify-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Results & Leaderboard published to User App!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-black font-extrabold uppercase tracking-wider text-xs shadow-lg active:scale-95 transition-all"
          >
            {isSubmitting ? 'Publishing Results...' : 'PUBLISH OFFICIAL WINNERS TO USER APP'}
          </button>
        </form>
      </div>
    </div>
  );
};
