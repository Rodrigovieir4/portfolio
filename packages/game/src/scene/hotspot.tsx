'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, type ReactNode } from 'react';
import type { Mesh, MeshBasicMaterial } from 'three';

import type { HotspotId, InteractableConfig, InteractableId } from '../hotspots';
import { useGameStore } from '../store';
import { FurnitureFor } from './furniture';
import { boxMaterial, unitMarker, unitRing } from './resources';

const SIGNAL = '#c8f751';

/**
 * Um objeto interativo: o visual do móvel, o anel no chão e o losango que
 * flutua por cima.
 *
 * Quem decide se o personagem está perto é o próprio personagem, que a cada
 * quadro pergunta ao mundo quais áreas o quadrado dele toca. Aqui só se
 * desenha o resultado. Antes a conta era ao contrário: cada objeto tinha um
 * corpo de física com sensor e avisava por evento de entrada e saída. Dava o
 * mesmo efeito por um preço alto — oito corpos rígidos no motor e a ordem dos
 * eventos para acertar quando duas áreas encostam uma na outra.
 *
 * A interação continua sendo por proximidade: pisar na área acende o anel e a
 * dica, e é isso que dá motivo para andar pelo quarto em vez de clicar de longe.
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
      // Anel apagado não precisa entrar na fila de desenho.
      if (material.opacity < 0.01) material.visible = false;
      else material.visible = true;
    }
  });

  return (
    <group>
      <group visible={!hidden}>{children ?? <FurnitureFor id={config.id} near={near} />}</group>

      {/* Anel no chão, do tamanho da área: mostra onde parar. */}
      <mesh
        geometry={unitRing}
        position={[zone.position[0], 0.02, zone.position[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[zone.halfSize[0], zone.halfSize[2], 1]}
      >
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
        <mesh
          ref={marker}
          position={config.marker}
          geometry={unitMarker}
          material={
            visited
              ? boxMaterial('#4d5567', { flatShading: false })
              : boxMaterial(SIGNAL, {
                  emissive: SIGNAL,
                  emissiveIntensity: 1.2,
                  flatShading: false,
                })
          }
        />
      )}
    </group>
  );
}

export type { HotspotId };
