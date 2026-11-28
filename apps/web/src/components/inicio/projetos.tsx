import {
  type Locale,
  type Project,
  projects,
  t as traduzir,
} from "@portfolio/content"
import { Card } from "@portfolio/ui/components/card"
import { getLocale, getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

import { Comando } from "./comando"
import { FotosProjeto } from "./fotos-projeto"

/*
 * Seis projetos no ar, para fechar a grade (um grande e cinco menores). O CS2
 * Cortex abre em destaque (pedido do Rodrigo, 27/11: o mais bem produzido).
 */
const ORDEM = [
  "cs2-cortex",
  "esplendido",
  "db-store",
  "daisy",
  "db-connect",
  "memoreba",
]
const VITRINE = ORDEM.flatMap(
  (slug) => projects.find((p) => p.slug === slug) ?? [],
)

/** Um projeto da vitrine: as fotos passam no fundo, o texto fica embaixo. */
function CartaoProjeto({
  indice,
  locale,
  projeto,
}: {
  indice: number
  locale: Locale
  projeto: Project
}) {
  const fotos = projeto.gallery.length > 0
  // Sem fotos, o terceiro guarda o bloco vinho do desenho; os outros, pontos.
  const vinho = !fotos && indice === 2
  return (
    <li
      data-mov="subir"
      className={cn(
        indice === 0 && "md:col-span-2 md:row-span-2",
        vinho && "rounded-2xl bloco-vinho",
      )}
    >
      <Card
        asChild
        variant="contorno"
        className="relative h-full min-h-56 justify-end gap-3 overflow-hidden bg-transparent p-6"
      >
        <Link
          href={{
            params: { slug: projeto.slug },
            pathname: "/projetos/[slug]",
          }}
        >
          {fotos ? (
            <FotosProjeto destaque={indice === 0} fotos={projeto.gallery} />
          ) : null}
          {/* Pontos numa camada própria: a máscara não apaga o texto. */}
          {!fotos && !vinho ? (
            <span
              aria-hidden
              className="absolute inset-0 rounded-2xl fundo-pontos"
            />
          ) : null}
          <span className="relative text-3xl font-semibold tracking-tight">
            {projeto.name} →
          </span>
          <span className="relative max-w-md text-sm text-pretty text-muted-foreground">
            {traduzir(projeto.summary, locale)}
          </span>
          <span className="relative font-mono text-xs text-muted-foreground">
            {projeto.stack.slice(0, 3).join(" · ")}
          </span>
        </Link>
      </Card>
    </li>
  )
}

export async function Projetos() {
  const t = await getTranslations("inicio.projetos")
  const c = await getTranslations("inicio.comandos")
  const locale = (await getLocale()) as Locale

  return (
    <section
      id="projetos"
      className="mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-32"
    >
      <Comando texto={c("projetos")} className="mb-4" />
      <h2
        data-mov="subir"
        className="text-5xl font-semibold tracking-tight md:text-6xl"
      >
        {t("titulo")}
      </h2>
      <ul className="mt-12 grid auto-rows-fr gap-4 md:grid-cols-3">
        {VITRINE.map((projeto, indice) => (
          <CartaoProjeto
            key={projeto.slug}
            indice={indice}
            locale={locale}
            projeto={projeto}
          />
        ))}
      </ul>
      <Link
        href="/projetos"
        className="mt-8 inline-block font-mono text-sm underline underline-offset-4"
      >
        {t("verTodos")} →
      </Link>
    </section>
  )
}
