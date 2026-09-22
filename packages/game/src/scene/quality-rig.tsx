'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

import { FPS_CEILING, FPS_FLOOR, higherTier, lowerTier, QUALITY } from '../quality';
import { perf } from '../runtime';
import { activeTier, useGameStore } from '../store';

/** Tempo abaixo do piso antes de baixar o nível. Curto: trava incomoda rápido. */
const DROP_AFTER = 2;
/** Tempo com folga antes de tentar subir. Longo: subir e voltar é pior que ficar. */
const RAISE_AFTER = 12;
/** Os primeiros segundos não contam: shader compilando derruba qualquer média. */
const WARMUP = 3;

/**
 * Aplica o nível de qualidade no renderizador e, no automático, escolhe o nível.
 *
 * A regra é assimétrica de propósito. Baixar é rápido, porque quem está com o
 * jogo travando quer alívio agora. Subir é lento e acontece no máximo uma vez,
 * e nunca depois de uma queda: um jogo que fica alternando entre bonito e
 * travado é pior de usar que um jogo que assumiu que o aparelho é modesto.
 */
export function QualityRig() {
  const setDpr = useThree((state) => state.setDpr);
  const tier = useGameStore(activeTier);
  const auto = useGameStore((state) => state.quality === 'auto');

  const settings = QUALITY[tier];

  useEffect(() => {
    setDpr(Math.min(window.devicePixelRatio || 1, settings.maxDpr));
  }, [setDpr, settings.maxDpr]);

  const belowFor = useRef(0);
  const aboveFor = useRef(0);
  const warmup = useRef(0);
  const raisesLeft = useRef(1);

  useFrame(({ gl, scene }, delta) => {
    // A sombra é ligada aqui, e não num efeito, porque o renderizador chega
    // pelo próprio quadro: mexer no que um hook devolveu é proibido.
    if (gl.shadowMap.enabled !== settings.shadows) {
      gl.shadowMap.enabled = settings.shadows;
      gl.shadowMap.needsUpdate = true;
      // Ligar e desligar sombra muda o programa de cada material: sem avisar,
      // o que já está na tela continua com o programa antigo.
      scene.traverse((object) => {
        const material = (object as { material?: { needsUpdate: boolean } }).material;
        if (material) material.needsUpdate = true;
      });
    }

    if (!auto) return;
    if (warmup.current < WARMUP) {
      warmup.current += delta;
      return;
    }

    if (perf.fps < FPS_FLOOR) {
      belowFor.current += delta;
      aboveFor.current = 0;
    } else if (perf.fps > FPS_CEILING) {
      aboveFor.current += delta;
      belowFor.current = 0;
    } else {
      belowFor.current = 0;
      aboveFor.current = 0;
    }

    const store = useGameStore.getState();
    const current = store.autoTier;

    if (belowFor.current > DROP_AFTER && current !== 'baixo') {
      store.setAutoTier(lowerTier(current));
      belowFor.current = 0;
      // Já ficou provado que o aparelho não dá conta: não tenta subir mais.
      raisesLeft.current = 0;
    } else if (aboveFor.current > RAISE_AFTER && raisesLeft.current > 0 && current !== 'alto') {
      store.setAutoTier(higherTier(current));
      aboveFor.current = 0;
      raisesLeft.current -= 1;
    }
  });

  return null;
}
