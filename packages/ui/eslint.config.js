import { legado } from "@portfolio/eslint-config/legado"
import { nextConfig } from "@portfolio/eslint-config/next"

export default [
  ...nextConfig({
    tailwindEntryPoint: "./src/styles/globals.css",
    app: false,
  }),
  {
    // Pacote de biblioteca, não é um app Next: sem pages/ nem app/.
    rules: { "@next/next/no-html-link-for-pages": "off" },
  },
  {
    // Código gerado pelo shadcn: fica como a CLI entrega, para poder atualizar
    // (DESIGN-SYSTEM, seção 5.5).
    files: ["src/components/**", "src/hooks/**"],
    rules: {
      "@typescript-eslint/max-params": "off",
      "better-tailwindcss/no-unknown-classes": [
        "error",
        { ignore: ["^cn-", "^origin-top-center$", "^toaster$"] },
      ],
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
      "react-hooks/set-state-in-effect": "off",
    },
  },
  legado([
    "src/components/interactive.tsx",
    "src/components/primitives.tsx",
    "src/components/smooth-scroll.tsx",
    "src/components/text.tsx",
  ]),
]
