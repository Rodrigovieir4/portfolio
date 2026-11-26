"use client"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@portfolio/ui/components/toggle-group"
import { useState } from "react"

import { cn } from "@/lib/utils"

export interface Certificado {
  ano: string
  categoria: string
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
      <div className="flex aspect-video items-center justify-center rounded-xl bg-muted px-2 text-center font-mono text-xs text-muted-foreground">
        {item.emissor}
      </div>
      <span className="mt-3 text-sm font-medium text-pretty sm:text-base">
        {item.nome}
      </span>
      <span className="mt-1 font-mono text-xs text-muted-foreground">
        {item.emissor}
        {item.ano ? `, ${item.ano}` : ""}
      </span>
    </>
  )
  const classe =
    "flex flex-col rounded-2xl border border-border bg-card p-3 transition-colors sm:p-4"

  if (!item.link) return <li className={classe}>{conteudo}</li>
  return (
    <li>
      <a
        href={item.link}
        target="_blank"
        rel="noreferrer"
        aria-label={`${abrir}: ${item.nome}`}
        className={cn(classe, "h-full hover:border-vinho-claro")}
      >
        {conteudo}
      </a>
    </li>
  )
}

export function CertificadosGrade({
  itens,
  rotulos,
}: {
  itens: Certificado[]
  rotulos: Rotulos
}) {
  const [filtro, setFiltro] = useState(TODOS)
  const visiveis =
    filtro === TODOS ? itens : itens.filter((i) => i.categoria === filtro)
  const categorias = Object.keys(rotulos.categorias)

  return (
    <>
      <ToggleGroup
        type="single"
        value={filtro}
        // Clicar de novo na escolhida não desmarca: sempre há um filtro.
        onValueChange={(valor) => valor && setFiltro(valor)}
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
