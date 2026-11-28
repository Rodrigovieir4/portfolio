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
 * Os canais numa lista limpa, separada por linhas finas: ícone, canal,
 * contato e seta. No hover, o ícone ganha a cor do canal e a seta anda.
 */
function Canais() {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {CANAIS.map((canal) => (
        <li key={canal.platform} data-marca={canal.platform}>
          <a
            href={canal.url}
            target={canal.platform === "email" ? undefined : "_blank"}
            rel="noreferrer"
            className="group flex items-center gap-4 py-5"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors duration-300 group-hover:border-current group-hover:cor-marca">
              {ICONE_CANAL[canal.platform]}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="font-mono text-xs text-muted-foreground uppercase">
                {NOME_CANAL[canal.platform]}
              </span>
              <span className="text-lg md:text-xl">
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
            <span
              aria-hidden
              className="text-xl text-muted-foreground transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-foreground"
            >
              ↗
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
    <div className="flex flex-wrap gap-4">
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
 * O fim da página, solto, sem cartão (pedido do Rodrigo, 27/11). O título
 * enorme em duas linhas, a primeira cheia e a segunda em contorno, como o
 * "SOBRE / MIM", sobe letra por letra (secoes.ts) com um brilho vinho
 * difuso atrás. Embaixo, o texto e os botões de um lado e os canais do
 * outro; fecha com uma faixa gigante em contorno de ponta a ponta.
 */
export async function Contato() {
  const t = await getTranslations("inicio.contato")
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
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-5">
            <p className="max-w-md text-xl text-pretty">{t("texto")}</p>
            <Botoes
              falar={t("falar")}
              curriculo={t("curriculo")}
              locale={locale}
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Canais />
          </div>
        </div>
      </div>
      <div className="mt-20 lg:mt-28">
        <FaixaFundo texto={t("titulo").replace(/[.!]$/, "")} />
      </div>
    </section>
  )
}
