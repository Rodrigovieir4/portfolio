"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

import { IMPACTO } from "./laser"
import { areaDeRolagem } from "./rolagem"

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
    const area = areaDeRolagem()
    const rolou = () => (area ? area.scrollTop : window.scrollY) > ROLOU

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
    const alvo = area ?? window
    alvo.addEventListener("scroll", esconder, { passive: true })

    return () => {
      window.clearTimeout(espera)
      window.clearTimeout(reserva)
      window.removeEventListener(IMPACTO, agendar)
      alvo.removeEventListener("scroll", esconder)
    }
  }, [])

  return (
    <a
      href="#sobre"
      aria-hidden={!visivel}
      tabIndex={visivel ? 0 : -1}
      className={cn(
        "group absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 font-mono text-xs tracking-widest text-foreground/75 uppercase transition-all duration-1000 ease-out hover:text-foreground md:flex",
        visivel
          ? "translate-y-0 opacity-100 blur-none"
          : "pointer-events-none translate-y-6 opacity-0 blur-sm",
      )}
    >
      <span className="text-center leading-relaxed whitespace-pre-line">
        {texto}
      </span>
      <LinhaRolar />
    </a>
  )
}

/** Linha fina com uma luz vinho descendo, como uma gota, sem parar. */
function LinhaRolar() {
  return (
    <span
      aria-hidden
      className="relative h-20 w-px overflow-hidden bg-foreground/15"
    >
      <span className="absolute inset-x-0 top-0 h-1/2 linha-rolar bg-linear-to-b from-transparent via-vinho-claro to-transparent" />
    </span>
  )
}
