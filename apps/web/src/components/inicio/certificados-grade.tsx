"use client"

import { Card } from "@portfolio/ui/components/card"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@portfolio/ui/components/toggle-group"
import gsap from "gsap"
import { Flip } from "gsap/Flip"
import Image from "next/image"
import { type RefObject, useLayoutEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

export interface Certificado {
  ano: string
  categoria: string
  /** Primeira página do PDF, em public/certificados/capas. */
  capa: null | string
  emissor: string
  id: string
  link: null | string
  nome: string
}

interface Rotulos {
  abrir: string
  categorias: Record<string, string>
  titulo: string
  todos: string
}

/** Valor do filtro que mostra todas as categorias. */
const TODOS = "todos"

// Pílula do filtro: contorno discreto; a escolhida fica preenchida.
const FILTRO =
  "h-11 rounded-full border border-border px-4 font-normal text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground lg:h-9"

function Cartao({ item, abrir }: { abrir: string; item: Certificado }) {
  const conteudo = (
    <>
      {item.capa ? (
        // A foto do certificado (pedido do Rodrigo, 27/11). Decorativa: o nome
        // vem logo abaixo e o link já diz o que abre.
        <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted">
          <Image
            src={item.capa}
            alt=""
            fill
            sizes="(min-width: 1024px) 18rem, 50vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-4/3 items-center justify-center rounded-xl bg-muted px-2 text-center font-mono text-xs text-muted-foreground">
          {item.emissor}
        </div>
      )}
      <span className="mt-3 text-sm font-medium text-pretty sm:text-base">
        {item.nome}
      </span>
      <span className="mt-1 font-mono text-xs text-muted-foreground">
        {item.emissor}
        {item.ano ? `, ${item.ano}` : ""}
      </span>
    </>
  )
  const classe = "gap-0 p-3 sm:p-4"

  if (!item.link) {
    return (
      <Card asChild variant="contorno" className={classe}>
        <li>{conteudo}</li>
      </Card>
    )
  }
  return (
    <li>
      <Card asChild variant="contorno" className={cn(classe, "h-full")}>
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          aria-label={`${abrir}: ${item.nome}`}
        >
          {conteudo}
        </a>
      </Card>
    </li>
  )
}

gsap.registerPlugin(Flip)

/**
 * Troca de filtro com movimento: os cartões que ficam deslizam até o lugar
 * novo e os que chegam sobem saindo do transparente (GSAP Flip). Guarda o
 * retrato da grade antes da troca e anima depois que o React redesenha.
 * Sem movimento pedido no sistema, a grade só troca.
 */
function useTrocaAnimada(lista: RefObject<HTMLUListElement | null>) {
  const antes = useRef<Flip.FlipState | null>(null)

  useLayoutEffect(() => {
    const estado = antes.current
    antes.current = null
    if (!estado || !lista.current) return
    Flip.from(estado, {
      absolute: true,
      duration: 0.6,
      ease: "power3.inOut",
      onEnter: (chegando) =>
        gsap.fromTo(
          chegando,
          { opacity: 0, scale: 0.94, y: 24 },
          {
            delay: 0.2,
            duration: 0.5,
            opacity: 1,
            scale: 1,
            stagger: 0.04,
            y: 0,
          },
        ),
      targets: lista.current.children,
    })
  })

  return () => {
    const movimento = matchMedia("(prefers-reduced-motion: no-preference)")
    if (lista.current && movimento.matches) {
      antes.current = Flip.getState(lista.current.children)
    }
  }
}

export function CertificadosGrade({
  itens,
  rotulos,
}: {
  itens: Certificado[]
  rotulos: Rotulos
}) {
  const [filtro, setFiltro] = useState(TODOS)
  const lista = useRef<HTMLUListElement>(null)
  const guardarGrade = useTrocaAnimada(lista)
  const visiveis =
    filtro === TODOS ? itens : itens.filter((i) => i.categoria === filtro)
  const categorias = Object.keys(rotulos.categorias)

  return (
    <>
      <ToggleGroup
        type="single"
        value={filtro}
        onValueChange={(valor) => {
          // Clicar de novo na escolhida não desmarca: sempre há um filtro.
          if (!valor) return
          guardarGrade()
          setFiltro(valor)
        }}
        spacing={3}
        aria-label={rotulos.titulo}
        className="mt-8 w-full flex-wrap"
      >
        <ToggleGroupItem value={TODOS} className={FILTRO}>
          {rotulos.todos} ({itens.length})
        </ToggleGroupItem>
        {categorias.map((categoria) => (
          <ToggleGroupItem key={categoria} value={categoria} className={FILTRO}>
            {rotulos.categorias[categoria] ?? categoria} (
            {itens.filter((i) => i.categoria === categoria).length})
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ul
        ref={lista}
        data-mov="subir"
        className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
      >
        {visiveis.map((item) => (
          <Cartao key={item.id} item={item} abrir={rotulos.abrir} />
        ))}
      </ul>
    </>
  )
}
