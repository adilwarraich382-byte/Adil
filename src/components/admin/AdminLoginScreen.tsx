import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ShieldAlert,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ADMIN_BRAND } from '../../assets/branding';

interface AdminLoginScreenProps {
  onSwitchToUserApp?: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onSwitchToUserApp }) => {
  const { loginAdmin, createInitialAdminAccount, resetAdminPassword } = useAdminAuth();

  const [email, setEmail] = useState(ADMIN_BRAND.defaultAdminEmail);
  const [password, setPassword] = useState('');
  const [isForgot, setIsForgot] = useState(false);
  const [isSetupInitial, setIsSetupInitial] = useState(false);
  const [adminName, setAdminName] = useState('Adil Warraich');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isForgot) {
        if (!email) throw new Error('Please enter admin email address.');
        await resetAdminPassword(email);
        setSuccess('Password reset link sent to admin email. Please check your inbox.');
      } else if (isSetupInitial) {
        if (!email || !password || !adminName) {
          throw new Error('Please fill in all fields to provision the master admin.');
        }
        await createInitialAdminAccount(email, password, adminName);
        setSuccess('Admin account created successfully! Signing in...');
      } else {
        if (!email || !password) {
          throw new Error('Please enter admin email and password.');
        }
        await loginAdmin(email, password);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        setError('Invalid admin credentials. Please verify your password.');
      } else if (msg.includes('auth/user-not-found')) {
        setError('No account found for this email. Tap "First Time Admin Setup" below to provision.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080b] flex flex-col items-center justify-center p-4 selection:bg-amber-500 selection:text-black">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-red-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm bg-[#101319] border border-red-500/30 rounded-3xl p-6 shadow-2xl relative space-y-5">
        {/* Glowing Badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-500/40 text-[10px] font-black text-red-400 uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>RESTRICTED ACCESS</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">v1.0.0 PROD</span>
        </div>

        {/* Center Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 p-0.5 mx-auto shadow-lg shadow-orange-500/30 animate-pulse">
            <div className="w-full h-full bg-[#0d0f12] rounded-[14px] overflow-hidden flex items-center justify-center">
              <img
                src={ADMIN_BRAND.logo}
                alt={ADMIN_BRAND.name}
                className="w-full h-full object-cover transform scale-105"
              />
            </div>
          </div>

          <h1 className="text-2xl font-black font-heading tracking-wide text-white">
            ADIL <span className="text-amber-500">ADMIN</span>
          </h1>
          <p className="text-[11px] font-extrabold tracking-widest text-zinc-400 uppercase font-heading">
            {ADMIN_BRAND.slogan}
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl flex items-start space-x-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex items-start space-x-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          {isSetupInitial && (
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Admin Full Name *
              </label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="e.g. Adil Warraich"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">
              Admin Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@adilesports.pk"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {!isForgot && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-zinc-300">
                  Admin Password *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgot(true);
                    setIsSetupInitial(false);
                    setError(null);
                  }}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-black font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>
                  {isForgot
                    ? 'SEND PASSWORD RESET'
                    : isSetupInitial
                    ? 'CREATE MASTER ADMIN'
                    : 'ENTER ADMIN CONSOLE'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Switchers */}
        <div className="pt-2 border-t border-white/5 space-y-2 text-center text-xs">
          {isForgot ? (
            <button
              onClick={() => {
                setIsForgot(false);
                setError(null);
              }}
              className="text-amber-400 hover:underline"
            >
              Back to Admin Login
            </button>
          ) : (
            <button
              onClick={() => {
                setIsSetupInitial(!isSetupInitial);
                setError(null);
                setSuccess(null);
              }}
              className="text-zinc-400 hover:text-white"
            >
              {isSetupInitial
                ? 'Back to Standard Login'
                : 'First Time? Setup Master Admin Account'}
            </button>
          )}

          {onSwitchToUserApp && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onSwitchToUserApp}
                className="w-full py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-extrabold text-xs uppercase tracking-wider hover:bg-amber-500/25 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
              >
                <span>← RETURN TO ADIL ESPORTS (USER APP)</span>
              </button>
            </div>
          )}

          <p className="text-[10px] text-zinc-500">
            Unauthorized access attempts are logged and blocked via Firebase Security Rules.
          </p>
        </div>
      </div>
    </div>
  );
};
