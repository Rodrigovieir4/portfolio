import next from 'eslint-config-next';

import { reactConfig } from './react.js';

/** Configuracao do app Next.js: regras React mais as do proprio framework. */
export const nextConfig = [
  ...reactConfig,
  ...next,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];

export default nextConfig;
