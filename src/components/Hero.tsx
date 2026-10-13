import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Sparkles, 
  Terminal, 
  Code2, 
  ChevronRight, 
  FileText,
  Layers,
  UserCheck
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { TiltCard } from './TiltCard';
import { HeroScene } from './3d/HeroScene';

export const Hero: React.FC = () => {
  const { data, setIsResumeModalOpen } = usePortfolio();
  const [imageError, setImageError] = useState(false);
  const [heroView, setHeroView] = useState<'3d' | 'photo'>('3d');

  useEffect(() => {
    setImageError(false);
  }, [data.profile.photoUrl]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      {/* Cinematic Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-64 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Status Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-medium backdrop-blur-md shadow-[0_0_15px_rgba(0,242,254,0.15)] animate-pulse-glow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="font-mono">Open to Software Development & Python Internships</span>
            </div>

            {/* Greeting & Name */}
            <div className="space-y-2">
              <p className="text-sm sm:text-base font-mono uppercase tracking-widest text-slate-400">
                Hi, I'm
              </p>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
                <span className="text-white">{data.profile.name.split(' ')[0]}</span>{' '}
                <span className="text-gradient drop-shadow-[0_0_35px_rgba(0,242,254,0.3)]">
                  {data.profile.name.split(' ').slice(1).join(' ') || data.profile.preferredName}
                </span>
              </h1>
              
              {/* Prominent Title: Python Developer | AI Enthusiast | Problem Solver */}
              <div className="pt-2">
                <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-blue-500/20 border border-white/10 backdrop-blur-sm">
                  <p className="px-3 py-1 text-base sm:text-xl md:text-2xl font-bold tracking-wide text-slate-100 flex flex-wrap items-center justify-center lg:justify-start gap-2">
                    <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(0,242,254,0.4)]">
                      {data.profile.title.split('|')[0]?.trim() || 'Python Developer'}
                    </span>
                    <span className="text-slate-500 font-light">•</span>
                    <span className="text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                      {data.profile.title.split('|')[1]?.trim() || 'AI Enthusiast'}
                    </span>
                    <span className="text-slate-500 font-light">•</span>
                    <span className="text-blue-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.4)]">
                      {data.profile.title.split('|')[2]?.trim() || 'Problem Solver'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Intro paragraph */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              {data.profile.heroIntro}
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <a
                href="#projects"
                className="group relative inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl font-semibold text-sm tracking-wide text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400 hover:opacity-95 shadow-[0_0_25px_rgba(0,242,254,0.35)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(0,242,254,0.6)] transform hover:-translate-y-0.5"
              >
                <span>Explore My Projects</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <button
                type="button"
                onClick={() => setIsResumeModalOpen(true)}
                className="group inline-flex items-center space-x-2.5 px-5 py-3.5 rounded-xl font-semibold text-sm tracking-wide text-slate-200 hover:text-white glass-card hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(0,242,254,0.25)] transform hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4 text-cyan-400 group-hover:rotate-6 transition-transform" />
                <span>Download Resume</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 group-hover:bg-cyan-500/30 transition">
                  Uploading in few days
                </span>
              </button>

              <a
                href="#contact"
                className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-xl font-semibold text-sm tracking-wide text-slate-200 hover:text-white glass-card hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(138,43,226,0.25)] transform hover:-translate-y-0.5"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Contact Me</span>
              </a>
            </div>

            {/* Social Links & Highlights */}
            <div className="pt-4 flex items-center justify-center lg:justify-start space-x-4">
              <span className="text-xs uppercase font-mono tracking-widest text-slate-500 hidden sm:inline-block">
                Connect:
              </span>
              <div className="flex items-center space-x-3">
                {data.socialLinks.map((link) => {
                  const Icon =
                    link.id === 'github' ? Github : link.id === 'linkedin' ? Linkedin : Mail;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target={link.id !== 'email' ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-slate-300 hover:text-cyan-300 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all duration-300 transform hover:-translate-y-1"
                      aria-label={link.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: 3D Holographic Scene & Interactive Profile (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
            
            {/* View Switcher Pill */}
            <div className="flex items-center space-x-2 p-1 mb-4 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md shadow-lg z-20">
              <button
                type="button"
                onClick={() => setHeroView('3d')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 ${
                  heroView === '3d'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3D Hologram</span>
              </button>
              <button
                type="button"
                onClick={() => setHeroView('photo')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 ${
                  heroView === 'photo'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Profile Photo</span>
              </button>
            </div>

            {/* Stage Container */}
            <div className="relative w-full max-w-md">
              {heroView === '3d' ? (
                /* 3D Holographic Core View */
                <div className="relative group w-full rounded-3xl p-3 bg-gradient-to-b from-cyan-950/20 via-purple-950/20 to-slate-950/60 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_40px_rgba(0,242,254,0.15)] transition-all duration-500">
                  {/* Outer ambient glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-600/20 to-blue-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-500 pointer-events-none" />

                  {/* 3D Scene Viewport */}
                  <div className="relative rounded-2xl overflow-hidden bg-slate-950/70 border border-white/10">
                    <HeroScene />

                    {/* Floating Developer Identity Overlay in 3D frame */}
                    <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/85 backdrop-blur-xl border border-white/15 flex items-center justify-between shadow-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-cyan-400/50 shrink-0 bg-slate-900">
                          <img
                            src={data.profile.photoUrl}
                            alt={data.profile.name}
                            onError={(e) => {
                              // Fallback placeholder icon
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white tracking-wide flex items-center space-x-1.5">
                            <span>{data.profile.name}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          </p>
                          <p className="text-[11px] font-mono text-cyan-300">
                            {data.profile.year} CSE @ VVIT
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setHeroView('photo')}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/10 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 transition"
                      >
                        Inspect Photo →
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Full Photograph 3D Tilt Card */
                <TiltCard maxTilt={12} elevation={16} glowColor="both" className="relative group w-full">
                  {/* Outer decorative gradient glow */}
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-cyan-500 via-purple-600 to-blue-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Card Container (3D Preserved Space) */}
                  <div 
                    className="relative glass-card rounded-3xl p-5 border border-white/15 overflow-hidden shadow-2xl"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Dedicated Profile Photo Area */}
                    <div 
                      className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-900/90 border border-cyan-500/30 shadow-inner flex items-center justify-center group-hover:border-cyan-400/60 transition-colors duration-300"
                      style={{ transform: 'translateZ(24px)' }}
                    >
                      {!imageError ? (
                        <img
                          src={data.profile.photoUrl}
                          alt={`${data.profile.name} - Profile Photograph`}
                          onError={() => setImageError(true)}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          loading="eager"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                          <div className="w-20 h-20 rounded-full bg-cyan-950/80 border-2 border-dashed border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.2)]">
                            <Terminal className="w-9 h-9" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white tracking-wide">
                              {data.profile.photoPlaceholderText}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              Drop photo at <code className="text-cyan-300">public/images/profile.jpg</code>
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#050814]/80 via-transparent to-transparent pointer-events-none" />

                      {/* Corner Accent */}
                      <div 
                        className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-cyan-500/40 text-[11px] font-mono text-cyan-300 flex items-center space-x-1.5 shadow-lg"
                        style={{ transform: 'translateZ(38px)' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>{data.profile.year} CSE @ VVIT</span>
                      </div>
                    </div>

                    {/* Floating Micro-Badges */}
                    <div 
                      className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs"
                      style={{ transform: 'translateZ(30px)' }}
                    >
                      <div className="flex items-center space-x-2 p-2 rounded-xl bg-white/5 border border-white/5 group-hover:border-cyan-400/30 transition-all">
                        <Code2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="text-slate-300 font-mono text-[11px] truncate">Python & Flask</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-xl bg-white/5 border border-white/5 group-hover:border-purple-400/30 transition-all">
                        <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                        <span className="text-slate-300 font-mono text-[11px] truncate">YOLO & OpenCV</span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              )}
            </div>

          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="pt-16 flex flex-col items-center justify-center">
          <a
            href="#about"
            className="flex flex-col items-center space-y-2 text-slate-500 hover:text-cyan-400 transition-colors group"
            aria-label="Scroll to about section"
          >
            <span className="text-xs font-mono tracking-widest uppercase text-slate-400 group-hover:text-cyan-300 transition-colors">
              Scroll Down
            </span>
            <div className="w-6 h-10 rounded-full border-2 border-slate-600 group-hover:border-cyan-400/80 flex items-start justify-center p-1.5 transition-colors">
              <div className="w-1.5 h-2.5 bg-cyan-400 rounded-full animate-bounce" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
