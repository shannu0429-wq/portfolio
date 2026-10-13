import React, { useState } from 'react';
import { 
  FolderGit2, 
  Github, 
  Clock, 
  Cpu, 
  Info,
  X
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../../server/types';
import { TiltCard } from './TiltCard';

export const Projects: React.FC = () => {
  const { data } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projectsList = data.projects || [];

  return (
    <section id="projects" className="relative py-24 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Featured Engineering Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            A curated showcase of real-world software solutions combining Python backend development, computer vision, and modern web systems.
          </p>
        </div>

        {/* Projects 3D Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsList.map((project) => {
            return (
              <TiltCard
                key={project.id}
                maxTilt={10}
                glowColor={project.id === 'jobalign-ai' ? 'cyan' : project.id === 'smart-farm-assistant' ? 'both' : 'purple'}
                className="group flex flex-col h-full"
              >
                <div 
                  className="h-full glass-card rounded-2xl border border-white/10 group-hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  
                  {/* Top Preview Banner with Stylized Visual Header */}
                  <div>
                    <div className={`relative h-44 w-full bg-gradient-to-br ${project.previewGradient || 'from-cyan-500/20 to-purple-500/20'} border-b border-white/10 p-5 flex flex-col justify-between overflow-hidden`}>
                      {/* Ambient background grid lines */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:16px_16px]" />
                      
                      {/* Top Bar inside Banner (Floating in 3D) */}
                      <div className="relative z-10 flex items-center justify-between" style={{ transform: 'translateZ(28px)' }}>
                        <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-cyan-300 font-semibold shadow-md">
                          {project.category}
                        </span>
                        {project.highlightBadge && (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 shadow-md">
                            {project.highlightBadge}
                          </span>
                        )}
                      </div>

                      {/* Visual Center Identifier (High Elevation in 3D) */}
                      <div className="relative z-10 flex items-center space-x-3" style={{ transform: 'translateZ(38px)' }}>
                        <div className="w-11 h-11 rounded-xl bg-black/60 border border-white/20 flex items-center justify-center text-cyan-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(0,242,254,0.5)] group-hover:scale-105 transition-all">
                          <Cpu className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors drop-shadow-md">
                            {project.title}
                          </h3>
                          <p className="text-xs text-slate-300 font-mono">
                            {project.tagline}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Content (Floating in 3D) */}
                    <div className="p-6 space-y-4" style={{ transform: 'translateZ(20px)' }}>
                      <p className="text-sm text-slate-300 leading-relaxed min-h-[4.5rem]">
                        {project.description}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="pt-2">
                        <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                          Technologies Used:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/5 text-slate-200 group-hover:border-cyan-400/20 transition"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Action Links (Floating in 3D) */}
                  <div className="p-6 pt-0 border-t border-white/5 mt-4 flex items-center justify-between gap-3" style={{ transform: 'translateZ(30px)' }}>
                    
                    {/* GitHub Link */}
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold font-mono tracking-wide bg-white/10 hover:bg-white/15 border border-white/10 hover:border-cyan-400/50 text-white hover:text-cyan-300 transition-all shadow-sm"
                        aria-label={`View ${project.title} on GitHub`}
                      >
                        <Github className="w-4 h-4" />
                        <span>Source Code</span>
                      </a>
                    ) : (
                      <div className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-mono bg-slate-900/60 border border-dashed border-slate-700 text-slate-400 cursor-not-allowed">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Repo Coming Soon</span>
                      </div>
                    )}

                    {/* Quick Details Trigger */}
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center justify-center p-2.5 rounded-xl text-slate-300 hover:text-cyan-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                      title="View Project Architecture & Overview"
                      aria-label="View Project Architecture Details"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              </TiltCard>
            );
          })}
        </div>

      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-xl w-full glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/40 shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-cyan-400 font-semibold">
                  {selectedProject.category}
                </span>
                <h3 className="text-2xl font-bold text-white">
                  {selectedProject.title}
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Project Overview & Impact
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Complete Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono bg-cyan-950/40 border border-cyan-400/30 text-cyan-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              {selectedProject.githubUrl ? (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wide bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20 hover:opacity-90 transition"
                >
                  <Github className="w-4 h-4" />
                  <span>Open GitHub Repository</span>
                </a>
              ) : (
                <div className="inline-flex items-center space-x-2 text-xs font-mono text-slate-400">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Repository link will be published soon</span>
                </div>
              )}

              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 text-xs rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
