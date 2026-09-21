'use client';

import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useRef } from 'react';
import type { Mesh } from 'three';

import { COMMITS } from '../collectibles';
import type { Vec3 } from '../hotspots';
import { useGameStore } from '../store';

/**
 * Um commit no chão: um quadradinho verde que gira e flutua.
 *
 * Cada um tem a própria fase de animação, calculada da posição, para os doze
 * não subirem e descerem em uníssono como um cardume.
 */
function Commit({ id, position }: { id: string; position: Vec3 }) {
  const collect = useGameStore((state) => state.collect);
  const collected = useGameStore((state) => state.collected.includes(id));
  const mesh = useRef<Mesh>(null);
  const offset = position[0] * 1.7 + position[2] * 0.9;

  useFrame(({ clock }) => {
    const cube = mesh.current;
    if (!cube) return;
    const t = clock.elapsedTime + offset;
    cube.position.y = position[1] + Math.sin(t * 2.4) * 0.07;
    cube.rotation.y = t * 1.8;
    cube.rotation.x = Math.sin(t) * 0.3;
  });

  // Coletado, some de vez, colisor incluso.
  if (collected) return null;

  return (
    <RigidBody type="fixed" colliders={false} position={[position[0], 0, position[2]]}>
      <CuboidCollider
        sensor
        args={[0.22, 0.4, 0.22]}
        position={[0, 0.4, 0]}
        onIntersectionEnter={({ other }) => {
          if (other.rigidBodyObject?.name === 'player') collect(id);
        }}
      />
      <mesh ref={mesh} position={[0, position[1], 0]} castShadow>
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshStandardMaterial color="#c8f751" emissive="#c8f751" emissiveIntensity={1.6} />
      </mesh>
    </RigidBody>
  );
}

export function Collectibles() {
  return (
    <>
      {COMMITS.map((commit) => (
        <Commit key={commit.id} id={commit.id} position={commit.position} />
      ))}
    </>
  );
}
