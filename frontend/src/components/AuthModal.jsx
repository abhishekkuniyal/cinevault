import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Sparkles, LogIn, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';

export default function AuthModal() {
  const { authModalOpen, authModalReason, closeAuthModal } = useUIStore();
  const { login, register } = useAuthStore();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (authModalOpen) {
      const reasonLower = (authModalReason || '').toLowerCase();
      if (
        reasonLower.includes('create') ||
        reasonLower.includes('register') ||
        reasonLower.includes('join') ||
        reasonLower.includes('sign up')
      ) {
        setIsSignUp(true);
      } else {
        setIsSignUp(false);
      }
    }
  }, [authModalOpen, authModalReason]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (isSignUp) {
      const result = await register({
        username,
        email,
        password
      });
      setLoading(false);

      if (result && result.success) {
        setSuccessMessage(`Account registered for @${username}! Please log in below.`);
        setIsSignUp(false);
        setPassword('');
      } else {
        setError(result?.message || 'Registration failed. Please try again.');
      }
    } else {
      const result = await login({
        email,
        password
      });
      setLoading(false);

      if (result && result.success) {
        setError('');
        setSuccessMessage('');
        closeAuthModal();
      } else {
        setError(result?.message || 'Login failed. Check your credentials.');
      }
    }
  };

  const toggleMode = (signUpState) => {

    setIsSignUp(signUpState);
    setError('');
    setSuccessMessage('');
  };


  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Banner for Action Gating */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium mb-3">
              <Lock className="w-3.5 h-3.5" /> Authentication Required
            </div>
            
            <h3 className="text-xl font-bold text-white tracking-tight mb-1">
              {isSignUp ? 'Create a New Account' : 'Please Log In to Continue'}
            </h3>
            
            <p className="text-xs text-slate-400">
              You need to be logged in to <span className="text-amber-300 font-semibold">{authModalReason}</span>.
            </p>
          </div>

          {/* Warning / Error Alert Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-rose-300">Warning</p>
                <p className="text-rose-400/90 leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2.5"
            >
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-emerald-300">Registration Success 🎉</p>
                <p className="text-emerald-300/90 leading-relaxed">{successMessage}</p>
              </div>
            </motion.div>
          )}


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. cinephile_99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isSignUp ? (
                <UserPlus className="w-4 h-4" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading
                ? 'Processing...'
                : isSignUp
                ? 'Create CineVault Account'
                : 'Log In & Continue'}
            </button>
          </form>

          {/* Toggle Login / Signup */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {isSignUp ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => toggleMode(false)}
                  className="text-amber-400 font-semibold hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => toggleMode(true)}
                  className="text-amber-400 font-semibold hover:underline cursor-pointer"
                >
                  Sign up free
                </button>
              </p>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
