import React, { useState, useEffect } from 'react';
import { Menu, X, FileText, Terminal, Shield } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const { isAdminLoggedIn, setIsAdminViewOpen, setIsResumeModalOpen } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section spy
      const sections = navItems.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleResumeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResumeModalOpen(true);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#050814]/80 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20 py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            className="group flex items-center space-x-2 text-white font-bold text-lg tracking-tight focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-lg p-1"
            aria-label="Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.3)] group-hover:shadow-[0_0_20px_rgba(138,43,226,0.5)] transition-all duration-300">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-mono text-base tracking-wider">
              <span className="text-cyan-400">SS</span>
              <span className="text-slate-400 font-light">.dev</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                    isActive ? 'text-cyan-300 font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full shadow-[0_0_8px_rgba(0,242,254,0.8)]"
                      aria-hidden="true"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action Button: Résumé & Admin indicator */}
          <div className="hidden md:flex items-center space-x-3">
            {isAdminLoggedIn && (
              <button
                onClick={() => setIsAdminViewOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-400/40 hover:bg-purple-500/30 transition shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                title="Open Admin Dashboard"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Studio</span>
              </button>
            )}

            <button
              onClick={handleResumeClick}
              className="group relative inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/25 hover:to-purple-500/25 border border-cyan-400/30 hover:border-cyan-400 text-cyan-300 hover:text-white shadow-[0_0_15px_rgba(0,242,254,0.1)] hover:shadow-[0_0_20px_rgba(0,242,254,0.25)] focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Résumé</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 group-hover:bg-cyan-500/30 transition">
                In a few days
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-cyan-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-3 pb-5 bg-[#070b1a]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-cyan-300 border-l-2 border-cyan-400 font-semibold'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </a>
                );
              })}
              
              {isAdminLoggedIn && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsAdminViewOpen(true);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:text-white"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Open Admin Studio</span>
                  </button>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleResumeClick(e);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 hover:text-white"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>View Résumé</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    In a few days
                  </span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};
