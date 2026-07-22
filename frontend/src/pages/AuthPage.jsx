import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Sparkles, LogIn, UserPlus, ShieldCheck, AlertCircle, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp) {
      const result = await register({
        username,
        email,
        password
      });
      setLoading(false);

      if (result && result.success) {
        setRegisteredUser({ username, email });
        setSignupSuccess(true);
        setPassword('');
      } else {
        setError(result?.message || 'Registration failed.');
      }
    } else {
      const result = await login({
        email,
        password
      });
      setLoading(false);

      if (result && result.success) {
        navigate('/profile');
      } else {
        setError(result?.message || 'Invalid email or password.');
      }
    }
  };

  const toggleMode = (signUpState) => {

    setIsSignUp(signUpState);
    setSignupSuccess(false);
    setError('');
  };

  const handleProceedToLogin = () => {
    setSignupSuccess(false);
    setIsSignUp(false);
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 bento-card rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
        
        {/* Left Side: Brand Visual Showcase */}
        <div className="relative p-8 sm:p-12 flex flex-col justify-between bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Film className="w-5 h-5 text-amber-400" />
            </div>
            <span className="font-extrabold text-xl text-white">CineVault</span>
          </div>

          <div className="space-y-4 my-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Taste Profile Engine
            </span>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Unlock Your Cinematic Taste Genome
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Log in to publish reviews, rate films, curate bento watchlists, and follow critics sharing your film DNA.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Powered by Node/Express, MongoDB & AI Intelligence
          </div>
        </div>

        {/* Right Side: Form / Success View */}
        <div className="p-8 sm:p-12 space-y-6 bg-slate-900 flex flex-col justify-center">
          {signupSuccess ? (
            /* Signup Success Screen asking to log in */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9 animate-bounce" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  Registration Successful 🎉
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Welcome to CineVault, {registeredUser?.username}!
                </h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Your account has been created successfully. For security reasons, please log in with your email <span className="text-amber-300 font-mono">({registeredUser?.email})</span> and password.
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  onClick={handleProceedToLogin}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  Proceed to Login Now
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-slate-500">
                  Your credentials have been saved for easy login.
                </p>
              </div>
            </div>
          ) : (
            /* Standard Auth Form */
            <>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isSignUp ? 'Enter details to start building your vault' : 'Sign in to access your profile & feed'}
                </p>
              </div>

              {/* Warning / Error Alert Banner */}
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-rose-300">Warning</p>
                    <p className="text-rose-400/90 leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="cinephile_99"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
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
                    ? 'Register Account'
                    : 'Log In'}
                </button>
              </form>

              <div className="text-center text-xs text-slate-400">

                <button
                  onClick={() => toggleMode(!isSignUp)}
                  className="text-amber-400 font-semibold hover:underline cursor-pointer"
                >
                  {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

