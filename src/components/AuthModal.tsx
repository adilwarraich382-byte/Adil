import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Gamepad2, AlertCircle, CheckCircle, Flame, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../assets/branding';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const { login, signup, resetPassword, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [ffUid, setFfUid] = useState('');
  const [ffIgn, setFfIgn] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email || !password) {
          throw new Error('Please enter both email and password.');
        }
        await login(email, password);
        onClose();
      } else if (mode === 'signup') {
        if (!fullName || !email || !password || !whatsapp || !ffUid || !ffIgn) {
          throw new Error('All fields are required to register your gamer account.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        if (!/^\d{7,15}$/.test(ffUid.trim())) {
          throw new Error('Free Fire UID must be a valid numeric game ID (e.g. 2847910245).');
        }

        await signup({
          fullName,
          email,
          password,
          whatsapp,
          ffUid: ffUid.trim(),
          ffIgn: ffIgn.trim()
        });
        onClose();
      } else if (mode === 'forgot') {
        if (!email) {
          throw new Error('Please enter your account email.');
        }
        await resetPassword(email);
        setSuccessMessage('Password reset link has been sent to your email! Please check your inbox.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      // Format common firebase errors to user-friendly messages
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        setError('Invalid email or password. Please try again.');
      } else if (msg.includes('auth/email-already-in-use')) {
        setError('An account with this email already exists. Try logging in.');
      } else if (msg.includes('auth/weak-password')) {
        setError('Password is too weak. Please use at least 6 characters.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-[#101318] border border-white/10 w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl relative">
        {/* Top bar with close button */}
        <div className="sticky top-0 bg-[#101318]/95 backdrop-blur-md px-5 py-3 border-b border-white/10 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span className="font-extrabold text-white font-heading text-lg">
              {mode === 'login' ? 'SIGN IN' : mode === 'signup' ? 'CREATE GAMER ACCOUNT' : 'RESET PASSWORD'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="grid grid-cols-2 p-2 mx-5 mt-4 bg-zinc-900 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            LOGIN
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            NEW SIGNUP
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl flex items-start space-x-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex items-start space-x-2 text-xs text-emerald-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Adil Warraich"
                    className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  WhatsApp Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="03451234567"
                    className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">Used for match room alerts & cash prize transfers.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Free Fire UID *
                  </label>
                  <div className="relative">
                    <Gamepad2 className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      required
                      value={ffUid}
                      onChange={(e) => setFfUid(e.target.value)}
                      placeholder="e.g. 2847910245"
                      className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Free Fire IGN *
                  </label>
                  <input
                    type="text"
                    required
                    value={ffIgn}
                    onChange={(e) => setFfIgn(e.target.value)}
                    placeholder="e.g. 亗ADIL亗"
                    className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="warrior@example.com"
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-zinc-300">
                  Password *
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError(null);
                    }}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-xs text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-amber-500"
                />
                <span>Remember Login</span>
              </label>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-black font-extrabold text-sm tracking-wider uppercase shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'login'
                    ? 'LOGIN TO ARENA'
                    : mode === 'signup'
                    ? 'CREATE ACCOUNT & ENTER'
                    : 'SEND RESET LINK'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Google Sign-in Divider */}
          <div className="relative my-4 text-center">
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/10" />
            <span className="relative bg-[#101318] px-3 text-[11px] uppercase tracking-wider text-zinc-500">
              OR CONTINUE WITH
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-white/15 text-white font-medium text-xs hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google Account</span>
          </button>
        </form>
      </div>
    </div>
  );
};
