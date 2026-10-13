import React, { useEffect, useRef } from 'react';

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive particle count
    const particleCount = Math.min(Math.floor((width * height) / 16000), 75);

    interface Particle3D {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      color: string;
      alpha: number;
    }

    const colors = ['#00f2fe', '#8a2be2', '#38bdf8', '#c084fc', '#818cf8'];

    const particles: Particle3D[] = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.5,
      z: Math.random() * 800 - 400,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      vz: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.25,
    }));

    // Floating 3D Geometric Crystal Polyhedra (Octahedrons)
    interface Polyhedron3D {
      x: number;
      y: number;
      z: number;
      radius: number;
      rotX: number;
      rotY: number;
      rotZ: number;
      rotSpeedX: number;
      rotSpeedY: number;
      color: string;
    }

    const polyhedra: Polyhedron3D[] = [
      {
        x: -width * 0.35,
        y: -height * 0.25,
        z: -100,
        radius: 42,
        rotX: 0.2,
        rotY: 0.3,
        rotZ: 0,
        rotSpeedX: 0.006,
        rotSpeedY: 0.009,
        color: '#00f2fe',
      },
      {
        x: width * 0.38,
        y: height * 0.2,
        z: 120,
        radius: 36,
        rotX: 0.5,
        rotY: 0.1,
        rotZ: 0.2,
        rotSpeedX: -0.008,
        rotSpeedY: 0.007,
        color: '#a855f7',
      },
      {
        x: width * 0.2,
        y: -height * 0.35,
        z: 50,
        radius: 28,
        rotX: 0.1,
        rotY: 0.8,
        rotZ: 0.4,
        rotSpeedX: 0.005,
        rotSpeedY: -0.01,
        color: '#38bdf8',
      },
    ];

    // Normalized octahedron vertices
    const baseOctahedronVertices = [
      { x: 0, y: -1, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: 0, z: -1 },
      { x: 0, y: 1, z: 0 },
    ];

    // Edges connecting vertices
    const octahedronEdges = [
      [0, 1], [0, 2], [0, 3], [0, 4], // top pyramid
      [5, 1], [5, 2], [5, 3], [5, 4], // bottom pyramid
      [1, 2], [2, 3], [3, 4], [4, 1], // equatorial square
    ];

    let targetRotY = 0;
    let targetRotX = 0;
    let cameraRotY = 0;
    let cameraRotX = 0;

    const focalLength = 650;

    const handleMouseMove = (e: MouseEvent) => {
      const normX = e.clientX / width - 0.5;
      const normY = e.clientY / height - 0.5;
      targetRotY = normX * 0.25;
      targetRotX = -normY * 0.25;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth camera interpolation (3D Parallax)
      cameraRotY += (targetRotY - cameraRotY) * 0.05;
      cameraRotX += (targetRotX - cameraRotX) * 0.05;

      const cosY = Math.cos(cameraRotY);
      const sinY = Math.sin(cameraRotY);
      const cosX = Math.cos(cameraRotX);
      const sinX = Math.sin(cameraRotX);

      const centerX = width / 2;
      const centerY = height / 2;

      // Project and draw particles
      interface ProjectedParticle {
        px: number;
        py: number;
        pz: number;
        scale: number;
        size: number;
        alpha: number;
        color: string;
      }

      const projected: ProjectedParticle[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Particle kinematics
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Wrap around boundaries
        const boundX = width * 0.75;
        const boundY = height * 0.75;
        if (p.x < -boundX) p.x = boundX;
        if (p.x > boundX) p.x = -boundX;
        if (p.y < -boundY) p.y = boundY;
        if (p.y > boundY) p.y = -boundY;
        if (p.z < -400) p.z = 400;
        if (p.z > 400) p.z = -400;

        // Apply camera rotation (Y then X)
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y1 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // 3D Perspective projection
        const depth = focalLength + z2;
        if (depth > 50) {
          const scale = focalLength / depth;
          const px = centerX + x1 * scale;
          const py = centerY + y1 * scale;

          if (px >= 0 && px <= width && py >= 0 && py <= height) {
            const depthFactor = Math.max(0.15, Math.min(1.2, scale));
            const finalAlpha = Math.min(1, p.alpha * depthFactor);

            projected.push({
              px,
              py,
              pz: z2,
              scale,
              size: p.size * depthFactor,
              alpha: finalAlpha,
              color: p.color,
            });

            // Draw particle
            ctx.save();
            ctx.globalAlpha = finalAlpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(px, py, p.size * depthFactor, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // Connect nearby 3D particles with glowing constellation lines
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.hypot(dx, dy);

          // Proximity threshold scaled by depth
          const maxDist = 95 * ((p1.scale + p2.scale) / 2);
          if (dist < maxDist && Math.abs(p1.pz - p2.pz) < 180) {
            ctx.save();
            const lineAlpha = (1 - dist / maxDist) * 0.16 * ((p1.alpha + p2.alpha) / 2);
            ctx.globalAlpha = lineAlpha;
            ctx.strokeStyle = '#00f2fe';
            ctx.lineWidth = 0.8 * ((p1.scale + p2.scale) / 2);
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Draw 3D Floating Polyhedra (Crystal Octahedrons)
      for (const poly of polyhedra) {
        poly.rotX += poly.rotSpeedX;
        poly.rotY += poly.rotSpeedY;

        // Polyhedron position rotated by camera
        const cx1 = poly.x * cosY + poly.z * sinY;
        const cz1 = -poly.x * sinY + poly.z * cosY;
        const cy1 = poly.y * cosX - cz1 * sinX;
        const cz2 = poly.y * sinX + cz1 * cosX;

        const polyDepth = focalLength + cz2;
        if (polyDepth > 80) {
          const polyScale = focalLength / polyDepth;
          const screenCenterX = centerX + cx1 * polyScale;
          const screenCenterY = centerY + cy1 * polyScale;

          // Vertex rotation angles
          const prx = poly.rotX;
          const pry = poly.rotY;

          // Transform and project each vertex
          const transformedVertices = baseOctahedronVertices.map((v) => {
            // Scale
            const vx = v.x * poly.radius;
            const vy = v.y * poly.radius;
            const vz = v.z * poly.radius;

            // Rotate Y
            const x1 = vx * Math.cos(pry) + vz * Math.sin(pry);
            const z1 = -vx * Math.sin(pry) + vz * Math.cos(pry);

            // Rotate X
            const y2 = vy * Math.cos(prx) - z1 * Math.sin(prx);
            const z2 = vy * Math.sin(prx) + z1 * Math.cos(prx);

            return {
              px: screenCenterX + x1 * polyScale,
              py: screenCenterY + y2 * polyScale,
              pz: z2,
            };
          });

          // Draw edges
          ctx.save();
          const baseAlpha = Math.min(0.45, Math.max(0.12, polyScale * 0.35));
          ctx.strokeStyle = poly.color;
          ctx.lineWidth = 1.1 * polyScale;

          for (const [v1Idx, v2Idx] of octahedronEdges) {
            const v1 = transformedVertices[v1Idx];
            const v2 = transformedVertices[v2Idx];

            ctx.globalAlpha = baseAlpha;
            ctx.beginPath();
            ctx.moveTo(v1.px, v1.py);
            ctx.lineTo(v2.px, v2.py);
            ctx.stroke();
          }

          // Draw small glowing vertex dots
          ctx.fillStyle = poly.color;
          for (const v of transformedVertices) {
            ctx.globalAlpha = baseAlpha * 1.5;
            ctx.beginPath();
            ctx.arc(v.px, v.py, 1.8 * polyScale, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70"
      aria-hidden="true"
    />
  );
};
