"use client"

import { useSyncExternalStore } from "react"

const HORA = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
})
const FUSO = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Sao_Paulo",
  timeZoneName: "shortOffset",
})

/** Avisa a cada 30 s: o relógio muda de minuto sem atraso perceptível. */
function aCadaMeioMinuto(avisar: () => void) {
  const id = window.setInterval(avisar, 30_000)
  return () => window.clearInterval(id)
}

function agora() {
  const data = new Date()
  const fuso =
    FUSO.formatToParts(data).find((p) => p.type === "timeZoneName")?.value ?? ""
  return `${HORA.format(data)} (${fuso})`
}

/**
 * A hora em São Paulo, no rodapé (pedido do Rodrigo, 27/11, no lugar do
 * "voltar ao topo"): quem é de outro fuso vê na hora que horas são para ele.
 * Só no navegador, para não divergir da página gerada no servidor.
 */
export function HoraLocal({ cidade }: { cidade: string }) {
  const hora = useSyncExternalStore(aCadaMeioMinuto, agora, () => "")
  if (!hora) return null
  return (
    <span className="flex items-center gap-2">
      <span aria-hidden className="size-1.5 rounded-full bg-vinho-claro" />
      {cidade} · {hora}
    </span>
  )
}
