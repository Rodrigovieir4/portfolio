'use client';

import { useFrame } from '@react-three/fiber';
import {
  CapsuleCollider,
  RigidBody,
  useRapier,
  type RapierCollider,
  type RapierRigidBody,
} from '@react-three/rapier';
import { useEffect, useRef } from 'react';
import { Vector3, type Group } from 'three';

import { SPAWN } from '../hotspots';
import { keyboardAxis } from '../input';
import { runtime } from '../runtime';
import { useGameStore } from '../store';

const WALK_SPEED = 3.2;
const RUN_SPEED = 5.6;
const GRAVITY = 18;
/** Metade da parte reta da cápsula e o raio. Altura total: 2 × (0,35 + 0,28). */
const HALF_HEIGHT = 0.35;
const RADIUS = 0.28;
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
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} flatShading roughness={0.8} />
    </mesh>
  );
}

/**
 * O personagem, controlado por teclado ou joystick.
 *
 * O corpo físico é uma cápsula cinemática movida pelo controlador de
 * personagem do Rapier: para no instante em que a tecla sobe, desliza encostado
 * na parede e empurra a bola quando esbarra nela. O boneco que se vê é outra
 * coisa, montado de caixas por cima da cápsula, com braços e pernas que giram
 * a partir do ombro e do quadril.
 */
export function Player() {
  const { world, rapier } = useRapier();
  const body = useRef<RapierRigidBody>(null);
  const collider = useRef<RapierCollider>(null);
  const visual = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const torso = useRef<Group>(null);

  const verticalSpeed = useRef(0);
  const desired = useRef(new Vector3());
  const phase = useRef(0);
  const swing = useRef(0);
  const lastEmote = useRef(0);
  const waveUntil = useRef(0);

  /**
   * O controlador nasce e morre no mesmo efeito.
   *
   * Com useMemo, o modo estrito do React em desenvolvimento quebrava o jogo: ele
   * monta, desmonta e monta de novo, a desmontagem libera o controlador no
   * Rapier, e o useMemo devolve o mesmo objeto já liberado. Cada quadro passava
   * a lançar erro e o laço de renderização parava. Criando no efeito, a segunda
   * montagem ganha um controlador novo.
   */
  const controller = useRef<ReturnType<typeof world.createCharacterController> | null>(null);

  useEffect(() => {
    const instance = world.createCharacterController(0.02);
    instance.setSlideEnabled(true);
    instance.enableSnapToGround(0.3);
    instance.enableAutostep(0.2, 0.1, false);
    // Esbarrar na bola empurra a bola: é o que torna possível conduzir.
    instance.setApplyImpulsesToDynamicBodies(true);
    instance.setCharacterMass(60);
    controller.current = instance;
    return () => {
      controller.current = null;
      world.removeCharacterController(instance);
    };
  }, [world]);

  useFrame(({ clock }, delta) => {
    const rigidBody = body.current;
    const shape = collider.current;
    const characterController = controller.current;
    if (!rigidBody || !shape || !characterController) return;

    // O teto de 0,1 s evita o teletransporte ao voltar de outra aba. Um teto
    // menor faria o personagem andar em câmera lenta em aparelho que roda
    // abaixo de 30 quadros por segundo.
    const dt = Math.min(delta, 0.1);
    const t = clock.elapsedTime;
    const state = useGameStore.getState();

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

    verticalSpeed.current = characterController.computedGrounded()
      ? -1
      : verticalSpeed.current - GRAVITY * dt;

    desired.current.set(moveX * speed * dt, verticalSpeed.current * dt, moveZ * speed * dt);
    // Sem EXCLUDE_SENSORS o controlador trata as áreas invisíveis de
    // proximidade como parede, e o personagem para na borda delas.
    characterController.computeColliderMovement(
      shape,
      desired.current,
      rapier.QueryFilterFlags.EXCLUDE_SENSORS,
    );
    const moved = characterController.computedMovement();
    const position = rigidBody.translation();
    const next = { x: position.x + moved.x, y: position.y + moved.y, z: position.z + moved.z };
    rigidBody.setNextKinematicTranslation(next);
    runtime.playerPosition.set(next.x, next.y, next.z);

    // ---------------- animação ----------------
    const group = visual.current;
    if (!group) return;

    const travelled = Math.hypot(moved.x, moved.z);
    const moving = length > 0.1 && travelled > 0.0005;
    if (moving) {
      const facing = Math.atan2(moveX, moveZ);
      runtime.playerFacing += shortestAngle(runtime.playerFacing, facing) * Math.min(1, dt * 14);
    }
    group.rotation.y = runtime.playerFacing;

    // A fase do passo anda com a distância percorrida, não com o tempo: o pé
    // nunca desliza no chão, nem correndo, nem encostado na parede.
    const previousPhase = phase.current;
    phase.current += travelled * STRIDE;
    // O som do passo sai quando a perna cruza o meio do movimento.
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

    // Parado, respira; andando, o corpo sobe e desce a cada passo.
    const bob = Math.abs(Math.sin(phase.current)) * 0.05 * swing.current;
    const breathe = Math.sin(t * 2.2) * 0.008 * (1 - swing.current);
    group.position.y = bob;
    if (torso.current) torso.current.scale.y = 1 + breathe;
  });

  // A cápsula vai de -0,63 a +0,63 em torno do centro do corpo. O boneco é
  // desenhado dentro desse volume, com os pés em -0,63.
  return (
    <RigidBody
      ref={body}
      name="player"
      type="kinematicPosition"
      colliders={false}
      position={SPAWN}
      enabledRotations={[false, false, false]}
    >
      {/*
        O Rapier, por padrão, não gera evento entre corpo cinemático e corpo
        fixo. As áreas de proximidade e os commits são fixos e o personagem é
        cinemático, então sem KINEMATIC_FIXED nenhuma dica acenderia.
      */}
      <CapsuleCollider
        ref={collider}
        args={[HALF_HEIGHT, RADIUS]}
        activeCollisionTypes={
          rapier.ActiveCollisionTypes.DEFAULT | rapier.ActiveCollisionTypes.KINEMATIC_FIXED
        }
      />

      <group ref={visual}>
        {/* pernas, girando a partir do quadril */}
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

        {/* braços, girando a partir do ombro */}
        <group ref={leftArm} position={[-0.245, 0.3, 0]}>
          <Part position={[0, -0.14, 0]} size={[0.1, 0.18, 0.11]} color={LOOK.jersey} />
          <Part position={[0, -0.3, 0]} size={[0.09, 0.16, 0.1]} color={LOOK.skin} />
        </group>
        <group ref={rightArm} position={[0.245, 0.3, 0]}>
          <Part position={[0, -0.14, 0]} size={[0.1, 0.18, 0.11]} color={LOOK.jersey} />
          <Part position={[0, -0.3, 0]} size={[0.09, 0.16, 0.1]} color={LOOK.skin} />
        </group>

        {/* cabeça, cabelo e rosto voltado para +z */}
        <Part position={[0, 0.49, 0]} size={[0.28, 0.28, 0.26]} color={LOOK.skin} />
        <Part position={[0, 0.65, -0.01]} size={[0.3, 0.08, 0.28]} color={LOOK.hair} />
        <Part position={[0, 0.54, -0.12]} size={[0.3, 0.18, 0.05]} color={LOOK.hair} />
        <Part position={[-0.06, 0.5, 0.131]} size={[0.04, 0.05, 0.01]} color="#12151c" />
        <Part position={[0.06, 0.5, 0.131]} size={[0.04, 0.05, 0.01]} color="#12151c" />

        {/* headset no pescoço */}
        <mesh position={[0, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.14, 0.022, 6, 16]} />
          <meshStandardMaterial color={LOOK.headset} />
        </mesh>
        <Part position={[-0.15, 0.33, 0.06]} size={[0.05, 0.09, 0.09]} color={LOOK.headset} />
        <Part position={[0.15, 0.33, 0.06]} size={[0.05, 0.09, 0.09]} color={LOOK.headset} />
      </group>
    </RigidBody>
  );
}
