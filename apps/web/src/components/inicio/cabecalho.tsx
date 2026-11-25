import { getLocale, getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"

import { Idiomas } from "./idiomas"

const PAGINAS = [
  ["casos", "/casos"],
  ["projetos", "/projetos"],
  ["sobre", "/sobre"],
  ["ideias", "/ideias"],
] as const

const ITEM = "text-muted-foreground transition-colors hover:text-foreground"

export async function Cabecalho() {
  const t = await getTranslations("inicio.nav")
  const locale = await getLocale()

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
          {PAGINAS.map(([chave, rota]) => (
            <li key={chave}>
              <Link href={rota} className={ITEM}>
                {t(chave)}
              </Link>
            </li>
          ))}
          <li>
            {/* O contato fica no fim do início; toda página leva até lá. */}
            <a href={`/${locale}#contato`} className={ITEM}>
              {t("contato")}
            </a>
          </li>
        </ul>
        <Idiomas />
      </nav>
    </header>
  )
}
