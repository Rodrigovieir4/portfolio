import type { Metadata } from "next"

import { type Locale, ideas, t as traduzir } from "@portfolio/content"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { alternativas } from "@/i18n/caminho"
import { Link } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { formatarData } from "@/lib/data"

type Params = { locale: string }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "ideiasPagina" })
  return {
    alternates: alternativas("/ideias", { locale: locale as Locale }),
    description: t("descricao"),
    title: t("titulo"),
  }
}

export default async function IdeiasPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("ideiasPagina")
  const idioma = locale as Locale

  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 pb-24 lg:px-8 lg:pt-40">
      <h1
        data-mov="titulo"
        className="text-6xl font-semibold tracking-tight md:text-8xl"
      >
        {t("titulo")}
      </h1>
      <p
        data-mov="abertura"
        className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground"
      >
        {t("descricao")}
      </p>
      <ol className="mt-16 border-t border-border">
        {ideas.map((ideia) => (
          <li key={ideia.slug} data-mov="subir">
            <Link
              href={{
                params: { slug: ideia.slug },
                pathname: "/ideias/[slug]",
              }}
              className="group grid gap-4 border-b border-border py-10 md:grid-cols-12 md:items-baseline"
            >
              <time
                dateTime={ideia.publishedAt}
                className="font-mono text-xs text-muted-foreground md:col-span-2"
              >
                {formatarData(ideia.publishedAt, idioma)}
              </time>
              <span className="text-4xl font-semibold tracking-tight text-balance transition-colors group-hover:text-vinho-claro md:col-span-6 md:text-5xl">
                {traduzir(ideia.title, idioma)}
              </span>
              <span className="text-pretty text-muted-foreground md:col-span-4">
                {traduzir(ideia.summary, idioma)}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
