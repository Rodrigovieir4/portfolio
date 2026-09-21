'use client';

import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useMemo } from 'react';
import { RepeatWrapping } from 'three';

import { LAMP, OBSTACLES, type WallId } from '../hotspots';
import { useGameStore } from '../store';
import { yawForStep } from './camera-rig';
import { Door, FloorLamp } from './furniture';
import { Interactable } from './hotspot';
import { floorPlanks } from './textures';

const HALF = 5;
const THICK = 0.1;
const HEIGHT = 2.6;
/** Altura das paredes do lado da câmera. Baixa o bastante para ver o quarto por cima. */
const CUT_HEIGHT = 0.22;

interface Wall {
  id: WallId;
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
 * Quais paredes estão do lado da câmera agora.
 *
 * Uma parede é "da frente" quando a direção que aponta para fora dela aponta
 * também para a câmera. Essas são rebaixadas, e o que está pendurado nelas
 * some junto: sem isso, metade do quarto ficaria escondida atrás delas.
 */
export function useFrontWalls(): ReadonlySet<WallId> {
  const cameraStep = useGameStore((state) => state.cameraStep);
  return useMemo(() => {
    const yaw = yawForStep(cameraStep);
    const toCamera = [Math.sin(yaw), Math.cos(yaw)] as const;
    return new Set(
      WALLS.filter((wall) => wall.outward[0] * toCamera[0] + wall.outward[1] * toCamera[1] > 0).map(
        (wall) => wall.id,
      ),
    );
  }, [cameraStep]);
}

/**
 * Chão, paredes e tudo que só atrapalha o caminho.
 *
 * O colisor das paredes é sempre da altura cheia, mesmo quando a parede
 * aparece rebaixada: a bola chutada alto não pode fugir por cima dela.
 */
export function Room() {
  const front = useFrontWalls();
  const lampOn = useGameStore((state) => state.lampOn);

  const floor = useMemo(() => {
    const texture = floorPlanks().clone();
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(2.5, 2.5);
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <group>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[HALF, 0.1, HALF]} position={[0, -0.1, 0]} friction={1} />
        <mesh position={[0, -0.05, 0]} receiveShadow>
          <boxGeometry args={[HALF * 2, 0.1, HALF * 2]} />
          <meshStandardMaterial map={floor} roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Tapete central: só visual, marca o meio do quarto. */}
      <mesh position={[0.3, 0.008, 0.9]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.4, 2.4]} />
        <meshStandardMaterial color="#2c2440" roughness={1} />
      </mesh>

      {WALLS.map((wall) => {
        const isFront = front.has(wall.id);
        const visibleHeight = isFront ? CUT_HEIGHT : HEIGHT;
        const alongX = wall.outward[0] === 0;
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
              <meshStandardMaterial color={isFront ? '#3a4256' : '#2b3244'} roughness={0.95} />
            </mesh>
            {/* Rodapé: faixa escura que dá base às paredes do fundo. */}
            {!isFront && (
              <mesh
                position={[
                  wall.position[0] - wall.outward[0] * 0.11,
                  0.08,
                  wall.position[1] - wall.outward[1] * 0.11,
                ]}
              >
                <boxGeometry args={[alongX ? HALF * 2 : 0.02, 0.16, alongX ? 0.02 : HALF * 2]} />
                <meshStandardMaterial color="#1a1f2b" />
              </mesh>
            )}
          </RigidBody>
        );
      })}

      {!front.has('oeste') && <MoonWindow />}
      {!front.has('sul') && <Door />}

      <Bed />
      <Plant position={[-0.55, 0, -4.6]} scale={0.8} />
      <Plant position={[4.6, 0, -4.6]} scale={1.1} />

      {OBSTACLES.map((box, index) => (
        <RigidBody key={index} type="fixed" colliders={false}>
          <CuboidCollider args={box.halfSize} position={box.position} />
        </RigidBody>
      ))}

      <Interactable config={LAMP} hidden={false}>
        <FloorLamp on={lampOn} />
      </Interactable>
    </group>
  );
}

/** Janela na parede oeste, com o azul do luar vindo de fora. */
function MoonWindow() {
  return (
    <group position={[-4.94, 1.6, -3.3]} rotation={[0, Math.PI / 2, 0]}>
      <mesh>
        <boxGeometry args={[1.3, 1.1, 0.04]} />
        <meshStandardMaterial color="#4a3a2a" />
      </mesh>
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={[1.18, 0.98]} />
        <meshBasicMaterial color="#5a70c4" toneMapped={false} />
      </mesh>
      <mesh position={[0.3, 0.22, 0.03]}>
        <circleGeometry args={[0.1, 16]} />
        <meshBasicMaterial color="#f4f2e6" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[0.04, 1.0, 0.02]} />
        <meshStandardMaterial color="#4a3a2a" />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[1.2, 0.04, 0.02]} />
        <meshStandardMaterial color="#4a3a2a" />
      </mesh>
    </group>
  );
}

function Bed() {
  return (
    <group position={[-3.9, 0, 3.3]}>
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.3, 2.5]} />
        <meshStandardMaterial color="#3a2f28" flatShading />
      </mesh>
      <mesh position={[0, 0.39, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.78, 0.18, 2.38]} />
        <meshStandardMaterial color="#cfd4de" flatShading />
      </mesh>
      {/* Cobertor dobrado até a metade, com a faixa na cor do tema. */}
      <mesh position={[0, 0.5, -0.45]} castShadow>
        <boxGeometry args={[1.82, 0.06, 1.5]} />
        <meshStandardMaterial color="#3b3350" flatShading />
      </mesh>
      <mesh position={[0, 0.54, 0.3]} castShadow>
        <boxGeometry args={[1.82, 0.08, 0.14]} />
        <meshStandardMaterial color="#c8f751" flatShading />
      </mesh>
      {/* Travesseiro e cabeceira, junto da parede sul. */}
      <mesh position={[0, 0.54, 0.95]} castShadow>
        <boxGeometry args={[1.1, 0.12, 0.42]} />
        <meshStandardMaterial color="#eef1f6" flatShading />
      </mesh>
      <mesh position={[0, 0.6, 1.2]} castShadow>
        <boxGeometry args={[1.9, 0.9, 0.08]} />
        <meshStandardMaterial color="#3a2f28" flatShading />
      </mesh>
    </group>
  );
}

function Plant({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const leaves: [number, number, number, number][] = [
    [0, 0.72, 0, 0.32],
    [0.14, 0.58, 0.08, 0.22],
    [-0.12, 0.6, -0.06, 0.24],
    [0.02, 0.95, -0.02, 0.2],
  ];
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.15, 0.4, 8]} />
        <meshStandardMaterial color="#8a5a3c" flatShading />
      </mesh>
      {leaves.map(([x, y, z, size], index) => (
        <mesh key={index} position={[x, y, z]} castShadow>
          <icosahedronGeometry args={[size, 0]} />
          <meshStandardMaterial color={index % 2 ? '#3f7a3a' : '#4f9446'} flatShading />
        </mesh>
      ))}
    </group>
  );
}
