import { type Locale, experiences, t as traduzir } from "@portfolio/content"
import { getLocale, getTranslations } from "next-intl/server"

import { Comando } from "./comando"

interface Marco {
  ano: string
  id: string
  texto: string
}

/** Um marco: o ponto acende em vinho quando a linha passa (com movimento). */
function ItemMarco({ marco }: { marco: Marco }) {
  return (
    <li
      data-mov="marco"
      className="group relative flex flex-col gap-2 pl-8 md:pt-10 md:pl-0"
    >
      <span
        aria-hidden
        className="absolute top-1 left-0.5 size-3 rounded-full bg-foreground transition-[background-color,box-shadow] duration-500 group-data-[passou=false]:bg-muted-foreground/40 group-data-[passou=true]:bg-vinho-claro group-data-[passou=true]:luz-vinho-fraca md:top-0 md:left-0"
      />
      <span className="font-mono text-2xl">{marco.ano}</span>
      <span className="text-sm text-pretty text-muted-foreground">
        {marco.texto}
      </span>
    </li>
  )
}

/**
 * A linha e a ponta: uma luz vinho, como a do laser da abertura, que corre
 * junto enquanto a linha se desenha com a rolagem (movimento.tsx).
 */
function Linha() {
  return (
    <>
      <div
        aria-hidden
        data-mov="linha"
        className="absolute top-0 left-2 h-full w-px linha-vinho md:top-1.5 md:left-0 md:h-px md:w-full"
      />
      <div
        aria-hidden
        data-mov="ponta"
        className="pointer-events-none absolute top-0 left-2 z-10 hidden size-3 -translate-1/2 rounded-full bg-vinho-claro luz-vinho md:top-1.5 md:left-0"
      />
    </>
  )
}

export async function Trajetoria() {
  const t = await getTranslations("inicio.trajetoria")
  const c = await getTranslations("inicio.comandos")
  const locale = (await getLocale()) as Locale
  const marcos: Marco[] = experiences
    .filter((item) => item.kind === "work" || item.kind === "education")
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((item) => ({
      ano: item.start.slice(0, 4),
      id: item.id,
      texto: `${traduzir(item.role, locale)}, ${item.organization}`,
    }))
  const todos = [
    ...marcos,
    { ano: t("hoje"), id: "hoje", texto: t("hojeTexto") },
  ]

  return (
    <section
      id="trajetoria"
      className="mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-32"
    >
      <Comando texto={c("trajetoria")} className="mb-4" />
      <h2
        data-mov="subir"
        className="text-5xl font-semibold tracking-tight md:text-6xl"
      >
        {t("titulo")}
      </h2>
      <div className="relative mt-16">
        <Linha />
        <ol className="relative grid gap-10 md:grid-cols-5 md:gap-6">
          {todos.map((marco) => (
            <ItemMarco key={marco.id} marco={marco} />
          ))}
        </ol>
      </div>
    </section>
  )
}
