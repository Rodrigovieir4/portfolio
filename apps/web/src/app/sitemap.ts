import { projects } from '@portfolio/content';
import type { MetadataRoute } from 'next';

import { routing } from '@/i18n/routing';
import { siteUrl } from '@/lib/site';

/**
 * Sitemap com as tres versoes de idioma de cada pagina.
 *
 * O campo `alternates.languages` diz ao buscador que /pt, /en e /es sao
 * traducoes da mesma pagina, e nao conteudo duplicado. Sem isso as versoes
 * competem entre si no indice.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  function alternates(path: (locale: string) => string) {
    return {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, `${siteUrl}${path(locale)}`]),
      ),
    };
  }

  const projectSegment: Record<string, string> = {
    pt: 'projetos',
    en: 'projects',
    es: 'proyectos',
  };

  const home: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 1,
    alternates: alternates((l) => `/${l}`),
  }));

  const projectPages: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${siteUrl}/${locale}/${projectSegment[locale]}/${project.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: project.featured ? 0.8 : 0.6,
      alternates: alternates((l) => `/${l}/${projectSegment[l]}/${project.slug}`),
    })),
  );

  return [...home, ...projectPages];
}
