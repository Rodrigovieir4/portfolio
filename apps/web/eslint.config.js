import { legado } from "@portfolio/eslint-config/legado"
import { nextConfig } from "@portfolio/eslint-config/next"

export default [
  ...nextConfig({
    tailwindEntryPoint: "../../packages/ui/src/styles/globals.css",
  }),
  {
    /*
     * Código de terceiro, trazido para dentro do repositório.
     *
     * src/components/ui vem do gerador do shadcn/ui e é reescrito quando o
     * componente é atualizado pelo CLI, então corrigir estilo aqui é trabalho
     * que se perde na próxima atualização. É a mesma regra que o DESIGN-SYSTEM
     * aplica ao código gerado em packages/ui.
     */
    files: ["src/components/ui/**"],
    rules: {
      "@stylistic/max-len": "off",
      "@typescript-eslint/max-params": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "better-tailwindcss/no-restricted-classes": "off",
      eqeqeq: "off",
      "jsx-a11y/anchor-has-content": "off",
      "jsx-a11y/anchor-is-valid": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/heading-has-content": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/no-noninteractive-tabindex": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "max-lines-per-function": "off",
      "no-nested-ternary": "off",
      "no-param-reassign": "off",
      "no-restricted-syntax": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    // O cartão de compartilhamento é desenhado pelo ImageResponse, que não
    // lê classes: só o atributo style. Ali o estilo inline é a única via.
    files: ["src/app/**/opengraph-image.tsx"],
    rules: { "no-restricted-syntax": "off" },
  },
  {
    // Os testes leem window.__game, que só existe em modo de depuração e não
    // tem tipo publicado. Tipar isso seria cerimônia para código de teste.
    files: ["e2e/**"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
  // O currículo vai ser redesenhado e o jogo do quarto vai ser substituído:
  // estes arquivos saem da lista quando forem reescritos.
  legado([
    "e2e/helpers.ts",
    "scripts/gerar-poster.mjs",
    "src/components/game/**",
    "src/i18n/request.ts",
  ]),
]
