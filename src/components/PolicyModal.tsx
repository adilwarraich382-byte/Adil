import React, { useState } from 'react';
import {
  X,
  Shield,
  FileText,
  DollarSign,
  Smartphone,
  CheckCircle,
  Copy,
  Terminal,
  ExternalLink,
  Download
} from 'lucide-react';
import { BRAND } from '../assets/branding';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'rules' | 'terms' | 'privacy' | 'refund' | 'apk';
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'rules'
}) => {
  const [tab, setTab] = useState<'rules' | 'terms' | 'privacy' | 'refund' | 'apk'>(initialTab);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copySnippet = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4">
      <div className="bg-[#10131a] border border-white/10 w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl relative text-zinc-200">
        {/* Header */}
        <div className="sticky top-0 bg-[#10131a]/95 backdrop-blur-md px-5 py-3.5 border-b border-white/10 flex items-center justify-between z-10">
          <h3 className="font-heading font-black text-white text-base tracking-wide uppercase">
            {tab === 'rules'
              ? 'Tournament Rules'
              : tab === 'terms'
              ? 'Terms & Conditions'
              : tab === 'privacy'
              ? 'Privacy Policy'
              : tab === 'refund'
              ? 'Refund Policy'
              : 'Android APK Setup & Install'}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-1.5 p-3 overflow-x-auto no-scrollbar border-b border-white/5 bg-zinc-900/60">
          {[
            { id: 'rules', label: 'Rules' },
            { id: 'refund', label: 'Refund' },
            { id: 'apk', label: 'Android APK' },
            { id: 'terms', label: 'Terms' },
            { id: 'privacy', label: 'Privacy' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`px-3 py-1 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition-all ${
                tab === t.id
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5 text-xs text-zinc-300 leading-relaxed space-y-4">
          {tab === 'rules' && (
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-white text-sm flex items-center space-x-2">
                <Shield className="w-4 h-4 text-red-500" />
                <span>ADIL ESPORTS OFFICIAL TOURNAMENT CODE</span>
              </h4>
              <p>
                To maintain competitive integrity and fair gameplay in all Free Fire matches, all registered players must strictly abide by the following rules:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
                <li><strong>Mobile Only:</strong> Strictly played on physical mobile smartphones (Android or iOS). Emulators (Bluestacks, LDPlayer, Nox), iPads, and modified controllers are banned.</li>
                <li><strong>No Cheats / Hacks:</strong> Any aimbot, speed hack, auto-headshot, wall hack, or game file modification results in permanent hardware ban and forfeiture of entry fee.</li>
                <li><strong>Custom Room Timing:</strong> Room ID and password are released 15 minutes before match start in the "My Matches" tab. Players must enter within 10 minutes.</li>
                <li><strong>Correct Slot Assignment:</strong> You must sit only in your designated team slot or slot number. Refusal to move may result in a kick by the room moderator.</li>
                <li><strong>Teaming Prohibited:</strong> Solo players teaming together or Duo/Squad teams sharing locations will be disqualified immediately.</li>
                <li><strong>Result Verification:</strong> Winners must capture a screenshot of the final scoreboard showing placements and kills to resolve any score discrepancies.</li>
              </ul>
            </div>
          )}

          {tab === 'refund' && (
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-white text-sm flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>OFFICIAL REFUND POLICY</span>
              </h4>
              <p>
                ADIL ESPORTS operates with complete financial transparency via EasyPaisa:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
                <li><strong>Tournament Cancellation:</strong> If a scheduled tournament is cancelled by ADIL ESPORTS due to technical updates or server downtime, 100% of your Entry Fee will be refunded to your EasyPaisa account within 2 hours.</li>
                <li><strong>Payment Rejected:</strong> If your payment submission was rejected due to an incorrect TRX ID or invalid screenshot, you may re-submit the valid transaction proof or request assistance via WhatsApp.</li>
                <li><strong>Player No-Show:</strong> Players who fail to enter the Free Fire custom room before match start time will not be eligible for refund.</li>
                <li><strong>Banned for Cheats:</strong> Any participant caught using emulators or third-party cheats will have their entry fee forfeited to the prize pool.</li>
              </ul>
            </div>
          )}

          {tab === 'apk' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <Smartphone className="w-8 h-8 text-amber-400 shrink-0" />
                <div>
                  <h4 className="font-heading font-bold text-white text-sm">
                    ADIL ESPORTS Android Mobile App
                  </h4>
                  <p className="text-[11px] text-zinc-300">
                    Package Name: <code className="text-amber-400 font-mono">com.adilesports.userapp</code>
                  </p>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-white mb-1">Option 1: Instant Android Install (PWA)</h5>
                <p className="text-[11px] text-zinc-400 mb-2">
                  You can install this app directly onto your Android device without opening Google Play:
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-[11px]">
                  <li>Open this app in <strong>Google Chrome</strong> on your Android phone.</li>
                  <li>Tap the <strong>three dots menu (⋮)</strong> in Chrome.</li>
                  <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>The ADIL ESPORTS logo icon will appear on your phone with fullscreen native gaming experience!</li>
                </ol>
              </div>

              <div>
                <h5 className="font-bold text-white mb-1">Option 2: Standalone Android APK Generation (Capacitor)</h5>
                <p className="text-[11px] text-zinc-400 mb-2">
                  To compile into a standalone release APK file for distribution:
                </p>

                <div className="bg-black/80 rounded-xl p-3 border border-white/10 font-mono text-[11px] space-y-2">
                  <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-white/5">
                    <span className="flex items-center space-x-1">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Terminal Commands</span>
                    </span>
                    <button
                      onClick={() =>
                        copySnippet(
                          `npm run build\nnpx cap init "ADIL ESPORTS" com.adilesports.userapp --web-dir dist\nnpx cap add android\nnpx cap open android`,
                          'cap'
                        )
                      }
                      className="text-[10px] text-amber-400 hover:text-white"
                    >
                      {copiedCode === 'cap' ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                  <pre className="text-emerald-400 overflow-x-auto">
{`# 1. Build optimized web bundle
npm run build

# 2. Add Android native wrapper
npx cap init "ADIL ESPORTS" com.adilesports.userapp --web-dir dist
npx cap add android

# 3. Open in Android Studio & Generate Signed APK
npx cap open android`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {tab === 'terms' && (
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-white text-sm">
                Terms and Conditions
              </h4>
              <p>
                By registering on ADIL ESPORTS, you agree to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-300 text-[11px]">
                <li>Provide accurate personal information including your authentic Free Fire UID and WhatsApp contact.</li>
                <li>Conduct all entry fee transfers exclusively through the verified merchant account: <strong>03456311135 (ADIL ESPORTS)</strong>.</li>
                <li>Accept final tournament placements determined by in-game kill leaderboards and match screenshots.</li>
                <li>Respect fellow competitors and tournament moderators. Hate speech, toxicity, or harassment will lead to account suspension.</li>
              </ul>
            </div>
          )}

          {tab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-white text-sm">
                Privacy Policy
              </h4>
              <p>
                ADIL ESPORTS values your privacy. We collect your Email, WhatsApp number, and Free Fire UID solely for:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-300 text-[11px]">
                <li>Tournament registration and custom room slot assignment.</li>
                <li>EasyPaisa payment verification and prize distributions.</li>
                <li>Sending match room ID and timing notifications.</li>
                <li>Your data is never sold or shared with any third-party marketing services.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
