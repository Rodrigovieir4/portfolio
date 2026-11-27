"use client"

import type { ReactNode, RefObject } from "react"

import gsap from "gsap"
import { useEffect, useId, useRef, useState } from "react"

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

/** Quanto a faixa andou, de 0 a 1 de uma cópia, e como pôr ela num ponto. */
function posicao(animacao: Animation) {
  const duracao = Number(animacao.effect?.getTiming().duration) || 1
  const reversa = animacao.effect?.getTiming().direction === "reverse"
  const agora = Number(animacao.currentTime) || 0
  const volta = Math.floor(agora / duracao) * duracao
  const andou = (agora % duracao) / duracao
  return {
    andou: reversa ? 1 - andou : andou,
    ir: (fracao: number) => {
      const resto = ((fracao % 1) + 1) % 1
      Object.assign(animacao, {
        currentTime: volta + (reversa ? 1 - resto : resto) * duracao,
      })
    },
    reversa,
  }
}

/**
 * Onde a faixa tem de parar (em pixels andados) para a primeira achada ficar
 * no centro, depois de pelo menos uma volta inteira no sentido em que ela
 * anda. Sem achada nessa faixa, para depois de meia volta.
 */
function alvo(
  faixa: HTMLElement,
  { agora, copia, reversa }: { agora: number; copia: number; reversa: boolean },
) {
  const caixa = faixa.getBoundingClientRect()
  const meio = (faixa.parentElement?.clientWidth ?? 0) / 2
  const centros = [...faixa.querySelectorAll('[data-achada="true"]')].map(
    (item) => {
      const r = item.getBoundingClientRect()
      return r.left - caixa.left + r.width / 2 - meio
    },
  )
  if (centros.length === 0) return agora + (reversa ? -0.5 : 0.5) * copia
  const voltas = centros.map((centro) => {
    const k = reversa
      ? Math.floor((agora - copia - centro) / copia)
      : Math.ceil((agora + copia - centro) / copia)
    return centro + k * copia
  })
  return reversa ? Math.max(...voltas) : Math.min(...voltas)
}

/**
 * Ao buscar, as faixas aceleram, desaceleram e param; a que tem resultado
 * para com a primeira achada no centro (pedido do Rodrigo, 27/11). Ficam
 * paradas enquanto houver busca e voltam a girar quando ela some. Sem
 * movimento pedido no sistema, as faixas já não andam: só acendem as cores.
 */
function useGiro(caixa: RefObject<HTMLDivElement | null>, chaves: string) {
  useEffect(() => {
    const faixas = [
      ...(caixa.current?.querySelectorAll<HTMLElement>('[data-mov="faixa"]') ??
        []),
    ]
    if (!chaves) {
      for (const faixa of faixas) faixa.removeAttribute("data-parada")
      return
    }
    const giros = faixas.flatMap((faixa) => {
      const animacao = faixa.getAnimations()[0]
      if (!animacao) return []
      faixa.setAttribute("data-parada", "")
      const copia = faixa.scrollWidth / 2
      const { andou, ir, reversa } = posicao(animacao)
      const estado = { px: andou * copia }
      const fim = alvo(faixa, { agora: estado.px, copia, reversa })
      return gsap.to(estado, {
        duration: 2.6,
        ease: "power3.inOut",
        onUpdate: () => ir(estado.px / copia),
        px: fim,
      })
    })
    return () => {
      for (const giro of giros) giro.kill()
    }
  }, [caixa, chaves])
}

/** Acende as achadas em todas as cópias das faixas, antes do giro medir. */
function useAcesas(caixa: RefObject<HTMLDivElement | null>, chaves: string) {
  useEffect(() => {
    const nomes = new Set(chaves.split(","))
    for (const item of caixa.current?.querySelectorAll<HTMLElement>(
      "[data-marca]",
    ) ?? []) {
      item.dataset.achada = String(nomes.has(item.dataset.marca ?? ""))
    }
  }, [caixa, chaves])
}

/**
 * Busca da stack (pedido do Rodrigo, 27/11: "muito clean, muito
 * minimalista"): uma linha de terminal, `❯ grep` e um campo só com
 * sublinhado. As achadas acendem na cor da marca nas próprias faixas, que
 * giram até parar nelas; vazio (ou Esc), as cores somem e as faixas voltam.
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
  const caixa = useRef<HTMLDivElement>(null)
  const busca = normalizar(termo)
  const achadas = busca ? marcas.filter((marca) => bate(marca, busca)) : []
  const chaves = busca ? achadas.map((marca) => marca.chave).join() || "-" : ""

  useAcesas(caixa, chaves)
  useGiro(caixa, chaves)

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
      {/* A contagem, visível e lida pelo leitor de tela, sem a lista. */}
      <p
        aria-live="polite"
        className="mt-3 h-4 text-center font-mono text-xs text-muted-foreground"
      >
        {busca ? resumo(achadas.length, { rotulos, termo }) : ""}
      </p>
      <div ref={caixa} className="mt-6">
        {children}
      </div>
    </>
  )
}
