import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"

import { FalarComigo } from "./falar-comigo"
import { Idiomas } from "./idiomas"
import { Marca } from "./marca"
import { MenuCelular } from "./menu-celular"

export const PAGINAS = [
  ["casos", "/casos"],
  ["projetos", "/projetos"],
  ["sobre", "/sobre"],
  ["ideias", "/ideias"],
] as const

// No hover (e no foco do teclado), uma barra vermelha cresce do centro
// embaixo do link.
export const ITEM =
  "relative text-muted-foreground transition-colors after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-vinho-claro after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100 focus-visible:after:scale-x-100"

export async function Cabecalho() {
  const t = await getTranslations("inicio.nav")
  const falar = (await getTranslations("inicio.abertura"))("falar")

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
        </ul>
        <div className="flex items-center gap-4 justify-self-end md:gap-6">
          <div className="max-md:hidden">
            <Idiomas />
          </div>
          {/* O único caminho para o contato no cabeçalho, sempre à mão: leva
              ao fim do início, de qualquer página. */}
          <FalarComigo rotulo={falar} />
          <MenuCelular
            fechar={t("fechar")}
            menu={t("menu")}
            paginas={PAGINAS.map(([chave, rota]) => ({
              rota,
              rotulo: t(chave),
            }))}
          />
        </div>
      </nav>
    </header>
  )
}
