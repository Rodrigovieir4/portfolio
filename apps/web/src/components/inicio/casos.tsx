import { type Locale, cases } from "@portfolio/content"
import { getLocale, getTranslations } from "next-intl/server"

import { CartaoCaso } from "@/components/casos/cartao-caso"
import { Link } from "@/i18n/navigation"

import { Comando } from "./comando"

export async function Casos() {
  const t = await getTranslations("inicio.casos")
  const c = await getTranslations("inicio.comandos")
  const locale = (await getLocale()) as Locale

  return (
    <section id="casos">
      {/* O GSAP fixa e embrulha este div, não a seção: se embrulhasse um filho
          direto do <main>, o React não acharia o nó ao trocar de página. */}
      <div data-mov="arco" className="py-24 lg:py-32">
        <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-6 px-4 lg:px-8">
          <div>
            <Comando texto={c("casos")} className="mb-4" />
            <h2
              data-mov="subir"
              className="text-5xl font-semibold tracking-tight md:text-6xl"
            >
              {t("titulo")}
            </h2>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            {String(cases.length).padStart(2, "0")} ·{" "}
            <span className="lg:hidden">{t("dica")}</span>
            <span className="max-lg:hidden">{t("dicaLargo")}</span> →
          </p>
        </div>
        <ol
          data-mov="arco-trilho"
          className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden px-4 pb-6 lg:px-8"
        >
          {cases.map((caso, indice) => (
            <li key={caso.slug} className="w-72 shrink-0 snap-start md:w-80">
              <CartaoCaso
                caso={caso}
                destaque={indice === 0}
                emBreve={t("emBreve")}
                locale={locale}
              />
            </li>
          ))}
        </ol>
        <div className="mx-auto mt-6 w-full max-w-7xl px-4 lg:px-8">
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
