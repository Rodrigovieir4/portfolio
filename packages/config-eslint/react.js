import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

import { baseConfig } from './base.js';

/** Configuracao para pacotes React que nao sao o app Next. */
export const reactConfig = [
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { react, 'react-hooks': reactHooks },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // O transform automatico do JSX dispensa React no escopo.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // R3F usa props desconhecidas pelo DOM em elementos three.
      'react/no-unknown-property': 'off',
    },
  },
];

export default reactConfig;
