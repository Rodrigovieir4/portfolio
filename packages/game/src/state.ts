/**
 * Entrada leve do pacote: estado, registro de objetos e leitura por quadro.
 *
 * O HUD, os painéis e o joystick importam daqui. Nada neste caminho toca em
 * three ou Rapier, então o HTML do jogo aparece sem esperar os megabytes do
 * motor, que chegam depois pelo import dinâmico de "@portfolio/game".
 */
export { useGameStore, type PanelId } from './store';
export { HOTSPOTS, HOTSPOT_IDS, type HotspotId } from './hotspots';
export { runtime } from './runtime';
