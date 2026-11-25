import type { Metadata } from "next"

import { type Locale, cases } from "@portfolio/content"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { CartaoCaso } from "@/components/casos/cartao-caso"
import { alternativas } from "@/i18n/caminho"
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
  const t = await getTranslations({ locale, namespace: "casosPagina" })
  return {
    alternates: alternativas("/casos", { locale: locale as Locale }),
    description: t("descricao"),
    title: t("titulo"),
  }
}

export default async function CasosPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("casosPagina")
  const emBreve = (await getTranslations("caso"))("emBreve")

  return (
    <section className="mx-auto max-w-7xl px-4 pt-32 pb-24 lg:px-8 lg:pt-40">
      <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
        {t("titulo")}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">
        {t("descricao")}
      </p>
      <ul className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cases.map((caso) => (
          <li key={caso.slug}>
            <CartaoCaso
              caso={caso}
              emBreve={emBreve}
              locale={locale as Locale}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
