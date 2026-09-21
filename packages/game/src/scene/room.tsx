'use client';

import { CuboidCollider, RigidBody } from '@react-three/rapier';

import { useGameStore } from '../store';
import { yawForStep } from './camera-rig';

const HALF = 5;
const THICK = 0.1;
const HEIGHT = 2.6;
/** Altura das paredes do lado da câmera. Baixa o bastante para ver o quarto por cima. */
const CUT_HEIGHT = 0.25;

interface Wall {
  id: string;
  position: [number, number];
  halfSize: [number, number];
  /** Direção que aponta para fora do quarto, no plano do chão. */
  outward: [number, number];
}

const WALLS: Wall[] = [
  {
    id: 'norte',
    position: [0, -HALF - THICK],
    halfSize: [HALF + THICK * 2, THICK],
    outward: [0, -1],
  },
  { id: 'sul', position: [0, HALF + THICK], halfSize: [HALF + THICK * 2, THICK], outward: [0, 1] },
  { id: 'oeste', position: [-HALF - THICK, 0], halfSize: [THICK, HALF], outward: [-1, 0] },
  { id: 'leste', position: [HALF + THICK, 0], halfSize: [THICK, HALF], outward: [1, 0] },
];

/**
 * Chão, paredes e móveis que só atrapalham o caminho.
 *
 * As paredes do lado da câmera ficam baixinhas, como no Sims: sem isso metade
 * do quarto some atrás delas. O colisor, porém, é sempre da altura cheia, para
 * a bola chutada alto não fugir por cima da parede rebaixada.
 */
export function Room() {
  const cameraStep = useGameStore((state) => state.cameraStep);
  const yaw = yawForStep(cameraStep);
  const towardCamera: [number, number] = [Math.sin(yaw), Math.cos(yaw)];

  return (
    <group>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[HALF, 0.1, HALF]} position={[0, -0.1, 0]} friction={1} />
        <mesh position={[0, -0.05, 0]} receiveShadow>
          <boxGeometry args={[HALF * 2, 0.1, HALF * 2]} />
          <meshStandardMaterial color="#2a3040" />
        </mesh>
      </RigidBody>

      {/* Tapete: só visual, marca o centro do quarto. */}
      <mesh position={[0, 0.01, 1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 2.2]} />
        <meshStandardMaterial color="#2c2440" />
      </mesh>

      {WALLS.map((wall) => {
        const isFront = wall.outward[0] * towardCamera[0] + wall.outward[1] * towardCamera[1] > 0;
        const visibleHeight = isFront ? CUT_HEIGHT : HEIGHT;

        return (
          <RigidBody key={wall.id} type="fixed" colliders={false}>
            <CuboidCollider
              args={[wall.halfSize[0], HEIGHT / 2, wall.halfSize[1]]}
              position={[wall.position[0], HEIGHT / 2, wall.position[1]]}
            />
            <mesh
              position={[wall.position[0], visibleHeight / 2, wall.position[1]]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[wall.halfSize[0] * 2, visibleHeight, wall.halfSize[1] * 2]} />
              <meshStandardMaterial color={isFront ? '#3a4256' : '#323a4d'} />
            </mesh>
          </RigidBody>
        );
      })}

      <Obstacle position={[-3.7, 0.3, 2.6]} halfSize={[0.9, 0.3, 1.3]} color="#39415a" />
      <Obstacle position={[-3.7, 0.45, 3.65]} halfSize={[0.9, 0.15, 0.25]} color="#e9ecf2" />
    </group>
  );
}

function Obstacle({
  position,
  halfSize,
  color,
}: {
  position: [number, number, number];
  halfSize: [number, number, number];
  color: string;
}) {
  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      <CuboidCollider args={halfSize} />
      <mesh castShadow receiveShadow>
        <boxGeometry args={[halfSize[0] * 2, halfSize[1] * 2, halfSize[2] * 2]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
}
