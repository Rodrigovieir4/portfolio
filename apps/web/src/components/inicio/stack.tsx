import { getTranslations } from "next-intl/server"

import { cn } from "@/lib/utils"

const LINHAS = [
  ["TypeScript", "Node.js", "NestJS", "Next.js", "PostgreSQL", "AWS"],
  [
    "Flutter",
    "React Native",
    "Supabase",
    "Docker",
    "Tailwind CSS",
    "GitHub Actions",
  ],
]

function Faixa({ itens, reversa }: { itens: string[]; reversa: boolean }) {
  // A lista vai duas vezes para o laço da animação não ter emenda.
  const dobrada = [...itens, ...itens]

  return (
    <div className="overflow-hidden mask-x-from-85%">
      <ul
        className={cn(
          "flex w-max gap-16 py-4",
          reversa
            ? "motion-safe:animate-faixa-reversa"
            : "motion-safe:animate-faixa",
        )}
      >
        {dobrada.map((item, indice) => (
          <li
            key={`${item}-${indice}`}
            aria-hidden={indice >= itens.length}
            className="text-2xl font-medium whitespace-nowrap text-muted-foreground md:text-3xl"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export async function Stack() {
  const t = await getTranslations("inicio.stack")

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
          {t("titulo")}
        </h2>
        <p className="mt-3 font-mono text-sm text-muted-foreground">
          {t("nota")}
        </p>
      </div>
      <div className="mt-12 flex flex-col gap-4">
        {LINHAS.map((itens, indice) => (
          <Faixa key={itens[0]} itens={itens} reversa={indice === 1} />
        ))}
      </div>
    </section>
  )
}
