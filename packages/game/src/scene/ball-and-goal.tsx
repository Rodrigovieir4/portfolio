'use client';

import {
  BallCollider,
  CuboidCollider,
  RigidBody,
  type IntersectionEnterPayload,
  type RapierRigidBody,
} from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

import { runtime } from '../runtime';
import { useGameStore } from '../store';

const BALL_RADIUS = 0.2;
const BALL_START: [number, number, number] = [1, 0.6, 1.4];
/** Distância do centro do personagem ao centro da bola em que o chute pega. */
const KICK_RANGE = 1.05;
const KICK_FORCE = 2.6;

/**
 * A bola.
 *
 * Tem massa de bola de verdade, 450 gramas, para que o impulso do chute tenha
 * uma escala intuitiva: 2,6 newton-segundo dá uns 6 metros por segundo, um
 * chute firme dentro de um quarto.
 */
export function Ball() {
  const body = useRef<RapierRigidBody>(null);
  const kickSeq = useGameStore((state) => state.kickSeq);
  const goals = useGameStore((state) => state.goals);

  useFrame(() => {
    const ball = body.current;
    if (!ball) return;
    const { x, y, z } = ball.translation();
    runtime.ballPosition.set(x, y, z);
  });

  useEffect(() => {
    if (kickSeq === 0) return;
    const ball = body.current;
    if (!ball) return;

    const position = ball.translation();
    const dx = position.x - runtime.playerPosition.x;
    const dz = position.z - runtime.playerPosition.z;
    const distance = Math.hypot(dx, dz);
    if (distance > KICK_RANGE) return;

    // Chuta na direção do personagem para a bola. Com a bola colada no pé,
    // essa direção fica instável, então vale para onde ele está virado.
    const useFacing = distance < 0.05;
    const nx = useFacing ? Math.sin(runtime.playerFacing) : dx / distance;
    const nz = useFacing ? Math.cos(runtime.playerFacing) : dz / distance;

    ball.applyImpulse({ x: nx * KICK_FORCE, y: KICK_FORCE * 0.3, z: nz * KICK_FORCE }, true);
  }, [kickSeq]);

  // Depois do gol a bola volta para o meio do quarto.
  useEffect(() => {
    if (goals === 0) return;
    const timeout = setTimeout(() => {
      const ball = body.current;
      if (!ball) return;
      ball.setTranslation({ x: BALL_START[0], y: BALL_START[1], z: BALL_START[2] }, true);
      ball.setLinvel({ x: 0, y: 0, z: 0 }, true);
      ball.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }, 1200);
    return () => clearTimeout(timeout);
  }, [goals]);

  return (
    <RigidBody
      ref={body}
      name="ball"
      colliders={false}
      position={BALL_START}
      linearDamping={0.5}
      angularDamping={0.6}
      ccd
    >
      <BallCollider args={[BALL_RADIUS]} mass={0.45} restitution={0.6} friction={0.8} />
      <mesh castShadow>
        <icosahedronGeometry args={[BALL_RADIUS, 1]} />
        <meshStandardMaterial color="#f4f5f7" flatShading />
      </mesh>
    </RigidBody>
  );
}

const GOAL_X = 3.3;
const GOAL_Z = 4.55;
const GOAL_HALF_WIDTH = 0.8;
const GOAL_HEIGHT = 0.9;
const POST = 0.05;

function isBall({ other }: IntersectionEnterPayload): boolean {
  return other.rigidBodyObject?.name === 'ball';
}

/**
 * Mini trave no canto do quarto, com a boca virada para dentro.
 *
 * Fazer o gol abre o contato. É a trajetória de atleta virando mecânica, e o
 * jeito menos burocrático que existe de chegar no "vamos conversar".
 */
export function Goal() {
  const registerGoal = useGameStore((state) => state.registerGoal);
  // A bola pode sair e entrar de novo na área antes de ser recolocada.
  const lastGoalAt = useRef(0);

  const left = GOAL_X - GOAL_HALF_WIDTH;
  const right = GOAL_X + GOAL_HALF_WIDTH;

  return (
    <RigidBody type="fixed" colliders={false}>
      {/* Postes, travessão e rede de fundo: sólidos, a bola bate e volta. */}
      <CuboidCollider
        args={[POST, GOAL_HEIGHT / 2, POST]}
        position={[left, GOAL_HEIGHT / 2, GOAL_Z - 0.3]}
      />
      <CuboidCollider
        args={[POST, GOAL_HEIGHT / 2, POST]}
        position={[right, GOAL_HEIGHT / 2, GOAL_Z - 0.3]}
      />
      <CuboidCollider
        args={[GOAL_HALF_WIDTH, POST, 0.3]}
        position={[GOAL_X, GOAL_HEIGHT, GOAL_Z]}
      />
      <CuboidCollider
        args={[POST, GOAL_HEIGHT / 2, 0.3]}
        position={[left, GOAL_HEIGHT / 2, GOAL_Z]}
      />
      <CuboidCollider
        args={[POST, GOAL_HEIGHT / 2, 0.3]}
        position={[right, GOAL_HEIGHT / 2, GOAL_Z]}
      />

      <CuboidCollider
        sensor
        args={[GOAL_HALF_WIDTH - POST * 2, GOAL_HEIGHT / 2 - POST, 0.22]}
        position={[GOAL_X, GOAL_HEIGHT / 2, GOAL_Z + 0.05]}
        onIntersectionEnter={(payload) => {
          if (!isBall(payload)) return;
          const now = performance.now();
          if (now - lastGoalAt.current < 2000) return;
          lastGoalAt.current = now;
          registerGoal();
        }}
      />

      {[left, right].map((x) => (
        <mesh key={x} position={[x, GOAL_HEIGHT / 2, GOAL_Z - 0.3]} castShadow>
          <cylinderGeometry args={[POST, POST, GOAL_HEIGHT, 8]} />
          <meshStandardMaterial color="#eef1f6" />
        </mesh>
      ))}
      <mesh
        position={[GOAL_X, GOAL_HEIGHT, GOAL_Z - 0.3]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[POST, POST, GOAL_HALF_WIDTH * 2, 8]} />
        <meshStandardMaterial color="#eef1f6" />
      </mesh>
      {/* Rede: caixa translúcida, só para ler o volume do gol. */}
      <mesh position={[GOAL_X, GOAL_HEIGHT / 2, GOAL_Z + 0.02]}>
        <boxGeometry args={[GOAL_HALF_WIDTH * 2, GOAL_HEIGHT, 0.6]} />
        <meshStandardMaterial color="#c8f751" transparent opacity={0.08} />
      </mesh>
    </RigidBody>
  );
}
