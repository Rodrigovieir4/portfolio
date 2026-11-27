import gsap from "gsap"

/**
 * Opções de entrada dos resultados da busca da stack, para o Rodrigo escolher
 * (27/11). Troca pelo endereço: `?anim=roleta`, `moeda`, `tambor`, `orbita` ou
 * `foco` (a atual). Escolhida uma, as outras saem deste arquivo.
 */
export const ANIMACOES = [
  "foco",
  "roleta",
  "moeda",
  "tambor",
  "orbita",
] as const
export type Animacao = (typeof ANIMACOES)[number]

interface Vez {
  /** Posição do item na lista e o total, para espalhar no tempo e no espaço. */
  indice: number
  item: Element
  total: number
  tl: gsap.core.Timeline
}

/** Foco de câmera: chega desfocada e grande e assenta nítida. */
function foco({ indice, item, tl }: Vez) {
  const vez = indice * 0.12
  tl.fromTo(
    item,
    { filter: "blur(16px)", opacity: 0, scale: 1.4, y: 12 },
    {
      duration: 1.1,
      ease: "expo.out",
      filter: "blur(0px)",
      opacity: 1,
      scale: 1,
      y: 0,
    },
    vez,
  )
  tl.fromTo(
    item.querySelector("svg"),
    { rotateY: 90 },
    { duration: 0.9, ease: "back.out(1.6)", rotateY: 0 },
    vez + 0.1,
  )
}

/** Roleta: o nome corre como um rolo de caça-níquel e para no certo. */
function roleta({ indice, item, tl }: Vez) {
  const rolo = item.querySelector("[data-rolo]")
  const vez = indice * 0.15
  const duracao = 1.4 + indice * 0.12
  tl.fromTo(item, { opacity: 0 }, { duration: 0.2, opacity: 1 }, vez)
  if (rolo) {
    const voltas = rolo.children.length - 1
    tl.fromTo(
      rolo,
      { filter: "blur(3px)", yPercent: 0 },
      {
        duration: duracao,
        ease: "power4.out",
        filter: "blur(0px)",
        yPercent: (-100 * voltas) / (voltas + 1),
      },
      vez,
    )
  }
  tl.fromTo(
    item.querySelector("svg"),
    { rotation: -720 },
    { duration: duracao, ease: "power4.out", rotation: 0 },
    vez,
  )
}

/** Moeda: entra girando duas voltas, desfocada no giro. */
function moeda({ indice, item, tl }: Vez) {
  tl.fromTo(
    item,
    {
      filter: "blur(6px)",
      opacity: 0,
      rotationY: -720,
      scale: 0.5,
      transformPerspective: 800,
    },
    {
      duration: 1.6,
      ease: "power4.out",
      filter: "blur(0px)",
      opacity: 1,
      rotationY: 0,
      scale: 1,
    },
    indice * 0.1,
  )
}

/** Tambor: cai girando para a frente, como um fichário rotativo. */
function tambor({ indice, item, tl }: Vez) {
  tl.fromTo(
    item,
    {
      opacity: 0,
      rotationX: -270,
      transformOrigin: "50% 50% -40px",
      transformPerspective: 700,
      y: -30,
    },
    { duration: 1.3, ease: "back.out(1.4)", opacity: 1, rotationX: 0, y: 0 },
    indice * 0.14,
  )
}

/** Órbita: vem de um círculo ao redor, girando em espiral até o lugar. */
function orbita({ indice, item, tl, total }: Vez) {
  const angulo = (indice / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2
  tl.fromTo(
    item,
    {
      opacity: 0,
      rotation: -200,
      scale: 0.3,
      x: Math.cos(angulo) * 320,
      y: Math.sin(angulo) * 140,
    },
    {
      duration: 1.5,
      ease: "expo.out",
      opacity: 1,
      rotation: 0,
      scale: 1,
      x: 0,
      y: 0,
    },
    indice * 0.08,
  )
}

export const ENTRADAS: Record<Animacao, (vez: Vez) => void> = {
  foco,
  moeda,
  orbita,
  roleta,
  tambor,
}

/** Lê `?anim=` do endereço; sem ele (ou no servidor), a atual. */
export function animacaoDoEndereco(): Animacao {
  if (typeof location === "undefined") return "foco"
  const pedida = new URLSearchParams(location.search).get("anim")
  return ANIMACOES.find((nome) => nome === pedida) ?? "foco"
}
