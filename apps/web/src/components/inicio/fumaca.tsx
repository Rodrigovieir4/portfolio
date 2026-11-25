"use client"

import { useEffect, useRef } from "react"

type Ponto = { x: number; y: number }
type Particula = Ponto & {
  vx: number
  vy: number
  vida: number
  total: number
  raio: number
  semente: number
  forca: number
}

const MAXIMO = 260
// A tela desenha na metade da resolução: a fumaça é desfocada, pixel a mais
// é gasto sem ganho visível.
const ESCALA = 0.5

/**
 * Fumaça vinho que segue o cursor, num <canvas> 2D desfocado.
 *
 * O rastro é contínuo: cada movimento solta fiapos ao longo do caminho do
 * mouse, e um campo de turbulência faz eles se enrolarem enquanto sobem e
 * somem. Parado ou sem mouse, uma fonte fraca passeia perto do retrato.
 * Fica de fora com menos movimento pedido, em máquina com até 2 núcleos e
 * fora da tela.
 */
export function Fumaca() {
  const tela = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = tela.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const nav = navigator as Navigator & { deviceMemory?: number }
    const leve =
      (nav.hardwareConcurrency || 8) <= 2 || (nav.deviceMemory ?? 8) <= 2
    if (leve) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const nuvem = new Nuvem(canvas, ctx)
    return nuvem.ligar()
  }, [])

  return (
    <canvas
      ref={tela}
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full mix-blend-screen blur-xl"
    />
  )
}

class Nuvem {
  private particulas: Particula[] = []
  private anterior: null | Ponto = null
  private ultimoMovimento = -Infinity
  private quadro = 0

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D,
  ) {}

  ligar() {
    this.medir()
    const observador = new IntersectionObserver(([entrada]) => {
      cancelAnimationFrame(this.quadro)
      if (entrada?.isIntersecting)
        this.quadro = requestAnimationFrame(this.desenhar)
    })
    observador.observe(this.canvas)
    window.addEventListener("pointermove", this.aoMover, { passive: true })
    window.addEventListener("resize", this.medir)

    return () => {
      cancelAnimationFrame(this.quadro)
      observador.disconnect()
      window.removeEventListener("pointermove", this.aoMover)
      window.removeEventListener("resize", this.medir)
    }
  }

  private medir = () => {
    this.canvas.width = this.canvas.clientWidth * ESCALA
    this.canvas.height = this.canvas.clientHeight * ESCALA
  }

  private soltar(ponto: Ponto, forca: number) {
    if (this.particulas.length >= MAXIMO) return
    const total = 70 + Math.random() * 60
    this.particulas.push({
      ...ponto,
      forca,
      raio: 6 + Math.random() * 10,
      semente: Math.random() * 1000,
      total,
      vida: total,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -0.2 - Math.random() * 0.5,
    })
  }

  private aoMover = (evento: PointerEvent) => {
    const caixa = this.canvas.getBoundingClientRect()
    const atual = {
      x: (evento.clientX - caixa.left) * ESCALA,
      y: (evento.clientY - caixa.top) * ESCALA,
    }
    if (atual.y < 0 || atual.y > this.canvas.height) {
      this.anterior = null
      return
    }
    // Solta fiapos ao longo do caminho, um a cada 6 px, para o rastro não
    // virar uma fila de bolas quando o mouse corre.
    const de = this.anterior ?? atual
    const passos = Math.min(
      12,
      Math.ceil(Math.hypot(atual.x - de.x, atual.y - de.y) / 6),
    )
    for (let i = 0; i <= passos; i++) {
      const t = passos ? i / passos : 1
      this.soltar(
        { x: de.x + (atual.x - de.x) * t, y: de.y + (atual.y - de.y) * t },
        1,
      )
    }
    this.anterior = atual
    this.ultimoMovimento = performance.now()
  }

  private desenhar = (agora: number) => {
    const { ctx } = this
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.globalCompositeOperation = "lighter"
    if (agora - this.ultimoMovimento > 1800 && Math.random() < 0.5) {
      // Parado: uma fonte fraca passeia em oito, perto do retrato.
      const t = agora / 3000
      this.soltar(
        {
          x: this.canvas.width * (0.5 + 0.18 * Math.sin(t)),
          y: this.canvas.height * (0.55 + 0.12 * Math.sin(t * 2)),
        },
        0.5,
      )
    }
    this.particulas = this.particulas
      .map((p) => this.passo(p, agora))
      .filter((p) => p.vida > 0)
    this.quadro = requestAnimationFrame(this.desenhar)
  }

  private passo(antes: Particula, agora: number): Particula {
    const t = agora / 900
    // Turbulência: um campo de seno e cosseno faz o fiapo se enrolar.
    const vento = {
      x: Math.sin(antes.y * 0.035 + t + antes.semente) * 0.06,
      y: Math.cos(antes.x * 0.035 + t) * 0.04,
    }
    const p = {
      ...antes,
      raio: antes.raio + 0.45,
      vida: antes.vida - 1,
      vx: (antes.vx + vento.x) * 0.985,
      vy: (antes.vy + vento.y) * 0.985 - 0.006,
      x: antes.x + antes.vx,
      y: antes.y + antes.vy,
    }
    const restante = p.vida / p.total
    // Nasce fraco, encorpa e some: fumaça não acende de uma vez.
    const alfa = Math.sin(restante * Math.PI) * 0.2 * p.forca
    const brilho = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.raio)
    brilho.addColorStop(0, `rgba(214, 60, 88, ${alfa})`)
    brilho.addColorStop(0.5, `rgba(150, 28, 52, ${alfa * 0.5})`)
    brilho.addColorStop(1, "rgba(120, 20, 40, 0)")
    this.ctx.fillStyle = brilho
    this.ctx.beginPath()
    this.ctx.arc(p.x, p.y, p.raio, 0, Math.PI * 2)
    this.ctx.fill()
    return p
  }
}
