import React from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { ParticleBackground } from './components/ParticleBackground';
import { ScrollProgress } from './components/ScrollProgress';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Education } from './components/Education';
import { Certifications } from './components/Certifications';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ResumeModal } from './components/ResumeModal';
import { InteractiveCursor } from './components/InteractiveCursor';
import { Eye } from 'lucide-react';

const PortfolioContent: React.FC = () => {
  const { isPreviewMode, setIsPreviewMode, setIsAdminViewOpen } = usePortfolio();

  return (
    <div className="relative min-h-screen bg-[#050814] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Interactive Desktop Cursor Ambient Lighting */}
      <InteractiveCursor />

      {/* Top Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Floating Draft Preview Banner */}
      {isPreviewMode && (
        <div className="fixed top-1 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-3 px-4 py-2 rounded-full bg-purple-950/90 border border-purple-400/50 backdrop-blur-md shadow-[0_0_25px_rgba(168,85,247,0.4)] text-xs font-mono text-purple-200 animate-fadeIn">
          <Eye className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Draft Preview Mode Active</span>
          <button
            onClick={() => setIsAdminViewOpen(true)}
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition"
          >
            Open Studio
          </button>
          <button
            onClick={() => setIsPreviewMode(false)}
            className="text-purple-300 hover:text-white transition"
          >
            Exit Preview
          </button>
        </div>
      )}

      {/* Lightweight Interactive Particle Canvas */}
      <ParticleBackground />

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Certifications />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Hidden Admin Components */}
      <AdminLoginModal />
      <AdminDashboard />

      {/* Résumé Request & Status Dialog */}
      <ResumeModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PortfolioProvider>
      <PortfolioContent />
    </PortfolioProvider>
  );
};

export default App;
