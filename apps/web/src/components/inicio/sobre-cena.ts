import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

import { digitar } from "./digitar"

/** Caracteres que passam pelo rótulo antes da letra certa aparecer. */
const SIMBOLOS = [
  ...Array.from({ length: 26 }, (_, i) => String.fromCodePoint(65 + i)),
  ..."0123456789/#_",
].join("")

/**
 * Decodifica um texto: as letras chegam da esquerda para a direita e, até
 * chegar, cada uma troca de símbolo a cada quadro, como num terminal.
 */
function decodificar({
  atraso,
  escrever,
  final,
}: {
  atraso: number
  escrever: (texto: string) => void
  final: string
}) {
  const estado = { feito: 0 }
  const sortear = (letra: string) =>
    letra === " "
      ? " "
      : (SIMBOLOS[Math.floor(Math.random() * SIMBOLOS.length)] ?? letra)
  return gsap.to(estado, {
    delay: atraso,
    duration: 0.9,
    ease: "none",
    feito: 1,
    onComplete: () => escrever(final),
    onStart: () => escrever([...final].map(sortear).join("")),
    onUpdate: () => {
      const n = Math.floor(estado.feito * final.length)
      escrever(final.slice(0, n) + [...final.slice(n)].map(sortear).join(""))
    },
  })
}

interface Partes {
  comando: HTMLElement | null
  conteudo: HTMLElement | null
  fundo: HTMLElement | null
  itens: HTMLElement[]
  mais: HTMLElement | null
  painel: HTMLElement
  palavras: Element[]
}

/**
 * A cena do sobre (ver sobre.tsx). Com `fixar` (computador, máquina boa), a
 * seção fica presa enquanto o painel cresce do canto até a tela inteira; sem
 * isso, os mesmos efeitos acontecem na entrada, sem prender a rolagem.
 */
export function cenaSobre({
  contexto,
  fixar,
}: {
  contexto: gsap.Context
  fixar: boolean
}) {
  const palco = document.querySelector<HTMLElement>("[data-sobre-palco]")
  const painel = palco?.querySelector<HTMLElement>("[data-sobre-painel]")
  const titulo = palco?.querySelector<HTMLElement>("[data-sobre-titulo]")
  if (!palco || !painel || !titulo) return () => {}

  const comando = palco.querySelector<HTMLElement>(
    '[data-mov="comando-manual"] [data-texto]',
  )
  const cursor = palco.querySelector("[data-cursor-comando]")
  const rotulos = gsap.utils.toArray<HTMLElement>("[data-decodificar]", palco)
  const finais = rotulos.map((rotulo) => rotulo.textContent ?? "")
  const finalComando = comando?.dataset.texto ?? ""
  if (comando) comando.textContent = ""

  const escreverRotulos: ((texto: string) => void)[] = []
  for (const rotulo of rotulos) {
    escreverRotulos.push((texto) => {
      rotulo.textContent = texto
    })
  }
  const revelarTextos = revelacao({
    contexto,
    cursor,
    escreverComando: comando
      ? (texto) => {
          comando.textContent = texto
        }
      : null,
    escreverRotulos,
    finais,
    finalComando,
  })

  const partes: Partes = {
    comando,
    conteudo: palco.querySelector<HTMLElement>("[data-sobre-conteudo]"),
    fundo: palco.querySelector<HTMLElement>("[data-sobre-fundo]"),
    itens: gsap.utils.toArray<HTMLElement>("[data-sobre-item]", palco),
    mais: palco.querySelector<HTMLElement>("[data-sobre-mais]"),
    painel,
    palavras: SplitText.create(titulo, { type: "words" }).words,
  }
  if (fixar) cenaFixa({ palco, partes, revelarTextos })
  else cenaSolta({ partes, revelarTextos, titulo })

  // Se a página sair no meio, os textos voltam inteiros.
  return () => {
    if (comando) comando.textContent = finalComando
    for (const [indice, rotulo] of rotulos.entries()) {
      rotulo.textContent = finais[indice] ?? ""
    }
  }
}

/**
 * Devolve a função que digita o comando e decodifica os rótulos, uma vez só
 * (a linha da cena passa pelo mesmo ponto de novo ao rolar para trás).
 */
function revelacao({
  contexto,
  cursor,
  escreverComando,
  escreverRotulos,
  finais,
  finalComando,
}: {
  contexto: gsap.Context
  cursor: Element | null
  escreverComando: ((texto: string) => void) | null
  escreverRotulos: ((texto: string) => void)[]
  finais: string[]
  finalComando: string
}) {
  let revelado = false
  return () => {
    if (revelado) return
    revelado = true
    if (escreverComando) {
      contexto.add(() =>
        digitar({
          aoTerminar: () => cursor?.classList.add("cursor-terminal"),
          escrever: escreverComando,
          final: finalComando,
          porLetra: 0.045,
        }),
      )
    }
    for (const [indice, escrever] of escreverRotulos.entries()) {
      contexto.add(() =>
        decodificar({
          atraso: 0.35 + indice * 0.18,
          escrever,
          final: finais[indice] ?? "",
        }),
      )
    }
  }
}

/** Computador: a rolagem conduz a cena com a seção presa na tela. */
function cenaFixa({
  palco,
  partes: { conteudo, fundo, itens, mais, painel, palavras },
  revelarTextos,
}: {
  palco: HTMLElement
  partes: Partes
  revelarTextos: () => void
}) {
  const linha = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      end: "+=180%",
      pin: true,
      scrub: 0.8,
      start: "top top",
      trigger: palco,
    },
  })
  // O "Sobre mim" atravessa a tela por cima do cartão e some quando o
  // painel enche a tela, para não brigar com o texto.
  if (fundo) {
    linha.fromTo(fundo, { xPercent: 8 }, { duration: 0.6, xPercent: -30 }, 0)
    linha.to(fundo, { duration: 0.1, opacity: 0 }, 0.38)
  }
  // O painel nasce como um cartão no canto direito e cresce até a tela.
  linha.fromTo(
    painel,
    { clipPath: "inset(22% 5% 22% 56% round 28px)" },
    {
      clipPath: "inset(0% 0% 0% 0% round 0px)",
      duration: 0.5,
      ease: "power2.inOut",
    },
    0.05,
  )
  // O texto só aparece com o painel quase cheio: cortado, ele vira ruído.
  if (conteudo) {
    linha.fromTo(conteudo, { opacity: 0 }, { duration: 0.08, opacity: 1 }, 0.42)
  }
  linha.call(revelarTextos, [], 0.5)
  linha.fromTo(
    palavras,
    { opacity: 0.12 },
    { duration: 0.2, opacity: 1, stagger: 0.25 / palavras.length },
    0.5,
  )
  linha.fromTo(
    itens,
    { opacity: 0, y: 40 },
    { duration: 0.15, opacity: 1, stagger: 0.05, y: 0 },
    0.72,
  )
  if (mais)
    linha.fromTo(mais, { opacity: 0 }, { duration: 0.05, opacity: 1 }, 0.92)
}

/** Celular ou máquina fraca: os mesmos efeitos na entrada, sem prender. */
function cenaSolta({
  partes: { itens, palavras },
  revelarTextos,
  titulo,
}: {
  partes: Partes
  revelarTextos: () => void
  titulo: HTMLElement
}) {
  gsap.from(palavras, {
    ease: "none",
    opacity: 0.15,
    scrollTrigger: {
      end: "bottom 50%",
      scrub: true,
      start: "top 85%",
      trigger: titulo,
    },
    stagger: 0.1,
  })
  gsap.from(itens, {
    duration: 0.9,
    ease: "expo.out",
    opacity: 0,
    scrollTrigger: { once: true, start: "top 88%", trigger: itens[0] },
    stagger: 0.1,
    y: 30,
  })
  ScrollTrigger.create({
    once: true,
    onEnter: revelarTextos,
    start: "top 80%",
    trigger: titulo,
  })
}
