import React from 'react';
import { GraduationCap, Calendar, MapPin, BookOpen, CheckCircle, School } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { TiltCard } from './TiltCard';

export const Education: React.FC = () => {
  const { data } = usePortfolio();
  const educationList = data.education || [];

  return (
    <section id="education" className="relative py-24 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Education & <span className="text-gradient">Academics</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Undergraduate foundation in Computer Science and Engineering, focusing on software principles and algorithmic problem solving.
          </p>
        </div>

        {/* Education Card & Timeline */}
        <div className="max-w-4xl mx-auto">
          {educationList.map((item) => (
            <TiltCard key={item.id} maxTilt={6} elevation={12} glowColor="both" className="group">
              <div 
                className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10 group-hover:border-cyan-400/50 transition-all duration-300 relative overflow-hidden shadow-2xl"
                style={{ transformStyle: 'preserve-3d' }}
              >
                
                {/* Background ambient glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10" style={{ transform: 'translateZ(26px)' }}>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(0,242,254,0.3)] shrink-0 group-hover:scale-105 transition-all" style={{ transform: 'translateZ(14px)' }}>
                      <School className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
                          Undergraduate Degree
                        </span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                          {item.currentYear}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                        {item.institution}
                      </h3>
                      <p className="text-sm sm:text-base font-semibold text-slate-300 mt-0.5">
                        {item.degree} • <span className="text-cyan-300">{item.branch}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 text-xs font-mono text-slate-400">
                    <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Current Academic Standing: {item.currentYear}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      <span>Andhra Pradesh, India</span>
                    </div>
                  </div>
                </div>

                {/* Educational Details */}
                <div className="relative z-10 pt-6 space-y-6">
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <span>Key Academic Focus & Experiences</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {item.highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 flex items-start space-x-2.5 leading-relaxed"
                        >
                          <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </TiltCard>
          ))}
        </div>

      </div>
    </section>
  );
};
