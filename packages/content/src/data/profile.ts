import { profileSchema, type Profile } from '../schema';

/**
 * Identidade e contato.
 *
 * Este e o unico arquivo que praticamente nunca muda. Tudo que e visivel no
 * topo do site — nome, frase de efeito, bio e redes — sai daqui.
 */
const raw = {
  name: 'Rodrigo Vieira de Sousa',
  shortName: 'Rodrigo Sousa',

  headline: {
    pt: 'Desenvolvedor Full-Stack',
    en: 'Full-Stack Developer',
    es: 'Desarrollador Full-Stack',
  },

  tagline: {
    pt: 'Disciplina de atleta, mentalidade de engenheiro.',
    en: "An athlete's discipline, an engineer's mindset.",
    es: 'Disciplina de atleta, mentalidad de ingeniero.',
  },

  bio: {
    pt: [
      'Comecei no gramado e nos servidores de jogo competitivo. Foram anos aprendendo que resultado nao nasce de talento solto: nasce de repeticao, leitura de jogo e ajuste fino sob pressao.',
      'Hoje aplico exatamente isso construindo software. Trabalho com Java e Spring Boot no backend, React no frontend, e Docker e AWS na hora de entregar.',
      'Estudo Analise e Desenvolvimento de Sistemas na Universidade Sao Judas Tadeu e trato cada projeto como temporada: metrica clara, ciclo curto e evolucao que da para medir.',
    ],
    en: [
      'I started on the pitch and on competitive gaming servers. Those years taught me that results never come from raw talent alone. They come from repetition, reading the game, and fine-tuning under pressure.',
      'I apply exactly that to building software today. I work with Java and Spring Boot on the backend, React on the frontend, and Docker and AWS when it is time to ship.',
      'I study Systems Analysis and Development at Universidade Sao Judas Tadeu, and I treat every project like a season: clear metrics, short cycles, and progress you can actually measure.',
    ],
    es: [
      'Empece en la cancha y en los servidores de juego competitivo. Fueron anos aprendiendo que el resultado no nace del talento suelto: nace de la repeticion, la lectura de juego y el ajuste fino bajo presion.',
      'Hoy aplico exactamente eso construyendo software. Trabajo con Java y Spring Boot en el backend, React en el frontend, y Docker y AWS a la hora de entregar.',
      'Estudio Analisis y Desarrollo de Sistemas en la Universidade Sao Judas Tadeu y trato cada proyecto como una temporada: metrica clara, ciclo corto y evolucion medible.',
    ],
  },

  location: {
    city: 'Sao Paulo',
    state: 'SP',
    country: 'Brasil',
    timezone: 'America/Sao_Paulo',
  },

  email: 'contato.rodrigovsousa@gmail.com',
  phone: '+5511970421998',
  avatar: '/images/rodrigo.png',

  // Por enquanto so existe o curriculo em portugues, entao os tres idiomas
  // apontam para ele. Assim ninguem cai num link quebrado. Ao gerar as versoes
  // traduzidas, coloque os PDFs em apps/web/public/curriculo com os nomes
  // -en.pdf e -es.pdf e troque os caminhos abaixo.
  resumeUrl: {
    pt: '/curriculo/rodrigo-vieira-de-sousa-pt.pdf',
    en: '/curriculo/rodrigo-vieira-de-sousa-pt.pdf',
    es: '/curriculo/rodrigo-vieira-de-sousa-pt.pdf',
  },

  availability: {
    open: true,
    label: {
      pt: 'Aberto a oportunidades',
      en: 'Open to opportunities',
      es: 'Abierto a oportunidades',
    },
  },

  socials: [
    {
      platform: 'github',
      label: 'GitHub',
      url: 'https://github.com/Rodrigovieir4',
      handle: '@Rodrigovieir4',
      primary: true,
    },
    {
      platform: 'linkedin',
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/rodrigovieir4',
      handle: 'in/rodrigovieir4',
      primary: true,
    },
    {
      platform: 'email',
      label: 'E-mail',
      url: 'mailto:contato.rodrigovsousa@gmail.com',
      handle: 'contato.rodrigovsousa@gmail.com',
      primary: true,
    },
    {
      platform: 'whatsapp',
      label: 'WhatsApp',
      url: 'https://wa.me/5511970421998',
      handle: '+55 11 97042-1998',
      primary: false,
    },
  ],
};

export const profile: Profile = profileSchema.parse(raw);
