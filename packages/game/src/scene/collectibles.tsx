'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { InstancedMesh, Object3D } from 'three';
import { Matrix4, Object3D as ThreeObject3D } from 'three';

import { COMMITS } from '../collectibles';
import { useGameStore } from '../store';
import { boxMaterial, unitBox } from './resources';

const HIDDEN = new Matrix4().makeScale(0, 0, 0);
const SIZE = 0.18;

/**
 * Os doze commits espalhados pelo chão, desenhados de uma vez só.
 *
 * São doze cubos idênticos que giram e flutuam. Como malha separada, eram doze
 * chamadas de desenho por quadro; como malha instanciada, é uma. A posição de
 * cada um vai numa matriz que a placa de vídeo lê, e o custo de atualizar as
 * doze matrizes por quadro na CPU é irrelevante perto de doze idas e voltas à
 * placa.
 *
 * Quem coleta é o personagem, que pergunta ao mundo quais áreas está tocando.
 * Aqui o coletado só vira escala zero, que a placa descarta sem desenhar.
 */
export function Collectibles() {
  const mesh = useRef<InstancedMesh>(null);
  const collected = useGameStore((state) => state.collected);
  const dummy = useRef<Object3D>(new ThreeObject3D());

  useFrame(({ clock }) => {
    const instanced = mesh.current;
    if (!instanced) return;
    const time = clock.elapsedTime;
    const node = dummy.current;

    COMMITS.forEach((commit, index) => {
      if (collected.includes(commit.id)) {
        instanced.setMatrixAt(index, HIDDEN);
        return;
      }
      // Cada um tem a própria fase, tirada da posição, para os doze não subirem
      // e descerem em uníssono como um cardume.
      const t = time + commit.position[0] * 1.7 + commit.position[2] * 0.9;
      node.position.set(
        commit.position[0],
        commit.position[1] + Math.sin(t * 2.4) * 0.07,
        commit.position[2],
      );
      node.rotation.set(Math.sin(t) * 0.3, t * 1.8, 0);
      node.scale.setScalar(SIZE);
      node.updateMatrix();
      instanced.setMatrixAt(index, node.matrix);
    });
    instanced.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[
        unitBox,
        boxMaterial('#c8f751', { emissive: '#c8f751', emissiveIntensity: 1.6 }),
        COMMITS.length,
      ]}
      castShadow
      // O conjunto ocupa o quarto inteiro; recortar pelo campo de visão de uma
      // caixa que contém tudo só daria trabalho e nenhum ganho.
      frustumCulled={false}
    />
  );
}
