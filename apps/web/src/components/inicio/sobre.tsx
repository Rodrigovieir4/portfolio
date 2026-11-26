import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"

import { Comando } from "./comando"

type Item = [rotulo: string, texto: string]

/** Um item: o rótulo numerado ("01 / 03 · Formação") se decodifica. */
function ItemSobre({ item, numero }: { item: Item; numero: string }) {
  const [rotulo, texto] = item
  return (
    <li
      data-sobre-item
      className="flex flex-col gap-3 border-t border-border pt-4"
    >
      <p
        data-decodificar
        className="font-mono text-xs tracking-widest text-vinho-claro uppercase"
      >
        {numero} · {rotulo}
      </p>
      <p className="text-pretty text-muted-foreground">{texto}</p>
    </li>
  )
}

/**
 * Só na cena fixa (sobre-cena.ts mostra): "Sobre" em cima de "Mim" e, ao
 * rolar, um vai para cada lado enquanto o painel abre entre eles, a partir de
 * uma linha de laser.
 */
function CapaSobre({ a, b }: { a: string; b: string }) {
  return (
    <>
      <div
        aria-hidden
        data-sobre-fundo
        className="pointer-events-none absolute inset-0 z-10 hidden flex-col items-center justify-center texto-gigante font-semibold whitespace-nowrap uppercase"
      >
        {/* O bloco das duas palavras: é nele que a cachoeira de laser pousa
            e escorre pelos lados (laser-sobre.tsx). */}
        <div data-sobre-palavras className="flex flex-col items-center">
          <span data-sobre-palavra>{a}</span>
          <span data-sobre-palavra className="texto-contorno-vinho">
            {b}
          </span>
        </div>
      </div>
      <div
        aria-hidden
        data-sobre-linha
        className="pointer-events-none absolute inset-x-0 top-1/2 z-10 hidden h-px bg-vinho-claro luz-vinho"
      />
    </>
  )
}

/**
 * Sobre, como uma cena (rodada interativa de 26/11). No computador, com
 * movimento, a seção fica fixa enquanto rola: "Sobre" e "Mim", gigantes, se
 * afastam para os lados enquanto o painel abre a partir de uma linha de laser
 * até a tela; depois o texto acende e os três
 * itens se decodificam (sobre-cena.ts).
 * No celular, em máquina fraca ou sem movimento, é uma seção comum.
 */
export async function Sobre() {
  const t = await getTranslations("inicio.sobre")
  const c = await getTranslations("inicio.comandos")
  const itens = t.raw("itens") as Item[]
  const total = String(itens.length).padStart(2, "0")

  return (
    <section id="sobre">
      <div
        data-sobre-palco
        className="relative overflow-hidden px-4 py-24 lg:h-dvh lg:p-0"
      >
        <CapaSobre a={t("fundoA")} b={t("fundoB")} />
        <div
          data-sobre-painel
          // No computador o painel tem a cor da página: o texto entra direto,
          // sem caixa. No celular continua um cartão.
          className="relative overflow-hidden rounded-3xl border border-border bg-card lg:absolute lg:inset-0 lg:rounded-none lg:border-0 lg:bg-background"
        >
          <div
            data-sobre-conteudo
            className="relative mx-auto flex h-full max-w-7xl flex-col justify-center gap-10 px-6 py-16 lg:px-8 lg:pt-28"
          >
            <Comando manual texto={c("sobre")} />
            <p
              data-sobre-titulo
              className="max-w-5xl text-3xl font-medium tracking-tight text-balance md:text-5xl"
            >
              {t("texto")}{" "}
              <span className="text-vinho-claro">{t("destaque")}</span>
            </p>
            <ol className="grid gap-8 md:grid-cols-3">
              {itens.map((item, indice) => (
                <ItemSobre
                  key={item[0]}
                  item={item}
                  numero={`${String(indice + 1).padStart(2, "0")} / ${total}`}
                />
              ))}
            </ol>
            <Link
              href="/sobre"
              className="self-end font-mono text-sm underline underline-offset-4"
            >
              {t("mais")} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
