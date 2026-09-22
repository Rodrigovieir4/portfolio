import { create } from 'zustand';

import { ACHIEVEMENTS, SPEEDRUN_MS, type AchievementId } from './achievements';
import { playSfx, type Sfx } from './audio';
import { COMMIT_IDS } from './collectibles';
import { HOTSPOT_IDS, LAMP, type HotspotId, type InteractableId } from './hotspots';
import { saveQuality, type QualityMode, type QualityTier } from './quality';

/**
 * Painel aberto. Um objeto do quarto, a comemoração do gol ou o fechamento do
 * tour. O PC não abre painel: abre o RodrigoOS, mas usa o mesmo id.
 */
export type PanelId = HotspotId | 'gol' | 'final';

export interface Toast {
  key: number;
  achievement: AchievementId;
}

interface GameState {
  /** Objeto cuja área de proximidade o personagem está pisando agora. */
  nearby: InteractableId | null;
  openPanel: PanelId | null;
  /** Objetos que o visitante já abriu, para o contador e o fim do tour. */
  visited: HotspotId[];
  collected: string[];
  achievements: AchievementId[];
  toasts: Toast[];
  goals: number;
  lampOn: boolean;
  soundOn: boolean;
  scoreboardOpen: boolean;
  helpOpen: boolean;
  /** Primeiro passo e último objeto visitado, em ms de performance.now(). */
  startedAt: number | null;
  finishedAt: number | null;
  completionShown: boolean;

  /** Vetor do joystick de toque, de -1 a 1 em cada eixo. */
  joystick: { x: number; y: number };
  /** Quantas vezes a câmera girou 90 graus. O módulo por 4 dá o lado. */
  cameraStep: number;
  /**
   * Contadores de pedido. São números, não booleanos, para que dois chutes
   * seguidos sejam dois eventos: quem reage observa a mudança do valor.
   */
  kickSeq: number;
  emoteSeq: number;

  /** O que o visitante escolheu no menu. 'auto' deixa o jogo decidir. */
  quality: QualityMode;
  /** O nível que o ajuste automático chegou medindo os quadros por segundo. */
  autoTier: QualityTier;

  setNearby: (id: InteractableId | null) => void;
  interact: () => void;
  openPanelFor: (id: PanelId) => void;
  closePanel: () => void;
  collect: (id: string) => void;
  registerGoal: () => void;
  markStarted: () => void;
  setJoystick: (x: number, y: number) => void;
  rotateCamera: (direction: 1 | -1) => void;
  requestKick: () => void;
  requestEmote: () => void;
  toggleSound: () => void;
  toggleScoreboard: (open?: boolean) => void;
  toggleHelp: (open?: boolean) => void;
  dismissToast: (key: number) => void;
  sfx: (name: Sfx) => void;
  /** `remember` fica falso ao restaurar o que já estava salvo. */
  setQuality: (mode: QualityMode, remember?: boolean) => void;
  setAutoTier: (tier: QualityTier) => void;
}

/** O nível em vigor: o escolhido à mão, ou o que o automático decidiu. */
export function activeTier(state: { quality: QualityMode; autoTier: QualityTier }): QualityTier {
  return state.quality === 'auto' ? state.autoTier : state.quality;
}

let toastKey = 0;

export const useGameStore = create<GameState>((set, get) => {
  /** Libera uma conquista uma vez só, com aviso na tela e som. */
  function unlock(id: AchievementId) {
    const state = get();
    if (state.achievements.includes(id)) return;
    const achievements = [...state.achievements, id].sort(
      (a, b) => ACHIEVEMENTS.indexOf(a) - ACHIEVEMENTS.indexOf(b),
    );
    set({ achievements, toasts: [...state.toasts, { key: ++toastKey, achievement: id }] });
    get().sfx('achievement');

    // Platina = as três conquistas que dão trabalho de verdade.
    const needed: AchievementId[] = ['explorador', 'colecionador', 'primeiro-gol'];
    if (id !== 'platina' && needed.every((item) => achievements.includes(item))) {
      unlock('platina');
    }
  }

  return {
    nearby: null,
    openPanel: null,
    visited: [],
    collected: [],
    achievements: [],
    toasts: [],
    goals: 0,
    lampOn: true,
    soundOn: false,
    scoreboardOpen: false,
    helpOpen: false,
    startedAt: null,
    finishedAt: null,
    completionShown: false,
    joystick: { x: 0, y: 0 },
    cameraStep: 0,
    kickSeq: 0,
    emoteSeq: 0,
    // Começa no automático e no nível alto: o ajuste desce sozinho em dois
    // segundos se o aparelho não der conta, e é melhor uma primeira impressão
    // bonita que se adapta do que uma feia que nunca melhora.
    quality: 'auto',
    autoTier: 'alto',

    setNearby: (id) => set({ nearby: id }),

    interact: () => {
      const { nearby, openPanel } = get();
      if (!nearby || openPanel) return;
      if (nearby === LAMP.id) {
        const lampOn = !get().lampOn;
        set({ lampOn });
        get().sfx('toggle');
        if (!lampOn) unlock('boa-noite');
        return;
      }
      get().openPanelFor(nearby);
    },

    openPanelFor: (id) => {
      const state = get();
      const isHotspot = (HOTSPOT_IDS as readonly string[]).includes(id);
      const firstVisit = isHotspot && !state.visited.includes(id as HotspotId);
      const visited = firstVisit ? [...state.visited, id as HotspotId] : state.visited;
      const tourDone = visited.length === HOTSPOT_IDS.length;
      const finishedAt =
        tourDone && state.finishedAt === null ? performance.now() : state.finishedAt;

      set({ openPanel: id, visited, finishedAt, scoreboardOpen: false });
      get().sfx('open');

      if (tourDone && state.finishedAt === null) {
        unlock('explorador');
        const started = state.startedAt ?? finishedAt ?? 0;
        if (finishedAt !== null && finishedAt - started < SPEEDRUN_MS) unlock('speedrun');
      }
    },

    closePanel: () => {
      const state = get();
      if (!state.openPanel) return;
      get().sfx('close');
      // Fechar o último objeto do tour abre o painel de conclusão, uma vez.
      if (
        state.openPanel !== 'final' &&
        state.visited.length === HOTSPOT_IDS.length &&
        !state.completionShown
      ) {
        set({ openPanel: 'final', completionShown: true });
        return;
      }
      set({ openPanel: null });
    },

    collect: (id) => {
      const state = get();
      if (state.collected.includes(id)) return;
      const collected = [...state.collected, id];
      set({ collected });
      get().sfx('pickup');
      if (collected.length === COMMIT_IDS.length) unlock('colecionador');
    },

    registerGoal: () => {
      const goals = get().goals + 1;
      set({ goals });
      get().sfx('goal');
      unlock('primeiro-gol');
      if (goals >= 3) unlock('hat-trick');
      // Só o primeiro gol abre o contato. Depois disso, gol é só diversão.
      if (goals === 1) get().openPanelFor('gol');
    },

    markStarted: () => {
      if (get().startedAt === null) set({ startedAt: performance.now() });
    },

    setJoystick: (x, y) => set({ joystick: { x, y } }),

    rotateCamera: (direction) => set((state) => ({ cameraStep: state.cameraStep + direction })),

    requestKick: () => set((state) => ({ kickSeq: state.kickSeq + 1 })),

    requestEmote: () => set((state) => ({ emoteSeq: state.emoteSeq + 1 })),

    toggleSound: () => {
      const soundOn = !get().soundOn;
      set({ soundOn });
      // Tocar ao ligar é o gesto que o navegador exige para liberar o áudio.
      if (soundOn) playSfx('toggle');
    },

    toggleScoreboard: (open) => set((state) => ({ scoreboardOpen: open ?? !state.scoreboardOpen })),

    toggleHelp: (open) => set((state) => ({ helpOpen: open ?? !state.helpOpen })),

    dismissToast: (key) =>
      set((state) => ({ toasts: state.toasts.filter((toast) => toast.key !== key) })),

    sfx: (name) => {
      if (get().soundOn) playSfx(name);
    },

    setQuality: (mode, remember = true) => {
      set({ quality: mode });
      // Escolher um nível à mão vira também o ponto de partida do automático,
      // caso o visitante volte para ele depois.
      if (mode !== 'auto') set({ autoTier: mode });
      if (remember) saveQuality(mode);
    },

    setAutoTier: (tier) => {
      if (get().autoTier !== tier) set({ autoTier: tier });
    },
  };
});
