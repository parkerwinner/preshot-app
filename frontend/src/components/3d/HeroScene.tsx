import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import {
  AbstractProfessional,
  GlowingPlatform,
  ScholarshipMedal,
  GraduationCap,
  Globe,
  Rocket,
  AIAgentOrb,
} from './HolographicElements';

// Mouse parallax camera controller
function CameraController() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    // Smooth interpolation for parallax effect
    target.current.x += (mouse.current.x * 0.5 - target.current.x) * 0.05;
    target.current.y += (mouse.current.y * 0.3 - target.current.y) * 0.05;

    camera.position.x = target.current.x;
    camera.position.y = 0.5 + target.current.y * 0.5;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Ambient particles
function Particles() {
  const count = 100;
  const mesh = useRef<THREE.Points>(null);

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#60a5fa"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Main 3D Scene content
function SceneContent() {
  return (
    <>
      {/* Camera with parallax controller */}
      <PerspectiveCamera makeDefault position={[0, 0.5, 5]} fov={45} />
      <CameraController />

      {/* Lighting - enhanced for visibility */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-3, 3, 2]} intensity={0.8} color="#3b82f6" />
      <pointLight position={[3, 2, -2]} intensity={0.6} color="#22d3ee" />
      <pointLight position={[0, -1, 3]} intensity={0.4} color="#60a5fa" />
      <spotLight
        position={[0, 5, 0]}
        angle={0.6}
        penumbra={1}
        intensity={0.8}
        color="#60a5fa"
        castShadow
      />

      {/* Main scene elements */}
      <AbstractProfessional />
      <GlowingPlatform />

      {/* Floating holographic elements */}
      <ScholarshipMedal position={[-1.8, 0.8, 0.5]} />
      <GraduationCap position={[1.8, 1.2, 0.3]} />
      <Globe position={[-1.5, -0.2, 1]} />
      <Rocket position={[1.6, 0.3, 0.8]} />
      <AIAgentOrb position={[0, 0.5, 0]} />

      {/* Background elements */}
      <Particles />
      <Stars
        radius={50}
        depth={50}
        count={1000}
        factor={2}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Subtle environment for reflections */}
      <Environment preset="night" />
    </>
  );
}

// Loading fallback
function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#3b82f6" wireframe />
    </mesh>
  );
}

// Main exported component
export default function HeroScene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl }) => {
          // Handle context loss gracefully
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            console.warn('WebGL context lost. Will attempt to restore...');
          });
          
          gl.domElement.addEventListener('webglcontextrestored', () => {
            console.log('WebGL context restored successfully');
          });
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<Loader />}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
