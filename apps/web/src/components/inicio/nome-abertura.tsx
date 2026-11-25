"use client"

import { useEffect, useRef } from "react"

type Props = { completo: string; nome: string; sobrenome: string }

/**
 * Nome gigante da abertura (estilo "luz", escolhido em 25/11/2026): fino e
 * parado, aceso no centro como se o feixe o iluminasse, apagando para as
 * pontas. No impacto a luz se abre do feixe para as pontas; depois segue o
 * mouse devagar pela palavra. No celular, em duas linhas.
 */
export function NomeAbertura({ completo, nome, sobrenome }: Props) {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 max-md:hidden lg:px-8">
        <NomeLuz linhas={[completo]} />
      </div>
      <div className="md:hidden">
        <NomeLuz linhas={[nome, sobrenome]} />
      </div>
    </>
  )
}

/** Nome fino, aceso no centro como se o feixe o iluminasse. */
function NomeLuz({ linhas }: { linhas: string[] }) {
  const texto = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const elemento = texto.current
    if (!elemento) return
    // A luz acompanha o mouse na horizontal; a transição fica no CSS. Lê e
    // escreve uma vez por quadro, e não a cada evento do mouse.
    let quadro = 0
    let x = 0
    const aplicar = () => {
      quadro = 0
      const caixa = elemento.getBoundingClientRect()
      const posicao = ((x - caixa.left) / caixa.width) * 100
      elemento.style.setProperty(
        "--luz-x",
        `${Math.max(0, Math.min(100, posicao))}%`,
      )
    }
    const mover = (evento: PointerEvent) => {
      if (evento.pointerType !== "mouse") return
      x = evento.clientX
      if (!quadro) quadro = requestAnimationFrame(aplicar)
    }
    window.addEventListener("pointermove", mover, { passive: true })
    return () => {
      cancelAnimationFrame(quadro)
      window.removeEventListener("pointermove", mover)
    }
  }, [])

  return (
    <p
      ref={texto}
      aria-label={linhas.join(" ")}
      data-luz
      className="nome-luz text-center texto-nome leading-none font-light tracking-wide whitespace-nowrap uppercase"
    >
      {linhas.map((linha) => (
        <span key={linha} aria-hidden className="block">
          {linha}
        </span>
      ))}
    </p>
  )
}
