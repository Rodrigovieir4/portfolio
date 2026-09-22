import { COMMITS } from './collectibles';
import { HOTSPOTS, LAMP, OBSTACLES, type Box, type Vec3, type WallId } from './hotspots';
import { GameWorld, box, type SensorDef } from './physics';

/**
 * A planta do quarto: medidas, paredes e gol.
 *
 * É a fonte única para o que se vê e para o que colide. A cena desenha destes
 * números e a física monta as caixas destes mesmos números, então não existe o
 * bug clássico de mover um móvel na tela e esquecer o colisor.
 */

export const ROOM = { half: 5, thickness: 0.1, height: 2.6, cutHeight: 0.22 } as const;

export interface Wall {
  id: WallId;
  /** Centro no plano do chão. */
  position: [number, number];
  halfSize: [number, number];
  /** Direção que aponta para fora do quarto. */
  outward: [number, number];
}

const { half, thickness, height } = ROOM;

export const WALLS: readonly Wall[] = [
  {
    id: 'norte',
    position: [0, -half - thickness],
    halfSize: [half + thickness * 2, thickness],
    outward: [0, -1],
  },
  {
    id: 'sul',
    position: [0, half + thickness],
    halfSize: [half + thickness * 2, thickness],
    outward: [0, 1],
  },
  { id: 'oeste', position: [-half - thickness, 0], halfSize: [thickness, half], outward: [-1, 0] },
  { id: 'leste', position: [half + thickness, 0], halfSize: [thickness, half], outward: [1, 0] },
];

export const GOAL = {
  x: 3.3,
  z: 4.55,
  halfWidth: 0.8,
  height: 0.9,
  post: 0.05,
} as const;

const left = GOAL.x - GOAL.halfWidth;
const right = GOAL.x + GOAL.halfWidth;
const postHalf: Vec3 = [GOAL.post, GOAL.height / 2, GOAL.post];

/** Traves, travessão e laterais da rede: sólidos, a bola bate e volta. */
export const GOAL_SOLIDS: readonly Box[] = [
  box([left, GOAL.height / 2, GOAL.z - 0.3], postHalf),
  box([right, GOAL.height / 2, GOAL.z - 0.3], postHalf),
  box([GOAL.x, GOAL.height, GOAL.z], [GOAL.halfWidth, GOAL.post, 0.3]),
  box([left, GOAL.height / 2, GOAL.z], [GOAL.post, GOAL.height / 2, 0.3]),
  box([right, GOAL.height / 2, GOAL.z], [GOAL.post, GOAL.height / 2, 0.3]),
];

/** Onde a bola precisa entrar para valer gol. */
export const GOAL_SENSOR: Box = box(
  [GOAL.x, GOAL.height / 2, GOAL.z + 0.05],
  [GOAL.halfWidth - GOAL.post * 2, GOAL.height / 2 - GOAL.post, 0.22],
);

/** Prefixo que separa commit de objeto interativo na lista de sensores. */
export const COMMIT_SENSOR = 'commit:';

function walls(): Box[] {
  return WALLS.map((wall) =>
    box(
      [wall.position[0], height / 2, wall.position[1]],
      [wall.halfSize[0], height / 2, wall.halfSize[1]],
    ),
  );
}

let instance: GameWorld | null = null;

/**
 * O mundo de colisão, montado uma vez.
 *
 * Nada aqui muda durante a partida, então não faz sentido recriar por
 * componente nem guardar em contexto do React: é o mesmo objeto para todos.
 */
export function gameWorld(): GameWorld {
  if (instance) return instance;

  const solids: Box[] = [
    ...walls(),
    ...OBSTACLES,
    ...HOTSPOTS.flatMap((hotspot) => hotspot.bodies as readonly Box[]),
    ...LAMP.bodies,
    ...GOAL_SOLIDS,
  ];

  const sensors: SensorDef[] = [
    ...HOTSPOTS.map((hotspot) => ({ id: hotspot.id as string, box: hotspot.zone as Box })),
    { id: LAMP.id, box: LAMP.zone },
    ...COMMITS.map((commit) => ({
      id: COMMIT_SENSOR + commit.id,
      // A área de coleta é maior que o cubo: encostar já conta.
      box: box([commit.position[0], 0.4, commit.position[2]], [0.3, 0.6, 0.3]),
    })),
  ];

  instance = new GameWorld(solids, sensors);
  return instance;
}
