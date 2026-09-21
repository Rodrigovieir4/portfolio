'use client';

import { Sparkles } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { Physics } from '@react-three/rapier';
import { Suspense, useEffect } from 'react';

import { HOTSPOTS } from '../hotspots';
import { attachKeyboard } from '../input';
import { useGameStore } from '../store';
import { Ball, Goal } from './ball-and-goal';
import { CameraRig } from './camera-rig';
import { Collectibles } from './collectibles';
import { Interactable } from './hotspot';
import { Player } from './player';
import { Room, useFrontWalls } from './room';

export interface GameCanvasProps {
  className?: string;
  /** 'low' desliga sombra, brilho e partículas, para aparelho fraco. */
  quality?: 'low' | 'high';
}

/**
 * Luzes do quarto. Com o abajur aceso, o quarto é quente; apagado, sobram o
 * luar azul da janela, o verde do LED e o brilho das telas.
 */
function Lights({ low }: { low: boolean }) {
  const lampOn = useGameStore((state) => state.lampOn);

  return (
    <>
      <ambientLight intensity={lampOn ? 0.75 : 0.22} color={lampOn ? '#b6bedc' : '#6f80c8'} />
      <directionalLight
        position={[6, 10, 4]}
        intensity={lampOn ? 1.15 : 0.35}
        color={lampOn ? '#fff1de' : '#8fa6ff'}
        castShadow={!low}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.0005}
      />
      <pointLight
        position={[-4.5, 1.7, -4.5]}
        intensity={lampOn ? 16 : 0}
        distance={10}
        color="#ffb870"
      />
      <pointLight
        position={[-2.6, 0.6, -3.9]}
        intensity={lampOn ? 5 : 8}
        distance={4}
        color="#c8f751"
      />
      <pointLight
        position={[-2.6, 1.3, -4.2]}
        intensity={lampOn ? 2 : 4}
        distance={3.5}
        color="#9fe8ff"
      />
      <pointLight
        position={[-4.3, 1.8, -3.3]}
        intensity={lampOn ? 1.5 : 6}
        distance={6}
        color="#7f96ff"
      />
      {lampOn && !low && (
        <Sparkles
          count={36}
          position={[-3.9, 1.3, -3.9]}
          scale={[1.8, 1.8, 1.8]}
          size={2.2}
          speed={0.25}
          opacity={0.6}
          color="#ffd9a8"
        />
      )}
    </>
  );
}

/** Os objetos do quarto, cada um sabendo se a própria parede está rebaixada. */
function Interactables() {
  const front = useFrontWalls();
  return (
    <>
      {HOTSPOTS.map((hotspot) => (
        <Interactable
          key={hotspot.id}
          config={hotspot}
          hidden={'wall' in hotspot ? front.has(hotspot.wall) : false}
        />
      ))}
    </>
  );
}

/**
 * O jogo inteiro dentro de um canvas.
 *
 * Tudo que o visitante lê, dica, painel e contador, fica fora daqui, em HTML
 * no app. Esta cena só desenha o quarto e avisa pelo store o que aconteceu.
 */
export function GameCanvas({ className, quality = 'high' }: GameCanvasProps) {
  useEffect(() => attachKeyboard(), []);

  const low = quality === 'low';

  return (
    <Canvas
      className={className}
      orthographic
      // PCF comum: o PCFSoft foi descontinuado no three e só gerava aviso.
      shadows={low ? false : 'percentage'}
      dpr={low ? [1, 1] : [1, 1.75]}
      camera={{ position: [14, 14, 14], zoom: 40, near: 0.1, far: 200 }}
      gl={{ antialias: !low }}
    >
      <color attach="background" args={['#07080c']} />
      <Lights low={low} />

      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]}>
          <Room />
          <Interactables />
          <Collectibles />
          <Goal />
          <Ball />
          <Player />
        </Physics>
      </Suspense>

      <CameraRig />

      {/*
        Brilho só no que já é luz: LED, telas, commits e losangos passam do
        limiar; paredes e móveis não. É o que dá o ar de quarto à noite sem
        lavar a cena inteira.
      */}
      {!low && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.85} luminanceThreshold={0.62} luminanceSmoothing={0.2} mipmapBlur />
          <Vignette eskil={false} offset={0.22} darkness={0.62} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
