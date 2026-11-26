"use client"

import type { ReactNode } from "react"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import FlexCarousel from "@/components/reactbits/flex-carousel"
import { useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

import { aguentaShader } from "./capacidade"

export interface CapaCaso {
  alt: string
  slug: string
  src: string
  title: string
}

// A máquina e o pedido de menos movimento não mudam com a página aberta.
const semAssinatura = () => () => {}
const podeLigar = () =>
  aguentaShader() &&
  matchMedia("(prefers-reduced-motion: no-preference)").matches

/** Vira true quando o palco chega perto da tela, e fica assim. */
function usePerto(ligado: boolean) {
  const [perto, setPerto] = useState(false)
  const palco = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const alvo = palco.current
    if (!ligado || !alvo) return
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada?.isIntersecting) return
        setPerto(true)
        observador.disconnect()
      },
      { rootMargin: "300px 0px" },
    )
    observador.observe(alvo)
    return () => observador.disconnect()
  }, [ligado])

  return { palco, perto }
}

/**
 * Casos no Flex Carousel do React Bits (pedido do Rodrigo, 26/11): as capas
 * correm numa faixa que se dobra num vidro líquido nas pontas. Arrastar ou
 * usar as setas passa os casos; clicar no do meio abre o caso. Não anda
 * sozinho nem com a rolagem da página: só quando a pessoa mexe.
 *
 * É WebGL: só liga com placa de vídeo e com movimento permitido, e só monta
 * quando a seção chega perto da tela. Fora disso, ficam os cartões de sempre
 * (\`children\`), que também continuam na página para leitor de tela.
 */
export function CarrosselCasos({
  children,
  de,
  itens,
  rotulo,
}: {
  children: ReactNode
  de: string
  itens: CapaCaso[]
  rotulo: string
}) {
  const ligado = useSyncExternalStore(semAssinatura, podeLigar, () => false)
  const { palco, perto } = usePerto(ligado)
  const router = useRouter()

  return (
    <>
      {ligado ? (
        <div ref={palco} className="mt-8 h-140 lg:h-160">
          {perto ? (
            <FlexCarousel
              ariaLabel={rotulo}
              captions={false}
              captureWheel={false}
              cardHeight={0.62}
              fit="portrait"
              focusOnClick={false}
              items={itens}
              ofWord={de}
              onSelect={(indice) => {
                const caso = itens[indice]
                if (!caso) return
                router.push({
                  params: { slug: caso.slug },
                  pathname: "/casos/[slug]",
                })
              }}
              radius={20}
            />
          ) : null}
        </div>
      ) : null}
      <div className={cn(ligado && "sr-only")}>{children}</div>
    </>
  )
}
