import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isWebGLAvailable, prefersReducedMotion } from '../../utils/webgl';

const MinimalRingMesh: React.FC = () => {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x += delta * 0.4;
      outerRingRef.current.rotation.y += delta * 0.5;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y -= delta * 0.45;
      innerRingRef.current.rotation.z += delta * 0.35;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.6;
      const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
      coreRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      {/* Outer Cyan Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[1.3, 0.04, 16, 48]} />
        <meshStandardMaterial
          color="#00f2fe"
          emissive="#00f2fe"
          emissiveIntensity={1.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Inner Violet Ring */}
      <mesh ref={innerRingRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.95, 0.035, 16, 48]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#8a2be2"
          emissiveIntensity={1.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Pulsing Core Gem */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={1.5}
          wireframe
        />
      </mesh>
    </group>
  );
};

export const ContactOrbFallback: React.FC = () => {
  return (
    <div className="w-24 h-24 relative flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md animate-pulse" />
      <div className="w-16 h-16 rounded-full border border-cyan-400/50 animate-[spin_8s_linear_infinite] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border border-dashed border-purple-400/60 animate-[spin_5s_linear_infinite_reverse] flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f2fe]" />
        </div>
      </div>
    </div>
  );
};

export const ContactOrb: React.FC = () => {
  const [canRender3D, setCanRender3D] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    setCanRender3D(isWebGLAvailable() && !prefersReducedMotion());
    setHasChecked(true);
  }, []);

  if (!hasChecked || !canRender3D) {
    return <ContactOrbFallback />;
  }

  return (
    <div className="w-28 h-28 sm:w-32 sm:h-32 relative select-none">
      <Suspense fallback={<ContactOrbFallback />}>
        <Canvas
          camera={{ position: [0, 0, 3.8], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.4} color="#0c1633" />
          <pointLight position={[-2, 2, 2]} intensity={2.5} color="#00f2fe" />
          <pointLight position={[2, -2, 2]} intensity={2.5} color="#8a2be2" />
          <MinimalRingMesh />
        </Canvas>
      </Suspense>
    </div>
  );
};
