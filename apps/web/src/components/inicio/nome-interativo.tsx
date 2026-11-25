"use client"

import { useEffect, useRef } from "react"

const LEVE = 100
const PESADO = 900

/**
 * Nome gigante em que cada letra engrossa conforme o cursor chega perto.
 *
 * A Geist é variável (peso de 100 a 900), então o peso muda sem trocar de
 * fonte. Cada letra reserva a largura da versão mais pesada com uma cópia
 * invisível, para o nome não se mexer de lado quando o peso muda.
 *
 * Sem mouse (celular) ou parado, um foco passeia sozinho pelas letras. Quem
 * pediu menos movimento vê o nome fino, parado.
 */
export function NomeInterativo({ linhas }: { linhas: string[] }) {
  const raiz = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const elemento = raiz.current
    if (!elemento) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    return animarPeso(elemento)
  }, [])

  return (
    <div
      ref={raiz}
      aria-label={linhas.join(" ")}
      role="img"
      className="flex flex-col items-center leading-nome font-thin tracking-tight uppercase select-none"
    >
      {linhas.map((linha) => (
        <span key={linha} aria-hidden className="flex gap-x-nome">
          {linha.split(" ").map((palavra) => (
            <span key={palavra} className="flex">
              {[...palavra].map((letra, indice) => (
                <span
                  key={`${letra}-${indice}`}
                  data-mov="letra"
                  className="grid"
                >
                  <span className="invisible col-start-1 row-start-1 font-black">
                    {letra}
                  </span>
                  <span
                    data-peso
                    className="col-start-1 row-start-1 text-center"
                  >
                    {letra}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </span>
      ))}
    </div>
  )
}

function animarPeso(raiz: HTMLElement) {
  const letras = [...raiz.querySelectorAll<HTMLElement>("[data-peso]")]
  const alvo = { x: -9999, y: -9999 }
  let ultimoMovimento = -Infinity
  let quadro = 0

  function aoMover(evento: PointerEvent) {
    if (evento.pointerType !== "mouse") return
    alvo.x = evento.clientX
    alvo.y = evento.clientY
    ultimoMovimento = performance.now()
  }

  function desenhar(agora: number) {
    const caixa = raiz.getBoundingClientRect()
    const parado = agora - ultimoMovimento > 2500
    // Parado, o foco faz um vaivém lento de ponta a ponta do nome.
    const x = parado
      ? caixa.left + caixa.width * (0.5 + 0.5 * Math.sin(agora / 1400))
      : alvo.x
    const y = parado ? caixa.top + caixa.height / 2 : alvo.y
    const raio = Math.max(caixa.width * 0.28, 160)

    for (const letra of letras) {
      const r = letra.getBoundingClientRect()
      const d = Math.hypot(r.left + r.width / 2 - x, r.top + r.height / 2 - y)
      const forca = Math.max(0, 1 - d / raio) ** 1.6
      const peso = Math.round(LEVE + (PESADO - LEVE) * forca)
      letra.style.fontVariationSettings = `"wght" ${peso}`
    }
    quadro = requestAnimationFrame(desenhar)
  }

  // Fora da tela não gasta quadro.
  const observador = new IntersectionObserver(([entrada]) => {
    cancelAnimationFrame(quadro)
    if (entrada?.isIntersecting) quadro = requestAnimationFrame(desenhar)
  })
  observador.observe(raiz)
  window.addEventListener("pointermove", aoMover, { passive: true })

  return () => {
    cancelAnimationFrame(quadro)
    observador.disconnect()
    window.removeEventListener("pointermove", aoMover)
  }
}
