"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

/**
 * Fundo do cartão de projeto (pedido do Rodrigo, 27/11): as fotos do projeto
 * passam como slide, em fade lento, uma a cada 4 s, com um zoom leve na que
 * está à mostra. Quem pede menos movimento fica só com a primeira.
 */
export function FotosProjeto({
  destaque,
  fotos,
}: {
  /** O cartão grande pede fotos maiores. */
  destaque: boolean
  fotos: string[]
}) {
  const [vez, setVez] = useState(0)

  useEffect(() => {
    if (fotos.length < 2) return
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const passo = window.setInterval(
      () => setVez((atual) => (atual + 1) % fotos.length),
      4000,
    )
    return () => window.clearInterval(passo)
  }, [fotos.length])

  return (
    <span aria-hidden className="absolute inset-0 overflow-hidden rounded-2xl">
      {fotos.map((foto, indice) => (
        <Image
          key={foto}
          src={foto}
          alt=""
          fill
          sizes={
            destaque
              ? "(min-width: 768px) 56rem, 100vw"
              : "(min-width: 768px) 28rem, 100vw"
          }
          className={cn(
            "object-cover object-top troca-foto",
            indice === vez ? "scale-105 opacity-100" : "scale-100 opacity-0",
          )}
        />
      ))}
      {/* Véu escuro de baixo para cima: o texto do cartão fica legível. */}
      <span className="absolute inset-0 bg-linear-to-t from-background from-35% via-background/85 to-background/20" />
    </span>
  )
}
