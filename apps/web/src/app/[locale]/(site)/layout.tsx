import type { ReactNode } from "react"

import { SmoothScroll } from "@portfolio/ui"
import { setRequestLocale } from "next-intl/server"

import { Cabecalho } from "@/components/inicio/cabecalho"
import { Rodape } from "@/components/inicio/rodape"

/**
 * Moldura do site em modo currículo.
 *
 * Mora num grupo de rotas, que não aparece na URL, para que a página do jogo
 * fique de fora: o jogo ocupa a tela inteira e não pode ter cabeçalho,
 * rodapé nem a rolagem suave do Lenis interceptando a roda do mouse.
 */
export default async function SiteLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  // Layout e página renderizam em paralelo: sem isto, o rodapé pergunta o
  // idioma aos cabeçalhos da requisição e a rota inteira deixa de ser estática.
  setRequestLocale((await params).locale)

  return (
    <SmoothScroll>
      <Cabecalho />
      <main id="conteudo">{children}</main>
      <Rodape />
    </SmoothScroll>
  )
}
