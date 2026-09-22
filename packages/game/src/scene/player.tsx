'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';

import { SPAWN } from '../hotspots';
import { keyboardAxis } from '../input';
import { ball, runtime } from '../runtime';
import { useGameStore } from '../store';
import { COMMIT_SENSOR, gameWorld } from '../world';
import { BALL_RADIUS } from './ball-and-goal';
import { boxMaterial, unitBox } from './resources';

const WALK_SPEED = 3.2;
const RUN_SPEED = 5.6;
/** Meia largura do quadrado de colisão. Um pouco menor que o boneco: assim ele
 * passa por vãos apertados sem parecer que prendeu no nada. */
export const PLAYER_HALF = 0.26;
/** Altura do centro do corpo. Os pés ficam em zero. */
const PLAYER_Y = 0.63;
/** Quanto a fase do passo avança por metro andado. Mais alto, passo mais curto. */
const STRIDE = 7;
const WAVE_SECONDS = 1.8;

/**
 * Cores do personagem, num lugar só para ajustar a aparência sem caçar valor.
 * A camisa usa o verde do tema, que também é a cor que mais se destaca no
 * chão escuro, e o headset no pescoço é o lado Counter-Strike.
 */
const LOOK = {
  skin: '#b47b56',
  hair: '#1c1714',
  jersey: '#b8e04a',
  jerseyTrim: '#10131a',
  shorts: '#171b24',
  shoes: '#eef1f6',
  headset: '#12151c',
};

/** Diferença de ângulo pelo caminho mais curto, entre -π e π. */
function shortestAngle(from: number, to: number): number {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

function Part({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  // Geometria e material compartilhados: uma caixa unitária esticada pela
  // escala. Sem isso, cada pedaço do boneco criaria o próprio par na memória.
  return (
    <mesh
      position={position}
      scale={size}
      geometry={unitBox}
      material={boxMaterial(color)}
      castShadow
    />
  );
}

/**
 * O personagem, controlado por teclado ou joystick.
 *
 * O corpo é um quadrado no plano do chão movido pela física própria: para no
 * instante em que a tecla sobe, desliza encostado na parede e empurra a bola
 * quando esbarra nela. O boneco que se vê é outra coisa, montado de caixas por
 * cima desse quadrado, com braços e pernas que giram no ombro e no quadril.
 */
export function Player() {
  const root = useRef<Group>(null);
  const visual = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const torso = useRef<Group>(null);

  const position = useRef({ x: SPAWN[0], z: SPAWN[2] });
  const phase = useRef(0);
  const swing = useRef(0);
  const lastEmote = useRef(0);
  const waveUntil = useRef(0);

  useFrame(({ clock }, delta) => {
    const group = root.current;
    if (!group) return;

    // O teto de 0,1 s evita o teletransporte ao voltar de outra aba. Um teto
    // menor faria o personagem andar em câmera lenta em aparelho que roda
    // abaixo de 30 quadros por segundo.
    const dt = Math.min(delta, 0.1);
    const t = clock.elapsedTime;
    const state = useGameStore.getState();
    const world = gameWorld();

    // Teclado tem prioridade; sem tecla, vale o joystick de toque.
    const keys = keyboardAxis();
    let inputX = keys.x;
    let inputY = keys.y;
    let running = keys.run;
    if (inputX === 0 && inputY === 0) {
      inputX = state.joystick.x;
      inputY = state.joystick.y;
      running = Math.hypot(inputX, inputY) > 0.92;
    }

    // Com painel aberto o personagem fica parado, para as setas rolarem o
    // painel em vez de andar por baixo dele.
    if (state.openPanel) {
      inputX = 0;
      inputY = 0;
    }

    const length = Math.hypot(inputX, inputY);
    if (length > 1) {
      inputX /= length;
      inputY /= length;
    }
    if (length > 0.1 && state.startedAt === null) state.markStarted();

    // A direção é relativa à câmera: W sempre sobe na tela, qualquer que seja
    // o giro. Direita da tela = (cos, 0, -sin); cima da tela = (-sin, 0, -cos).
    const yaw = runtime.cameraYaw;
    const moveX = Math.cos(yaw) * inputX - Math.sin(yaw) * inputY;
    const moveZ = -Math.sin(yaw) * inputX - Math.cos(yaw) * inputY;
    const speed = running ? RUN_SPEED : WALK_SPEED;

    const before = { x: position.current.x, z: position.current.z };
    world.moveBody(position.current, PLAYER_HALF, moveX * speed * dt, moveZ * speed * dt);

    const travelled = Math.hypot(position.current.x - before.x, position.current.z - before.z);
    const moving = length > 0.1 && travelled > 0.0005;

    group.position.set(position.current.x, PLAYER_Y, position.current.z);
    runtime.playerPosition.set(position.current.x, PLAYER_Y, position.current.z);

    if (moving) {
      world.pushBall(ball, BALL_RADIUS, position.current, PLAYER_HALF, speed);
    }

    // ---------------- áreas de proximidade ----------------
    const touching = world.sensorsAt(position.current.x, position.current.z, PLAYER_HALF);
    let interactable: string | null = null;
    for (const id of touching) {
      if (id.startsWith(COMMIT_SENSOR)) state.collect(id.slice(COMMIT_SENSOR.length));
      else interactable ??= id;
    }
    if (interactable !== state.nearby) {
      state.setNearby(interactable as Parameters<typeof state.setNearby>[0]);
    }

    // ---------------- animação ----------------
    if (moving) {
      const facing = Math.atan2(moveX, moveZ);
      runtime.playerFacing += shortestAngle(runtime.playerFacing, facing) * Math.min(1, dt * 14);
    }
    group.rotation.y = runtime.playerFacing;

    // A fase do passo anda com a distância percorrida, não com o tempo: o pé
    // nunca desliza no chão, nem correndo, nem encostado na parede.
    const previousPhase = phase.current;
    phase.current += travelled * STRIDE;
    if (moving && Math.sign(Math.sin(previousPhase)) !== Math.sign(Math.sin(phase.current))) {
      state.sfx('step');
    }

    swing.current += ((moving ? (running ? 1 : 0.75) : 0) - swing.current) * Math.min(1, dt * 12);
    const legAngle = Math.sin(phase.current) * 0.75 * swing.current;
    if (leftLeg.current) leftLeg.current.rotation.x = legAngle;
    if (rightLeg.current) rightLeg.current.rotation.x = -legAngle;
    if (leftArm.current) leftArm.current.rotation.x = -legAngle * 0.8;

    // Aceno: a tecla 1 levanta o braço direito e balança a mão.
    if (state.emoteSeq !== lastEmote.current) {
      lastEmote.current = state.emoteSeq;
      waveUntil.current = t + WAVE_SECONDS;
    }
    const arm = rightArm.current;
    if (arm) {
      if (t < waveUntil.current) {
        arm.rotation.x += (0 - arm.rotation.x) * Math.min(1, dt * 12);
        arm.rotation.z += (2.7 + Math.sin(t * 14) * 0.35 - arm.rotation.z) * Math.min(1, dt * 14);
      } else {
        arm.rotation.x = legAngle * 0.8;
        arm.rotation.z += (0 - arm.rotation.z) * Math.min(1, dt * 10);
      }
    }

    const bob = Math.abs(Math.sin(phase.current)) * 0.05 * swing.current;
    const breathe = Math.sin(t * 2.2) * 0.008 * (1 - swing.current);
    if (visual.current) visual.current.position.y = bob;
    if (torso.current) torso.current.scale.y = 1 + breathe;
  });

  // O boneco é desenhado com os pés em -0,63, para o grupo ficar na altura do
  // centro do corpo e a rotação girar em torno do eixo dele.
  return (
    <group ref={root} position={[SPAWN[0], PLAYER_Y, SPAWN[2]]}>
      <group ref={visual}>
        {(
          [
            [leftLeg, -0.085],
            [rightLeg, 0.085],
          ] as const
        ).map(([ref, x]) => (
          <group key={x} ref={ref} position={[x, -0.15, 0]}>
            <Part position={[0, -0.21, 0]} size={[0.13, 0.36, 0.14]} color={LOOK.skin} />
            <Part position={[0, -0.05, 0]} size={[0.15, 0.14, 0.16]} color={LOOK.shorts} />
            <Part position={[0, -0.44, 0.035]} size={[0.15, 0.08, 0.23]} color={LOOK.shoes} />
          </group>
        ))}

        <group ref={torso} position={[0, 0.12, 0]}>
          <Part position={[0, 0, 0]} size={[0.38, 0.42, 0.22]} color={LOOK.jersey} />
          <Part position={[0, 0.2, 0]} size={[0.39, 0.04, 0.23]} color={LOOK.jerseyTrim} />
          <Part position={[0, -0.02, 0.112]} size={[0.1, 0.14, 0.01]} color={LOOK.jerseyTrim} />
        </group>

        <group ref={leftArm} position={[-0.245, 0.3, 0]}>
          <Part position={[0, -0.14, 0]} size={[0.1, 0.18, 0.11]} color={LOOK.jersey} />
          <Part position={[0, -0.3, 0]} size={[0.09, 0.16, 0.1]} color={LOOK.skin} />
        </group>
        <group ref={rightArm} position={[0.245, 0.3, 0]}>
          <Part position={[0, -0.14, 0]} size={[0.1, 0.18, 0.11]} color={LOOK.jersey} />
          <Part position={[0, -0.3, 0]} size={[0.09, 0.16, 0.1]} color={LOOK.skin} />
        </group>

        <Part position={[0, 0.49, 0]} size={[0.28, 0.28, 0.26]} color={LOOK.skin} />
        <Part position={[0, 0.65, -0.01]} size={[0.3, 0.08, 0.28]} color={LOOK.hair} />
        <Part position={[0, 0.54, -0.12]} size={[0.3, 0.18, 0.05]} color={LOOK.hair} />
        <Part position={[-0.06, 0.5, 0.131]} size={[0.04, 0.05, 0.01]} color="#12151c" />
        <Part position={[0.06, 0.5, 0.131]} size={[0.04, 0.05, 0.01]} color="#12151c" />

        <Part position={[0, 0.34, 0]} size={[0.3, 0.05, 0.24]} color={LOOK.headset} />
        <Part position={[-0.15, 0.33, 0.06]} size={[0.05, 0.09, 0.09]} color={LOOK.headset} />
        <Part position={[0.15, 0.33, 0.06]} size={[0.05, 0.09, 0.09]} color={LOOK.headset} />
      </group>
    </group>
  );
}
