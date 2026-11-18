/**
 * Entrada leve: só a detecção de capacidade do aparelho.
 *
 * Quem precisa decidir se monta uma cena 3D importa daqui, sem arrastar
 * three e postprocessing para o bundle antes da hora.
 */
export {
  type DeviceProfile,
  type DeviceTier,
  useDeviceTier,
  usePrefersReducedMotion,
} from "./hooks/use-device-tier"
