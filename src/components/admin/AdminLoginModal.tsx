import React, { useState } from 'react';
import { X, Shield, AlertCircle, KeyRound } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = usePortfolio();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await login(username.trim(), password);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Invalid credentials or server error.');
    } else {
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-md w-full glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/40 shadow-[0_0_50px_rgba(0,242,254,0.25)]">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setIsLoginModalOpen(false);
            setErrorMsg('');
          }}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          aria-label="Close admin login"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(0,242,254,0.4)]">
            <Shield className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              Portfolio Management
            </h3>
            <p className="text-xs text-cyan-300 font-mono">
              Authorized Access Only
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-start space-x-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">
              Admin Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 inline-flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400 hover:opacity-95 shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all duration-300 disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isSubmitting ? 'Authenticating...' : 'Enter Admin Studio'}</span>
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] font-mono text-slate-400">
            Protected with bcrypt hashing, signed JWT, & rate-limiting.
          </p>
        </div>

      </div>
    </div>
  );
};
