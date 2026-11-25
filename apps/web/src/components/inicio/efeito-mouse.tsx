"use client"

import { useSyncExternalStore } from "react"

import { GhostCursor } from "@/components/reactbits/ghost-cursor"

// A máquina e o tipo de ponteiro não mudam com a página aberta.
const semAssinatura = () => () => {}

/** Só com mouse e fora de máquina fraca: é um shader, junto com o do laser. */
function podeLigar() {
  const nav = navigator as Navigator & { deviceMemory?: number }
  const leve =
    (nav.hardwareConcurrency || 8) <= 2 || (nav.deviceMemory ?? 8) <= 2
  return !leve && window.matchMedia("(pointer: fine)").matches
}

/**
 * Efeito do mouse na abertura (escolhido em 25/11/2026): o Ghost Cursor do
 * React Bits, uma névoa vinho que segue o cursor, atrás do retrato.
 *
 * Ajustes de desempenho, porque divide a placa de vídeo com o laser:
 * - desenha em metade da resolução (a névoa é borrada; o navegador amplia);
 * - menos pixels na etapa de sombreamento e sem granulado;
 * - não monta em tela de toque nem em máquina fraca.
 *
 * Ajustes de visual: soma luz por cima do laser (blend "screen"), bordas
 * com fiapos, e segue o cursor de perto, sem abertura própria nem deriva.
 */
export function EfeitoMouse() {
  const ligado = useSyncExternalStore(semAssinatura, podeLigar, () => false)
  if (!ligado) return null

  return (
    <GhostCursor
      bloomStrength={0.45}
      brightness={0.85}
      className="-z-5"
      color="#e0425f"
      drift={0}
      edgeIntensity={0.35}
      grainIntensity={0}
      inertia={0.12}
      intro={false}
      maxDevicePixelRatio={0.5}
      mixBlendMode="screen"
      size={60}
      targetPixels={200_000}
      trailLength={38}
      turbulence={0.3}
      zIndex={-5}
    />
  )
}
