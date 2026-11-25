import { getLocale, getTranslations } from "next-intl/server"

import { ShinyText } from "@/components/reactbits/shiny-text"
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
 * Marca em forma de tag: <RodrigoVieira/>, como um componente. O ShinyText
 * do React Bits passa um reflexo claro pelas letras a cada poucos segundos,
 * com um halo suave; para quem pede menos movimento, fica parada.
 */
function Marca() {
  return (
    <Link
      href="/"
      aria-label="Rodrigo Vieira"
      data-marca-link
      className="w-fit text-xl font-extrabold tracking-tight transition-opacity hover:opacity-85 md:text-2xl"
    >
      <ShinyText
        color="#e8607a"
        delay={2.5}
        glow={0.45}
        shineColor="#fff1f3"
        shineWidth={30}
        speed={2.2}
      >
        {/* O movimento.tsx decodifica este texto ao aparecer e no hover. */}
        <span data-marca>{"<RodrigoVieira/>"}</span>
      </ShinyText>
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
