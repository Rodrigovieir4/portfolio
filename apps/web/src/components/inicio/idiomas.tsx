"use client"

import { LOCALES } from "@portfolio/content"
import { useLocale } from "next-intl"
import { useParams } from "next/navigation"

import { getPathname, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

/**
 * Troca de idioma que mantém a página atual, com o caminho traduzido. É o
 * único link que recarrega a página de propósito: o idioma novo chega inteiro,
 * com a abertura do início de novo.
 */
export function Idiomas() {
  const atual = useLocale()
  const pathname = usePathname()
  const params = useParams()
  const href = { params, pathname } as Parameters<typeof getPathname>[0]["href"]

  return (
    <ul className="flex gap-3 font-mono text-xs uppercase">
      {LOCALES.map((locale) => (
        <li key={locale}>
          <a
            href={getPathname({ href, locale })}
            hrefLang={locale}
            aria-current={locale === atual ? "true" : undefined}
            className={cn(
              "text-muted-foreground transition-colors hover:text-foreground",
              locale === atual && "text-foreground",
            )}
          >
            {locale}
          </a>
        </li>
      ))}
    </ul>
  )
}
