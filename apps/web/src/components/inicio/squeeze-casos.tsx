"use client"

import type { KeyboardEvent, ReactNode } from "react"

import { Button } from "@portfolio/ui/components/button"
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Link, useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

export interface CasoVitrine {
  resumo: string
  slug: string
  stack: string
  titulo: string
}

interface Rotulos {
  anterior: string
  ler: string
  proximo: string
}

/** Distância até o painel aberto, como o CSS lê (data-squeeze no globals). */
function distancia(indice: number, aberto: number) {
  const d = indice - aberto
  return d >= -2 && d <= 3 ? String(d) : "longe"
}

/** Um painel: largo quando aberto, uma faixa estreita quando não. */
function Painel({
  aberto,
  caso,
  indice,
  onAbrir,
  onTecla,
  rotuloLer,
  total,
}: {
  aberto: number
  caso: CasoVitrine
  indice: number
  onAbrir: () => void
  onTecla: (evento: KeyboardEvent) => void
  rotuloLer: string
  total: number
}) {
  const ativo = indice === aberto
  return (
    <button
      type="button"
      data-squeeze={distancia(indice, aberto)}
      aria-label={ativo ? `${rotuloLer}: ${caso.titulo}` : caso.titulo}
      aria-current={ativo ? "true" : undefined}
      onClick={onAbrir}
      onKeyDown={onTecla}
      className={cn(
        "relative min-w-0 basis-0 overflow-hidden rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-vinho-claro",
        indice % 2 === 1 ? "bloco-vinho" : "bg-card",
      )}
    >
      <span
        aria-hidden
        className="absolute top-4 left-4 font-mono text-xs text-foreground/70"
      >
        {String(indice + 1).padStart(2, "0")}
      </span>
      {/* Sem imagem nos casos ainda: o painel aberto mostra o título grande.
          Largura fixa: o texto não se rearruma enquanto o painel cresce. */}
      <span
        aria-hidden
        className={cn(
          "absolute bottom-6 left-6 flex w-56 flex-col gap-3 transition-opacity duration-500 md:w-xl",
          ativo ? "opacity-100 delay-300" : "opacity-0",
        )}
      >
        <span className="text-2xl font-semibold tracking-tight text-balance md:text-5xl">
          {caso.titulo}
        </span>
        <span className="font-mono text-xs text-foreground/70">
          {caso.stack} · {String(indice + 1).padStart(2, "0")}/
          {String(total).padStart(2, "0")}
        </span>
      </span>
    </button>
  )
}

/** Setas de anterior e próximo, em cima, à direita do título. */
function Setas({
  aberto,
  ir,
  rotulos,
  total,
}: {
  aberto: number
  ir: (indice: number) => void
  rotulos: Rotulos
  total: number
}) {
  return (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        size="icon-lg"
        aria-label={rotulos.anterior}
        disabled={aberto === 0}
        onClick={() => ir(aberto - 1)}
      >
        <ArrowLeft />
      </Button>
      <Button
        variant="secondary"
        size="icon-lg"
        aria-label={rotulos.proximo}
        disabled={aberto === total - 1}
        onClick={() => ir(aberto + 1)}
      >
        <ArrowRight />
      </Button>
    </div>
  )
}

/** Embaixo do painel aberto: o resumo e o botão para o caso. */
function Descricao({
  anunciar,
  caso,
  ler,
}: {
  anunciar: boolean
  caso: CasoVitrine
  ler: string
}) {
  return (
    <div
      // Passando sozinho, não anuncia a cada troca; só quando a pessoa mexe.
      aria-live={anunciar ? "polite" : "off"}
      className="mt-8 flex animate-in flex-wrap items-start justify-between gap-6 recuo-conteudo duration-500 fade-in"
    >
      <p className="max-w-2xl text-lg text-pretty text-foreground/80">
        {caso.resumo}
      </p>
      <Button asChild variant="secondary" size="pilula">
        <Link href={{ params: { slug: caso.slug }, pathname: "/casos/[slug]" }}>
          {ler} <ChevronRight />
        </Link>
      </Button>
    </div>
  )
}

/** As setas do teclado, com o foco num painel, passam de caso. */
function teclado(aberto: number, ir: (indice: number) => void) {
  return (evento: KeyboardEvent) => {
    if (evento.key === "ArrowRight") ir(aberto + 1)
    else if (evento.key === "ArrowLeft") ir(aberto - 1)
    else return
    evento.preventDefault()
  }
}

/**
 * O caso aberto e a passagem sozinha: a cada 3,5 s abre o próximo (e volta
 * ao primeiro no fim). Só passa com o carrossel na tela (pedido do Rodrigo:
 * começa quando a pessoa rola até os casos). Cada troca recomeça a contagem;
 * `parado` (mouse ou foco em cima) pausa e quem pede menos movimento não tem
 * passagem. `escolher` é a troca feita pela pessoa (clique, seta ou tecla):
 * para a passagem de vez, para ela ler o caso com calma (pedido do Rodrigo).
 */
function usePassagem(total: number) {
  const [aberto, setAberto] = useState(0)
  const [parado, setParado] = useState(false)
  const [naTela, setNaTela] = useState(false)
  const [escolheu, setEscolheu] = useState(false)
  const alvo = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const no = alvo.current
    if (!no) return
    const olho = new IntersectionObserver(
      ([entrada]) => setNaTela(entrada?.isIntersecting ?? false),
      { threshold: 0.5 },
    )
    olho.observe(no)
    return () => olho.disconnect()
  }, [])

  useEffect(() => {
    if (!naTela || parado || escolheu) return
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const passo = window.setTimeout(
      () => setAberto((atual) => (atual + 1) % total),
      3500,
    )
    return () => window.clearTimeout(passo)
  }, [aberto, escolheu, naTela, parado, total])

  const escolher = (indice: number) => {
    setEscolheu(true)
    setAberto(indice)
  }

  return { aberto, alvo, escolher, parado, setParado }
}

/**
 * Casos como o "Squeeze Carousel" (yura, 21st.dev, pedido do Rodrigo em
 * 26/11): um painel largo aberto e os outros espremidos em faixas, que
 * afinam conforme se afastam. Clicar numa faixa abre o caso; o aberto leva à
 * história completa. Setas em cima, à direita, e as do teclado com o foco num
 * painel. Passa sozinho a cada 3,5 s depois que entra na tela (pedido
 * do Rodrigo), pausa com o mouse ou o foco em cima, para de vez quando a
 * pessoa escolhe um caso e não passa para quem pede menos movimento.
 */
export function SqueezeCasos({
  cabecalho,
  casos,
  rotulos,
}: {
  /** Comando e título da seção, à esquerda das setas. */
  cabecalho: ReactNode
  casos: CasoVitrine[]
  rotulos: Rotulos
}) {
  const { aberto, alvo, escolher, parado, setParado } = usePassagem(
    casos.length,
  )
  const router = useRouter()
  const caso = casos[aberto]
  const ir = (indice: number) =>
    escolher(Math.min(Math.max(indice, 0), casos.length - 1))
  const teclas = teclado(aberto, ir)
  const abrir = (indice: number) => {
    const alvo = casos[indice]
    if (indice !== aberto || !alvo) return ir(indice)
    router.push({ params: { slug: alvo.slug }, pathname: "/casos/[slug]" })
  }

  return (
    <div
      ref={alvo}
      onBlur={() => setParado(false)}
      onFocus={() => setParado(true)}
      onPointerEnter={() => setParado(true)}
      onPointerLeave={() => setParado(false)}
    >
      <div className="mx-auto mb-12 flex max-w-7xl items-end justify-between gap-6 px-4 lg:px-8">
        {cabecalho}
        <Setas aberto={aberto} ir={ir} rotulos={rotulos} total={casos.length} />
      </div>
      <div className="flex h-80 gap-2 recuo-conteudo md:h-112 md:gap-3">
        {casos.map((item, indice) => (
          <Painel
            key={item.slug}
            aberto={aberto}
            caso={item}
            indice={indice}
            onAbrir={() => abrir(indice)}
            onTecla={teclas}
            rotuloLer={rotulos.ler}
            total={casos.length}
          />
        ))}
      </div>
      {caso ? (
        <Descricao
          key={caso.slug}
          anunciar={parado}
          caso={caso}
          ler={rotulos.ler}
        />
      ) : null}
    </div>
  )
}
