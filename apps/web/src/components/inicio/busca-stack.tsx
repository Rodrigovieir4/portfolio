"use client"

import type { ReactNode } from "react"

import { useId, useState } from "react"

export interface MarcaBusca {
  /** viewBox do ícone: 24 no Simple Icons, 128 no Devicon. */
  caixa: number
  /** Liga a cor da marca (`[data-marca]` no globals.css). */
  chave: string
  nome: string
  path: string
}

interface Rotulos {
  campo: string
  nada: string
  resultados: string
}

/** Outros nomes que alguém pode digitar para achar a tecnologia. */
const APELIDOS: Record<string, string[]> = {
  "github-actions": ["ci", "gha", "github"],
  javascript: ["js"],
  next: ["nextjs"],
  node: ["nodejs"],
  postgresql: ["postgres", "sql"],
  "react-native": ["rn", "mobile"],
  tailwind: ["css"],
  typescript: ["ts"],
}

/** Minúsculas, sem acento, sem ponto nem espaço: "Node.js" vira "nodejs". */
function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
}

function bate(marca: MarcaBusca, busca: string) {
  return [marca.nome, ...(APELIDOS[marca.chave] ?? [])].some((nome) =>
    normalizar(nome).includes(busca),
  )
}

function resumo(
  total: number,
  { rotulos, termo }: { rotulos: Rotulos; termo: string },
) {
  return total > 0
    ? `${total} ${rotulos.resultados}`
    : `${rotulos.nada} "${termo}"`
}

/** As tecnologias achadas, paradas e já na cor da marca. */
function Resultados({
  achadas,
  rotulos,
  termo,
}: {
  achadas: MarcaBusca[]
  rotulos: Rotulos
  termo: string
}) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4">
      <p aria-hidden className="font-mono text-xs text-muted-foreground">
        {resumo(achadas.length, { rotulos, termo })}
      </p>
      <ul className="flex flex-wrap justify-center gap-x-10 gap-y-4">
        {achadas.map((marca) => (
          <li
            key={marca.chave}
            data-marca={marca.chave}
            className="flex animate-in items-center gap-3 text-2xl font-medium cor-marca duration-300 fade-in md:text-3xl"
          >
            <svg
              aria-hidden
              viewBox={`0 0 ${marca.caixa} ${marca.caixa}`}
              className="size-6 shrink-0 fill-current md:size-8"
            >
              <path d={marca.path} />
            </svg>
            {marca.nome}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Busca da stack (pedido do Rodrigo, 27/11: "muito clean, muito
 * minimalista"): uma linha de terminal, `❯ grep` e um campo só com
 * sublinhado. Com texto, as faixas dão lugar às tecnologias achadas; vazio
 * (ou Esc), as faixas voltam. As faixas seguem montadas, só escondidas.
 */
export function BuscaStack({
  children,
  marcas,
  rotulos,
}: {
  /** As faixas que giram. */
  children: ReactNode
  marcas: MarcaBusca[]
  rotulos: Rotulos
}) {
  const [termo, setTermo] = useState("")
  const id = useId()
  const busca = normalizar(termo)
  const achadas = busca ? marcas.filter((marca) => bate(marca, busca)) : []

  return (
    <>
      <label
        htmlFor={id}
        className="mx-auto mt-8 flex w-full max-w-xs items-center gap-2 border-b border-border px-1 pb-1 font-mono text-sm transition-colors focus-within:border-vinho-claro"
      >
        <span aria-hidden className="text-vinho-claro">
          ❯ grep
        </span>
        <input
          id={id}
          type="text"
          enterKeyHint="search"
          value={termo}
          onChange={(evento) => setTermo(evento.target.value)}
          onKeyDown={(evento) => {
            if (evento.key === "Escape") setTermo("")
          }}
          placeholder={rotulos.campo}
          aria-label={rotulos.campo}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/60"
        />
      </label>
      {/* Mesma altura com ou sem busca: a página não pula ao digitar. */}
      {/* O leitor de tela ouve só a contagem, não a lista a cada letra. */}
      <p aria-live="polite" className="sr-only">
        {busca ? resumo(achadas.length, { rotulos, termo }) : ""}
      </p>
      <div className="mt-10 min-h-40">
        <div hidden={Boolean(busca)}>{children}</div>
        {busca ? (
          <Resultados achadas={achadas} rotulos={rotulos} termo={termo} />
        ) : null}
      </div>
    </>
  )
}
