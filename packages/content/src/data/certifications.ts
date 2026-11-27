import {
  type Certification,
  certificationSchema,
  parseCollection,
} from "../schema"

/**
 * Certificados.
 *
 * O campo `file` aponta para um PDF em apps/web/public/certificados. O site
 * abre o arquivo em nova aba; se `file` ficar vazio, o card aparece sem link
 * em vez de quebrar.
 *
 * Os PDFs originais estão no repositório antigo, em
 * portfolio/assets/certificados.
 * O comando `bun run assets:importar` baixa todos de uma vez, já renomeados.
 *
 * O card mostra a primeira página do PDF como foto, em
 * apps/web/public/certificados/capas/<mesmo nome>.webp. Para um certificado
 * novo, gere a capa assim (na pasta public/certificados):
 *   pdftoppm -f 1 -l 1 -singlefile -scale-to 1000 -png x.pdf /tmp/x
 *   ffmpeg -i /tmp/x.png -vf scale=800:-1 -quality 80 capas/x.webp
 * Sem a capa, o card mostra o nome do emissor no lugar.
 */
const raw = [
  {
    id: "wizard-ingles",
    category: "idioma",
    issuer: "Wizard",
    name: {
      pt: "Proficiência em Inglês",
      en: "English Proficiency",
      es: "Competencia en Inglés",
    },
    file: "/certificados/wizard-ingles.pdf",
    issued: "2023-12",
    hours: 140,
    about: {
      pt: "Módulo Proficiency, o último nível da Wizard: 140 horas para usar o inglês com fluência em situações reais. É a base para ler documentação técnica e falar com clientes de fora.",
      en: "Proficiency module, Wizard’s top level: 140 hours of using English fluently in real situations. It is what lets me read technical docs and talk to clients abroad.",
      es: "Módulo Proficiency, el último nivel de Wizard: 140 horas para usar el inglés con fluidez en situaciones reales. Es la base para leer documentación técnica y hablar con clientes del exterior.",
    },
    topics: {
      pt: [
        "Conversação fluente e espontânea",
        "Compreensão de falantes nativos",
        "Leitura e escrita de textos longos e formais",
        "Gramática e vocabulário avançados",
        "Apresentação e argumentação",
      ],
      en: [
        "Fluent, spontaneous conversation",
        "Understanding native speakers",
        "Reading and writing long, formal texts",
        "Advanced grammar and vocabulary",
        "Presenting and arguing a point",
      ],
      es: [
        "Conversación fluida y espontánea",
        "Comprensión de hablantes nativos",
        "Lectura y escritura de textos largos y formales",
        "Gramática y vocabulario avanzados",
        "Presentación y argumentación",
      ],
    },
  },
  {
    id: "rocketseat-python",
    category: "curso",
    issuer: "Rocketseat",
    name: {
      pt: "Introdução ao Python",
      en: "Introduction to Python",
      es: "Introducción a Python",
    },
    file: "/certificados/rocketseat-python.pdf",
    issued: "2025-08",
    hours: 10,
    about: {
      pt: "Curso de extensão da Faculdade de Tecnologia Rocketseat: dos fundamentos da linguagem a uma API em Flask publicada.",
      en: "Extension course from the Rocketseat School of Technology: from the language basics to a deployed Flask API.",
      es: "Curso de extensión de la Facultad de Tecnología Rocketseat: de los fundamentos del lenguaje a una API en Flask publicada.",
    },
    topics: {
      pt: [
        "Fundamentos do Python",
        "Conceitos de API e métodos HTTP",
        "Banco de dados",
        "APIs com Flask",
        "Autenticação com Flask-Login",
        "Tratamento de erros e deploy",
      ],
      en: [
        "Python fundamentals",
        "API concepts and HTTP methods",
        "Databases",
        "APIs with Flask",
        "Authentication with Flask-Login",
        "Error handling and deployment",
      ],
      es: [
        "Fundamentos de Python",
        "Conceptos de API y métodos HTTP",
        "Bases de datos",
        "APIs con Flask",
        "Autenticación con Flask-Login",
        "Manejo de errores y despliegue",
      ],
    },
  },
  {
    id: "rocketseat-java",
    category: "curso",
    issuer: "Rocketseat",
    name: {
      pt: "Minicurso de Java",
      en: "Java Short Course",
      es: "Minicurso de Java",
    },
    file: "/certificados/rocketseat-java.pdf",
    issued: "2025-08",
    hours: 5,
    about: {
      pt: "Minicurso de extensão da Rocketseat: um back-end em Java do zero ao deploy, com Spring Boot.",
      en: "Rocketseat extension short course: a Java back end from scratch to deployment, with Spring Boot.",
      es: "Minicurso de extensión de Rocketseat: un back-end en Java desde cero hasta el despliegue, con Spring Boot.",
    },
    topics: {
      pt: [
        "API REST com Spring Boot",
        "Maven e Lombok",
        "Banco de dados H2",
        "Segurança dos dados do usuário",
        "Tratamento de exceções",
        "Deploy do back-end",
      ],
      en: [
        "REST API with Spring Boot",
        "Maven and Lombok",
        "H2 database",
        "Securing user data",
        "Exception handling",
        "Back-end deployment",
      ],
      es: [
        "API REST con Spring Boot",
        "Maven y Lombok",
        "Base de datos H2",
        "Seguridad de los datos del usuario",
        "Manejo de excepciones",
        "Despliegue del back-end",
      ],
    },
  },

  // --- Unidades curriculares da Universidade São Judas Tadeu ---
  {
    id: "usjt-modelagem-software",
    category: "academico",
    issuer: "Universidade São Judas Tadeu",
    name: {
      pt: "Modelagem de software",
      en: "Software modelling",
      es: "Modelado de software",
    },
    file: "/certificados/usjt-modelagem-de-software.pdf",
    issued: "2023-07",
    hours: 160,
    about: {
      pt: "Unidade curricular da graduação em ADS, em parceria com a Oracle Academy: como sair do problema do cliente para um modelo de software e de dados antes de escrever código.",
      en: "A course unit of my degree, in partnership with Oracle Academy: going from the client’s problem to a software and data model before writing code.",
      es: "Unidad curricular de la carrera, en alianza con Oracle Academy: cómo pasar del problema del cliente a un modelo de software y de datos antes de escribir código.",
    },
    topics: {
      pt: [
        "Levantamento e especificação de requisitos",
        "Casos de uso e diagramas UML",
        "Modelo entidade-relacionamento e normalização",
        "SQL para criar e consultar o banco",
        "Orientação a objetos aplicada ao modelo",
      ],
      en: [
        "Gathering and specifying requirements",
        "Use cases and UML diagrams",
        "Entity-relationship modelling and normalisation",
        "SQL to create and query the database",
        "Object orientation applied to the model",
      ],
      es: [
        "Levantamiento y especificación de requisitos",
        "Casos de uso y diagramas UML",
        "Modelo entidad-relación y normalización",
        "SQL para crear y consultar la base",
        "Orientación a objetos aplicada al modelo",
      ],
    },
  },
  {
    id: "usjt-engenharia-software",
    category: "academico",
    issuer: "Universidade São Judas Tadeu",
    name: {
      pt: "Modelos, métodos e técnicas da engenharia de software",
      en: "Software engineering models, methods and techniques",
      es: "Modelos, métodos y técnicas de la ingeniería de software",
    },
    file: "/certificados/usjt-engenharia-de-software.pdf",
    issued: "2024-12",
    hours: 160,
    about: {
      pt: "Unidade curricular com a qualificação profissional em Modelos, Métodos e Técnicas da Engenharia de Software: como um software é planejado, construído e evolui em equipe.",
      en: "A course unit with a professional qualification in Software Engineering Models, Methods and Techniques: how software is planned, built and evolved by a team.",
      es: "Unidad curricular con la calificación profesional en Modelos, Métodos y Técnicas de la Ingeniería de Software: cómo se planifica, construye y evoluciona un software en equipo.",
    },
    topics: {
      pt: [
        "Processos de software: cascata, iterativo e ágil",
        "Scrum e Kanban na prática",
        "Engenharia de requisitos",
        "Arquitetura e padrões de projeto",
        "Versionamento com Git e trabalho em equipe",
      ],
      en: [
        "Software processes: waterfall, iterative and agile",
        "Scrum and Kanban in practice",
        "Requirements engineering",
        "Architecture and design patterns",
        "Version control with Git and teamwork",
      ],
      es: [
        "Procesos de software: cascada, iterativo y ágil",
        "Scrum y Kanban en la práctica",
        "Ingeniería de requisitos",
        "Arquitectura y patrones de diseño",
        "Versionado con Git y trabajo en equipo",
      ],
    },
  },
  {
    id: "usjt-programacao-solucoes",
    category: "academico",
    issuer: "Universidade São Judas Tadeu",
    name: {
      pt: "Programação de soluções computacionais",
      en: "Programming computational solutions",
      es: "Programación de soluciones computacionales",
    },
    file: "/certificados/usjt-programacao-de-solucoes.pdf",
    issued: "2023-07",
    hours: 160,
    about: {
      pt: "Unidade curricular em parceria com a Oracle Academy: lógica, Java e banco de dados para construir soluções do começo ao fim.",
      en: "A course unit in partnership with Oracle Academy: logic, Java and databases to build solutions end to end.",
      es: "Unidad curricular en alianza con Oracle Academy: lógica, Java y bases de datos para construir soluciones de principio a fin.",
    },
    topics: {
      pt: [
        "Lógica de programação e algoritmos",
        "Java e orientação a objetos",
        "Estruturas de dados e coleções",
        "SQL e integração com banco de dados",
        "Aplicações CRUD",
      ],
      en: [
        "Programming logic and algorithms",
        "Java and object orientation",
        "Data structures and collections",
        "SQL and database integration",
        "CRUD applications",
      ],
      es: [
        "Lógica de programación y algoritmos",
        "Java y orientación a objetos",
        "Estructuras de datos y colecciones",
        "SQL e integración con bases de datos",
        "Aplicaciones CRUD",
      ],
    },
  },
  {
    id: "usjt-sistemas-distribuidos",
    category: "academico",
    issuer: "Universidade São Judas Tadeu",
    name: {
      pt: "Sistemas distribuídos e mobile",
      en: "Distributed and mobile systems",
      es: "Sistemas distribuidos y mobile",
    },
    file: "/certificados/usjt-sistemas-distribuidos.pdf",
    issued: "2024-07",
    hours: 160,
    about: {
      pt: "Unidade curricular com a qualificação profissional em Sistemas Distribuídos e Mobile: sistemas que conversam pela rede e apps que consomem esses serviços.",
      en: "A course unit with a professional qualification in Distributed Systems and Mobile: systems that talk over the network and apps that use those services.",
      es: "Unidad curricular con la calificación profesional en Sistemas Distribuidos y Mobile: sistemas que se comunican por la red y apps que consumen esos servicios.",
    },
    topics: {
      pt: [
        "Arquiteturas cliente-servidor e distribuídas",
        "APIs REST e troca de dados em JSON",
        "Microsserviços e contêineres com Docker",
        "Desenvolvimento mobile",
        "Concorrência, escalabilidade e tolerância a falhas",
      ],
      en: [
        "Client-server and distributed architectures",
        "REST APIs and JSON data exchange",
        "Microservices and containers with Docker",
        "Mobile development",
        "Concurrency, scalability and fault tolerance",
      ],
      es: [
        "Arquitecturas cliente-servidor y distribuidas",
        "APIs REST e intercambio de datos en JSON",
        "Microservicios y contenedores con Docker",
        "Desarrollo móvil",
        "Concurrencia, escalabilidad y tolerancia a fallos",
      ],
    },
  },
  {
    id: "usjt-seguranca",
    category: "academico",
    issuer: "Universidade São Judas Tadeu",
    name: {
      pt: "Sistemas computacionais e segurança",
      en: "Computing systems and security",
      es: "Sistemas computacionales y seguridad",
    },
    file: "/certificados/usjt-sistemas-e-seguranca.pdf",
    issued: "2023-12",
    hours: 160,
    about: {
      pt: "Unidade curricular com a qualificação profissional em Sistemas Computacionais e Segurança: como o computador funciona por dentro e como proteger o que roda nele.",
      en: "A course unit with a professional qualification in Computer Systems and Security: how a computer works inside and how to protect what runs on it.",
      es: "Unidad curricular con la calificación profesional en Sistemas Computacionales y Seguridad: cómo funciona una computadora por dentro y cómo proteger lo que corre en ella.",
    },
    topics: {
      pt: [
        "Arquitetura de computadores",
        "Sistemas operacionais: processos, memória e arquivos",
        "Fundamentos de segurança da informação",
        "Criptografia, autenticação e controle de acesso",
        "Vulnerabilidades comuns e boas práticas",
      ],
      en: [
        "Computer architecture",
        "Operating systems: processes, memory and files",
        "Information security fundamentals",
        "Cryptography, authentication and access control",
        "Common vulnerabilities and good practice",
      ],
      es: [
        "Arquitectura de computadoras",
        "Sistemas operativos: procesos, memoria y archivos",
        "Fundamentos de seguridad de la información",
        "Criptografía, autenticación y control de acceso",
        "Vulnerabilidades comunes y buenas prácticas",
      ],
    },
  },
  {
    id: "usjt-ambientes-conectividade",
    category: "academico",
    issuer: "Universidade São Judas Tadeu",
    name: {
      pt: "Ambientes computacionais e conectividade",
      en: "Computing environments and connectivity",
      es: "Ambientes computacionales y conectividad",
    },
    file: "/certificados/usjt-ambientes-e-conectividade.pdf",
    issued: "2023-12",
    hours: 160,
    about: {
      pt: "Unidade curricular em parceria com a AWS: redes, sistemas e a nuvem onde as aplicações rodam.",
      en: "A course unit in partnership with AWS: networks, systems and the cloud where applications run.",
      es: "Unidad curricular en alianza con AWS: redes, sistemas y la nube donde corren las aplicaciones.",
    },
    topics: {
      pt: [
        "Redes e protocolos: TCP/IP, HTTP e DNS",
        "Sistemas operacionais e linha de comando Linux",
        "Fundamentos de computação em nuvem na AWS",
        "Virtualização e contêineres",
        "Computação, armazenamento e rede na nuvem",
      ],
      en: [
        "Networks and protocols: TCP/IP, HTTP and DNS",
        "Operating systems and the Linux command line",
        "Cloud computing fundamentals on AWS",
        "Virtualisation and containers",
        "Compute, storage and networking in the cloud",
      ],
      es: [
        "Redes y protocolos: TCP/IP, HTTP y DNS",
        "Sistemas operativos y línea de comandos Linux",
        "Fundamentos de computación en la nube en AWS",
        "Virtualización y contenedores",
        "Cómputo, almacenamiento y red en la nube",
      ],
    },
  },
  {
    id: "usjt-qualidade-software",
    category: "academico",
    issuer: "Universidade São Judas Tadeu",
    name: {
      pt: "Gestão e qualidade de software",
      en: "Software management and quality",
      es: "Gestión y calidad de software",
    },
    file: "/certificados/usjt-qualidade-de-software.pdf",
    issued: "2024-12",
    hours: 160,
    about: {
      pt: "Unidade curricular com a qualificação profissional em Qualidade de Software: como planejar, testar e garantir que o software entrega o que promete.",
      en: "A course unit with a professional qualification in Software Quality: how to plan, test and make sure software delivers what it promises.",
      es: "Unidad curricular con la calificación profesional en Calidad de Software: cómo planificar, probar y garantizar que el software cumple lo que promete.",
    },
    topics: {
      pt: [
        "Testes unitários, de integração e de aceitação",
        "Planejamento e gestão de projetos",
        "Métricas e normas de qualidade",
        "Revisão de código e integração contínua",
        "Gestão de defeitos e melhoria contínua",
      ],
      en: [
        "Unit, integration and acceptance testing",
        "Project planning and management",
        "Quality metrics and standards",
        "Code review and continuous integration",
        "Defect management and continuous improvement",
      ],
      es: [
        "Pruebas unitarias, de integración y de aceptación",
        "Planificación y gestión de proyectos",
        "Métricas y normas de calidad",
        "Revisión de código e integración continua",
        "Gestión de defectos y mejora continua",
      ],
    },
  },
  {
    id: "usjt-usabilidade-web-mobile",
    category: "academico",
    issuer: "Universidade São Judas Tadeu",
    name: {
      pt: "Usabilidade, desenvolvimento web, mobile e jogos",
      en: "Usability, web, mobile and game development",
      es: "Usabilidad, desarrollo web, mobile y juegos",
    },
    file: "/certificados/usjt-usabilidade-web-mobile.pdf",
    issued: "2024-07",
    hours: 160,
    about: {
      pt: "Unidade curricular com a qualificação profissional em Usabilidade, Desenvolvimento Web, Mobile e Jogos: interfaces que as pessoas conseguem usar, na web, no celular e em jogos.",
      en: "A course unit with a professional qualification in Usability, Web, Mobile and Game Development: interfaces people can actually use, on the web, on phones and in games.",
      es: "Unidad curricular con la calificación profesional en Usabilidad, Desarrollo Web, Mobile y Juegos: interfaces que la gente puede usar, en la web, en el celular y en juegos.",
    },
    topics: {
      pt: [
        "Usabilidade, UX e acessibilidade",
        "HTML, CSS e JavaScript",
        "Design responsivo para web e mobile",
        "Protótipos e testes com usuários",
        "Fundamentos de desenvolvimento de jogos",
      ],
      en: [
        "Usability, UX and accessibility",
        "HTML, CSS and JavaScript",
        "Responsive design for web and mobile",
        "Prototypes and user testing",
        "Game development fundamentals",
      ],
      es: [
        "Usabilidad, UX y accesibilidad",
        "HTML, CSS y JavaScript",
        "Diseño responsivo para web y mobile",
        "Prototipos y pruebas con usuarios",
        "Fundamentos de desarrollo de juegos",
      ],
    },
  },
  {
    id: "usjt-inovacao",
    category: "academico",
    issuer: "Universidade São Judas Tadeu",
    name: {
      pt: "Inovação, sustentabilidade e competitividade",
      en: "Innovation, sustainability and competitiveness",
      es: "Innovación, sostenibilidad y competitividad",
    },
    file: "/certificados/usjt-inovacao.pdf",
    issued: "2025-07",
    hours: 160,
    about: {
      pt: "Unidade curricular com a certificação de Agente de Inovação, Sustentabilidade e Competitividade Empresarial: como uma ideia vira um negócio que se sustenta.",
      en: "A course unit with the Innovation, Sustainability and Business Competitiveness Agent certification: how an idea becomes a business that lasts.",
      es: "Unidad curricular con la certificación de Agente de Innovación, Sostenibilidad y Competitividad Empresarial: cómo una idea se convierte en un negocio sostenible.",
    },
    topics: {
      pt: [
        "Design thinking e geração de ideias",
        "Modelo de negócio e proposta de valor",
        "Empreendedorismo e startups",
        "Sustentabilidade e ESG",
        "Estratégia e vantagem competitiva",
      ],
      en: [
        "Design thinking and ideation",
        "Business model and value proposition",
        "Entrepreneurship and startups",
        "Sustainability and ESG",
        "Strategy and competitive advantage",
      ],
      es: [
        "Design thinking y generación de ideas",
        "Modelo de negocio y propuesta de valor",
        "Emprendimiento y startups",
        "Sostenibilidad y ESG",
        "Estrategia y ventaja competitiva",
      ],
    },
  },
]

export const certifications: Certification[] = parseCollection(
  certificationSchema,
  { items: raw, source: "src/data/certifications.ts" },
)

export const certificationsByCategory = {} as Record<
  Certification["category"],
  Certification[]
>
for (const item of certifications) {
  ;(certificationsByCategory[item.category] ??= []).push(item)
}
