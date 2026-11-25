import { getTranslations } from "next-intl/server"

import { cn } from "@/lib/utils"

type Item = [valor: string, legenda: string]

export async function Numeros() {
  const t = await getTranslations("inicio.numeros")
  const itens = t.raw("itens") as Item[]

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-32">
      <h2 data-mov="subir" className="text-3xl font-semibold tracking-tight">
        {t("titulo")}
      </h2>
      <dl className="mt-10 grid border-t border-border sm:grid-cols-2 lg:grid-cols-4">
        {itens.map(([valor, legenda], indice) => (
          <div
            key={valor}
            className="flex flex-col-reverse gap-4 border-b border-border py-8 sm:border-r sm:px-6"
          >
            <dt className="font-mono text-sm text-pretty text-muted-foreground">
              {legenda}
            </dt>
            <dd
              data-mov="numero"
              className={cn(
                "font-numeros text-6xl leading-none whitespace-nowrap lg:text-7xl",
                indice === 1 && "text-vinho-claro",
              )}
            >
              {valor}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
