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
const ROSA = "#ff8fa3"
const ROSA_CLARO = "#f6c1cb"

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
        // Mais contido e leve que o padrão: menor, mais curto, menos brilho e
        // menos pixels por quadro (o laser já é outro shader na mesma tela).
        // Para grudar no cursor: sem a abertura própria (andava sozinho ao
        // carregar), sem deriva (a fumaça subia e saía de cima do cursor) e
        // com inércia quase zero (a mola fica firme e não balança).
        bloomStrength={0.35}
        brightness={0.75}
        className="-z-5"
        color={VINHO}
        drift={0}
        inertia={0.05}
        intro={false}
        maxDevicePixelRatio={1}
        size={55}
        targetPixels={350_000}
        trailLength={34}
        turbulence={0.25}
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
      // Mais rico que o padrão: quatro tons de vinho e rosa alternando,
      // brilho, relevo e redemoinhos mais fortes, e o rastro dura mais.
      colors={[VINHO, ROSA, VINHO_ESCURO, ROSA_CLARO]}
      colorSpeed={0.6}
      contained
      glow={0.7}
      intensity={1.3}
      quality="high"
      rainbow={false}
      shading={1.4}
      size={1.2}
      swirl={6}
      trail={1.4}
      zIndex={-5}
    />
  )
}
