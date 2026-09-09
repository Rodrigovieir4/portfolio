import { experienceSchema, parseCollection, type Experience } from '../schema';

/**
 * Linha do tempo da trajetória.
 *
 * ============================ ATENÇÃO ============================
 * Os meses marcados com "CONFIRMAR" são estimativas: o currículo trazia só o
 * ano. Ajuste antes de divulgar o link. São eles:
 *   - usp-mba      -> start
 *   - usjt-ads     -> start e end
 *   - atleta       -> start e end
 * Todo o resto veio do histórico git dos repositórios em D:\workspace.
 * =================================================================
 *
 * `kind` controla o rótulo e a cor do marcador:
 *   work         atuação profissional
 *   education    formação acadêmica
 *   athletics    trajetória esportiva
 *   project      marco de projeto próprio
 *
 * Para registrar um trabalho novo, copie o bloco modelo no fim do arquivo.
 * Use `end: null` enquanto estiver em andamento. O site reordena sozinho, da
 * mais recente para a mais antiga.
 */
const raw = [
  {
    id: 'dbc-software',
    kind: 'work',
    role: {
      pt: 'Desenvolvedor Full-Stack',
      en: 'Full-Stack Developer',
      es: 'Desarrollador Full-Stack',
    },
    organization: 'DBC Software',
    employment: 'pj',
    mode: 'remoto',
    start: '2025-11',
    end: null,
    location: 'Remoto',
    summary: {
      pt: 'Prestação de serviço, sem vínculo empregatício. Desenvolvimento ponta a ponta de três produtos para os mercados brasileiro e europeu: levantamento de requisito, arquitetura, implementação, segurança e deploy em produção.',
      en: 'Contract work, not an employment relationship. End-to-end development of three products for the Brazilian and European markets: requirements, architecture, implementation, security and production deploys.',
      es: 'Prestación de servicio, sin vínculo laboral. Desarrollo de punta a punta de tres productos para los mercados brasileño y europeo: levantamiento de requisitos, arquitectura, implementación, seguridad y despliegue en producción.',
    },
    highlights: {
      pt: [
        'Esplêndido, marketplace de serviços de limpeza atendendo Portugal e Irlanda, com infraestrutura própria na AWS',
        'DB Store, plataforma transacional no ar com usuários reais e pagamento por Pix de ponta a ponta',
        'DB Connect, marketplace para construção civil com app mobile e painel web no mesmo monorepo',
        'Operação de produção de verdade: recuperação de deploy travado, rotação de segredo e correção de falha de permissão',
      ],
      en: [
        'Esplêndido, a cleaning services marketplace serving Portugal and Ireland, on its own AWS infrastructure',
        'DB Store, a live transactional platform with real users and end-to-end Pix payments',
        'DB Connect, a construction marketplace with a mobile app and a web panel in one monorepo',
        'Real production duty: recovering a stuck deploy, rotating secrets and fixing a permission flaw',
      ],
      es: [
        'Esplêndido, marketplace de servicios de limpieza atendiendo a Portugal e Irlanda, con infraestructura propia en AWS',
        'DB Store, plataforma transaccional en vivo con usuarios reales y pago por Pix de punta a punta',
        'DB Connect, marketplace para construcción civil con app móvil y panel web en el mismo monorepo',
        'Operación de producción real: recuperación de deploy trabado, rotación de secretos y corrección de fallo de permiso',
      ],
    },
    stack: [
      'TypeScript',
      'NestJS',
      'Next.js',
      'PostgreSQL',
      'Supabase',
      'AWS',
      'Flutter',
      'Docker',
      'Stripe',
      'Pix',
    ],
  },

  {
    id: 'freelance-internacional',
    kind: 'work',
    role: {
      pt: 'Desenvolvedor Full-Stack, freelance',
      en: 'Full-Stack Developer, freelance',
      es: 'Desarrollador Full-Stack, freelance',
    },
    organization: 'Projetos internacionais',
    employment: 'freelance',
    mode: 'remoto',
    start: '2025-10',
    end: '2026-05',
    location: 'Remoto, Brasil e Portugal',
    summary: {
      pt: 'Atuação remota em equipes distribuídas, com daily, revisão de código e trabalho por pull request. Foi aqui que aprendi a entrar em base grande escrita por outra pessoa e entregar sem quebrar nada.',
      en: 'Remote work in distributed teams, with stand-ups, code review and a pull-request workflow. This is where I learned to enter a large codebase written by someone else and ship without breaking anything.',
      es: 'Trabajo remoto en equipos distribuidos, con daily, revisión de código y flujo de pull request. Fue aquí donde aprendí a entrar en una base grande escrita por otra persona y entregar sin romper nada.',
    },
    highlights: {
      pt: [
        'CS2 Cortex, cliente em Portugal: primeiro contato com integração contínua alheia e TypeScript em modo estrito',
        'Memoreba: painel administrativo, sessões conectadas com revogação e pipelines de conteúdo gerado por IA',
        'Arka: engine de canvas com pranchetas, guias inteligentes e reconhecimento de forma',
        'Mais de cem entregas em bases de milhares de arquivos, sempre sob revisão de código',
      ],
      en: [
        'CS2 Cortex, a client in Portugal: first exposure to someone else’s CI and to TypeScript in strict mode',
        'Memoreba: admin panel, connected sessions with revocation and AI content pipelines',
        'Arka: a canvas engine with artboards, smart guides and shape recognition',
        'Over a hundred deliveries in codebases of thousands of files, always under code review',
      ],
      es: [
        'CS2 Cortex, cliente en Portugal: primer contacto con integración continua ajena y TypeScript en modo estricto',
        'Memoreba: panel administrativo, sesiones conectadas con revocación y pipelines de contenido generado por IA',
        'Arka: motor de canvas con mesas de trabajo, guías inteligentes y reconocimiento de forma',
        'Más de cien entregas en bases de miles de archivos, siempre bajo revisión de código',
      ],
    },
    stack: ['TypeScript', 'Next.js', 'React', 'Supabase', 'Cloudflare Workers', 'Turborepo'],
  },

  {
    id: 'usp-mba',
    kind: 'education',
    role: {
      pt: 'MBA em Engenharia de Software',
      en: 'MBA in Software Engineering',
      es: 'MBA en Ingeniería de Software',
    },
    organization: 'Universidade de São Paulo',
    organizationUrl: 'https://www5.usp.br',
    start: '2026-01', // CONFIRMAR o mês de início
    end: null,
    location: 'São Paulo, SP',
    summary: {
      pt: 'Em andamento, com conclusão prevista para dezembro de 2027. Ênfase em arquitetura de microsserviços, cloud, segurança da informação e DevOps.',
      en: 'In progress, expected to finish in December 2027. Focused on microservice architecture, cloud, information security and DevOps.',
      es: 'En curso, con conclusión prevista para diciembre de 2027. Énfasis en arquitectura de microservicios, cloud, seguridad de la información y DevOps.',
    },
    highlights: {
      pt: [
        'Arquitetura de software e microsserviços',
        'Cloud computing e segurança da informação',
        'Gestão de projetos ágeis e DevOps',
        'Liderança de equipes e pensamento estratégico',
      ],
      en: [
        'Software architecture and microservices',
        'Cloud computing and information security',
        'Agile project management and DevOps',
        'Team leadership and strategic thinking',
      ],
      es: [
        'Arquitectura de software y microservicios',
        'Cloud computing y seguridad de la información',
        'Gestión de proyectos ágiles y DevOps',
        'Liderazgo de equipos y pensamiento estratégico',
      ],
    },
    stack: [],
  },

  {
    id: 'usjt-ads',
    kind: 'education',
    role: {
      pt: 'Análise e Desenvolvimento de Sistemas',
      en: 'Systems Analysis and Development',
      es: 'Análisis y Desarrollo de Sistemas',
    },
    organization: 'Universidade São Judas Tadeu',
    organizationUrl: 'https://www.usjt.br',
    start: '2023-02', // CONFIRMAR o mês
    end: '2025-12', // CONFIRMAR o mês
    location: 'São Paulo, SP',
    summary: {
      pt: 'Graduação concluída, com dez unidades curriculares certificadas. Base em desenvolvimento full-stack com Java, Python e JavaScript, modelagem de software e sistemas distribuídos.',
      en: 'Degree completed, with ten certified curricular units. Grounding in full-stack development with Java, Python and JavaScript, software modelling and distributed systems.',
      es: 'Carrera concluida, con diez unidades curriculares certificadas. Base en desarrollo full-stack con Java, Python y JavaScript, modelado de software y sistemas distribuidos.',
    },
    highlights: {
      pt: [
        'Modelagem de software e engenharia de requisitos',
        'Sistemas distribuídos, mobile e ambientes computacionais',
        'Segurança de sistemas e gestão de qualidade de software',
        'Prática com MySQL, MongoDB, Git, Docker e Maven',
      ],
      en: [
        'Software modelling and requirements engineering',
        'Distributed systems, mobile and computing environments',
        'Systems security and software quality management',
        'Hands-on with MySQL, MongoDB, Git, Docker and Maven',
      ],
      es: [
        'Modelado de software e ingeniería de requisitos',
        'Sistemas distribuidos, mobile y ambientes computacionales',
        'Seguridad de sistemas y gestión de calidad de software',
        'Práctica con MySQL, MongoDB, Git, Docker y Maven',
      ],
    },
    stack: ['Java', 'Python', 'JavaScript', 'MySQL', 'MongoDB', 'Docker', 'Maven'],
  },

  {
    id: 'atleta',
    kind: 'athletics',
    role: {
      pt: 'Atleta profissional',
      en: 'Professional athlete',
      es: 'Atleta profesional',
    },
    organization: 'Futebol e Counter-Strike',
    start: '2019-01', // CONFIRMAR o mês
    end: '2025-12', // CONFIRMAR o mês
    location: 'São Paulo, SP',
    summary: {
      pt: 'Seis anos competindo em alto rendimento, no futebol e no Counter-Strike. Foi jogando competitivo que a curiosidade virou do jogo para o que rodava por baixo dele.',
      en: 'Six years competing at a high level, in football and in Counter-Strike. Playing competitively is what turned my curiosity from the game toward what ran underneath it.',
      es: 'Seis años compitiendo en alto rendimiento, en fútbol y en Counter-Strike. Fue jugando competitivo que la curiosidad pasó del juego a lo que corría por debajo.',
    },
    highlights: {
      pt: [
        'Liderança e cooperação em ambiente de alta pressão',
        'Análise de desempenho a partir de dado de partida',
        'Rotina de treino diária conciliada com a graduação',
        'Resiliência e leitura de jogo, hoje aplicadas a problema complexo',
      ],
      en: [
        'Leadership and cooperation under high pressure',
        'Performance analysis driven by match data',
        'A daily training routine balanced against the degree',
        'Resilience and reading the game, now applied to complex problems',
      ],
      es: [
        'Liderazgo y cooperación en ambiente de alta presión',
        'Análisis de desempeño a partir de datos de partida',
        'Rutina de entrenamiento diaria conciliada con la carrera',
        'Resiliencia y lectura de juego, hoy aplicadas a problemas complejos',
      ],
    },
    stack: [],
  },

  /*
   * ------------------------- MODELO DE TRABALHO -------------------------
   * Descomente, preencha e o site publica sozinho na próxima build.
   *
   * {
   *   id: 'empresa-cargo',
   *   kind: 'work',
   *   role: { pt: 'Desenvolvedor Backend', en: '...', es: '...' },
   *   organization: 'Nome da Empresa',
   *   organizationUrl: 'https://empresa.com',
   *   employment: 'clt',        // clt | pj | freelance | estagio | trainee
   *   mode: 'hibrido',          // remoto | hibrido | presencial
   *   start: '2026-10',
   *   end: null,                // null = até hoje
   *   location: 'São Paulo, SP',
   *   summary: { pt: '...', en: '...', es: '...' },
   *   highlights: {
   *     pt: ['Resultado com número', 'Outro resultado', 'Mais um'],
   *     en: ['...', '...', '...'],
   *     es: ['...', '...', '...'],
   *   },
   *   stack: ['Java', 'Spring Boot', 'PostgreSQL'],
   * },
   * ----------------------------------------------------------------------
   */
];

/** Ordenada da mais recente para a mais antiga, que é a ordem de leitura. */
export const experiences: Experience[] = parseCollection(
  experienceSchema,
  raw,
  'src/data/experience.ts',
).sort((a, b) => (b.end ?? '9999-12').localeCompare(a.end ?? '9999-12'));

export const workExperiences = experiences.filter((item) => item.kind === 'work');
