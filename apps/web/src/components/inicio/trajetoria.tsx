import { type Locale, milestones, t as traduzir } from "@portfolio/content"
import { getLocale, getTranslations } from "next-intl/server"

import { cn } from "@/lib/utils"

import { Comando } from "./comando"

interface Marco {
  ano: string
  id: string
  /** Mês curto ("out"), vazio no marco de hoje. */
  mes: string
  texto: string
  titulo: string
}

/**
 * Linha da grade em que cada marco começa, no computador. Cada um ocupa duas
 * linhas e o seguinte, do outro lado, começa uma abaixo: os marcos se
 * encaixam sem se sobrepor, seja qual for a altura do texto. Classes
 * escritas por extenso para o Tailwind achar.
 */
const INICIO = [
  "md:row-start-1",
  "md:row-start-2",
  "md:row-start-3",
  "md:row-start-4",
  "md:row-start-5",
  "md:row-start-6",
  "md:row-start-7",
  "md:row-start-8",
  "md:row-start-9",
  "md:row-start-10",
]

/**
 * Um marco. No computador alterna os lados da linha (pares à esquerda,
 * alinhados a ela; ímpares à direita); no celular, todos à direita da linha.
 * O ponto acende em vinho quando a linha passa (com movimento).
 */
function ItemMarco({ indice, marco }: { indice: number; marco: Marco }) {
  const esquerda = indice % 2 === 0
  return (
    <li
      data-mov="marco"
      className={cn(
        "group relative flex flex-col gap-2 pl-10 md:row-span-2 md:pb-24 md:last:pb-0",
        INICIO[indice],
        esquerda
          ? "md:col-start-1 md:pr-12 md:pl-0 md:text-right"
          : "md:col-start-2 md:pl-12",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-2 left-0.5 size-3 rounded-full bg-foreground transition-[background-color,box-shadow] duration-500 group-data-[passou=false]:bg-muted-foreground/40 group-data-[passou=true]:bg-vinho-claro group-data-[passou=true]:luz-vinho-fraca",
          esquerda
            ? "md:right-0 md:left-auto md:translate-x-1/2"
            : "md:left-0 md:-translate-x-1/2",
        )}
      />
      <span className="font-mono text-2xl">
        {marco.ano}
        {marco.mes ? (
          <span className="ml-2 text-sm text-muted-foreground uppercase">
            {marco.mes}
          </span>
        ) : null}
      </span>
      {marco.titulo ? (
        <span className="text-lg font-semibold tracking-tight text-balance">
          {marco.titulo}
        </span>
      ) : null}
      <span className="text-sm text-pretty text-muted-foreground">
        {marco.texto}
      </span>
    </li>
  )
}

/**
 * A linha e a ponta: uma luz vinho, como a do laser da abertura, que desce
 * junto enquanto a linha se desenha com a rolagem (movimento.tsx).
 */
function Linha() {
  return (
    <>
      <div
        aria-hidden
        data-mov="linha"
        className="absolute top-0 left-2 h-full w-px linha-vinho md:left-1/2"
      />
      <div
        aria-hidden
        data-mov="ponta"
        className="pointer-events-none absolute top-0 left-2 z-10 hidden size-3 -translate-1/2 rounded-full bg-vinho-claro luz-vinho md:left-1/2"
      />
    </>
  )
}

/**
 * Trajetória vertical (pedido do Rodrigo, 27/11): a linha desce com a
 * rolagem e os marcos alternam de lado, encaixados uns nos outros, em ordem
 * de data
 * (`packages/content/src/data/milestones.ts`).
 */
export async function Trajetoria() {
  const t = await getTranslations("inicio.trajetoria")
  const c = await getTranslations("inicio.comandos")
  const locale = (await getLocale()) as Locale
  const mes = new Intl.DateTimeFormat(locale, {
    month: "short",
    timeZone: "UTC",
  })
  const marcos: Marco[] = milestones.map((item) => ({
    ano: item.date.slice(0, 4),
    id: item.id,
    mes: mes.format(new Date(`${item.date}-01`)).replace(".", ""),
    texto: traduzir(item.text, locale),
    titulo: traduzir(item.title, locale),
  }))
  const todos = [
    ...marcos,
    { ano: t("hoje"), id: "hoje", mes: "", texto: t("hojeTexto"), titulo: "" },
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
        <ol className="relative flex flex-col gap-14 md:grid md:grid-cols-2 md:gap-0">
          {todos.map((marco, indice) => (
            <ItemMarco key={marco.id} indice={indice} marco={marco} />
          ))}
        </ol>
      </div>
    </section>
  )
}
