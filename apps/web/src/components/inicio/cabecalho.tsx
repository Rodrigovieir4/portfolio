import { LOCALES } from "@portfolio/content"
import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"

const SECOES = ["casos", "projetos", "sobre", "contato"] as const

export async function Cabecalho() {
  const t = await getTranslations("inicio.nav")

  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <a
        href="#conteudo"
        className="sr-only rounded-full bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
      >
        {t("pular")}
      </a>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="font-mono text-sm">
          Rodrigo Vieira
        </Link>
        <ul className="hidden gap-8 text-sm md:flex">
          {SECOES.map((secao) => (
            <li key={secao}>
              <a
                href={`#${secao}`}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t(secao)}
              </a>
            </li>
          ))}
        </ul>
        <ul className="flex gap-3 font-mono text-xs uppercase">
          {LOCALES.map((locale) => (
            <li key={locale}>
              <Link
                href="/"
                locale={locale}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {locale}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
