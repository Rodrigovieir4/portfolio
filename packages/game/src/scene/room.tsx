'use client';

import { useMemo } from 'react';
import { RepeatWrapping } from 'three';

import { LAMP, type WallId } from '../hotspots';
import { useGameStore } from '../store';
import { ROOM, WALLS } from '../world';
import { yawForStep } from './camera-rig';
import { Door, FloorLamp } from './furniture';
import { Interactable } from './hotspot';
import { boxMaterial, unitBox, unitCone, unitPlane, unitRock } from './resources';
import { floorPlanks } from './textures';

const { half: HALF, height: HEIGHT, cutHeight: CUT_HEIGHT } = ROOM;

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
 * Chão, paredes e móveis que só compõem o cenário.
 *
 * Nada aqui cria colisor: as caixas que barram o caminho vivem em world.ts, e
 * é de lá que tanto o desenho quanto a física saem. A parede aparece rebaixada
 * do lado da câmera, mas a caixa dela continua da altura cheia — bola chutada
 * alto não foge por cima.
 */
export function Room() {
  const front = useFrontWalls();
  const lampOn = useGameStore((state) => state.lampOn);

  const floorMaterial = useMemo(() => {
    const texture = floorPlanks();
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(2.5, 2.5);
    texture.needsUpdate = true;
    const material = boxMaterial('#ffffff', { roughness: 0.9, flatShading: false }).clone();
    material.map = texture;
    return material;
  }, []);

  return (
    <group>
      <mesh
        geometry={unitPlane}
        material={floorMaterial}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[HALF * 2, HALF * 2, 1]}
        receiveShadow
      />

      {/* Tapete central: só visual, marca o meio do quarto. */}
      <mesh
        geometry={unitPlane}
        material={boxMaterial('#2c2440', { roughness: 1 })}
        position={[0.3, 0.008, 0.9]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[3.4, 2.4, 1]}
        receiveShadow
      />

      {WALLS.map((wall) => {
        const isFront = front.has(wall.id);
        const visibleHeight = isFront ? CUT_HEIGHT : HEIGHT;
        const alongX = wall.outward[0] === 0;
        return (
          <group key={wall.id}>
            <mesh
              geometry={unitBox}
              material={boxMaterial(isFront ? '#3a4256' : '#2b3244', { roughness: 0.95 })}
              position={[wall.position[0], visibleHeight / 2, wall.position[1]]}
              scale={[wall.halfSize[0] * 2, visibleHeight, wall.halfSize[1] * 2]}
              castShadow
              receiveShadow
            />
            {/* Rodapé: faixa escura que dá base às paredes do fundo. */}
            {!isFront && (
              <mesh
                geometry={unitBox}
                material={boxMaterial('#1a1f2b')}
                position={[
                  wall.position[0] - wall.outward[0] * 0.11,
                  0.08,
                  wall.position[1] - wall.outward[1] * 0.11,
                ]}
                scale={[alongX ? HALF * 2 : 0.02, 0.16, alongX ? 0.02 : HALF * 2]}
              />
            )}
          </group>
        );
      })}

      {!front.has('oeste') && <MoonWindow />}
      {!front.has('sul') && <Door />}

      <Bed />
      <Plant position={[-0.55, 0, -4.6]} scale={0.8} />
      <Plant position={[4.6, 0, -4.6]} scale={1.1} />

      <Interactable config={LAMP} hidden={false}>
        <FloorLamp on={lampOn} />
      </Interactable>
    </group>
  );
}

/** Janela na parede oeste, com o azul do luar vindo de fora. */
function MoonWindow() {
  const frame = boxMaterial('#4a3a2a');
  return (
    <group position={[-4.94, 1.6, -3.3]} rotation={[0, Math.PI / 2, 0]}>
      <mesh geometry={unitBox} material={frame} scale={[1.3, 1.1, 0.04]} />
      <mesh
        geometry={unitPlane}
        position={[0, 0, 0.025]}
        scale={[1.18, 0.98, 1]}
        material={boxMaterial('#5a70c4', { emissive: '#5a70c4', emissiveIntensity: 0.9 })}
      />
      <mesh
        geometry={unitRock}
        position={[0.3, 0.22, 0.03]}
        scale={0.2}
        material={boxMaterial('#f4f2e6', { emissive: '#f4f2e6', emissiveIntensity: 1.1 })}
      />
      <mesh geometry={unitBox} material={frame} position={[0, 0, 0.04]} scale={[0.04, 1, 0.02]} />
      <mesh geometry={unitBox} material={frame} position={[0, 0, 0.04]} scale={[1.2, 0.04, 0.02]} />
    </group>
  );
}

function Bed() {
  const wood = boxMaterial('#3a2f28');
  return (
    <group position={[-3.9, 0, 3.3]}>
      <mesh
        geometry={unitBox}
        material={wood}
        position={[0, 0.15, 0]}
        scale={[1.9, 0.3, 2.5]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={unitBox}
        material={boxMaterial('#cfd4de')}
        position={[0, 0.39, 0]}
        scale={[1.78, 0.18, 2.38]}
        castShadow
        receiveShadow
      />
      {/* Cobertor dobrado até a metade, com a faixa na cor do tema. */}
      <mesh
        geometry={unitBox}
        material={boxMaterial('#3b3350')}
        position={[0, 0.5, -0.45]}
        scale={[1.82, 0.06, 1.5]}
        castShadow
      />
      <mesh
        geometry={unitBox}
        material={boxMaterial('#c8f751')}
        position={[0, 0.54, 0.3]}
        scale={[1.82, 0.08, 0.14]}
        castShadow
      />
      {/* Travesseiro e cabeceira, junto da parede sul. */}
      <mesh
        geometry={unitBox}
        material={boxMaterial('#eef1f6')}
        position={[0, 0.54, 0.95]}
        scale={[1.1, 0.12, 0.42]}
        castShadow
      />
      <mesh
        geometry={unitBox}
        material={wood}
        position={[0, 0.6, 1.2]}
        scale={[1.9, 0.9, 0.08]}
        castShadow
      />
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
      <mesh
        geometry={unitCone}
        material={boxMaterial('#8a5a3c')}
        position={[0, 0.2, 0]}
        scale={[0.4, 0.4, 0.4]}
        castShadow
      />
      {leaves.map(([x, y, z, size], index) => (
        <mesh
          key={index}
          geometry={unitRock}
          material={boxMaterial(index % 2 ? '#3f7a3a' : '#4f9446')}
          position={[x, y, z]}
          scale={size * 2}
          castShadow
        />
      ))}
    </group>
  );
}
