import { setRequestLocale } from "next-intl/server"

import { Abertura } from "@/components/inicio/abertura"
import { Casos } from "@/components/inicio/casos"
import { Certificados } from "@/components/inicio/certificados"
import { Contato } from "@/components/inicio/contato"
import { Numeros } from "@/components/inicio/numeros"
import { Projetos } from "@/components/inicio/projetos"
import { Sobre } from "@/components/inicio/sobre"
import { Stack } from "@/components/inicio/stack"
import { Trajetoria } from "@/components/inicio/trajetoria"
import { routing } from "@/i18n/routing"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

/**
 * Página inicial do redesenho (24/11/2026), seções na ordem escolhida pelo
 * Rodrigo. Referência visual de cada uma em docs/estetica/secoes.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Abertura />
      <Sobre />
      <Casos />
      <Numeros />
      <Stack />
      <Trajetoria />
      <Certificados />
      <Projetos />
      <Contato />
    </>
  )
}
