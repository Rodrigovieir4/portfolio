/**
 * Níveis de qualidade.
 *
 * O jogo tem que rodar no notebook do escritório e no celular de quem abre o
 * link no ônibus, sem exigir placa de vídeo. A saída é ter três níveis e
 * escolher sozinho, medindo os quadros por segundo em vez de tentar adivinhar
 * o aparelho pelo nome dele — o mesmo modelo de celular anda rápido frio e
 * devagar quente, e nenhuma lista de modelos sabe disso.
 *
 * O que cada nível liga e desliga foi escolhido pelo custo real medido:
 *
 * - Sombra é o mais caro. Todo objeto que projeta sombra é desenhado duas
 *   vezes por quadro, e o mapa de sombra ainda é uma textura a mais.
 * - Pós-processamento vem em seguida. O brilho passa a tela inteira por vários
 *   borrões, e o custo cresce com o número de pixels, não com o da cena.
 * - Resolução é a que dá o ganho mais garantido: cair de 1,75 para 1 pixel por
 *   ponto na tela corta dois terços dos pixels desenhados.
 *
 * Este arquivo não importa o three de propósito: o seletor de qualidade fica
 * no HUD, que carrega antes do motor.
 */

export const QUALITY_TIERS = ['baixo', 'medio', 'alto'] as const;
export type QualityTier = (typeof QUALITY_TIERS)[number];
/** 'auto' deixa o jogo decidir pelos quadros por segundo medidos. */
export type QualityMode = QualityTier | 'auto';

export interface QualitySettings {
  shadows: boolean;
  shadowMapSize: number;
  /** Brilho e vinheta. É o passe mais caro em tela grande. */
  effects: boolean;
  /** Poeira flutuando na luz do abajur. */
  sparkles: boolean;
  antialias: boolean;
  /** Teto de pixels por ponto de tela. */
  maxDpr: number;
}

export const QUALITY: Record<QualityTier, QualitySettings> = {
  baixo: {
    shadows: false,
    shadowMapSize: 512,
    effects: false,
    sparkles: false,
    antialias: false,
    maxDpr: 1,
  },
  medio: {
    shadows: true,
    shadowMapSize: 512,
    effects: false,
    sparkles: false,
    antialias: true,
    maxDpr: 1.25,
  },
  alto: {
    shadows: true,
    shadowMapSize: 1024,
    effects: true,
    sparkles: true,
    antialias: true,
    maxDpr: 1.75,
  },
};

/** Abaixo disto o jogo já parece travado e o nível cai. */
export const FPS_FLOOR = 40;
/** Acima disto sobra folga e o nível pode subir de volta. */
export const FPS_CEILING = 56;

const STORAGE_KEY = 'rodrigo:quality';

export function loadQuality(): QualityMode {
  if (typeof window === 'undefined') return 'auto';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'auto' || (QUALITY_TIERS as readonly string[]).includes(saved ?? '')) {
      return saved as QualityMode;
    }
  } catch {
    // Navegação anônima com armazenamento bloqueado: segue no automático.
  }
  return 'auto';
}

export function saveQuality(mode: QualityMode): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Não poder lembrar a escolha não é motivo para quebrar o jogo.
  }
}

export function lowerTier(tier: QualityTier): QualityTier {
  const index = QUALITY_TIERS.indexOf(tier);
  return QUALITY_TIERS[Math.max(0, index - 1)]!;
}

export function higherTier(tier: QualityTier): QualityTier {
  const index = QUALITY_TIERS.indexOf(tier);
  return QUALITY_TIERS[Math.min(QUALITY_TIERS.length - 1, index + 1)]!;
}
