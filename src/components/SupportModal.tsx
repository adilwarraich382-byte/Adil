import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  DollarSign,
  Shield,
  Clock,
  Phone,
  Mail,
  Copy,
  Check
} from 'lucide-react';
import { useTournament } from '../context/TournamentContext';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const { appSettings } = useTournament();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'How do I register and join a Free Fire tournament?',
      a: 'Browse the Tournaments tab, select SOLO, DUO, or SQUAD, and tap "Join Now". Follow the EasyPaisa payment steps: transfer the required Entry Fee (e.g. 100 PKR) to 03456311135 (ADIL ESPORTS), copy your Transaction ID (TRX ID), enter your Free Fire UID and IGN, and submit. Once verified by our admin, your spot is confirmed!'
    },
    {
      q: 'How does EasyPaisa payment verification work?',
      a: 'When you submit your payment form with the TRX ID and screenshot, your registration enters "PENDING" status. Our ADIL ESPORTS admin manually verifies the TRX ID against our merchant records within 5 to 15 minutes. Once confirmed, status changes to "APPROVED".'
    },
    {
      q: 'When and where will I get the Custom Room ID & Password?',
      a: 'Room credentials remain securely locked until your payment is APPROVED. Exactly 15 minutes before match start time, the Room ID and Password unlock under your match card in the "My Matches" tab. You can 1-tap copy the Room ID and Password directly into Free Fire.'
    },
    {
      q: 'What if my payment is rejected?',
      a: 'If rejected, check the reason listed under "My Matches" (common reasons: incorrect TRX ID, wrong amount, or duplicate submission). You can contact our WhatsApp support at 03456311135 or re-submit with the valid payment proof.'
    },
    {
      q: 'How and when are cash prizes distributed?',
      a: 'Cash prizes are sent directly to the winning player or squad leader’s EasyPaisa number within 30 minutes after the match results and final kill scoreboards are verified by the admin.'
    },
    {
      q: 'Are PC emulators or iPads allowed?',
      a: 'No! All ADIL ESPORTS tournaments are strictly mobile-only (Android & iOS). Emulators (Bluestacks, LDPlayer), iPad/tablet aspect ratios, scripts, headshot hacks, or modified APKs result in an instant permanent ban with zero refund.'
    }
  ];

  const handleCopySupportNumber = () => {
    navigator.clipboard.writeText(appSettings.whatsappSupportNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const rawNumber = appSettings.whatsappSupportNumber.replace(/\D/g, '');
    const url = `https://wa.me/${rawNumber}?text=Assalam%20o%20Alaikum%20ADIL%20ESPORTS%20Admin,%20I%20need%20assistance`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4">
      <div className="bg-[#10131a] border border-white/10 w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl relative text-zinc-200">
        {/* Header */}
        <div className="sticky top-0 bg-[#10131a]/95 backdrop-blur-md px-5 py-3.5 border-b border-white/10 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            <h3 className="font-heading font-black text-white text-base tracking-wide">
              CUSTOMER SUPPORT & FAQS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* WhatsApp Direct Help Card */}
          <div className="bg-gradient-to-r from-emerald-950/60 to-zinc-900 border border-emerald-500/40 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-sm">
                    Direct WhatsApp Support
                  </h4>
                  <p className="text-[11px] text-emerald-400 font-medium">Available 24/7 for tournament queries</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-black/50 p-2.5 rounded-xl border border-white/5 text-xs">
              <span className="font-mono text-zinc-200 font-bold tracking-wider">
                {appSettings.whatsappSupportNumber}
              </span>
              <button
                onClick={handleCopySupportNumber}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 text-[11px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>CHAT ON WHATSAPP NOW</span>
            </button>
          </div>

          {/* EasyPaisa Payment Instructions Reminder */}
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wide">
              <DollarSign className="w-4 h-4" />
              <span>Official EasyPaisa Payment Steps</span>
            </div>
            <ol className="text-xs text-zinc-300 space-y-1.5 pl-4 list-decimal leading-relaxed">
              <li>Open EasyPaisa App & select <strong>Send Money</strong>.</li>
              <li>Enter Merchant Number: <strong>{appSettings.easyPaisaNumber}</strong> ({appSettings.easyPaisaName}).</li>
              <li>Transfer exact tournament Entry Fee.</li>
              <li>Copy the 11-digit <strong>Transaction ID (TRX ID)</strong> from 3737 SMS.</li>
              <li>Submit with screenshot in our Join Tournament modal.</li>
            </ol>
          </div>

          {/* FAQs Accordion */}
          <div className="space-y-2">
            <h4 className="text-xs font-heading font-black text-white uppercase tracking-wider">
              FREQUENTLY ASKED QUESTIONS
            </h4>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-zinc-900/80 border border-white/5 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-3 text-left flex items-center justify-between text-xs font-semibold text-zinc-200"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-500 transform transition-transform ${
                        isOpen ? 'rotate-180 text-amber-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-3 text-[11px] text-zinc-400 leading-relaxed border-t border-white/5 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
