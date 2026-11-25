"use client"

import { useEffect, useSyncExternalStore } from "react"

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

  useEffect(() => {
    if (maquinaLeve()) avisar()
  }, [])

  if (!ligado) return null

  return (
    <LaserFlow
      aria-hidden
      className="absolute inset-0 -z-10"
      color="#e0425f"
      dpr={1}
      onImpact={avisar}
    />
  )
}
