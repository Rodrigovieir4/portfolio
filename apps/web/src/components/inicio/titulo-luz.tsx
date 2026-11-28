"use client"

import { type RefObject, useEffect, useRef } from "react"

/**
 * Acende a luz quando o título aparece e, com mouse, faz ela seguir o
 * cursor por dentro das letras (as coordenadas vão para a camada da luz).
 */
function useLuz(
  titulo: RefObject<HTMLHeadingElement | null>,
  luz: RefObject<HTMLSpanElement | null>,
) {
  useEffect(() => {
    const alvo = titulo.current
    const camada = luz.current
    if (!alvo || !camada) return
    const olho = new IntersectionObserver(
      ([entrada]) => {
        if (entrada?.isIntersecting) alvo.setAttribute("data-aceso", "")
      },
      { threshold: 0.4 },
    )
    olho.observe(alvo)
    if (!matchMedia("(pointer: fine)").matches) return () => olho.disconnect()
    const area = alvo.closest("section") ?? alvo
    const mover = (evento: PointerEvent) => {
      const caixa = camada.getBoundingClientRect()
      const x = ((evento.clientX - caixa.left) / caixa.width) * 100
      const y = ((evento.clientY - caixa.top) / caixa.height) * 100
      alvo.setAttribute("data-mirando", "")
      camada.style.setProperty("--conversa-x", `${x}%`)
      camada.style.setProperty("--conversa-y", `${y}%`)
    }
    const sair = () => {
      alvo.removeAttribute("data-mirando")
      camada.style.removeProperty("--conversa-x")
      camada.style.removeProperty("--conversa-y")
    }
    area.addEventListener("pointermove", mover)
    area.addEventListener("pointerleave", sair)
    return () => {
      olho.disconnect()
      area.removeEventListener("pointermove", mover)
      area.removeEventListener("pointerleave", sair)
    }
  }, [titulo, luz])
}

/**
 * "Vamos conversar." com luz de cinema (pedido do Rodrigo, 27/11): "Vamos"
 * cheio e "conversar." vazado, com uma luz acesa por dentro que vaza num
 * brilho vinho. Acende piscando ao aparecer, varre a palavra devagar e, com
 * o mouse sobre a seção, segue o cursor (utilitário luz-conversa).
 */
export function TituloLuz({
  className,
  titulo,
}: {
  className?: string
  titulo: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const luz = useRef<HTMLSpanElement>(null)
  const [primeira = "", ...resto] = titulo.split(" ")
  const segunda = resto.join(" ")

  useLuz(ref, luz)

  return (
    <h2 ref={ref} data-mov="subir" className={className}>
      <span className="block">{primeira}</span>
      {segunda ? (
        <span className="relative block">
          <span className="texto-contorno-claro">{segunda}</span>
          <span
            ref={luz}
            aria-hidden
            className="pointer-events-none absolute inset-0 luz-conversa"
          >
            {segunda}
          </span>
        </span>
      ) : null}
    </h2>
  )
}
