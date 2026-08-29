import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Sphere, MeshDistortMaterial, ScrollControls, Scroll } from '@react-three/drei';
import { FloatingTools } from './FloatingTools';
import * as THREE from 'three';

function BackgroundElements() {
  const { viewport } = useThree();
  
  return (
    <>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1, 64, 64]} position={[-viewport.width / 4, viewport.height / 4, -2]}>
          <MeshDistortMaterial
            color="var(--brand)"
            speed={3}
            distort={0.4}
            radius={1}
            opacity={0.15}
            transparent
          />
        </Sphere>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.2}>
        <Sphere args={[1.5, 64, 64]} position={[viewport.width / 3, -viewport.height / 3, -4]}>
          <MeshDistortMaterial
            color="var(--steel)"
            speed={2}
            distort={0.3}
            radius={1}
            opacity={0.1}
            transparent
          />
        </Sphere>
      </Float>
    </>
  );
}

function Scene() {
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const { x, y } = state.mouse;
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, x * 0.2, 0.1);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, y * 0.2, 0.1);
    
    state.camera.position.x = mouse.current.x;
    state.camera.position.y = mouse.current.y;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <ScrollControls damping={0.2} pages={5}>
        <BackgroundElements />
        <FloatingTools />
      </ScrollControls>
      {/* Using light instead of HDRI preset to avoid 429 errors from GitHub/drei-assets */}
      <Environment background={false}>
        <mesh scale={100}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial color="#1a1a1a" side={THREE.BackSide} />
        </mesh>
      </Environment>
    </>
  );
}

export function ThreeScene() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-40 dark:opacity-20">
      <Canvas dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  );
}
