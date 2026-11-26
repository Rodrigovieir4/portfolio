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
  return () => {
    soltarComandos()
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
