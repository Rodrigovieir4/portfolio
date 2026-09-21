'use client';

import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Suspense, useEffect } from 'react';

import { HOTSPOTS } from '../hotspots';
import { attachKeyboard } from '../input';
import { Ball, Goal } from './ball-and-goal';
import { CameraRig } from './camera-rig';
import { Hotspot } from './hotspot';
import { Player } from './player';
import { Room } from './room';

export interface GameCanvasProps {
  className?: string;
  /** 'low' desliga sombra e limita a resolução, para aparelho fraco. */
  quality?: 'low' | 'high';
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
      shadows={!low}
      dpr={low ? [1, 1] : [1, 1.75]}
      camera={{ position: [14, 14, 14], zoom: 55, near: 0.1, far: 200 }}
    >
      <color attach="background" args={['#07080c']} />

      <ambientLight intensity={0.9} color="#aab4d4" />
      <directionalLight
        position={[6, 10, 4]}
        intensity={1.3}
        castShadow={!low}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
      />
      {/* Abajur: a luz quente do quarto. */}
      <pointLight position={[-4.2, 2, -4.2]} intensity={14} distance={9} color="#ffb870" />
      {/* LED do setup: o único verde da cena. */}
      <pointLight position={[-3, 1.4, -3.8]} intensity={6} distance={4} color="#c8f751" />

      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]}>
          <Room />
          {HOTSPOTS.map((hotspot) => (
            <Hotspot key={hotspot.id} config={hotspot} />
          ))}
          <Goal />
          <Ball />
          <Player />
        </Physics>
      </Suspense>

      <CameraRig />
    </Canvas>
  );
}
