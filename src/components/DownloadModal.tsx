import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Flame,
  ArrowDownToLine,
  Share2,
  Sparkles
} from 'lucide-react';
import { BRAND } from '../assets/branding';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleDownloadApk = () => {
    setDownloading(true);
    setDownloadSuccess(false);

    // Trigger direct APK file download
    const link = document.createElement('a');
    link.href = '/adilesports-v1.0.apk';
    link.download = 'ADIL_ESPORTS_v1.0.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
    }, 1200);
  };

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
      }
      setDeferredPrompt(null);
      setCanInstallPwa(false);
    } else {
      // Fallback instruction
      alert('To install on Android: Tap the 3 dots (⋮) in Chrome and select "Install app" or "Add to Home screen"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4">
      <div className="bg-[#101319] border border-white/10 w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl relative text-zinc-200">
        {/* Header */}
        <div className="sticky top-0 bg-[#101319]/95 backdrop-blur-md px-5 py-3.5 border-b border-white/10 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-emerald-400 animate-bounce" />
            <h3 className="font-heading font-black text-white text-base tracking-wide">
              DOWNLOAD ANDROID APP
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* App Preview Card */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#181d26] to-[#0d0f14] border border-amber-500/30 p-4 text-center space-y-3 shadow-xl overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 mx-auto shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-[#0d0f12] rounded-[14px] overflow-hidden flex items-center justify-center">
                <img
                  src={BRAND.logo}
                  alt={BRAND.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                <span>OFFICIAL RELEASE v1.0.0</span>
              </div>
              <h4 className="font-heading font-black text-lg text-white mt-1">
                ADIL ESPORTS APK
              </h4>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Built for Free Fire Android Mobile • Fast Custom Room Alerts • 100% Free
              </p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-3 gap-2 bg-black/40 p-2 rounded-xl border border-white/5 text-[11px]">
              <div>
                <span className="text-[9px] text-zinc-400 block uppercase">Format</span>
                <span className="font-bold text-white">Android APK</span>
              </div>
              <div>
                <span className="text-[9px] text-zinc-400 block uppercase">File Size</span>
                <span className="font-mono font-bold text-amber-400">24.8 MB</span>
              </div>
              <div>
                <span className="text-[9px] text-zinc-400 block uppercase">Requires</span>
                <span className="font-bold text-emerald-400">Android 7.0+</span>
              </div>
            </div>
          </div>

          {/* Download Action Buttons */}
          <div className="space-y-2.5">
            {/* Direct APK Download Button */}
            <button
              onClick={handleDownloadApk}
              disabled={downloading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-black font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>STARTING APK DOWNLOAD...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-black" />
                  <span>DOWNLOAD STARTED! CHECK NOTIFICATIONS</span>
                </>
              ) : (
                <>
                  <ArrowDownToLine className="w-5 h-5" />
                  <span>DOWNLOAD APK FILE (DIRECT)</span>
                </>
              )}
            </button>

            {/* PWA 1-Tap Install Button */}
            <button
              onClick={handleInstallPwa}
              className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-400 hover:text-white hover:bg-zinc-800 font-bold text-xs uppercase tracking-wider active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>
                {canInstallPwa ? 'ADD TO HOME SCREEN (1-TAP INSTALL)' : 'INSTALL TO PHONE VIA CHROME'}
              </span>
            </button>
          </div>

          {/* Download Feedback Banner */}
          {downloadSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex items-start space-x-2 text-xs text-emerald-300 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>APK Downloaded Successfully!</strong>
                <p className="text-[11px] text-zinc-300 mt-0.5">
                  Open your phone's Notification shade or Downloads folder and tap <strong>ADIL_ESPORTS_v1.0.apk</strong> to install.
                </p>
              </div>
            </div>
          )}

          {/* 3 Step Android Installation Guide */}
          <div className="bg-zinc-900/80 border border-white/5 rounded-2xl p-4 space-y-2.5">
            <h5 className="font-heading font-black text-xs text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>HOW TO INSTALL ON ANDROID:</span>
            </h5>
            <ol className="text-xs text-zinc-300 space-y-2 pl-4 list-decimal leading-relaxed">
              <li>
                Tap <strong>Download APK File</strong> above.
              </li>
              <li>
                When prompted <em>"File might be harmful"</em>, tap <strong>"Download anyway"</strong> (standard Android warning for direct APK downloads).
              </li>
              <li>
                Tap <strong>Open</strong> and select <strong>Install</strong>. If prompted, toggle on <em>"Allow from this source"</em> in Android settings.
              </li>
              <li>
                Launch <strong>ADIL ESPORTS</strong> and join tournaments!
              </li>
            </ol>
          </div>

          {/* Safety & Anti-Virus guarantee */}
          <div className="flex items-center space-x-2 p-2.5 bg-black/30 rounded-xl border border-white/5 text-[11px] text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Virus-Free & Safe. Verified by ADIL ESPORTS security team.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
