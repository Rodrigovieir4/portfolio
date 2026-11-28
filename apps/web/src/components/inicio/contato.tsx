import { profile } from "@portfolio/content"
import { getTranslations } from "next-intl/server"

import { Comando } from "./comando"
import { type Canal, ContatoMocks } from "./contato-mocks"

/**
 * Todos os canais (o WhatsApp entrou a pedido do Rodrigo, 27/11), na ordem
 * em que aparecem.
 */
const ORDEM: [platform: string, nome: string][] = [
  ["whatsapp", "WhatsApp"],
  ["email", "E-mail"],
  ["linkedin", "LinkedIn"],
  ["github", "GitHub"],
]
const CANAIS: Canal[] = ORDEM.flatMap(([platform, nome]) => {
  const rede = profile.socials.find((s) => s.platform === platform)
  return rede
    ? [{ handle: rede.handle ?? "", nome, platform, url: rede.url }]
    : []
})

/**
 * O fim da página, minimalista (pedido do Rodrigo, 27/11): só "Vamos
 * conversar." e os contatos, aberto a negócio ou a uma dúvida. A forma vem de
 * contato-mocks.tsx, com opções para ele escolher.
 */
export async function Contato() {
  const t = await getTranslations("inicio.contato")
  const c = await getTranslations("inicio.comandos")

  return (
    <section
      id="contato"
      className="relative mx-auto max-w-7xl overflow-hidden px-4 pt-24 pb-16 lg:px-8 lg:pt-32"
    >
      <Comando texto={c("contato")} className="mb-10" />
      <ContatoMocks canais={CANAIS} titulo={t("titulo")} />
    </section>
  )
}
