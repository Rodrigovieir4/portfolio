/**
 * Entrada leve do pacote: estado, registros e leitura por quadro.
 *
 * O HUD, os painéis e o joystick importam daqui. Nada neste caminho toca em
 * three ou Rapier, então o HTML do jogo aparece sem esperar os megabytes do
 * motor, que chegam depois pelo import dinâmico de "@portfolio/game".
 */
export { useGameStore, type PanelId, type Toast } from './store';
export { HOTSPOTS, HOTSPOT_IDS, LAMP, type HotspotId, type InteractableId } from './hotspots';
export { COMMITS, COMMIT_IDS } from './collectibles';
export { ACHIEVEMENTS, SPEEDRUN_MS, type AchievementId } from './achievements';
export { runtime } from './runtime';
