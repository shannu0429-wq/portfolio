import React, { useState } from 'react';
import { 
  Code2, 
  Server, 
  Cpu, 
  Layout, 
  Database, 
  Wrench, 
  BookOpen, 
  Star, 
  Terminal, 
  Sparkles,
  Layers
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { TiltCard } from './TiltCard';

const iconMap: Record<string, React.ElementType> = {
  Code2,
  Server,
  Cpu,
  Layout,
  Database,
  Wrench,
};

export const Skills: React.FC = () => {
  const { data } = usePortfolio();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const categories = data.skills?.categories || [];
  const learningList = data.skills?.currentlyLearning || [];

  const filteredCategories = selectedFilter === 'all'
    ? categories
    : categories.filter((c) => c.id === selectedFilter);

  return (
    <section id="skills" className="relative py-24 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Skills & <span className="text-gradient">Technologies</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Practical development stack with a primary core in Python, backend APIs, and applied AI & Computer Vision.
          </p>
        </div>

        {/* Python Core Focus Banner with 3D Tilt */}
        <TiltCard maxTilt={5} elevation={10} glowColor="both" className="mb-12">
          <div className="relative overflow-hidden rounded-2xl glass-card border border-cyan-500/30 p-6 sm:p-7 shadow-[0_0_30px_rgba(0,242,254,0.1)]" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10" style={{ transform: 'translateZ(18px)' }}>
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(0,242,254,0.4)] shrink-0">
                <Terminal className="w-8 h-8 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
                    Core Specialization
                  </span>
                  <span className="inline-flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                    <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                    <span>Primary Strength</span>
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  Python Backend & Applied AI Engineering
                </h3>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                  Deep experience with Python scripting, Flask microservices, RESTful architectural design, and integrating computer vision models (YOLO & OpenCV) into functional workflows.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-medium">
                Python 3.x
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-400/40 text-purple-300 text-xs font-mono font-medium">
                Flask APIs
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-blue-950/60 border border-blue-400/40 text-blue-300 text-xs font-mono font-medium">
                YOLO / OpenCV
              </span>
            </div>
          </div>
        </div>
      </TiltCard>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedFilter === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                : 'glass-card text-slate-300 hover:text-white hover:border-white/20'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedFilter === cat.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                  : 'glass-card text-slate-300 hover:text-white hover:border-white/20'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Categorized Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => {
            const Icon = iconMap[category.icon] || Code2;
            const isBackendOrLang = category.id === 'backend' || category.id === 'languages';

            return (
              <TiltCard
                key={category.id}
                maxTilt={8}
                elevation={14}
                glowColor={isBackendOrLang ? 'cyan' : 'purple'}
                className="group h-full"
              >
                <div 
                  className={`h-full glass-card rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                    isBackendOrLang 
                      ? 'border-cyan-500/30 group-hover:border-cyan-400/60' 
                      : 'border-white/10 group-hover:border-purple-400/50'
                  }`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div>
                    {/* Header (Floating in 3D Space) */}
                    <div className="flex items-start justify-between mb-4" style={{ transform: 'translateZ(28px)' }}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 ${
                          isBackendOrLang
                            ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                            : 'bg-purple-500/10 border border-purple-500/30 text-purple-400 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors drop-shadow-sm">
                            {category.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 mb-5 leading-relaxed" style={{ transform: 'translateZ(18px)' }}>
                      {category.description}
                    </p>

                    {/* Skill Tags (Floating in 3D Space) */}
                    <div className="flex flex-wrap gap-2" style={{ transform: 'translateZ(24px)' }}>
                      {category.skills.map((skill) => (
                        <span
                          key={skill.name}
                          className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 ${
                            skill.isPrimary
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,242,254,0.2)] font-semibold'
                              : skill.highlight
                              ? 'bg-purple-500/15 text-purple-200 border border-purple-400/30 font-medium'
                              : 'bg-white/5 text-slate-300 border border-white/5 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {skill.isPrimary && <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />}
                          <span>{skill.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>

        {/* Currently Learning Section */}
        {learningList.length > 0 && (
          <div className="mt-14 glass-card rounded-2xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
                      Continuous Growth
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">Currently Learning & Mastering</h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                    Dedicated daily practice expanding foundational algorithmic knowledge, exploring deep learning models, and building full-stack applications.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {learningList.map((topic, i) => (
                  <div
                    key={i}
                    className="px-3.5 py-2 rounded-xl bg-white/5 border border-purple-400/20 text-xs font-mono text-purple-200 flex items-center space-x-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
