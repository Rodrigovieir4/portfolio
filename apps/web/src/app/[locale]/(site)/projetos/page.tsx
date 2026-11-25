import type { Metadata } from "next"

import {
  type Locale,
  type Project,
  clientProjects,
  personalProjects,
  t as traduzir,
} from "@portfolio/content"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { alternativas } from "@/i18n/caminho"
import { Link } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"

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
  const t = await getTranslations({ locale, namespace: "projetosPagina" })
  return {
    alternates: alternativas("/projetos", { locale: locale as Locale }),
    description: t("descricao"),
    title: t("titulo"),
  }
}

async function Grupo({
  locale,
  lista,
  titulo,
}: {
  locale: Locale
  lista: Project[]
  titulo: string
}) {
  const t = await getTranslations("projeto")

  return (
    <section className="mt-20">
      <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
        {titulo}
      </h2>
      <ol className="mt-6 border-t border-border">
        {lista.map((projeto, indice) => (
          <li key={projeto.slug} data-mov="subir">
            <Link
              href={{
                params: { slug: projeto.slug },
                pathname: "/projetos/[slug]",
              }}
              className="group grid gap-3 border-b border-border py-8 transition-colors hover:bg-card md:grid-cols-12 md:items-baseline md:px-4"
            >
              <span className="font-numeros text-2xl text-muted-foreground md:col-span-1">
                {String(indice + 1).padStart(2, "0")}
              </span>
              <span className="text-4xl font-semibold tracking-tight transition-colors group-hover:text-vinho-claro md:col-span-4 md:text-5xl">
                {projeto.name}
              </span>
              <span className="text-pretty text-muted-foreground md:col-span-5">
                {traduzir(projeto.summary, locale)}
              </span>
              <span className="font-mono text-xs text-muted-foreground uppercase md:col-span-2 md:text-right">
                {projeto.year} · {t(`status.${projeto.status}`)}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default async function ProjetosPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("projetosPagina")

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
      <Grupo
        locale={locale as Locale}
        lista={clientProjects}
        titulo={t("clientes")}
      />
      <Grupo
        locale={locale as Locale}
        lista={personalProjects}
        titulo={t("proprios")}
      />
    </div>
  )
}
