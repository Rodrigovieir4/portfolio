import { Cursor, Grain, ScrollProgress, SmoothScroll } from '@portfolio/ui';
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
export default function SiteLayout({ children }: { children: ReactNode }) {
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
