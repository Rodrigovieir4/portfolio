import type { NextConfig } from "next"

import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

const config: NextConfig = {
  reactStrictMode: true,

  // Os pacotes do monorepo sao publicados como TypeScript cru, sem passo de
  // build proprio. Isso mantem o "ir ate a definicao" funcionando no editor e
  // elimina a etapa de compilar biblioteca antes de rodar o app.
  transpilePackages: [
    "@portfolio/game",
    "@portfolio/ui",
    "@portfolio/gl",
    "@portfolio/content",
  ],

  images: {
    formats: ["image/avif", "image/webp"],
    // 92 só para o retrato da abertura, onde pele e cabelo pedem nitidez;
    // o resto fica no padrão de 75.
    qualities: [75, 92],
  },

  experimental: {
    // three e drei sao enormes e cheios de reexportacao. Sem isso, importar um
    // helper arrasta a biblioteca inteira para o bundle.
    optimizePackageImports: ["lucide-react", "motion", "@react-three/drei"],
  },
}

export default withNextIntl(config)
