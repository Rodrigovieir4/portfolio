import type { Metadata } from "next"

import {
  type Locale,
  projectBySlug,
  projects,
  t as traduzir,
} from "@portfolio/content"
import { setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

import { ProjetoDetalhe } from "@/components/projetos/projeto-detalhe"
import { alternativas } from "@/i18n/caminho"
import { routing } from "@/i18n/routing"

type Params = { locale: string; slug: string }

/** Gera as três traduções de cada projeto no build. */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const projeto = projectBySlug(slug)
  if (!projeto) return {}
  const resumo = traduzir(projeto.summary, locale as Locale)

  return {
    alternates: alternativas("/projetos/[slug]", {
      locale: locale as Locale,
      slug,
    }),
    description: resumo,
    openGraph: { description: resumo, title: projeto.name, type: "article" },
    title: projeto.name,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const projeto = projectBySlug(slug)
  if (!projeto) notFound()

  return <ProjetoDetalhe locale={locale as Locale} projeto={projeto} />
}
