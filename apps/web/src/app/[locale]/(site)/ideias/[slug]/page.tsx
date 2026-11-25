import type { Metadata } from "next"

import {
  type Idea,
  type Locale,
  ideaBySlug,
  ideas,
  t as traduzir,
} from "@portfolio/content"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

import { alternativas } from "@/i18n/caminho"
import { Link } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { formatarData } from "@/lib/data"

type Params = { locale: string; slug: string }

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ideas.map((ideia) => ({ locale, slug: ideia.slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const ideia = ideaBySlug(slug)
  if (!ideia) return {}
  const title = traduzir(ideia.title, locale as Locale)
  const description = traduzir(ideia.summary, locale as Locale)

  return {
    alternates: alternativas("/ideias/[slug]", {
      locale: locale as Locale,
      slug,
    }),
    description,
    openGraph: { description, title, type: "article" },
    title,
  }
}

function Bloco({
  bloco,
  locale,
}: {
  bloco: Idea["blocks"][number]
  locale: Locale
}) {
  const itens = traduzir(bloco.text, locale)

  if (bloco.kind === "paragrafo") {
    return itens.map((texto) => (
      <p key={texto} data-mov="subir" className="text-xl text-pretty">
        {texto}
      </p>
    ))
  }

  const Lista = bloco.kind === "passos" ? "ol" : "ul"
  return (
    <Lista className="flex flex-col gap-4 border-l border-vinho-claro pl-6">
      {itens.map((texto, indice) => (
        <li key={texto} data-mov="subir" className="flex gap-4 text-lg">
          <span aria-hidden className="font-mono text-vinho-claro">
            {bloco.kind === "passos"
              ? String(indice + 1).padStart(2, "0")
              : "→"}
          </span>
          <span className="text-pretty">{texto}</span>
        </li>
      ))}
    </Lista>
  )
}

export default async function IdeiaPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const ideia = ideaBySlug(slug)
  if (!ideia) notFound()
  const t = await getTranslations("ideia")
  const idioma = locale as Locale

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-8 px-4 pt-32 pb-24 lg:pt-40">
      <Link href="/ideias" className="font-mono text-sm text-muted-foreground">
        ← {t("voltar")}
      </Link>
      <h1
        data-mov="titulo"
        className="text-5xl font-semibold tracking-tight text-balance md:text-7xl"
      >
        {traduzir(ideia.title, idioma)}
      </h1>
      <p
        data-mov="abertura"
        className="flex flex-wrap gap-x-6 font-mono text-xs text-muted-foreground"
      >
        <time dateTime={ideia.publishedAt}>
          {formatarData(ideia.publishedAt, idioma)}
        </time>
        {ideia.linkedinUrl ? (
          <a href={ideia.linkedinUrl} target="_blank" rel="noreferrer">
            {t("verPost")} ↗
          </a>
        ) : null}
      </p>
      <div className="mt-8 flex flex-col gap-8 border-t border-border pt-12">
        {ideia.blocks.map((bloco, indice) => (
          <Bloco key={indice} bloco={bloco} locale={idioma} />
        ))}
      </div>
    </article>
  )
}
