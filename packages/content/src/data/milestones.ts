import { milestoneSchema, parseCollection } from "../schema"

/**
 * Trajetória linear do início do site, um marco por linha, em ordem.
 *
 * A ordem saiu do histórico git (27/11/2026), que desempata os dois
 * currículos: o e-mail pessoal, do freela, vai de out/2025 a jun/2026; o
 * primeiro commit com o e-mail da DBC é de 20/07/2026, no Esplêndido. Ou seja,
 * a DBC veio depois dos freelas, como o Rodrigo confirmou.
 *
 * CONFIRMAR com ele: se a DB Store (mai/2026) foi freela ou já pela DBC (o
 * currículo atualizado a põe na DBC; o git, no e-mail pessoal até jun/2026).
 * Por isso o marco dela não diz por onde foi.
 *
 * Sem o nome da ferramenta de prototipagem: o dono não autorizou.
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
      pt: "Seis anos no futebol e no Counter-Strike. Foi competindo que a curiosidade virou para o que roda por baixo do jogo.",
      en: "Six years in football and Counter-Strike. Competing is what turned my curiosity toward what runs underneath the game.",
      es: "Seis años en el fútbol y en Counter-Strike. Compitiendo, la curiosidad pasó a lo que corre por debajo del juego.",
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
      pt: "Começo da graduação na São Judas: Java, Python, JavaScript, bancos de dados e APIs REST.",
      en: "Start of my degree at São Judas: Java, Python, JavaScript, databases and REST APIs.",
      es: "Inicio de la carrera en São Judas: Java, Python, JavaScript, bases de datos y APIs REST.",
    },
  },
  {
    id: "freela-cs2-cortex",
    date: "2025-10",
    kind: "work",
    title: {
      pt: "Primeiro cliente, como freela",
      en: "First client, as a freelancer",
      es: "Primer cliente, como freelance",
    },
    text: {
      pt: "CS2 Cortex, de Portugal: times, torneios e onboarding numa base grande de outra equipe, sempre com revisão de código.",
      en: "CS2 Cortex, from Portugal: teams, tournaments and onboarding in another team’s large codebase, always under code review.",
      es: "CS2 Cortex, de Portugal: equipos, torneos y onboarding en una base grande de otro equipo, siempre con revisión de código.",
    },
  },
  {
    id: "freela-db-connect",
    date: "2025-11",
    kind: "project",
    title: {
      pt: "DB Connect, Portugal",
      en: "DB Connect, Portugal",
      es: "DB Connect, Portugal",
    },
    text: {
      pt: "Freela. App mobile do zero e painel web para a construção civil, com chat em tempo real; principal contribuidor.",
      en: "Freelance. A mobile app from scratch and a web panel for construction, with real-time chat; lead contributor.",
      es: "Freelance. App móvil desde cero y panel web para la construcción, con chat en tiempo real; principal contribuidor.",
    },
  },
  {
    id: "freela-memoreba",
    date: "2025-12",
    kind: "project",
    title: {
      pt: "Memoreba, Brasil",
      en: "Memoreba, Brazil",
      es: "Memoreba, Brasil",
    },
    text: {
      pt: "Freela. Painel administrativo, sessões com revogação e uma auditoria com 66 bugs corrigidos.",
      en: "Freelance. Admin panel, revocable sessions and an audit with 66 bugs fixed.",
      es: "Freelance. Panel administrativo, sesiones con revocación y una auditoría con 66 bugs corregidos.",
    },
  },
  {
    id: "ads-formado",
    date: "2025-12",
    kind: "education",
    title: {
      pt: "Formado em ADS",
      en: "Degree completed",
      es: "Carrera concluida",
    },
    text: {
      pt: "Graduação concluída na São Judas, junto com o fim da carreira de atleta.",
      en: "Degree completed at São Judas, as my athletic career came to an end.",
      es: "Carrera concluida en São Judas, junto con el fin de la carrera de atleta.",
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
    id: "freela-canvas",
    date: "2026-03",
    kind: "project",
    title: {
      pt: "Ferramenta de prototipagem com IA",
      en: "AI prototyping tool",
      es: "Herramienta de prototipado con IA",
    },
    text: {
      pt: "Freela. Engine de canvas com pranchetas, guias de alinhamento, atalhos e gestos.",
      en: "Freelance. A canvas engine with artboards, alignment guides, shortcuts and gestures.",
      es: "Freelance. Motor de canvas con mesas de trabajo, guías de alineación, atajos y gestos.",
    },
  },
  {
    id: "db-store",
    date: "2026-05",
    kind: "project",
    title: {
      pt: "DB Store, Brasil",
      en: "DB Store, Brazil",
      es: "DB Store, Brasil",
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
      pt: "Entrada na DBC Software",
      en: "Joined DBC Software",
      es: "Entrada en DBC Software",
    },
    text: {
      pt: "PJ, remoto. Herdei o Esplêndido, marketplace de limpezas em Portugal e na Irlanda: cinco repositórios de outra equipe.",
      en: "Contractor, remote. I inherited Esplêndido, a cleaning marketplace in Portugal and Ireland: five repositories from another team.",
      es: "PJ, remoto. Heredé Esplêndido, marketplace de limpieza en Portugal e Irlanda: cinco repositorios de otro equipo.",
    },
  },
  {
    id: "dbc-daisy-elos",
    date: "2026-10",
    kind: "project",
    title: {
      pt: "Daisy e ELOS, Portugal",
      en: "Daisy and ELOS, Portugal",
      es: "Daisy y ELOS, Portugal",
    },
    text: {
      pt: "Pela DBC: um assistente de IA para a construção civil e o sistema de uma imobiliária.",
      en: "Through DBC: an AI assistant for construction and a real estate agency’s system.",
      es: "Por DBC: un asistente de IA para la construcción y el sistema de una inmobiliaria.",
    },
  },
  {
    id: "esplendido-lojas",
    date: "2026-11",
    kind: "project",
    title: {
      pt: "Apps nas lojas",
      en: "Apps in the stores",
      es: "Apps en las tiendas",
    },
    text: {
      pt: "Esplêndido publicado na App Store e na Google Play, depois das revisões da Apple e do Google.",
      en: "Esplêndido published on the App Store and Google Play, after Apple’s and Google’s reviews.",
      es: "Esplêndido publicado en la App Store y en Google Play, tras las revisiones de Apple y Google.",
    },
  },
]

/** Em ordem de data; no mesmo mês, vale a ordem do arquivo. */
export const milestones = parseCollection(milestoneSchema, {
  items: raw,
  source: "src/data/milestones.ts",
}).sort((a, b) => a.date.localeCompare(b.date))
