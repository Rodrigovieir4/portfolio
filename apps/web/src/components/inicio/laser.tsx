"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import { LaserFlow } from "@/components/reactbits/laser-flow"
import { cn } from "@/lib/utils"

import { aguentaShader } from "./capacidade"

/** Evento que libera o conteúdo da abertura (ver movimento.tsx). */
export const IMPACTO = "abertura:impacto"

function avisar() {
  // A marca serve a quem começar a ouvir depois do impacto.
  document.documentElement.dataset.impacto = ""
  window.dispatchEvent(new Event(IMPACTO))
}

// A capacidade da máquina não muda na sessão: nada a assinar.
const semAssinatura = () => () => {}

/** No computador, com movimento, o feixe segue até o sobre (a cena fixa). */
const continuaNoSobre = () =>
  matchMedia("(min-width: 1024px)").matches &&
  matchMedia("(prefers-reduced-motion: no-preference)").matches

/**
 * Feixe de laser da abertura: desce do topo, bate no fim do hero e espalha.
 * O impacto dispara o evento que revela o conteúdo.
 *
 * No computador (pedido do Rodrigo, 26/11) o feixe não para no hero: é o
 * mesmo laser que continua descendo pela página e pousa no bloco "Sobre /
 * Mim" do sobre, onde a luz escorre pelos dois lados como cachoeira (o modo
 * "Twin Falls" do LaserFlow). A tela de laser cobre o hero e a cena do sobre
 * (`altura-laser`) e apaga quando a cena do sobre começa a rolar
 * (`--sobre-laser`, sobre-cena.ts). No celular, para na base da foto.
 *
 * Em máquina com até 2 núcleos ou 2 GB, ou sem placa de vídeo (WebGL desenhado
 * no processador), o laser não é montado (é um shader de tela cheia) e o
 * conteúdo aparece logo.
 */
export function Laser() {
  // No servidor o laser não existe; no cliente, só onde o shader roda bem.
  const ligado = useSyncExternalStore(semAssinatura, aguentaShader, () => false)
  const continua = useSyncExternalStore(
    semAssinatura,
    continuaNoSobre,
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
    chao.current = document.querySelector(
      continua ? "[data-sobre-palavras]" : "[data-chao]",
    )
    if (!aguentaShader()) avisar()
  }, [continua])

  if (!ligado) return null

  return (
    <LaserFlow
      aria-hidden
      beamPosition={0.5}
      // Desce desde o topo da página: o cabeçalho só aparece depois do
      // impacto, então o feixe não compete com os links na queda.
      className={cn(
        "absolute inset-x-0 top-0 -z-10",
        continua ? "altura-laser!" : "bottom-0",
      )}
      data-sobre-laser
      color="#e0425f"
      dpr={1}
      intro={cair}
      onImpact={avisar}
      // Pousa na base da foto ou, no computador, nas palavras do sobre.
      surfaceRef={chao}
    />
  )
}
