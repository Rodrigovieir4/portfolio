import { getLocale, getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"

import { Idiomas } from "./idiomas"
import { MenuCelular } from "./menu-celular"

const PAGINAS = [
  ["casos", "/casos"],
  ["projetos", "/projetos"],
  ["sobre", "/sobre"],
  ["ideias", "/ideias"],
] as const

const ITEM = "text-muted-foreground transition-colors hover:text-foreground"

/**
 * Marca em forma de tag: <RodrigoVieira/>, como um componente. Os sinais
 * ficam um tom abaixo para o nome ter o destaque.
 */
function Marca() {
  return (
    <Link
      href="/"
      aria-label="Rodrigo Vieira"
      className="w-fit text-xl font-extrabold tracking-tight text-vinho-claro transition-opacity brilho-marca hover:opacity-85 md:text-2xl"
    >
      <span aria-hidden className="opacity-60">
        {"<"}
      </span>
      RodrigoVieira
      <span aria-hidden className="opacity-60">
        {"/>"}
      </span>
    </Link>
  )
}

export async function Cabecalho() {
  const t = await getTranslations("inicio.nav")
  const locale = await getLocale()
  const contato = `/${locale}#contato`

  return (
    <header
      data-cabecalho
      // Preto fosco: translúcido e desfocado, o feixe aparece borrado atrás.
      className="absolute inset-x-0 top-0 z-20 border-b border-foreground/8 bg-background/60 backdrop-blur-xl backdrop-saturate-150"
    >
      <a
        href="#conteudo"
        className="sr-only rounded-full bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
      >
        {t("pular")}
      </a>
      <nav className="mx-auto grid h-16 max-w-7xl grid-cols-2 items-center px-4 md:grid-cols-3 lg:px-8">
        <Marca />
        <ul className="hidden gap-8 justify-self-center text-sm md:flex">
          {PAGINAS.map(([chave, rota]) => (
            <li key={chave}>
              <Link href={rota} className={ITEM}>
                {t(chave)}
              </Link>
            </li>
          ))}
          <li>
            {/* O contato fica no fim do início; toda página leva até lá. */}
            <a href={contato} className={ITEM}>
              {t("contato")}
            </a>
          </li>
        </ul>
        <div className="justify-self-end max-md:hidden">
          <Idiomas />
        </div>
        <MenuCelular
          contato={{ href: contato, rotulo: t("contato") }}
          fechar={t("fechar")}
          menu={t("menu")}
          paginas={PAGINAS.map(([chave, rota]) => ({
            rota,
            rotulo: t(chave),
          }))}
        />
      </nav>
    </header>
  )
}
