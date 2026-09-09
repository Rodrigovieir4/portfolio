/**
 * Superficie publica do pacote WebGL.
 *
 * O app importa apenas daqui e sempre por dynamic import com ssr desligado,
 * porque three.js toca em window na hora de criar o contexto e quebraria a
 * renderizacao no servidor.
 */

export { HeroCanvas, type HeroCanvasProps } from './components/hero-canvas';
export { ParticleField, type ParticleFieldProps } from './scenes/particle-field';
export {
  useDeviceTier,
  usePrefersReducedMotion,
  type DeviceProfile,
  type DeviceTier,
} from './hooks/use-device-tier';
export { buildShape, SHAPES, type ShapeName } from './shapes';
