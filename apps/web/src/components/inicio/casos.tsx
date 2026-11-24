import { getTranslations } from "next-intl/server"

import { cn } from "@/lib/utils"

/*
 * shortcut: titulos vem das mensagens enquanto o tipo Caso nao existe em
 * packages/content; trocar pela leitura dos casos quando ele entrar.
 */
type Item = [titulo: string, meta: string]

export async function Casos() {
  const t = await getTranslations("inicio.casos")
  const itens = t.raw("itens") as Item[]

  return (
    <section id="casos" className="py-24 lg:py-32">
      <div className="mx-auto flex max-w-7xl items-end justify-between px-4 lg:px-8">
        <h2 className="text-5xl font-semibold tracking-tight md:text-6xl">
          {t("titulo")}
        </h2>
        <p className="font-mono text-xs text-muted-foreground">
          {String(itens.length).padStart(2, "0")} · {t("dica")} →
        </p>
      </div>
      <ol className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden px-4 pb-6 lg:px-8">
        {itens.map(([titulo, meta], indice) => (
          <li
            key={titulo}
            className={cn(
              "flex w-72 shrink-0 snap-start flex-col justify-end gap-3 rounded-2xl border border-border bg-card p-6 md:w-80",
              indice === 0 && "border-vinho-claro",
            )}
          >
            <div className="mb-auto aspect-video w-full rounded-xl bloco-vinho" />
            <span className="font-mono text-xs text-muted-foreground">
              {t("emBreve")}
            </span>
            <h3 className="text-2xl font-semibold tracking-tight text-balance">
              {titulo}
            </h3>
            <p className="font-mono text-xs text-muted-foreground">{meta}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
