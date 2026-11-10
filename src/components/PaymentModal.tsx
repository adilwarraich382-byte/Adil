import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Upload,
  AlertCircle,
  Clock,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  Info,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Tournament } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTournament } from '../context/TournamentContext';

interface PaymentModalProps {
  tournament: Tournament | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  tournament,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { profile } = useAuth();
  const { appSettings, submitTournamentPayment } = useTournament();

  const [copied, setCopied] = useState(false);
  const [senderName, setSenderName] = useState(profile?.fullName || '');
  const [senderPhone, setSenderPhone] = useState(profile?.whatsapp || '');
  const [transactionId, setTransactionId] = useState('');
  const [amountPaid, setAmountPaid] = useState<number>(tournament?.entryFee || 100);
  const [teammateNames, setTeammateNames] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState<string>('');
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [submittedPaymentInfo, setSubmittedPaymentInfo] = useState<{
    trx: string;
    amount: number;
    title: string;
  } | null>(null);

  if (!isOpen || !tournament) return null;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(appSettings.easyPaisaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 5MB. Please choose a smaller screenshot.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setScreenshotBase64(result);
      setScreenshotPreview(result);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!senderName.trim()) {
      setErrorMessage('Please enter your EasyPaisa Account Sender Name.');
      return;
    }
    if (!senderPhone.trim()) {
      setErrorMessage('Please enter your Sender Mobile / EasyPaisa Phone Number.');
      return;
    }
    if (!transactionId.trim()) {
      setErrorMessage('Please enter the EasyPaisa Transaction ID (TRX ID).');
      return;
    }
    if (amountPaid < tournament.entryFee) {
      setErrorMessage(`Payment amount cannot be less than the required Entry Fee (${tournament.entryFee} PKR).`);
      return;
    }
    if ((tournament.mode === 'DUO' || tournament.mode === 'SQUAD') && !teammateNames.trim()) {
      setErrorMessage(`Please provide your teammate names and Free Fire UIDs for ${tournament.mode} mode.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitTournamentPayment({
        tournament,
        senderName,
        senderPhone,
        transactionId: transactionId.trim().toUpperCase(),
        amountPaid: Number(amountPaid),
        screenshotBase64,
        teammateNames: teammateNames.trim()
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to submit payment. Please verify your details.');
        setIsSubmitting(false);
        return;
      }

      // Fire victory confetti on submission
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti non-fatal
      }

      setSubmittedPaymentInfo({
        trx: transactionId.trim().toUpperCase(),
        amount: Number(amountPaid),
        title: tournament.title
      });
      setIsSubmittedSuccess(true);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred while submitting payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishAndClose = () => {
    setIsSubmittedSuccess(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4">
      <div className="bg-[#0f1117] border border-white/10 w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl relative text-zinc-200">
        {/* Header */}
        <div className="sticky top-0 bg-[#0f1117]/95 backdrop-blur-md px-5 py-3 border-b border-white/10 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="font-extrabold text-white font-heading text-lg tracking-wider">
                {isSubmittedSuccess ? 'VERIFICATION PENDING' : 'JOIN TOURNAMENT PAYMENT'}
              </h2>
            </div>
            <p className="text-[10px] text-zinc-400">EasyPaisa Instant Verification Gateway</p>
          </div>
          <button
            onClick={isSubmittedSuccess ? handleFinishAndClose : onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmittedSuccess ? (
          /* SUCCESS / PENDING VERIFICATION SCREEN */
          <div className="p-6 text-center space-y-5">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-full h-full rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center">
                <Clock className="w-10 h-10 text-amber-400 animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-1 shadow-md">
                <Check className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white font-heading">
                Payment Submitted Successfully!
              </h3>
              <p className="text-xs text-amber-400 font-semibold mt-1">
                STATUS: PENDING ADMIN VERIFICATION
              </p>
              <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto leading-relaxed">
                Thank you, gamer! Your EasyPaisa payment for{' '}
                <span className="text-white font-bold">{submittedPaymentInfo?.title}</span> has been securely recorded.
                Our ADIL ESPORTS admin is currently verifying your Transaction ID.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Tournament:</span>
                <span className="text-white font-semibold">{submittedPaymentInfo?.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Transaction ID (TRX):</span>
                <span className="font-mono text-amber-400 font-bold">{submittedPaymentInfo?.trx}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Amount Paid:</span>
                <span className="text-emerald-400 font-bold">{submittedPaymentInfo?.amount} PKR</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Estimated Verification:</span>
                <span className="text-zinc-200">5 - 15 Minutes</span>
              </div>
            </div>

            {/* Important Notice */}
            <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-left flex items-start space-x-2 text-[11px] text-amber-300">
              <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <p>
                <strong>Room ID & Password Release:</strong> As soon as the admin verifies your payment, your registration status will change to <span className="text-emerald-400 font-bold">APPROVED</span>, and the Room ID & Password will unlock in the "My Matches" tab 15 minutes before the match start!
              </p>
            </div>

            <button
              onClick={handleFinishAndClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all"
            >
              TRACK IN MY MATCHES
            </button>
          </div>
        ) : (
          /* PAYMENT FORM */
          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {/* Tournament & Fee Summary Card */}
            <div className="bg-gradient-to-r from-zinc-900 to-[#161a22] border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  {tournament.mode} MATCH • {tournament.map}
                </span>
                <h3 className="font-bold text-white text-sm line-clamp-1">
                  {tournament.title}
                </h3>
                <p className="text-[11px] text-zinc-400">
                  {tournament.matchDate} at {tournament.matchTime}
                </p>
              </div>
              <div className="text-right shrink-0 pl-3">
                <span className="text-[10px] text-zinc-400 block uppercase">Entry Fee</span>
                <span className="text-xl font-extrabold text-amber-400 font-heading">
                  {tournament.entryFee} PKR
                </span>
              </div>
            </div>

            {/* EasyPaisa Account Box */}
            <div className="bg-[#121c17] border border-emerald-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    EP
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                      Official EasyPaisa Account
                    </h4>
                    <p className="text-[10px] text-emerald-400 font-medium">Verified Merchant</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-zinc-300">
                  {appSettings.easyPaisaName}
                </span>
              </div>

              {/* Number and Copy Button */}
              <div className="flex items-center justify-between bg-black/60 border border-emerald-500/40 rounded-xl px-3 py-2.5">
                <div>
                  <span className="text-[9px] text-zinc-400 block uppercase">Send Payment To:</span>
                  <span className="font-mono text-base font-extrabold text-emerald-400 tracking-wider">
                    {appSettings.easyPaisaNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs active:scale-95 transition-all shadow-sm shadow-emerald-500/30"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY NUMBER</span>
                    </>
                  )}
                </button>
              </div>

              {/* Step instructions */}
              <div className="text-[11px] text-zinc-300 space-y-1 pt-1">
                <p className="flex items-center space-x-1">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Open EasyPaisa App & select <strong>Send Money</strong>.</span>
                </p>
                <p className="flex items-center space-x-1">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Enter <strong>{appSettings.easyPaisaNumber}</strong> & transfer exact <strong>{tournament.entryFee} PKR</strong>.</span>
                </p>
                <p className="flex items-center space-x-1">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>Copy the 11-digit <strong>TRX ID</strong> from the SMS / receipt and paste below.</span>
                </p>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl flex items-start space-x-2 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Sender Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Your EasyPaisa Title"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Sender Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="03001234567"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  EasyPaisa Transaction ID (TRX ID) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                    placeholder="e.g. 19847291823 or 29481726"
                    className="w-full font-mono font-bold tracking-wider bg-zinc-900 border border-amber-500/40 rounded-xl px-3 py-2.5 text-xs text-amber-400 placeholder-zinc-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 uppercase"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] text-zinc-500 font-sans">
                    Checked for duplicates
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Check your 3737 EasyPaisa confirmation SMS for this ID.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Payment Amount (PKR) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={tournament.entryFee}
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    className="w-full font-mono bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="absolute right-3 top-2 text-xs text-zinc-400 font-bold">
                    PKR
                  </span>
                </div>
              </div>

              {/* Duo / Squad Teammates */}
              {(tournament.mode === 'DUO' || tournament.mode === 'SQUAD') && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    {tournament.mode === 'DUO' ? 'Teammate Free Fire IGN & UID *' : 'Squad Members (IGN & UIDs) *'}
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={teammateNames}
                    onChange={(e) => setTeammateNames(e.target.value)}
                    placeholder={
                      tournament.mode === 'DUO'
                        ? 'Player 2: IGN, Free Fire UID'
                        : 'Player 2: IGN & UID\nPlayer 3: IGN & UID\nPlayer 4: IGN & UID'
                    }
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {/* Payment Screenshot Upload */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Upload Payment Screenshot (Receipt)
                </label>
                <div className="relative border border-dashed border-white/20 hover:border-amber-500/50 rounded-xl p-3 text-center transition-colors bg-zinc-900/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {screenshotPreview ? (
                    <div className="flex items-center space-x-3">
                      <img
                        src={screenshotPreview}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded-lg border border-white/10"
                      />
                      <div className="text-left text-xs">
                        <span className="text-emerald-400 font-semibold block">Screenshot Attached</span>
                        <span className="text-[10px] text-zinc-400">Click to change receipt</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 py-1 text-zinc-400 text-xs">
                      <Upload className="w-4 h-4 text-amber-500" />
                      <span>Select EasyPaisa Payment Screenshot (Optional but speeds verification)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-black font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-orange-500/25 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>SUBMIT PAYMENT FOR VERIFICATION</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-zinc-500 mt-2">
                All submissions are encrypted & verified manually by ADIL ESPORTS administrators.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
