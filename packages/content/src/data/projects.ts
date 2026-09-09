import { parseCollection, projectSchema, type Project } from '../schema';

/**
 * Projetos.
 *
 * Os três primeiros são produtos em produção entregues pela DBC Software, e os
 * três seguintes vieram por freelance. Todos têm código fechado, então o card
 * marca isso e leva ao produto no ar quando existe, em vez de exibir um botão
 * de repositório que ninguém consegue abrir.
 *
 * Os números em `metrics` foram contados no próprio repositório com git e grep,
 * não estimados. Ao atualizar um projeto, recontar é melhor que arredondar.
 *
 * `featured: true` promove o projeto para a grade principal da home.
 */
const raw = [
  {
    slug: 'esplendido',
    name: 'Esplêndido',
    year: '2026',
    start: '2026-07',
    end: null,
    client: 'DBC Software',
    engagement: 'dbc',
    status: 'live',
    codeVisibility: 'private',
    featured: true,
    accent: 'signal',
    role: {
      pt: 'Full-stack e infraestrutura',
      en: 'Full-stack and infrastructure',
      es: 'Full-stack e infraestructura',
    },
    summary: {
      pt: 'Marketplace de serviços de limpeza operando em Portugal e Irlanda, com backend NestJS, dois apps Flutter e infraestrutura própria na AWS.',
      en: 'A cleaning services marketplace operating in Portugal and Ireland, with a NestJS backend, two Flutter apps and its own AWS infrastructure.',
      es: 'Marketplace de servicios de limpieza operando en Portugal e Irlanda, con backend NestJS, dos apps Flutter e infraestructura propia en AWS.',
    },
    description: {
      pt: [
        'Assumi com outros dois desenvolvedores a manutenção de um sistema já em produção, distribuído em cinco repositórios: o backend NestJS, dois aplicativos Flutter para cliente e colaborador, o backoffice e a landing em Next.js.',
        'Restabeleci a produção na AWS depois de uma sequência de deploys em rollback. Eram duas causas: a senha do banco estava fora de sincronia com o cofre de segredos, e o schema tinha ficado dezoito migrations para trás. Rotacionei os segredos, apliquei as migrations e troquei chaves de acesso expostas por uma role restrita ao armazenamento. Os dois deploys seguintes concluíram.',
        'Também corrigi uma falha de fuso que mantinha pedidos invisíveis por uma hora, fixando a sessão do banco no fuso de Dublin. É o tipo de bug que não aparece em teste e só se manifesta com usuário real, no horário errado.',
      ],
      en: [
        'Together with two other developers I took over maintenance of a system already in production, spread across five repositories: the NestJS backend, two Flutter apps for customer and worker, the back office and the landing page in Next.js.',
        'I brought production on AWS back up after a run of rolled-back deploys. There were two causes: the database password was out of sync with the secrets vault, and the schema had fallen eighteen migrations behind. I rotated the secrets, applied the migrations and replaced exposed access keys with a role restricted to storage. The next two deploys went through.',
        'I also fixed a timezone bug that kept orders invisible for an hour, by pinning the database session to the Dublin timezone. That is the kind of bug tests never catch and only shows up with a real user, at the wrong time of day.',
      ],
      es: [
        'Asumí junto a otros dos desarrolladores el mantenimiento de un sistema ya en producción, repartido en cinco repositorios: el backend NestJS, dos aplicaciones Flutter para cliente y colaborador, el backoffice y la landing en Next.js.',
        'Restablecí la producción en AWS tras una serie de deploys en rollback. Eran dos causas: la contraseña de la base estaba desincronizada del gestor de secretos, y el esquema había quedado dieciocho migrations atrás. Roté los secretos, apliqué las migrations y cambié claves de acceso expuestas por un rol restringido al almacenamiento. Los dos deploys siguientes concluyeron.',
        'También corregí un fallo de huso horario que mantenía pedidos invisibles durante una hora, fijando la sesión de la base en el huso de Dublín. Es el tipo de bug que no aparece en pruebas y solo se manifiesta con usuario real, a la hora equivocada.',
      ],
    },
    highlights: {
      pt: [
        'Infraestrutura AWS em operação: App Runner, RDS PostgreSQL, S3 com URLs assinadas, Secrets Manager, ECR, IAM e VPC',
        'API REST de 42 controllers com praticamente todo endpoint documentado em Swagger',
        'Controle de acesso por papel aplicado em quase duzentos pontos da API',
        'Pagamento de marketplace com Stripe Connect, cobrindo dez eventos de webhook, do pagamento ao repasse',
      ],
      en: [
        'Live AWS infrastructure: App Runner, RDS PostgreSQL, S3 with signed URLs, Secrets Manager, ECR, IAM and VPC',
        'A 42-controller REST API with virtually every endpoint documented in Swagger',
        'Role-based access control applied at nearly two hundred points across the API',
        'Marketplace payments with Stripe Connect, covering ten webhook events from charge to payout',
      ],
      es: [
        'Infraestructura AWS en operación: App Runner, RDS PostgreSQL, S3 con URLs firmadas, Secrets Manager, ECR, IAM y VPC',
        'API REST de 42 controllers con prácticamente todo endpoint documentado en Swagger',
        'Control de acceso por rol aplicado en casi doscientos puntos de la API',
        'Pago de marketplace con Stripe Connect, cubriendo diez eventos de webhook, del cobro al pago',
      ],
    },
    metrics: [
      {
        value: '286',
        label: { pt: 'Endpoints REST', en: 'REST endpoints', es: 'Endpoints REST' },
      },
      {
        value: '590',
        label: { pt: 'Casos de teste', en: 'Test cases', es: 'Casos de prueba' },
      },
      {
        value: '50',
        label: { pt: 'Entidades de domínio', en: 'Domain entities', es: 'Entidades de dominio' },
      },
      {
        value: '5',
        label: { pt: 'Repositórios', en: 'Repositories', es: 'Repositorios' },
      },
    ],
    stack: [
      'TypeScript',
      'NestJS',
      'TypeORM',
      'PostgreSQL',
      'Next.js',
      'Flutter',
      'AWS',
      'Docker',
      'Stripe Connect',
    ],
    links: {},
  },

  {
    slug: 'db-store',
    name: 'DB Store',
    year: '2026',
    start: '2026-05',
    end: null,
    client: 'DBC Software',
    engagement: 'dbc',
    status: 'live',
    codeVisibility: 'private',
    featured: true,
    accent: 'plasma',
    role: {
      pt: 'Full-stack, pagamentos e segurança',
      en: 'Full-stack, payments and security',
      es: 'Full-stack, pagos y seguridad',
    },
    summary: {
      pt: 'Plataforma transacional de sorteios de skins, no ar com usuários reais, construída sobre um modelo de permissões dentro do próprio banco.',
      en: 'A transactional raffle platform for game skins, live with real users, built on a permission model that lives inside the database itself.',
      es: 'Plataforma transaccional de sorteos de skins, en vivo con usuarios reales, construida sobre un modelo de permisos dentro de la propia base de datos.',
    },
    description: {
      pt: [
        'Uma plataforma onde entra dinheiro de verdade. Isso muda a régua: cada confirmação de pagamento precisa chegar exatamente uma vez, nem zero nem duas, mesmo quando o gateway reenvia o mesmo evento.',
        'Integrei o pagamento por Pix de ponta a ponta. São três endpoints de webhook que tratam reentrega como situação normal, não como exceção: o processamento é idempotente e uma falha parcial devolve erro de propósito, para o gateway tentar de novo em vez de dar o pagamento por perdido.',
        'A autorização mora no banco, não só na aplicação. São dezenas de regras de acesso por linha cobrindo as tabelas sensíveis, e a lógica de negócio roda em funções do PostgreSQL chamadas por RPC. Encontrei e fechei uma permissão que expunha o ajuste de saldo administrativo, com auditoria do extrato confirmando que nunca tinha sido usada.',
      ],
      en: [
        'A platform where real money changes hands. That raises the bar: every payment confirmation has to arrive exactly once, not zero times and not twice, even when the gateway resends the same event.',
        'I integrated Pix payments end to end. Three webhook endpoints treat redelivery as normal rather than exceptional: processing is idempotent, and a partial failure returns an error on purpose so the gateway retries instead of writing the payment off.',
        'Authorization lives in the database, not only in the application. Dozens of row-level access rules cover the sensitive tables, and business logic runs in PostgreSQL functions called over RPC. I found and closed a permission that exposed administrative balance adjustment, with a ledger audit confirming it had never been used.',
      ],
      es: [
        'Una plataforma donde entra dinero real. Eso sube el listón: cada confirmación de pago tiene que llegar exactamente una vez, ni cero ni dos, incluso cuando la pasarela reenvía el mismo evento.',
        'Integré el pago por Pix de punta a punta. Son tres endpoints de webhook que tratan el reenvío como situación normal, no como excepción: el procesamiento es idempotente y un fallo parcial devuelve error a propósito, para que la pasarela reintente en vez de dar el pago por perdido.',
        'La autorización vive en la base de datos, no solo en la aplicación. Decenas de reglas de acceso por fila cubren las tablas sensibles, y la lógica de negocio corre en funciones de PostgreSQL llamadas por RPC. Encontré y cerré un permiso que exponía el ajuste de saldo administrativo, con auditoría del extracto confirmando que nunca se había usado.',
      ],
    },
    highlights: {
      pt: [
        'Pix pelo gateway EFI com três webhooks idempotentes, conciliação e reprocessamento automático',
        'Setenta e três regras de acesso por linha cobrindo sessenta e quatro tabelas',
        'Integração contínua que roda a suíte contra um PostgreSQL de verdade a cada pull request',
        'Falha de permissão no ajuste de saldo encontrada, corrigida e auditada',
      ],
      en: [
        'Pix via the EFI gateway with three idempotent webhooks, reconciliation and automatic reprocessing',
        'Seventy-three row-level access rules covering sixty-four tables',
        'Continuous integration that runs the suite against a real PostgreSQL on every pull request',
        'A permission flaw in balance adjustment found, fixed and audited',
      ],
      es: [
        'Pix por la pasarela EFI con tres webhooks idempotentes, conciliación y reprocesamiento automático',
        'Setenta y tres reglas de acceso por fila cubriendo sesenta y cuatro tablas',
        'Integración continua que corre la suite contra un PostgreSQL real en cada pull request',
        'Fallo de permiso en el ajuste de saldo encontrado, corregido y auditado',
      ],
    },
    metrics: [
      {
        value: '313',
        label: { pt: 'Migrations de banco', en: 'Database migrations', es: 'Migrations de base' },
      },
      {
        value: '491',
        label: { pt: 'Casos de teste', en: 'Test cases', es: 'Casos de prueba' },
      },
      {
        value: '145',
        label: { pt: 'Rotas de API', en: 'API routes', es: 'Rutas de API' },
      },
      {
        value: '110',
        label: { pt: 'Páginas', en: 'Pages', es: 'Páginas' },
      },
    ],
    stack: [
      'TypeScript',
      'Next.js',
      'React',
      'Supabase',
      'PostgreSQL',
      'Trigger.dev',
      'Pix (EFI)',
      'Vitest',
      'Turborepo',
    ],
    links: { demo: 'https://www.dbstore.com.br' },
  },

  {
    slug: 'db-connect',
    name: 'DB Connect',
    year: '2026',
    start: '2025-11',
    end: '2026-07',
    client: 'DBC Software',
    engagement: 'dbc',
    status: 'live',
    codeVisibility: 'private',
    featured: true,
    accent: 'ember',
    role: {
      pt: 'Principal contribuidor, mobile e web',
      en: 'Lead contributor, mobile and web',
      es: 'Principal contribuidor, mobile y web',
    },
    summary: {
      pt: 'Marketplace que conecta empreiteiros e empresas de construção civil, com app mobile e painel web compartilhando o mesmo monorepo.',
      en: 'A marketplace connecting contractors and construction companies, with a mobile app and a web panel sharing the same monorepo.',
      es: 'Marketplace que conecta contratistas y empresas de construcción, con app móvil y panel web compartiendo el mismo monorepo.',
    },
    description: {
      pt: [
        'O produto é um portfólio em formato de aplicativo: o empreiteiro publica os trabalhos que já fez, e a empresa busca por categoria, localização e modalidade de contratação.',
        'Construí o chat em tempo real com notificação dentro do app, o sistema de suporte e a verificação de perfis que virou o Selo DB, o sinal de confiança que a empresa procura antes de contratar alguém que nunca viu.',
        'Cuidei bastante dos fluxos de autenticação, que é onde marketplace perde usuário calado: reenvio de confirmação de e-mail, detecção de perda de conexão e recuperação de sessão. Um cadastro que falha em silêncio custa o usuário inteiro.',
      ],
      en: [
        'The product is a portfolio in app form: contractors publish the jobs they have done, and companies search by category, location and hiring model.',
        'I built the real-time chat with in-app notifications, the support system, and the profile verification that became the DB Seal, the trust signal a company looks for before hiring someone it has never met.',
        'I spent real effort on the authentication flows, which is where marketplaces lose users quietly: resending email confirmation, detecting dropped connections and restoring sessions. A signup that fails silently costs you the whole user.',
      ],
      es: [
        'El producto es un portafolio en formato de aplicación: el contratista publica los trabajos que ya hizo, y la empresa busca por categoría, ubicación y modalidad de contratación.',
        'Construí el chat en tiempo real con notificación dentro de la app, el sistema de soporte y la verificación de perfiles que se convirtió en el Sello DB, la señal de confianza que la empresa busca antes de contratar a alguien que nunca vio.',
        'Cuidé mucho los flujos de autenticación, que es donde un marketplace pierde usuarios en silencio: reenvío de confirmación de correo, detección de pérdida de conexión y recuperación de sesión. Un registro que falla en silencio cuesta el usuario entero.',
      ],
    },
    highlights: {
      pt: [
        'Chat em tempo real com notificação dentro do aplicativo',
        'Verificação de perfis publicada como Selo DB',
        'App Expo e painel Next.js no mesmo monorepo, com tipos compartilhados',
        'Fluxos de autenticação resilientes a queda de conexão e a e-mail não confirmado',
      ],
      en: [
        'Real-time chat with in-app notifications',
        'Profile verification shipped as the DB Seal',
        'An Expo app and a Next.js panel in one monorepo, with shared types',
        'Authentication flows resilient to dropped connections and unconfirmed email',
      ],
      es: [
        'Chat en tiempo real con notificación dentro de la aplicación',
        'Verificación de perfiles publicada como Sello DB',
        'App Expo y panel Next.js en el mismo monorepo, con tipos compartidos',
        'Flujos de autenticación resistentes a caída de conexión y a correo no confirmado',
      ],
    },
    metrics: [
      {
        value: '4',
        label: {
          pt: 'Aplicações no monorepo',
          en: 'Apps in the monorepo',
          es: 'Apps en el monorepo',
        },
      },
      {
        value: '24',
        label: { pt: 'Telas', en: 'Screens', es: 'Pantallas' },
      },
    ],
    stack: [
      'TypeScript',
      'React Native',
      'Expo',
      'Next.js',
      'Supabase',
      'Gluestack UI',
      'Turborepo',
    ],
    links: {},
  },

  {
    slug: 'memoreba',
    name: 'Memoreba',
    year: '2026',
    start: '2025-12',
    end: '2026-05',
    engagement: 'freelance',
    status: 'live',
    codeVisibility: 'private',
    featured: false,
    accent: 'cyan',
    role: {
      pt: 'Full-stack, painel e segurança de conta',
      en: 'Full-stack, admin panel and account security',
      es: 'Full-stack, panel y seguridad de cuenta',
    },
    summary: {
      pt: 'Plataforma de aprendizado adaptativo para concurseiros, com repetição espaçada e geração de conteúdo por IA sobre Cloudflare Workers.',
      en: 'An adaptive learning platform for public-exam candidates, with spaced repetition and AI-generated content running on Cloudflare Workers.',
      es: 'Plataforma de aprendizaje adaptativo para opositores, con repetición espaciada y generación de contenido por IA sobre Cloudflare Workers.',
    },
    description: {
      pt: [
        'A plataforma usa repetição espaçada para decidir quando cada conteúdo volta a aparecer, e gera exercícios de memorização a partir do material do edital.',
        'Trabalhei no painel administrativo, com foco na parte de conta e segurança: listagem de sessões conectadas com revogação e endurecimento do fluxo de troca de senha. Ver onde sua conta está aberta e poder derrubar uma sessão é o mínimo que uma plataforma paga deve oferecer.',
        'Também atuei nos pipelines de conteúdo gerado por IA, em acessibilidade e na tradução para português do Brasil, sempre em fluxo de pull request com revisão de código.',
      ],
      en: [
        'The platform uses spaced repetition to decide when each piece of content comes back, and generates memorisation exercises from the exam syllabus.',
        'I worked on the admin panel, focused on account and security: listing connected sessions with revocation, and hardening the password change flow. Seeing where your account is open and being able to kill a session is the minimum a paid platform owes its users.',
        'I also worked on the AI content pipelines, on accessibility, and on the Brazilian Portuguese translation, always through pull requests with code review.',
      ],
      es: [
        'La plataforma usa repetición espaciada para decidir cuándo cada contenido vuelve a aparecer, y genera ejercicios de memorización a partir del material del temario.',
        'Trabajé en el panel administrativo, centrado en cuenta y seguridad: listado de sesiones conectadas con revocación y endurecimiento del flujo de cambio de contraseña. Ver dónde está abierta tu cuenta y poder cerrar una sesión es lo mínimo que una plataforma de pago debe ofrecer.',
        'También trabajé en los pipelines de contenido generado por IA, en accesibilidad y en la traducción al portugués de Brasil, siempre en flujo de pull request con revisión de código.',
      ],
    },
    highlights: {
      pt: [
        'Sessões conectadas com revogação e troca de senha endurecida',
        'Pipelines de conteúdo gerado por IA sobre Cloudflare Workers',
        'Acessibilidade e internacionalização em português do Brasil',
        'Mais de cem entregas em base de cinco mil e quinhentos arquivos, com revisão de código',
      ],
      en: [
        'Connected sessions with revocation, and a hardened password change flow',
        'AI content pipelines running on Cloudflare Workers',
        'Accessibility and Brazilian Portuguese internationalisation',
        'Over a hundred deliveries in a 5,560-file codebase, under code review',
      ],
      es: [
        'Sesiones conectadas con revocación y cambio de contraseña endurecido',
        'Pipelines de contenido generado por IA sobre Cloudflare Workers',
        'Accesibilidad e internacionalización al portugués de Brasil',
        'Más de cien entregas en una base de 5.560 archivos, con revisión de código',
      ],
    },
    metrics: [
      {
        value: '5.560',
        label: { pt: 'Arquivos na base', en: 'Files in the codebase', es: 'Archivos en la base' },
      },
      {
        value: '466',
        label: { pt: 'Migrations de banco', en: 'Database migrations', es: 'Migrations de base' },
      },
    ],
    stack: [
      'TypeScript',
      'Next.js',
      'Cloudflare Workers',
      'Supabase',
      'PostgreSQL',
      'Trigger.dev',
      'Vitest',
    ],
    links: {},
  },

  {
    slug: 'cs2-cortex',
    name: 'CS2 Cortex',
    year: '2026',
    start: '2025-10',
    end: '2026-03',
    engagement: 'freelance',
    status: 'live',
    codeVisibility: 'private',
    featured: false,
    accent: 'plasma',
    role: {
      pt: 'Frontend e produto',
      en: 'Frontend and product',
      es: 'Frontend y producto',
    },
    summary: {
      pt: 'Plataforma de inteligência tática com IA para Counter-Strike 2, que transforma gravações de partida em análise de decisão.',
      en: 'An AI tactical intelligence platform for Counter-Strike 2, turning match recordings into decision analysis.',
      es: 'Plataforma de inteligencia táctica con IA para Counter-Strike 2, que convierte grabaciones de partida en análisis de decisión.',
    },
    description: {
      pt: [
        'O produto lê a gravação bruta de uma partida e devolve replay quadro a quadro, probabilidade de vitória e leitura das decisões tomadas. É meu primeiro cliente internacional, em Portugal.',
        'Construí os módulos de calendário e gestão de equipe, o cadastro de times e torneios e o fluxo de entrada de novos usuários, em Next.js com TypeScript em modo estrito.',
        'Foi também o primeiro projeto em que trabalhei sob integração contínua alheia: cada pull request passava por lint, build e uma auditoria automática de código morto e duplicação antes de poder ser aprovado.',
      ],
      en: [
        'The product reads a raw match recording and returns a frame-by-frame replay, win probability and a reading of the decisions taken. It was my first international client, in Portugal.',
        'I built the calendar and team management modules, the teams and tournaments records, and the onboarding flow, in Next.js with TypeScript in strict mode.',
        'It was also the first project where I worked under someone else’s continuous integration: every pull request went through lint, build and an automated dead-code and duplication audit before it could be approved.',
      ],
      es: [
        'El producto lee la grabación bruta de una partida y devuelve replay cuadro a cuadro, probabilidad de victoria y lectura de las decisiones tomadas. Fue mi primer cliente internacional, en Portugal.',
        'Construí los módulos de calendario y gestión de equipo, el registro de equipos y torneos y el flujo de entrada de nuevos usuarios, en Next.js con TypeScript en modo estricto.',
        'Fue también el primer proyecto en el que trabajé bajo integración continua ajena: cada pull request pasaba por lint, build y una auditoría automática de código muerto y duplicación antes de poder aprobarse.',
      ],
    },
    highlights: {
      pt: [
        'Módulos de calendário e gestão de equipe',
        'Cadastro de times e torneios e fluxo de entrada de novos usuários',
        'TypeScript em modo estrito, sob auditoria automática de código a cada pull request',
        'Primeiro cliente internacional, com rotina de daily e revisão de código',
      ],
      en: [
        'Calendar and team management modules',
        'Teams and tournaments records, and the new-user onboarding flow',
        'TypeScript in strict mode, under automated code audit on every pull request',
        'First international client, with daily stand-ups and code review',
      ],
      es: [
        'Módulos de calendario y gestión de equipo',
        'Registro de equipos y torneos y flujo de entrada de nuevos usuarios',
        'TypeScript en modo estricto, bajo auditoría automática de código en cada pull request',
        'Primer cliente internacional, con rutina de daily y revisión de código',
      ],
    },
    metrics: [
      {
        value: '2.848',
        label: { pt: 'Arquivos na base', en: 'Files in the codebase', es: 'Archivos en la base' },
      },
      {
        value: '7',
        label: {
          pt: 'Aplicações no monorepo',
          en: 'Apps in the monorepo',
          es: 'Apps en el monorepo',
        },
      },
    ],
    stack: ['TypeScript', 'Next.js', 'React', 'Supabase', 'Turborepo'],
    links: {},
  },

  {
    slug: 'arka',
    name: 'Arka',
    year: '2026',
    start: '2026-03',
    end: '2026-03',
    engagement: 'freelance',
    status: 'wip',
    codeVisibility: 'private',
    featured: false,
    accent: 'signal',
    role: {
      pt: 'Frontend e engine de canvas',
      en: 'Frontend and canvas engine',
      es: 'Frontend y motor de canvas',
    },
    summary: {
      pt: 'Ferramenta de especificação e prototipagem de produto, com árvore de regras, quadro Kanban e um canvas de wireframe escrito do zero.',
      en: 'A product specification and prototyping tool, with a rule tree, a Kanban board and a wireframe canvas written from scratch.',
      es: 'Herramienta de especificación y prototipado de producto, con árbol de reglas, tablero Kanban y un canvas de wireframe escrito desde cero.',
    },
    description: {
      pt: [
        'A ferramenta junta num mesmo lugar a árvore hierárquica de regras do produto, o quadro de tarefas e o canvas onde a tela é desenhada.',
        'Trabalhei na engine do canvas: pranchetas, guias inteligentes que aparecem quando um elemento se alinha a outro, atalhos de teclado e reconhecimento de gesto e de forma, para o traço à mão livre virar retângulo ou seta.',
        'É a parte de frontend mais próxima de software gráfico que já escrevi. Coordenada, matriz de transformação e teste de colisão deixam de ser teoria quando o usuário arrasta um elemento e espera que ele encoste exatamente onde deveria.',
      ],
      en: [
        'The tool brings together, in one place, the hierarchical tree of product rules, the task board and the canvas where the screen is drawn.',
        'I worked on the canvas engine: artboards, smart guides that appear when one element aligns with another, keyboard shortcuts, and gesture and shape recognition so a freehand stroke becomes a rectangle or an arrow.',
        'It is the closest to graphics software I have written on the front end. Coordinates, transformation matrices and hit testing stop being theory the moment a user drags an element and expects it to land exactly where it should.',
      ],
      es: [
        'La herramienta reúne en un mismo lugar el árbol jerárquico de reglas del producto, el tablero de tareas y el canvas donde se dibuja la pantalla.',
        'Trabajé en el motor del canvas: mesas de trabajo, guías inteligentes que aparecen cuando un elemento se alinea con otro, atajos de teclado y reconocimiento de gesto y de forma, para que el trazo a mano alzada se convierta en rectángulo o flecha.',
        'Es la parte de frontend más cercana a software gráfico que he escrito. Coordenada, matriz de transformación y prueba de colisión dejan de ser teoría cuando el usuario arrastra un elemento y espera que encaje exactamente donde debe.',
      ],
    },
    highlights: {
      pt: [
        'Engine de canvas com pranchetas e guias inteligentes de alinhamento',
        'Reconhecimento de gesto e de forma no traço à mão livre',
        'Atalhos de teclado para o fluxo inteiro de edição',
        'Árvore hierárquica de regras ligada ao quadro de tarefas',
      ],
      en: [
        'A canvas engine with artboards and smart alignment guides',
        'Gesture and shape recognition on freehand strokes',
        'Keyboard shortcuts across the whole editing flow',
        'A hierarchical rule tree wired to the task board',
      ],
      es: [
        'Motor de canvas con mesas de trabajo y guías inteligentes de alineación',
        'Reconocimiento de gesto y de forma en el trazo a mano alzada',
        'Atajos de teclado para todo el flujo de edición',
        'Árbol jerárquico de reglas conectado al tablero de tareas',
      ],
    },
    metrics: [],
    stack: ['TypeScript', 'Next.js', 'React', 'Konva', 'Zustand', 'Turborepo'],
    links: {},
  },

  {
    slug: 'xadrama',
    name: 'XADRAMA',
    year: '2025',
    start: '2025-09',
    end: '2025-09',
    engagement: 'proprio',
    status: 'wip',
    codeVisibility: 'public',
    featured: false,
    accent: 'cyan',
    role: {
      pt: 'Projeto próprio, full-stack',
      en: 'Personal project, full-stack',
      es: 'Proyecto propio, full-stack',
    },
    summary: {
      pt: 'Jogo de tabuleiro multiplayer que funde a simplicidade da Dama com a profundidade tática do Xadrez.',
      en: 'A multiplayer board game fusing the simplicity of Checkers with the tactical depth of Chess.',
      es: 'Juego de mesa multijugador que fusiona la simplicidad de las Damas con la profundidad táctica del Ajedrez.',
    },
    description: {
      pt: [
        'Nasceu de uma pergunta: e se as peças evoluíssem durante a partida? O tabuleiro começa simples como uma Dama e vai ganhando camadas táticas conforme as peças progridem.',
        'A arquitetura separa backend, frontend e um pacote compartilhado de tipos, então a regra do jogo é escrita uma única vez e vale para os dois lados da rede.',
        'A partida roda em tempo real sobre WebSocket, com o servidor como árbitro: o cliente propõe a jogada, o servidor valida e transmite o novo estado.',
      ],
      en: [
        'It started with a question: what if the pieces evolved during the match? The board opens as simply as Checkers and gains tactical layers as pieces progress.',
        'The architecture separates backend, frontend and a shared types package, so the game rules are written once and hold on both sides of the network.',
        'Matches run in real time over WebSocket, with the server as referee: the client proposes a move, the server validates it and broadcasts the new state.',
      ],
      es: [
        'Nació de una pregunta: ¿y si las piezas evolucionaran durante la partida? El tablero empieza simple como las Damas y gana capas tácticas conforme las piezas progresan.',
        'La arquitectura separa backend, frontend y un paquete compartido de tipos, así la regla del juego se escribe una sola vez y vale para ambos lados de la red.',
        'La partida corre en tiempo real sobre WebSocket, con el servidor como árbitro: el cliente propone la jugada, el servidor valida y transmite el nuevo estado.',
      ],
    },
    highlights: {
      pt: [
        'Estado da partida sincronizado em tempo real por WebSocket',
        'Tipos compartilhados entre cliente e servidor, regra escrita uma vez só',
        'Validação de jogada no servidor, o cliente nunca é fonte da verdade',
      ],
      en: [
        'Match state synchronised in real time over WebSocket',
        'Types shared between client and server, rules written only once',
        'Move validation on the server, the client is never the source of truth',
      ],
      es: [
        'Estado de la partida sincronizado en tiempo real por WebSocket',
        'Tipos compartidos entre cliente y servidor, regla escrita una sola vez',
        'Validación de jugada en el servidor, el cliente nunca es fuente de verdad',
      ],
    },
    metrics: [],
    stack: ['TypeScript', 'Python', 'WebSocket', 'Node.js'],
    links: { repo: 'https://github.com/Rodrigovieir4/XADRAMA' },
  },

  {
    slug: 'api-e-commerce',
    name: 'API de E-commerce',
    year: '2025',
    start: '2025-08',
    end: '2025-08',
    engagement: 'academico',
    status: 'archived',
    codeVisibility: 'public',
    featured: false,
    accent: 'ember',
    role: {
      pt: 'Projeto de estudo, backend',
      en: 'Study project, backend',
      es: 'Proyecto de estudio, backend',
    },
    summary: {
      pt: 'API REST de e-commerce em Flask, com autenticação, carrinho e contrato documentado em OpenAPI.',
      en: 'An e-commerce REST API in Flask, with authentication, cart and an OpenAPI-documented contract.',
      es: 'API REST de e-commerce en Flask, con autenticación, carrito y contrato documentado en OpenAPI.',
    },
    description: {
      pt: [
        'Construída do zero para entender o ciclo inteiro: modelagem de dados, sessão de usuário, carrinho e fechamento de pedido.',
        'O contrato vive em um arquivo Swagger versionado junto do código, então quem for consumir a API lê a especificação em vez de adivinhar o formato da resposta.',
        'Foi aqui que aprendi que documentar contrato não é burocracia. Um ano depois, documentar API virou parte do trabalho que eu faço em produção.',
      ],
      en: [
        'Built from scratch to understand the full cycle: data modelling, user session, cart and checkout.',
        'The contract lives in a Swagger file versioned alongside the code, so anyone consuming the API reads the spec instead of guessing the response shape.',
        'This is where I learned that documenting a contract is not bureaucracy. A year later, documenting APIs is part of the work I do in production.',
      ],
      es: [
        'Construida desde cero para entender el ciclo completo: modelado de datos, sesión de usuario, carrito y cierre de pedido.',
        'El contrato vive en un archivo Swagger versionado junto al código, así quien consuma la API lee la especificación en vez de adivinar el formato de la respuesta.',
        'Fue aquí donde aprendí que documentar el contrato no es burocracia. Un año después, documentar API es parte del trabajo que hago en producción.',
      ],
    },
    highlights: {
      pt: [
        'Autenticação de usuário com sessão e rotas protegidas',
        'Carrinho de compras com adição, remoção e fechamento de pedido',
        'Contrato publicado em OpenAPI, versionado junto do código',
      ],
      en: [
        'User authentication with sessions and protected routes',
        'Shopping cart with add, remove and order checkout',
        'Contract published as OpenAPI, versioned alongside the code',
      ],
      es: [
        'Autenticación de usuario con sesión y rutas protegidas',
        'Carrito de compras con agregar, quitar y cierre de pedido',
        'Contrato publicado en OpenAPI, versionado junto al código',
      ],
    },
    metrics: [],
    stack: ['Python', 'Flask', 'SQLite', 'OpenAPI'],
    links: { repo: 'https://github.com/Rodrigovieir4/API-e-commerce' },
  },

  {
    slug: 'gerenciador-de-tarefas',
    name: 'Gerenciador de Tarefas',
    year: '2025',
    start: '2025-08',
    end: '2025-08',
    engagement: 'academico',
    status: 'archived',
    codeVisibility: 'public',
    featured: false,
    accent: 'plasma',
    role: {
      pt: 'Projeto de estudo, Java',
      en: 'Study project, Java',
      es: 'Proyecto de estudio, Java',
    },
    summary: {
      pt: 'Serviço de gestão de tarefas em Java, empacotado em container e publicado em nuvem.',
      en: 'A task management service in Java, packaged into a container and shipped to the cloud.',
      es: 'Servicio de gestión de tareas en Java, empaquetado en contenedor y publicado en la nube.',
    },
    description: {
      pt: [
        'Um serviço de tarefas escrito em Java com build gerenciado por Maven, incluindo o wrapper no repositório para que qualquer pessoa compile sem instalar nada antes.',
        'O Dockerfile transformou o projeto em imagem reproduzível, o que eliminou a diferença entre rodar na minha máquina e rodar em produção.',
        'Foi o projeto em que a entrega deixou de ser um detalhe. Hoje isso se chama infraestrutura, e é metade do meu trabalho.',
      ],
      en: [
        'A task service written in Java with a Maven-managed build, including the wrapper in the repository so anyone can compile without installing anything first.',
        'The Dockerfile turned the project into a reproducible image, which removed the gap between running on my machine and running in production.',
        'This was the project where delivery stopped being an afterthought. These days that is called infrastructure, and it is half of my job.',
      ],
      es: [
        'Un servicio de tareas escrito en Java con build gestionado por Maven, incluyendo el wrapper en el repositorio para que cualquiera compile sin instalar nada antes.',
        'El Dockerfile convirtió el proyecto en imagen reproducible, lo que eliminó la diferencia entre correr en mi máquina y correr en producción.',
        'Fue el proyecto donde la entrega dejó de ser un detalle. Hoy eso se llama infraestructura, y es la mitad de mi trabajo.',
      ],
    },
    highlights: {
      pt: [
        'Build reproduzível com Maven Wrapper versionado no repositório',
        'Imagem Docker própria, mesmo ambiente em desenvolvimento e produção',
        'Deploy em nuvem a partir do container',
      ],
      en: [
        'Reproducible build with the Maven Wrapper versioned in the repository',
        'Custom Docker image, identical environment in development and production',
        'Cloud deploy straight from the container',
      ],
      es: [
        'Build reproducible con Maven Wrapper versionado en el repositorio',
        'Imagen Docker propia, mismo entorno en desarrollo y producción',
        'Deploy en la nube a partir del contenedor',
      ],
    },
    metrics: [],
    stack: ['Java', 'Maven', 'Docker', 'Render'],
    links: { repo: 'https://github.com/Rodrigovieir4/Gereciador-de-tarefas-Java-' },
  },
];

export const projects: Project[] = parseCollection(projectSchema, raw, 'src/data/projects.ts');

export const featuredProjects = projects.filter((project) => project.featured);

/** Produtos de cliente, que é o que primeiro interessa a quem contrata. */
export const clientProjects = projects.filter(
  (project) => project.engagement === 'dbc' || project.engagement === 'freelance',
);

/** Projetos próprios e acadêmicos, mostrados como origem da trajetória. */
export const personalProjects = projects.filter(
  (project) => project.engagement === 'proprio' || project.engagement === 'academico',
);

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
