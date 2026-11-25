import type { Metadata } from "next"

import {
  type Locale,
  experiences,
  languages,
  profile,
  skillGroups,
  t as traduzir,
} from "@portfolio/content"
import { getTranslations, setRequestLocale } from "next-intl/server"
import Image from "next/image"

import { Contato } from "@/components/inicio/contato"
import { alternativas } from "@/i18n/caminho"
import { Link } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"

type Params = { locale: string }
type Props = { locale: Locale }

const ROTULO =
  "font-mono text-xs tracking-widest text-muted-foreground uppercase"
const SECAO = "mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28"
const TITULO = "text-5xl font-semibold tracking-tight md:text-6xl"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "sobrePagina" })
  return {
    alternates: alternativas("/sobre", { locale: locale as Locale }),
    description: t("descricao"),
    title: t("rotulo"),
  }
}

async function Topo({ locale }: Props) {
  const t = await getTranslations("sobrePagina")
  const ia = (await getTranslations("inicio.sobre"))("ia")

  return (
    <section className="relative overflow-hidden brilho-vinho">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-32 lg:grid-cols-12 lg:px-8 lg:pt-40">
        <div className="flex flex-col gap-8 lg:col-span-7">
          <p data-mov="abertura" className={ROTULO}>
            {t("rotulo")}
          </p>
          <h1
            data-mov="titulo"
            className="text-6xl font-semibold tracking-tight text-balance md:text-8xl"
          >
            {profile.name}
          </h1>
          <p data-mov="abertura" className="text-xl text-muted-foreground">
            {t("cargo")}
          </p>
          <div className="flex flex-col gap-6 pt-6">
            {traduzir(profile.bio, locale).map((paragrafo) => (
              <p
                key={paragrafo}
                data-mov="subir"
                className="text-xl text-pretty"
              >
                {paragrafo}
              </p>
            ))}
            <p
              data-mov="subir"
              className="text-xl text-pretty text-vinho-claro"
            >
              {ia}{" "}
              <Link
                href={{
                  params: { slug: "programo-com-ia-as-regras" },
                  pathname: "/ideias/[slug]",
                }}
                className="font-mono text-sm whitespace-nowrap text-foreground underline underline-offset-4"
              >
                {t("lerIdeia")} →
              </Link>
            </p>
          </div>
        </div>
        <Image
          src="/images/retrato.webp"
          alt={t("retratoAlt")}
          width={1200}
          height={1607}
          priority
          sizes="(min-width: 1024px) 35vw, 90vw"
          data-mov="retrato"
          className="mx-auto w-full max-w-md self-start mask-t-from-85% mask-x-from-75% mask-b-from-70% lg:col-span-5"
        />
      </div>
    </section>
  )
}

async function ComoTrabalho() {
  const t = await getTranslations("sobrePagina")
  const principios = t.raw("principios") as [string, string][]

  return (
    <section className={SECAO}>
      <h2 data-mov="subir" className={TITULO}>
        {t("comoTrabalho")}
      </h2>
      <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2">
        {principios.map(([titulo, texto], indice) => (
          <li
            key={titulo}
            data-mov="subir"
            className="flex flex-col gap-4 bg-background p-8 lg:p-10"
          >
            <span className="font-numeros text-5xl text-vinho-claro">
              {String(indice + 1).padStart(2, "0")}
            </span>
            <h3 className="text-2xl font-semibold tracking-tight">{titulo}</h3>
            <p className="text-pretty text-muted-foreground">{texto}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

async function Trajetoria({ locale }: Props) {
  const t = await getTranslations("sobrePagina")
  const lista = [...experiences].sort((a, b) => b.start.localeCompare(a.start))

  return (
    <section className={SECAO}>
      <h2 data-mov="subir" className={TITULO}>
        {t("trajetoria")}
      </h2>
      <ol className="mt-12 border-t border-border">
        {lista.map((item) => (
          <li
            key={item.id}
            data-mov="subir"
            className="grid gap-3 border-b border-border py-8 md:grid-cols-12"
          >
            <span className="font-mono text-sm text-muted-foreground md:col-span-2">
              {item.start.slice(0, 4)} – {item.end?.slice(0, 4) ?? t("hoje")}
            </span>
            <div className="flex flex-col gap-1 md:col-span-4">
              <span className="text-2xl font-semibold tracking-tight">
                {traduzir(item.role, locale)}
              </span>
              <span className="text-muted-foreground">{item.organization}</span>
            </div>
            <p className="text-pretty text-muted-foreground md:col-span-6">
              {traduzir(item.summary, locale)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}

async function StackEIdiomas({ locale }: Props) {
  const t = await getTranslations("sobrePagina")

  return (
    <section className={`${SECAO} grid gap-16 lg:grid-cols-12`}>
      <div className="lg:col-span-8">
        <h2 data-mov="subir" className={TITULO}>
          {t("stack")}
        </h2>
        <dl className="mt-12 flex flex-col gap-8">
          {skillGroups.map((grupo) => (
            <div
              key={grupo.id}
              data-mov="subir"
              className="flex flex-col gap-3"
            >
              <dt className={ROTULO}>{traduzir(grupo.label, locale)}</dt>
              <dd className="text-xl text-pretty">
                {grupo.skills.map((skill) => skill.name).join(" · ")}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="lg:col-span-4">
        <h2 data-mov="subir" className={TITULO}>
          {t("idiomas")}
        </h2>
        <dl className="mt-12 flex flex-col gap-6">
          {languages.map((idioma) => (
            <div
              key={idioma.code}
              data-mov="subir"
              className="flex items-baseline justify-between gap-4 border-b border-border pb-4"
            >
              <dt className="text-xl">{traduzir(idioma.name, locale)}</dt>
              <dd className="font-mono text-sm text-muted-foreground">
                {t(`niveis.${idioma.level}`)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default async function SobrePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const idioma = locale as Locale

  return (
    <>
      <Topo locale={idioma} />
      <ComoTrabalho />
      <Trajetoria locale={idioma} />
      <StackEIdiomas locale={idioma} />
      <Contato />
    </>
  )
}
