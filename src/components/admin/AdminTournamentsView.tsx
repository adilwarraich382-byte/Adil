import React, { useState } from 'react';
import {
  Trophy,
  Plus,
  Edit3,
  Trash2,
  KeyRound,
  Eye,
  EyeOff,
  MapPin,
  Calendar,
  Clock,
  Users,
  Check,
  X,
  AlertTriangle,
  Lock,
  Unlock,
  Radio,
  Flame,
  Send
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Tournament, TournamentMode, TournamentStatus } from '../../types';
import { ADMIN_BRAND } from '../../assets/branding';

interface AdminTournamentsViewProps {
  onOpenCreate: () => void;
  isCreateModalOpen: boolean;
  onCloseCreate: () => void;
}

export const AdminTournamentsView: React.FC<AdminTournamentsViewProps> = ({
  onOpenCreate,
  isCreateModalOpen,
  onCloseCreate
}) => {
  const {
    tournaments,
    appSettings,
    createTournament,
    updateTournament,
    deleteTournament,
    publishRoomCredentials,
    getTournamentRoomCredentials
  } = useAdminData();

  // Filter mode
  const [filterMode, setFilterMode] = useState<'ALL' | TournamentMode>('ALL');

  // Room modal state
  const [roomModalTourney, setRoomModalTourney] = useState<Tournament | null>(null);
  const [roomIdInput, setRoomIdInput] = useState('');
  const [roomPassInput, setRoomPassInput] = useState('');
  const [roomInstructions, setRoomInstructions] = useState('Join Free Fire Custom room 10 minutes prior to match start.');
  const [isPublishingRoom, setIsPublishingRoom] = useState(false);

  // Edit tournament state
  const [editingTourney, setEditingTourney] = useState<Tournament | null>(null);

  // New Tournament Form states
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState<TournamentMode>('SOLO');
  const [entryFee, setEntryFee] = useState<number>(appSettings.defaultSoloFee || 100);
  const [prizePool, setPrizePool] = useState<number>(appSettings.defaultSoloPrize || 500);
  const [firstPrize, setFirstPrize] = useState<number>(300);
  const [secondPrize, setSecondPrize] = useState<number>(150);
  const [thirdPrize, setThirdPrize] = useState<number>(50);
  const [perKillPrize, setPerKillPrize] = useState<number>(10);
  const [totalSlots, setTotalSlots] = useState<number>(48);
  const [matchDate, setMatchDate] = useState('Tonight');
  const [matchTime, setMatchTime] = useState('08:00 PM PKT');
  const [map, setMap] = useState<'Bermuda' | 'Purgatory' | 'Kalahari' | 'Alpine'>('Bermuda');
  const [status, setStatus] = useState<TournamentStatus>('REGISTRATION_OPEN');
  const [initialRoomId, setInitialRoomId] = useState('');
  const [initialRoomPassword, setInitialRoomPassword] = useState('');
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  // Handle Mode Change in form to dynamically set default prices from app_settings
  const handleModeChange = (newMode: TournamentMode) => {
    setMode(newMode);
    if (newMode === 'SOLO') {
      setEntryFee(appSettings.defaultSoloFee || 100);
      setPrizePool(appSettings.defaultSoloPrize || 500);
      setFirstPrize(300);
      setSecondPrize(150);
      setThirdPrize(50);
      setTotalSlots(48);
    } else if (newMode === 'DUO') {
      setEntryFee(appSettings.defaultDuoFee || 200);
      setPrizePool(appSettings.defaultDuoPrize || 1000);
      setFirstPrize(600);
      setSecondPrize(300);
      setThirdPrize(100);
      setTotalSlots(24);
    } else if (newMode === 'SQUAD') {
      setEntryFee(appSettings.defaultSquadFee || 400);
      setPrizePool(appSettings.defaultSquadPrize || 2000);
      setFirstPrize(1200);
      setSecondPrize(500);
      setThirdPrize(300);
      setTotalSlots(12);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingNew(true);
    try {
      await createTournament({
        title: title.trim(),
        mode,
        entryFee: Number(entryFee),
        prizePool: Number(prizePool),
        firstPrize: Number(firstPrize),
        secondPrize: Number(secondPrize),
        thirdPrize: Number(thirdPrize),
        perKillPrize: Number(perKillPrize),
        totalSlots: Number(totalSlots),
        matchDate,
        matchTime,
        map,
        status,
        bannerUrl: ADMIN_BRAND.banner,
        roomId: initialRoomId.trim() || undefined,
        roomPassword: initialRoomPassword.trim() || undefined,
        rules: '1. Mobile devices only (No PC Emulators).\n2. Room ID released 15 mins before match.\n3. Fair play strictly enforced.'
      });
      onCloseCreate();
      // Reset form
      setTitle('');
    } catch (err) {
      console.error('Error creating tournament:', err);
      alert('Failed to create tournament.');
    } finally {
      setIsSubmittingNew(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTourney) return;
    try {
      await updateTournament(editingTourney.id, {
        title: editingTourney.title,
        mode: editingTourney.mode,
        entryFee: Number(editingTourney.entryFee),
        prizePool: Number(editingTourney.prizePool),
        firstPrize: Number(editingTourney.firstPrize),
        secondPrize: Number(editingTourney.secondPrize),
        thirdPrize: Number(editingTourney.thirdPrize),
        totalSlots: Number(editingTourney.totalSlots),
        matchDate: editingTourney.matchDate,
        matchTime: editingTourney.matchTime,
        map: editingTourney.map,
        status: editingTourney.status
      });
      setEditingTourney(null);
    } catch (err) {
      console.error('Error updating tournament:', err);
      alert('Failed to update tournament.');
    }
  };

  const handleDelete = async (id: string, tourneyTitle: string) => {
    if (confirm(`Are you sure you want to delete tournament "${tourneyTitle}"? This cannot be undone.`)) {
      await deleteTournament(id);
    }
  };

  const handleToggleRegistration = async (t: Tournament) => {
    const nextStatus: TournamentStatus =
      t.status === 'REGISTRATION_OPEN' ? 'REGISTRATION_CLOSED' : 'REGISTRATION_OPEN';
    await updateTournament(t.id, { status: nextStatus });
  };

  const handleOpenRoomModal = async (t: Tournament) => {
    setRoomModalTourney(t);
    const existingCreds = await getTournamentRoomCredentials(t.id);
    setRoomIdInput(existingCreds?.roomId || t.roomId || '');
    setRoomPassInput(existingCreds?.roomPassword || t.roomPassword || '');
    setRoomInstructions(
      existingCreds?.instructions || 'Join Free Fire Custom room 10 minutes before start time.'
    );
  };

  const handleSaveRoomCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomModalTourney) return;
    setIsPublishingRoom(true);
    try {
      await publishRoomCredentials(
        roomModalTourney.id,
        roomIdInput.trim(),
        roomPassInput.trim(),
        roomInstructions.trim(),
        roomModalTourney.matchTime
      );
      setRoomModalTourney(null);
      alert('Room ID and Password successfully published to verified players!');
    } catch (err) {
      console.error('Error saving room credentials:', err);
      alert('Failed to save room credentials.');
    } finally {
      setIsPublishingRoom(false);
    }
  };

  const filteredTournaments = tournaments.filter((t) => {
    if (filterMode === 'ALL') return true;
    return t.mode === filterMode;
  });

  return (
    <div className="space-y-5 pb-28 px-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-2xl font-black font-heading tracking-wide text-white flex items-center space-x-2">
            <span>TOURNAMENT</span>
            <span className="text-red-500">CONTROL</span>
          </h2>
          <p className="text-xs text-zinc-400">Create, edit, and publish custom rooms</p>
        </div>

        <button
          onClick={onOpenCreate}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE</span>
        </button>
      </div>

      {/* Mode Filters */}
      <div className="grid grid-cols-4 gap-2">
        {(['ALL', 'SOLO', 'DUO', 'SQUAD'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setFilterMode(m)}
            className={`py-2 rounded-xl text-xs font-heading font-extrabold tracking-wider transition-all border ${
              filterMode === m
                ? 'bg-red-600 text-white border-red-500 shadow-md scale-[1.02]'
                : 'bg-zinc-900 text-zinc-400 border-white/5 hover:text-white'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Tournament Cards List */}
      <div className="space-y-4">
        {filteredTournaments.length === 0 ? (
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-10 text-center text-zinc-500 text-xs space-y-2">
            <Trophy className="w-8 h-8 mx-auto text-zinc-600" />
            <p>No tournaments in this category. Tap "CREATE" to add one.</p>
          </div>
        ) : (
          filteredTournaments.map((t) => (
            <div
              key={t.id}
              className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 space-y-3.5 shadow-md relative"
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-red-600/30 border border-red-500/50 text-red-400 text-[10px] font-black uppercase">
                      {t.mode}
                    </span>
                    <span className="text-[11px] text-zinc-400 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span>{t.map}</span>
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        t.status === 'REGISTRATION_OPEN'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : t.status === 'LIVE'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-base text-white line-clamp-1">
                    {t.title}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-zinc-400 block">Prize</span>
                  <span className="font-mono font-black text-amber-400 text-base">
                    {t.prizePool} PKR
                  </span>
                </div>
              </div>

              {/* Pricing & Slots Info */}
              <div className="grid grid-cols-3 gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5 text-center text-xs">
                <div>
                  <span className="text-[9px] text-zinc-500 block uppercase">Entry Fee</span>
                  <span className="font-mono font-bold text-white">{t.entryFee} PKR</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 block uppercase">Slots</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {t.filledSlots} / {t.totalSlots}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 block uppercase">Schedule</span>
                  <span className="font-bold text-zinc-300 text-[11px] truncate block">
                    {t.matchTime}
                  </span>
                </div>
              </div>

              {/* Room ID publishing status */}
              <div className="p-2.5 bg-black/30 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span className="text-zinc-300">
                    Room ID:{' '}
                    {t.roomId ? (
                      <strong className="text-white font-mono">{t.roomId}</strong>
                    ) : (
                      <span className="text-zinc-500 italic">Not set</span>
                    )}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenRoomModal(t)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-[11px] font-bold transition-colors"
                >
                  Manage Room ID
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => handleToggleRegistration(t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    t.status === 'REGISTRATION_OPEN'
                      ? 'bg-zinc-800 text-amber-400 hover:bg-zinc-700'
                      : 'bg-emerald-600/30 text-emerald-400 hover:bg-emerald-600/40'
                  }`}
                >
                  {t.status === 'REGISTRATION_OPEN' ? 'Close Reg' : 'Open Reg'}
                </button>

                <button
                  onClick={() => setEditingTourney({ ...t })}
                  className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
                  title="Edit Tournament"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(t.id, t.title)}
                  className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-red-400"
                  title="Delete Tournament"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE NEW TOURNAMENT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4">
          <div className="bg-[#101319] border border-white/10 w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl relative text-zinc-200">
            <div className="sticky top-0 bg-[#101319]/95 backdrop-blur-md px-5 py-3.5 border-b border-white/10 flex items-center justify-between z-10">
              <h3 className="font-heading font-black text-white text-base">
                CREATE NEW TOURNAMENT
              </h3>
              <button
                onClick={onCloseCreate}
                className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Tournament Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. BERMUDA SUPREME CLASH"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white font-heading font-bold"
                />
              </div>

              {/* Game Mode */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Game Mode *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['SOLO', 'DUO', 'SQUAD'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleModeChange(m)}
                      className={`py-2 rounded-xl font-heading font-extrabold text-xs transition-all border ${
                        mode === m
                          ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                          : 'bg-zinc-900 text-zinc-400 border-white/5'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Prices loaded from Firestore app_settings */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Entry Fee (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={entryFee}
                    onChange={(e) => setEntryFee(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Prize Pool (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={prizePool}
                    onChange={(e) => setPrizePool(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Prize distribution breakdown */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-zinc-400 text-[10px] mb-1">1st Prize (PKR)</label>
                  <input
                    type="number"
                    value={firstPrize}
                    onChange={(e) => setFirstPrize(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-2 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-[10px] mb-1">2nd Prize (PKR)</label>
                  <input
                    type="number"
                    value={secondPrize}
                    onChange={(e) => setSecondPrize(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-2 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-[10px] mb-1">3rd Prize (PKR)</label>
                  <input
                    type="number"
                    value={thirdPrize}
                    onChange={(e) => setThirdPrize(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-2 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              {/* Map and Slots */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Map *</label>
                  <select
                    value={map}
                    onChange={(e) => setMap(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Bermuda">Bermuda</option>
                    <option value="Purgatory">Purgatory</option>
                    <option value="Kalahari">Kalahari</option>
                    <option value="Alpine">Alpine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Total Slots *</label>
                  <input
                    type="number"
                    required
                    min={2}
                    value={totalSlots}
                    onChange={(e) => setTotalSlots(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Match Date *</label>
                  <input
                    type="text"
                    required
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    placeholder="e.g. Tonight or Nov 12"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Match Time *</label>
                  <input
                    type="text"
                    required
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    placeholder="08:00 PM PKT"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Room ID and Password (Optional initial) */}
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 block">
                  Custom Match Room (Optional - can be published later)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={initialRoomId}
                    onChange={(e) => setInitialRoomId(e.target.value)}
                    placeholder="Free Fire Room ID"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-mono"
                  />
                  <input
                    type="text"
                    value={initialRoomPassword}
                    onChange={(e) => setInitialRoomPassword(e.target.value)}
                    placeholder="Room Password"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingNew}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-black font-extrabold uppercase tracking-wider text-xs shadow-lg active:scale-95 transition-all"
              >
                {isSubmittingNew ? 'Creating Tournament...' : 'PUBLISH TOURNAMENT TO USER APP'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ROOM ID PUBLISH MODAL */}
      {roomModalTourney && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#12151c] border border-amber-500/40 w-full max-w-sm rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-heading font-black text-amber-400 text-base flex items-center space-x-1.5">
                <KeyRound className="w-5 h-5 text-amber-500" />
                <span>PUBLISH MATCH ROOM</span>
              </h4>
              <button
                onClick={() => setRoomModalTourney(null)}
                className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRoomCredentials} className="space-y-3 text-xs">
              <p className="text-zinc-300">
                Publishing Room ID will unlock credentials for all <strong>APPROVED</strong> players registered for{' '}
                <strong className="text-white">{roomModalTourney.title}</strong>.
              </p>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Free Fire Room ID *</label>
                <input
                  type="text"
                  required
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value)}
                  placeholder="e.g. 198472918"
                  className="w-full bg-zinc-900 border border-amber-500/50 rounded-xl px-3 py-2 text-white font-mono text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Room Password *</label>
                <input
                  type="text"
                  required
                  value={roomPassInput}
                  onChange={(e) => setRoomPassInput(e.target.value)}
                  placeholder="e.g. 1234"
                  className="w-full bg-zinc-900 border border-amber-500/50 rounded-xl px-3 py-2 text-white font-mono text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Instructions for Players</label>
                <textarea
                  rows={2}
                  value={roomInstructions}
                  onChange={(e) => setRoomInstructions(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-white text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRoomModalTourney(null)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishingRoom}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold uppercase shadow-lg shadow-amber-500/30"
                >
                  {isPublishingRoom ? 'Publishing...' : 'BROADCAST ROOM'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TOURNAMENT MODAL */}
      {editingTourney && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#101319] border border-white/15 w-full max-w-sm rounded-2xl p-5 space-y-3.5 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="font-heading font-black text-white text-base">EDIT TOURNAMENT</h4>
              <button
                onClick={() => setEditingTourney(null)}
                className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingTourney.title}
                  onChange={(e) => setEditingTourney({ ...editingTourney, title: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">Entry Fee (PKR)</label>
                  <input
                    type="number"
                    value={editingTourney.entryFee}
                    onChange={(e) =>
                      setEditingTourney({ ...editingTourney, entryFee: Number(e.target.value) })
                    }
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Prize Pool (PKR)</label>
                  <input
                    type="number"
                    value={editingTourney.prizePool}
                    onChange={(e) =>
                      setEditingTourney({ ...editingTourney, prizePool: Number(e.target.value) })
                    }
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">Match Date</label>
                  <input
                    type="text"
                    value={editingTourney.matchDate}
                    onChange={(e) =>
                      setEditingTourney({ ...editingTourney, matchDate: e.target.value })
                    }
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Match Time</label>
                  <input
                    type="text"
                    value={editingTourney.matchTime}
                    onChange={(e) =>
                      setEditingTourney({ ...editingTourney, matchTime: e.target.value })
                    }
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Status</label>
                <select
                  value={editingTourney.status}
                  onChange={(e) =>
                    setEditingTourney({
                      ...editingTourney,
                      status: e.target.value as TournamentStatus
                    })
                  }
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                >
                  <option value="REGISTRATION_OPEN">REGISTRATION_OPEN</option>
                  <option value="REGISTRATION_CLOSED">REGISTRATION_CLOSED</option>
                  <option value="LIVE">LIVE</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-black font-extrabold uppercase tracking-wider text-xs"
              >
                SAVE CHANGES
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
