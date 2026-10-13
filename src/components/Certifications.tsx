import React from 'react';
import { Award, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { TiltCard } from './TiltCard';

export const Certifications: React.FC = () => {
  const { data } = usePortfolio();
  const certificationsList = data.certifications || [];
  const hasCertifications = certificationsList.length > 0;

  return (
    <section id="certifications" className="relative py-16 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Licenses & <span className="text-gradient">Certifications</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Professional badges, specialized certificates, and verified technical credentials.
          </p>
        </div>

        {/* Content */}
        {hasCertifications ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificationsList.map((cert) => (
              <TiltCard key={cert.id} maxTilt={6} glowColor="purple">
                <div className="h-full glass-card rounded-2xl p-6 border border-white/10 hover:border-purple-400/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{cert.title}</h3>
                        <p className="text-xs text-slate-400">{cert.issuer}</p>
                      </div>
                    </div>
                    {cert.description && (
                      <p className="text-xs text-slate-300 mb-4">{cert.description}</p>
                    )}
                  </div>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 pt-3 border-t border-white/5"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </TiltCard>
            ))}
          </div>
        ) : (
          /* Graceful, professional empty/editable state */
          <div className="max-w-2xl mx-auto glass-card rounded-2xl p-8 border border-dashed border-white/15 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Certifications Section Configured</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
                This section is ready for your verified credentials. You can easily add courses, hackathon badges, or certificates anytime through your private Admin Studio.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center space-x-2 text-xs font-mono text-slate-500">
              <span className="w-2 h-2 rounded-full bg-cyan-400/80" />
              <span>Ready for Google Cloud Skills Boost, Python, or AI certifications</span>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
