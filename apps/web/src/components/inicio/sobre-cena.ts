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

/** "Sobre" vai para a esquerda, "Mim" para a direita, e o laser acende. */
function separarPalavras({
  fundo,
  linha,
  palco,
}: {
  fundo: HTMLElement | null
  linha: gsap.core.Timeline
  palco: HTMLElement
}) {
  const laser = palco.querySelector("[data-sobre-linha]")
  const [sobre, mim] = gsap.utils.toArray<HTMLElement>(
    "[data-sobre-palavra]",
    palco,
  )
  if (fundo) linha.set(fundo, { display: "flex" }, 0)
  if (sobre && mim) {
    linha.fromTo(sobre, { xPercent: 0 }, { duration: 0.55, xPercent: -75 }, 0)
    linha.fromTo(mim, { xPercent: 0 }, { duration: 0.55, xPercent: 75 }, 0)
    linha.to([sobre, mim], { duration: 0.1, opacity: 0 }, 0.4)
  }
  if (laser) {
    linha.set(laser, { display: "block" }, 0)
    linha.fromTo(laser, { scaleX: 0 }, { duration: 0.12, scaleX: 1 }, 0.02)
    linha.to(laser, { duration: 0.1, opacity: 0 }, 0.3)
  }
}

/**
 * Computador: a rolagem conduz a cena com a seção presa na tela. Antes de
 * rolar, só "Sobre" em cima de "Mim". Ao rolar, uma linha de laser cruza a
 * tela entre as duas palavras, elas se afastam (uma para cada lado) e o painel
 * abre a partir da linha até a tela inteira; aí o texto entra.
 */
function cenaFixa({
  palco,
  partes: { conteudo, fundo, itens, painel, palavras },
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
  separarPalavras({ fundo, linha, palco })
  linha.fromTo(
    painel,
    { clipPath: "inset(50% 0% 50% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: 0.4, ease: "power2.inOut" },
    0.1,
  )
  // O texto só aparece com o painel quase cheio: cortado, ele vira ruído. O
  // "Mais sobre mim" vem junto, para já poder ser clicado.
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
