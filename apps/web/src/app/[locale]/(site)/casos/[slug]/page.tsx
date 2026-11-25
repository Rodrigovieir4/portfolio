import type { Metadata } from "next"

import {
  type Locale,
  caseBySlug,
  cases,
  t as traduzir,
} from "@portfolio/content"
import { setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

import { CasoDetalhe } from "@/components/casos/caso-detalhe"
import { routing } from "@/i18n/routing"
import { siteUrl } from "@/lib/site"

type Params = { locale: string; slug: string }

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    cases.map((caso) => ({ locale, slug: caso.slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const caso = caseBySlug(slug)
  if (!caso) return {}

  const title = traduzir(caso.title, locale as Locale)
  const description = traduzir(caso.summary, locale as Locale)
  return {
    alternates: { canonical: `${siteUrl}/${locale}/casos/${slug}` },
    description,
    openGraph: { description, title, type: "article" },
    title,
  }
}

export default async function CasoPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const caso = caseBySlug(slug)
  if (!caso) notFound()

  return <CasoDetalhe caso={caso} locale={locale as Locale} />
}
