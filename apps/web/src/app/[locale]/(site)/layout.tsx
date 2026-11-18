import { Cursor, Grain, ScrollProgress, SmoothScroll } from '@portfolio/ui';
import { setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

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
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Layout e página renderizam em paralelo: sem isto, o rodapé pergunta o
  // idioma aos cabeçalhos da requisição e a rota inteira deixa de ser estática.
  setRequestLocale((await params).locale);

  return (
    <SmoothScroll>
      <ScrollProgress />
      <Grain />
      <Cursor />

      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
