import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const StarField: React.FC = () => {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(8000 * 3); // Augmenté de 5000 à 8000 étoiles
    const colors = new Float32Array(8000 * 3);
    
    for (let i = 0; i < 8000; i++) {
      // Créer une distribution sphérique d'étoiles
      const radius = Math.random() * 150 + 80; // Étendu la zone
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Types d'étoiles variés avec plus de couleurs
      const starType = Math.random();
      if (starType < 0.4) {
        // Étoiles blanches
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else if (starType < 0.6) {
        // Étoiles bleues
        colors[i * 3] = 0.6;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1;
      } else if (starType < 0.75) {
        // Étoiles jaunes
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 0.6;
      } else if (starType < 0.9) {
        // Étoiles rouges
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.6;
        colors[i * 3 + 2] = 0.6;
      } else {
        // Étoiles violettes
        colors[i * 3] = 0.8;
        colors[i * 3 + 1] = 0.6;
        colors[i * 3 + 2] = 1;
      }
    }
    return [positions, colors];
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 25;
      ref.current.rotation.y -= delta / 35;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={1.2}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.9}
      />
    </Points>
  );
};

const Moon: React.FC = () => {
  const moonRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (moonRef.current) {
      // Orbite lunaire lente et majestueuse
      moonRef.current.position.x = Math.sin(time * 0.05) * 40;
      moonRef.current.position.y = Math.cos(time * 0.03) * 25;
      moonRef.current.position.z = Math.sin(time * 0.04) * 30;
      moonRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <Sphere ref={moonRef} args={[3.5, 32, 32]} position={[30, 15, 20]}>
      <meshStandardMaterial
        color="#e5e7eb"
        transparent
        opacity={0.8}
        roughness={0.8}
        metalness={0.1}
        emissive="#9ca3af"
        emissiveIntensity={0.15}
      />
    </Sphere>
  );
};

const SpacePlanets: React.FC = () => {
  const planet1Ref = useRef<THREE.Mesh>(null); // Planète bleue (Terre-like)
  const planet2Ref = useRef<THREE.Mesh>(null); // Planète violette (Jupiter-like)
  const planet3Ref = useRef<THREE.Mesh>(null); // Planète teal (Neptune-like)
  const planet4Ref = useRef<THREE.Mesh>(null); // Planète rouge (Mars-like)
  const planet5Ref = useRef<THREE.Mesh>(null); // Planète dorée (Vénus-like)
  const planet6Ref = useRef<THREE.Mesh>(null); // Planète verte (exoplanète)

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Planète bleue - orbite proche
    if (planet1Ref.current) {
      planet1Ref.current.position.x = Math.sin(time * 0.2) * 18;
      planet1Ref.current.position.y = Math.cos(time * 0.15) * 12;
      planet1Ref.current.position.z = Math.sin(time * 0.1) * 10;
      planet1Ref.current.rotation.y = time * 0.5;
    }
    
    // Planète violette - orbite moyenne
    if (planet2Ref.current) {
      planet2Ref.current.position.x = Math.cos(time * 0.12) * 28;
      planet2Ref.current.position.y = Math.sin(time * 0.18) * 16;
      planet2Ref.current.position.z = Math.cos(time * 0.14) * 22;
      planet2Ref.current.rotation.y = time * 0.3;
    }
    
    // Planète teal - orbite lointaine
    if (planet3Ref.current) {
      planet3Ref.current.position.x = Math.sin(time * 0.08) * 35;
      planet3Ref.current.position.y = Math.cos(time * 0.12) * 20;
      planet3Ref.current.position.z = Math.sin(time * 0.09) * 28;
      planet3Ref.current.rotation.y = time * 0.4;
    }

    // Planète rouge - orbite elliptique
    if (planet4Ref.current) {
      planet4Ref.current.position.x = Math.sin(time * 0.16) * 25;
      planet4Ref.current.position.y = Math.cos(time * 0.11) * 18;
      planet4Ref.current.position.z = Math.sin(time * 0.13) * 15;
      planet4Ref.current.rotation.y = time * 0.6;
    }

    // Planète dorée - orbite haute
    if (planet5Ref.current) {
      planet5Ref.current.position.x = Math.cos(time * 0.07) * 32;
      planet5Ref.current.position.y = Math.sin(time * 0.09) * 25;
      planet5Ref.current.position.z = Math.cos(time * 0.06) * 20;
      planet5Ref.current.rotation.y = time * 0.25;
    }

    // Planète verte - orbite distante
    if (planet6Ref.current) {
      planet6Ref.current.position.x = Math.sin(time * 0.05) * 45;
      planet6Ref.current.position.y = Math.cos(time * 0.07) * 30;
      planet6Ref.current.position.z = Math.sin(time * 0.04) * 35;
      planet6Ref.current.rotation.y = time * 0.2;
    }
  });

  return (
    <>
      {/* Planète bleue - Terre-like */}
      <Sphere ref={planet1Ref} args={[2.2, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.6}
          roughness={0.2}
          metalness={0.8}
          emissive="#1e40af"
          emissiveIntensity={0.3}
        />
      </Sphere>
      
      {/* Planète violette - Jupiter-like */}
      <Sphere ref={planet2Ref} args={[2.8, 32, 32]} position={[20, 0, 0]}>
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.5}
          roughness={0.3}
          metalness={0.7}
          emissive="#7c3aed"
          emissiveIntensity={0.4}
        />
      </Sphere>
      
      {/* Planète teal - Neptune-like */}
      <Sphere ref={planet3Ref} args={[1.8, 32, 32]} position={[-15, 0, 0]}>
        <meshStandardMaterial
          color="#14b8a6"
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.9}
          emissive="#0d9488"
          emissiveIntensity={0.35}
        />
      </Sphere>

      {/* Planète rouge - Mars-like */}
      <Sphere ref={planet4Ref} args={[1.5, 32, 32]} position={[12, 8, -10]}>
        <meshStandardMaterial
          color="#ef4444"
          transparent
          opacity={0.7}
          roughness={0.6}
          metalness={0.4}
          emissive="#dc2626"
          emissiveIntensity={0.25}
        />
      </Sphere>

      {/* Planète dorée - Vénus-like */}
      <Sphere ref={planet5Ref} args={[2.0, 32, 32]} position={[-25, 12, 8]}>
        <meshStandardMaterial
          color="#f59e0b"
          transparent
          opacity={0.6}
          roughness={0.2}
          metalness={0.8}
          emissive="#d97706"
          emissiveIntensity={0.4}
        />
      </Sphere>

      {/* Planète verte - Exoplanète */}
      <Sphere ref={planet6Ref} args={[1.6, 32, 32]} position={[30, -15, 25]}>
        <meshStandardMaterial
          color="#10b981"
          transparent
          opacity={0.5}
          roughness={0.4}
          metalness={0.6}
          emissive="#059669"
          emissiveIntensity={0.3}
        />
      </Sphere>
    </>
  );
};

const ThreeBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 50], fov: 75 }}
        style={{ 
          background: 'radial-gradient(ellipse at center, #0f0f23 0%, #050505 70%, #000000 100%)'
        }}
      >
        {/* Éclairage amélioré pour plus de planètes */}
        <ambientLight intensity={0.4} color="#4338ca" />
        <pointLight position={[30, 30, 30]} intensity={1.2} color="#60a5fa" />
        <pointLight position={[-30, -30, -30]} intensity={1.0} color="#a855f7" />
        <pointLight position={[0, 0, 40]} intensity={0.8} color="#06b6d4" />
        <pointLight position={[40, 0, 0]} intensity={0.6} color="#f59e0b" />
        <pointLight position={[-40, 20, 20]} intensity={0.7} color="#10b981" />
        
        <StarField />
        <Moon />
        <SpacePlanets />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;