"use client"

import type { ReactNode } from "react"

import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@portfolio/ui"
import { Mail } from "lucide-react"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import { LaserFlow } from "@/components/reactbits/laser-flow"
import { cn } from "@/lib/utils"

import { aguentaShader } from "./capacidade"

/**
 * Opções do contato minimalista, para o Rodrigo escolher (27/11: "só vamos
 * conversar" e os contatos). Troca pelo endereço: `?contato=simples` (a
 * padrão), `laser`, `revelar`, `orbita` ou `lista`. Escolhida uma, as outras
 * saem deste arquivo.
 */
const MOCKS = ["simples", "laser", "revelar", "orbita", "lista"] as const
type Mock = (typeof MOCKS)[number]

export interface Canal {
  handle: string
  nome: string
  platform: string
  url: string
}

const ICONES: Record<string, ReactNode> = {
  email: <Mail className="size-5" />,
  github: <GithubIcon className="size-5" />,
  linkedin: <LinkedinIcon className="size-5" />,
  whatsapp: <WhatsappIcon className="size-5" />,
}

const semAviso = () => () => {}
function mockDoEndereco(): Mock {
  const pedido = new URLSearchParams(location.search).get("contato")
  return MOCKS.find((nome) => nome === pedido) ?? "simples"
}

/** Abre em nova aba, menos o e-mail. */
const alvo = (canal: Canal) =>
  canal.platform === "email" ? {} : { rel: "noreferrer", target: "_blank" }

/** O título em duas linhas: a primeira cheia, a segunda em contorno. */
function Titulo({
  animar = true,
  className,
  titulo,
}: {
  animar?: boolean
  className?: string
  titulo: string
}) {
  const [primeira = "", ...resto] = titulo.split(" ")
  return (
    <h2
      data-mov={animar ? "contato-titulo" : undefined}
      className={cn(
        className ?? "texto-chamada",
        "font-semibold tracking-tight",
      )}
    >
      <span className="block">{primeira}</span>
      {resto.length > 0 ? (
        <span className="block texto-contorno-claro">{resto.join(" ")}</span>
      ) : null}
    </h2>
  )
}

/** Ícone redondo que ganha a cor do canal e mostra o contato no hover. */
function Bolinha({ canal }: { canal: Canal }) {
  return (
    <a
      href={canal.url}
      {...alvo(canal)}
      data-marca={canal.platform}
      aria-label={`${canal.nome}: ${canal.handle}`}
      className="group relative grid size-14 place-items-center rounded-full border border-border text-muted-foreground transition-colors duration-300 hover:border-current hover:cor-marca"
    >
      {ICONES[canal.platform]}
      <span className="pointer-events-none absolute top-full mt-3 font-mono text-xs whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        {canal.handle}
      </span>
    </a>
  )
}

function Simples({ canais, titulo }: { canais: Canal[]; titulo: string }) {
  return (
    <div className="flex flex-col items-center gap-14 text-center">
      <Titulo titulo={titulo} />
      <div className="flex flex-wrap justify-center gap-5 pb-8">
        {canais.map((canal) => (
          <Bolinha key={canal.platform} canal={canal} />
        ))}
      </div>
    </div>
  )
}

/** Contatos em linha, discretos, em mono, com seta. */
function Links({ canais }: { canais: Canal[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 font-mono text-sm">
      {canais.map((canal) => (
        <a
          key={canal.platform}
          href={canal.url}
          {...alvo(canal)}
          data-marca={canal.platform}
          className="flex items-center gap-2 text-muted-foreground transition-colors hover:cor-marca"
        >
          {ICONES[canal.platform]}
          {canal.nome} ↗
        </a>
      ))}
    </div>
  )
}

/** O laser do topo do site cai sobre o título quando a seção aparece. */
function Laser({ canais, titulo }: { canais: Canal[]; titulo: string }) {
  const caixa = useRef<HTMLDivElement>(null)
  const chao = useRef<HTMLDivElement>(null)
  const [visto, setVisto] = useState(false)
  const shader = useSyncExternalStore(semAviso, aguentaShader, () => false)
  useEffect(() => {
    const no = caixa.current
    if (!no) return
    const olho = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setVisto(true)
      },
      { threshold: 0.3 },
    )
    olho.observe(no)
    return () => olho.disconnect()
  }, [])
  if (!shader) return <Simples canais={canais} titulo={titulo} />
  return (
    <div
      ref={caixa}
      className="relative flex flex-col items-center gap-14 pt-40 text-center"
    >
      {visto ? (
        <LaserFlow
          aria-hidden
          beamPosition={0.5}
          className="pointer-events-none absolute inset-x-0 -top-40 bottom-0 -z-10"
          color="#e0425f"
          dpr={1}
          intro
          surfaceRef={chao}
        />
      ) : null}
      <div ref={chao}>
        <Titulo titulo={titulo} />
      </div>
      <div className="pb-8">
        <Links canais={canais} />
      </div>
    </div>
  )
}

const SINAIS = "!<>-_\\/[]{}=+*^?#0123456789"

/** O texto se decifra: começa embaralhado e as letras vão assentando. */
function useDecifrar(texto: string, ativo: boolean) {
  const [atual, setAtual] = useState(texto)
  useEffect(() => {
    if (!ativo) return
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let passo = 0
    const id = window.setInterval(() => {
      passo += 1
      setAtual(
        [...texto]
          .map((letra, i) =>
            letra === " " || i < passo / 2
              ? letra
              : (SINAIS[Math.floor(Math.random() * SINAIS.length)] ?? letra),
          )
          .join(""),
      )
      if (passo / 2 >= texto.length) window.clearInterval(id)
    }, 35)
    return () => window.clearInterval(id)
  }, [texto, ativo])
  return atual
}

function LinkDecifrado({ canal }: { canal: Canal }) {
  const [sobre, setSobre] = useState(0)
  const texto = useDecifrar(canal.handle, sobre > 0)
  return (
    <a
      href={canal.url}
      {...alvo(canal)}
      data-marca={canal.platform}
      onPointerEnter={() => setSobre((n) => n + 1)}
      className="flex items-center gap-3 font-mono text-sm text-muted-foreground transition-colors hover:cor-marca md:text-base"
    >
      {ICONES[canal.platform]}
      <span key={sobre}>{texto}</span>
    </a>
  )
}

function Revelar({ canais, titulo }: { canais: Canal[]; titulo: string }) {
  const caixa = useRef<HTMLDivElement>(null)
  const [visto, setVisto] = useState(false)
  const texto = useDecifrar(titulo, visto)
  useEffect(() => {
    const no = caixa.current
    if (!no) return
    const olho = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setVisto(true)
      },
      { threshold: 0.4 },
    )
    olho.observe(no)
    return () => olho.disconnect()
  }, [])
  return (
    <div ref={caixa} className="flex flex-col gap-12 pb-8">
      <Titulo
        animar={false}
        titulo={visto ? texto : titulo}
        className="font-mono texto-chamada"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {canais.map((canal) => (
          <LinkDecifrado key={canal.platform} canal={canal} />
        ))}
      </div>
    </div>
  )
}

/** Classes por extenso para o Tailwind achar (cada uma, um ponto da volta). */
const ORBITAS = ["orbita-1", "orbita-2", "orbita-3", "orbita-4"]

/** Os ícones giram numa elipse em volta do título; param no hover. */
function Orbita({ canais, titulo }: { canais: Canal[]; titulo: string }) {
  return (
    <div className="group/orbita relative grid min-h-112 place-items-center text-center md:min-h-160">
      <Titulo titulo={titulo} />
      {canais.map((canal, indice) => (
        <span
          key={canal.platform}
          className={cn(
            "absolute top-0 left-0 orbita group-hover/orbita:[animation-play-state:paused]",
            ORBITAS[indice],
          )}
        >
          <Bolinha canal={canal} />
        </span>
      ))}
    </div>
  )
}

/** Título à esquerda; à direita, os nomes dos canais em letras grandes. */
function Lista({ canais, titulo }: { canais: Canal[]; titulo: string }) {
  return (
    <div className="grid items-end gap-12 pb-8 lg:grid-cols-2">
      <Titulo titulo={titulo} className="text-7xl leading-none md:text-8xl" />
      <ul className="flex flex-col">
        {canais.map((canal) => (
          <li key={canal.platform} data-marca={canal.platform}>
            <a
              href={canal.url}
              {...alvo(canal)}
              className="group flex items-baseline justify-between gap-4 border-b border-border py-4 transition-colors hover:cor-marca"
            >
              <span className="text-4xl font-semibold tracking-tight md:text-5xl">
                {canal.nome}
              </span>
              <span className="translate-x-2 font-mono text-xs text-muted-foreground opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                {canal.handle} ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

const VERSOES: Record<
  Mock,
  (props: { canais: Canal[]; titulo: string }) => ReactNode
> = {
  laser: Laser,
  lista: Lista,
  orbita: Orbita,
  revelar: Revelar,
  simples: Simples,
}

export function ContatoMocks(props: { canais: Canal[]; titulo: string }) {
  const mock = useSyncExternalStore(
    semAviso,
    mockDoEndereco,
    () => "simples" as const,
  )
  const Versao = VERSOES[mock]
  return <Versao {...props} />
}
