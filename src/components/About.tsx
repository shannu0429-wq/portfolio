import React from 'react';
import { Target, Terminal, Cpu, Lightbulb, Compass, Award, CheckCircle2, Clock } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { TiltCard } from './TiltCard';

export const About: React.FC = () => {
  const { data, setIsResumeModalOpen } = usePortfolio();

  return (
    <section id="about" className="relative py-24 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Discover My Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Engineering solid software architectures with Python, practical AI systems, and relentless problem-solving.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Story & Career Goal (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Overview Card */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Who I Am</h3>
              </div>
              <p className="text-slate-300 leading-relaxed text-base">
                {data.profile.about.overview}
              </p>
            </div>

            {/* Career Objective / Internship Focus */}
            <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-cyan-950/40 via-purple-950/20 to-slate-900/60 border border-cyan-500/40 shadow-[0_0_30px_rgba(0,242,254,0.1)]">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                  <Target className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <span>Career Goal & Internship Focus</span>
                    <span className="text-xs font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-full">
                      Primary Objective
                    </span>
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {data.profile.careerGoal}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-cyan-300">
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">🐍 Python Development</span>
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">⚙️ Backend Engineering</span>
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">🚀 Software Engineering Internship</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Strengths */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10">
              <h4 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-purple-400" />
                <span>What I Bring to the Table</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.profile.about.strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2.5 p-3 rounded-xl bg-white/5 border border-white/5 text-sm text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Focus Areas & Education Snapshot (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Focus Pillars */}
            <TiltCard glowColor="purple" className="group">
              <div className="glass-card rounded-2xl p-6 sm:p-7 border border-white/10 group-hover:border-purple-500/40 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Technical Focus Areas</h3>
                </div>

                <div className="space-y-3">
                  {data.profile.about.focusAreas.map((area, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-colors"
                    >
                      <div className="flex items-center space-x-2 text-cyan-300 text-xs font-mono mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>Area {idx + 1}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-200">{area}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>

            {/* Quick Academic Snapshot Card with 3D Depth */}
            <TiltCard maxTilt={6} elevation={10} glowColor="cyan" className="group">
              <div 
                className="glass-card rounded-2xl p-6 border border-white/10 group-hover:border-cyan-400/40 transition-all duration-300 space-y-4"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="flex items-center space-x-3" style={{ transform: 'translateZ(20px)' }}>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-all">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Academic Details</h4>
                    <p className="text-xs text-slate-400">Directly Confirmed</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs font-mono" style={{ transform: 'translateZ(15px)' }}>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Institution</span>
                    <span className="text-white text-right font-sans font-medium">{data.profile.college}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Degree</span>
                    <span className="text-white font-sans">{data.profile.degree}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Branch</span>
                    <span className="text-cyan-300 font-sans font-semibold">{data.profile.branch}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Academic Standing</span>
                    <span className="text-purple-300 font-sans font-semibold">{data.profile.year}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 pt-2">
                    <span className="text-slate-400">Résumé</span>
                    <button
                      type="button"
                      onClick={() => setIsResumeModalOpen(true)}
                      className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/30 transition text-[11px]"
                    >
                      <Clock className="w-3 h-3 text-cyan-400 animate-pulse" />
                      <span>Uploading in few days</span>
                    </button>
                  </div>
                </div>
              </div>
            </TiltCard>

          </div>

        </div>

      </div>
    </section>
  );
};
