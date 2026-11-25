import { profile } from "@portfolio/content"
import { getTranslations } from "next-intl/server"
import Image from "next/image"

import { Fumaca } from "./fumaca"
import { NomeInterativo } from "./nome-interativo"

/**
 * Abertura do início (versão interativa de 25/11/2026).
 *
 * Camadas, de trás para a frente: brilho vinho, retrato, fumaça que segue o
 * cursor e o conteúdo. O nome gigante engrossa perto do mouse; no celular
 * ele quebra em duas linhas.
 */
async function Topo() {
  const t = await getTranslations("inicio.abertura")

  return (
    <div className="flex flex-wrap items-start justify-between gap-6">
      <div className="flex max-w-xl flex-col gap-4">
        <p
          data-mov="abertura"
          className="font-mono text-xs tracking-widest text-vinho-claro uppercase"
        >
          {t("rotulo")}
        </p>
        <h1
          id="abertura-titulo"
          data-mov="titulo"
          className="text-3xl font-semibold tracking-tight text-balance md:text-5xl"
        >
          {t("tituloA")} <em>{t("tituloB")}</em>
        </h1>
      </div>
      <p
        data-mov="abertura"
        className="flex items-center gap-2 font-mono text-xs text-muted-foreground max-md:hidden"
      >
        <span aria-hidden className="size-2 rounded-full bg-vinho-claro" />
        {t("disponivel")}
      </p>
    </div>
  )
}

async function Chamada() {
  const t = await getTranslations("inicio.abertura")

  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <p
        data-mov="abertura"
        className="max-w-md text-pretty text-muted-foreground md:text-lg"
      >
        {t("subtitulo")}
      </p>
      <div data-mov="abertura" className="flex items-center gap-6">
        <a
          href="#contato"
          className="rounded-full bg-vinho px-6 py-3 font-medium text-foreground transition-transform active:scale-95"
        >
          {t("falar")} →
        </a>
        <a href="#casos" className="underline underline-offset-4">
          {t("casos")}
        </a>
      </div>
    </div>
  )
}

export async function Abertura() {
  const t = await getTranslations("inicio.abertura")
  const [nome, sobrenome] = profile.shortName.split(" ")

  return (
    <section
      aria-labelledby="abertura-titulo"
      className="relative isolate flex min-h-dvh flex-col overflow-hidden brilho-vinho"
    >
      <Image
        src="/images/retrato.webp"
        alt={t("retratoAlt")}
        width={1200}
        height={1607}
        priority
        data-mov="retrato"
        sizes="(min-width: 768px) 45vw, 90vw"
        className="absolute bottom-0 left-1/2 -z-10 h-1/2 w-auto max-w-none -translate-x-1/2 mask-t-from-80% mask-x-from-70% mask-b-from-75% md:h-11/12"
      />
      <Fumaca />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 pt-28 pb-10 md:justify-between lg:px-8">
        <Topo />

        <div className="texto-nome">
          <div className="max-md:hidden">
            <NomeInterativo linhas={[profile.shortName.toUpperCase()]} />
          </div>
          <div className="md:hidden">
            <NomeInterativo linhas={[nome ?? "", sobrenome ?? ""]} />
          </div>
        </div>

        <div className="max-md:mt-auto">
          <Chamada />
        </div>
      </div>
    </section>
  )
}
