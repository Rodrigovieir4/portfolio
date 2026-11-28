"use client"

import { ArrowDown, Check, Copy, Play } from "lucide-react"
import { useState, useSyncExternalStore } from "react"

import { Link } from "@/i18n/navigation"

/**
 * Opções para o canto do rodapé, para o Rodrigo escolher (27/11: a hora não
 * agradou). Troca pelo endereço: `?rodape=jogo` (a padrão), `copiar`,
 * `comando` ou `cv`. Escolhida uma, as outras saem deste arquivo.
 */
const OPCOES = ["jogo", "copiar", "comando", "cv"] as const
type Opcao = (typeof OPCOES)[number]

export interface RotulosRodape {
  copiado: string
  copiar: string
  curriculo: string
  jogar: string
}

const semAviso = () => () => {}
function opcaoDoEndereco(): Opcao {
  const pedida = new URLSearchParams(location.search).get("rodape")
  return OPCOES.find((nome) => nome === pedida) ?? "jogo"
}

const LINK =
  "group flex items-center gap-2 transition-colors hover:text-vinho-claro"

/** O e-mail com um botão de copiar, que confirma por um instante. */
function Copiar({ email, rotulos }: { email: string; rotulos: RotulosRodape }) {
  const [copiado, setCopiado] = useState(false)
  async function copiar() {
    await navigator.clipboard.writeText(email)
    setCopiado(true)
    window.setTimeout(() => setCopiado(false), 1800)
  }
  return (
    <button type="button" onClick={copiar} className={LINK}>
      {email}
      {copiado ? (
        <span className="flex items-center gap-1 text-vinho-claro">
          <Check className="size-3.5" />
          {rotulos.copiado}
        </span>
      ) : (
        <Copy aria-label={rotulos.copiar} className="size-3.5" />
      )}
    </button>
  )
}

export function CantoRodape({
  cv,
  email,
  rotulos,
}: {
  cv: string
  email: string
  rotulos: RotulosRodape
}) {
  const opcao = useSyncExternalStore(
    semAviso,
    opcaoDoEndereco,
    () => "jogo" as const,
  )
  if (opcao === "copiar") return <Copiar email={email} rotulos={rotulos} />
  if (opcao === "comando") {
    return (
      <span className="flex items-center gap-2">
        <span className="text-vinho-claro">❯</span> exit 0
        <span
          aria-hidden
          className="ml-0.5 inline-block h-3.5 w-1.5 bg-vinho-claro motion-safe:animate-pulse"
        />
      </span>
    )
  }
  if (opcao === "cv") {
    return (
      <a href={cv} download className={LINK}>
        {rotulos.curriculo}
        <ArrowDown className="size-3.5 transition-transform group-hover:translate-y-0.5" />
      </a>
    )
  }
  return (
    <Link href="/jogo" className={LINK}>
      <Play className="size-3.5 fill-current" />
      {rotulos.jogar}
    </Link>
  )
}
