/** Os três idiomas atendidos pelo portfólio. */
export const LOCALES = ['pt', 'en', 'es'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'pt';

/**
 * Todo campo de texto visível ao usuário é um objeto com os três idiomas.
 * O tipo obriga a traduzir: esquecer o espanhol vira erro de compilação,
 * não um buraco em produção.
 */
export type Localized<T = string> = Record<Locale, T>;

export const LOCALE_META: Record<Locale, { label: string; flag: string; hreflang: string }> = {
  pt: { label: 'Português', flag: '🇧🇷', hreflang: 'pt-BR' },
  en: { label: 'English', flag: '🇺🇸', hreflang: 'en-US' },
  es: { label: 'Español', flag: '🇪🇸', hreflang: 'es-ES' },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Lê um campo localizado com queda para o idioma padrão. */
export function t<T>(field: Localized<T>, locale: Locale): T {
  return field[locale] ?? field[DEFAULT_LOCALE];
}
