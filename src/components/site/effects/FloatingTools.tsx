import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';

export function FloatingTools() {
  const scroll = useScroll();
  const group = useRef<THREE.Group>(null);

  const tools = useMemo(() => [
    { position: [-2, 2, -1], color: '#f59e0b', scale: 0.2 }, // Hammer-ish
    { position: [2, -2, -2], color: '#71717a', scale: 0.15 }, // Wrench-ish
    { position: [-3, -1, -3], color: '#f59e0b', scale: 0.1 }, // Screwdriver-ish
    { position: [3, 2, -4], color: '#71717a', scale: 0.25 }, // Drill-ish
  ], []);

  useFrame((state) => {
    if (!group.current) return;
    
    // Rotate based on time
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = t * 0.1;
    
    // Move group based on scroll
    const scrollOffset = scroll.offset;
    group.current.position.y = scrollOffset * 10;
  });

  return (
    <group ref={group}>
      {tools.map((tool, i) => (
        <mesh key={i} position={tool.position as any} scale={tool.scale}>
          <boxGeometry args={[1, 4, 1]} />
          <meshStandardMaterial color={tool.color} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}
