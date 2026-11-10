import React, { useEffect, useState } from 'react';
import { ShieldAlert, KeyRound, Flame } from 'lucide-react';
import { ADMIN_BRAND } from '../../assets/branding';

interface AdminSplashScreenProps {
  onFinish: () => void;
}

export const AdminSplashScreen: React.FC<AdminSplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(20);
  const [statusText, setStatusText] = useState('Authenticating Admin Gateway...');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(55);
      setStatusText('Syncing Live EasyPaisa Payments...');
    }, 400);

    const t2 = setTimeout(() => {
      setProgress(88);
      setStatusText('Securing Custom Room Decryption Keys...');
    }, 850);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Command Center Ready!');
    }, 1300);

    const tFinish = setTimeout(() => {
      onFinish();
    }, 1650);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tFinish);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-[#06070a] flex flex-col items-center justify-between p-6 select-none overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-red-600/25 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-500/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Tag */}
      <div className="w-full flex items-center justify-center pt-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-400 text-xs font-black tracking-widest uppercase shadow-lg shadow-red-950/40">
          <ShieldAlert className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span>ADMINISTRATION CONSOLE</span>
        </div>
      </div>

      {/* Center Logo & Branding */}
      <div className="flex flex-col items-center justify-center text-center my-auto">
        <div className="relative mb-6">
          <div className="w-36 h-36 rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 shadow-[0_0_50px_rgba(239,68,68,0.4)] animate-pulse">
            <div className="w-full h-full bg-[#0d0f12] rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={ADMIN_BRAND.logo}
                alt={ADMIN_BRAND.name}
                className="w-full h-full object-cover transform scale-105"
              />
            </div>
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-black/90 border border-red-500/60 rounded-full text-[10px] font-black text-red-400 tracking-widest uppercase">
            RESTRICTED
          </div>
        </div>

        <h1 className="text-4xl font-extrabold tracking-wider text-white font-heading mt-2">
          ADIL <span className="text-red-500">ADMIN</span>
        </h1>

        <div className="flex items-center space-x-2 mt-2">
          <span className="w-6 h-0.5 bg-gradient-to-r from-transparent to-red-500" />
          <p className="text-sm font-black tracking-[0.25em] text-zinc-300 font-heading">
            {ADMIN_BRAND.slogan}
          </p>
          <span className="w-6 h-0.5 bg-gradient-to-l from-transparent to-red-500" />
        </div>

        <p className="text-xs text-zinc-400 mt-2 max-w-[260px]">
          Free Fire Tournament Control & EasyPaisa Verification System
        </p>
      </div>

      {/* Bottom Progress */}
      <div className="w-full max-w-xs flex flex-col items-center pb-8 space-y-3">
        <div className="w-full bg-zinc-900/80 rounded-full h-2 p-0.5 border border-white/10 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 rounded-full transition-all duration-300 shadow-[0_0_10px_#ef4444]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between w-full text-[11px] text-zinc-400">
          <span className="truncate pr-2">{statusText}</span>
          <span className="font-mono text-red-400 font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
