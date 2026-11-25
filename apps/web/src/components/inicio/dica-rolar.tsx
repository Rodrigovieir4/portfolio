"use client"

import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

import { IMPACTO } from "./laser"

const ESPERA = 5000
const ROLOU = 40

/**
 * Convite para rolar: 5 s depois da abertura, se a pessoa ainda está parada
 * no topo, aparece um botão centralizado embaixo do hero. Some ao rolar e
 * não volta mais naquela visita. Clicar desce para a seção seguinte. Só no
 * computador: no celular ficaria sobre o botão de contato, e ali rolar com o
 * dedo já é instintivo.
 */
export function DicaRolar({ texto }: { texto: string }) {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    let espera = 0
    let reserva = 0
    let agendada = false
    let encerrada = false
    const rolou = () => window.scrollY > ROLOU

    const esconder = () => {
      if (!rolou()) return
      encerrada = true
      window.clearTimeout(espera)
      setVisivel(false)
    }
    const agendar = () => {
      if (agendada) return
      agendada = true
      espera = window.setTimeout(() => {
        if (!encerrada && !rolou()) setVisivel(true)
      }, ESPERA)
    }

    // Conta a partir do impacto do laser; se ele já passou, conta de agora.
    // Sem laser (sem WebGL), a mesma reserva de 1,8 s da abertura.
    if ("impacto" in document.documentElement.dataset) agendar()
    else {
      window.addEventListener(IMPACTO, agendar, { once: true })
      reserva = window.setTimeout(agendar, 1800)
    }
    window.addEventListener("scroll", esconder, { passive: true })

    return () => {
      window.clearTimeout(espera)
      window.clearTimeout(reserva)
      window.removeEventListener(IMPACTO, agendar)
      window.removeEventListener("scroll", esconder)
    }
  }, [])

  return (
    <a
      href="#sobre"
      aria-hidden={!visivel}
      tabIndex={visivel ? 0 : -1}
      className={cn(
        "absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-foreground/15 bg-background/60 px-5 py-2.5 font-mono text-xs tracking-widest text-foreground uppercase backdrop-blur-md transition-all duration-700 md:flex",
        visivel
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      {texto}
      <ChevronDown
        aria-hidden
        className="size-4 animate-bounce text-vinho-claro"
      />
    </a>
  )
}
