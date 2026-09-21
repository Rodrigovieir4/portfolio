'use client';

import { useFrame } from '@react-three/fiber';
import {
  CapsuleCollider,
  RigidBody,
  useRapier,
  type RapierCollider,
  type RapierRigidBody,
} from '@react-three/rapier';
import { useEffect, useMemo, useRef } from 'react';
import { Vector3, type Group } from 'three';

import { keyboardAxis } from '../input';
import { runtime } from '../runtime';
import { useGameStore } from '../store';

const WALK_SPEED = 3.2;
const RUN_SPEED = 5.6;
const GRAVITY = 18;
/** Metade da parte reta da cápsula e o raio. Altura total: 2 × (0,35 + 0,28). */
const HALF_HEIGHT = 0.35;
const RADIUS = 0.28;
const SPAWN: [number, number, number] = [0, HALF_HEIGHT + RADIUS + 0.05, 3];

/** Diferença de ângulo pelo caminho mais curto, entre -π e π. */
function shortestAngle(from: number, to: number): number {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

/**
 * O personagem, controlado por teclado ou joystick.
 *
 * É um corpo cinemático movido pelo controlador de personagem do Rapier, não
 * um corpo com física solta. A diferença se sente na mão: física solta
 * escorrega e demora a parar; o controlador para no instante em que a tecla
 * sobe, desliza encostado na parede em vez de travar, e ainda empurra a bola
 * quando esbarra nela.
 */
export function Player() {
  const { world, rapier } = useRapier();
  const body = useRef<RapierRigidBody>(null);
  const collider = useRef<RapierCollider>(null);
  const visual = useRef<Group>(null);
  const verticalSpeed = useRef(0);
  const desired = useRef(new Vector3());

  const controller = useMemo(() => {
    const instance = world.createCharacterController(0.02);
    instance.setSlideEnabled(true);
    instance.enableSnapToGround(0.3);
    instance.enableAutostep(0.2, 0.1, false);
    // Esbarrar na bola empurra a bola: é o que torna possível conduzir.
    instance.setApplyImpulsesToDynamicBodies(true);
    instance.setCharacterMass(60);
    return instance;
  }, [world]);

  useEffect(() => () => world.removeCharacterController(controller), [world, controller]);

  useFrame(({ clock }, delta) => {
    const rigidBody = body.current;
    const shape = collider.current;
    if (!rigidBody || !shape) return;

    // O teto de 0,1 s evita o teletransporte ao voltar de outra aba. Um teto
    // menor, como 1/30, faria o personagem andar em câmera lenta em aparelho
    // que roda abaixo de 30 quadros por segundo.
    const dt = Math.min(delta, 0.1);
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

    // A direção é relativa à câmera: W sempre sobe na tela, qualquer que seja
    // o giro. Direita da tela = (cos, 0, -sin); cima da tela = (-sin, 0, -cos).
    const yaw = runtime.cameraYaw;
    const moveX = Math.cos(yaw) * inputX - Math.sin(yaw) * inputY;
    const moveZ = -Math.sin(yaw) * inputX - Math.cos(yaw) * inputY;
    const speed = running ? RUN_SPEED : WALK_SPEED;

    verticalSpeed.current = controller.computedGrounded()
      ? -1
      : verticalSpeed.current - GRAVITY * dt;

    desired.current.set(moveX * speed * dt, verticalSpeed.current * dt, moveZ * speed * dt);
    // Sem EXCLUDE_SENSORS o controlador trata as áreas invisíveis de
    // proximidade como parede, e o personagem para na borda delas.
    controller.computeColliderMovement(
      shape,
      desired.current,
      rapier.QueryFilterFlags.EXCLUDE_SENSORS,
    );
    const moved = controller.computedMovement();
    const position = rigidBody.translation();
    const next = { x: position.x + moved.x, y: position.y + moved.y, z: position.z + moved.z };
    rigidBody.setNextKinematicTranslation(next);
    runtime.playerPosition.set(next.x, next.y, next.z);

    const group = visual.current;
    if (!group) return;

    const moving = length > 0.1;
    if (moving) {
      const facing = Math.atan2(moveX, moveZ);
      runtime.playerFacing += shortestAngle(runtime.playerFacing, facing) * Math.min(1, dt * 14);
    }
    group.rotation.y = runtime.playerFacing;

    // Balanço de passo: sobe e desce mais rápido correndo, e assenta parado.
    const bob = moving ? Math.abs(Math.sin(clock.elapsedTime * (running ? 16 : 11))) * 0.07 : 0;
    group.position.y += (bob - group.position.y) * Math.min(1, dt * 20);
  });

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
        fixo. As áreas de proximidade são fixas e o personagem é cinemático,
        então sem KINEMATIC_FIXED a dica de interação nunca acenderia.
      */}
      <CapsuleCollider
        ref={collider}
        args={[HALF_HEIGHT, RADIUS]}
        activeCollisionTypes={
          rapier.ActiveCollisionTypes.DEFAULT | rapier.ActiveCollisionTypes.KINEMATIC_FIXED
        }
      />

      <group ref={visual}>
        <mesh castShadow position={[0, -0.05, 0]}>
          <capsuleGeometry args={[RADIUS, HALF_HEIGHT * 2, 6, 12]} />
          <meshStandardMaterial color="#e9ecf2" />
        </mesh>
        {/* Visor verde: mostra para onde o personagem olha. */}
        <mesh position={[0, 0.32, RADIUS - 0.02]} castShadow>
          <boxGeometry args={[0.34, 0.1, 0.1]} />
          <meshStandardMaterial color="#c8f751" emissive="#c8f751" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </RigidBody>
  );
}
