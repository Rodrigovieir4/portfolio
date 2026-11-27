"use client"

import { Button } from "@portfolio/ui/components/button"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@portfolio/ui/components/toggle-group"
import gsap from "gsap"
import { Flip } from "gsap/Flip"
import { ArrowLeft, ArrowRight } from "lucide-react"
import {
  type RefObject,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"

import {
  type Certificado,
  type RotulosCartao,
  Cartao,
} from "./certificado-cartao"

interface Rotulos extends RotulosCartao {
  anterior: string
  categorias: Record<string, string>
  pagina: string
  paginacao: string
  proxima: string
  titulo: string
  todos: string
}

/** Valor do filtro que mostra todas as categorias. */
const TODOS = "todos"

// Pílula do filtro: contorno discreto; a escolhida fica preenchida.
const FILTRO =
  "h-11 rounded-full border border-border px-4 font-normal text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground lg:h-9"

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

/**
 * Duas linhas por página (pedido do Rodrigo, 27/11): 8 cartões com 4 colunas
 * (lg) e 4 com 2. No servidor vale 8; o celular ajusta ao hidratar.
 */
const LARGO = "(min-width: 64rem)"
function usePorPagina() {
  return useSyncExternalStore(
    (avisar) => {
      const consulta = matchMedia(LARGO)
      consulta.addEventListener("change", avisar)
      return () => consulta.removeEventListener("change", avisar)
    },
    () => (matchMedia(LARGO).matches ? 8 : 4),
    () => 8,
  )
}

/** A página atual e o pedaço da lista que cabe nela. */
function usePaginas(filtrados: Certificado[]) {
  const [pagina, setPagina] = useState(0)
  const porPagina = usePorPagina()
  const paginas = Math.ceil(filtrados.length / porPagina)
  // Ao passar do computador para o celular, a página pode deixar de existir.
  const atual = Math.min(pagina, Math.max(paginas - 1, 0))
  const visiveis = filtrados.slice(atual * porPagina, (atual + 1) * porPagina)
  return { atual, paginas, setPagina, visiveis }
}

/** Anterior, os números das páginas e próxima. Some com uma página só. */
function Paginacao({
  ir,
  pagina,
  paginas,
  rotulos,
}: {
  ir: (pagina: number) => void
  pagina: number
  paginas: number
  rotulos: Rotulos
}) {
  if (paginas < 2) return null
  return (
    <nav
      aria-label={rotulos.paginacao}
      className="mt-8 flex items-center justify-center gap-2"
    >
      <Button
        variant="secondary"
        size="icon-lg"
        aria-label={rotulos.anterior}
        disabled={pagina === 0}
        onClick={() => ir(pagina - 1)}
      >
        <ArrowLeft />
      </Button>
      {Array.from({ length: paginas }, (_, indice) => (
        <Button
          key={indice}
          variant={indice === pagina ? "default" : "ghost"}
          size="icon-lg"
          aria-label={`${rotulos.pagina} ${indice + 1}`}
          aria-current={indice === pagina ? "page" : undefined}
          onClick={() => ir(indice)}
          className="font-mono"
        >
          {indice + 1}
        </Button>
      ))}
      <Button
        variant="secondary"
        size="icon-lg"
        aria-label={rotulos.proxima}
        disabled={pagina === paginas - 1}
        onClick={() => ir(pagina + 1)}
      >
        <ArrowRight />
      </Button>
    </nav>
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
  const lista = useRef<HTMLUListElement>(null)
  const guardarGrade = useTrocaAnimada(lista)
  const filtrados =
    filtro === TODOS ? itens : itens.filter((i) => i.categoria === filtro)
  const { atual, paginas, setPagina, visiveis } = usePaginas(filtrados)
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
          setPagina(0)
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
          <Cartao key={item.id} item={item} rotulos={rotulos} />
        ))}
      </ul>
      <Paginacao
        ir={(nova) => {
          guardarGrade()
          setPagina(nova)
        }}
        pagina={atual}
        paginas={paginas}
        rotulos={rotulos}
      />
    </>
  )
}
