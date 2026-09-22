'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { CylinderGeometry, SphereGeometry, TorusGeometry, type Group, type Mesh } from 'three';

import type { InteractableId } from '../hotspots';
import { boxMaterial, mapMaterial, unitBox, unitPlane, unitRock } from './resources';
import {
  certificate,
  codeScreen,
  dashboardScreen,
  doormat,
  jersey,
  whiteboard,
  worldMap,
} from './textures';

/**
 * Os móveis do quarto, montados com formas simples.
 *
 * Low-poly de verdade: caixas, cilindros e cones com cor chapada e sombreamento
 * facetado. É o que dá a cara indie e o que roda liso em celular. Cada peça
 * recebe `near`, que diz se o personagem está pisando na área do objeto, e
 * reage a isso: é o convite para chegar perto.
 *
 * Duas regras valem para o arquivo inteiro, e são o que faz o quarto caber em
 * aparelho fraco:
 *
 * 1. Ninguém cria geometria nem material dentro do JSX. Tudo sai do cache
 *    compartilhado, então cem caixas da mesma cor são uma geometria e um
 *    material na memória da placa, não cem de cada.
 * 2. Sombra só no que é grande o bastante para a sombra aparecer. Cada objeto
 *    que projeta sombra é desenhado duas vezes por quadro, uma no mapa de
 *    sombra e outra na tela. Caneta de quadro branco não precisa disso.
 *
 * As posições aqui batem com as caixas de colisão de hotspots.ts. Mudou um,
 * muda o outro.
 */

const SIGNAL = '#c8f751';
const WOOD = '#3a2f28';
const WOOD_LIGHT = '#6b5443';
const DARK = '#171b24';

type V3 = [number, number, number];

// Formas usadas por mais de um móvel, criadas uma vez só.
const CUP_STEM = new CylinderGeometry(0.02, 0.03, 0.08, 6);
const CUP_BOWL = new CylinderGeometry(0.1, 0.05, 0.16, 8);
const CUP_HANDLE = new TorusGeometry(0.04, 0.012, 4, 8, Math.PI);
const HEADSET_BAND = new TorusGeometry(0.1, 0.018, 6, 12, Math.PI);
const KNOB = new SphereGeometry(0.04, 8, 6);
const LAMP_BASE = new CylinderGeometry(0.2, 0.22, 0.04, 10);
const LAMP_POLE = new CylinderGeometry(0.02, 0.02, 1.56, 6);
const LAMP_SHADE = new CylinderGeometry(0.13, 0.26, 0.32, 10, 1, true);
const NIGHT_SHADE = new CylinderGeometry(0.06, 0.1, 0.16, 8);
const CAP_HEAD = new CylinderGeometry(0.1, 0.11, 0.08, 8);

function Box({
  position,
  size,
  color,
  rotation,
  emissive,
  emissiveIntensity = 0,
  metalness = 0,
  roughness = 0.85,
  shadow = false,
}: {
  position: V3;
  size: V3;
  color: string;
  rotation?: V3;
  emissive?: string;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  /** Só para peça grande: sombra custa um desenho a mais por quadro. */
  shadow?: boolean;
}) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={size}
      geometry={unitBox}
      material={boxMaterial(color, { emissive, emissiveIntensity, metalness, roughness })}
      castShadow={shadow}
      receiveShadow={shadow}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Setup gamer                                                                */
/* -------------------------------------------------------------------------- */

function Setup({ near }: { near: boolean }) {
  // Tela apagada vira descanso de tela escuro; perto, acende inteira.
  const screenTint = near ? '#ffffff' : '#3c4150';

  return (
    <group>
      <Box position={[-2.6, 0.75, -4.45]} size={[2.4, 0.06, 0.9]} color={WOOD} shadow />
      {[
        [-3.75, -4.85],
        [-1.45, -4.85],
        [-3.75, -4.05],
        [-1.45, -4.05],
      ].map(([x, z]) => (
        <Box key={`${x}${z}`} position={[x!, 0.36, z!]} size={[0.06, 0.72, 0.06]} color={DARK} />
      ))}
      {/* Fita de LED: a única luz verde do quarto, e a mais forte. */}
      <Box
        position={[-2.6, 0.7, -4.0]}
        size={[2.34, 0.02, 0.02]}
        color={SIGNAL}
        emissive={SIGNAL}
        emissiveIntensity={3}
      />

      {(
        [
          [-3.12, 0.14, codeScreen],
          [-2.08, -0.14, dashboardScreen],
        ] as const
      ).map(([x, angle, texture]) => (
        <group key={x} position={[x, 1.18, -4.7]} rotation={[0, angle, 0]}>
          <Box position={[0, 0, 0]} size={[0.95, 0.58, 0.05]} color="#0b0d12" shadow />
          <mesh
            position={[0, 0, 0.028]}
            scale={[0.89, 0.52, 1]}
            geometry={unitPlane}
            material={mapMaterial(texture(), { tint: screenTint, basic: true })}
          />
          <Box position={[0, -0.34, -0.02]} size={[0.06, 0.16, 0.06]} color={DARK} />
          <Box position={[0, -0.41, 0]} size={[0.3, 0.02, 0.18]} color={DARK} />
        </group>
      ))}

      <Box position={[-2.6, 0.79, -4.18]} size={[0.72, 0.03, 0.22]} color="#1c2130" />
      <Box
        position={[-2.6, 0.805, -4.18]}
        size={[0.66, 0.005, 0.16]}
        color={SIGNAL}
        emissive={SIGNAL}
        emissiveIntensity={0.4}
      />
      <Box position={[-2.0, 0.79, -4.15]} size={[0.07, 0.03, 0.11]} color="#1c2130" />

      {/* Cadeira gamer, virada para a mesa. */}
      <group position={[-2.6, 0, -3.45]}>
        <Box position={[0, 0.48, 0]} size={[0.56, 0.1, 0.56]} color="#12151c" shadow />
        <Box position={[0, 0.98, 0.25]} size={[0.56, 0.9, 0.1]} color="#12151c" shadow />
        <Box
          position={[0, 0.98, 0.305]}
          size={[0.14, 0.86, 0.01]}
          color={SIGNAL}
          emissive={SIGNAL}
          emissiveIntensity={0.3}
        />
        <Box position={[0, 0.22, 0]} size={[0.08, 0.44, 0.08]} color="#2a3040" />
        <Box position={[0, 0.03, 0]} size={[0.5, 0.05, 0.08]} color="#2a3040" />
        <Box position={[0, 0.03, 0]} size={[0.08, 0.05, 0.5]} color="#2a3040" />
      </group>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Paredes: lousa, mapa, certificados                                          */
/* -------------------------------------------------------------------------- */

function Whiteboard() {
  return (
    <group position={[1.6, 1.55, -4.94]}>
      <Box position={[0, 0, 0]} size={[2.12, 1.22, 0.04]} color="#9aa1ae" shadow />
      <mesh
        position={[0, 0, 0.025]}
        scale={[2, 1.1, 1]}
        geometry={unitPlane}
        material={mapMaterial(whiteboard(), { roughness: 0.6 })}
      />
      <Box position={[0, -0.66, 0.06]} size={[1.4, 0.03, 0.08]} color="#9aa1ae" />
      {['#2456c9', '#c92442', '#15803d'].map((color, index) => (
        <Box
          key={color}
          position={[-0.3 + index * 0.18, -0.63, 0.07]}
          size={[0.12, 0.02, 0.02]}
          color={color}
        />
      ))}
    </group>
  );
}

function WorldMap() {
  return (
    <group position={[3.95, 1.55, -4.94]}>
      <Box position={[0, 0, 0]} size={[1.62, 1.06, 0.04]} color={WOOD} shadow />
      <mesh
        position={[0, 0, 0.025]}
        scale={[1.5, 0.94, 1]}
        geometry={unitPlane}
        material={mapMaterial(worldMap(), { basic: true })}
      />
    </group>
  );
}

function Certificates({ near }: { near: boolean }) {
  const frames: [number, number][] = [];
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) frames.push([-1.6 + col * 0.9, 1.3 + row * 0.62]);
  }
  return (
    <group>
      {frames.map(([z, y], index) => (
        <group key={index} position={[-4.94, y, z]} rotation={[0, Math.PI / 2, 0]}>
          <Box position={[0, 0, 0]} size={[0.7, 0.5, 0.03]} color={WOOD_LIGHT} />
          <mesh
            position={[0, 0, 0.02]}
            scale={[0.62, 0.42, 1]}
            geometry={unitPlane}
            material={mapMaterial(certificate(index), { roughness: 0.7 })}
          />
          {/* Luz de galeria: acende quando o personagem chega perto. */}
          <Box
            position={[0, 0.3, 0.05]}
            size={[0.4, 0.03, 0.05]}
            color="#fff3d6"
            emissive="#ffe6a8"
            emissiveIntensity={near ? 2.5 : 0}
          />
        </group>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Estantes                                                                   */
/* -------------------------------------------------------------------------- */

function Cup({ position, color, scale = 1 }: { position: V3; color: string; scale?: number }) {
  const metal = boxMaterial(color, { metalness: 0.7, roughness: 0.3 });
  return (
    <group position={position} scale={scale}>
      <Box position={[0, 0.02, 0]} size={[0.14, 0.04, 0.14]} color="#2a2420" />
      <mesh position={[0, 0.08, 0]} geometry={CUP_STEM} material={metal} />
      <mesh position={[0, 0.2, 0]} geometry={CUP_BOWL} material={metal} castShadow />
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.11, 0.22, 0]}
          rotation={[0, 0, Math.PI / 2]}
          geometry={CUP_HANDLE}
          material={metal}
        />
      ))}
    </group>
  );
}

function TrophyShelf({ near }: { near: boolean }) {
  const bigTrophy = useRef<Group>(null);

  useFrame((_, delta) => {
    const trophy = bigTrophy.current;
    if (!trophy) return;
    // Gira devagar quando o personagem está perto; parado caso contrário.
    trophy.rotation.y += near ? delta * 1.6 : 0;
  });

  const shelves = [0.06, 0.68, 1.3, 1.88];
  return (
    <group position={[4.55, 0, -1.4]}>
      <Box position={[0.36, 0.95, 0]} size={[0.06, 1.9, 1.8]} color={WOOD} shadow />
      <Box position={[0, 0.95, -0.88]} size={[0.8, 1.9, 0.05]} color={WOOD} shadow />
      <Box position={[0, 0.95, 0.88]} size={[0.8, 1.9, 0.05]} color={WOOD} shadow />
      {shelves.map((y) => (
        <Box key={y} position={[0, y, 0]} size={[0.8, 0.04, 1.8]} color={WOOD_LIGHT} />
      ))}

      {/* prateleira de baixo: bola e chuteiras */}
      <mesh
        position={[0, 0.2, -0.45]}
        scale={0.26}
        geometry={unitRock}
        material={boxMaterial('#f4f5f7')}
      />
      <Box position={[0, 0.13, 0.35]} size={[0.26, 0.1, 0.1]} color={SIGNAL} />
      <Box position={[0, 0.13, 0.5]} size={[0.26, 0.1, 0.1]} color={SIGNAL} />

      {/* taças do futebol */}
      <Cup position={[0, 0.7, -0.5]} color="#d9b44a" />
      <Cup position={[0, 0.7, 0]} color="#b8bec9" />
      <Cup position={[0, 0.7, 0.5]} color="#b87a4a" scale={0.85} />

      {/* camisa pendurada no fundo da estante */}
      <mesh
        position={[0.32, 1.62, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[0.52, 0.6, 1]}
        geometry={unitPlane}
        material={mapMaterial(jersey(), { transparent: true })}
      />
      {/* headset: o lado Counter-Strike */}
      <mesh position={[0, 1.42, -0.62]} geometry={HEADSET_BAND} material={boxMaterial('#12151c')} />

      {/* troféu grande no topo */}
      <group ref={bigTrophy} position={[0, 1.9, 0]}>
        <Cup position={[0, 0, 0]} color="#e6c14d" scale={1.7} />
      </group>
    </group>
  );
}

function Bookcase() {
  const books = ['#7b5cff', '#c92442', '#2456c9', SIGNAL, '#4ee0d0', '#d97706', '#b6bdcb'];
  return (
    <group position={[4.6, 0, 1.3]}>
      <Box position={[0, 0.6, 0]} size={[0.7, 1.2, 1.4]} color={WOOD} shadow />
      {[0.35, 0.8].map((y) =>
        books.map((color, index) => (
          <Box
            key={`${y}${color}`}
            position={[-0.3, y + (index % 3) * 0.015, -0.55 + index * 0.16]}
            size={[0.08, 0.32 + (index % 3) * 0.03, 0.12]}
            color={color}
          />
        )),
      )}
      {/* diploma em pé em cima da estante */}
      <group position={[-0.05, 1.42, -0.3]} rotation={[0, -Math.PI / 2, -0.12]}>
        <Box position={[0, 0, 0]} size={[0.5, 0.38, 0.03]} color={WOOD_LIGHT} />
        <mesh
          position={[0, 0, 0.02]}
          scale={[0.44, 0.32, 1]}
          geometry={unitPlane}
          material={mapMaterial(certificate(9))}
        />
      </group>
      {/* capelo de formatura */}
      <group position={[-0.05, 1.28, 0.35]} rotation={[0, 0.5, 0]}>
        <Box position={[0, 0.06, 0]} size={[0.36, 0.02, 0.36]} color="#12151c" />
        <mesh position={[0, 0.02, 0]} geometry={CAP_HEAD} material={boxMaterial('#12151c')} />
        <Box position={[0.14, 0.0, 0.14]} size={[0.015, 0.1, 0.015]} color={SIGNAL} />
      </group>
      {/* mochila encostada ao lado */}
      <group position={[0.1, 0, 1.0]}>
        <Box position={[0, 0.24, 0]} size={[0.26, 0.42, 0.34]} color="#2c2440" shadow />
        <Box position={[-0.14, 0.18, 0]} size={[0.06, 0.2, 0.24]} color="#3b3350" />
      </group>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Criado-mudo e celular                                                      */
/* -------------------------------------------------------------------------- */

function Nightstand({ near }: { near: boolean }) {
  const phone = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const mesh = phone.current;
    if (!mesh) return;
    // Perto, o celular vibra como quem recebeu mensagem.
    const buzz = near && Math.sin(clock.elapsedTime * 6) > 0.4;
    mesh.position.x = -0.05 + (buzz ? Math.sin(clock.elapsedTime * 90) * 0.006 : 0);
    mesh.rotation.y = 0.3 + (buzz ? Math.sin(clock.elapsedTime * 70) * 0.03 : 0);
  });

  return (
    <group position={[-4.55, 0, 1.5]}>
      <Box position={[0, 0.3, 0]} size={[0.6, 0.6, 0.6]} color={WOOD} shadow />
      <Box position={[0.31, 0.38, 0]} size={[0.01, 0.12, 0.3]} color={WOOD_LIGHT} />
      <mesh
        ref={phone}
        position={[-0.05, 0.615, 0.05]}
        rotation={[0, 0.3, 0]}
        scale={[0.1, 0.014, 0.19]}
        geometry={unitBox}
        material={boxMaterial('#0b0d12', {
          emissive: SIGNAL,
          emissiveIntensity: near ? 1.4 : 0.05,
        })}
      />
      {/* abajurzinho de cabeceira */}
      <mesh
        position={[0.15, 0.7, -0.15]}
        geometry={NIGHT_SHADE}
        material={boxMaterial('#e9d9b8', { emissive: '#ffcf8a', emissiveIntensity: 0.5 })}
      />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Porta e tapete de entrada                                                  */
/* -------------------------------------------------------------------------- */

function Doormat() {
  return (
    // Girado 45 graus no próprio plano: na vista inicial da câmera o texto lê
    // da esquerda para a direita, na horizontal da tela.
    <mesh
      position={[0, 0.012, 4.15]}
      rotation={[-Math.PI / 2, 0, Math.PI / 4]}
      scale={[1.4, 0.8, 1]}
      geometry={unitPlane}
      material={mapMaterial(doormat())}
      receiveShadow
    />
  );
}

export function Door() {
  return (
    <group position={[0, 0, 4.96]}>
      <Box position={[0, 1.05, 0]} size={[1.1, 2.1, 0.06]} color="#4a3a2a" shadow />
      <Box position={[0, 1.05, -0.02]} size={[0.96, 1.96, 0.04]} color="#5b4735" />
      <mesh
        position={[0.36, 1.0, -0.06]}
        geometry={KNOB}
        material={boxMaterial('#d9b44a', { metalness: 0.8, roughness: 0.3, flatShading: false })}
      />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Abajur                                                                     */
/* -------------------------------------------------------------------------- */

export function FloorLamp({ on }: { on: boolean }) {
  return (
    <group position={[-4.5, 0, -4.5]}>
      <mesh position={[0, 0.02, 0]} geometry={LAMP_BASE} material={boxMaterial(DARK)} castShadow />
      <mesh position={[0, 0.8, 0]} geometry={LAMP_POLE} material={boxMaterial(DARK)} />
      {/* A cúpula é um cilindro aberto: precisa dos dois lados, porque de cima
          se vê o lado de dentro dela. */}
      <mesh
        position={[0, 1.66, 0]}
        geometry={LAMP_SHADE}
        material={boxMaterial('#e9d9b8', {
          emissive: '#ffc27a',
          emissiveIntensity: on ? 1.6 : 0,
          doubleSide: true,
        })}
      />
    </group>
  );
}

/** O visual de cada objeto interativo, pelo id. */
export function FurnitureFor({ id, near }: { id: InteractableId; near: boolean }) {
  switch (id) {
    case 'pc':
      return <Setup near={near} />;
    case 'lousa':
      return <Whiteboard />;
    case 'mapa':
      return <WorldMap />;
    case 'certificados':
      return <Certificates near={near} />;
    case 'trofeus':
      return <TrophyShelf near={near} />;
    case 'formacao':
      return <Bookcase />;
    case 'contato':
      return <Nightstand near={near} />;
    case 'sobre':
      return <Doormat />;
    case 'abajur':
      return null;
  }
}
