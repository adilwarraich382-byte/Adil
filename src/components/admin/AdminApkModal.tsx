import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  ArrowDownToLine,
  Flame,
  KeyRound
} from 'lucide-react';
import { ADMIN_BRAND } from '../../assets/branding';

interface AdminApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminApkModal: React.FC<AdminApkModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  if (!isOpen) return null;

  const handleDownloadAdminApk = () => {
    setDownloading(true);
    setDownloadSuccess(false);

    const link = document.createElement('a');
    link.href = '/adilesports-admin-v1.0.apk';
    link.download = 'ADIL_ESPORTS_ADMIN_v1.0.apk';
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
      setDeferredPrompt(null);
    } else {
      alert('On Android: Tap the 3 dots (⋮) in Chrome and choose "Install app" or "Add to Home screen" to install ADIL ESPORTS ADMIN!');
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4">
      <div className="bg-[#101319] border border-white/10 w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl relative text-zinc-200">
        <div className="sticky top-0 bg-[#101319]/95 backdrop-blur-md px-5 py-3.5 border-b border-white/10 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-emerald-400" />
            <h3 className="font-heading font-black text-white text-base">
              DOWNLOAD ADMIN APK
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs">
          {/* Admin App Card */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#1c1417] to-[#0e1014] border border-red-500/30 p-4 text-center space-y-3 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 via-orange-500 to-amber-500 p-0.5 mx-auto shadow-lg shadow-red-600/30">
              <div className="w-full h-full bg-[#0d0f12] rounded-[14px] overflow-hidden flex items-center justify-center">
                <img
                  src={ADMIN_BRAND.logo}
                  alt={ADMIN_BRAND.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-[10px] font-black text-red-400 uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                <span>OFFICIAL ADMIN APK v1.0.0</span>
              </div>
              <h4 className="font-heading font-black text-lg text-white mt-1">
                ADIL ESPORTS ADMIN
              </h4>
              <p className="text-[11px] font-mono text-zinc-400">
                Package: <code className="text-amber-400">{ADMIN_BRAND.packageName}</code>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-black/40 p-2 rounded-xl border border-white/5 text-[11px]">
              <div>
                <span className="text-[9px] text-zinc-400 block uppercase">OS Target</span>
                <span className="font-bold text-white">Android 7.0+</span>
              </div>
              <div>
                <span className="text-[9px] text-zinc-400 block uppercase">Permissions</span>
                <span className="font-bold text-amber-400">Super Admin</span>
              </div>
              <div>
                <span className="text-[9px] text-zinc-400 block uppercase">Package Size</span>
                <span className="font-mono font-bold text-emerald-400">24.2 MB</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleDownloadAdminApk}
              disabled={downloading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-black font-extrabold text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              {downloading ? (
                <span>STARTING DOWNLOAD...</span>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-black" />
                  <span>DOWNLOAD STARTED!</span>
                </>
              ) : (
                <>
                  <ArrowDownToLine className="w-5 h-5" />
                  <span>DIRECT DOWNLOAD ADMIN APK</span>
                </>
              )}
            </button>

            <button
              onClick={handleInstallPwa}
              className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-white/10 text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>INSTALL TO ANDROID HOME SCREEN</span>
            </button>
          </div>

          {/* Capacitor Native APK Generation commands */}
          <div className="bg-black/80 rounded-xl p-3 border border-white/10 font-mono text-[11px] space-y-2">
            <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-white/5">
              <span>Capacitor Android Build Steps</span>
              <button
                type="button"
                onClick={() =>
                  copyCode(
                    `npm run build\nnpx cap init "ADIL ESPORTS ADMIN" com.adilesports.adminapp --web-dir dist\nnpx cap add android\nnpx cap open android`,
                    'cap'
                  )
                }
                className="text-[10px] text-amber-400 hover:text-white"
              >
                {copiedCode === 'cap' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="text-emerald-400 overflow-x-auto">
{`npm run build
npx cap init "ADIL ESPORTS ADMIN" com.adilesports.adminapp --web-dir dist
npx cap add android
npx cap open android`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
