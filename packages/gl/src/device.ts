/**
 * Entrada leve: só a detecção de capacidade do aparelho.
 *
 * Quem precisa decidir se monta uma cena 3D importa daqui, sem arrastar
 * three e postprocessing para o bundle antes da hora.
 */
export {
  useDeviceTier,
  usePrefersReducedMotion,
  type DeviceProfile,
  type DeviceTier,
} from './hooks/use-device-tier';
