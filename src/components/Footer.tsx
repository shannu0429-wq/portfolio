import React from 'react';
import { ArrowUp, Github, Linkedin, Mail, Terminal, Lock } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { data, setIsLoginModalOpen, isAdminLoggedIn, setIsAdminViewOpen } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminTrigger = () => {
    if (isAdminLoggedIn) {
      setIsAdminViewOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#04060f]/90 z-10 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          {/* Brand & Title (Double click monogram triggers secret admin login) */}
          <div className="flex items-center space-x-3 text-center md:text-left">
            <button
              onDoubleClick={handleAdminTrigger}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:opacity-90 transition cursor-pointer"
              title="SS"
              aria-label="Monogram"
            >
              <Terminal className="w-5 h-5 text-white" />
            </button>
            <div>
              <p className="font-bold text-white text-base tracking-tight">
                {data.profile?.name || 'Somisetty Shanmukha'}
              </p>
              <p className="text-xs text-slate-400 font-mono">
                {data.profile?.title || 'Python Developer'}
              </p>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-3">
            {data.socialLinks?.map((link) => {
              const Icon =
                link.id === 'github' ? Github : link.id === 'linkedin' ? Linkedin : Mail;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.id !== 'email' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-slate-400 hover:text-cyan-300 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
                  aria-label={link.name}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:text-white flex items-center justify-center transition shadow-sm"
              title="Back to Top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Credits & Secret Admin Lock */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <p>
              © {new Date().getFullYear()} {data.profile?.name || 'Somisetty Shanmukha'}. All rights reserved.
            </p>
            {/* Discreet admin entry point */}
            <button
              onClick={handleAdminTrigger}
              className="opacity-20 hover:opacity-100 transition-opacity p-1 rounded hover:text-cyan-400"
              title="Admin Mode (Ctrl+Shift+A)"
              aria-label="Secret admin entry point"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>

          <p className="flex items-center space-x-1">
            <span>Built with React, TypeScript & Tailwind CSS</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
