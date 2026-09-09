import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

/**
 * Carrega o dicionario da requisicao.
 *
 * O import dinamico faz cada idioma virar um chunk separado, entao quem abre a
 * versao em portugues nunca baixa os textos em espanhol.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'America/Sao_Paulo',
  };
});
