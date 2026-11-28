"use client"

import { useLenis } from "@portfolio/ui"
import { ArrowUp } from "lucide-react"

import { areaDeRolagem } from "./rolagem"

/**
 * "Voltar ao topo" do rodapé (no lugar dos idiomas, pedido do Rodrigo,
 * 27/11): sobe suavemente, como a marca do cabeçalho faz no início.
 */
export function VoltarTopo({ rotulo }: { rotulo: string }) {
  const lenis = useLenis()

  function subir() {
    const instancia = lenis()
    if (instancia) instancia.scrollTo(0)
    else (areaDeRolagem() ?? window).scrollTo({ behavior: "smooth", top: 0 })
  }

  return (
    <button
      type="button"
      onClick={subir}
      className="group flex items-center gap-2 transition-colors hover:text-foreground"
    >
      {rotulo}
      <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  )
}
