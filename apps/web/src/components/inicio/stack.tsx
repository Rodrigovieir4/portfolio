import { getTranslations } from "next-intl/server"
import {
  siDocker,
  siExpo,
  siFlutter,
  siGit,
  siJavascript,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siPostgresql,
  siPython,
  siReact,
  siShadcnui,
  siSupabase,
  siTailwindcss,
  siThreedotjs,
  siTurborepo,
  siTypeorm,
  siTypescript,
  siVercel,
} from "simple-icons"

import { cn } from "@/lib/utils"

import { Comando } from "./comando"
// O Simple Icons tirou a AWS (marca): ela vem do Devicon.
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
 * Só o que ele domina (pedido do Rodrigo, 27/11): o que os dois currículos
 * dele listam como competência. A lista anterior saiu das dependências dos
 * repositórios e trazia o que outras pessoas instalaram (Redis, Zod, Jest...).
 * Em cima linguagens, servidor, dados e entrega; embaixo interface e mobile.
 */
const LINHAS: Marca[][] = [
  [
    {
      caixa: 24,
      chave: "typescript",
      nome: "TypeScript",
      path: siTypescript.path,
    },
    {
      caixa: 24,
      chave: "javascript",
      nome: "JavaScript",
      path: siJavascript.path,
    },
    { caixa: 24, chave: "node", nome: "Node.js", path: siNodedotjs.path },
    { caixa: 24, chave: "nestjs", nome: "NestJS", path: siNestjs.path },
    { caixa: 24, chave: "java", nome: "Java", path: siOpenjdk.path },
    { caixa: 24, chave: "python", nome: "Python", path: siPython.path },
    {
      caixa: 24,
      chave: "postgresql",
      nome: "PostgreSQL",
      path: siPostgresql.path,
    },
    { caixa: 24, chave: "supabase", nome: "Supabase", path: siSupabase.path },
    { caixa: 24, chave: "typeorm", nome: "TypeORM", path: siTypeorm.path },
    { caixa: 128, chave: "aws", nome: "AWS", path: devicon.aws },
    { caixa: 24, chave: "docker", nome: "Docker", path: siDocker.path },
    { caixa: 24, chave: "vercel", nome: "Vercel", path: siVercel.path },
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
    {
      caixa: 24,
      chave: "tailwind",
      nome: "Tailwind CSS",
      path: siTailwindcss.path,
    },
    { caixa: 24, chave: "shadcn", nome: "shadcn/ui", path: siShadcnui.path },
    { caixa: 24, chave: "three", nome: "Three.js", path: siThreedotjs.path },
    {
      caixa: 24,
      chave: "turborepo",
      nome: "Turborepo",
      path: siTurborepo.path,
    },
    { caixa: 24, chave: "git", nome: "Git", path: siGit.path },
  ],
]

function Faixa({ itens, reversa }: { itens: Marca[]; reversa: boolean }) {
  // A lista vai duas vezes e a animação anda metade: a segunda cópia cai no
  // lugar exato da primeira. Por isso o espaço é padding de cada item, não
  // gap (o gap deixaria meio espaço de diferença e a faixa daria um pulo).
  // Lista curta repete dentro da cópia: cada cópia precisa ser mais larga
  // que a tela (até ~2.600 px), senão sobra espaço vazio no fim da volta.
  const copia = itens.length < 14 ? [...itens, ...itens] : itens
  const dobrada = [...copia, ...copia]

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
