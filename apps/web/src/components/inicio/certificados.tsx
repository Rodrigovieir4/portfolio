import { type Locale, certifications, t as traduzir } from "@portfolio/content"
import { getLocale, getTranslations } from "next-intl/server"

import { CertificadosGrade } from "./certificados-grade"
import { Comando } from "./comando"

/**
 * Ordem na tela (pedido do Rodrigo, 27/11): o inglês primeiro, depois a São
 * Judas e a Rocketseat por último. Os filtros seguem a mesma ordem.
 */
const ORDEM = ["idioma", "academico", "curso"]
const lugar = (categoria: string) =>
  ORDEM.includes(categoria) ? ORDEM.indexOf(categoria) : ORDEM.length

export async function Certificados() {
  const t = await getTranslations("inicio.certificados")
  const c = await getTranslations("inicio.comandos")
  const locale = (await getLocale()) as Locale
  const itens = certifications.map((item) => ({
    ano: item.issued?.slice(0, 4) ?? "",
    // A capa tem o nome do PDF: x.pdf vira capas/x.webp, na mesma pasta.
    capa:
      item.file
        ?.replace("/certificados/", "/certificados/capas/")
        .replace(/.pdf$/, ".webp") ?? null,
    categoria: item.category,
    emissor: item.issuer,
    id: item.id,
    link: item.file ?? item.credentialUrl ?? null,
    nome: traduzir(item.name, locale),
  }))
  itens.sort((a, b) => lugar(a.categoria) - lugar(b.categoria))
  const categorias = [...new Set(itens.map((item) => item.categoria))]

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-32">
      <Comando texto={c("certificados")} className="mb-4" />
      <h2
        data-mov="subir"
        className="text-5xl font-semibold tracking-tight md:text-6xl"
      >
        {t("titulo")}
      </h2>
      <CertificadosGrade
        itens={itens}
        rotulos={{
          abrir: t("abrir"),
          anterior: t("anterior"),
          categorias: Object.fromEntries(
            categorias.map((c) => [c, t(`categorias.${c}`)]),
          ),
          pagina: t("pagina"),
          paginacao: t("paginacao"),
          proxima: t("proxima"),
          titulo: t("titulo"),
          todos: t("todos"),
        }}
      />
    </section>
  )
}
