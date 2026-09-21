import type { Vec3 } from './hotspots';

/**
 * Os commits espalhados pelo chão.
 *
 * São doze quadradinhos verdes, iguais às casas do gráfico de contribuições
 * do GitHub. Alguns ficam no caminho natural entre os objetos; outros ficam
 * escondidos atrás da cama, embaixo da janela ou no canto do gol, para
 * premiar quem explora em vez de só visitar.
 *
 * Posições conferidas contra os colisores de hotspots.ts: nenhuma cai dentro
 * de móvel.
 */
export const COMMITS: readonly { id: string; position: Vec3 }[] = [
  { id: 'c01', position: [-1.0, 0.35, -3.0] },
  { id: 'c02', position: [-3.6, 0.35, -2.1] },
  { id: 'c03', position: [0.2, 0.35, -1.8] },
  { id: 'c04', position: [2.8, 0.35, -2.8] },
  { id: 'c05', position: [4.3, 0.35, -3.6] },
  { id: 'c06', position: [-2.4, 0.35, 0.6] },
  { id: 'c07', position: [1.9, 0.35, 0.1] },
  { id: 'c08', position: [-2.4, 0.35, 2.4] },
  { id: 'c09', position: [-4.4, 0.35, 0.55] },
  { id: 'c10', position: [1.2, 0.35, 3.0] },
  { id: 'c11', position: [4.4, 0.35, 3.4] },
  { id: 'c12', position: [-1.7, 0.35, 4.3] },
];

export const COMMIT_IDS = COMMITS.map((commit) => commit.id);
