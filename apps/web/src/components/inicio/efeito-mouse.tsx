"use client"

import { useSyncExternalStore } from "react"

import { GhostCursor } from "@/components/reactbits/ghost-cursor"
import { GlowCursor } from "@/components/reactbits/glow-cursor"
import { SplashCursor } from "@/components/reactbits/splash-cursor"

import { Fumaca } from "./fumaca"

type Efeito = "fumaca" | "ghost" | "glow" | "splash"

const EFEITOS: Efeito[] = ["fumaca", "ghost", "glow", "splash"]

const VINHO = "#e0425f"
const VINHO_ESCURO = "#8c1730"

// O endereço e a máquina não mudam com a página aberta: nada a assinar.
const semAssinatura = () => () => {}

// shortcut: efeito escolhido por ?mouse= enquanto o Rodrigo compara; quando
// ele decidir, fica só o escolhido e este seletor some.
function efeitoDaUrl(): Efeito {
  const pedido = new URLSearchParams(window.location.search).get("mouse")
  return EFEITOS.find((efeito) => efeito === pedido) ?? "fumaca"
}

function maquinaLeve() {
  const nav = navigator as Navigator & { deviceMemory?: number }
  return (nav.hardwareConcurrency || 8) <= 2 || (nav.deviceMemory ?? 8) <= 2
}

/**
 * Efeito do mouse na abertura, entre as opções em comparação. Os do React
 * Bits ficam atrás do retrato (camada -5, acima do laser) e na cor vinho;
 * em máquina fraca nenhum é montado, porque todos são shader de tela cheia.
 */
export function EfeitoMouse() {
  const efeito = useSyncExternalStore(
    semAssinatura,
    efeitoDaUrl,
    () => "fumaca" as const,
  )
  const leve = useSyncExternalStore(semAssinatura, maquinaLeve, () => true)
  if (efeito === "fumaca") return <Fumaca />
  if (leve) return null
  if (efeito === "ghost") {
    return (
      <GhostCursor
        className="-z-5"
        color={VINHO}
        maxDevicePixelRatio={1}
        zIndex={-5}
      />
    )
  }
  if (efeito === "glow") {
    return (
      <div className="pointer-events-none absolute inset-0 -z-5">
        <GlowCursor
          color={VINHO}
          maxDevicePixelRatio={1}
          secondaryColor={VINHO_ESCURO}
        />
      </div>
    )
  }
  return (
    <SplashCursor
      colors={[VINHO, VINHO_ESCURO]}
      contained
      quality="medium"
      rainbow={false}
      zIndex={-5}
    />
  )
}
