import React, { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../utils/webgl';

export const InteractiveCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [isVisible, setIsVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices that do not prefer reduced motion
    const fineMatch = window.matchMedia('(pointer: fine)');
    const reducedMotion = prefersReducedMotion();

    if (fineMatch.matches && !reducedMotion) {
      setIsFinePointer(true);
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isFinePointer || !isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-500"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0, 242, 254, 0.05), rgba(138, 43, 226, 0.03), transparent 70%)`,
      }}
      aria-hidden="true"
    />
  );
};
