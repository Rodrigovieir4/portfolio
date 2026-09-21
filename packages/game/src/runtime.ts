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

export const runtime = {
  playerPosition: point(0, 0, 3),
  /** Posição da bola, escrita pela própria bola a cada quadro. */
  ballPosition: point(1, 0.2, 1.4),
  /** Para onde o personagem está virado, em radianos, no plano do chão. */
  playerFacing: 0,
  /** Ângulo atual da câmera, já suavizado. A movimentação é relativa a ele. */
  cameraYaw: Math.PI / 4,
};
