"use client"

import { type RefObject, useEffect, useRef, useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

/**
 * Opções para o "Vamos", para o Rodrigo escolher (27/11: as duas palavras
 * animadas, parecidas mas não iguais). Troca pelo endereço: `?titulo=`
 * refletor (a padrão), troca, holofote, neon ou reflexo. Escolhida uma, as
 * outras saem (daqui e do globals.css).
 */
const VAMOS = {
  holofote: { base: "text-foreground/15", luz: "vamos-holofote" },
  neon: { base: "vamos-neon", luz: "" },
  reflexo: { base: "", luz: "vamos-reflexo" },
  refletor: { base: "text-foreground/75", luz: "vamos-refletor" },
  troca: { base: "texto-contorno-claro", luz: "vamos-troca" },
} as const
type Versao = keyof typeof VAMOS

const semAviso = () => () => {}
function versaoDoEndereco(): Versao {
  const pedida = new URLSearchParams(location.search).get("titulo")
  return pedida && pedida in VAMOS ? (pedida as Versao) : "refletor"
}

/**
 * Acende as luzes quando o título aparece e, com mouse, faz todas seguirem o
 * cursor: cada camada recebe a posição dele relativa à própria caixa.
 */
function useLuz(titulo: RefObject<HTMLHeadingElement | null>) {
  useEffect(() => {
    const alvo = titulo.current
    if (!alvo) return
    const olho = new IntersectionObserver(
      ([entrada]) => {
        if (entrada?.isIntersecting) alvo.setAttribute("data-aceso", "")
      },
      { threshold: 0.4 },
    )
    olho.observe(alvo)
    if (!matchMedia("(pointer: fine)").matches) return () => olho.disconnect()
    const camadas = () => [
      ...alvo.querySelectorAll<HTMLElement>("[data-camada]"),
    ]
    const area = alvo.closest("section") ?? alvo
    const mover = (evento: PointerEvent) => {
      alvo.setAttribute("data-mirando", "")
      for (const camada of camadas()) {
        const caixa = camada.getBoundingClientRect()
        const x = ((evento.clientX - caixa.left) / caixa.width) * 100
        const y = ((evento.clientY - caixa.top) / caixa.height) * 100
        camada.style.setProperty("--conversa-x", `${x}%`)
        camada.style.setProperty("--conversa-y", `${y}%`)
      }
    }
    const sair = () => {
      alvo.removeAttribute("data-mirando")
      for (const camada of camadas()) {
        camada.style.removeProperty("--conversa-x")
        camada.style.removeProperty("--conversa-y")
      }
    }
    area.addEventListener("pointermove", mover)
    area.addEventListener("pointerleave", sair)
    return () => {
      olho.disconnect()
      area.removeEventListener("pointermove", mover)
      area.removeEventListener("pointerleave", sair)
    }
  }, [titulo])
}

/** Uma palavra: a base e, por cima, a camada de luz (se houver). */
function Palavra({
  base,
  luz,
  texto,
}: {
  base: string
  luz: string
  texto: string
}) {
  return (
    <span className="relative block">
      <span className={base}>{texto}</span>
      {luz ? (
        <span
          data-camada
          aria-hidden
          className={cn("pointer-events-none absolute inset-0", luz)}
        >
          {texto}
        </span>
      ) : null}
    </span>
  )
}

/**
 * "Vamos conversar." com luz de cinema (pedido do Rodrigo, 27/11):
 * "conversar." vazado, com uma luz acesa por dentro que vaza num brilho
 * vinho, e o "Vamos" reagindo à mesma luz do jeito da versão escolhida. As
 * luzes acendem piscando ao aparecer, varrem as palavras devagar e, com o
 * mouse sobre a seção, seguem o cursor.
 */
export function TituloLuz({
  className,
  titulo,
}: {
  className?: string
  titulo: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const versao = useSyncExternalStore(
    semAviso,
    versaoDoEndereco,
    () => "refletor" as const,
  )
  const [primeira = "", ...resto] = titulo.split(" ")
  const segunda = resto.join(" ")

  useLuz(ref)

  return (
    <h2 ref={ref} data-mov="subir" aria-label={titulo} className={className}>
      <Palavra texto={primeira} {...VAMOS[versao]} />
      {segunda ? (
        <Palavra
          texto={segunda}
          base="texto-contorno-claro"
          luz="luz-conversa"
        />
      ) : null}
    </h2>
  )
}
