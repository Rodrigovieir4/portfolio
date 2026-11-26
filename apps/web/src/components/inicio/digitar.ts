import gsap from "gsap"

/**
 * Escreve `final` letra por letra, como num terminal: chama `escrever` com o
 * trecho já digitado a cada quadro. Usado no prompt do cabeçalho e nos
 * comandos das seções.
 */
export function digitar({
  aoTerminar,
  atraso = 0,
  escrever,
  final,
  porLetra = 0.055,
}: {
  aoTerminar?: () => void
  atraso?: number
  escrever: (texto: string) => void
  final: string
  porLetra?: number
}) {
  escrever("")
  const estado = { letras: 0 }
  return gsap.to(estado, {
    delay: atraso,
    duration: final.length * porLetra,
    ease: "none",
    letras: final.length,
    onComplete: aoTerminar,
    onUpdate: () => escrever(final.slice(0, Math.round(estado.letras))),
  })
}
