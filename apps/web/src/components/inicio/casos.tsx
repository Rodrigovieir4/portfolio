import { type Locale, cases } from "@portfolio/content"
import { getLocale, getTranslations } from "next-intl/server"

import { CartaoCaso } from "@/components/casos/cartao-caso"
import { Link } from "@/i18n/navigation"

export async function Casos() {
  const t = await getTranslations("inicio.casos")
  const locale = (await getLocale()) as Locale

  return (
    <section id="casos" className="py-24 lg:py-32">
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-4 lg:px-8">
        <h2 className="text-5xl font-semibold tracking-tight md:text-6xl">
          {t("titulo")}
        </h2>
        <p className="font-mono text-xs text-muted-foreground">
          {String(cases.length).padStart(2, "0")} · {t("dica")} →
        </p>
      </div>
      <ol className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden px-4 pb-6 lg:px-8">
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
      <div className="mx-auto mt-6 max-w-7xl px-4 lg:px-8">
        <Link
          href="/casos"
          className="font-mono text-sm underline underline-offset-4"
        >
          {t("verTodos")} →
        </Link>
      </div>
    </section>
  )
}
