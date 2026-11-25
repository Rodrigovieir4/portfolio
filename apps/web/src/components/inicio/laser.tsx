"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"

import { LaserFlow } from "@/components/reactbits/laser-flow"

/** Evento que libera o conteúdo da abertura (ver movimento.tsx). */
export const IMPACTO = "abertura:impacto"
/** Evento de quando a foto apareceu: é a deixa para o laser cair. */
export const FOTO = "abertura:foto"

function avisar() {
  // A marca serve a quem começar a ouvir depois do impacto.
  document.documentElement.dataset.impacto = ""
  window.dispatchEvent(new Event(IMPACTO))
}

function maquinaLeve() {
  const nav = navigator as Navigator & { deviceMemory?: number }
  return (nav.hardwareConcurrency || 8) <= 2 || (nav.deviceMemory ?? 8) <= 2
}

// A capacidade da máquina não muda com a página aberta: nada a assinar.
const semAssinatura = () => () => {}

function ouvirFoto(mudou: () => void) {
  window.addEventListener(FOTO, mudou)
  // Reserva: se a animação da foto não rodar, o laser cai assim mesmo.
  const reserva = setTimeout(() => {
    document.documentElement.dataset.foto = ""
    mudou()
  }, 2500)
  return () => {
    window.removeEventListener(FOTO, mudou)
    clearTimeout(reserva)
  }
}

const fotoPronta = () =>
  "foto" in document.documentElement.dataset ||
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Laser da abertura, no estilo "Twin Falls" do React Bits: depois que a
 * foto aparece, o feixe cai no centro, bem no topo da cabeça, e a luz se
 * divide e escorre pelos dois lados do retrato. O impacto revela o resto.
 *
 * A superfície é o próprio retrato: a imagem começa no topo da cabeça e tem
 * o topo arredondado, então a luz desce num arco em volta dele.
 *
 * Em máquina com até 2 núcleos ou 2 GB o laser não é montado (é um shader
 * de tela cheia) e o conteúdo aparece logo.
 */
export function Laser() {
  // No servidor o laser não existe; no cliente, só fora de máquina fraca.
  const ligado = useSyncExternalStore(
    semAssinatura,
    () => !maquinaLeve(),
    () => false,
  )
  const solto = useSyncExternalStore(ouvirFoto, fotoPronta, () => false)
  const retrato = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Voltando ao início sem recarregar, o impacto anterior não vale mais.
    delete document.documentElement.dataset.impacto
    retrato.current = document.querySelector('img[src*="retrato-abertura"]')
    if (maquinaLeve()) avisar()
  }, [])

  if (!ligado || !solto) return null

  return (
    <LaserFlow
      aria-hidden
      beamPosition={0.5}
      // Nasce logo abaixo da barra do topo, com a borda esfumada, para o
      // feixe não passar por trás dos links. Fica na frente do retrato para
      // a luz escorrer por cima dele.
      className="absolute inset-x-0 top-16 bottom-0 z-5 mask-t-from-85%"
      color="#e0425f"
      dpr={1}
      // Um pouco abaixo do padrão: com a superfície perto, a luz estourava
      // em branco em volta do retrato.
      flare={1.2}
      intensity={1.4}
      onImpact={avisar}
      surfaceRef={retrato}
    />
  )
}
