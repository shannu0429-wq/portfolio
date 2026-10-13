import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isWebGLAvailable, prefersReducedMotion } from '../../utils/webgl';

// ---------------------------------------------------------------------------
// 3D Inner Holographic Core
// ---------------------------------------------------------------------------
const HolographicCore: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.25;
      meshRef.current.rotation.y += delta * 0.35;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x -= delta * 0.15;
      wireRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group>
      {/* Inner faceted crystal sphere */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshStandardMaterial
          color="#00f2fe"
          emissive="#004e75"
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={0.85}
          wireframe={false}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Outer wireframe shell for holographic cybernetic effect */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial
          color="#8a2be2"
          wireframe
          transparent
          opacity={0.45}
        />
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------------------------
// Orbital Gyroscopic Rings
// ---------------------------------------------------------------------------
const OrbitalRings: React.FC = () => {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.4;
      ring1Ref.current.rotation.y += delta * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.35;
      ring2Ref.current.rotation.z += delta * 0.25;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z -= delta * 0.2;
      ring3Ref.current.rotation.x += delta * 0.3;
    }
  });

  return (
    <group>
      {/* Ring 1 - Cyan Neon Ring */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.8, 0.035, 16, 64]} />
        <meshStandardMaterial
          color="#00f2fe"
          emissive="#00d8f6"
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Ring 2 - Electric Violet Ring */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[2.1, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#8a2be2"
          emissiveIntensity={1.4}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Ring 3 - Deep Azure Outer Halo Ring */}
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 3, Math.PI / 4]}>
        <torusGeometry args={[2.45, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.8}
          transparent
          opacity={0.65}
        />
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------------------------
// Ambient Particle Swarm
// ---------------------------------------------------------------------------
const ParticleSwarm: React.FC<{ count?: number }> = ({ count = 90 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cyan = new THREE.Color('#00f2fe');
    const violet = new THREE.Color('#8a2be2');

    for (let i = 0; i < count; i++) {
      // Spherical distribution around radius 2.0 - 3.8
      const radius = 2.0 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const mixed = Math.random() > 0.5 ? cyan : violet;
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08;
      pointsRef.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// ---------------------------------------------------------------------------
// Master Interactive Rig with Mouse Parallax
// ---------------------------------------------------------------------------
const SceneRig: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Mouse coordinates range from -1 to 1
    const targetX = state.pointer.x * 0.45;
    const targetY = state.pointer.y * 0.35;

    // Smooth lerp interpolation for silky cinematic response
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetX,
      delta * 2.5
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -targetY,
      delta * 2.5
    );

    // Subtle breathing float elevation
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.12;
  });

  return (
    <group ref={groupRef}>
      <HolographicCore />
      <OrbitalRings />
      <ParticleSwarm count={100} />
    </group>
  );
};

// ---------------------------------------------------------------------------
// CSS Fallback for Non-WebGL / Low-Power / Reduced-Motion Devices
// ---------------------------------------------------------------------------
export const HeroSceneFallback: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      {/* Outer pulsing energy halo */}
      <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-cyan-500/25 via-purple-600/30 to-blue-500/20 blur-3xl animate-pulse" />
      
      {/* Cybernetic geometric circles */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-cyan-400/30 flex items-center justify-center animate-[spin_20s_linear_infinite]">
        <div className="w-44 h-44 rounded-full border border-dashed border-purple-400/40 flex items-center justify-center animate-[spin_12s_linear_infinite_reverse]">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-400/20 via-purple-600/30 to-cyan-300/30 backdrop-blur-md border border-cyan-300/40 shadow-[0_0_40px_rgba(0,242,254,0.35)] flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-cyan-400/40 blur-sm animate-ping" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main HeroScene Component
// ---------------------------------------------------------------------------
export const HeroScene: React.FC = () => {
  const [canRender3D, setCanRender3D] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const webglSupported = isWebGLAvailable();
    const reducedMotion = prefersReducedMotion();
    setCanRender3D(webglSupported && !reducedMotion);
    setHasChecked(true);
  }, []);

  if (!hasChecked) {
    return <HeroSceneFallback />;
  }

  if (!canRender3D) {
    return <HeroSceneFallback />;
  }

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] select-none">
      <Suspense fallback={<HeroSceneFallback />}>
        <Canvas
          camera={{ position: [0, 0, 5.8], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Ambient Lighting */}
          <ambientLight intensity={0.5} color="#0c1633" />

          {/* Key Electric Cyan Light */}
          <pointLight position={[-4, 3, 4]} intensity={2.8} color="#00f2fe" distance={12} />

          {/* Fill Electric Violet Light */}
          <pointLight position={[4, -3, 3]} intensity={2.8} color="#8a2be2" distance={12} />

          {/* Rim Deep Blue Accent */}
          <pointLight position={[0, 4, -3]} intensity={1.5} color="#38bdf8" distance={10} />

          {/* Front Soft White Fill */}
          <directionalLight position={[0, 0, 5]} intensity={0.6} color="#ffffff" />

          {/* The 3D Interactive Cybernetic Rig */}
          <SceneRig />
        </Canvas>
      </Suspense>

      {/* Interactive Helper Cue */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none text-center">
        <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
          Interactive 3D • Move cursor to explore
        </span>
      </div>
    </div>
  );
};
