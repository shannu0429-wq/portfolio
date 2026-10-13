import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Clock, 
  Mail, 
  Copy, 
  Check, 
  Send, 
  Download, 
  ExternalLink
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const ResumeModal: React.FC = () => {
  const { data, isResumeModalOpen, setIsResumeModalOpen } = usePortfolio();
  const [copied, setCopied] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isResumeModalOpen) {
        setIsResumeModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isResumeModalOpen, setIsResumeModalOpen]);

  if (!isResumeModalOpen) return null;

  const email = 'shannu0429@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMailto = () => {
    const subject = encodeURIComponent(`Résumé Request for Somisetty Shanmukha`);
    const body = encodeURIComponent(
      `Hi Shanmukha,\n\nI reviewed your portfolio and would like to request an immediate copy of your latest résumé for software development internship opportunities.\n\nBest regards,\n`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsResumeModalOpen(false);
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
    >
      <div className="relative max-w-lg w-full glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/40 shadow-[0_0_50px_rgba(0,242,254,0.25)] space-y-6 overflow-hidden">
        
        {/* Decorative Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(0,242,254,0.3)]">
              <FileText className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  Official Document Notice
                </span>
              </div>
              <h3 id="resume-modal-title" className="text-xl font-bold text-white tracking-wide">
                Résumé Status
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsResumeModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Status Pill */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-purple-950/30 to-slate-900/60 border border-cyan-500/30 flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-200">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
            <span className="font-semibold">Uploading revised version in a few days</span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold shrink-0">
            In Progress
          </span>
        </div>

        {/* Descriptive Note */}
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2 relative z-10">
          <p>
            My latest official résumé is currently undergoing a final polish to reflect current <strong>3rd Year B.Tech CSE</strong> coursework at <strong>VVIT</strong>, specialized <strong>Python & Flask</strong> backend engineering, and recent project architectures (<em>JobAlign AI</em>, <em>Smart Farm Assistant</em>, and <em>BugFlow</em>).
          </p>
          <p className="text-slate-400 text-xs">
            The updated PDF will be published directly on this website in a few days. If you require a copy immediately for internship screening, you can request an instant draft below!
          </p>
        </div>

        {/* Available upon request actions */}
        <div className="space-y-3 pt-2 relative z-10">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Direct Contact Email:</span>
              <span className="text-cyan-300 font-bold">{email}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                onClick={handleMailto}
                className="flex-1 inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold font-mono text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400 hover:opacity-95 shadow-[0_0_20px_rgba(0,242,254,0.3)] transition transform hover:-translate-y-0.5"
              >
                <Mail className="w-4 h-4" />
                <span>Request Résumé via Email</span>
              </button>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Email!' : 'Copy Address'}</span>
              </button>
            </div>
          </div>

          {/* Fallback to download if already activated in admin */}
          {data.profile.resumeAvailable && (
            <a
              href={data.profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold font-mono text-purple-200 bg-purple-950/60 border border-purple-400/40 hover:bg-purple-900/60 transition shadow-sm"
            >
              <Download className="w-4 h-4 text-purple-300" />
              <span>Download Previously Uploaded Draft PDF</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-400 relative z-10">
          <a
            href="#contact"
            onClick={() => setIsResumeModalOpen(false)}
            className="hover:text-cyan-300 transition flex items-center space-x-1 font-mono"
          >
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span>Send message via contact form</span>
          </a>

          <button
            onClick={() => setIsResumeModalOpen(false)}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
