import React, { useState } from 'react';
import { 
  Send, 
  Github, 
  Linkedin, 
  Copy, 
  Check, 
  MessageSquare, 
  Sparkles, 
  ExternalLink,
  MapPin,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePortfolio } from '../context/PortfolioContext';
import { TiltCard } from './TiltCard';
import { ContactOrb } from './3d/ContactOrb';

export const Contact: React.FC = () => {
  const { data } = usePortfolio();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const emailLink = data.socialLinks?.find((s) => s.id === 'email')?.url.replace('mailto:', '') || 'shannu0429@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatusMessage('Please fill in your name, email address, and message.');
      setFormStatus('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatusMessage('Please enter a valid email address.');
      setFormStatus('error');
      return;
    }

    setIsSubmitting(true);
    setFormStatus('idle');
    setStatusMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormStatus('success');
        setStatusMessage(result.message || 'Message delivered successfully! Shanmukha will get back to you shortly.');
        setFormData({ name: '', email: '', subject: '', message: '' });

        // Trigger celebratory confetti effect
        try {
          confetti({
            particleCount: 55,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#00f2fe', '#8a2be2', '#38bdf8'],
          });
        } catch (_) {}
      } else {
        throw new Error(result.error || 'Failed to deliver message.');
      }
    } catch (err: any) {
      console.warn('Real mail dispatch failed, falling back to mail client:', err);
      // Seamless graceful fallback
      const subjectEncoded = encodeURIComponent(formData.subject || `Inquiry from ${formData.name}`);
      const bodyEncoded = encodeURIComponent(
        `Hi Shanmukha,\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}\n`
      );
      window.location.href = `mailto:${emailLink}?subject=${subjectEncoded}&body=${bodyEncoded}`;
      setFormStatus('success');
      setStatusMessage('Your mail client has been opened with your pre-filled inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct Messaging</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Let's <span className="text-gradient">Connect</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            I am actively looking for software development and Python developer internship opportunities. Whether you have an open role, an exciting project, or simply want to chat tech, send a message below!
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Connect & Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <TiltCard maxTilt={5} glowColor="cyan">
              <div className="glass-card rounded-3xl p-8 border border-cyan-500/30 space-y-6 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                      <span>Recruiter & Developer Welcome</span>
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    </h3>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                      Have an internship opportunity or want to discuss a software project? Send a note directly through the form or reach out through my verified channels.
                    </p>
                  </div>
                  <div className="shrink-0 -my-3 -mr-2 hidden sm:flex items-center justify-center">
                    <ContactOrb />
                  </div>
                </div>

                {/* Email Action Box */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Verified Contact Email</span>
                    <span className="text-emerald-400 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Always Active</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-sm font-mono text-cyan-300 truncate font-semibold">
                      {emailLink}
                    </span>
                    <button
                      onClick={handleCopyEmail}
                      type="button"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition shrink-0"
                      title="Copy email to clipboard"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Social Channels */}
                <div className="space-y-3">
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Profiles & Professional Networks
                  </p>
                  <div className="space-y-2">
                    {data.socialLinks?.map((link) => {
                      if (link.id === 'email') return null;
                      const Icon = link.id === 'github' ? Github : Linkedin;
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-400/40 hover:bg-white/10 transition-all text-sm group"
                        >
                          <div className="flex items-center space-x-3 text-slate-200 group-hover:text-cyan-300">
                            <Icon className="w-5 h-5" />
                            <span className="font-mono text-xs">{link.label || link.name}</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Location & Response Time */}
                <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{data.profile?.location || 'Andhra Pradesh, India'}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>Fast Response (Within 24h)</span>
                  </span>
                </div>

              </div>
            </TiltCard>

          </div>

          {/* Right Column: Interactive Real Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-2xl relative">
              <h3 className="text-xl font-bold text-white mb-2">Send a Real Message</h3>
              <p className="text-xs text-slate-400 mb-6 font-mono">
                Messages submit directly to Shanmukha's studio inbox and notification email.
              </p>

              {formStatus === 'success' && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm flex items-start space-x-3 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Message Delivered!</p>
                    <p className="text-xs text-emerald-200/90 mt-1">
                      {statusMessage}
                    </p>
                  </div>
                </div>
              )}

              {formStatus === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-sm flex items-center space-x-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-mono text-slate-300">
                      Your Name <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Jane Doe"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm transition outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-mono text-slate-300">
                      Your Email Address <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm transition outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-mono text-slate-300">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Software Development Internship / Code Review"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm transition outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-mono text-slate-300">
                    Message <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your note, job opportunity, or collaboration details..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm transition outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400 hover:opacity-95 shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-slate-950" />
                      <span>Send Direct Message</span>
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
