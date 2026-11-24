import { getTranslations } from "next-intl/server"
import Image from "next/image"

export async function Abertura() {
  const t = await getTranslations("inicio.abertura")

  return (
    <section
      aria-labelledby="abertura-titulo"
      className="relative overflow-hidden brilho-vinho"
    >
      <div className="mx-auto grid min-h-dvh max-w-7xl items-end gap-10 px-4 pt-24 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className="flex flex-col gap-6 pb-10 lg:pb-0">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            {t("rotulo")}
          </p>
          <h1
            id="abertura-titulo"
            className="text-5xl font-semibold tracking-tight text-balance md:text-7xl"
          >
            {t("tituloA")} <em>{t("tituloB")}</em>
          </h1>
          <p className="max-w-xl text-lg text-pretty text-muted-foreground">
            {t("subtitulo")}
          </p>
          <p className="text-sm">{t("disponivel")}</p>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="#contato"
              className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-transform active:scale-95"
            >
              {t("falar")}
            </a>
            <a href="#casos" className="underline underline-offset-4">
              {t("casos")}
            </a>
          </div>
        </div>
        <Image
          src="/images/retrato.webp"
          alt={t("retratoAlt")}
          width={1200}
          height={1607}
          priority
          sizes="(min-width: 1024px) 40vw, 90vw"
          className="mx-auto w-full max-w-md self-end mask-t-from-85% mask-x-from-75% mask-b-from-70% lg:max-w-lg"
        />
      </div>
    </section>
  )
}
