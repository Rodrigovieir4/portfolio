import type { Locale } from "@portfolio/content"

/** Data AAAA-MM-DD por extenso curto no idioma da página, sem fuso. */
export function formatarData(data: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(data))
}
