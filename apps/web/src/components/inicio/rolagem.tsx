"use client"

import type { ReactNode } from "react"

import { useEffect } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { usePathname } from "@/i18n/navigation"

/** Seletor da área que rola o site (o viewport do ScrollArea). */
export const ROLAGEM = '[data-rolagem] [data-slot="scroll-area-viewport"]'

/** A área que rola o site; fora dele (o jogo), a janela. */
export function areaDeRolagem(): HTMLElement | null {
  return document.querySelector<HTMLElement>(ROLAGEM)
}

/**
 * O site rola dentro do ScrollArea do shadcn, com a barra no visual do
 * portfólio. Lenis e GSAP apontam para esta área (ROLAGEM), e não para a
 * janela. Trocando de página, ela volta ao topo, como a janela faria.
 */
export function Rolagem({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (window.location.hash) return
    areaDeRolagem()?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <ScrollArea data-rolagem className="h-dvh">
      {children}
    </ScrollArea>
  )
}
