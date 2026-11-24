"use client"

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
  todos: string
}

function Filtro({
  ativo,
  aoEscolher,
  contagem,
  rotulo,
}: {
  ativo: boolean
  aoEscolher: () => void
  contagem: number
  rotulo: string
}) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={aoEscolher}
      className={cn(
        "h-11 rounded-full border border-border px-4 text-sm transition-colors lg:h-9",
        ativo
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {rotulo} ({contagem})
    </button>
  )
}

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
  const [filtro, setFiltro] = useState<null | string>(null)
  const visiveis = filtro
    ? itens.filter((item) => item.categoria === filtro)
    : itens
  const categorias = Object.keys(rotulos.categorias)

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-3">
        <Filtro
          ativo={filtro === null}
          aoEscolher={() => setFiltro(null)}
          contagem={itens.length}
          rotulo={rotulos.todos}
        />
        {categorias.map((categoria) => (
          <Filtro
            key={categoria}
            ativo={filtro === categoria}
            aoEscolher={() => setFiltro(categoria)}
            contagem={itens.filter((i) => i.categoria === categoria).length}
            rotulo={rotulos.categorias[categoria] ?? categoria}
          />
        ))}
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {visiveis.map((item) => (
          <Cartao key={item.id} item={item} abrir={rotulos.abrir} />
        ))}
      </ul>
    </>
  )
}
