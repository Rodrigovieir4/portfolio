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

// No hover (e no foco do teclado), uma barra vermelha cresce do centro
// embaixo do link.
const ITEM =
  "relative text-muted-foreground transition-colors after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-vinho-claro after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100 focus-visible:after:scale-x-100"

/**
 * Marca do cabeçalho como um prompt de terminal: a seta em vinho, o nome
 * como comando e um cursor em barra fina. O movimento.tsx digita o nome ao
 * aparecer; o cursor pisca devagar uns segundos e depois fica parado.
 */
function Marca() {
  return (
    <Link
      href="/"
      aria-label="Rodrigo Vieira"
      className="flex w-fit items-center gap-2 font-mono text-base font-semibold text-foreground transition-opacity hover:opacity-80 md:text-lg"
    >
      <span aria-hidden className="text-vinho-claro">
        ❯
      </span>
      <span aria-hidden>
        <span data-prompt data-final="rodrigo-vieira">
          rodrigo-vieira
        </span>
        <span
          data-cursor
          className="ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-[0.2em] bg-vinho-claro"
        />
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
      className="fixed inset-x-0 top-0 z-40 bg-background/60 backdrop-blur-xl backdrop-saturate-150"
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
