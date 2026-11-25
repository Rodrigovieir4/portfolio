"use client"

import { Cursor } from "@portfolio/ui"
import { useEffect, useRef, useSyncExternalStore } from "react"

import { Fumaca } from "./fumaca"
import { Poeira } from "./poeira"

type Efeito = "anel" | "fumaca" | "holofote" | "nenhum" | "poeira"

const EFEITOS: Efeito[] = ["anel", "fumaca", "holofote", "nenhum", "poeira"]

// O endereço não muda com a página aberta: nada a assinar.
const semAssinatura = () => () => {}

// shortcut: efeito escolhido por ?mouse= enquanto o Rodrigo compara; quando
// ele decidir, fica só o escolhido e este seletor some.
function efeitoDaUrl(): Efeito {
  const pedido = new URLSearchParams(window.location.search).get("mouse")
  return EFEITOS.find((efeito) => efeito === pedido) ?? "fumaca"
}

/** Efeito do mouse na abertura, entre as opções em comparação. */
export function EfeitoMouse() {
  const efeito = useSyncExternalStore(
    semAssinatura,
    efeitoDaUrl,
    () => "fumaca" as const,
  )
  if (efeito === "fumaca") return <Fumaca />
  if (efeito === "poeira") return <Poeira />
  if (efeito === "holofote") return <Holofote />
  if (efeito === "anel") return <Cursor />
  return null
}

/**
 * Holofote: uma luz vinho grande e suave segue o cursor no fundo, atrás do
 * retrato, com um pequeno atraso, como uma lanterna no escuro.
 */
function Holofote() {
  const luz = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const elemento = luz.current
    if (!elemento) return
    if (!window.matchMedia("(pointer: fine)").matches) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const alvo = { x: 0, y: 0 }
    const atual = { x: 0, y: 0 }
    let quadro = 0
    const seguir = () => {
      // Aproxima 12% por quadro: chega macio, sem grudar no ponteiro.
      atual.x += (alvo.x - atual.x) * 0.12
      atual.y += (alvo.y - atual.y) * 0.12
      elemento.style.setProperty("--holofote-x", `${atual.x}px`)
      elemento.style.setProperty("--holofote-y", `${atual.y}px`)
      const perto = Math.hypot(alvo.x - atual.x, alvo.y - atual.y) < 0.5
      quadro = perto ? 0 : requestAnimationFrame(seguir)
    }
    const mover = (evento: PointerEvent) => {
      const caixa = elemento.getBoundingClientRect()
      alvo.x = evento.clientX - caixa.left
      alvo.y = evento.clientY - caixa.top
      if (!elemento.dataset.aceso) {
        // Primeira vez: nasce onde o mouse está, sem atravessar a tela.
        Object.assign(atual, alvo)
        elemento.dataset.aceso = ""
      }
      if (!quadro) quadro = requestAnimationFrame(seguir)
    }
    window.addEventListener("pointermove", mover, { passive: true })
    return () => {
      cancelAnimationFrame(quadro)
      window.removeEventListener("pointermove", mover)
    }
  }, [])

  return (
    <div
      ref={luz}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 holofote"
    />
  )
}
