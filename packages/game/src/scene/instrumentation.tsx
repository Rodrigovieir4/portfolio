'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

import { perf } from '../runtime';

/**
 * Lê o contador do renderizador a cada quadro e publica em runtime.perf.
 *
 * O three zera esses números a cada render, então o que se lê aqui é o quadro
 * anterior. Para medição e para decidir qualidade, essa defasagem de um quadro
 * não muda nada.
 *
 * Os quadros por segundo são suavizados por média exponencial: sem isso, um
 * único quadro longo, como o da compilação de um shader, derrubaria a média e
 * faria o ajuste automático baixar a qualidade sem motivo.
 */
export function Instrumentation() {
  const smoothed = useRef(60);
  const configured = useRef(false);

  useFrame(({ gl }, delta) => {
    // Por padrão o three zera o contador a cada render. Com pós-processamento
    // são vários renders por quadro, e o que sobraria seria só o último passe,
    // um retângulo de tela cheia. Zerando à mão, o número vira o quadro todo.
    // O ajuste fica aqui, e não num efeito, porque o renderizador vem do
    // próprio quadro: mexer no que um hook devolveu é proibido.
    if (!configured.current) {
      gl.info.autoReset = false;
      configured.current = true;
    }

    const instant = delta > 0 ? 1 / delta : 60;
    smoothed.current += (instant - smoothed.current) * 0.06;
    perf.fps = smoothed.current;

    const { render, memory, programs } = gl.info;
    perf.calls = render.calls;
    perf.triangles = render.triangles;
    perf.geometries = memory.geometries;
    perf.textures = memory.textures;
    perf.programs = programs?.length ?? 0;
    gl.info.reset();
  });

  return null;
}
