/**
 * Entrada pesada do pacote: o canvas com three e Rapier.
 *
 * O app importa isto sempre por import dinâmico com SSR desligado, porque three
 * e Rapier tocam em window e o Rapier ainda carrega um módulo WebAssembly.
 * Estado e registro de objetos ficam em "@portfolio/game/state".
 */
export { GameCanvas, type GameCanvasProps } from './scene/game-canvas';
