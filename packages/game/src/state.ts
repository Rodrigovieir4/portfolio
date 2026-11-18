/**
 * Entrada leve do pacote: estado, registros e leitura por quadro.
 *
 * O HUD, os painéis e o joystick importam daqui. Nada neste caminho toca no
 * three, então o HTML do jogo aparece sem esperar os megabytes do motor, que
 * chegam depois pelo import dinâmico de "@portfolio/game".
 */
export { activeTier, type PanelId, type Toast, useGameStore } from "./store"
export {
  loadQuality,
  QUALITY,
  QUALITY_TIERS,
  type QualityMode,
  type QualityTier,
} from "./quality"
export {
  HOTSPOT_IDS,
  type HotspotId,
  HOTSPOTS,
  type InteractableId,
  LAMP,
} from "./hotspots"
export { COMMIT_IDS, COMMITS } from "./collectibles"
export { type AchievementId, ACHIEVEMENTS, SPEEDRUN_MS } from "./achievements"
export { perf, runtime } from "./runtime"
