import { type Locale, certifications, t as traduzir } from "@portfolio/content"
import { getLocale, getTranslations } from "next-intl/server"

import { CertificadosGrade } from "./certificados-grade"
import { Comando } from "./comando"

export async function Certificados() {
  const t = await getTranslations("inicio.certificados")
  const c = await getTranslations("inicio.comandos")
  const locale = (await getLocale()) as Locale
  const itens = certifications.map((item) => ({
    ano: item.issued?.slice(0, 4) ?? "",
    categoria: item.category,
    emissor: item.issuer,
    id: item.id,
    link: item.file ?? item.credentialUrl ?? null,
    nome: traduzir(item.name, locale),
  }))
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
          categorias: Object.fromEntries(
            categorias.map((c) => [c, t(`categorias.${c}`)]),
          ),
          titulo: t("titulo"),
          todos: t("todos"),
        }}
      />
    </section>
  )
}
