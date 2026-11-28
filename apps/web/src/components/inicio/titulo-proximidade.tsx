"use client"

import { type RefObject, useEffect, useRef } from "react"

/** Até onde o mouse engrossa as letras, em pixels. */
const RAIO = 260

/** O mouse sobre a seção engrossa as letras perto dele. */
function useProximidade(ref: RefObject<HTMLHeadingElement | null>) {
  useEffect(() => {
    const titulo = ref.current
    if (!titulo) return
    if (!matchMedia("(pointer: fine)").matches) return
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const letras = [...titulo.querySelectorAll<HTMLElement>("[data-letra]")]
    const area = titulo.closest("section") ?? titulo
    let quadro = 0
    const mover = (evento: PointerEvent) => {
      cancelAnimationFrame(quadro)
      quadro = requestAnimationFrame(() => {
        for (const letra of letras) {
          const caixa = letra.getBoundingClientRect()
          const distancia = Math.hypot(
            evento.clientX - (caixa.left + caixa.width / 2),
            evento.clientY - (caixa.top + caixa.height / 2),
          )
          const perto = Math.max(0, 1 - distancia / RAIO)
          letra.style.fontVariationSettings = `"wght" ${Math.round(300 + perto * 600)}`
        }
      })
    }
    const sair = () => {
      cancelAnimationFrame(quadro)
      for (const letra of letras) letra.style.fontVariationSettings = ""
    }
    area.addEventListener("pointermove", mover)
    area.addEventListener("pointerleave", sair)
    return () => {
      cancelAnimationFrame(quadro)
      area.removeEventListener("pointermove", mover)
      area.removeEventListener("pointerleave", sair)
    }
  }, [ref])
}

/**
 * "Vamos conversar." com o efeito Variable Proximity do React Bits (pedido do
 * Rodrigo, 27/11): com o mouse sobre a seção, as letras perto dele engrossam
 * (a Geist é variável) e as longe afinam, numa onda que segue o cursor; ao
 * sair, voltam ao peso normal. Só com mouse e sem pedido de menos movimento.
 * A segunda linha vem em contorno. A subida letra por letra continua no
 * secoes.ts (data-mov), que divide o texto dentro destas letras.
 */
export function TituloProximidade({
  className,
  titulo,
}: {
  className?: string
  titulo: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [primeira = "", ...resto] = titulo.split(" ")

  useProximidade(ref)

  const letras = (palavra: string) =>
    [...palavra].map((letra, i) => (
      <span key={i} data-letra>
        {letra}
      </span>
    ))

  return (
    <h2
      ref={ref}
      data-mov="contato-titulo"
      aria-label={titulo}
      className={className}
    >
      <span aria-hidden className="block">
        {letras(primeira)}
      </span>
      {resto.length > 0 ? (
        <span aria-hidden className="block texto-contorno-claro">
          {letras(resto.join(" "))}
        </span>
      ) : null}
    </h2>
  )
}
