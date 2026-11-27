"use client"

import type { ReactNode } from "react"

import gsap from "gsap"
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"

import { type Animacao, animacaoDoEndereco, ENTRADAS } from "./busca-animacoes"

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

/**
 * A entrada dos resultados, uma depois da outra, na animação escolhida
 * (busca-animacoes.ts). Só anima quando o conjunto muda; quem pede menos
 * movimento vê o resultado direto.
 */
function useChegada(chaves: string, animacao: Animacao) {
  const lista = useRef<HTMLUListElement>(null)
  useLayoutEffect(() => {
    const itens = [...(lista.current?.children ?? [])]
    if (itens.length === 0) return
    if (!matchMedia("(prefers-reduced-motion: no-preference)").matches) return
    const tl = gsap.timeline()
    for (const [indice, item] of itens.entries()) {
      ENTRADAS[animacao]({ indice, item, tl, total: itens.length })
    }
    return () => {
      tl.kill()
    }
  }, [chaves, animacao])
  return lista
}

const semAviso = () => () => {}

/** Rolo da roleta: outras tecnologias passam até parar no nome certo. */
function Rolo({ nome, outros }: { nome: string; outros: string[] }) {
  return (
    <span className="relative inline-block h-lh overflow-hidden">
      <span className="sr-only">{nome}</span>
      <span aria-hidden className="invisible">
        {nome}
      </span>
      <span
        aria-hidden
        data-rolo
        className="absolute inset-x-0 top-0 flex flex-col"
      >
        {[...outros, nome].map((texto, indice) => (
          <span key={indice} className="h-lh whitespace-nowrap">
            {texto}
          </span>
        ))}
      </span>
    </span>
  )
}

/** Oito nomes de outras tecnologias para o rolo, sempre os mesmos por item. */
function sorteio(
  todas: string[],
  { indice, nome }: { indice: number; nome: string },
) {
  const outras = todas.filter((outra) => outra !== nome)
  return Array.from(
    { length: 8 },
    (_, k) => outras[(indice * 5 + k * 7) % outras.length] ?? nome,
  )
}

/** As tecnologias achadas, paradas e já na cor da marca. */
function Resultados({
  achadas,
  rotulos,
  termo,
  todas,
}: {
  achadas: MarcaBusca[]
  rotulos: Rotulos
  termo: string
  /** Todos os nomes, para o rolo da roleta. */
  todas: string[]
}) {
  const animacao = useSyncExternalStore(
    semAviso,
    animacaoDoEndereco,
    () => "foco" as const,
  )
  const lista = useChegada(achadas.map((marca) => marca.chave).join(), animacao)
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 overflow-hidden px-4 py-4">
      <p aria-hidden className="font-mono text-xs text-muted-foreground">
        {resumo(achadas.length, { rotulos, termo })}
      </p>
      <ul
        ref={lista}
        className="flex flex-wrap justify-center gap-x-10 gap-y-4"
      >
        {achadas.map((marca, indice) => (
          <li
            key={marca.chave}
            data-marca={marca.chave}
            className="flex items-center gap-3 text-2xl font-medium cor-marca md:text-3xl"
          >
            <svg
              aria-hidden
              viewBox={`0 0 ${marca.caixa} ${marca.caixa}`}
              className="size-6 shrink-0 fill-current md:size-8"
            >
              <path d={marca.path} />
            </svg>
            {animacao === "roleta" ? (
              <Rolo
                nome={marca.nome}
                outros={sorteio(todas, { indice, nome: marca.nome })}
              />
            ) : (
              marca.nome
            )}
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
        className="mx-auto mt-8 flex w-fit max-w-full items-center gap-2 border-b border-border px-1 pb-1 font-mono text-sm transition-colors focus-within:border-vinho-claro"
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
          // Largura do texto (fonte mono): o conjunto fica centrado, sem sobra.
          size={Math.max(termo.length, rotulos.campo.length)}
          className="min-w-0 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/35"
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
          <Resultados
            achadas={achadas}
            rotulos={rotulos}
            termo={termo}
            todas={marcas.map((marca) => marca.nome)}
          />
        ) : null}
      </div>
    </>
  )
}
