import { type Locale, cases, t as traduzir } from "@portfolio/content"
import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { routing } from "@/i18n/routing"

/**
 * Capa de cada caso, por idioma (/capas/pt/<slug>.png), para o carrossel do
 * início (Flex Carousel). Gerada no build e servida como arquivo estático.
 * Até cada caso ter print ou vídeo próprio, a capa é tipográfica, no visual
 * do site: grafite, brilho vinho, a linha de laser e o título.
 *
 * O motor do ImageResponse não é um navegador: só flexbox, cor sólida,
 * degradê e posição absoluta; as cores vão em hexadecimal.
 */

export const dynamic = "force-static"

const LARGURA = 960
const ALTURA = 1280
const GRAFITE = "#121013"
const CREME = "#f2e9dc"
const CREME_SUAVE = "rgba(242,233,220,0.62)"
const CREME_FRACO = "rgba(242,233,220,0.45)"
const VINHO_CLARO = "#e0425f"
const BRILHO =
  "radial-gradient(760px 640px at 85% 8%, rgba(140,23,48,0.55), rgba(140,23,48,0))"

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    cases.map((caso) => ({ arquivo: `${caso.slug}.png`, locale })),
  )
}

async function fontes() {
  const pasta = join(process.cwd(), "assets/fontes")
  const [titulo, mono] = await Promise.all([
    readFile(join(pasta, "geist-600.ttf")),
    readFile(join(pasta, "geist-mono-500.ttf")),
  ])
  return [
    { data: titulo, name: "Geist", weight: 600 as const },
    { data: mono, name: "Geist Mono", weight: 500 as const },
  ]
}

/** Título, resumo e stack do caso, na metade de baixo da capa. */
function Textos({ indice, locale }: { indice: number; locale: Locale }) {
  const caso = cases[indice]!
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div
        style={{
          color: CREME,
          display: "flex",
          fontFamily: "Geist",
          fontSize: 84,
          letterSpacing: -3,
          lineHeight: 1.02,
        }}
      >
        {traduzir(caso.title, locale)}
      </div>
      <div
        style={{
          color: CREME_SUAVE,
          display: "flex",
          fontFamily: "Geist",
          fontSize: 30,
          lineHeight: 1.35,
        }}
      >
        {traduzir(caso.summary, locale)}
      </div>
      <div
        style={{
          color: CREME_FRACO,
          display: "flex",
          fontFamily: "Geist Mono",
          fontSize: 22,
        }}
      >
        {caso.stack.join("  ·  ")}
      </div>
    </div>
  )
}

function Capa({ indice, locale }: { indice: number; locale: Locale }) {
  const numero = `${String(indice + 1).padStart(2, "0")} / ${String(cases.length).padStart(2, "0")}`

  return (
    <div
      style={{
        backgroundColor: GRAFITE,
        backgroundImage: BRILHO,
        display: "flex",
        flexDirection: "column",
        height: ALTURA,
        justifyContent: "space-between",
        padding: "80px 72px",
        position: "relative",
        width: LARGURA,
      }}
    >
      <div
        style={{
          backgroundColor: VINHO_CLARO,
          boxShadow: `0 0 28px 6px ${VINHO_CLARO}`,
          display: "flex",
          height: 2,
          left: 0,
          position: "absolute",
          top: 520,
          width: LARGURA,
        }}
      />
      <div
        style={{
          alignItems: "center",
          color: VINHO_CLARO,
          display: "flex",
          fontFamily: "Geist Mono",
          fontSize: 26,
        }}
      >
        <div
          style={{
            borderBottom: `4px solid ${VINHO_CLARO}`,
            borderRight: `4px solid ${VINHO_CLARO}`,
            display: "flex",
            height: 16,
            marginRight: 18,
            transform: "rotate(-45deg)",
            width: 16,
          }}
        />
        {numero}
      </div>
      <Textos indice={indice} locale={locale} />
    </div>
  )
}

export async function GET(
  _pedido: Request,
  { params }: { params: Promise<{ arquivo: string; locale: string }> },
) {
  const { arquivo, locale } = await params
  const indice = cases.findIndex((caso) => `${caso.slug}.png` === arquivo)
  const idioma = routing.locales.find((l) => l === locale)
  if (indice < 0 || !idioma) return new Response(null, { status: 404 })

  return new ImageResponse(<Capa indice={indice} locale={idioma} />, {
    fonts: await fontes(),
    height: ALTURA,
    width: LARGURA,
  })
}
