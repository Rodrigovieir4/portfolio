"use client"

import type { MouseEvent } from "react"

import { useLenis } from "@portfolio/ui"
import { Button } from "@portfolio/ui/components/button"
import { Download } from "lucide-react"

import { Link } from "@/i18n/navigation"

/** Altura do cabeçalho fixo: o contato para logo abaixo dele (h-16). */
const CABECALHO = 64

/**
 * Botão "Falar comigo" do cabeçalho: leva ao contato, no fim do início.
 * De outra página, navega sem recarregar. Já no início, rola até lá direto,
 * mesmo que o endereço já termine em #contato (aí o Link não faria nada).
 * No hover (ou no foco do teclado), um botão "CV" desliza para fora ao lado
 * dele e baixa o currículo (pedido do Rodrigo, 27/11).
 */
export function FalarComigo({
  cv,
  rotulo,
}: {
  cv: { href: string; rotulo: string }
  rotulo: string
}) {
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
    <div className="group/falar flex items-center">
      <a
        href={cv.href}
        download
        aria-label={cv.rotulo}
        className="flex h-8 max-w-0 items-center gap-1.5 overflow-hidden rounded-full border-0 border-foreground/30 text-sm whitespace-nowrap opacity-0 transition-all duration-300 group-focus-within/falar:mr-2 group-focus-within/falar:max-w-24 group-focus-within/falar:border group-focus-within/falar:px-3 group-focus-within/falar:opacity-100 group-hover/falar:mr-2 group-hover/falar:max-w-24 group-hover/falar:border group-hover/falar:px-3 group-hover/falar:opacity-100 max-md:hidden"
      >
        <Download className="size-3.5 shrink-0" />
        CV
      </a>
      <Button asChild variant="vinho" size="pilula">
        <Link href={{ hash: "contato", pathname: "/" }} onClick={aoClicar}>
          {rotulo}
        </Link>
      </Button>
    </div>
  )
}
