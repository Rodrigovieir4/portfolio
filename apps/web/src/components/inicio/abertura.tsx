import { profile } from "@portfolio/content"
import { getTranslations } from "next-intl/server"
import Image from "next/image"

import { Fumaca } from "./fumaca"
import { Laser } from "./laser"
import { NomeAbertura } from "./nome-abertura"

// Roda antes da pintura: com movimento permitido, o conteúdo da abertura
// nasce escondido e só aparece quando o laser bate no chão (movimento.tsx).
// Sem JavaScript o script não roda e tudo aparece normalmente.
const ESCONDER_ATE_O_IMPACTO = `if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.abertura=""`

async function Topo() {
  const t = await getTranslations("inicio.abertura")

  return (
    <div
      data-revelar
      className="relative z-10 flex flex-wrap items-start justify-between gap-6"
    >
      <div className="flex max-w-md flex-col gap-4">
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

/**
 * O palco: o nome gigante atrás e o retrato recortado na frente. Nada fica
 * por cima do retrato; o nome passa por trás dele. No computador o palco
 * ocupa a abertura inteira e os textos ficam nas laterais, fora da foto.
 */
async function Palco() {
  const t = await getTranslations("inicio.abertura")
  const [nome, sobrenome] = profile.shortName.split(" ")

  return (
    <div className="relative max-md:min-h-80 max-md:flex-1 md:absolute md:inset-0">
      <div
        data-revelar
        data-nome
        className="absolute inset-x-0 top-0 md:top-1/2 md:-translate-y-1/2"
      >
        <NomeAbertura
          completo={profile.shortName}
          nome={nome ?? ""}
          sobrenome={sobrenome ?? ""}
        />
      </div>
      <Image
        src="/images/retrato-cabeca.webp"
        alt={t("retratoAlt")}
        width={1896}
        height={2400}
        quality={92}
        priority
        data-revelar
        data-mov="retrato"
        sizes="(min-width: 768px) 45vw, 100vw"
        className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 md:h-5/6"
      />
      {/* Chão do laser: a linha onde a foto termina. O feixe pousa aqui e não
          desce além; no celular a foto acaba antes do fim da tela. */}
      <div data-chao aria-hidden className="absolute inset-x-0 bottom-0" />
    </div>
  )
}

async function Chamada() {
  const t = await getTranslations("inicio.abertura")

  return (
    <div
      data-revelar
      className="relative z-10 flex flex-wrap items-end justify-between gap-6"
    >
      <p
        data-mov="abertura"
        className="max-w-xs text-pretty text-muted-foreground md:text-lg"
      >
        {t("subtitulo")}
      </p>
      <div data-mov="abertura" className="flex items-center gap-6">
        <a
          href="#contato"
          data-mov="cta"
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

/**
 * Abertura do início.
 *
 * Camadas, de trás para a frente: laser e fumaça, nome gigante, retrato e,
 * nas laterais, os textos. O laser desce ao carregar; quando bate no fim do
 * hero, o conteúdo aparece.
 */
export function Abertura() {
  return (
    <section
      aria-labelledby="abertura-titulo"
      className="relative isolate flex min-h-dvh flex-col overflow-hidden"
    >
      <script dangerouslySetInnerHTML={{ __html: ESCONDER_ATE_O_IMPACTO }} />
      <Laser />
      <Fumaca />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between gap-6 px-4 pt-28 pb-10 lg:px-8">
        <Topo />
        <Palco />
        <Chamada />
      </div>
    </section>
  )
}
