import { StatusDot } from "@portfolio/ui"
import { getTranslations } from "next-intl/server"

import { alvo, CANAIS } from "./canais"
import { Comando } from "./comando"
import { TituloProximidade } from "./titulo-proximidade"

/**
 * O fim da página, minimalista e do tamanho de uma tela (pedido do Rodrigo,
 * 27/11, que escolheu a forma "lista"): à esquerda, "Vamos conversar." em
 * duas linhas, a segunda em contorno, subindo letra por letra (secoes.ts),
 * com um texto curto e aberto embaixo; à direita, os canais em letras
 * grandes, com o ícone à esquerda. No hover, o canal ganha a cor dele e o
 * contato aparece ao lado (no celular, só o nome: o toque já abre).
 */
export async function Contato() {
  const t = await getTranslations("inicio.contato")
  const c = await getTranslations("inicio.comandos")
  const abertura = await getTranslations("inicio.abertura")

  return (
    <section
      id="contato"
      className="mx-auto flex min-h-svh max-w-7xl flex-col justify-center px-4 py-24 lg:px-8 lg:py-32"
    >
      <Comando texto={c("contato")} className="mb-12" />
      <div className="grid items-end gap-16 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-7">
          <TituloProximidade
            titulo={t("titulo")}
            className="texto-chamada font-semibold tracking-tight"
          />
          <p className="max-w-lg text-xl text-pretty text-muted-foreground md:text-2xl">
            {t("texto")}
          </p>
          {/* A mesma disponibilidade do hero, só o texto e a bolinha. */}
          <p className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
            <StatusDot />
            {abertura("disponivel")}
          </p>
        </div>
        <ul className="flex flex-col border-t border-border lg:col-span-5">
          {CANAIS.map((canal) => (
            <li key={canal.platform} data-marca={canal.platform}>
              <a
                href={canal.url}
                {...alvo(canal)}
                className="group flex items-center gap-5 border-b border-border py-6"
              >
                {/* Solto e do tamanho do texto (pedido do Rodrigo). */}
                <canal.Icone className="size-9 shrink-0 text-muted-foreground transition-colors duration-300 group-hover:cor-marca md:size-11" />
                <span className="text-4xl font-semibold tracking-tight transition-colors duration-300 group-hover:cor-marca md:text-5xl">
                  {canal.nome}
                </span>
                <span className="ml-auto font-mono text-xs text-muted-foreground transition duration-300 max-md:hidden md:translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100">
                  {canal.handle} ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
