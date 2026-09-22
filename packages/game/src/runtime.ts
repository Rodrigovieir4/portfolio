/**
 * Valores que mudam a cada quadro e que mais de um componente precisa ler.
 *
 * Ficam num objeto comum, fora do React, de propósito. Guardar a posição do
 * personagem em estado faria a câmera, a bola e o HUD renderizarem de novo
 * sessenta vezes por segundo. Aqui o personagem escreve dentro do useFrame e
 * os outros leem dentro do useFrame deles, sem render nenhum.
 *
 * Não usa Vector3 do three de propósito: este arquivo é importado pelo HUD,
 * que carrega antes do jogo, e não pode arrastar o three para o bundle inicial.
 */

import type { BallState } from './physics';

export interface Point3 {
  x: number;
  y: number;
  z: number;
  set: (x: number, y: number, z: number) => void;
}

function point(x: number, y: number, z: number): Point3 {
  return {
    x,
    y,
    z,
    set(nextX, nextY, nextZ) {
      this.x = nextX;
      this.y = nextY;
      this.z = nextZ;
    },
  };
}

/** Estado da bola, integrado pela física própria a cada quadro. */
export const ball: BallState = {
  x: 1,
  y: 0.6,
  z: 1.4,
  vx: 0,
  vy: 0,
  vz: 0,
  spinX: 0,
  spinZ: 0,
};

export const BALL_START = { x: 1, y: 0.6, z: 1.4 } as const;

export function resetBall(): void {
  Object.assign(ball, BALL_START, { vx: 0, vy: 0, vz: 0 });
}

export const runtime = {
  playerPosition: point(0, 0, 3),
  /** Posição da bola, escrita pela própria bola a cada quadro. */
  ballPosition: point(1, 0.2, 1.4),
  /** Para onde o personagem está virado, em radianos, no plano do chão. */
  playerFacing: 0,
  /** Ângulo atual da câmera, já suavizado. A movimentação é relativa a ele. */
  cameraYaw: Math.PI / 4,
};

/**
 * Medidas do último quadro, escritas pelo instrumento dentro da cena.
 *
 * Servem para duas coisas: o ajuste automático de qualidade, que precisa saber
 * se o aparelho está dando conta, e o medidor que aparece com ?debug na URL.
 * Ficam aqui, fora do React, porque mudam sessenta vezes por segundo.
 */
export const perf = {
  fps: 0,
  /** Chamadas de desenho por quadro. É o número que mais pesa em GPU fraca. */
  calls: 0,
  triangles: 0,
  geometries: 0,
  textures: 0,
  programs: 0,
};
