import { getTranslations } from "next-intl/server"
import {
  siBun,
  siCloudflare,
  siDart,
  siDocker,
  siDrizzle,
  siExpo,
  siFirebase,
  siFlutter,
  siGithubactions,
  siGsap,
  siJest,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siPostgresql,
  siPrisma,
  siPython,
  siReact,
  siRedis,
  siShadcnui,
  siStripe,
  siSupabase,
  siTailwindcss,
  siThreedotjs,
  siTurborepo,
  siTypeorm,
  siTypescript,
  siVercel,
  siVitest,
  siZod,
} from "simple-icons"

import { cn } from "@/lib/utils"

import { Comando } from "./comando"
// O Simple Icons tirou a AWS (marca) e não tem o Playwright: vêm do Devicon.
import devicon from "./marcas-devicon.json"

interface Marca {
  /** viewBox do ícone: 24 no Simple Icons, 128 no Devicon. */
  caixa: number
  /** Liga a cor da marca no hover (`[data-marca]` no globals.css). */
  chave: string
  nome: string
  path: string
}

/*
 * O que ele usa de fato, levantado nas dependências dos 14 repositórios em
 * D:/workspace (27/11): em cima o lado do servidor, dos dados e da entrega;
 * embaixo a interface, o mobile e os testes.
 */
const LINHAS: Marca[][] = [
  [
    {
      caixa: 24,
      chave: "typescript",
      nome: "TypeScript",
      path: siTypescript.path,
    },
    { caixa: 24, chave: "node", nome: "Node.js", path: siNodedotjs.path },
    { caixa: 24, chave: "nestjs", nome: "NestJS", path: siNestjs.path },
    { caixa: 24, chave: "bun", nome: "Bun", path: siBun.path },
    {
      caixa: 24,
      chave: "postgresql",
      nome: "PostgreSQL",
      path: siPostgresql.path,
    },
    { caixa: 24, chave: "supabase", nome: "Supabase", path: siSupabase.path },
    { caixa: 24, chave: "prisma", nome: "Prisma", path: siPrisma.path },
    { caixa: 24, chave: "drizzle", nome: "Drizzle", path: siDrizzle.path },
    { caixa: 24, chave: "typeorm", nome: "TypeORM", path: siTypeorm.path },
    { caixa: 24, chave: "redis", nome: "Redis", path: siRedis.path },
    { caixa: 128, chave: "aws", nome: "AWS", path: devicon.aws },
    { caixa: 24, chave: "docker", nome: "Docker", path: siDocker.path },
    {
      caixa: 24,
      chave: "cloudflare",
      nome: "Cloudflare",
      path: siCloudflare.path,
    },
    { caixa: 24, chave: "vercel", nome: "Vercel", path: siVercel.path },
    {
      caixa: 24,
      chave: "github-actions",
      nome: "GitHub Actions",
      path: siGithubactions.path,
    },
    { caixa: 24, chave: "stripe", nome: "Stripe", path: siStripe.path },
    { caixa: 24, chave: "firebase", nome: "Firebase", path: siFirebase.path },
  ],
  [
    { caixa: 24, chave: "react", nome: "React", path: siReact.path },
    { caixa: 24, chave: "next", nome: "Next.js", path: siNextdotjs.path },
    {
      caixa: 24,
      chave: "react-native",
      nome: "React Native",
      path: siReact.path,
    },
    { caixa: 24, chave: "expo", nome: "Expo", path: siExpo.path },
    { caixa: 24, chave: "flutter", nome: "Flutter", path: siFlutter.path },
    { caixa: 24, chave: "dart", nome: "Dart", path: siDart.path },
    {
      caixa: 24,
      chave: "tailwind",
      nome: "Tailwind CSS",
      path: siTailwindcss.path,
    },
    { caixa: 24, chave: "shadcn", nome: "shadcn/ui", path: siShadcnui.path },
    { caixa: 24, chave: "three", nome: "Three.js", path: siThreedotjs.path },
    { caixa: 24, chave: "gsap", nome: "GSAP", path: siGsap.path },
    { caixa: 24, chave: "zod", nome: "Zod", path: siZod.path },
    {
      caixa: 24,
      chave: "turborepo",
      nome: "Turborepo",
      path: siTurborepo.path,
    },
    {
      caixa: 128,
      chave: "playwright",
      nome: "Playwright",
      path: devicon.playwright,
    },
    { caixa: 24, chave: "vitest", nome: "Vitest", path: siVitest.path },
    { caixa: 24, chave: "jest", nome: "Jest", path: siJest.path },
    { caixa: 24, chave: "python", nome: "Python", path: siPython.path },
    { caixa: 24, chave: "java", nome: "Java", path: siOpenjdk.path },
  ],
]

function Faixa({ itens, reversa }: { itens: Marca[]; reversa: boolean }) {
  // A lista vai duas vezes e a animação anda metade: a segunda cópia cai no
  // lugar exato da primeira. Por isso o espaço é padding de cada item, não
  // gap (o gap deixaria meio espaço de diferença e a faixa daria um pulo).
  const dobrada = [...itens, ...itens]

  return (
    <div className="overflow-hidden mask-x-from-85%">
      <ul
        data-mov="faixa"
        // Parar no hover deixa ler e apontar a tecnologia.
        className={cn(
          "flex w-max py-4 hover:[animation-play-state:paused]",
          reversa
            ? "motion-safe:animate-faixa-reversa"
            : "motion-safe:animate-faixa",
        )}
      >
        {dobrada.map((item, indice) => (
          <li
            key={`${item.nome}-${indice}`}
            aria-hidden={indice >= itens.length}
            data-marca={item.chave}
            className="flex items-center gap-3 pr-14 text-2xl font-medium whitespace-nowrap text-muted-foreground transition-colors duration-300 hover:cor-marca md:pr-16 md:text-3xl"
          >
            <svg
              aria-hidden
              viewBox={`0 0 ${item.caixa} ${item.caixa}`}
              className="size-6 shrink-0 fill-current md:size-8"
            >
              <path d={item.path} />
            </svg>
            {item.nome}
          </li>
        ))}
      </ul>
    </div>
  )
}

export async function Stack() {
  const t = await getTranslations("inicio.stack")
  const c = await getTranslations("inicio.comandos")

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <Comando texto={c("stack")} className="mb-4" />
        <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
          {t("titulo")}
        </h2>
        <p className="mt-3 font-mono text-sm text-muted-foreground">
          {t("nota")}
        </p>
      </div>
      <div className="mt-12 flex flex-col gap-4">
        {LINHAS.map((itens, indice) => (
          <Faixa key={itens[0]?.chave} itens={itens} reversa={indice === 1} />
        ))}
      </div>
    </section>
  )
}
