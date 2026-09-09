import { parseCollection, projectSchema, type Project } from '../schema';

/**
 * Projetos.
 *
 * `featured: true` promove o projeto para a grade principal da home, com card
 * grande e cena WebGL propria. Os demais aparecem apenas na listagem completa.
 * Todo projeto tambem ganha uma rota estatica em /[locale]/projetos/[slug].
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
      pt: 'Jogo de tabuleiro multiplayer que funde a simplicidade da Dama com a profundidade tatica do Xadrez.',
      en: 'A multiplayer board game fusing the simplicity of Checkers with the tactical depth of Chess.',
      es: 'Juego de mesa multijugador que fusiona la simplicidad de las Damas con la profundidad tactica del Ajedrez.',
    },
    description: {
      pt: [
        'XADRAMA nasceu de uma pergunta: e se as pecas evoluissem durante a partida? O tabuleiro comeca simples como uma Dama e vai ganhando camadas taticas conforme as pecas progridem.',
        'A arquitetura separa backend, frontend e um pacote compartilhado de tipos, de modo que a regra do jogo e escrita uma unica vez e vale para os dois lados da rede.',
        'A partida roda em tempo real sobre WebSocket, com o servidor como arbitro: o cliente propoe a jogada, o servidor valida e transmite o novo estado.',
      ],
      en: [
        'XADRAMA started with a question: what if the pieces evolved during the match? The board opens as simply as Checkers and gains tactical layers as pieces progress.',
        'The architecture separates backend, frontend, and a shared types package, so the game rules are written once and hold on both sides of the network.',
        'Matches run in real time over WebSocket, with the server as referee: the client proposes a move, the server validates it and broadcasts the new state.',
      ],
      es: [
        'XADRAMA nacio de una pregunta: y si las piezas evolucionaran durante la partida? El tablero empieza simple como las Damas y gana capas tacticas conforme las piezas progresan.',
        'La arquitectura separa backend, frontend y un paquete compartido de tipos, de modo que la regla del juego se escribe una sola vez y vale para ambos lados de la red.',
        'La partida corre en tiempo real sobre WebSocket, con el servidor como arbitro: el cliente propone la jugada, el servidor valida y transmite el nuevo estado.',
      ],
    },
    highlights: {
      pt: [
        'Estado da partida sincronizado em tempo real por WebSocket',
        'Tipos compartilhados entre cliente e servidor, regra escrita uma vez so',
        'Validacao de jogada no servidor, o cliente nunca e fonte da verdade',
      ],
      en: [
        'Match state synchronised in real time over WebSocket',
        'Types shared between client and server, rules written only once',
        'Move validation on the server, the client is never the source of truth',
      ],
      es: [
        'Estado de la partida sincronizado en tiempo real por WebSocket',
        'Tipos compartidos entre cliente y servidor, regla escrita una sola vez',
        'Validacion de jugada en el servidor, el cliente nunca es fuente de verdad',
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
      pt: 'API REST completa de e-commerce em Flask, com autenticacao, carrinho e contrato documentado em OpenAPI.',
      en: 'A complete e-commerce REST API in Flask, with authentication, cart, and an OpenAPI-documented contract.',
      es: 'API REST completa de e-commerce en Flask, con autenticacion, carrito y contrato documentado en OpenAPI.',
    },
    description: {
      pt: [
        'Uma API de loja construida do zero para entender o ciclo inteiro: modelagem de dados, sessao de usuario, carrinho e fechamento de pedido.',
        'O contrato vive em um arquivo Swagger versionado junto do codigo, entao quem for consumir a API le a especificacao em vez de adivinhar o formato da resposta.',
        'Persistencia em SQLite pela portabilidade: o projeto sobe em qualquer maquina com um comando, sem depender de banco externo.',
      ],
      en: [
        'A store API built from scratch to understand the full cycle: data modelling, user session, cart, and checkout.',
        'The contract lives in a Swagger file versioned alongside the code, so anyone consuming the API reads the spec instead of guessing the response shape.',
        'Persistence in SQLite for portability: the project runs on any machine with a single command, with no external database.',
      ],
      es: [
        'Una API de tienda construida desde cero para entender el ciclo completo: modelado de datos, sesion de usuario, carrito y cierre de pedido.',
        'El contrato vive en un archivo Swagger versionado junto al codigo, asi quien consuma la API lee la especificacion en vez de adivinar el formato de la respuesta.',
        'Persistencia en SQLite por portabilidad: el proyecto arranca en cualquier maquina con un comando, sin depender de base externa.',
      ],
    },
    highlights: {
      pt: [
        'Autenticacao de usuario com sessao e rotas protegidas',
        'Carrinho de compras com adicao, remocao e fechamento de pedido',
        'Contrato publicado em OpenAPI, versionado junto do codigo',
      ],
      en: [
        'User authentication with sessions and protected routes',
        'Shopping cart with add, remove, and order checkout',
        'Contract published as OpenAPI, versioned alongside the code',
      ],
      es: [
        'Autenticacion de usuario con sesion y rutas protegidas',
        'Carrito de compras con agregar, quitar y cierre de pedido',
        'Contrato publicado en OpenAPI, versionado junto al codigo',
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
      pt: 'Servico de gestao de tarefas em Java, empacotado em container e publicado em nuvem.',
      en: 'A task management service in Java, packaged into a container and shipped to the cloud.',
      es: 'Servicio de gestion de tareas en Java, empaquetado en contenedor y publicado en la nube.',
    },
    description: {
      pt: [
        'Um servico de tarefas escrito em Java com build gerenciado por Maven, incluindo o wrapper no repositorio para que qualquer pessoa compile sem instalar nada antes.',
        'O Dockerfile transforma o projeto em imagem reproduzivel, o que eliminou a diferenca entre rodar na minha maquina e rodar em producao.',
        'Foi o projeto em que a entrega deixou de ser um detalhe: build, imagem e deploy passaram a fazer parte do desenvolvimento.',
      ],
      en: [
        'A task service written in Java with a Maven-managed build, including the wrapper in the repository so anyone can compile without installing anything first.',
        'The Dockerfile turns the project into a reproducible image, which removed the gap between running on my machine and running in production.',
        'This was the project where delivery stopped being an afterthought: build, image, and deploy became part of development.',
      ],
      es: [
        'Un servicio de tareas escrito en Java con build gestionado por Maven, incluyendo el wrapper en el repositorio para que cualquiera compile sin instalar nada antes.',
        'El Dockerfile convierte el proyecto en imagen reproducible, lo que elimino la diferencia entre correr en mi maquina y correr en produccion.',
        'Fue el proyecto donde la entrega dejo de ser un detalle: build, imagen y deploy pasaron a formar parte del desarrollo.',
      ],
    },
    highlights: {
      pt: [
        'Build reproduzivel com Maven Wrapper versionado no repositorio',
        'Imagem Docker propria, mesmo ambiente em desenvolvimento e producao',
        'Deploy em nuvem a partir do container',
      ],
      en: [
        'Reproducible build with the Maven Wrapper versioned in the repository',
        'Custom Docker image, identical environment in development and production',
        'Cloud deploy straight from the container',
      ],
      es: [
        'Build reproducible con Maven Wrapper versionado en el repositorio',
        'Imagen Docker propia, mismo entorno en desarrollo y produccion',
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
      pt: 'Primeira versao do portfolio, em HTML, CSS e JavaScript puro, com traducao em tres idiomas.',
      en: 'The first version of the portfolio, in plain HTML, CSS, and JavaScript, translated into three languages.',
      es: 'Primera version del portfolio, en HTML, CSS y JavaScript puro, con traduccion en tres idiomas.',
    },
    description: {
      pt: [
        'Construido sem framework, de proposito: eu queria entender o que uma biblioteca faz por baixo antes de deixar que ela fizesse por mim.',
        'Trazia troca de idioma entre portugues, ingles e espanhol resolvida na mao, com um dicionario em JavaScript e substituicao direta no DOM.',
        'Continua no ar como registro do ponto de partida. A versao que voce esta lendo agora e a resposta a ele.',
      ],
      en: [
        'Built without a framework on purpose: I wanted to understand what a library does underneath before letting it do the work for me.',
        'It shipped language switching across Portuguese, English, and Spanish written by hand, with a JavaScript dictionary and direct DOM replacement.',
        'It stays online as a record of the starting point. The version you are reading now is the answer to it.',
      ],
      es: [
        'Construido sin framework a proposito: queria entender lo que hace una libreria por debajo antes de dejar que lo hiciera por mi.',
        'Traia cambio de idioma entre portugues, ingles y espanol resuelto a mano, con un diccionario en JavaScript y sustitucion directa en el DOM.',
        'Sigue en linea como registro del punto de partida. La version que lees ahora es la respuesta a el.',
      ],
    },
    highlights: {
      pt: [
        'Internacionalizacao em tres idiomas sem nenhuma biblioteca',
        'Fundo animado de particulas em canvas',
        'Zero dependencia de build, publicado como arquivo estatico',
      ],
      en: [
        'Three-language internationalisation with no library at all',
        'Animated particle background on canvas',
        'Zero build dependencies, published as static files',
      ],
      es: [
        'Internacionalizacion en tres idiomas sin ninguna libreria',
        'Fondo animado de particulas en canvas',
        'Cero dependencia de build, publicado como archivo estatico',
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
