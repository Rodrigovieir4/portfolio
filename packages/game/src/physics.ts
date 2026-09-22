import type { Box, Vec3 } from './hotspots';

/**
 * Física do quarto, escrita à mão.
 *
 * Antes isto era o Rapier. Ele é excelente e resolve mundo com rampa, junta e
 * corpo articulado, mas custava 811 kB na rede, metade do peso da página, por
 * embutir um módulo WebAssembly. O quarto aqui é um chão plano, vinte e cinco
 * caixas alinhadas aos eixos, um personagem e uma bola. Para isso, cem linhas
 * de teste de caixa contra caixa e esfera contra caixa dão o mesmo resultado,
 * rodam em qualquer aparelho e não baixam nada.
 *
 * Tudo é alinhado aos eixos de propósito: móvel não gira, então o teste de
 * colisão vira comparação de intervalo, que é a conta mais barata que existe.
 */

export interface SensorDef {
  id: string;
  box: Box;
}

interface Aabb {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

function toAabb({ position, halfSize }: Box): Aabb {
  return {
    minX: position[0] - halfSize[0],
    maxX: position[0] + halfSize[0],
    minY: position[1] - halfSize[1],
    maxY: position[1] + halfSize[1],
    minZ: position[2] - halfSize[2],
    maxZ: position[2] + halfSize[2],
  };
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export interface BallState {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  /** Rolagem acumulada, só para girar a malha na tela. */
  spinX: number;
  spinZ: number;
}

const GRAVITY = 12;
const RESTITUTION = 0.55;
/** Quanto a bola perde de velocidade lateral ao bater. */
const SURFACE_FRICTION = 0.72;
const ROLL_DAMPING = 0.8;
const SLEEP_SPEED = 0.05;

export class GameWorld {
  private readonly solids: Aabb[];
  private readonly sensors: { id: string; box: Aabb }[];

  constructor(solids: readonly Box[], sensors: readonly SensorDef[]) {
    this.solids = solids.map(toAabb);
    this.sensors = sensors.map((sensor) => ({ id: sensor.id, box: toAabb(sensor.box) }));
  }

  /**
   * Move o personagem com deslizamento na parede.
   *
   * O personagem é tratado como um quadrado no plano do chão, não como
   * círculo: contra caixa alinhada ao eixo, quadrado contra quadrado resolve em
   * duas comparações e nunca trava em quina. A separação é feita um eixo por
   * vez, e é isso que produz o deslizamento: bater de frente na parede zera o
   * avanço naquele eixo e deixa o outro passar.
   */
  moveBody(position: { x: number; z: number }, half: number, dx: number, dz: number): void {
    position.x += dx;
    this.resolveAxis(position, half, 'x');
    position.z += dz;
    this.resolveAxis(position, half, 'z');
  }

  private resolveAxis(position: { x: number; z: number }, half: number, axis: 'x' | 'z'): void {
    for (const box of this.solids) {
      if (
        position.x + half <= box.minX ||
        position.x - half >= box.maxX ||
        position.z + half <= box.minZ ||
        position.z - half >= box.maxZ
      ) {
        continue;
      }
      if (axis === 'x') {
        const fromLeft = box.minX - (position.x + half);
        const fromRight = box.maxX - (position.x - half);
        position.x += Math.abs(fromLeft) < Math.abs(fromRight) ? fromLeft : fromRight;
      } else {
        const fromFront = box.minZ - (position.z + half);
        const fromBack = box.maxZ - (position.z - half);
        position.z += Math.abs(fromFront) < Math.abs(fromBack) ? fromFront : fromBack;
      }
    }
  }

  /** Ids das áreas invisíveis que o quadrado do personagem toca agora. */
  sensorsAt(x: number, z: number, half: number): Set<string> {
    const touching = new Set<string>();
    for (const { id, box } of this.sensors) {
      if (
        x + half > box.minX &&
        x - half < box.maxX &&
        z + half > box.minZ &&
        z - half < box.maxZ
      ) {
        touching.add(id);
      }
    }
    return touching;
  }

  /** A bola está dentro desta caixa? Usado pelo gol. */
  static contains(box: Box, x: number, y: number, z: number): boolean {
    const aabb = toAabb(box);
    return (
      x > aabb.minX &&
      x < aabb.maxX &&
      y > aabb.minY &&
      y < aabb.maxY &&
      z > aabb.minZ &&
      z < aabb.maxZ
    );
  }

  /**
   * Integra a bola e resolve o choque contra o chão e contra cada caixa.
   *
   * Contra caixa alinhada ao eixo, o ponto mais próximo do centro da esfera sai
   * de três clamps. Se ele estiver a menos de um raio, há choque: a bola é
   * empurrada para fora e a velocidade é refletida na normal, perdendo energia.
   */
  stepBall(ball: BallState, radius: number, dt: number): void {
    ball.vy -= GRAVITY * dt;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    ball.z += ball.vz * dt;

    // chão
    if (ball.y < radius) {
      ball.y = radius;
      if (ball.vy < 0) ball.vy = -ball.vy * RESTITUTION;
      if (Math.abs(ball.vy) < 0.6) ball.vy = 0;
      ball.vx *= ROLL_DAMPING ** dt;
      ball.vz *= ROLL_DAMPING ** dt;
    }

    for (const box of this.solids) {
      const closestX = clamp(ball.x, box.minX, box.maxX);
      const closestY = clamp(ball.y, box.minY, box.maxY);
      const closestZ = clamp(ball.z, box.minZ, box.maxZ);
      let nx = ball.x - closestX;
      let ny = ball.y - closestY;
      let nz = ball.z - closestZ;
      const distance = Math.hypot(nx, ny, nz);
      if (distance >= radius) continue;

      if (distance < 1e-5) {
        // Centro dentro da caixa: empurra pela face mais próxima.
        nx = ball.x - (box.minX + box.maxX) / 2;
        nz = ball.z - (box.minZ + box.maxZ) / 2;
        ny = 0;
      }
      const length = Math.hypot(nx, ny, nz) || 1;
      nx /= length;
      ny /= length;
      nz /= length;

      const penetration = radius - distance;
      ball.x += nx * penetration;
      ball.y += ny * penetration;
      ball.z += nz * penetration;

      const along = ball.vx * nx + ball.vy * ny + ball.vz * nz;
      if (along < 0) {
        ball.vx -= (1 + RESTITUTION) * along * nx;
        ball.vy -= (1 + RESTITUTION) * along * ny;
        ball.vz -= (1 + RESTITUTION) * along * nz;
        ball.vx *= SURFACE_FRICTION;
        ball.vz *= SURFACE_FRICTION;
      }
    }

    // Parar de vez evita a bola tremendo eternamente no chão.
    if (Math.hypot(ball.vx, ball.vz) < SLEEP_SPEED && Math.abs(ball.vy) < SLEEP_SPEED) {
      ball.vx = 0;
      ball.vz = 0;
      ball.vy = 0;
    }

    // Giro só para a aparência: a bola rola na direção em que anda.
    ball.spinX += (ball.vz / radius) * dt;
    ball.spinZ += (-ball.vx / radius) * dt;
  }

  /**
   * Empurra a bola quando o personagem encosta nela.
   *
   * É o que torna possível conduzir a bola andando, em vez de só chutar.
   */
  pushBall(
    ball: BallState,
    radius: number,
    player: { x: number; z: number },
    playerHalf: number,
    speed: number,
  ): void {
    const dx = ball.x - player.x;
    const dz = ball.z - player.z;
    const distance = Math.hypot(dx, dz);
    const contact = playerHalf + radius;
    if (distance > contact || distance < 1e-4) return;

    const nx = dx / distance;
    const nz = dz / distance;
    ball.x = player.x + nx * contact;
    ball.z = player.z + nz * contact;
    const push = Math.max(speed * 0.9, 1.2);
    ball.vx = nx * push;
    ball.vz = nz * push;
  }
}

/** Constrói uma caixa a partir do centro e das meias-medidas. */
export function box(position: Vec3, halfSize: Vec3): Box {
  return { position, halfSize };
}
