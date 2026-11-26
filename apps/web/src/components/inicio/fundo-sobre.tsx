"use client"

import { useSyncExternalStore } from "react"

import DotGrid from "@/components/reactbits/dot-grid"
import FaultyTerminal from "@/components/reactbits/faulty-terminal"
import Threads from "@/components/reactbits/threads"

import { aguentaShader } from "./capacidade"

const FUNDOS = ["feixe", "minimo", "pontos", "terminal", "fios"] as const
type Fundo = (typeof FUNDOS)[number]

// O endereço e a máquina não mudam com a página aberta.
const semAssinatura = () => () => {}

// shortcut: prévia escolhida por ?fundo=minimo|pontos|terminal|fios (sem
// nada, o feixe de sempre); sai quando o Rodrigo escolher um fundo.
function lerFundo(): Fundo {
  const valor = new URLSearchParams(window.location.search).get("fundo")
  return FUNDOS.find((fundo) => fundo === valor) ?? "feixe"
}

/** Os três do React Bits, no grafite e no vinho do site. */
function Shader({ fundo }: { fundo: Fundo }) {
  if (fundo === "pontos") {
    return (
      <DotGrid
        activeColor="#e0425f"
        baseColor="#3a3237"
        clickShock={false}
        dotSize={4}
        gap={26}
      />
    )
  }
  if (fundo === "terminal") {
    return (
      <FaultyTerminal
        brightness={0.45}
        clickEffect="none"
        dpr={1}
        glyphs="characters"
        scale={1.6}
        tint="#e0425f"
        vignette={0.9}
      />
    )
  }
  return (
    <Threads
      accentColor="#e0425f"
      color="#8c1730"
      enableMouseInteraction
      opacity={0.7}
    />
  )
}

/**
 * Fundo do painel do sobre. Hoje é o feixe vinho; as outras opções são uma
 * prévia para o Rodrigo comparar (pedido de 26/11): uma minimalista, só uma
 * grade de pontos discreta, e três componentes do React Bits (Dot Grid,
 * Faulty Terminal e Threads). Os três são WebGL: sem placa de vídeo, ficam
 * com a grade de pontos.
 */
export function FundoSobre() {
  const fundo = useSyncExternalStore<Fundo>(
    semAssinatura,
    lerFundo,
    () => "feixe",
  )
  const placa = useSyncExternalStore(semAssinatura, aguentaShader, () => false)

  if (fundo === "feixe") return <div aria-hidden className="feixe-sobre" />
  if (fundo === "minimo" || !placa) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 fundo-pontos"
      />
    )
  }
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Shader fundo={fundo} />
    </div>
  )
}
