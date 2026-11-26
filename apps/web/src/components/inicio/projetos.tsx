import { type Locale, projects, t as traduzir } from "@portfolio/content"
import { Card } from "@portfolio/ui/components/card"
import { getLocale, getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

// Os cinco primeiros no ar, na ordem do arquivo de conteúdo.
const VITRINE = projects.filter((p) => p.status === "live").slice(0, 5)

export async function Projetos() {
  const t = await getTranslations("inicio.projetos")
  const locale = (await getLocale()) as Locale

  return (
    <section
      id="projetos"
      className="mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-32"
    >
      <h2
        data-mov="subir"
        className="text-5xl font-semibold tracking-tight md:text-6xl"
      >
        {t("titulo")}
      </h2>
      <ul className="mt-12 grid auto-rows-fr gap-4 md:grid-cols-3">
        {VITRINE.map((projeto, indice) => (
          <li
            key={projeto.slug}
            data-mov="subir"
            className={cn(
              indice === 0 && "md:col-span-2 md:row-span-2",
              indice === 2 && "rounded-2xl bloco-vinho",
            )}
          >
            <Card
              asChild
              variant="contorno"
              className="h-full min-h-56 justify-end gap-3 bg-transparent p-6"
            >
              <Link
                href={{
                  params: { slug: projeto.slug },
                  pathname: "/projetos/[slug]",
                }}
              >
                <span className="text-3xl font-semibold tracking-tight">
                  {projeto.name} →
                </span>
                <span className="max-w-md text-sm text-pretty text-muted-foreground">
                  {traduzir(projeto.summary, locale)}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {projeto.stack.slice(0, 3).join(" · ")}
                </span>
              </Link>
            </Card>
          </li>
        ))}
      </ul>
      <Link
        href="/projetos"
        className="mt-8 inline-block font-mono text-sm underline underline-offset-4"
      >
        {t("verTodos")} →
      </Link>
    </section>
  )
}
