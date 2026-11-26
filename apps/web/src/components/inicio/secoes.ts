import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { digitar } from "./digitar"

/**
 * Movimento das seções depois da abertura (a rodada interativa de 25/11).
 * Chamado pelo movimento.tsx dentro do matchMedia, só com movimento permitido:
 * sem ele, tudo aparece pronto e parado.
 */
export function secoes(contexto: gsap.Context) {
  const soltarComandos = comandos(contexto)
  const soltarHolofote = holofote()
  return () => {
    soltarComandos()
    soltarHolofote()
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
