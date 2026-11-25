"use client"

import { useEffect, useRef } from "react"

type Grao = {
  x: number
  y: number
  vx: number
  vy: number
  vida: number
  total: number
  raio: number
  fase: number
}

const MAXIMO = 220

/**
 * Poeira de luz que sai do cursor, como a poeira que brilha dentro do feixe:
 * grãos pequenos flutuam, piscam de leve e somem. Só existe quando o mouse
 * se mexe; parado, não gasta quadro. Fica de fora com menos movimento pedido
 * e em tela de toque.
 */
export function Poeira() {
  const tela = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = tela.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const semMouse = !window.matchMedia("(pointer: fine)").matches
    if (semMouse) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    return new Graos(canvas, ctx).ligar()
  }, [])

  return (
    <canvas
      ref={tela}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 size-full"
    />
  )
}

class Graos {
  private graos: Grao[] = []
  private anterior: { x: number; y: number } | null = null
  private quadro = 0

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D,
  ) {}

  ligar() {
    this.medir()
    window.addEventListener("pointermove", this.aoMover, { passive: true })
    window.addEventListener("resize", this.medir)
    return () => {
      cancelAnimationFrame(this.quadro)
      window.removeEventListener("pointermove", this.aoMover)
      window.removeEventListener("resize", this.medir)
    }
  }

  private medir = () => {
    this.canvas.width = this.canvas.clientWidth
    this.canvas.height = this.canvas.clientHeight
  }

  private aoMover = (evento: PointerEvent) => {
    const caixa = this.canvas.getBoundingClientRect()
    const atual = {
      x: evento.clientX - caixa.left,
      y: evento.clientY - caixa.top,
    }
    if (atual.y < 0 || atual.y > caixa.height) {
      this.anterior = null
      return
    }
    const de = this.anterior ?? atual
    // Um grão a cada 9 px de caminho: o rastro sai contínuo e esparso.
    const passos = Math.min(
      8,
      Math.floor(Math.hypot(atual.x - de.x, atual.y - de.y) / 9),
    )
    for (let i = 0; i < passos && this.graos.length < MAXIMO; i++) {
      const t = (i + 1) / passos
      const total = 60 + Math.random() * 90
      this.graos.push({
        fase: Math.random() * Math.PI * 2,
        raio: 0.6 + Math.random() * 1.6,
        total,
        vida: total,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.15 - Math.random() * 0.35,
        x: de.x + (atual.x - de.x) * t + (Math.random() - 0.5) * 14,
        y: de.y + (atual.y - de.y) * t + (Math.random() - 0.5) * 14,
      })
    }
    this.anterior = atual
    if (!this.quadro) this.quadro = requestAnimationFrame(this.desenhar)
  }

  private desenhar = () => {
    const { ctx } = this
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.globalCompositeOperation = "lighter"
    this.graos = this.graos
      .map((g) => ({ ...g, vida: g.vida - 1, x: g.x + g.vx, y: g.y + g.vy }))
      .filter((g) => g.vida > 0)
    for (const g of this.graos) {
      const restante = g.vida / g.total
      // Nasce, brilha e apaga, piscando de leve como poeira contra a luz.
      const alfa =
        Math.sin(restante * Math.PI) *
        (0.55 + 0.45 * Math.sin(g.fase + g.vida * 0.2))
      ctx.fillStyle = `rgba(255, 196, 206, ${alfa})`
      ctx.beginPath()
      ctx.arc(g.x, g.y, g.raio, 0, Math.PI * 2)
      ctx.fill()
    }
    // Sem grão vivo, para o laço até o próximo movimento.
    this.quadro = this.graos.length ? requestAnimationFrame(this.desenhar) : 0
  }
}
