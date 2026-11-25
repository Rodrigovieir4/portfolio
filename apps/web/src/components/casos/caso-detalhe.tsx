import {
  type Case,
  type Locale,
  cases,
  projectBySlug,
  t as traduzir,
} from "@portfolio/content"
import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import { formatarData } from "@/lib/data"

type Props = { caso: Case; locale: Locale }

async function Topo({ caso, locale }: Props) {
  const t = await getTranslations("caso")
  const projeto = projectBySlug(caso.project)

  return (
    <header className="flex flex-col gap-6">
      <Link href="/casos" className="font-mono text-sm text-muted-foreground">
        ← {t("voltar")}
      </Link>
      <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-balance md:text-7xl">
        {traduzir(caso.title, locale)}
      </h1>
      <p className="max-w-2xl text-xl text-pretty text-muted-foreground">
        {traduzir(caso.summary, locale)}
      </p>
      <p className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground">
        {projeto ? (
          <Link
            href={{
              params: { slug: projeto.slug },
              pathname: "/projetos/[slug]",
            }}
            className="underline underline-offset-4"
          >
            {t("projeto")}: {projeto.name}
          </Link>
        ) : null}
        <span>{caso.stack.join(" · ")}</span>
        <time dateTime={caso.publishedAt}>
          {formatarData(caso.publishedAt, locale)}
        </time>
        {caso.linkedinUrl ? (
          <a href={caso.linkedinUrl} target="_blank" rel="noreferrer">
            {t("verPost")} ↗
          </a>
        ) : null}
      </p>
      <div className="mt-4 flex aspect-video w-full items-end rounded-3xl bloco-vinho p-6">
        <span className="font-mono text-sm">{t("emBreve")}</span>
      </div>
    </header>
  )
}

async function Historia({ caso, locale }: Props) {
  const t = await getTranslations("caso")
  const partes = [
    ["problema", caso.problem],
    ["decisao", caso.decision],
    ["resultado", caso.outcome],
  ] as const

  return (
    <div className="grid gap-10 border-t border-border pt-12 md:grid-cols-3">
      {partes.map(([chave, texto]) => (
        <section key={chave} className="flex flex-col gap-4">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            {t(chave)}
          </h2>
          <p className="text-lg text-pretty">{traduzir(texto, locale)}</p>
        </section>
      ))}
    </div>
  )
}

async function Fechamento({ caso, locale }: Props) {
  const t = await getTranslations("caso")

  return (
    <div className="grid gap-12 border-t border-border pt-12 md:grid-cols-2">
      {caso.metrics.length > 0 ? (
        <section>
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            {t("numeros")}
          </h2>
          <dl className="mt-6 grid grid-cols-2 gap-6">
            {caso.metrics.map((metrica) => (
              <div key={metrica.value} className="flex flex-col-reverse gap-2">
                <dt className="font-mono text-xs text-muted-foreground">
                  {traduzir(metrica.label, locale)}
                </dt>
                <dd className="font-numeros text-5xl leading-none">
                  {metrica.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
      <section>
        <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {t("licoes")}
        </h2>
        <ol className="mt-6 flex list-decimal flex-col gap-3 pl-5 text-lg">
          {traduzir(caso.lessons, locale).map((licao) => (
            <li key={licao} className="text-pretty">
              {licao}
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

async function Navegacao({ caso, locale }: Props) {
  const t = await getTranslations("caso")
  const indice = cases.findIndex((item) => item.slug === caso.slug)
  const vizinhos = [
    ["anterior", cases[indice - 1]],
    ["proximo", cases[indice + 1]],
  ] as const

  return (
    <nav className="grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
      {vizinhos.map(([chave, vizinho]) =>
        vizinho ? (
          <Link
            key={chave}
            href={{ params: { slug: vizinho.slug }, pathname: "/casos/[slug]" }}
            className="flex flex-col gap-1 rounded-2xl border border-border p-5 transition-colors last:text-right hover:border-vinho-claro"
          >
            <span className="font-mono text-xs text-muted-foreground">
              {t(chave)}
            </span>
            <span className="font-medium">
              {traduzir(vizinho.title, locale)}
            </span>
          </Link>
        ) : (
          <span key={chave} />
        ),
      )}
    </nav>
  )
}

export function CasoDetalhe(props: Props) {
  return (
    <article className="mx-auto flex max-w-7xl flex-col gap-16 px-4 pt-32 pb-24 lg:px-8 lg:pt-40">
      <Topo {...props} />
      <Historia {...props} />
      <Fechamento {...props} />
      <Navegacao {...props} />
    </article>
  )
}
