import { LOCALE_META, profile, type Locale } from '@portfolio/content';
import { Cursor, Grain, ScrollProgress, SmoothScroll } from '@portfolio/ui';
import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { routing } from '@/i18n/routing';
import { fontVariables } from '@/lib/fonts';
import { siteUrl } from '@/lib/site';

import '../globals.css';

/** Pre-renderiza os tres idiomas no build. Nenhum visitante espera por SSR. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t('title'),
      template: `%s · ${profile.shortName}`,
    },
    description: t('description'),
    applicationName: profile.name,
    authors: [{ name: profile.name, url: siteUrl }],
    creator: profile.name,
    keywords: [
      'desenvolvedor full-stack',
      'full-stack developer',
      'Java',
      'Spring Boot',
      'Python',
      'React',
      'Next.js',
      profile.name,
    ],
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      // Diz ao buscador onde estao as outras traducoes desta mesma pagina.
      languages: Object.fromEntries(
        routing.locales.map((item) => [LOCALE_META[item].hreflang, `${siteUrl}/${item}`]),
      ),
    },
    openGraph: {
      type: 'profile',
      locale: LOCALE_META[locale as Locale]?.hreflang ?? 'pt-BR',
      url: `${siteUrl}/${locale}`,
      siteName: profile.name,
      title: t('title'),
      description: t('description'),
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Sem isto o next-intl trata a rota como dinamica e o build deixa de ser
  // estatico, o que descartaria o pre-render de generateStaticParams.
  setRequestLocale(locale);

  return (
    <html lang={LOCALE_META[locale].hreflang} className={fontVariables} suppressHydrationWarning>
      <body className="min-h-dvh bg-void text-ink antialiased">
        <NextIntlClientProvider>
          <SmoothScroll>
            <ScrollProgress />
            <Grain />
            <Cursor />

            <Header />
            <main id="conteudo">{children}</main>
            <Footer />
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
