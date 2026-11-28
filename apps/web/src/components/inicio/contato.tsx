import { type Locale, profile, t as traduzir } from "@portfolio/content"
import { Magnetic, StatusDot } from "@portfolio/ui"
import { Button } from "@portfolio/ui/components/button"
import { getLocale, getTranslations } from "next-intl/server"

import { Comando } from "./comando"

const LINKEDIN = profile.socials.find((s) => s.platform === "linkedin")

/** Os canais embaixo do bloco. Sem telefone: ele não vai para o site. */
const CANAIS = profile.socials.filter((s) =>
  ["email", "linkedin", "github"].includes(s.platform),
)
const NOME_CANAL: Record<string, string> = {
  email: "E-mail",
  github: "GitHub",
  linkedin: "LinkedIn",
}

/**
 * Faixa gigante no pé do bloco, atrás dos canais, só no contorno, rolando
 * devagar como as da stack. Decorativa: o leitor de tela não lê.
 */
function FaixaFundo({ texto }: { texto: string }) {
  const repetido = Array.from({ length: 4 }, () => `${texto} · `).join("")
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1/3 overflow-hidden opacity-15"
    >
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

/** E-mail, LinkedIn e GitHub, numa linha no pé do bloco. */
function Canais() {
  return (
    <ul className="grid gap-4 border-t border-foreground/20 pt-6 sm:grid-cols-3">
      {CANAIS.map((canal) => (
        <li key={canal.platform}>
          <a
            href={canal.url}
            target={canal.platform === "email" ? undefined : "_blank"}
            rel="noreferrer"
            className="group flex flex-col gap-1"
          >
            <span className="font-mono text-xs text-foreground/60 uppercase">
              {NOME_CANAL[canal.platform]}
            </span>
            <span className="flex items-center gap-2 text-sm break-all md:text-base">
              {canal.handle}
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                ↗
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

/** Falar comigo e baixar o currículo, com o ímã do resto do site. */
function Botoes({
  curriculo,
  falar,
  locale,
}: {
  curriculo: string
  falar: string
  locale: Locale
}) {
  return (
    <div className="relative flex flex-wrap gap-4">
      <Magnetic strength={0.2}>
        <Button asChild size="cta-lg">
          <a
            href={LINKEDIN?.url ?? `mailto:${profile.email}`}
            target="_blank"
            rel="noreferrer"
          >
            {falar}
          </a>
        </Button>
      </Magnetic>
      <Magnetic strength={0.2}>
        <Button asChild variant="contorno" size="cta-lg">
          <a href={traduzir(profile.resumeUrl, locale)} download>
            {curriculo}
          </a>
        </Button>
      </Magnetic>
    </div>
  )
}

/**
 * O CTA do fim (pedido do Rodrigo, 27/11: estava "fraquinho"). O bloco vinho
 * cresce com a rolagem (movimento.tsx), a luz clara segue o mouse e, atrás,
 * corre uma faixa gigante em contorno. O título vem em duas linhas, a
 * primeira cheia e a segunda em contorno, como o "SOBRE / MIM", e sobe letra
 * por letra (secoes.ts).
 */
export async function Contato() {
  const t = await getTranslations("inicio.contato")
  const c = await getTranslations("inicio.comandos")
  const locale = (await getLocale()) as Locale
  const [primeira = "", ...resto] = t("titulo").split(" ")

  return (
    <section id="contato" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div
        data-mov="contato"
        data-holofote
        className="holofote relative flex flex-col gap-8 overflow-hidden rounded-3xl bloco-vinho px-6 py-16 holofote-claro md:px-12 md:py-20"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 fundo-pontos opacity-40"
        />
        <FaixaFundo texto={t("titulo").replace(/[.!]$/, "")} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <Comando
            texto={c("contato")}
            sobreVinho
            className="text-foreground/75"
          />
          <span className="flex items-center gap-2 rounded-full border border-foreground/25 px-3 py-1 font-mono text-xs">
            <StatusDot />
            {t("disponivel")}
          </span>
        </div>
        <h2
          data-mov="contato-titulo"
          className="relative text-6xl leading-none font-semibold tracking-tight md:text-9xl"
        >
          <span className="block">{primeira}</span>
          {resto.length > 0 ? (
            <span className="block texto-contorno-claro">
              {resto.join(" ")}
            </span>
          ) : null}
        </h2>
        <p className="relative max-w-2xl text-xl text-pretty">{t("texto")}</p>
        <Botoes falar={t("falar")} curriculo={t("curriculo")} locale={locale} />
        <div className="relative mt-4">
          <Canais />
        </div>
      </div>
    </section>
  )
}
