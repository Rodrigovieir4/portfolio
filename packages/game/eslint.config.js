import { legado } from "@portfolio/eslint-config/legado"
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
  {
    // O laço de quadros e a física mutam vetores e objetos do three que
    // recebem, de propósito: alocar um objeto novo por quadro custa coleta de
    // lixo. Reatribuir o próprio parâmetro continua proibido.
    rules: { "no-param-reassign": ["error", { props: false }] },
  },
  legado(["src/**"]),
]
