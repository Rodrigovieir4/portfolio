"use client"

import { type Locale, LOCALE_META, LOCALES } from "@portfolio/content"
import { cn } from "@portfolio/ui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@portfolio/ui/components/dropdown-menu"
import { Check, Globe } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { useTransition } from "react"

import { usePathname, useRouter } from "@/i18n/navigation"

/**
 * Troca de idioma preservando a página atual.
 *
 * O `usePathname` do next-intl devolve o caminho interno, sem prefixo de
 * idioma, então o mesmo valor serve para os três. O `params` é repassado para
 * que rotas dinâmicas como /projetos/[slug] não percam o slug na troca.
 */
export function LocaleSwitcher() {
  const t = useTranslations("nav")
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function change(next: Locale) {
    if (next === locale) return
    startTransition(() => {
      router.replace(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { pathname, params: params as any },
        { locale: next },
      )
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("changeLanguage")}
          disabled={pending}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-line bg-abyss/70 px-3 py-2 font-mono text-[0.68rem] tracking-[0.1em] text-ink uppercase transition-colors hover:border-line-strong",
            pending && "opacity-60",
          )}
        >
          <Globe
            className="h-3.5 w-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          {locale}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-44 border-line bg-popover"
      >
        <DropdownMenuLabel className="font-mono text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
          {t("changeLanguage")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-line" />

        {LOCALES.map((item) => (
          <DropdownMenuItem
            key={item}
            onSelect={() => change(item)}
            className="cursor-pointer gap-2 focus:bg-elevated focus:text-ink"
          >
            <span aria-hidden="true">{LOCALE_META[item].flag}</span>
            <span className="flex-1">{LOCALE_META[item].label}</span>
            {item === locale && (
              <Check className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
