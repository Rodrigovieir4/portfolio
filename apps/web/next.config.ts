import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const config: NextConfig = {
  reactStrictMode: true,

  // Os pacotes do monorepo sao publicados como TypeScript cru, sem passo de
  // build proprio. Isso mantem o "ir ate a definicao" funcionando no editor e
  // elimina a etapa de compilar biblioteca antes de rodar o app.
  transpilePackages: [
    '@portfolio/ui',
    '@portfolio/gl',
    '@portfolio/content',
    '@portfolio/config-tailwind',
  ],

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  experimental: {
    // three e drei sao enormes e cheios de reexportacao. Sem isso, importar um
    // helper arrasta a biblioteca inteira para o bundle.
    optimizePackageImports: ['lucide-react', 'motion', '@react-three/drei'],
  },
};

export default withNextIntl(config);
