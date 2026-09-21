/**
 * Conquistas.
 *
 * Os ids são estáveis e os textos moram no app, traduzidos. A ordem aqui é a
 * ordem em que aparecem no placar e no painel final.
 */
export const ACHIEVEMENTS = [
  'explorador',
  'colecionador',
  'primeiro-gol',
  'hat-trick',
  'boa-noite',
  'speedrun',
  'platina',
] as const;

export type AchievementId = (typeof ACHIEVEMENTS)[number];

/** Tour completo abaixo disto vale a conquista de speedrun. */
export const SPEEDRUN_MS = 90_000;
