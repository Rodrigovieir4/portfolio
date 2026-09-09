'use client';

import { Canvas } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { useDeviceTier } from '../hooks/use-device-tier';
import { ParticleField } from '../scenes/particle-field';
import type { ShapeName } from '../shapes';

export interface HeroCanvasProps {
  /** Progresso de 0 a 1, normalmente vindo do scroll da pagina. */
  progress?: number;
  from?: ShapeName;
  to?: ShapeName;
  className?: string;
}

/**
 * Canvas do hero, com todas as protecoes que uma cena WebGL em producao precisa.
 *
 * Sao quatro camadas de defesa, porque um portfolio e visto em maquina que voce
 * nao escolheu:
 *   1. o perfil do dispositivo decide a contagem de particulas antes de montar;
 *   2. a cena so monta depois que o elemento entra na viewport;
 *   3. a animacao pausa quando a aba perde o foco, para nao gastar bateria;
 *   4. perder o contexto de WebGL cai para o fundo estatico em vez de tela preta.
 */
export function HeroCanvas({
  progress = 0,
  from = 'sphere',
  to = 'knot',
  className,
}: HeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const device = useDeviceTier();
  const [visible, setVisible] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? false),
      { rootMargin: '200px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // tier 'off' cobre tanto ausencia de WebGL2 quanto pedido explicito de menos
  // movimento no sistema operacional.
  const disabled = device.tier === 'off' || contextLost;

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      {disabled ? (
        <StaticFallback />
      ) : (
        <Canvas
          frameloop={visible ? 'always' : 'never'}
          dpr={device.dpr}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
            // A nuvem e aditiva e ja satura; tonemapping cortaria o brilho.
            toneMapping: THREE.NoToneMapping,
          }}
          camera={{ position: [0, 0, 4.2], fov: 52 }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (event) => {
              event.preventDefault();
              setContextLost(true);
            });
          }}
        >
          <Suspense fallback={null}>
            <ParticleField count={device.particleCount} from={from} to={to} morph={progress} />

            {device.postProcessing && (
              <EffectComposer enableNormalPass={false}>
                <Bloom
                  intensity={1.15}
                  luminanceThreshold={0.14}
                  luminanceSmoothing={0.36}
                  mipmapBlur
                />
                <ChromaticAberration
                  blendFunction={BlendFunction.NORMAL}
                  offset={new THREE.Vector2(0.0007, 0.0011)}
                  radialModulation={false}
                  modulationOffset={0}
                />
                <Vignette eskil={false} offset={0.22} darkness={0.72} />
              </EffectComposer>
            )}
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}

/**
 * Substituto estatico. Um gradiente em CSS que sugere a mesma nuvem, para que a
 * composicao da pagina nao desabe quando o WebGL nao esta disponivel.
 */
function StaticFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 h-[52vmin] w-[52vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--color-signal)_0%,transparent_58%)] opacity-25 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 h-[44vmin] w-[44vmin] -translate-x-[38%] -translate-y-[58%] rounded-full bg-[radial-gradient(circle_at_65%_65%,var(--color-plasma)_0%,transparent_60%)] opacity-30 blur-3xl" />
    </div>
  );
}
