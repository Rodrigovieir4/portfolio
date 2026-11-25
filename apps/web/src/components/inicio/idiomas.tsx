"use client"

import type { ComponentProps } from "react"

import { LOCALES } from "@portfolio/content"
import { useLocale } from "next-intl"
import { useParams } from "next/navigation"

import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

/** Troca de idioma que mantém a página atual, com o caminho traduzido. */
export function Idiomas() {
  const atual = useLocale()
  const pathname = usePathname()
  const params = useParams()
  const href = { params, pathname } as ComponentProps<typeof Link>["href"]

  return (
    <ul className="flex gap-3 font-mono text-xs uppercase">
      {LOCALES.map((locale) => (
        <li key={locale}>
          <Link
            href={href}
            locale={locale}
            aria-current={locale === atual ? "true" : undefined}
            className={cn(
              "text-muted-foreground transition-colors hover:text-foreground",
              locale === atual && "text-foreground",
            )}
          >
            {locale}
          </Link>
        </li>
      ))}
    </ul>
  )
}
