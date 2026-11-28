import { type Locale, profile, t as traduzir } from "@portfolio/content"
import {
  GithubIcon,
  LinkedinIcon,
  StatusDot,
  WhatsappIcon,
} from "@portfolio/ui"
import { Button } from "@portfolio/ui/components/button"
import { Check, Download, Mail } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import { Comando } from "./comando"

const canal = (nome: string) => profile.socials.find((s) => s.platform === nome)
const WHATSAPP = canal("whatsapp")

/** Os outros canais, compactos, embaixo do botão principal. */
const SECUNDARIOS = [
  { icone: <Mail className="size-4" />, nome: "E-mail", rede: canal("email") },
  {
    icone: <LinkedinIcon className="size-4" />,
    nome: "LinkedIn",
    rede: canal("linkedin"),
  },
  {
    icone: <GithubIcon className="size-4" />,
    nome: "GitHub",
    rede: canal("github"),
  },
]

type Item = [titulo: string, texto: string]

/**
 * Faixa gigante em contorno, de ponta a ponta da tela, fechando a página;
 * rola devagar como as da stack. Decorativa: o leitor de tela não lê.
 */
function FaixaFundo({ texto }: { texto: string }) {
  const repetido = Array.from({ length: 4 }, () => `${texto} · `).join("")
  return (
    <div aria-hidden className="pointer-events-none overflow-hidden opacity-15">
      <div className="flex w-max motion-safe:animate-faixa">
        {[0, 1].map((copia) => (
          <span
            key={copia}
            className="pr-8 text-9xl font-semibold tracking-tight whitespace-nowrap texto-contorno-claro uppercase"
          >
            {repetido}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Credibilidade, à esquerda: o texto, as garantias com check e três números
 * da carreira (os mesmos da seção de números).
 */
function Credibilidade({
  garantias,
  numeros,
  texto,
}: {
  garantias: string[]
  numeros: Item[]
  texto: string
}) {
  return (
    <div className="flex flex-col gap-10 lg:col-span-6">
      <p className="max-w-lg text-xl text-pretty">{texto}</p>
      <ul className="flex flex-col gap-3">
        {garantias.map((garantia) => (
          <li key={garantia} className="flex items-center gap-3">
            <span className="grid size-6 place-items-center rounded-full bg-vinho/30 text-vinho-claro">
              <Check className="size-3.5" />
            </span>
            {garantia}
          </li>
        ))}
      </ul>
      <dl className="grid grid-cols-3 gap-6 border-t border-border pt-8">
        {numeros.map(([valor, legenda]) => (
          <div
            key={legenda}
            className="flex flex-col-reverse justify-end gap-2"
          >
            <dt className="font-mono text-xs text-pretty text-muted-foreground">
              {legenda}
            </dt>
            <dd className="font-numeros text-5xl leading-none">{valor}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

const PILULA =
  "flex items-center justify-center gap-2 rounded-full border border-border px-3 py-2 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"

/** E-mail, LinkedIn e GitHub numa linha, e o currículo logo embaixo. */
function OutrosCanais({
  curriculo,
  locale,
}: {
  curriculo: string
  locale: Locale
}) {
  return (
    <div className="flex flex-col gap-4">
      <ul className="grid grid-cols-3 gap-2 text-sm">
        {SECUNDARIOS.map(({ icone, nome, rede }) => (
          <li key={nome}>
            <a
              href={rede?.url}
              target={nome === "E-mail" ? undefined : "_blank"}
              rel="noreferrer"
              className={PILULA}
            >
              {icone}
              {nome}
            </a>
          </li>
        ))}
      </ul>
      <a
        href={traduzir(profile.resumeUrl, locale)}
        download
        className="flex items-center gap-2 self-center font-mono text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
      >
        <Download className="size-3.5" />
        {curriculo}
      </a>
    </div>
  )
}

/**
 * Fechamento, à direita: os três passos de como a gente fecha, o botão
 * principal (WhatsApp, o caminho mais curto) e os outros canais.
 */
function Fechamento({
  curriculo,
  falar,
  locale,
  passos,
  titulo,
}: {
  curriculo: string
  falar: string
  locale: Locale
  passos: Item[]
  titulo: string
}) {
  return (
    <div className="flex flex-col gap-8 lg:col-span-5 lg:col-start-8 lg:border-l lg:border-border lg:pl-10">
      <h3 className="font-mono text-xs text-vinho-claro uppercase">{titulo}</h3>
      <ol className="flex flex-col gap-6">
        {passos.map(([nome, texto], indice) => (
          <li key={nome} className="flex gap-4">
            <span className="font-mono text-sm text-muted-foreground">
              {String(indice + 1).padStart(2, "0")}
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-semibold">{nome}</span>
              <span className="text-sm text-pretty text-muted-foreground">
                {texto}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <Button asChild size="cta-lg" className="w-full">
        <a
          href={WHATSAPP?.url ?? `mailto:${profile.email}`}
          target="_blank"
          rel="noreferrer"
        >
          <WhatsappIcon className="size-5" />
          {falar}
        </a>
      </Button>
      <OutrosCanais curriculo={curriculo} locale={locale} />
    </div>
  )
}

/**
 * O fim da página, solto e com cara de "vamos fechar negócio" (pedido do
 * Rodrigo, 27/11). O título enorme em duas linhas, a primeira cheia e a
 * segunda em contorno, sobe letra por letra (secoes.ts) com um brilho vinho
 * difuso atrás. Embaixo, a credibilidade de um lado e o fechamento do outro;
 * fecha com uma faixa gigante em contorno de ponta a ponta.
 */
export async function Contato() {
  const t = await getTranslations("inicio.contato")
  const n = await getTranslations("inicio.numeros")
  const c = await getTranslations("inicio.comandos")
  const locale = (await getLocale()) as Locale
  const [primeira = "", ...resto] = t("titulo").split(" ")

  return (
    <section id="contato" className="relative overflow-hidden pt-24 lg:pt-32">
      <span
        aria-hidden
        className="pointer-events-none absolute top-24 -left-24 size-112 rounded-full bg-vinho/25 blur-3xl"
      />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Comando texto={c("contato")} />
          <span className="flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs">
            <StatusDot />
            {t("disponivel")}
          </span>
        </div>
        <h2
          data-mov="contato-titulo"
          className="texto-chamada font-semibold tracking-tight"
        >
          <span className="block">{primeira}</span>
          {resto.length > 0 ? (
            <span className="block texto-contorno-claro">
              {resto.join(" ")}
            </span>
          ) : null}
        </h2>
        <div className="grid gap-14 lg:grid-cols-12">
          <Credibilidade
            garantias={t.raw("garantias") as string[]}
            numeros={(n.raw("itens") as Item[]).slice(4, 7)}
            texto={t("texto")}
          />
          <Fechamento
            curriculo={t("curriculo")}
            falar={t("falar")}
            locale={locale}
            passos={t.raw("passos") as Item[]}
            titulo={t("passosTitulo")}
          />
        </div>
      </div>
      <div className="mt-20 lg:mt-28">
        <FaixaFundo texto={t("titulo").replace(/[.!]$/, "")} />
      </div>
    </section>
  )
}
