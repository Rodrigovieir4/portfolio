"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import { LaserFlow } from "@/components/reactbits/laser-flow"

import { aguentaShader } from "./capacidade"

// A máquina, o tamanho de computador e o pedido de menos movimento não mudam
// no meio da cena.
const semAssinatura = () => () => {}
const podeLigar = () =>
  aguentaShader() &&
  matchMedia("(min-width: 1024px)").matches &&
  matchMedia("(prefers-reduced-motion: no-preference)").matches

/**
 * O laser do sobre (pedido do Rodrigo, 26/11): o mesmo LaserFlow da abertura.
 * Quando a cena chega na tela, o feixe cai do alto e bate na linha entre
 * "Sobre" e "Mim", e o painel depois abre a partir dela (sobre-cena.ts).
 *
 * Só no computador, com placa de vídeo e com movimento; monta quando a cena
 * está quase toda na tela, para a queda acontecer à vista. Em volta, o
 * LaserFlow já pausa sozinho quando sai da tela.
 */
export function LaserSobre() {
  const ligado = useSyncExternalStore(semAssinatura, podeLigar, () => false)
  const [caiu, setCaiu] = useState(false)
  const area = useRef<HTMLDivElement>(null)
  const chao = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const alvo = area.current
    if (!ligado || !alvo) return
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada?.isIntersecting) return
        setCaiu(true)
        observador.disconnect()
      },
      { threshold: 0.6 },
    )
    observador.observe(alvo)
    return () => observador.disconnect()
  }, [ligado])

  if (!ligado) return null

  return (
    <div
      ref={area}
      aria-hidden
      className="pointer-events-none absolute inset-0"
    >
      {/* Onde o feixe pousa: a altura da linha de laser da cena. */}
      <div ref={chao} className="absolute inset-x-0 top-1/2" />
      {caiu ? (
        <LaserFlow
          aria-hidden
          beamPosition={0.5}
          className="absolute inset-0"
          color="#e0425f"
          dpr={1}
          surfaceRef={chao}
        />
      ) : null}
    </div>
  )
}
