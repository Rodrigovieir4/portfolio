'use client';

import { Sparkles } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { lazy, Suspense, useEffect } from 'react';

import { HOTSPOTS } from '../hotspots';
import { attachKeyboard } from '../input';
import { QUALITY, type QualitySettings } from '../quality';
import { activeTier, useGameStore } from '../store';
import { Ball, Goal } from './ball-and-goal';
import { CameraRig } from './camera-rig';
import { Collectibles } from './collectibles';
import { Instrumentation } from './instrumentation';
import { Interactable } from './hotspot';
import { Player } from './player';
import { QualityRig } from './quality-rig';
import { Room, useFrontWalls } from './room';

// Chega só quando o nível alto está em vigor, e não é baixado em aparelho fraco.
const Effects = lazy(() => import('./effects'));

export interface GameCanvasProps {
  className?: string;
}

/**
 * Luzes do quarto. Com o abajur aceso, o quarto é quente; apagado, sobram o
 * luar azul da janela, o verde do LED e o brilho das telas.
 */
function Lights({ settings }: { settings: QualitySettings }) {
  const lampOn = useGameStore((state) => state.lampOn);

  return (
    <>
      <ambientLight intensity={lampOn ? 0.75 : 0.22} color={lampOn ? '#b6bedc' : '#6f80c8'} />
      <directionalLight
        position={[6, 10, 4]}
        intensity={lampOn ? 1.15 : 0.35}
        color={lampOn ? '#fff1de' : '#8fa6ff'}
        castShadow={settings.shadows}
        shadow-mapSize={[settings.shadowMapSize, settings.shadowMapSize]}
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
      {lampOn && settings.sparkles && (
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
 *
 * Com painel aberto, o laço de quadros passa para "sob demanda": o quarto fica
 * congelado atrás do painel, que é o que se veria de qualquer jeito, e o
 * aparelho para de desenhar sessenta vezes por segundo uma cena que ninguém
 * está olhando. Em celular isso é bateria; em notebook, é a ventoinha que não
 * liga enquanto a pessoa lê sobre um projeto.
 */
export function GameCanvas({ className }: GameCanvasProps) {
  useEffect(() => attachKeyboard(), []);

  const tier = useGameStore(activeTier);
  const paused = useGameStore((state) => state.openPanel !== null);
  const settings = QUALITY[tier];

  return (
    <Canvas
      className={className}
      orthographic
      frameloop={paused ? 'demand' : 'always'}
      // PCF comum: o PCFSoft foi descontinuado no three e só gerava aviso.
      shadows={settings.shadows ? 'percentage' : false}
      dpr={[1, settings.maxDpr]}
      camera={{ position: [14, 14, 14], zoom: 40, near: 0.1, far: 200 }}
      gl={{ antialias: settings.antialias, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#07080c']} />
      <Lights settings={settings} />

      <Suspense fallback={null}>
        <Room />
        <Interactables />
        <Collectibles />
        <Goal />
        <Ball />
        <Player />
      </Suspense>

      <CameraRig />
      <Instrumentation />
      <QualityRig />

      {settings.effects && (
        <Suspense fallback={null}>
          <Effects />
        </Suspense>
      )}
    </Canvas>
  );
}
