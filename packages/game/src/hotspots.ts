/**
 * Registro dos objetos interativos do quarto.
 *
 * Cada objeto é uma entrada de configuração, não código espalhado pela cena.
 * Somar um objeto novo é acrescentar uma linha aqui, um visual em
 * scene/furniture.tsx e um painel no app. O TypeScript acusa o que faltar,
 * porque os dois lados mapeiam cada id.
 *
 * Coordenadas em metros. O quarto vai de -5 a 5 em x e em z; y é a altura.
 * Na câmera inicial as paredes norte (z = -5) e oeste (x = -5) ficam ao fundo.
 */

export type Vec3 = [number, number, number];

export type WallId = 'norte' | 'sul' | 'oeste' | 'leste';

export interface Box {
  position: Vec3;
  halfSize: Vec3;
}

export interface InteractableConfig {
  id: string;
  /** Partes sólidas do móvel, que o personagem não atravessa. */
  bodies: Box[];
  /** Área invisível onde, pisando, aparece a dica de interação. */
  zone: Box;
  /** Onde o losango flutua. Ausente = sem losango, para objeto secreto. */
  marker?: Vec3;
  /**
   * Parede em que o objeto está pendurado. Quando essa parede fica do lado da
   * câmera ela é rebaixada, e o objeto some junto, como no Sims.
   */
  wall?: WallId;
}

export const HOTSPOTS = [
  {
    // O visitante nasce em cima deste tapete, então a primeira dica aparece
    // antes de qualquer tecla: é o tutorial que não parece tutorial.
    id: 'sobre',
    bodies: [],
    zone: { position: [0, 0.5, 4.1], halfSize: [0.85, 0.5, 0.6] },
    marker: [0, 1.4, 4.1],
  },
  {
    id: 'pc',
    bodies: [
      { position: [-2.6, 0.38, -4.45], halfSize: [1.2, 0.38, 0.45] },
      { position: [-2.6, 0.45, -3.45], halfSize: [0.28, 0.45, 0.28] },
    ],
    zone: { position: [-2.6, 0.5, -3.3], halfSize: [1.3, 0.5, 0.6] },
    marker: [-2.6, 2.1, -4.45],
  },
  {
    id: 'lousa',
    bodies: [],
    zone: { position: [1.6, 0.5, -4.2], halfSize: [1.0, 0.5, 0.7] },
    marker: [1.6, 2.4, -4.8],
    wall: 'norte',
  },
  {
    id: 'mapa',
    bodies: [],
    zone: { position: [3.95, 0.5, -4.2], halfSize: [0.7, 0.5, 0.7] },
    marker: [3.95, 2.35, -4.8],
    wall: 'norte',
  },
  {
    id: 'certificados',
    bodies: [],
    zone: { position: [-4.2, 0.5, -0.7], halfSize: [0.7, 0.5, 1.3] },
    marker: [-4.8, 2.5, -0.7],
    wall: 'oeste',
  },
  {
    id: 'trofeus',
    bodies: [{ position: [4.55, 0.95, -1.4], halfSize: [0.4, 0.95, 0.9] }],
    zone: { position: [3.6, 0.5, -1.4], halfSize: [0.6, 0.5, 1.0] },
    marker: [4.55, 2.3, -1.4],
  },
  {
    id: 'formacao',
    bodies: [{ position: [4.6, 0.6, 1.3], halfSize: [0.35, 0.6, 0.7] }],
    zone: { position: [3.7, 0.5, 1.4], halfSize: [0.6, 0.5, 0.9] },
    marker: [4.6, 1.85, 1.3],
  },
  {
    id: 'contato',
    bodies: [{ position: [-4.55, 0.3, 1.5], halfSize: [0.3, 0.3, 0.3] }],
    zone: { position: [-3.7, 0.5, 1.5], halfSize: [0.55, 0.5, 0.45] },
    marker: [-4.55, 1.2, 1.5],
  },
] as const satisfies readonly InteractableConfig[];

export type HotspotId = (typeof HOTSPOTS)[number]['id'];

export const HOTSPOT_IDS: readonly HotspotId[] = HOTSPOTS.map((hotspot) => hotspot.id);

/**
 * O abajur não é currículo: é uma ação. Chegar perto e apertar E apaga a luz
 * do quarto, e sobram o LED, as telas e a lua pela janela. Não tem losango
 * de propósito, é para ser descoberto.
 */
export const LAMP = {
  id: 'abajur',
  bodies: [{ position: [-4.5, 0.8, -4.5], halfSize: [0.16, 0.8, 0.16] }],
  zone: { position: [-4.3, 0.5, -3.8], halfSize: [0.45, 0.5, 0.4] },
} as const satisfies InteractableConfig;

export type InteractableId = HotspotId | typeof LAMP.id;

/** Móveis que só atrapalham o caminho. */
export const OBSTACLES: readonly Box[] = [
  // cama encostada na parede oeste
  { position: [-3.9, 0.28, 3.3], halfSize: [0.95, 0.28, 1.25] },
  // vaso de planta ao lado da mesa
  { position: [-0.55, 0.35, -4.6], halfSize: [0.22, 0.35, 0.22] },
  // vaso de planta no canto nordeste
  { position: [4.6, 0.45, -4.6], halfSize: [0.25, 0.45, 0.25] },
];

export const SPAWN: Vec3 = [0, 0.7, 3.85];
