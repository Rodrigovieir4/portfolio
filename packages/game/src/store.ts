import { create } from 'zustand';

import type { HotspotId } from './hotspots';

/** Painel aberto: um objeto do quarto, ou a comemoração do gol. */
export type PanelId = HotspotId | 'gol';

interface GameState {
  /** Objeto cuja área de proximidade o personagem está pisando agora. */
  nearby: HotspotId | null;
  openPanel: PanelId | null;
  /** Objetos que o visitante já abriu, para o contador de conquistas. */
  visited: HotspotId[];
  /** Vetor do joystick de toque, de -1 a 1 em cada eixo. */
  joystick: { x: number; y: number };
  /** Quantas vezes a câmera girou 90 graus. Só cresce ou decresce; o módulo por 4 dá o lado. */
  cameraStep: number;
  /**
   * Contador de pedidos de chute. É um número, não um booleano, para que dois
   * chutes seguidos sejam dois eventos: a bola observa a mudança do valor.
   */
  kickSeq: number;
  goals: number;

  setNearby: (id: HotspotId | null) => void;
  interact: () => void;
  openPanelFor: (id: PanelId) => void;
  closePanel: () => void;
  setJoystick: (x: number, y: number) => void;
  rotateCamera: (direction: 1 | -1) => void;
  requestKick: () => void;
  registerGoal: () => void;
}

/**
 * Estado do jogo, compartilhado entre a cena 3D e os painéis em HTML.
 *
 * A cena escreve (quem está perto de quê, quando saiu gol) e o HTML lê para
 * decidir o que mostrar. O que muda a cada quadro, como a posição do
 * personagem, NÃO mora aqui: isso fica em runtime.ts, para não disparar uma
 * renderização do React sessenta vezes por segundo.
 */
export const useGameStore = create<GameState>((set, get) => ({
  nearby: null,
  openPanel: null,
  visited: [],
  joystick: { x: 0, y: 0 },
  cameraStep: 0,
  kickSeq: 0,
  goals: 0,

  setNearby: (id) => set({ nearby: id }),

  interact: () => {
    const { nearby, openPanel } = get();
    if (!nearby || openPanel) return;
    get().openPanelFor(nearby);
  },

  openPanelFor: (id) =>
    set((state) => ({
      openPanel: id,
      visited: id !== 'gol' && !state.visited.includes(id) ? [...state.visited, id] : state.visited,
    })),

  closePanel: () => set({ openPanel: null }),

  setJoystick: (x, y) => set({ joystick: { x, y } }),

  rotateCamera: (direction) => set((state) => ({ cameraStep: state.cameraStep + direction })),

  requestKick: () => set((state) => ({ kickSeq: state.kickSeq + 1 })),

  registerGoal: () => {
    set((state) => ({ goals: state.goals + 1 }));
    get().openPanelFor('gol');
  },
}));
