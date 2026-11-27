import { milestoneSchema, parseCollection } from "../schema"

/**
 * Trajetória linear do início do site, em ordem. Enxuta de propósito (pedido
 * do Rodrigo, 27/11: 12 marcos ficou grande demais): um marco por fase, com os
 * projetos da fase no texto.
 *
 * A ordem saiu do histórico git (27/11/2026), que desempata os dois
 * currículos: o e-mail pessoal, do freela, vai de out/2025 a jun/2026; o
 * primeiro commit com o e-mail da DBC é de 20/07/2026, no Esplêndido. Ou seja,
 * a DBC veio depois dos freelas, como o Rodrigo confirmou.
 *
 * CONFIRMAR com ele: se a DB Store (mai/2026) foi freela ou já pela DBC (o
 * currículo atualizado a põe na DBC; o git, no e-mail pessoal até jun/2026).
 * Por isso o marco dela não diz por onde foi.
 */
const raw = [
  {
    id: "atleta",
    date: "2019-01",
    kind: "athletics",
    title: {
      pt: "Atleta profissional",
      en: "Professional athlete",
      es: "Atleta profesional",
    },
    text: {
      pt: "Seis anos no futebol e no Counter-Strike, até 2025. Foi competindo que a curiosidade virou para o que roda por baixo do jogo.",
      en: "Six years in football and Counter-Strike, until 2025. Competing is what turned my curiosity toward what runs underneath the game.",
      es: "Seis años en el fútbol y en Counter-Strike, hasta 2025. Compitiendo, la curiosidad pasó a lo que corre por debajo del juego.",
    },
  },
  {
    id: "ads",
    date: "2023-02",
    kind: "education",
    title: {
      pt: "Análise e Desenvolvimento de Sistemas",
      en: "Systems Analysis and Development",
      es: "Análisis y Desarrollo de Sistemas",
    },
    text: {
      pt: "Graduação na São Judas, concluída em 2025: Java, Python, JavaScript, bancos de dados e APIs REST.",
      en: "Degree at São Judas, completed in 2025: Java, Python, JavaScript, databases and REST APIs.",
      es: "Carrera en São Judas, concluida en 2025: Java, Python, JavaScript, bases de datos y APIs REST.",
    },
  },
  {
    id: "freela",
    date: "2025-10",
    kind: "work",
    title: {
      pt: "Freela para Portugal e Brasil",
      en: "Freelancing for Portugal and Brazil",
      es: "Freelance para Portugal y Brasil",
    },
    text: {
      pt: "CS2 Cortex, DB Connect e Memoreba: bases grandes de outras equipes, sempre com revisão de código.",
      en: "CS2 Cortex, DB Connect and Memoreba: large codebases from other teams, always under code review.",
      es: "CS2 Cortex, DB Connect y Memoreba: bases grandes de otros equipos, siempre con revisión de código.",
    },
  },
  {
    id: "mba-usp",
    date: "2026-02",
    kind: "education",
    title: {
      pt: "MBA em Engenharia de Software, USP",
      en: "MBA in Software Engineering, USP",
      es: "MBA en Ingeniería de Software, USP",
    },
    text: {
      pt: "Em andamento, até dez/2027: arquitetura, cloud, segurança e DevOps.",
      en: "In progress, until Dec 2027: architecture, cloud, security and DevOps.",
      es: "En curso, hasta dic/2027: arquitectura, cloud, seguridad y DevOps.",
    },
  },
  {
    id: "db-store",
    date: "2026-05",
    kind: "project",
    title: {
      pt: "DB Store",
      en: "DB Store",
      es: "DB Store",
    },
    text: {
      pt: "Plataforma com Pix de ponta a ponta, no ar com usuários reais; principal autor do código.",
      en: "A platform with end-to-end Pix payments, live with real users; main author of the code.",
      es: "Plataforma con Pix de punta a punta, en vivo con usuarios reales; autor principal del código.",
    },
  },
  {
    id: "dbc-software",
    date: "2026-07",
    kind: "work",
    title: {
      pt: "Freela pela DBC Software",
      en: "Freelancing with DBC Software",
      es: "Freelance con DBC Software",
    },
    text: {
      pt: "Remoto, sem vínculo contratual. Esplêndido (Portugal e Irlanda, apps nas lojas), Daisy e ELOS.",
      en: "Remote, with no employment contract. Esplêndido (Portugal and Ireland, apps in the stores), Daisy and ELOS.",
      es: "Remoto, sin vínculo contractual. Esplêndido (Portugal e Irlanda, apps en las tiendas), Daisy y ELOS.",
    },
  },
]

/** Em ordem de data; no mesmo mês, vale a ordem do arquivo. */
export const milestones = parseCollection(milestoneSchema, {
  items: raw,
  source: "src/data/milestones.ts",
}).sort((a, b) => a.date.localeCompare(b.date))
