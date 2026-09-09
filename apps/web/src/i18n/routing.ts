import { defineRouting } from 'next-intl/routing';

/**
 * Roteamento por idioma.
 *
 * `localePrefix: 'always'` deixa toda pagina com o idioma visivel na URL
 * (/pt, /en, /es). Um pouco mais verboso do que esconder o idioma padrao, mas
 * cada versao ganha URL canonica propria, o que e o que faz o Google indexar as
 * tres em vez de tratar duas como duplicata.
 *
 * Os caminhos sao traduzidos: quem navega em portugues ve /pt/projetos e quem
 * navega em ingles ve /en/projects. O componente Link resolve o pathname certo
 * sozinho, entao o codigo continua referenciando uma unica rota logica.
 */
export const routing = defineRouting({
  locales: ['pt', 'en', 'es'],
  defaultLocale: 'pt',
  localePrefix: 'always',
  localeDetection: true,
  pathnames: {
    '/': '/',
    '/projetos': {
      pt: '/projetos',
      en: '/projects',
      es: '/proyectos',
    },
    '/projetos/[slug]': {
      pt: '/projetos/[slug]',
      en: '/projects/[slug]',
      es: '/proyectos/[slug]',
    },
  },
});

export type AppPathname = keyof typeof routing.pathnames;
