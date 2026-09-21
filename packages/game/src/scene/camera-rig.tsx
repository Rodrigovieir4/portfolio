'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { OrthographicCamera, Vector3 } from 'three';

import { runtime } from '../runtime';
import { useGameStore } from '../store';

/** Elevação da vista isométrica clássica: arctan(1/√2), cerca de 35,26 graus. */
const PITCH = Math.atan(1 / Math.SQRT2);
const DISTANCE = 24;
/** Vetor de trabalho reaproveitado, para não alocar um objeto novo por quadro. */
const followPoint = new Vector3();

/** Ângulo da câmera para um passo de giro. O passo 0 olha da quina +x +z. */
export function yawForStep(step: number): number {
  return Math.PI / 4 + step * (Math.PI / 2);
}

/**
 * Câmera ortográfica que segue o personagem.
 *
 * Ortográfica é o que dá o visual de Sims: objeto longe e perto têm o mesmo
 * tamanho, e o quarto parece uma maquete. O giro vem em passos de 90 graus e
 * é suavizado; como o passo só soma ou subtrai, o ângulo alvo nunca dá a volta
 * de 360 para 0 e a câmera nunca gira pelo caminho longo.
 */
export function CameraRig() {
  const target = useRef(new Vector3(0, 0, 2));
  const lastFit = useRef(0);

  useFrame(({ camera, size }, delta) => {
    // Em vista isométrica o quarto de 10 por 10 ocupa cerca de 14 unidades de
    // largura na tela e 10 de altura. O zoom é o que couber nos dois eixos, com
    // folga, para o quarto aparecer inteiro no monitor deitado e no celular em
    // pé. Só recalcula quando a tela muda, porque atualizar a projeção a cada
    // quadro é trabalho à toa.
    const fit = Math.min(size.width / 16, size.height / 12.5);
    if (fit !== lastFit.current && camera instanceof OrthographicCamera) {
      lastFit.current = fit;
      camera.zoom = fit;
      camera.updateProjectionMatrix();
    }

    const step = Math.min(delta, 1 / 30);
    const goalYaw = yawForStep(useGameStore.getState().cameraStep);

    runtime.cameraYaw += (goalYaw - runtime.cameraYaw) * Math.min(1, step * 8);

    // Segue o personagem com atraso leve. Seguir travado faz o quarto tremer
    // a cada passo; seguir solto demais deixa o personagem sair da tela.
    followPoint.set(runtime.playerPosition.x * 0.6, 0, runtime.playerPosition.z * 0.6);
    target.current.lerp(followPoint, Math.min(1, step * 3));

    const horizontal = Math.cos(PITCH) * DISTANCE;
    camera.position.set(
      target.current.x + Math.sin(runtime.cameraYaw) * horizontal,
      target.current.y + Math.sin(PITCH) * DISTANCE,
      target.current.z + Math.cos(runtime.cameraYaw) * horizontal,
    );
    camera.lookAt(target.current);
  });

  return null;
}
