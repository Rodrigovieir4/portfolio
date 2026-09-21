'use client';

import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody, type IntersectionEnterPayload } from '@react-three/rapier';
import { useRef, type ReactNode } from 'react';
import type { Mesh, MeshBasicMaterial } from 'three';

import type { HotspotId, InteractableConfig, InteractableId } from '../hotspots';
import { useGameStore } from '../store';
import { FurnitureFor } from './furniture';

const SIGNAL = '#c8f751';

function isPlayer({ other }: IntersectionEnterPayload): boolean {
  return other.rigidBodyObject?.name === 'player';
}

/**
 * Um objeto interativo: os colisores do móvel, a área de proximidade, o anel
 * no chão e o losango flutuante.
 *
 * A interação é por proximidade. Pisar na área acende o anel e a dica, e o
 * próprio móvel reage; é isso que dá motivo para andar pelo quarto em vez de
 * clicar de longe.
 */
export function Interactable({
  config,
  hidden,
  children,
}: {
  config: InteractableConfig & { id: InteractableId };
  /** A parede onde o objeto está pendurado está rebaixada: o visual some. */
  hidden: boolean;
  /** Visual do objeto. Sem ele, usa o visual registrado para o id. */
  children?: ReactNode;
}) {
  const setNearby = useGameStore((state) => state.setNearby);
  const near = useGameStore((state) => state.nearby === config.id);
  const visited = useGameStore((state) => (state.visited as readonly string[]).includes(config.id));
  const marker = useRef<Mesh>(null);
  const ring = useRef<MeshBasicMaterial>(null);

  const { zone } = config;

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const mesh = marker.current;
    if (mesh && config.marker) {
      mesh.position.y = config.marker[1] + Math.sin(t * 2.2) * 0.08;
      mesh.rotation.y = t * 1.4;
      const scale = near ? 1.35 : 1;
      mesh.scale.setScalar(mesh.scale.x + (scale - mesh.scale.x) * Math.min(1, delta * 10));
    }
    const material = ring.current;
    if (material) {
      const target = near ? 0.45 + Math.sin(t * 4) * 0.12 : 0;
      material.opacity += (target - material.opacity) * Math.min(1, delta * 10);
    }
  });

  return (
    <RigidBody type="fixed" colliders={false}>
      {config.bodies.map((body, index) => (
        <CuboidCollider key={index} args={body.halfSize} position={body.position} />
      ))}

      <CuboidCollider
        sensor
        args={zone.halfSize}
        position={zone.position}
        onIntersectionEnter={(payload) => {
          if (isPlayer(payload)) setNearby(config.id);
        }}
        onIntersectionExit={(payload) => {
          if (!isPlayer(payload)) return;
          // Só limpa se ainda for este: ao passar de uma área para outra
          // vizinha, a saída de uma pode chegar depois da entrada da outra.
          if (useGameStore.getState().nearby === config.id) setNearby(null);
        }}
      />

      <group visible={!hidden}>{children ?? <FurnitureFor id={config.id} near={near} />}</group>

      {/* Anel no chão, do tamanho da área: mostra onde parar. */}
      <mesh
        position={[zone.position[0], 0.02, zone.position[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[zone.halfSize[0], zone.halfSize[2], 1]}
      >
        <ringGeometry args={[0.86, 1, 40]} />
        <meshBasicMaterial
          ref={ring}
          color={SIGNAL}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {config.marker && (
        <mesh ref={marker} position={config.marker}>
          <octahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial
            color={visited ? '#4d5567' : SIGNAL}
            emissive={visited ? '#000000' : SIGNAL}
            emissiveIntensity={visited ? 0 : 1.2}
          />
        </mesh>
      )}
    </RigidBody>
  );
}

export type { HotspotId };
