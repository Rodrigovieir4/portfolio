import type { MetadataRoute } from "next"

import { cases, ideas, projects } from "@portfolio/content"

import { alternativas } from "@/i18n/caminho"
import { type AppPathname, routing } from "@/i18n/routing"

type Entrada = {
  rota: AppPathname
  slug?: string
  prioridade: number
  frequencia: "monthly" | "yearly"
  data?: string
}

/**
 * Sitemap com as três versões de idioma de cada página.
 *
 * O campo `alternates.languages` diz ao buscador que /pt, /en e /es são
 * traduções da mesma página, e não conteúdo duplicado. Sem isso as versões
 * competem entre si no índice.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date()
  const entradas: Entrada[] = [
    { frequencia: "monthly", prioridade: 1, rota: "/" },
    { frequencia: "monthly", prioridade: 0.8, rota: "/casos" },
    { frequencia: "monthly", prioridade: 0.8, rota: "/projetos" },
    { frequencia: "monthly", prioridade: 0.8, rota: "/sobre" },
    { frequencia: "monthly", prioridade: 0.6, rota: "/ideias" },
    ...projects.map((p) => ({
      frequencia: "monthly" as const,
      prioridade: p.featured ? 0.8 : 0.6,
      rota: "/projetos/[slug]" as const,
      slug: p.slug,
    })),
    ...cases.map((c) => ({
      data: c.publishedAt,
      frequencia: "yearly" as const,
      prioridade: 0.7,
      rota: "/casos/[slug]" as const,
      slug: c.slug,
    })),
    ...ideas.map((i) => ({
      data: i.publishedAt,
      frequencia: "yearly" as const,
      prioridade: 0.6,
      rota: "/ideias/[slug]" as const,
      slug: i.slug,
    })),
  ]

  return entradas.flatMap((e) =>
    routing.locales.map((locale) => ({
      alternates: {
        languages: alternativas(e.rota, { locale, slug: e.slug }).languages,
      },
      changeFrequency: e.frequencia,
      lastModified: e.data ? new Date(e.data) : agora,
      priority: e.prioridade,
      url: alternativas(e.rota, { locale, slug: e.slug }).canonical,
    })),
  )
}
