import { profile } from "@portfolio/content"
import { StatusDot } from "@portfolio/ui"
import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"

import { PAGINAS } from "./cabecalho"
import { alvo, CANAIS } from "./canais"
import { VoltarTopo } from "./voltar-topo"

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
 * O rodapé com a cara do site (pedido do Rodrigo, 27/11): a marca de
 * terminal, o cargo e o selo de disponível; a navegação com a barra vinho do
 * cabeçalho; os canais com ícone e a cor de cada um no hover; e uma linha com
 * o ano e o "voltar ao topo". Em vidro fosco, como o cabeçalho (pedido dele).
 */
export async function Rodape() {
  const t = await getTranslations("rodape")
  const nav = await getTranslations("inicio.nav")
  const abertura = await getTranslations("inicio.abertura")

  return (
    <footer className="overflow-hidden border-t border-border bg-background/60 backdrop-blur-xl backdrop-saturate-150">
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
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-border px-4 py-6 font-mono text-xs text-muted-foreground lg:px-8">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <VoltarTopo rotulo={t("topo")} />
      </div>
    </footer>
  )
}
