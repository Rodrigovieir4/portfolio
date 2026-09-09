import type { ReactNode } from 'react';

/**
 * Layout raiz vazio, de proposito.
 *
 * As tags html e body ficam em [locale]/layout.tsx, porque so la se sabe qual
 * idioma declarar no atributo lang. O Next exige um layout na raiz, entao este
 * apenas repassa os filhos.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
