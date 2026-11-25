import { profile } from "@portfolio/content"
import { getTranslations } from "next-intl/server"
import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { routing } from "@/i18n/routing"

/**
 * Cartão de compartilhamento, um por idioma, no visual do redesenho.
 *
 * É o que aparece quando o link é colado no LinkedIn, no WhatsApp ou no
 * Slack. Gerado no build e servido como arquivo estático.
 *
 * O motor do ImageResponse não é um navegador: só flexbox, cor sólida,
 * degradê e posição absoluta com medidas explícitas. Por isso as cores estão
 * em hexadecimal (as do tema são OKLCH) e o retrato vai em JPEG, porque o
 * motor não lê WebP.
 */

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "Rodrigo Vieira, Desenvolvedor Full Stack"

const GRAFITE = "#121013"
const CREME = "#f2e9dc"
const CREME_SUAVE = "rgba(242,233,220,0.65)"
const VINHO_CLARO = "#dc5a6f"
const TRANSPARENTE = "rgba(18,16,19,0)"
const VINHO = "rgba(140,23,48,0.45)"
const SEM_VINHO = "rgba(140,23,48,0)"

type Camada = { fundo: string; left: number; width: number }

// O retrato tem fundo próprio; estas camadas tingem de vinho e fundem as
// bordas no grafite, como a máscara do retrato no site.
const CAMADAS: Camada[] = [
  {
    fundo: `radial-gradient(400px 400px at 50% 45%, ${VINHO}, ${SEM_VINHO})`,
    left: 640,
    width: 560,
  },
  {
    fundo: `linear-gradient(to right, ${GRAFITE} 0%, ${TRANSPARENTE} 100%)`,
    left: 630,
    width: 220,
  },
  {
    fundo: `linear-gradient(to left, ${GRAFITE} 0%, ${TRANSPARENTE} 100%)`,
    left: 1040,
    width: 160,
  },
]

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

function Retrato({ src }: { src: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- só <img> */}
      <img
        src={src}
        alt=""
        height={696}
        width={520}
        style={{ left: 640, position: "absolute", top: 0 }}
      />
      {CAMADAS.map((camada) => (
        <div
          key={camada.left}
          style={{
            backgroundImage: camada.fundo,
            display: "flex",
            height: 630,
            left: camada.left,
            position: "absolute",
            top: 0,
            width: camada.width,
          }}
        />
      ))}
    </>
  )
}

type Textos = { rotulo: string; subtitulo: string; titulo: string }

function Texto({ rotulo, subtitulo, titulo }: Textos) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: 630,
        justifyContent: "space-between",
        padding: "64px 72px",
        width: 680,
      }}
    >
      <div
        style={{
          color: CREME_SUAVE,
          display: "flex",
          fontSize: 20,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        {rotulo}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            color: CREME,
            display: "flex",
            fontSize: 70,
            letterSpacing: -2,
            lineHeight: 1.05,
          }}
        >
          {titulo}
        </div>
        <div style={{ color: CREME_SUAVE, display: "flex", fontSize: 26 }}>
          {subtitulo}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 24, gap: 16 }}>
        <span style={{ color: CREME }}>{profile.shortName}</span>
        <span style={{ color: VINHO_CLARO }}>·</span>
        <span style={{ color: CREME_SUAVE }}>{profile.location.city}</span>
      </div>
    </div>
  )
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "inicio.abertura" })
  const foto = await readFile(
    join(process.cwd(), "public/images/retrato-og.jpg"),
  )

  return new ImageResponse(
    <div
      style={{
        backgroundColor: GRAFITE,
        display: "flex",
        height: 630,
        position: "relative",
        width: 1200,
      }}
    >
      <Retrato src={`data:image/jpeg;base64,${foto.toString("base64")}`} />
      <Texto
        rotulo={t("rotulo")}
        subtitulo={t("subtitulo")}
        titulo={`${t("tituloA")} ${t("tituloB")}`}
      />
    </div>,
    size,
  )
}
