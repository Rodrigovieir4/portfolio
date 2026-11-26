import {
  type Locale,
  type Project,
  cases,
  projects,
  t as traduzir,
} from "@portfolio/content"
import { Button } from "@portfolio/ui/components/button"
import { getTranslations } from "next-intl/server"

import { CartaoCaso } from "@/components/casos/cartao-caso"
import { Link } from "@/i18n/navigation"

type Props = { locale: Locale; projeto: Project }

const ROTULO =
  "font-mono text-xs tracking-widest text-muted-foreground uppercase"

async function Acoes({ projeto }: { projeto: Project }) {
  const t = await getTranslations("projeto")
  const privado = projeto.codeVisibility === "private"

  return (
    <div data-mov="abertura" className="flex flex-wrap items-center gap-4">
      {projeto.links.demo ? (
        <Button asChild size="cta">
          <a href={projeto.links.demo} target="_blank" rel="noreferrer">
            {t("verNoAr")} ↗
          </a>
        </Button>
      ) : null}
      {privado ? (
        <span className="font-mono text-xs text-muted-foreground">
          {t("codigoPrivado")}
        </span>
      ) : null}
      {!privado && projeto.links.repo ? (
        <a
          href={projeto.links.repo}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          {t("codigo")} ↗
        </a>
      ) : null}
    </div>
  )
}

async function Topo({ locale, projeto }: Props) {
  const t = await getTranslations("projeto")

  return (
    <header className="flex flex-col gap-6">
      <Link
        href="/projetos"
        className="font-mono text-sm text-muted-foreground"
      >
        ← {t("voltar")}
      </Link>
      <p className="flex flex-wrap gap-x-4 font-mono text-xs text-muted-foreground uppercase">
        <span className={projeto.status === "live" ? "text-vinho-claro" : ""}>
          {t(`status.${projeto.status}`)}
        </span>
        <span>{projeto.year}</span>
        <span>{projeto.markets.join(" · ")}</span>
      </p>
      <h1
        data-mov="titulo"
        className="text-6xl font-semibold tracking-tight text-balance md:text-8xl"
      >
        {projeto.name}
      </h1>
      <p
        data-mov="abertura"
        className="max-w-2xl text-xl text-pretty text-muted-foreground"
      >
        {traduzir(projeto.summary, locale)}
      </p>
      <Acoes projeto={projeto} />
      <div className="mt-4 flex aspect-video w-full items-end rounded-3xl bloco-vinho p-6">
        <span className="font-mono text-sm">{t("emBreve")}</span>
      </div>
    </header>
  )
}

async function Corpo({ locale, projeto }: Props) {
  const t = await getTranslations("projeto")
  const ficha = [
    ["papel", traduzir(projeto.role, locale)],
    [
      "cliente",
      [projeto.client, t(`engagement.${projeto.engagement}`)]
        .filter(Boolean)
        .join(" · "),
    ],
    ["stack", projeto.stack.join(" · ")],
  ] as const

  return (
    <div className="grid gap-12 border-t border-border pt-12 lg:grid-cols-12">
      <div className="flex flex-col gap-6 lg:col-span-8">
        {traduzir(projeto.description, locale).map((paragrafo) => (
          <p key={paragrafo} data-mov="subir" className="text-xl text-pretty">
            {paragrafo}
          </p>
        ))}
      </div>
      <dl className="flex flex-col gap-8 lg:col-span-4">
        {ficha.map(([chave, valor]) => (
          <div key={chave} data-mov="subir" className="flex flex-col gap-2">
            <dt className={ROTULO}>{t(chave)}</dt>
            <dd className="text-pretty text-muted-foreground">{valor}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

async function Destaques({ locale, projeto }: Props) {
  const t = await getTranslations("projeto")

  return (
    <div className="grid gap-12 border-t border-border pt-12 md:grid-cols-2">
      {projeto.metrics.length > 0 ? (
        <section>
          <h2 className={ROTULO}>{t("numeros")}</h2>
          <dl className="mt-6 grid grid-cols-2 gap-6">
            {projeto.metrics.map((metrica) => (
              <div key={metrica.value} className="flex flex-col-reverse gap-2">
                <dt className="font-mono text-xs text-muted-foreground">
                  {traduzir(metrica.label, locale)}
                </dt>
                <dd
                  data-mov="numero"
                  className="font-numeros text-6xl leading-none"
                >
                  {metrica.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
      <section>
        <h2 className={ROTULO}>{t("destaques")}</h2>
        <ul className="mt-6 flex flex-col gap-3 text-lg">
          {traduzir(projeto.highlights, locale).map((item) => (
            <li key={item} data-mov="subir" className="flex gap-3 text-pretty">
              <span aria-hidden className="text-vinho-claro">
                →
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

async function CasosDoProjeto({ locale, projeto }: Props) {
  const t = await getTranslations("projeto")
  const emBreve = (await getTranslations("caso"))("emBreve")
  const lista = cases.filter((caso) => caso.project === projeto.slug)
  if (lista.length === 0) return null

  return (
    <section className="border-t border-border pt-12">
      <h2 data-mov="subir" className="text-4xl font-semibold tracking-tight">
        {t("casos")}
      </h2>
      <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lista.map((caso) => (
          <li key={caso.slug} data-mov="subir">
            <CartaoCaso caso={caso} emBreve={emBreve} locale={locale} />
          </li>
        ))}
      </ul>
    </section>
  )
}

async function Navegacao({ projeto }: Props) {
  const t = await getTranslations("projeto")
  const indice = projects.findIndex((item) => item.slug === projeto.slug)
  const vizinhos = [
    ["anterior", projects[indice - 1]],
    ["proximo", projects[indice + 1]],
  ] as const

  return (
    <nav className="grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
      {vizinhos.map(([chave, vizinho]) =>
        vizinho ? (
          <Link
            key={chave}
            href={{
              params: { slug: vizinho.slug },
              pathname: "/projetos/[slug]",
            }}
            className="flex flex-col gap-1 rounded-2xl border border-border p-5 transition-colors last:text-right hover:border-vinho-claro"
          >
            <span className="font-mono text-xs text-muted-foreground">
              {t(chave)}
            </span>
            <span className="text-2xl font-semibold tracking-tight">
              {vizinho.name}
            </span>
          </Link>
        ) : (
          <span key={chave} />
        ),
      )}
    </nav>
  )
}

export function ProjetoDetalhe(props: Props) {
  return (
    <article className="mx-auto flex max-w-7xl flex-col gap-16 px-4 pt-32 pb-24 lg:px-8 lg:pt-40">
      <Topo {...props} />
      <Corpo {...props} />
      <Destaques {...props} />
      <CasosDoProjeto {...props} />
      <Navegacao {...props} />
    </article>
  )
}
