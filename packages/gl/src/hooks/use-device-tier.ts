'use client';

import { useSyncExternalStore } from 'react';

/**
 * Descobre quanto a maquina do visitante aguenta antes de montar a cena.
 *
 * Um portfolio que trava e pior do que um portfolio simples: o recrutador
 * fecha a aba antes de ler qualquer coisa. Entao a cena nasce ja calibrada,
 * em vez de tentar o maximo e degradar depois que o estrago aconteceu.
 *
 * A leitura usa useSyncExternalStore em vez de useState com useEffect. As
 * media queries do navegador sao exatamente o caso de uso dessa API: uma fonte
 * de verdade que vive fora do React. O ganho pratico e que o valor certo chega
 * na primeira renderizacao do cliente, sem o quadro extra em que a cena monta
 * com o perfil errado e so depois se corrige.
 */

export type DeviceTier = 'off' | 'low' | 'mid' | 'high';

export interface DeviceProfile {
  tier: DeviceTier;
  /** Quantidade de particulas segura para esta maquina. */
  particleCount: number;
  /** Se vale ligar bloom e aberracao cromatica, que custam passes extras. */
  postProcessing: boolean;
  dpr: [number, number];
}

const PROFILES: Record<DeviceTier, Omit<DeviceProfile, 'tier'>> = {
  off: { particleCount: 0, postProcessing: false, dpr: [1, 1] },
  low: { particleCount: 6000, postProcessing: false, dpr: [1, 1] },
  mid: { particleCount: 22000, postProcessing: true, dpr: [1, 1.5] },
  high: { particleCount: 48000, postProcessing: true, dpr: [1, 2] },
};

/**
 * O teste de WebGL2 cria um canvas e um contexto, o que e caro demais para
 * rodar a cada renderizacao. Como a resposta nunca muda durante a sessao, ela
 * e calculada uma vez e guardada.
 */
let webgl2Support: boolean | null = null;

function supportsWebGL2(): boolean {
  if (webgl2Support !== null) return webgl2Support;

  try {
    const canvas = document.createElement('canvas');
    webgl2Support = Boolean(canvas.getContext('webgl2'));
  } catch {
    webgl2Support = false;
  }

  return webgl2Support;
}

function detectTier(): DeviceTier {
  // Quem pediu menos animacao no sistema recebe menos animacao. Sem discussao.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off';

  // Sem WebGL2 nao ha o que negociar.
  if (!supportsWebGL2()) return 'off';

  const cores = navigator.hardwareConcurrency ?? 4;
  // memoria do dispositivo em GB, exposta so em navegadores baseados em Chromium
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.matchMedia('(max-width: 767px)').matches;

  // Celular quase sempre e limitado por bateria e preenchimento de tela, nao
  // por nucleos. Tratar como low evita superaquecer o aparelho do visitante.
  if (coarsePointer && narrow) return 'low';
  if (cores <= 4 || memory <= 4) return 'low';
  if (cores >= 8 && memory >= 8) return 'high';
  return 'mid';
}

const WATCHED_QUERIES = [
  '(prefers-reduced-motion: reduce)',
  '(pointer: coarse)',
  '(max-width: 767px)',
];

/** Reavalia o perfil sempre que uma das condicoes observadas muda. */
function subscribeToEnvironment(onChange: () => void): () => void {
  const lists = WATCHED_QUERIES.map((query) => window.matchMedia(query));
  lists.forEach((list) => list.addEventListener('change', onChange));

  return () => {
    lists.forEach((list) => list.removeEventListener('change', onChange));
  };
}

/**
 * No servidor o perfil e 'mid'. E o meio-termo: o HTML enviado nao presume uma
 * maquina potente nem entrega o fallback estatico a quem tem GPU.
 */
function serverTier(): DeviceTier {
  return 'mid';
}

export function useDeviceTier(): DeviceProfile {
  const tier = useSyncExternalStore(subscribeToEnvironment, detectTier, serverTier);
  return { tier, ...PROFILES[tier] };
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeToReducedMotion(onChange: () => void): () => void {
  const list = window.matchMedia(REDUCED_MOTION_QUERY);
  list.addEventListener('change', onChange);
  return () => list.removeEventListener('change', onChange);
}

/** Versao enxuta para componentes que so precisam saber se podem animar. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}
