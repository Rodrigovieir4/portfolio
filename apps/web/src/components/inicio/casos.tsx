import { type Locale, cases, t as traduzir } from "@portfolio/content"
import { getLocale, getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"

import { Comando } from "./comando"
import { SqueezeCasos } from "./squeeze-casos"

/**
 * Casos no "Squeeze Carousel" (squeeze-casos.tsx): um painel aberto e os
 * outros espremidos em faixas. No computador, a rolagem dá uma travadinha na
 * seção (movimento.tsx).
 */
export async function Casos() {
  const t = await getTranslations("inicio.casos")
  const c = await getTranslations("inicio.comandos")
  const locale = (await getLocale()) as Locale

  return (
    <section id="casos">
      {/* O GSAP prende este div, não a seção: se prendesse um filho direto do
          <main>, o React não acharia o nó ao trocar de página. */}
      <div data-mov="arco" className="py-24 lg:py-32">
        <SqueezeCasos
          cabecalho={
            <div>
              <Comando texto={c("casos")} className="mb-4" />
              <h2
                data-mov="subir"
                className="text-5xl font-semibold tracking-tight md:text-6xl"
              >
                {t("titulo")}
              </h2>
            </div>
          }
          casos={cases.map((caso) => ({
            resumo: traduzir(caso.summary, locale),
            slug: caso.slug,
            stack: caso.stack.slice(0, 2).join(" · "),
            titulo: traduzir(caso.title, locale),
          }))}
          rotulos={{
            anterior: t("anterior"),
            ler: t("ler"),
            proximo: t("proximo"),
          }}
        />
        <div className="mx-auto mt-10 max-w-7xl px-4 lg:px-8">
          <Link
            href="/casos"
            className="font-mono text-sm underline underline-offset-4"
          >
            {t("verTodos")} →
          </Link>
        </div>
      </div>
    </section>
  )
}
