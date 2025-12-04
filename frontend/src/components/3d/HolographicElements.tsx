import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Abstract professional figure (simplified humanoid)
export function AbstractProfessional() {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={meshRef} position={[0, -0.5, 0]}>
      {/* Head */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#60a5fa" wireframe />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 0.8, 16]} />
        <meshStandardMaterial color="#3b82f6" wireframe />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.25, 0.8, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
        <meshStandardMaterial color="#60a5fa" wireframe />
      </mesh>
      <mesh position={[0.25, 0.8, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
        <meshStandardMaterial color="#60a5fa" wireframe />
      </mesh>
    </group>
  );
}

// Glowing platform beneath the figure
export function GlowingPlatform() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.6, 1, 32]} />
      <meshStandardMaterial
        color="#3b82f6"
        emissive="#3b82f6"
        emissiveIntensity={0.5}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

// Scholarship medal icon
export function ScholarshipMedal({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + 0) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <torusGeometry args={[0.12, 0.03, 16, 100]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.1, 32]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

// Graduation cap
export function GraduationCap({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + 1) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.3, 0.02, 0.3]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.3} />
      </mesh>
      <mesh>
        <coneGeometry args={[0.15, 0.1, 4]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

// Globe icon
export function Globe({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + 2) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#22d3ee" wireframe />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.15, 0.01, 16, 100]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// Rocket icon
export function Rocket({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + 3) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={[0, 0, -Math.PI / 4]}>
      <mesh>
        <coneGeometry args={[0.08, 0.3, 4]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 4]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

// AI Agent Orb (pulsing central element)
export function AIAgentOrb({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5;
    
    if (meshRef.current) {
      meshRef.current.scale.setScalar(0.8 + pulse * 0.2);
    }
    
    if (glowRef.current && glowRef.current.material instanceof THREE.MeshStandardMaterial) {
      glowRef.current.material.emissiveIntensity = 0.5 + pulse * 0.5;
      glowRef.current.scale.setScalar(1 + pulse * 0.3);
    }
  });

  return (
    <group position={position}>
      {/* Inner core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.15, 1]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.8}
          wireframe
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}
