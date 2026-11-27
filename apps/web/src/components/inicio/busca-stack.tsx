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
 * Quantos itens tem uma lista da faixa: as cópias que fazem o laço repetem
 * esse bloco (só a primeira é lida pelo leitor de tela).
 */
function tamanhoDoBloco(faixa: HTMLElement) {
  return faixa.querySelectorAll(':scope > li:not([aria-hidden="true"])').length
}

/**
 * Junta as achadas no começo de cada bloco (CSS `order`), igual em todas as
 * cópias para o laço seguir sem emenda; sem busca, volta a ordem original.
 */
function arrumar(faixa: HTMLElement, buscando: boolean) {
  const itens = [...faixa.children] as HTMLElement[]
  const n = tamanhoDoBloco(faixa) || itens.length
  const bloco = itens.slice(0, n)
  const acesa = (item: HTMLElement) => item.dataset.achada === "true"
  const ordem = [...bloco.filter(acesa), ...bloco.filter((i) => !acesa(i))]
  const lugar = new Map(ordem.map((item, i) => [item.dataset.marca, i]))
  for (const [i, item] of itens.entries()) {
    const novo = Math.floor(i / n) * n + (lugar.get(item.dataset.marca) ?? 0)
    if (buscando) item.style.setProperty("order", String(novo))
    else item.style.removeProperty("order")
  }
  // No celular, itens menores e mais juntos (globals.css), para caber mais.
  faixa.toggleAttribute("data-junta", buscando)
}

/**
 * Onde a faixa tem de parar (em pixels andados) para o grupo de achadas ficar
 * no centro, embaixo da busca (ou encostado na margem, se não couber),
 * depois de pelo menos uma volta no sentido em que ela anda. Sem achada
 * nessa faixa, para depois de meia volta.
 */
function alvo(
  faixa: HTMLElement,
  { agora, copia, reversa }: { agora: number; copia: number; reversa: boolean },
) {
  const caixa = faixa.getBoundingClientRect()
  const meio = (faixa.parentElement?.clientWidth ?? 0) / 2
  const n = tamanhoDoBloco(faixa) || 1
  const grupos = new Map<number, DOMRect[]>()
  for (const [i, item] of [...faixa.children].entries()) {
    if ((item as HTMLElement).dataset.achada !== "true") continue
    const bloco = Math.floor(i / n)
    grupos.set(bloco, [
      ...(grupos.get(bloco) ?? []),
      item.getBoundingClientRect(),
    ])
  }
  const centros = [...grupos.values()].map((rs) => {
    const esquerda = Math.min(...rs.map((r) => r.left)) - caixa.left
    const direita = Math.max(...rs.map((r) => r.right)) - caixa.left
    // Grupo mais largo que a tela (celular): o começo dele encosta na
    // margem, e aparecem inteiras todas as que couberem.
    if (direita - esquerda > meio * 2 - 32) return esquerda - 16
    return (esquerda + direita) / 2 - meio
  })
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
 * Ao buscar, as faixas aceleram; no auge, as achadas se juntam (a troca some
 * na velocidade); depois desaceleram e param com o grupo no centro, embaixo
 * da busca (pedido do Rodrigo, 27/11). Ficam paradas enquanto houver busca
 * e voltam a girar, na ordem original, quando ela some. Sem movimento pedido
 * no sistema, as faixas já não andam: só acendem as cores.
 */
function useGiro(caixa: RefObject<HTMLDivElement | null>, chaves: string) {
  useEffect(() => {
    const faixas = [
      ...(caixa.current?.querySelectorAll<HTMLElement>('[data-mov="faixa"]') ??
        []),
    ]
    if (!chaves) {
      for (const faixa of faixas) {
        arrumar(faixa, false)
        faixa.removeAttribute("data-parada")
      }
      return
    }
    const giros = faixas.flatMap((faixa) => {
      const animacao = faixa.getAnimations()[0]
      if (!animacao) {
        arrumar(faixa, true)
        return []
      }
      faixa.setAttribute("data-parada", "")
      let copia = faixa.scrollWidth / 2
      const { andou, ir, reversa } = posicao(animacao)
      const estado = { px: andou * copia }
      const tl = gsap.timeline({ onUpdate: () => ir(estado.px / copia) })
      tl.to(estado, {
        duration: 0.9,
        ease: "power2.in",
        px: estado.px + (reversa ? -0.7 : 0.7) * copia,
      })
      tl.call(() => {
        arrumar(faixa, true)
        // A faixa pode ter mudado de largura (celular): mede de novo.
        const nova = faixa.scrollWidth / 2
        estado.px = (estado.px / copia) * nova
        copia = nova
        const fim = alvo(faixa, { agora: estado.px, copia, reversa })
        tl.to(estado, { duration: 1.8, ease: "power3.out", px: fim })
      })
      return tl
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
