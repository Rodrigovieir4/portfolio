"use client"

import { Button } from "@portfolio/ui/components/button"
import { Card } from "@portfolio/ui/components/card"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@portfolio/ui/components/toggle-group"
import gsap from "gsap"
import { Flip } from "gsap/Flip"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import {
  type RefObject,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"

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

/**
 * O cartão é só a foto do certificado (pedido do Rodrigo, 27/11): embaçada e
 * escurecida, com o emissor e o nome por cima. No hover, ou com o foco do
 * teclado, a foto desembaça e o texto some: aparece o certificado inteiro.
 * Sem hover (celular), fica embaçada com o texto, e o toque abre o PDF; lá o
 * cartão fica em pé, para o nome caber.
 */
function Cartao({ item, abrir }: { abrir: string; item: Certificado }) {
  const revela = item.capa
    ? "transition duration-500 group-hover/card:opacity-0 group-focus-visible/card:opacity-0"
    : ""
  const conteudo = (
    <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-muted sm:aspect-4/3">
      {item.capa ? (
        <Image
          src={item.capa}
          alt=""
          fill
          sizes="(min-width: 1024px) 18rem, 50vw"
          className="scale-110 object-cover blur-sm transition duration-500 group-hover/card:scale-100 group-hover/card:blur-none group-focus-visible/card:scale-100 group-focus-visible/card:blur-none"
        />
      ) : null}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-end gap-2 bg-linear-to-t from-background via-background/70 to-background/30 p-4 sm:p-5",
          revela,
        )}
      >
        <span className="font-mono text-xs text-muted-foreground">
          {item.emissor}
          {item.ano ? ` · ${item.ano}` : ""}
        </span>
        <span className="text-base font-semibold tracking-tight text-pretty sm:text-lg">
          {item.nome}
          {item.link ? " ↗" : ""}
        </span>
      </div>
    </div>
  )
  const classe = "gap-0 bg-transparent p-0"

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
          <Cartao key={item.id} item={item} abrir={rotulos.abrir} />
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
