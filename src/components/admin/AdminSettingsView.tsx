import React, { useState } from 'react';
import {
  Sliders,
  DollarSign,
  Phone,
  CreditCard,
  Shield,
  Save,
  CheckCircle2,
  Trophy,
  Bell,
  BarChart3,
  Award,
  Download,
  AlertTriangle,
  Flame,
  Radio
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { ADMIN_BRAND } from '../../assets/branding';

interface AdminSettingsViewProps {
  onOpenWinnersModal: () => void;
  onOpenAnnounceModal: () => void;
  onOpenApkModal: () => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  onOpenWinnersModal,
  onOpenAnnounceModal,
  onOpenApkModal
}) => {
  const { appSettings, updateAppSettings, payments, tournaments, prizeDistributions } = useAdminData();

  // Form states initialized with live appSettings
  const [easyPaisaNumber, setEasyPaisaNumber] = useState(
    appSettings.easyPaisaNumber || ADMIN_BRAND.defaultEasyPaisaNumber
  );
  const [easyPaisaName, setEasyPaisaName] = useState(
    appSettings.easyPaisaName || ADMIN_BRAND.defaultEasyPaisaName
  );
  const [whatsappSupport, setWhatsappSupport] = useState(
    appSettings.whatsappSupportNumber || ADMIN_BRAND.defaultWhatsappSupport
  );
  const [minDeposit, setMinDeposit] = useState<number>(appSettings.minDeposit || 200);

  // Pricing
  const [soloFee, setSoloFee] = useState<number>(appSettings.defaultSoloFee || 100);
  const [soloPrize, setSoloPrize] = useState<number>(appSettings.defaultSoloPrize || 500);

  const [duoFee, setDuoFee] = useState<number>(appSettings.defaultDuoFee || 200);
  const [duoPrize, setDuoPrize] = useState<number>(appSettings.defaultDuoPrize || 1000);

  const [squadFee, setSquadFee] = useState<number>(appSettings.defaultSquadFee || 400);
  const [squadPrize, setSquadPrize] = useState<number>(appSettings.defaultSquadPrize || 2000);

  // Maintenance & Policies
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(
    Boolean(appSettings.maintenanceMode)
  );
  const [rulesText, setRulesText] = useState(
    appSettings.tournamentRulesText ||
      '1. Strictly physical mobile devices only (No PC Emulators).\n2. Room ID is released 15 minutes before match start.\n3. Zero tolerance for cheats or teaming.'
  );
  const [refundText, setRefundText] = useState(
    appSettings.refundPolicyText ||
      'If tournament is cancelled by admin, 100% of entry fees are refunded via EasyPaisa within 2 hours.'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Earnings calculations
  const approvedPayments = payments.filter((p) => p.status === 'APPROVED');
  const totalRevenue = approvedPayments.reduce((acc, p) => acc + (p.amountPaid || 0), 0);
  const totalPrizePaid = prizeDistributions.reduce((acc, p) => acc + (p.prizeAmount || 0), 0);
  const netProfit = totalRevenue - totalPrizePaid;

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateAppSettings({
        easyPaisaNumber: easyPaisaNumber.trim(),
        easyPaisaName: easyPaisaName.trim(),
        whatsappSupportNumber: whatsappSupport.trim(),
        minDeposit: Number(minDeposit),
        defaultSoloFee: Number(soloFee),
        defaultSoloPrize: Number(soloPrize),
        defaultDuoFee: Number(duoFee),
        defaultDuoPrize: Number(duoPrize),
        defaultSquadFee: Number(squadFee),
        defaultSquadPrize: Number(squadPrize),
        maintenanceMode,
        tournamentRulesText: rulesText,
        refundPolicyText: refundText
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-28 px-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-2xl font-black font-heading tracking-wide text-white flex items-center space-x-2">
            <span>APP SETTINGS &</span>
            <span className="text-red-500">PRICING</span>
          </h2>
          <p className="text-xs text-zinc-400">Controls live User App pricing, payments, & rules</p>
        </div>
      </div>

      {/* Quick Launchers: Winners, Broadcast, APK */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <button
          onClick={onOpenWinnersModal}
          className="p-3 rounded-2xl bg-zinc-900 border border-amber-500/30 hover:border-amber-500/60 transition-all flex flex-col items-center justify-center space-y-1 active:scale-95 shadow-md"
        >
          <Award className="w-5 h-5 text-amber-400" />
          <span className="font-heading font-black text-white text-[11px]">WINNERS</span>
          <span className="text-[9px] text-zinc-500">Publish Results</span>
        </button>

        <button
          onClick={onOpenAnnounceModal}
          className="p-3 rounded-2xl bg-zinc-900 border border-red-500/30 hover:border-red-500/60 transition-all flex flex-col items-center justify-center space-y-1 active:scale-95 shadow-md"
        >
          <Bell className="w-5 h-5 text-red-400" />
          <span className="font-heading font-black text-white text-[11px]">BROADCAST</span>
          <span className="text-[9px] text-zinc-500">Announcements</span>
        </button>

        <button
          onClick={onOpenApkModal}
          className="p-3 rounded-2xl bg-zinc-900 border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex flex-col items-center justify-center space-y-1 active:scale-95 shadow-md"
        >
          <Download className="w-5 h-5 text-emerald-400" />
          <span className="font-heading font-black text-white text-[11px]">ADMIN APK</span>
          <span className="text-[9px] text-zinc-500">Download App</span>
        </button>
      </div>

      {/* Financial Reports Summary Card */}
      <div className="bg-gradient-to-r from-zinc-900 to-[#141822] border border-white/10 rounded-2xl p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider">
              FINANCIAL OVERVIEW (REAL-TIME)
            </h4>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">From EasyPaisa</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[9px] uppercase text-zinc-400 block">Total Revenue</span>
            <span className="font-mono font-black text-emerald-400 text-sm">
              {totalRevenue} PKR
            </span>
          </div>

          <div className="p-2 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[9px] uppercase text-zinc-400 block">Prizes Paid</span>
            <span className="font-mono font-black text-amber-400 text-sm">
              {totalPrizePaid} PKR
            </span>
          </div>

          <div className="p-2 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[9px] uppercase text-zinc-400 block">Net Profit</span>
            <span className="font-mono font-black text-white text-sm">
              {netProfit} PKR
            </span>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
        {/* EasyPaisa Merchant Configuration */}
        <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-2xl p-4 space-y-3 shadow-md">
          <div className="flex items-center space-x-2 text-emerald-400 font-heading font-bold uppercase tracking-wider text-xs">
            <CreditCard className="w-4 h-4" />
            <span>Official EasyPaisa Account (User App Target)</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">EasyPaisa Number *</label>
              <input
                type="text"
                required
                value={easyPaisaNumber}
                onChange={(e) => setEasyPaisaNumber(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Account Title *</label>
              <input
                type="text"
                required
                value={easyPaisaName}
                onChange={(e) => setEasyPaisaName(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">WhatsApp Support *</label>
              <input
                type="text"
                required
                value={whatsappSupport}
                onChange={(e) => setWhatsappSupport(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Min Deposit (PKR)</label>
              <input
                type="number"
                min={50}
                value={minDeposit}
                onChange={(e) => setMinDeposit(Number(e.target.value))}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Pricing Configuration (Controls Default Tournament Fees) */}
        <div className="bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-4 space-y-3 shadow-md">
          <div className="flex items-center space-x-2 text-amber-400 font-heading font-bold uppercase tracking-wider text-xs">
            <DollarSign className="w-4 h-4" />
            <span>Dynamic Pricing Control (SOLO / DUO / SQUAD)</span>
          </div>

          {/* SOLO */}
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
            <span className="font-heading font-bold text-amber-400 text-xs block">
              SOLO TOURNAMENTS
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-400 text-[10px]">Entry Fee (PKR)</label>
                <input
                  type="number"
                  value={soloFee}
                  onChange={(e) => setSoloFee(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-[10px]">Prize Pool (PKR)</label>
                <input
                  type="number"
                  value={soloPrize}
                  onChange={(e) => setSoloPrize(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-amber-400 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* DUO */}
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
            <span className="font-heading font-bold text-amber-400 text-xs block">
              DUO TOURNAMENTS
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-400 text-[10px]">Entry Fee (PKR)</label>
                <input
                  type="number"
                  value={duoFee}
                  onChange={(e) => setDuoFee(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-[10px]">Prize Pool (PKR)</label>
                <input
                  type="number"
                  value={duoPrize}
                  onChange={(e) => setDuoPrize(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-amber-400 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* SQUAD */}
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
            <span className="font-heading font-bold text-amber-400 text-xs block">
              SQUAD TOURNAMENTS
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-400 text-[10px]">Entry Fee (PKR)</label>
                <input
                  type="number"
                  value={squadFee}
                  onChange={(e) => setSquadFee(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-[10px]">Prize Pool (PKR)</label>
                <input
                  type="number"
                  value={squadPrize}
                  onChange={(e) => setSquadPrize(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-amber-400 font-mono font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Mode & Texts */}
        <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-heading font-bold text-white text-xs block">
                User App Maintenance Mode
              </span>
              <p className="text-[10px] text-zinc-400">
                Show maintenance banner to public user app visitors
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 ${
                maintenanceMode ? 'bg-red-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  maintenanceMode ? 'transform translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Tournament Rules Text</label>
            <textarea
              rows={2}
              value={rulesText}
              onChange={(e) => setRulesText(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Refund Policy Text</label>
            <textarea
              rows={2}
              value={refundText}
              onChange={(e) => setRefundText(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white text-xs"
            />
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-center text-xs flex items-center justify-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Settings saved successfully! User App will update instantly.</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-black font-extrabold uppercase tracking-wider text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'SAVING TO FIRESTORE...' : 'SAVE ALL SETTINGS TO FIRESTORE'}</span>
        </button>
      </form>
    </div>
  );
};
