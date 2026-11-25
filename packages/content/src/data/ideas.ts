/**
 * Ideias: textos de opinião, um por post de opinião da série do LinkedIn.
 *
 * Os blocos são desenhados em ordem: `paragrafo` vira um parágrafo por item,
 * `lista` vira lista com marcador e `passos` vira lista numerada. Para uma
 * ideia nova, copie o bloco e troque os textos nos três idiomas.
 */
import { type Idea, ideaSchema, parseCollection } from "../schema"

const raw = [
  {
    slug: "programo-com-ia-as-regras",
    publishedAt: "2026-11-26",
    title: {
      pt: "Programo com IA: as regras",
      en: "I code with AI: the rules",
      es: "Programo con IA: las reglas",
    },
    summary: {
      pt: "A maioria dos meus commits deste ano tem um coautor que não é humano. O que impede um agente de fazer besteira num sistema que mexe com dinheiro de verdade?",
      en: "Most of my commits this year have a co-author who is not human. What stops an agent from breaking a system that moves real money?",
      es: "La mayoría de mis commits de este año tienen un coautor que no es humano. ¿Qué impide que un agente haga un desastre en un sistema que mueve dinero de verdad?",
    },
    blocks: [
      {
        kind: "paragrafo",
        text: {
          pt: [
            "A maioria dos meus commits deste ano tem um coautor. E ele não é humano: é o Claude, um agente de IA de programação. Não escondo isso.",
            "A pergunta que importa não é se a IA escreve código. É outra: o que impede um agente de fazer besteira num sistema que mexe com dinheiro de verdade? Na plataforma de sorteios com Pix e cartão que mantenho, a resposta virou um conjunto de regras.",
          ],
          en: [
            "Most of my commits this year have a co-author. And it is not human: it is Claude, an AI coding agent. I do not hide it.",
            "The question that matters is not whether AI writes code. It is a different one: what stops an agent from breaking a system that moves real money? On the raffle platform with Pix and card payments that I maintain, the answer became a set of rules.",
          ],
          es: [
            "La mayoría de mis commits de este año tienen un coautor. Y no es humano: es Claude, un agente de IA de programación. No lo escondo.",
            "La pregunta que importa no es si la IA escribe código. Es otra: ¿qué impide que un agente haga un desastre en un sistema que mueve dinero de verdad? En la plataforma de sorteos con Pix y tarjeta que mantengo, la respuesta se convirtió en un conjunto de reglas.",
          ],
        },
      },
      {
        kind: "lista",
        text: {
          pt: [
            "Staging primeiro. Toda migration passa pela staging antes de produção.",
            "Travas no código. Scripts avulsos abortam se o alvo for o banco de produção, a menos que alguém confirme por escrito. Venha o comando de mim ou do agente.",
            "Regras escritas e versionadas. Um manual de 816 linhas no repositório diz o que o agente pode e não pode fazer. Quando algo dá errado, a regra nova entra lá.",
            "Testes sem mock onde importa. 683 testes de integração rodam contra PostgreSQL real a cada pull request.",
            "Deploy ensaiado. No maior deles, apliquei 46 migrations numa cópia do schema de produção antes de tocar no banco de verdade.",
            "Volta pronta. Quando algo escapou, produção voltou à versão estável no mesmo dia.",
          ],
          en: [
            "Staging first. Every migration goes through staging before production.",
            "Locks in the code. One-off scripts abort if the target is the production database, unless someone confirms it in writing. Whether the command comes from me or from the agent.",
            "Written, versioned rules. An 816-line manual in the repository says what the agent can and cannot do. When something goes wrong, the new rule goes in there.",
            "No mocks where it matters. 683 integration tests run against real PostgreSQL on every pull request.",
            "Rehearsed deploys. For the biggest one, I applied 46 migrations to a copy of the production schema before touching the real database.",
            "A way back, ready. When something slipped through, production went back to the stable version the same day.",
          ],
          es: [
            "Staging primero. Toda migration pasa por staging antes de producción.",
            "Candados en el código. Los scripts sueltos abortan si el destino es la base de producción, salvo que alguien lo confirme por escrito. Venga el comando de mí o del agente.",
            "Reglas escritas y versionadas. Un manual de 816 líneas en el repositorio dice qué puede y qué no puede hacer el agente. Cuando algo sale mal, la regla nueva entra ahí.",
            "Pruebas sin mock donde importa. 683 pruebas de integración corren contra PostgreSQL real en cada pull request.",
            "Deploy ensayado. En el más grande, apliqué 46 migrations en una copia del schema de producción antes de tocar la base real.",
            "Vuelta lista. Cuando algo se escapó, producción volvió a la versión estable el mismo día.",
          ],
        },
      },
      {
        kind: "paragrafo",
        text: {
          pt: [
            "E nada disso é garantia. A própria trava de produção tinha um bug: se recebesse o argumento errado, concluía que não era produção e liberava. Aconteceu num script só de leitura. Corrigi antes que acontecesse num de escrita.",
            'Um deploy subiu limpo, passou no typecheck e no lint, e a imagem não tinha o Chromium de que o código precisava. O import existia. A configuração, não. O erro só aparecia no log. Por isso eu não leio "passou" como "funciona".',
            "Na prática, o agente escreve boa parte do código. Eu decido o que entra, reviso, ensaio e assumo o deploy. Para quem está começando a usar agentes em código de produção:",
          ],
          en: [
            "And none of this is a guarantee. The production lock itself had a bug: given the wrong argument, it concluded it was not production and let the script run. It happened in a read-only script. I fixed it before it happened in one that writes.",
            'A deploy went out clean, passed typecheck and lint, and the image did not have the Chromium the code needed. The import existed. The configuration did not. The error only showed up in the log. That is why I do not read "passed" as "works".',
            "In practice, the agent writes a good part of the code. I decide what goes in, review it, rehearse it and own the deploy. For anyone starting to use agents on production code:",
          ],
          es: [
            "Y nada de esto es garantía. El propio candado de producción tenía un bug: si recibía el argumento equivocado, concluía que no era producción y dejaba pasar. Pasó en un script de solo lectura. Lo corregí antes de que pasara en uno de escritura.",
            'Un deploy salió limpio, pasó el typecheck y el lint, y la imagen no tenía el Chromium que el código necesitaba. El import existía. La configuración, no. El error solo aparecía en el log. Por eso no leo "pasó" como "funciona".',
            "En la práctica, el agente escribe buena parte del código. Yo decido qué entra, reviso, ensayo y me hago cargo del deploy. Para quien está empezando a usar agentes en código de producción:",
          ],
        },
      },
      {
        kind: "passos",
        text: {
          pt: [
            "Comece pelas travas, não pelo prompt. O que não pode acontecer precisa ser impossível, não só proibido no texto.",
            "Escreva as regras num arquivo dentro do repositório e atualize a cada erro.",
            "Teste a trava também. Ela é código e pode falhar.",
            "Confira o que foi para produção, não só o que passou no CI.",
          ],
          en: [
            "Start with the locks, not the prompt. What must not happen has to be impossible, not just forbidden in writing.",
            "Write the rules in a file inside the repository and update it after every mistake.",
            "Test the lock too. It is code and it can fail.",
            "Check what actually reached production, not just what passed CI.",
          ],
          es: [
            "Empieza por los candados, no por el prompt. Lo que no puede pasar tiene que ser imposible, no solo prohibido en el texto.",
            "Escribe las reglas en un archivo dentro del repositorio y actualízalo con cada error.",
            "Prueba el candado también. Es código y puede fallar.",
            "Revisa lo que llegó a producción, no solo lo que pasó en el CI.",
          ],
        },
      },
    ],
  },
]

export const ideas: Idea[] = parseCollection(ideaSchema, {
  items: raw,
  source: "src/data/ideas.ts",
}).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

export function ideaBySlug(slug: string): Idea | undefined {
  return ideas.find((item) => item.slug === slug)
}
