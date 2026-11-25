"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

import { NomePressao } from "./nome-pressao"

type Estilo = "contorno" | "luz" | "pressao" | "sobrio"

const ESTILOS: Estilo[] = ["contorno", "luz", "pressao", "sobrio"]

// O endereço não muda com a página aberta: nada a assinar.
const semAssinatura = () => () => {}

// shortcut: estilo escolhido por ?nome= enquanto o Rodrigo compara; quando
// ele decidir, fica só o escolhido e este seletor some.
function estiloDaUrl(): Estilo {
  const pedido = new URLSearchParams(window.location.search).get("nome")
  return ESTILOS.find((estilo) => estilo === pedido) ?? "pressao"
}

type Props = { completo: string; nome: string; sobrenome: string }

/**
 * Nome gigante da abertura, em quatro estilos para comparar:
 * - pressao: TextPressure completo (padrão atual);
 * - sobrio: TextPressure contido, só o peso reage ao mouse;
 * - luz: nome fino aceso pelo feixe, a luz segue o mouse;
 * - contorno: nome só em contorno, revelado do centro para as pontas.
 */
export function NomeAbertura({ completo, nome, sobrenome }: Props) {
  const estilo = useSyncExternalStore(
    semAssinatura,
    estiloDaUrl,
    () => "pressao" as const,
  )

  return (
    <div data-estilo={estilo}>
      <div className="mx-auto max-w-7xl px-4 max-md:hidden lg:px-8">
        <Linhas estilo={estilo} linhas={[completo]} />
      </div>
      {/* O TextPressure alarga as letras e precisa de folga no celular. */}
      <div
        className={cn(
          "mx-auto md:hidden",
          estilo === "pressao" || estilo === "sobrio" ? "w-2/3" : "w-full",
        )}
      >
        <Linhas estilo={estilo} linhas={[nome, sobrenome]} />
      </div>
    </div>
  )
}

function Linhas({ estilo, linhas }: { estilo: Estilo; linhas: string[] }) {
  if (estilo === "luz") return <NomeLuz linhas={linhas} />
  if (estilo === "contorno") {
    return (
      <p
        aria-label={linhas.join(" ")}
        data-contorno
        className="text-center texto-nome leading-none font-medium tracking-tight whitespace-nowrap nome-contorno uppercase"
      >
        {linhas.map((linha) => (
          <span key={linha} aria-hidden className="block">
            {linha}
          </span>
        ))}
      </p>
    )
  }
  return (
    <div className="flex flex-col">
      {linhas.map((linha) => (
        <NomePressao key={linha} sobrio={estilo === "sobrio"} texto={linha} />
      ))}
    </div>
  )
}

/** Nome fino, aceso no centro como se o feixe o iluminasse. */
function NomeLuz({ linhas }: { linhas: string[] }) {
  const texto = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const elemento = texto.current
    if (!elemento) return
    // A luz acompanha o mouse na horizontal; a transição fica no CSS.
    const mover = (evento: PointerEvent) => {
      if (evento.pointerType !== "mouse") return
      const caixa = elemento.getBoundingClientRect()
      const x = ((evento.clientX - caixa.left) / caixa.width) * 100
      elemento.style.setProperty("--luz-x", `${Math.max(0, Math.min(100, x))}%`)
    }
    window.addEventListener("pointermove", mover, { passive: true })
    return () => window.removeEventListener("pointermove", mover)
  }, [])

  return (
    <p
      ref={texto}
      aria-label={linhas.join(" ")}
      data-luz
      className="nome-luz text-center texto-nome leading-none font-extralight tracking-tight whitespace-nowrap uppercase"
    >
      {linhas.map((linha) => (
        <span key={linha} aria-hidden className="block">
          {linha}
        </span>
      ))}
    </p>
  )
}
