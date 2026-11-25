/**
 * URL canônica do site.
 *
 * A URL vem do ambiente porque muda entre preview e producao. Em preview a
 * Vercel expoe VERCEL_URL, e usar essa em vez do dominio final evita que o
 * link de OG de um deploy de teste aponte para producao.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000")
