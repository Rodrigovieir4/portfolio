import { type Locale, LOCALE_META } from "@portfolio/content"

import { siteUrl } from "@/lib/site"

import { type AppPathname, routing } from "./routing"

/** Caminho traduzido de uma rota, lido do próprio roteamento. */
type Destino = { locale: Locale; slug?: string }

export function caminho(rota: AppPathname, { locale, slug = "" }: Destino) {
  const destino = routing.pathnames[rota]
  const texto = typeof destino === "string" ? destino : destino[locale]
  return `/${locale}${texto.replace("[slug]", slug)}`.replace(/\/$/, "")
}

/**
 * Canonical e versões de idioma de uma página, para o metadata.
 *
 * Toda página declara as suas: sem isso ela herda o canonical do layout, que
 * aponta para o início, e o buscador trata a página como cópia da home.
 */
export function alternativas(rota: AppPathname, { locale, slug }: Destino) {
  return {
    canonical: `${siteUrl}${caminho(rota, { locale, slug })}`,
    languages: Object.fromEntries(
      routing.locales.map((l) => [
        LOCALE_META[l].hreflang,
        `${siteUrl}${caminho(rota, { locale: l, slug })}`,
      ]),
    ),
  }
}
