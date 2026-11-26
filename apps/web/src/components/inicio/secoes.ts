import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

import { digitar } from "./digitar"

/**
 * Movimento das seções depois da abertura (a rodada interativa de 25/11).
 * Chamado pelo movimento.tsx dentro do matchMedia, só com movimento permitido:
 * sem ele, tudo aparece pronto e parado.
 */
export function secoes(contexto: gsap.Context) {
  const soltarComandos = comandos(contexto)
  const soltarHolofote = holofote()
  const soltarNumeros = numeros()
  const soltarFaixas = faixas()
  tituloContato()
  return () => {
    soltarComandos()
    soltarHolofote()
    soltarNumeros()
    soltarFaixas()
  }
}

/**
 * O comando acima de cada título é digitado quando a seção entra na tela; o
 * cursor pisca uns segundos no fim, como o do cabeçalho.
 */
function comandos(contexto: gsap.Context) {
  const itens = gsap.utils.toArray<HTMLElement>('[data-mov="comando"]')
  const partes = itens.flatMap((item) => {
    const alvo = item.querySelector<HTMLElement>("[data-texto]")
    const cursor = item.querySelector("[data-cursor-comando]")
    return alvo ? [{ alvo, cursor, final: alvo.dataset.texto ?? "", item }] : []
  })

  for (const { alvo, cursor, final, item } of partes) {
    alvo.textContent = ""
    ScrollTrigger.create({
      once: true,
      onEnter: () =>
        contexto.add(() =>
          digitar({
            aoTerminar: () => cursor?.classList.add("cursor-terminal"),
            atraso: 0.15,
            escrever: (texto) => {
              alvo.textContent = texto
            },
            final,
            porLetra: 0.045,
          }),
        ),
      start: "top 88%",
      trigger: item,
    })
  }

  // Se a página sair no meio, cada comando volta inteiro.
  return () => {
    for (const { alvo, final } of partes) alvo.textContent = final
  }
}

/**
 * O holofote dos cartões (utilitário `holofote` no globals.css) segue o
 * mouse: um ouvinte só para a página inteira, que move a luz do cartão que
 * estiver embaixo do ponteiro. Em tela de toque não há o que seguir.
 */
function holofote() {
  if (!window.matchMedia("(pointer: fine)").matches) return () => {}
  const mover = (evento: PointerEvent) => {
    if (!(evento.target instanceof Element)) return
    const cartao = evento.target.closest<HTMLElement>(".holofote")
    if (!cartao) return
    const caixa = cartao.getBoundingClientRect()
    cartao.style.setProperty("--holofote-x", `${evento.clientX - caixa.left}px`)
    cartao.style.setProperty("--holofote-y", `${evento.clientY - caixa.top}px`)
  }
  document.addEventListener("pointermove", mover, { passive: true })
  return () => document.removeEventListener("pointermove", mover)
}

/**
 * Os números reais contam do zero até o valor quando a seção aparece, com a
 * mesma vírgula e a mesma unidade do texto ("3,5 ms" passa por "1,2 ms").
 */
function numeros() {
  const partes: {
    escrever: (n: number) => void
    item: HTMLElement
    texto: string
    valor: number
  }[] = []
  for (const item of gsap.utils.toArray<HTMLElement>('[data-mov="numero"]')) {
    const texto = item.textContent ?? ""
    const achado = /^(\d+)(?:([.,])(\d+))?(.*)$/.exec(texto)
    if (!achado) continue
    const [, inteiro = "", separador = ",", fracao = "", resto = ""] = achado
    const escrever = (n: number) => {
      const numero = n.toFixed(fracao.length).replace(".", separador)
      item.textContent = `${numero}${resto}`
    }
    const valor = Number(`${inteiro}.${fracao || 0}`)
    partes.push({ escrever, item, texto, valor })
  }

  for (const { escrever, item, valor } of partes) {
    escrever(0)
    const estado = { n: 0 }
    gsap.to(estado, {
      duration: 1.6,
      ease: "expo.out",
      n: valor,
      onUpdate: () => escrever(estado.n),
      scrollTrigger: { once: true, start: "top 88%", trigger: item },
    })
  }

  return () => {
    for (const { item, texto } of partes) item.textContent = texto
  }
}

/**
 * As faixas da stack aceleram com a velocidade da rolagem e se inclinam para o
 * lado do movimento; quando a rolagem para, voltam ao passo normal.
 */
function faixas() {
  const linhas = gsap.utils.toArray<HTMLElement>('[data-mov="faixa"]')
  const secao = linhas[0]?.closest("section")
  if (!secao) return () => {}
  const animacoes = linhas.flatMap((linha) => linha.getAnimations())
  // A inclinação vai na moldura: o transform da faixa é da animação em CSS.
  const molduras = linhas.flatMap((linha) => linha.parentElement ?? [])
  const ritmo = { inclinacao: 0, velocidade: 1 }
  const aplicar = () => {
    for (const animacao of animacoes) animacao.playbackRate = ritmo.velocidade
    gsap.set(molduras, { skewX: ritmo.inclinacao })
  }

  ScrollTrigger.create({
    end: "bottom top",
    onUpdate: (gatilho) => {
      const v = gatilho.getVelocity()
      gsap.to(ritmo, {
        duration: 0.25,
        inclinacao: gsap.utils.clamp(-8, 8, v / -250),
        onComplete: () => {
          gsap.to(ritmo, {
            duration: 1.4,
            ease: "power3.out",
            inclinacao: 0,
            onUpdate: aplicar,
            velocidade: 1,
          })
        },
        onUpdate: aplicar,
        overwrite: true,
        velocidade: 1 + Math.min(Math.abs(v) / 350, 6),
      })
    },
    start: "top bottom",
    trigger: secao,
  })

  return () => {
    gsap.killTweensOf(ritmo)
    for (const animacao of animacoes) animacao.playbackRate = 1
    gsap.set(molduras, { clearProps: "transform" })
  }
}

/** "Vamos conversar." sobe letra por letra, de dentro de cada linha. */
function tituloContato() {
  const titulo = document.querySelector<HTMLElement>(
    '[data-mov="contato-titulo"]',
  )
  if (!titulo) return
  const partes = SplitText.create(titulo, {
    mask: "lines",
    type: "lines,chars",
  })
  gsap.from(partes.chars, {
    duration: 0.9,
    ease: "expo.out",
    scrollTrigger: { once: true, start: "top 80%", trigger: titulo },
    stagger: 0.025,
    yPercent: 110,
  })
}
