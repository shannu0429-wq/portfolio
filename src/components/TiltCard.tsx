import React, { useRef, useState, useEffect } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glowColor?: 'cyan' | 'purple' | 'both';
  elevation?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 8,
  glowColor = 'cyan',
  elevation = 12,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [glareAngle, setGlareAngle] = useState(135);
  const [glareOpacity, setGlareOpacity] = useState(0);
  const [shadowStyle, setShadowStyle] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    const rotateX = normY * -maxTilt;
    const rotateY = normX * maxTilt;

    // True 3D perspective transform with depth elevation
    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(${elevation}px) scale3d(1.015, 1.015, 1.015)`
    );

    // Calculate light reflection angle
    const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) - 90;
    setGlareAngle(angle);

    const distFromCenter = Math.hypot(normX, normY);
    setGlareOpacity(Math.min(0.28, distFromCenter * 0.22));

    // Dynamic 3D counter-shadow
    const shadowX = (normX * -15).toFixed(1);
    const shadowY = (normY * -15).toFixed(1);
    const glowShadowColor =
      glowColor === 'purple'
        ? 'rgba(168, 85, 247, 0.25)'
        : glowColor === 'both'
        ? 'rgba(0, 242, 254, 0.2)'
        : 'rgba(0, 242, 254, 0.22)';

    setShadowStyle(
      `${shadowX}px ${shadowY}px 35px ${glowShadowColor}, 0 25px 40px rgba(0, 0, 0, 0.65)`
    );

    setGlowPos({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
    });
  };

  const handleMouseEnter = () => {
    if (!isMobile) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)');
    setGlareOpacity(0);
    setShadowStyle('');
  };

  const glowStyle = isHovered && !isMobile
    ? {
        background: glowColor === 'purple'
          ? `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(138, 43, 226, 0.22) 0%, transparent 65%)`
          : glowColor === 'both'
          ? `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(0, 242, 254, 0.18) 0%, rgba(138, 43, 226, 0.15) 45%, transparent 70%)`
          : `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(0, 242, 254, 0.2) 0%, transparent 65%)`,
      }
    : {};

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isMobile ? undefined : transform,
        boxShadow: isMobile ? undefined : shadowStyle,
        transformStyle: 'preserve-3d',
        transition: isHovered
          ? 'transform 0.08s ease-out, box-shadow 0.15s ease-out'
          : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease-out',
      }}
      className={`relative transform-gpu ${className}`}
    >
      {/* Dynamic ambient highlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-30"
        style={glowStyle}
      />

      {/* Holographic Specular Glare Sheen */}
      {!isMobile && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl z-40 transition-opacity duration-200 overflow-hidden mix-blend-overlay"
          style={{
            opacity: glareOpacity,
            background: `linear-gradient(${glareAngle}deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%)`,
          }}
        />
      )}

      {/* Content wrapper with 3D preservation */}
      <div className="w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  );
};
