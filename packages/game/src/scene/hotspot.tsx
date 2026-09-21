'use client';

import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody, type IntersectionEnterPayload } from '@react-three/rapier';
import { useRef } from 'react';
import type { Mesh } from 'three';

import type { HotspotConfig, HotspotId } from '../hotspots';
import { useGameStore } from '../store';

const SIGNAL = '#c8f751';

function isPlayer({ other }: IntersectionEnterPayload): boolean {
  return other.rigidBodyObject?.name === 'player';
}

/**
 * Um objeto interativo: o móvel sólido, a área de proximidade e o marcador.
 *
 * A interação é por proximidade, não por clique no objeto. Pisar na área faz
 * o objeto reagir e acende a dica; é isso que dá motivo para andar pelo
 * quarto em vez de só clicar de longe.
 */
export function Hotspot({ config }: { config: HotspotConfig & { id: HotspotId } }) {
  const setNearby = useGameStore((state) => state.setNearby);
  const isNear = useGameStore((state) => state.nearby === config.id);
  const visited = useGameStore((state) => state.visited.includes(config.id));
  const marker = useRef<Mesh>(null);

  const { body, zone } = config;
  const markerHeight = body.position[1] + body.halfSize[1] + 0.6;

  useFrame(({ clock }) => {
    const mesh = marker.current;
    if (!mesh) return;
    const t = clock.elapsedTime;
    mesh.position.y = markerHeight + Math.sin(t * 2.2) * 0.08;
    mesh.rotation.y = t * 1.4;
    const scale = isNear ? 1.35 : 1;
    mesh.scale.setScalar(mesh.scale.x + (scale - mesh.scale.x) * 0.2);
  });

  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={body.halfSize} position={body.position} />
      <mesh position={body.position} castShadow receiveShadow>
        <boxGeometry args={[body.halfSize[0] * 2, body.halfSize[1] * 2, body.halfSize[2] * 2]} />
        <meshStandardMaterial
          color={body.color}
          emissive={SIGNAL}
          // O objeto acende quando o personagem chega perto, e não antes.
          emissiveIntensity={isNear ? 0.12 : 0}
        />
      </mesh>

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

      {/* Losango flutuante. Fica apagado depois da primeira visita. */}
      <mesh ref={marker} position={[body.position[0], markerHeight, body.position[2]]}>
        <octahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial
          color={visited ? '#4d5567' : SIGNAL}
          emissive={visited ? '#000000' : SIGNAL}
          emissiveIntensity={visited ? 0 : 0.8}
        />
      </mesh>
    </RigidBody>
  );
}
