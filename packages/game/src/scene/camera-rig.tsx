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
  const lastZoom = useRef(0);
  const intro = useRef(0);

  useFrame(({ camera, size }, delta) => {
    const step = Math.min(delta, 1 / 30);

    // Entrada: nos primeiros dois segundos a câmera vem de longe, girando, e
    // assenta na vista do quarto. Easing cúbico de saída, o que chega rápido e
    // pousa devagar.
    intro.current = Math.min(1, intro.current + step / 2);
    const eased = 1 - Math.pow(1 - intro.current, 3);

    // Em vista isométrica o quarto de 10 por 10 ocupa cerca de 14 unidades de
    // largura na tela e 10 de altura. O zoom é o que couber nos dois eixos, com
    // folga, para o quarto aparecer inteiro no monitor deitado e no celular em
    // pé. Só recalcula quando muda, porque atualizar a projeção a cada quadro é
    // trabalho à toa.
    const fit = Math.min(size.width / 16, size.height / 12.5);
    const zoom = fit * (0.55 + 0.45 * eased);
    if (Math.abs(zoom - lastZoom.current) > 0.001 && camera instanceof OrthographicCamera) {
      lastZoom.current = zoom;
      camera.zoom = zoom;
      camera.updateProjectionMatrix();
    }

    const goalYaw = yawForStep(useGameStore.getState().cameraStep);
    runtime.cameraYaw += (goalYaw - runtime.cameraYaw) * Math.min(1, step * 8);
    // O giro da entrada é só visual: o controle usa o ângulo final desde já.
    const shownYaw = runtime.cameraYaw + (1 - eased) * 1.1;

    // Segue o personagem com atraso leve. Seguir travado faz o quarto tremer
    // a cada passo; seguir solto demais deixa o personagem sair da tela.
    followPoint.set(runtime.playerPosition.x * 0.6, 0, runtime.playerPosition.z * 0.6);
    target.current.lerp(followPoint, Math.min(1, step * 3));

    const horizontal = Math.cos(PITCH) * DISTANCE;
    camera.position.set(
      target.current.x + Math.sin(shownYaw) * horizontal,
      target.current.y + Math.sin(PITCH) * DISTANCE,
      target.current.z + Math.cos(shownYaw) * horizontal,
    );
    camera.lookAt(target.current);
  });

  return null;
}
