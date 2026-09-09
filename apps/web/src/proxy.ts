import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

/**
 * Proxy de borda (o antigo middleware, renomeado no Next 16).
 *
 * Detecta o idioma e redireciona a raiz para a versao correta: quem chega em
 * "/" cai em /pt, /en ou /es conforme o cabecalho Accept-Language, antes de
 * qualquer renderizacao e sem piscar a tela.
 */
export default createMiddleware(routing);

export const config = {
  // Ignora rotas de API, arquivos internos do Next e qualquer caminho que
  // contenha um ponto, que na pratica e arquivo estatico.
  matcher: ['/((?!api|_next|_vercel|.*[.].*).*)'],
};
