import { profile, t as translate, type Locale } from '@portfolio/content';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { GameView } from '@/components/game/game-view';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'game' });
  return {
    title: t('metaTitle'),
    // Protótipo: fora do índice até a versão com arte substituir o site.
    robots: { index: false, follow: true },
  };
}

/**
 * Página do jogo, em tela cheia e fora da moldura do site.
 *
 * O resumo em texto abaixo do jogo é renderizado no servidor. Buscador e
 * navegador sem JavaScript não enxergam o canvas, mas leem isto.
 */
export default async function GamePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <h1 className="sr-only">{profile.name}</h1>
      <p className="sr-only">{translate(profile.tagline, locale as Locale)}</p>
      <GameView />
    </main>
  );
}
