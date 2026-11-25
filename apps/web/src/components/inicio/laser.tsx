"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"

import { LaserFlow } from "@/components/reactbits/laser-flow"
import { cn } from "@/lib/utils"

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

// A capacidade da máquina e o endereço não mudam com a página aberta.
const semAssinatura = () => () => {}

// shortcut: prévia do preset "Twin Falls" do React Bits, ligada por
// ?laser=twin; vira padrão (ou some) quando o Rodrigo decidir.
const previaTwin = () =>
  new URLSearchParams(window.location.search).get("laser") === "twin"

/**
 * Feixe de laser da abertura: desce do topo, bate no fim do hero e espalha.
 * O impacto dispara o evento que revela o conteúdo.
 *
 * Na prévia "Twin Falls", o feixe cai sobre o retrato e a luz escorre pelos
 * dois lados dele, por cima da foto.
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
  const twin = useSyncExternalStore(semAssinatura, previaTwin, () => false)
  const retrato = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Voltando ao início sem recarregar, o impacto anterior não vale mais.
    delete document.documentElement.dataset.impacto
    retrato.current = document.querySelector('img[src*="retrato-recorte"]')
    if (maquinaLeve()) avisar()
  }, [])

  if (!ligado) return null

  return (
    <LaserFlow
      aria-hidden
      beamPosition={0.5}
      // Nasce logo abaixo da barra do topo, com a borda esfumada, para o
      // feixe não passar por trás dos links.
      className={cn(
        "absolute inset-x-0 top-16 bottom-0 mask-t-from-85%",
        twin ? "z-5" : "-z-10",
      )}
      color="#e0425f"
      dpr={1}
      onImpact={avisar}
      surfaceRef={twin ? retrato : undefined}
    />
  )
}
