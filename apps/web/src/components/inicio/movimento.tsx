"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

import { maquinaLeve } from "./capacidade"
import { digitar } from "./digitar"
import { IMPACTO } from "./laser"
import { areaDeRolagem } from "./rolagem"
import { secoes } from "./secoes"

gsap.registerPlugin(ScrollTrigger, SplitText)
// As animações seguem o relógio: em quadro lento elas pulam, mas terminam na
// hora. Com a suavização padrão, quadros longos viram 33 ms e a abertura
// levaria minutos para acabar numa máquina sem placa de vídeo.
gsap.ticker.lagSmoothing(0)

const SAIDA = "expo.out"

/**
 * Movimento do site, num lugar só.
 *
 * As seções continuam componentes de servidor e só marcam os elementos com
 * `data-mov`. Este componente procura as marcas e liga as animações. Sem
 * JavaScript, com menos movimento pedido no sistema ou antes de hidratar, a
 * página aparece inteira e parada: nada nasce escondido no HTML.
 *
 * Três níveis:
 * - menos movimento: nada anima;
 * - máquina leve (até 2 núcleos ou 2 GB): só entradas simples, sem rolagem
 *   atrelada a cada quadro;
 * - o resto: tudo, e a travadinha nos casos a partir de 1024 px.
 */
export function Movimento() {
  const pathname = usePathname()

  useEffect(() => {
    const leve = maquinaLeve()
    // Os gatilhos de rolagem ouvem a área do ScrollArea, não a janela.
    ScrollTrigger.defaults({ scroller: areaDeRolagem() ?? window })
    const mm = gsap.matchMedia()

    mm.add(
      {
        largo: "(min-width: 1024px)",
        // Sem uso direto: cruzar 768 px troca o layout da trajetória, e o
        // GSAP refaz tudo, com as posições dos marcos medidas de novo.
        medio: "(min-width: 768px)",
        movimento: "(prefers-reduced-motion: no-preference)",
      },
      (contexto) => {
        const { largo, movimento } = contexto.conditions ?? {}
        if (!movimento) return

        const soltarAberturaBruta = abertura(contexto)
        const soltarAbertura = () => {
          soltarAberturaBruta?.()
          // Se a página sair no meio da digitação, o nome volta inteiro.
          promptCompleto()
        }
        entradas()
        linhaDoTempo()
        const soltarSecoes = secoes(contexto, {
          fixar: Boolean(largo) && !leve,
        })
        if (leve) {
          return () => {
            soltarAbertura?.()
            soltarSecoes()
          }
        }

        retrato()
        contato()
        if (largo) travarCasos()
        // A trava dos casos alonga a página, mas é criada depois dos gatilhos
        // das seções de baixo: sem reordenar, eles disparam cedo.
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
        return () => {
          soltarAbertura?.()
          soltarSecoes()
        }
      },
    )

    return () => mm.revert()
  }, [pathname])

  return null
}

function um(seletor: string) {
  return document.querySelector<HTMLElement>(`[data-mov="${seletor}"]`)
}

/** Blocos da abertura que nascem escondidos até o impacto do laser. */
function blocosDaAbertura() {
  return gsap.utils.toArray<HTMLElement>("[data-revelar]")
}

function todos(seletor: string) {
  return gsap.utils.toArray<HTMLElement>(`[data-mov="${seletor}"]`)
}

/**
 * Roda a ação quando o laser da abertura bate no chão. Se o laser não vier
 * (sem WebGL, máquina fraca), a reserva libera do mesmo jeito.
 */
function quandoImpactar(acao: () => void) {
  if ("impacto" in document.documentElement.dataset) {
    acao()
    return
  }
  let feito = false
  const uma = () => {
    if (feito) return
    feito = true
    acao()
  }
  window.addEventListener(IMPACTO, uma, { once: true })
  const reserva = setTimeout(uma, 1800)
  return () => {
    clearTimeout(reserva)
    window.removeEventListener(IMPACTO, uma)
  }
}

/**
 * No início, a abertura espera o laser bater no chão. Nas outras páginas,
 * o título e os textos entram logo.
 */
function abertura(contexto: gsap.Context) {
  const naAbertura = blocosDaAbertura().length > 0
  // De volta ao início sem recarregar: a abertura já foi vista e fica parada.
  // Só recarregar a página (como na troca de idioma) a mostra de novo.
  if (naAbertura && "revelado" in document.documentElement.dataset) return
  if (!naAbertura) {
    // Fora do início, o cabeçalho não espera laser nenhum.
    delete document.documentElement.dataset.abertura
    entradaSimples()
    return
  }
  // contexto.add mantém as animações no matchMedia, para o revert desfazer.
  return quandoImpactar(
    contexto.add("revelarAbertura", revelarAbertura) as () => void,
  )
}

function entradaSimples() {
  digitarPrompt(0.2)
  const palavras = palavrasDoTitulo()
  if (palavras) {
    gsap.from(palavras, {
      delay: 0.1,
      duration: 1.2,
      ease: SAIDA,
      stagger: 0.07,
      yPercent: 110,
    })
  }
  gsap.from(todos("abertura"), {
    delay: 0.55,
    duration: 1,
    ease: SAIDA,
    opacity: 0,
    stagger: 0.08,
    y: 24,
  })
}

/**
 * Coreografia do impacto, em cerca de 1,8 s:
 * - o retrato sobe com a luz, de baixo para cima, saindo de um brilho forte;
 * - as letras do nome saem de dentro do feixe (centro da tela) e se espalham
 *   até o lugar delas, saindo do desfoque;
 * - o título gira de leve em profundidade ao subir;
 * - os textos entram por último e o botão principal ganha um pulso de brilho.
 */
function revelarAbertura() {
  const linha = gsap.timeline({
    defaults: { ease: SAIDA },
    // Marca o fim da revelação animada; os testes de ponta a ponta esperam.
    onComplete: () => {
      const marcas = document.documentElement.dataset
      marcas.revelado = ""
      // Revelado de vez: nada mais nasce escondido até recarregar.
      delete marcas.abertura
    },
  })
  linha.set(blocosDaAbertura(), { autoAlpha: 1 })
  revelarRetrato(linha)
  const cabecalho = document.querySelector("[data-cabecalho]")
  if (cabecalho) {
    linha.fromTo(
      cabecalho,
      { autoAlpha: 0, y: -16 },
      { autoAlpha: 1, clearProps: "transform", duration: 0.9, y: 0 },
      0.5,
    )
    linha.add(() => digitarPrompt(), 0.6)
  }
  revelarNome(linha)

  revelarTitulo(linha, 0.45)
  linha.from(
    todos("abertura"),
    { duration: 0.9, filter: "blur(8px)", opacity: 0, stagger: 0.07, y: 16 },
    0.7,
  )
}

function revelarRetrato(linha: gsap.core.Timeline) {
  const foto = um("retrato")
  if (!foto) return
  linha.fromTo(
    foto,
    {
      clipPath: "inset(100% 0% 0% 0%)",
      filter: "brightness(2.6) saturate(0.6) blur(6px)",
      scale: 1.04,
    },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.4,
      // Sem filtro nem recorte no fim: filtro parado ainda força a foto
      // numa camada própria e pode tirar nitidez.
      clearProps: "filter,clipPath",
      ease: "power3.out",
      filter: "brightness(1) saturate(1) blur(0px)",
      scale: 1,
    },
    0,
  )
}

/**
 * No impacto o nome nasce dentro do feixe: começa comprimido no centro, com
 * as letras juntas e desfocadas, e se abre para os lados até o lugar dele,
 * enquanto a luz se espalha do feixe para as pontas. Sem quebrar em letras,
 * para não perder o degradê da luz (background-clip: text).
 */
function revelarNome(linha: gsap.core.Timeline) {
  const nomes = gsap.utils
    .toArray<HTMLElement>("[data-luz]")
    .filter((nome) => nome.offsetParent)
  if (nomes.length === 0) return
  const espaco = getComputedStyle(nomes[0]!).letterSpacing
  linha.fromTo(
    nomes,
    {
      clipPath: "inset(0% 46% 0% 46%)",
      filter: "blur(16px)",
      letterSpacing: "-0.28em",
      opacity: 0,
    },
    {
      clearProps: "clipPath,filter,letterSpacing",
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.6,
      // Abertura bem distribuída: com expo.out ela acabava em 0,2 s.
      ease: "power2.inOut",
      filter: "blur(0px)",
      letterSpacing: espaco,
      opacity: 1,
    },
    0.05,
  )
  linha.fromTo(
    nomes,
    { "--luz-raio": "0%" },
    { "--luz-raio": "46%", duration: 1.8, ease: "power2.out" },
    0.15,
  )
}

/** O título da abertura sai do desfoque, letra por letra. */
function revelarTitulo(linha: gsap.core.Timeline, em: number) {
  const titulo = um("titulo")
  if (!titulo) return
  const letras = SplitText.create(titulo, {
    tag: "span",
    type: "chars,words",
  }).chars
  linha.from(
    letras,
    { duration: 0.8, filter: "blur(10px)", opacity: 0, stagger: 0.025, y: 6 },
    em,
  )
}

/**
 * Digita o nome do prompt do cabeçalho, letra por letra, como num terminal.
 * Uma vez por carregamento: trocando de página, o cabeçalho já está escrito.
 */
function digitarPrompt(atraso = 0) {
  const alvo = document.querySelector<HTMLElement>("[data-prompt]")
  const marcas = document.documentElement.dataset
  if (!alvo || "promptDigitado" in marcas) return
  // Enquanto digita o cursor fica firme; pisca só quando termina.
  document.querySelector("[data-cursor]")?.classList.remove("cursor-terminal")
  digitar({
    aoTerminar: () => {
      marcas.promptDigitado = ""
      promptCompleto()
    },
    atraso,
    escrever: (texto) => {
      alvo.textContent = texto
    },
    final: alvo.dataset.final ?? "",
  })
}

/** Nome inteiro e cursor piscando devagar uns segundos, depois parado. */
function promptCompleto() {
  const alvo = document.querySelector<HTMLElement>("[data-prompt]")
  if (alvo) alvo.textContent = alvo.dataset.final ?? alvo.textContent
  document.querySelector("[data-cursor]")?.classList.add("cursor-terminal")
}

function palavrasDoTitulo() {
  const titulo = um("titulo")
  if (!titulo) return null
  const partes = SplitText.create(titulo, {
    mask: "words",
    tag: "span",
    type: "words",
  })
  // <span> é em linha, e o navegador ignora transform e corte em elemento em
  // linha: sem isto a palavra não se mexe nem some atrás da máscara.
  gsap.set([...partes.masks, ...partes.words], { display: "inline-block" })
  return partes.words
}

/** Entradas ao rolar: em lote, para quem chega junto subir em sequência. */
function entradas() {
  lote("subir", { de: { opacity: 0, y: 40 }, para: { opacity: 1, y: 0 } })
  lote("numero", {
    de: { clipPath: "inset(0% 0% 100% 0%)", yPercent: 40 },
    para: { clipPath: "inset(0% 0% 0% 0%)", yPercent: 0 },
  })
}

function lote(
  seletor: string,
  { de, para }: { de: gsap.TweenVars; para: gsap.TweenVars },
) {
  const itens = todos(seletor)
  if (itens.length === 0) return
  gsap.set(itens, de)
  ScrollTrigger.batch(itens, {
    once: true,
    onEnter: (grupo) =>
      gsap.to(grupo, { ...para, duration: 1.1, ease: SAIDA, stagger: 0.09 }),
    start: "top 90%",
  })
}

/**
 * A linha desce com a rolagem, com uma luz vinho correndo na ponta, e cada
 * marco aparece e acende o ponto quando ela chega nele.
 */
function linhaDoTempo() {
  const linha = um("linha")
  const ponta = um("ponta")
  const marcos = todos("marco")
  if (!linha?.parentElement) return

  // A linha (e a ponta) termina no ponto do último marco, não no fim da caixa:
  // a caixa vai até o marco mais comprido, que nem sempre é o último.
  const ponto = (marco: HTMLElement) => {
    const bolinha = marco.querySelector("span")
    return (
      marco.offsetTop +
      (bolinha ? bolinha.offsetTop + bolinha.offsetHeight / 2 : 0)
    )
  }
  const ultimo = marcos.at(-1)
  const fim = () => (ultimo ? ponto(ultimo) : linha.offsetHeight)
  // Onde cada marco fica ao longo da linha, de 0 a 1, pela posição real.
  let posicoes: number[] = []
  const medir = () => {
    gsap.set(linha, { height: fim() })
    posicoes = marcos.map((marco) => ponto(marco) / fim())
  }
  medir()
  const acender = (progresso: number) => {
    for (const [indice, marco] of marcos.entries()) {
      marco.dataset.passou = String(progresso >= (posicoes[indice] ?? 0))
    }
  }
  acender(0)

  const tl = gsap.timeline({
    onUpdate: () => acender(tl.progress()),
    scrollTrigger: {
      end: "bottom 70%",
      invalidateOnRefresh: true,
      onRefresh: medir,
      scrub: 0.6,
      start: "top 80%",
      trigger: linha.parentElement,
    },
  })
  tl.from(linha, {
    duration: 1,
    ease: "none",
    scaleY: 0,
    transformOrigin: "center top",
  })
  // Cada marco aparece quando a ponta chega na altura dele.
  for (const [indice, marco] of marcos.entries()) {
    tl.from(
      marco,
      { duration: 0.06, ease: "none", opacity: 0.15, y: 16 },
      posicoes[indice] ?? 0,
    )
  }
  if (ponta) {
    tl.set(ponta, { display: "block" }, 0)
    tl.fromTo(
      ponta,
      { top: "0%" },
      { duration: 1, ease: "none", top: () => fim() },
      0,
    )
  }
}

/** O retrato desce um pouco mais devagar que a página. */
function retrato() {
  const foto = um("retrato")
  if (!foto) return
  gsap.to(foto, {
    ease: "none",
    scrollTrigger: {
      end: "bottom top",
      scrub: true,
      start: "top top",
      trigger: foto.closest("section"),
    },
    yPercent: 14,
  })
}

/** O bloco de contato cresce até ocupar o espaço dele. */
function contato() {
  const bloco = um("contato")
  if (!bloco) return
  gsap.from(bloco, {
    borderRadius: 64,
    ease: "none",
    scale: 0.86,
    scrollTrigger: {
      end: "top 35%",
      scrub: true,
      start: "top bottom",
      trigger: bloco,
    },
  })
}

/**
 * A rolagem dá só uma travadinha nos casos: a seção fica presa no meio da
 * tela por meia tela de rolagem, para o carrossel ser visto, e nada se mexe
 * com a rolagem.
 */
function travarCasos() {
  const secao = um("arco")
  if (!secao) return
  ScrollTrigger.create({
    end: "+=50%",
    pin: true,
    start: "center center",
    trigger: secao,
  })
}
