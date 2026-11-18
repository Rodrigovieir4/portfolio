import { nextConfig } from "@portfolio/eslint-config/next"

export default [
  ...nextConfig({ tailwindEntryPoint: "./src/app/globals.css" }),
  {
    /*
     * Código de terceiro, trazido para dentro do repositório.
     *
     * src/components/ui vem do gerador do shadcn/ui e src/components/reactbits
     * vem do React Bits. Os dois são reescritos quando o componente é
     * atualizado pelo CLI, então corrigir estilo aqui é trabalho que se perde
     * na próxima atualização. É a mesma lista que o DESIGN-SYSTEM libera para
     * o código gerado em packages/ui.
     */
    files: ["src/components/ui/**", "src/components/reactbits/**"],
    rules: {
      "@typescript-eslint/max-params": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
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
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      // O LogoLoop usa <img> quando o item traz src. O nosso uso passa node,
      // então nenhuma imagem chega a ser renderizada por esse caminho.
      "@next/next/no-img-element": "off",
    },
  },
  {
    // Os testes leem window.__game, que só existe em modo de depuração e não
    // tem tipo publicado. Tipar isso seria cerimônia para código de teste.
    files: ["e2e/**"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
]
