import { experienceSchema, parseCollection, type Experience } from '../schema';

/**
 * Linha do tempo da trajetória.
 *
 * ============================ ATENÇÃO ============================
 * As datas marcadas com "CONFIRMAR" abaixo são estimativas, porque não
 * constavam no portfólio antigo nem no GitHub. Ajuste antes de divulgar.
 * São elas:
 *   - atleta-futebol   -> start e end
 *   - atleta-esports   -> start e end
 *   - sao-judas-ads    -> start
 * =================================================================
 *
 * `kind` controla o rótulo e a cor do marcador na linha do tempo:
 *   athletics    trajetória esportiva
 *   education    formação acadêmica
 *   project      projeto próprio relevante o bastante para virar marco
 *   work         experiência profissional
 *
 * Para registrar um emprego novo, copie o bloco modelo no fim do arquivo,
 * troque `end: null` por uma data quando sair, e pronto. O site reordena
 * sozinho, da mais recente para a mais antiga.
 */
const raw = [
  {
    id: 'atleta-futebol',
    kind: 'athletics',
    role: {
      pt: 'Atleta de futebol',
      en: 'Football athlete',
      es: 'Atleta de fútbol',
    },
    organization: 'Futebol de base',
    start: '2016-01', // CONFIRMAR
    end: '2021-12', // CONFIRMAR
    location: 'São Paulo, SP',
    summary: {
      pt: 'Anos de treino em categoria de base, onde aprendi que constância vence talento isolado.',
      en: 'Years of youth-academy training, where I learned that consistency beats isolated talent.',
      es: 'Años de entrenamiento en categoría de base, donde aprendí que la constancia vence al talento aislado.',
    },
    highlights: {
      pt: [
        'Rotina diária de treino conciliada com os estudos',
        'Leitura de jogo e tomada de decisão sob pressão',
        'Trabalho de equipe com função clara dentro de um sistema',
      ],
      en: [
        'A daily training routine balanced against school',
        'Reading the game and making decisions under pressure',
        'Teamwork with a clear role inside a system',
      ],
      es: [
        'Rutina diaria de entrenamiento conciliada con los estudios',
        'Lectura de juego y toma de decisión bajo presión',
        'Trabajo en equipo con función clara dentro de un sistema',
      ],
    },
    stack: [],
  },

  {
    id: 'atleta-esports',
    kind: 'athletics',
    role: {
      pt: 'Jogador competitivo de eSports',
      en: 'Competitive eSports player',
      es: 'Jugador competitivo de eSports',
    },
    organization: 'Cenário competitivo',
    start: '2020-01', // CONFIRMAR
    end: '2023-12', // CONFIRMAR
    location: 'Remoto',
    summary: {
      pt: 'A transição do campo para a tela. Foi jogando competitivo que a curiosidade virou do jogo para o que rodava por baixo dele.',
      en: 'The move from pitch to screen. Playing competitively is what turned my curiosity from the game toward what ran underneath it.',
      es: 'La transición del campo a la pantalla. Fue jugando competitivo que la curiosidad pasó del juego a lo que corría por debajo.',
    },
    highlights: {
      pt: [
        'Análise de desempenho a partir de dados de partida',
        'Comunicação objetiva em equipe, em tempo real',
        'Primeiro contato com código, por curiosidade sobre a infraestrutura do jogo',
      ],
      en: [
        'Performance analysis driven by match data',
        'Objective team communication, in real time',
        'First contact with code, out of curiosity about the game infrastructure',
      ],
      es: [
        'Análisis de desempeño a partir de datos de partida',
        'Comunicación objetiva en equipo, en tiempo real',
        'Primer contacto con código, por curiosidad sobre la infraestructura del juego',
      ],
    },
    stack: [],
  },

  {
    id: 'sao-judas-ads',
    kind: 'education',
    role: {
      pt: 'Análise e Desenvolvimento de Sistemas',
      en: 'Systems Analysis and Development',
      es: 'Análisis y Desarrollo de Sistemas',
    },
    organization: 'Universidade São Judas Tadeu',
    organizationUrl: 'https://www.usjt.br',
    start: '2025-02', // CONFIRMAR
    end: null,
    location: 'São Paulo, SP',
    summary: {
      pt: 'Graduação em andamento, com dez unidades curriculares já certificadas, de modelagem de software a sistemas distribuídos.',
      en: 'Degree in progress, with ten curricular units already certified, from software modelling to distributed systems.',
      es: 'Carrera en curso, con diez unidades curriculares ya certificadas, de modelado de software a sistemas distribuidos.',
    },
    highlights: {
      pt: [
        'Modelagem de software e engenharia de requisitos',
        'Sistemas distribuídos, mobile e ambientes computacionais',
        'Segurança de sistemas e gestão de qualidade de software',
      ],
      en: [
        'Software modelling and requirements engineering',
        'Distributed systems, mobile, and computing environments',
        'Systems security and software quality management',
      ],
      es: [
        'Modelado de software e ingeniería de requisitos',
        'Sistemas distribuidos, mobile y ambientes computacionales',
        'Seguridad de sistemas y gestión de calidad de software',
      ],
    },
    stack: ['Java', 'Python', 'MySQL', 'Scrum'],
  },

  {
    id: 'marco-primeiro-deploy',
    kind: 'project',
    role: {
      pt: 'Do primeiro commit ao primeiro deploy',
      en: 'From first commit to first deploy',
      es: 'Del primer commit al primer deploy',
    },
    organization: 'Projetos próprios',
    organizationUrl: 'https://github.com/Rodrigovieir4',
    start: '2025-08',
    end: null,
    location: 'Remoto',
    summary: {
      pt: 'O período em que sair do tutorial virou rotina: API em Flask, serviço Java em container e um jogo multiplayer em TypeScript.',
      en: 'The stretch where leaving the tutorial behind became routine: a Flask API, a containerised Java service, and a multiplayer game in TypeScript.',
      es: 'El período en que salir del tutorial se volvió rutina: API en Flask, servicio Java en contenedor y un juego multijugador en TypeScript.',
    },
    highlights: {
      pt: [
        'API REST documentada em OpenAPI, com autenticação e carrinho',
        'Serviço Java empacotado em Docker e publicado em nuvem',
        'Jogo multiplayer com estado sincronizado por WebSocket',
      ],
      en: [
        'A REST API documented in OpenAPI, with authentication and a cart',
        'A Java service packaged in Docker and shipped to the cloud',
        'A multiplayer game with state synchronised over WebSocket',
      ],
      es: [
        'API REST documentada en OpenAPI, con autenticación y carrito',
        'Servicio Java empaquetado en Docker y publicado en la nube',
        'Juego multijugador con estado sincronizado por WebSocket',
      ],
    },
    stack: ['Python', 'Flask', 'Java', 'Docker', 'TypeScript', 'WebSocket'],
  },

  /*
   * ------------------------- MODELO DE EMPREGO -------------------------
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
   *   start: '2026-01',
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
   * ---------------------------------------------------------------------
   */
];

/** Ordenada da mais recente para a mais antiga, que é a ordem de leitura. */
export const experiences: Experience[] = parseCollection(
  experienceSchema,
  raw,
  'src/data/experience.ts',
).sort((a, b) => (b.end ?? '9999-12').localeCompare(a.end ?? '9999-12'));

export const workExperiences = experiences.filter((item) => item.kind === 'work');
