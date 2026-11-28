import type { ComponentType } from "react"

import { profile } from "@portfolio/content"
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@portfolio/ui"
import { Mail } from "lucide-react"

/**
 * Os canais de contato, na ordem em que aparecem no contato e no rodapé. O
 * WhatsApp (com o telefone) entrou a pedido do Rodrigo, 27/11.
 */
export interface Canal {
  handle: string
  /** O componente do ícone: cada lugar escolhe o tamanho. */
  Icone: ComponentType<{ className?: string }>
  nome: string
  platform: string
  url: string
}

const ORDEM: [string, string, Canal["Icone"]][] = [
  ["whatsapp", "WhatsApp", WhatsappIcon],
  ["email", "E-mail", Mail],
  ["linkedin", "LinkedIn", LinkedinIcon],
  ["github", "GitHub", GithubIcon],
]

export const CANAIS: Canal[] = ORDEM.flatMap(([platform, nome, Icone]) => {
  const rede = profile.socials.find((s) => s.platform === platform)
  return rede
    ? [{ handle: rede.handle ?? "", Icone, nome, platform, url: rede.url }]
    : []
})

/** Abre em nova aba, menos o e-mail. */
export const alvo = (canal: Canal) =>
  canal.platform === "email" ? {} : { rel: "noreferrer", target: "_blank" }
