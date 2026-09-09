import { parseCollection, projectSchema, type Project } from '../schema';

/**
 * Projetos.
 *
 * `featured: true` promove o projeto para a grade principal da home, com card
 * grande e destaque de cor. Os demais aparecem apenas na listagem completa.
 * Todo projeto também ganha uma rota estática em /[locale]/projetos/[slug].
 */
const raw = [
  {
    slug: 'xadrama',
    name: 'XADRAMA',
    year: '2025',
    status: 'wip',
    featured: true,
    accent: 'plasma',
    role: {
      pt: 'Autor e desenvolvedor full-stack',
      en: 'Author and full-stack developer',
      es: 'Autor y desarrollador full-stack',
    },
    summary: {
      pt: 'Jogo de tabuleiro multiplayer que funde a simplicidade da Dama com a profundidade tática do Xadrez.',
      en: 'A multiplayer board game fusing the simplicity of Checkers with the tactical depth of Chess.',
      es: 'Juego de mesa multijugador que fusiona la simplicidad de las Damas con la profundidad táctica del Ajedrez.',
    },
    description: {
      pt: [
        'XADRAMA nasceu de uma pergunta: e se as peças evoluíssem durante a partida? O tabuleiro começa simples como uma Dama e vai ganhando camadas táticas conforme as peças progridem.',
        'A arquitetura separa backend, frontend e um pacote compartilhado de tipos, de modo que a regra do jogo é escrita uma única vez e vale para os dois lados da rede.',
        'A partida roda em tempo real sobre WebSocket, com o servidor como árbitro: o cliente propõe a jogada, o servidor valida e transmite o novo estado.',
      ],
      en: [
        'XADRAMA started with a question: what if the pieces evolved during the match? The board opens as simply as Checkers and gains tactical layers as pieces progress.',
        'The architecture separates backend, frontend, and a shared types package, so the game rules are written once and hold on both sides of the network.',
        'Matches run in real time over WebSocket, with the server as referee: the client proposes a move, the server validates it and broadcasts the new state.',
      ],
      es: [
        'XADRAMA nació de una pregunta: ¿y si las piezas evolucionaran durante la partida? El tablero empieza simple como las Damas y gana capas tácticas conforme las piezas progresan.',
        'La arquitectura separa backend, frontend y un paquete compartido de tipos, de modo que la regla del juego se escribe una sola vez y vale para ambos lados de la red.',
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
    stack: ['TypeScript', 'Python', 'WebSocket', 'Node.js', 'HTML5', 'CSS3'],
    links: { repo: 'https://github.com/Rodrigovieir4/XADRAMA' },
  },

  {
    slug: 'api-e-commerce',
    name: 'API de E-commerce',
    year: '2025',
    status: 'live',
    featured: true,
    accent: 'signal',
    role: {
      pt: 'Desenvolvedor backend',
      en: 'Backend developer',
      es: 'Desarrollador backend',
    },
    summary: {
      pt: 'API REST completa de e-commerce em Flask, com autenticação, carrinho e contrato documentado em OpenAPI.',
      en: 'A complete e-commerce REST API in Flask, with authentication, cart, and an OpenAPI-documented contract.',
      es: 'API REST completa de e-commerce en Flask, con autenticación, carrito y contrato documentado en OpenAPI.',
    },
    description: {
      pt: [
        'Uma API de loja construída do zero para entender o ciclo inteiro: modelagem de dados, sessão de usuário, carrinho e fechamento de pedido.',
        'O contrato vive em um arquivo Swagger versionado junto do código, então quem for consumir a API lê a especificação em vez de adivinhar o formato da resposta.',
        'Persistência em SQLite pela portabilidade: o projeto sobe em qualquer máquina com um comando, sem depender de banco externo.',
      ],
      en: [
        'A store API built from scratch to understand the full cycle: data modelling, user session, cart, and checkout.',
        'The contract lives in a Swagger file versioned alongside the code, so anyone consuming the API reads the spec instead of guessing the response shape.',
        'Persistence in SQLite for portability: the project runs on any machine with a single command, with no external database.',
      ],
      es: [
        'Una API de tienda construida desde cero para entender el ciclo completo: modelado de datos, sesión de usuario, carrito y cierre de pedido.',
        'El contrato vive en un archivo Swagger versionado junto al código, así quien consuma la API lee la especificación en vez de adivinar el formato de la respuesta.',
        'Persistencia en SQLite por portabilidad: el proyecto arranca en cualquier máquina con un comando, sin depender de base externa.',
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
        'Shopping cart with add, remove, and order checkout',
        'Contract published as OpenAPI, versioned alongside the code',
      ],
      es: [
        'Autenticación de usuario con sesión y rutas protegidas',
        'Carrito de compras con agregar, quitar y cierre de pedido',
        'Contrato publicado en OpenAPI, versionado junto al código',
      ],
    },
    stack: ['Python', 'Flask', 'SQLite', 'OpenAPI', 'REST'],
    links: { repo: 'https://github.com/Rodrigovieir4/API-e-commerce' },
  },

  {
    slug: 'gerenciador-de-tarefas',
    name: 'Gerenciador de Tarefas',
    year: '2025',
    status: 'live',
    featured: true,
    accent: 'ember',
    role: {
      pt: 'Desenvolvedor Java',
      en: 'Java developer',
      es: 'Desarrollador Java',
    },
    summary: {
      pt: 'Serviço de gestão de tarefas em Java, empacotado em container e publicado em nuvem.',
      en: 'A task management service in Java, packaged into a container and shipped to the cloud.',
      es: 'Servicio de gestión de tareas en Java, empaquetado en contenedor y publicado en la nube.',
    },
    description: {
      pt: [
        'Um serviço de tarefas escrito em Java com build gerenciado por Maven, incluindo o wrapper no repositório para que qualquer pessoa compile sem instalar nada antes.',
        'O Dockerfile transforma o projeto em imagem reproduzível, o que eliminou a diferença entre rodar na minha máquina e rodar em produção.',
        'Foi o projeto em que a entrega deixou de ser um detalhe: build, imagem e deploy passaram a fazer parte do desenvolvimento.',
      ],
      en: [
        'A task service written in Java with a Maven-managed build, including the wrapper in the repository so anyone can compile without installing anything first.',
        'The Dockerfile turns the project into a reproducible image, which removed the gap between running on my machine and running in production.',
        'This was the project where delivery stopped being an afterthought: build, image, and deploy became part of development.',
      ],
      es: [
        'Un servicio de tareas escrito en Java con build gestionado por Maven, incluyendo el wrapper en el repositorio para que cualquiera compile sin instalar nada antes.',
        'El Dockerfile convierte el proyecto en imagen reproducible, lo que eliminó la diferencia entre correr en mi máquina y correr en producción.',
        'Fue el proyecto donde la entrega dejó de ser un detalle: build, imagen y deploy pasaron a formar parte del desarrollo.',
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
    stack: ['Java', 'Maven', 'Docker', 'Render'],
    links: { repo: 'https://github.com/Rodrigovieir4/Gereciador-de-tarefas-Java-' },
  },

  {
    slug: 'portfolio-v1',
    name: 'Portfolio v1',
    year: '2025',
    status: 'archived',
    featured: false,
    accent: 'cyan',
    role: {
      pt: 'Desenvolvedor frontend',
      en: 'Frontend developer',
      es: 'Desarrollador frontend',
    },
    summary: {
      pt: 'Primeira versão do portfólio, em HTML, CSS e JavaScript puro, com tradução em três idiomas.',
      en: 'The first version of the portfolio, in plain HTML, CSS, and JavaScript, translated into three languages.',
      es: 'Primera versión del portfolio, en HTML, CSS y JavaScript puro, con traducción en tres idiomas.',
    },
    description: {
      pt: [
        'Construído sem framework, de propósito: eu queria entender o que uma biblioteca faz por baixo antes de deixar que ela fizesse por mim.',
        'Trazia troca de idioma entre português, inglês e espanhol resolvida na mão, com um dicionário em JavaScript e substituição direta no DOM.',
        'Continua no ar como registro do ponto de partida. A versão que você está lendo agora é a resposta a ele.',
      ],
      en: [
        'Built without a framework on purpose: I wanted to understand what a library does underneath before letting it do the work for me.',
        'It shipped language switching across Portuguese, English, and Spanish written by hand, with a JavaScript dictionary and direct DOM replacement.',
        'It stays online as a record of the starting point. The version you are reading now is the answer to it.',
      ],
      es: [
        'Construido sin framework a propósito: quería entender lo que hace una librería por debajo antes de dejar que lo hiciera por mí.',
        'Traía cambio de idioma entre portugués, inglés y español resuelto a mano, con un diccionario en JavaScript y sustitución directa en el DOM.',
        'Sigue en línea como registro del punto de partida. La versión que lees ahora es la respuesta a él.',
      ],
    },
    highlights: {
      pt: [
        'Internacionalização em três idiomas sem nenhuma biblioteca',
        'Fundo animado de partículas em canvas',
        'Zero dependência de build, publicado como arquivo estático',
      ],
      en: [
        'Three-language internationalisation with no library at all',
        'Animated particle background on canvas',
        'Zero build dependencies, published as static files',
      ],
      es: [
        'Internacionalización en tres idiomas sin ninguna librería',
        'Fondo animado de partículas en canvas',
        'Cero dependencia de build, publicado como archivo estático',
      ],
    },
    stack: ['HTML5', 'CSS3', 'JavaScript'],
    links: {
      repo: 'https://github.com/Rodrigovieir4/meu-portfolio',
      demo: 'https://portfolio-rodrigo-vieira.netlify.app',
    },
  },
];

export const projects: Project[] = parseCollection(projectSchema, raw, 'src/data/projects.ts');

export const featuredProjects = projects.filter((project) => project.featured);

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
