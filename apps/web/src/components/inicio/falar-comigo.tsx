"use client"

import type { MouseEvent } from "react"

import { useLenis } from "@portfolio/ui"
import { Button } from "@portfolio/ui/components/button"

import { Link } from "@/i18n/navigation"

/** Altura do cabeçalho fixo: o contato para logo abaixo dele (h-16). */
const CABECALHO = 64

/**
 * Botão "Falar comigo" do cabeçalho: leva ao contato, no fim do início.
 * De outra página, navega sem recarregar. Já no início, rola até lá direto,
 * mesmo que o endereço já termine em #contato (aí o Link não faria nada).
 */
export function FalarComigo({ rotulo }: { rotulo: string }) {
  const lenis = useLenis()

  function aoClicar(evento: MouseEvent<HTMLAnchorElement>) {
    const contato = document.getElementById("contato")
    if (!contato) return
    evento.preventDefault()
    history.replaceState(history.state, "", "#contato")
    const instancia = lenis()
    if (instancia) instancia.scrollTo(contato, { offset: -CABECALHO })
    else contato.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <Button asChild variant="vinho" size="pilula">
      <Link href={{ hash: "contato", pathname: "/" }} onClick={aoClicar}>
        {rotulo}
      </Link>
    </Button>
  )
}
