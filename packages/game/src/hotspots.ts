/**
 * Registro dos objetos interativos do quarto.
 *
 * Cada objeto é uma entrada de configuração, não código espalhado pela cena.
 * Somar um objeto novo é acrescentar uma linha aqui e um painel no app. O
 * TypeScript acusa o painel que faltar, porque o app mapeia cada HotspotId.
 *
 * Coordenadas em metros. O quarto vai de -5 a 5 em x e em z; y é a altura.
 */

export type Vec3 = [number, number, number];

export interface HotspotConfig {
  id: string;
  /** Centro e meias-medidas do móvel sólido, que o personagem não atravessa. */
  body: { position: Vec3; halfSize: Vec3; color: string };
  /** Área invisível onde, pisando, aparece a dica de interação. */
  zone: { position: Vec3; halfSize: Vec3 };
}

export const HOTSPOTS = [
  {
    id: 'pc',
    body: { position: [-3, 0.5, -4.1], halfSize: [1.2, 0.5, 0.5], color: '#2a3140' },
    zone: { position: [-3, 0.5, -2.9], halfSize: [1.3, 0.5, 0.7] },
  },
  {
    id: 'certificados',
    body: { position: [1.4, 1.1, -4.8], halfSize: [1.3, 0.8, 0.08], color: '#3b3350' },
    zone: { position: [1.4, 0.5, -3.8], halfSize: [1.3, 0.5, 0.8] },
  },
  {
    id: 'trofeus',
    body: { position: [4.5, 1, -1], halfSize: [0.4, 1, 0.9], color: '#4a3a2a' },
    zone: { position: [3.5, 0.5, -1], halfSize: [0.7, 0.5, 1.1] },
  },
] as const satisfies readonly HotspotConfig[];

export type HotspotId = (typeof HOTSPOTS)[number]['id'];

export const HOTSPOT_IDS: readonly HotspotId[] = HOTSPOTS.map((hotspot) => hotspot.id);
