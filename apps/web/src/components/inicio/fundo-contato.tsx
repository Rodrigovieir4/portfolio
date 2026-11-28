"use client"

import { useSyncExternalStore } from "react"

/**
 * Opções de fundo do bloco de contato, para o Rodrigo escolher (27/11: o
 * vinho cheio ficou "maciço"). Troca pelo endereço: `?fundo=vinho` (o atual),
 * `grafite`, `aurora`, `grade` ou `vidro`. Escolhida uma, as outras saem.
 */
const FUNDOS = ["vinho", "grafite", "aurora", "grade", "vidro"] as const
type Fundo = (typeof FUNDOS)[number]

function fundoDoEndereco(): Fundo {
  const pedido = new URLSearchParams(location.search).get("fundo")
  return FUNDOS.find((nome) => nome === pedido) ?? "vinho"
}

const semAviso = () => () => {}

const PONTOS = "absolute inset-0 fundo-pontos"

/** As camadas de cada fundo; todas decorativas e atrás do conteúdo. */
const CAMADAS: Record<Fundo, React.ReactNode> = {
  aurora: (
    <>
      <span className="absolute inset-0 bg-background" />
      <span className="absolute -top-1/3 -left-1/4 size-96 rounded-full bg-vinho/60 blur-3xl motion-safe:animate-deriva" />
      <span className="absolute -right-1/4 -bottom-1/3 size-112 rounded-full bg-vinho-claro/30 blur-3xl motion-safe:animate-deriva-reversa" />
      <span className="absolute top-1/4 left-1/2 size-72 rounded-full bg-foreground/5 blur-3xl motion-safe:animate-deriva" />
      <span className={`${PONTOS} opacity-20`} />
      <span className="absolute inset-0 rounded-3xl border border-border" />
    </>
  ),
  grade: (
    <>
      <span className="absolute inset-0 bg-card" />
      <span className="absolute inset-0 fundo-grade" />
      <span className="absolute inset-x-0 top-0 h-px linha-vinho luz-vinho" />
      <span className="absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-vinho/30 blur-3xl" />
      <span className="absolute inset-0 rounded-3xl border border-border" />
    </>
  ),
  grafite: (
    <>
      <span className="absolute inset-0 bg-card" />
      <span className="absolute -top-1/4 -right-1/4 size-112 rounded-full bg-vinho/35 blur-3xl" />
      <span className={`${PONTOS} opacity-30`} />
      <span className="absolute inset-0 rounded-3xl border border-border" />
    </>
  ),
  vidro: (
    <>
      <span className="absolute inset-0 bg-linear-to-br from-vinho/35 via-card to-background" />
      <span className={`${PONTOS} opacity-20`} />
      <span className="absolute inset-0 rounded-3xl border border-vinho-claro/30" />
    </>
  ),
  vinho: (
    <>
      <span className="absolute inset-0 bloco-vinho" />
      <span className={`${PONTOS} opacity-40`} />
    </>
  ),
}

export function FundoContato() {
  const fundo = useSyncExternalStore(
    semAviso,
    fundoDoEndereco,
    () => "vinho" as const,
  )
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
    >
      {CAMADAS[fundo]}
    </span>
  )
}
