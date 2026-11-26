"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import { LaserFlow } from "@/components/reactbits/laser-flow"

/** Evento que libera o conteúdo da abertura (ver movimento.tsx). */
export const IMPACTO = "abertura:impacto"

function avisar() {
  // A marca serve a quem começar a ouvir depois do impacto.
  document.documentElement.dataset.impacto = ""
  window.dispatchEvent(new Event(IMPACTO))
}

function maquinaLeve() {
  const nav = navigator as Navigator & { deviceMemory?: number }
  return (nav.hardwareConcurrency || 8) <= 2 || (nav.deviceMemory ?? 8) <= 2
}

// A capacidade da máquina não muda na sessão: nada a assinar.
const semAssinatura = () => () => {}

/**
 * Feixe de laser da abertura: desce do topo, bate no fim do hero e espalha.
 * O impacto dispara o evento que revela o conteúdo.
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
  const chao = useRef<HTMLElement | null>(null)
  // A queda roda uma vez por carregamento. Voltando ao início sem recarregar
  // (a marca vale até recarregar), o feixe já nasce pousado.
  const [cair] = useState(
    () =>
      typeof document === "undefined" ||
      !("impacto" in document.documentElement.dataset),
  )

  useEffect(() => {
    chao.current = document.querySelector("[data-chao]")
    if (maquinaLeve()) avisar()
  }, [])

  if (!ligado) return null

  return (
    <LaserFlow
      aria-hidden
      beamPosition={0.5}
      // Desce desde o topo da página: o cabeçalho só aparece depois do
      // impacto, então o feixe não compete com os links na queda.
      className="absolute inset-0 -z-10"
      color="#e0425f"
      dpr={1}
      intro={cair}
      onImpact={avisar}
      // Pousa na base da foto: o feixe nunca aparece abaixo dela.
      surfaceRef={chao}
    />
  )
}
