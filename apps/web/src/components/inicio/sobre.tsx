import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"

export async function Sobre() {
  const t = await getTranslations("inicio.sobre")

  return (
    <section
      id="sobre"
      className="mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-40"
    >
      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
        {t("rotulo")}
      </p>
      <p
        data-mov="leitura"
        className="mt-8 max-w-5xl text-3xl font-medium tracking-tight text-balance md:text-5xl"
      >
        {t("texto")} <span className="text-vinho-claro">{t("destaque")}</span>
      </p>
      <p className="mt-8 max-w-3xl text-xl text-pretty text-muted-foreground">
        {t("ia")}
      </p>
      <div className="mt-12 flex justify-end">
        <Link
          href="/sobre"
          className="font-mono text-sm underline underline-offset-4"
        >
          {t("mais")} →
        </Link>
      </div>
    </section>
  )
}
