"use client"

import type { MouseEvent } from "react"

import { useLenis } from "@portfolio/ui"

import { Link, usePathname } from "@/i18n/navigation"

import { areaDeRolagem } from "./rolagem"

/**
 * Marca do cabeçalho como um prompt de terminal: a seta em vinho, o nome
 * como comando e um cursor em barra fina. O movimento.tsx digita o nome ao
 * aparecer; o cursor pisca devagar uns segundos e depois fica parado.
 * Leva ao início; já no início, sobe até o topo.
 */
export function Marca() {
  const pathname = usePathname()
  const lenis = useLenis()

  // Já no início, o link não navega: sobe suavemente até o topo.
  function aoClicar(evento: MouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/") return
    evento.preventDefault()
    const instancia = lenis()
    if (instancia) instancia.scrollTo(0)
    else (areaDeRolagem() ?? window).scrollTo({ behavior: "smooth", top: 0 })
  }

  return (
    <Link
      href="/"
      aria-label="Rodrigo Vieira"
      onClick={aoClicar}
      className="flex w-fit items-center gap-2 font-mono text-base font-semibold text-foreground transition-opacity hover:opacity-80 md:text-lg"
    >
      <span aria-hidden className="text-vinho-claro">
        ❯
      </span>
      <span aria-hidden>
        <span data-prompt data-final="rodrigo-vieira">
          rodrigo-vieira
        </span>
        <span
          data-cursor
          className="ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-[0.2em] bg-vinho-claro"
        />
      </span>
    </Link>
  )
}
