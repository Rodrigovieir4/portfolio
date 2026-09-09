import { profileSchema, type Profile } from '../schema';

/**
 * Identidade e contato.
 *
 * Este é o arquivo que quase nunca muda. Tudo que aparece no topo do site —
 * nome, frase de efeito, bio e redes — sai daqui.
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
    pt: 'Construo e opero produtos no ar no Brasil, em Portugal e na Irlanda.',
    en: 'I build and operate live products in Brazil, Portugal and Ireland.',
    es: 'Construyo y opero productos en producción en Brasil, Portugal e Irlanda.',
  },

  bio: {
    pt: [
      'Trabalho em produtos que já estão no ar, com usuário e dinheiro de verdade do outro lado. Um marketplace atendendo Portugal e Irlanda, uma plataforma transacional no Brasil, um SaaS de estudo. O trabalho vai de levantar requisito até subir a infraestrutura de novo na noite em que o deploy trava.',
      'Meu terreno é TypeScript: NestJS e Next.js na frente, PostgreSQL atrás e AWS embaixo. Gosto da parte que ninguém vê, que é justamente a que quebra caro: idempotência de pagamento, regra de acesso dentro do banco, migration que não pode falhar no meio.',
      'Antes disso foram seis anos de alto rendimento, no futebol e no Counter-Strike. Competir ensina uma coisa que serve direto para software: constância vence talento solto, e você melhora medindo, não achando.',
    ],
    en: [
      'I work on products that are already live, with real users and real money on the other side. A marketplace serving Portugal and Ireland, a transactional platform in Brazil, a study SaaS. The job runs from gathering requirements to bringing the infrastructure back up on the night a deploy gets stuck.',
      'My ground is TypeScript: NestJS and Next.js up front, PostgreSQL behind, AWS underneath. I like the part nobody sees, which is exactly the part that breaks expensively: payment idempotency, access rules inside the database, migrations that cannot fail halfway.',
      'Before that came six years of high-performance sport, in football and in Counter-Strike. Competing teaches something that transfers straight to software: consistency beats raw talent, and you improve by measuring, not by guessing.',
    ],
    es: [
      'Trabajo en productos que ya están en producción, con usuarios y dinero real del otro lado. Un marketplace atendiendo a Portugal e Irlanda, una plataforma transaccional en Brasil, un SaaS de estudio. El trabajo va desde levantar requisitos hasta levantar la infraestructura de nuevo la noche en que el deploy se traba.',
      'Mi terreno es TypeScript: NestJS y Next.js al frente, PostgreSQL detrás y AWS debajo. Me gusta la parte que nadie ve, que es justamente la que se rompe caro: idempotencia de pago, reglas de acceso dentro de la base de datos, migrations que no pueden fallar a medio camino.',
      'Antes de eso fueron seis años de alto rendimiento, en fútbol y en Counter-Strike. Competir enseña algo que sirve directo para el software: la constancia vence al talento suelto, y se mejora midiendo, no suponiendo.',
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
