import { type Locale, profile, t as traduzir } from "@portfolio/content"
import {
  GithubIcon,
  LinkedinIcon,
  StatusDot,
  WhatsappIcon,
} from "@portfolio/ui"
import { Button } from "@portfolio/ui/components/button"
import { Mail } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import { Comando } from "./comando"
import { FundoContato } from "./fundo-contato"

const LINKEDIN = profile.socials.find((s) => s.platform === "linkedin")

/**
 * Todos os canais, fáceis de achar (pedido do Rodrigo, 27/11, que pediu
 * também o WhatsApp no site).
 */
const ORDEM_CANAIS = ["whatsapp", "email", "linkedin", "github"]
const CANAIS = ORDEM_CANAIS.flatMap(
  (nome) => profile.socials.find((s) => s.platform === nome) ?? [],
)
const NOME_CANAL: Record<string, string> = {
  email: "E-mail",
  github: "GitHub",
  linkedin: "LinkedIn",
  whatsapp: "WhatsApp",
}
const ICONE_CANAL: Record<string, React.ReactNode> = {
  email: <Mail className="size-5" />,
  github: <GithubIcon className="size-5" />,
  linkedin: <LinkedinIcon className="size-5" />,
  whatsapp: <WhatsappIcon className="size-5" />,
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

/**
 * Os canais em blocos clicáveis, cada um com o ícone, o nome e o contato; no
 * hover, o ícone e a borda ganham a cor do canal.
 */
function Canais() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {CANAIS.map((canal) => (
        <li key={canal.platform} data-marca={canal.platform}>
          <a
            href={canal.url}
            target={canal.platform === "email" ? undefined : "_blank"}
            rel="noreferrer"
            className="group flex h-full items-center gap-3 rounded-2xl border border-foreground/15 bg-background/30 p-4 transition-colors duration-300 hover:border-foreground/40"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-foreground/10 transition-colors duration-300 group-hover:cor-marca">
              {ICONE_CANAL[canal.platform]}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="font-mono text-xs text-foreground/60 uppercase">
                {NOME_CANAL[canal.platform]}
              </span>
              <span className="text-sm">
                {/* O e-mail, se não couber, quebra depois do @. */}
                {(canal.handle ?? "").split("@").map((parte, i) => (
                  <span key={parte}>
                    {i > 0 ? "@" : null}
                    {parte}
                    {i === 0 && canal.platform === "email" ? <wbr /> : null}
                  </span>
                ))}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

/** Falar comigo e baixar o currículo; os botões ficam parados (pedido dele). */
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
      <Button asChild size="cta-lg">
        <a
          href={LINKEDIN?.url ?? `mailto:${profile.email}`}
          target="_blank"
          rel="noreferrer"
        >
          {falar}
        </a>
      </Button>
      <Button asChild variant="contorno" size="cta-lg">
        <a href={traduzir(profile.resumeUrl, locale)} download>
          {curriculo}
        </a>
      </Button>
    </div>
  )
}

/**
 * O CTA do fim (pedido do Rodrigo, 27/11: estava "fraquinho"). O bloco
 * cresce com a rolagem (movimento.tsx), o fundo vem de fundo-contato.tsx, a
 * luz clara segue o mouse e, atrás,
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
        className="holofote relative flex flex-col gap-8 overflow-hidden rounded-3xl px-6 py-16 holofote-claro md:px-12 md:py-20"
      >
        <FundoContato />
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
