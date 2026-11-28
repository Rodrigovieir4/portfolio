import { type Locale, profile, t as traduzir } from "@portfolio/content"
import { StatusDot } from "@portfolio/ui"
import { getLocale, getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"

import { PAGINAS } from "./cabecalho"
import { alvo, CANAIS } from "./canais"
import { CantoRodape } from "./rodape-mocks"

/** Rótulo pequeno de cada coluna, em mono, como os comandos do site. */
function Rotulo({ children }: { children: string }) {
  return (
    <span className="font-mono text-xs text-muted-foreground uppercase">
      {children}
    </span>
  )
}

/** Os canais, com ícone e a cor de cada um no hover. */
function Contatos({ rotulo }: { rotulo: string }) {
  return (
    <div className="flex flex-col gap-4 md:col-span-3">
      <Rotulo>{rotulo}</Rotulo>
      <ul className="flex flex-col gap-3 text-sm">
        {CANAIS.map((canal) => (
          <li key={canal.platform} data-marca={canal.platform}>
            <a
              href={canal.url}
              {...alvo(canal)}
              className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
            >
              <canal.Icone className="size-4 transition-colors group-hover:cor-marca" />
              {canal.nome}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Névoa vinho à deriva atrás do vidro: três manchas grandes e muito
 * desfocadas, como uma aurora lenta (paradas sem movimento pedido).
 */
function Nevoa() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <span className="absolute -top-1/2 left-8 size-112 rounded-full bg-vinho/50 nevoa motion-safe:animate-deriva" />
      <span className="absolute top-1/4 left-1/2 size-96 rounded-full bg-vinho-claro/25 nevoa motion-safe:animate-deriva-reversa" />
      <span className="absolute -right-1/4 -bottom-1/2 size-128 rounded-full bg-vinho/40 nevoa motion-safe:animate-deriva-lenta" />
    </div>
  )
}

/** A última linha: o ano e o canto com opções (rodape-mocks.tsx). */
async function LinhaFinal() {
  const t = await getTranslations("rodape")
  const contato = await getTranslations("inicio.contato")
  return (
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 font-mono text-xs text-muted-foreground lg:px-8">
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <CantoRodape
        cv={traduzir(profile.resumeUrl, (await getLocale()) as Locale)}
        email={profile.email}
        rotulos={{
          copiado: t("copiado"),
          copiar: t("copiar"),
          curriculo: contato("curriculo"),
          jogar: t("jogar"),
        }}
      />
    </div>
  )
}

/**
 * O rodapé com a cara do site (pedido do Rodrigo, 27/11): a marca de
 * terminal, o cargo e o selo de disponível; a navegação com a barra vinho do
 * cabeçalho; os canais com ícone e a cor de cada um no hover; e uma linha com
 * o ano e um canto com opções (rodape-mocks.tsx). Em vidro fosco, sem borda
 * (pedido dele), com uma névoa vinho à deriva atrás.
 */
export async function Rodape() {
  const t = await getTranslations("rodape")
  const nav = await getTranslations("inicio.nav")
  const abertura = await getTranslations("inicio.abertura")

  return (
    <footer className="relative overflow-hidden">
      <Nevoa />
      <div className="relative vidro">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-16 pb-12 md:grid-cols-12 lg:px-8">
          <div className="flex flex-col gap-4 md:col-span-6">
            <Link
              href="/"
              className="w-fit font-mono text-lg font-semibold transition-opacity hover:opacity-80"
            >
              <span className="text-vinho-claro">❯</span> rodrigo-vieira
            </Link>
            <p className="text-sm text-muted-foreground">
              {abertura("rotulo")} · {profile.location.city},{" "}
              {profile.location.state}
            </p>
            <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <StatusDot />
              {abertura("disponivel")}
            </p>
          </div>
          <nav className="flex flex-col gap-4 md:col-span-3">
            <Rotulo>{t("navegar")}</Rotulo>
            <ul className="flex flex-col gap-3 text-sm">
              {PAGINAS.map(([chave, rota]) => (
                <li key={chave}>
                  <Link
                    href={rota}
                    // Diferente do cabeçalho: a letra só acende no vinho.
                    className="text-muted-foreground transition duration-300 hover:brilho-vinho hover:text-vinho-claro focus-visible:text-vinho-claro"
                  >
                    {nav(chave)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Contatos rotulo={t("contato")} />
        </div>
        <LinhaFinal />
      </div>
    </footer>
  )
}
