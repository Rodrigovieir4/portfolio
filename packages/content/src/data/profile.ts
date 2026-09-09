import { profileSchema, type Profile } from '../schema';

/**
 * Identidade e contato.
 *
 * Este é o único arquivo que praticamente nunca muda. Tudo que aparece no topo
 * do site — nome, frase de efeito, bio e redes — sai daqui.
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
      'Comecei no gramado e nos servidores de jogo competitivo. Foram anos aprendendo que resultado não nasce de talento solto: nasce de repetição, leitura de jogo e ajuste fino sob pressão.',
      'Hoje aplico exatamente isso construindo software. Trabalho com Java e Spring Boot no backend, React no frontend, e Docker e AWS na hora de entregar.',
      'Estudo Análise e Desenvolvimento de Sistemas na Universidade São Judas Tadeu e trato cada projeto como temporada: métrica clara, ciclo curto e evolução que dá para medir.',
    ],
    en: [
      'I started on the pitch and on competitive gaming servers. Those years taught me that results never come from raw talent alone. They come from repetition, reading the game, and fine-tuning under pressure.',
      'I apply exactly that to building software today. I work with Java and Spring Boot on the backend, React on the frontend, and Docker and AWS when it is time to ship.',
      'I study Systems Analysis and Development at Universidade São Judas Tadeu, and I treat every project like a season: clear metrics, short cycles, and progress you can actually measure.',
    ],
    es: [
      'Empecé en la cancha y en los servidores de juego competitivo. Fueron años aprendiendo que el resultado no nace del talento suelto: nace de la repetición, la lectura de juego y el ajuste fino bajo presión.',
      'Hoy aplico exactamente eso construyendo software. Trabajo con Java y Spring Boot en el backend, React en el frontend, y Docker y AWS a la hora de entregar.',
      'Estudio Análisis y Desarrollo de Sistemas en la Universidade São Judas Tadeu y trato cada proyecto como una temporada: métrica clara, ciclo corto y evolución medible.',
    ],
  },

  location: {
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    timezone: 'America/Sao_Paulo',
  },

  email: 'contato.rodrigovsousa@gmail.com',
  phone: '+5511970421998',
  avatar: '/images/rodrigo.png',

  // Por enquanto só existe o currículo em português, então os três idiomas
  // apontam para ele. Assim ninguém cai num link quebrado. Ao gerar as versões
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
