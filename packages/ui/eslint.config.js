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
  legado([
    "src/components/interactive.tsx",
    "src/components/primitives.tsx",
    "src/components/smooth-scroll.tsx",
    "src/components/text.tsx",
  ]),
]
