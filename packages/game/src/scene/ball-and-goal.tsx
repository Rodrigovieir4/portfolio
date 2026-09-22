'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import type { Mesh } from 'three';

import { GameWorld } from '../physics';
import { ball, resetBall, runtime } from '../runtime';
import { useGameStore } from '../store';
import { gameWorld, GOAL, GOAL_SENSOR, GOAL_SOLIDS } from '../world';
import { PLAYER_HALF } from './player';
import { boxMaterial, unitBall, unitBox, unitCylinder } from './resources';

export const BALL_RADIUS = 0.2;
/** Distância do centro do personagem ao centro da bola em que o chute pega. */
const KICK_RANGE = 1.05;
/** Velocidade que o chute imprime, em metros por segundo. */
const KICK_SPEED = 6.2;

/**
 * A bola.
 *
 * A física dela é integrada aqui mesmo, a partir do estado em runtime.ball, e
 * congela junto com o jogo quando há painel aberto: ninguém precisa simular
 * bola enquanto o visitante lê um projeto.
 */
export function Ball() {
  const mesh = useRef<Mesh>(null);
  const kickSeq = useGameStore((state) => state.kickSeq);
  const goals = useGameStore((state) => state.goals);
  const lastGoalAt = useRef(0);

  useEffect(() => {
    if (kickSeq === 0) return;
    const dx = ball.x - runtime.playerPosition.x;
    const dz = ball.z - runtime.playerPosition.z;
    const distance = Math.hypot(dx, dz);
    if (distance > KICK_RANGE) return;

    // Chuta na direção do personagem para a bola. Com a bola colada no pé,
    // essa direção fica instável, então vale para onde ele está virado.
    const useFacing = distance < 0.05;
    const nx = useFacing ? Math.sin(runtime.playerFacing) : dx / distance;
    const nz = useFacing ? Math.cos(runtime.playerFacing) : dz / distance;
    ball.vx = nx * KICK_SPEED;
    ball.vz = nz * KICK_SPEED;
    ball.vy = 2.2;
  }, [kickSeq]);

  // Depois do gol a bola volta para o meio do quarto.
  useEffect(() => {
    if (goals === 0) return;
    const timeout = setTimeout(resetBall, 1200);
    return () => clearTimeout(timeout);
  }, [goals]);

  useFrame((_, delta) => {
    const state = useGameStore.getState();
    if (!state.openPanel) {
      gameWorld().stepBall(ball, BALL_RADIUS, Math.min(delta, 0.05));

      // Rede de segurança: se a bola escapar do quarto, volta para o meio.
      if (ball.y < -1 || Math.abs(ball.x) > 5.4 || Math.abs(ball.z) > 5.4) resetBall();

      if (GameWorld.contains(GOAL_SENSOR, ball.x, ball.y, ball.z)) {
        const now = performance.now();
        if (now - lastGoalAt.current > 2000) {
          lastGoalAt.current = now;
          state.registerGoal();
        }
      }
    }

    runtime.ballPosition.set(ball.x, ball.y, ball.z);
    const node = mesh.current;
    if (!node) return;
    node.position.set(ball.x, ball.y, ball.z);
    node.rotation.set(ball.spinX, 0, ball.spinZ);
  });

  return (
    <mesh
      ref={mesh}
      geometry={unitBall}
      material={boxMaterial('#f4f5f7', { roughness: 0.6 })}
      scale={BALL_RADIUS * 2}
      castShadow
    />
  );
}

/**
 * Mini trave no canto do quarto, com a boca virada para dentro.
 *
 * Fazer o gol abre o contato. É a trajetória de atleta virando mecânica, e o
 * jeito menos burocrático que existe de chegar no "vamos conversar".
 */
export function Goal() {
  const white = boxMaterial('#eef1f6', { roughness: 0.5 });

  return (
    <group>
      {GOAL_SOLIDS.slice(0, 2).map((post, index) => (
        <mesh
          key={index}
          geometry={unitCylinder}
          material={white}
          position={post.position}
          scale={[GOAL.post * 2, GOAL.height, GOAL.post * 2]}
          castShadow
        />
      ))}
      <mesh
        geometry={unitCylinder}
        material={white}
        position={[GOAL.x, GOAL.height, GOAL.z - 0.3]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[GOAL.post * 2, GOAL.halfWidth * 2, GOAL.post * 2]}
        castShadow
      />
      {/* Rede: uma caixa translúcida, só para ler o volume do gol. */}
      <mesh
        geometry={unitBox}
        position={[GOAL.x, GOAL.height / 2, GOAL.z + 0.02]}
        scale={[GOAL.halfWidth * 2, GOAL.height, 0.6]}
      >
        <meshStandardMaterial color="#c8f751" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

/** A altura do jogador é usada pela bola para saber quando foi empurrada. */
export { PLAYER_HALF };
