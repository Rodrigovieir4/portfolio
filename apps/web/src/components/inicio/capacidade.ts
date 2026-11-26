/**
 * O que a máquina aguenta. Não muda com a página aberta.
 *
 * Os efeitos de tela cheia em WebGL (o laser e a névoa do mouse) só montam com
 * placa de vídeo de verdade. Sem ela, o navegador desenha o WebGL no
 * processador: cada quadro leva tanto tempo que a abertura inteira trava.
 */

/** Até 2 núcleos ou 2 GB de memória: só o essencial. */
export function maquinaLeve(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number }
  return (nav.hardwareConcurrency || 8) <= 2 || (nav.deviceMemory ?? 8) <= 2
}

let placaDeVideo: boolean | undefined

/** Nomes dos renderizadores que desenham o WebGL no processador. */
const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render/i

/**
 * Se o WebGL roda numa placa de vídeo. `failIfMajorPerformanceCaveat` faz o
 * navegador recusar o contexto quando ele seria desenhado por software; o nome
 * do renderizador pega os casos em que o navegador aceita mesmo assim.
 */
function temPlacaDeVideo(): boolean {
  if (placaDeVideo === undefined) {
    const tela = document.createElement("canvas")
    const opcoes: WebGLContextAttributes = {
      failIfMajorPerformanceCaveat: true,
    }
    const gl: null | WebGLRenderingContext =
      tela.getContext("webgl2", opcoes) ?? tela.getContext("webgl", opcoes)
    const info = gl?.getExtension("WEBGL_debug_renderer_info")
    const nome = info
      ? String(gl?.getParameter(info.UNMASKED_RENDERER_WEBGL))
      : ""
    placaDeVideo = gl !== null && !SOFTWARE.test(nome)
    gl?.getExtension("WEBGL_lose_context")?.loseContext()
  }
  return placaDeVideo
}

/** Shader de tela cheia: só fora de máquina fraca e com placa de vídeo. */
export function aguentaShader(): boolean {
  return !maquinaLeve() && temPlacaDeVideo()
}
