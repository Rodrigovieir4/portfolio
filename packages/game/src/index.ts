/**
 * Entrada pesada do pacote: o canvas com three.
 *
 * O app importa isto sempre por import dinâmico com SSR desligado, porque o
 * three toca em window. Estado e registro de objetos ficam em
 * "@portfolio/game/state", que não puxa o motor junto.
 */
export { GameCanvas, type GameCanvasProps } from './scene/game-canvas';
