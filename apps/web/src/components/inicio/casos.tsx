import {
  type Case,
  type Locale,
  cases,
  t as traduzir,
} from "@portfolio/content"
import { Card } from "@portfolio/ui/components/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@portfolio/ui/components/carousel"
import { ArrowUpRight } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

import { Comando } from "./comando"

const TOTAL = String(cases.length).padStart(2, "0")

/**
 * Um caso como cartão alto, no estilo do "Apple Card Carousel" (shadcnspace,
 * 21st.dev, pedido do Rodrigo em 26/11): rótulo pequeno e título grande no
 * alto, botão redondo de seta no canto. Os cartões alternam grafite e vinho
 * até cada caso ter imagem ou vídeo próprio.
 */
function CartaoVitrine({
  caso,
  indice,
  locale,
}: {
  caso: Case
  indice: number
  locale: Locale
}) {
  return (
    <Card
      asChild
      variant="contorno"
      className={cn(
        "group relative h-112 gap-0 rounded-3xl p-8",
        indice % 2 === 1 && "bloco-vinho",
      )}
    >
      <Link href={{ params: { slug: caso.slug }, pathname: "/casos/[slug]" }}>
        <span className="font-mono text-xs text-foreground/70">
          {caso.stack.slice(0, 2).join(" · ")}
        </span>
        <span className="mt-4 text-3xl font-semibold tracking-tight text-balance">
          {traduzir(caso.title, locale)}
        </span>
        <span className="mt-4 line-clamp-4 text-sm text-pretty text-foreground/65">
          {traduzir(caso.summary, locale)}
        </span>
        <span className="mt-auto font-mono text-xs text-foreground/50">
          {String(indice + 1).padStart(2, "0")} / {TOTAL}
        </span>
        <span
          aria-hidden
          className="absolute right-6 bottom-6 flex size-11 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:scale-110"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </Link>
    </Card>
  )
}

/**
 * Casos num carrossel de cartões altos (Carousel do shadcn, com arraste
 * livre): passam arrastando, com as setas embaixo ou com o teclado. No
 * computador, a rolagem dá uma travadinha na seção (movimento.tsx).
 */
export async function Casos() {
  const t = await getTranslations("inicio.casos")
  const c = await getTranslations("inicio.comandos")
  const locale = (await getLocale()) as Locale

  return (
    <section id="casos">
      {/* O GSAP prende este div, não a seção: se prendesse um filho direto do
          <main>, o React não acharia o nó ao trocar de página. */}
      <div data-mov="arco" className="py-24 lg:py-32">
        <Carousel
          opts={{ align: "start", dragFree: true }}
          className="mx-auto w-full max-w-7xl px-4 lg:px-8"
        >
          <div className="flex items-end justify-between gap-6">
            <div>
              <Comando texto={c("casos")} className="mb-4" />
              <h2
                data-mov="subir"
                className="text-5xl font-semibold tracking-tight md:text-6xl"
              >
                {t("titulo")}
              </h2>
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {TOTAL} · {t("dica")} →
            </p>
          </div>
          <CarouselContent className="mt-12">
            {cases.map((caso, indice) => (
              <CarouselItem key={caso.slug} className="basis-80 md:basis-96">
                <CartaoVitrine caso={caso} indice={indice} locale={locale} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex items-center justify-between gap-6">
            <Link
              href="/casos"
              className="font-mono text-sm underline underline-offset-4"
            >
              {t("verTodos")} →
            </Link>
            <div className="flex gap-3">
              <CarouselPrevious
                aria-label={t("anterior")}
                className="static size-11"
              />
              <CarouselNext
                aria-label={t("proximo")}
                className="static size-11"
              />
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  )
}
