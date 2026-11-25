import { notFound } from "next/navigation"

/**
 * Qualquer caminho desconhecido dentro de um idioma cai aqui e vira a 404
 * traduzida de [locale]/not-found.tsx. Sem esta rota, o Next mostra a 404
 * global, que não sabe o idioma.
 */
export default function CaminhoDesconhecido() {
  notFound()
}
