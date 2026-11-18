import { nextConfig } from "@portfolio/eslint-config/next"

export default [
  ...nextConfig({
    tailwindEntryPoint: "../../apps/web/src/app/globals.css",
    app: false,
  }),
  {
    // Pacote de biblioteca, não é um app Next: sem pages/ nem app/.
    rules: { "@next/next/no-html-link-for-pages": "off" },
  },
]
