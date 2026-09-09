import { certificationSchema, parseCollection, type Certification } from '../schema';

/**
 * Certificados.
 *
 * O campo `file` aponta para um PDF em apps/web/public/certificados. O site
 * abre o arquivo em nova aba; se `file` ficar vazio, o card aparece sem link
 * em vez de quebrar.
 *
 * Os PDFs originais estão no repositório antigo, em portfolio/assets/certificados.
 * O comando `pnpm assets:importar` baixa todos de uma vez, já renomeados.
 */
const raw = [
  {
    id: 'wizard-ingles',
    category: 'idioma',
    issuer: 'Wizard',
    name: {
      pt: 'Proficiência em Inglês',
      en: 'English Proficiency',
      es: 'Competencia en Inglés',
    },
    file: '/certificados/wizard-ingles.pdf',
  },
  {
    id: 'rocketseat-python',
    category: 'curso',
    issuer: 'Rocketseat',
    name: {
      pt: 'Introdução ao Python',
      en: 'Introduction to Python',
      es: 'Introducción a Python',
    },
    file: '/certificados/rocketseat-python.pdf',
  },
  {
    id: 'rocketseat-java',
    category: 'curso',
    issuer: 'Rocketseat',
    name: {
      pt: 'Minicurso de Java',
      en: 'Java Short Course',
      es: 'Minicurso de Java',
    },
    file: '/certificados/rocketseat-java.pdf',
  },

  // --- Unidades curriculares da Universidade São Judas Tadeu ---
  {
    id: 'usjt-modelagem-software',
    category: 'academico',
    issuer: 'Universidade São Judas Tadeu',
    name: {
      pt: 'Modelagem de software',
      en: 'Software modelling',
      es: 'Modelado de software',
    },
    file: '/certificados/usjt-modelagem-de-software.pdf',
  },
  {
    id: 'usjt-engenharia-software',
    category: 'academico',
    issuer: 'Universidade São Judas Tadeu',
    name: {
      pt: 'Modelos, métodos e técnicas da engenharia de software',
      en: 'Software engineering models, methods and techniques',
      es: 'Modelos, métodos y técnicas de la ingeniería de software',
    },
    file: '/certificados/usjt-engenharia-de-software.pdf',
  },
  {
    id: 'usjt-programacao-solucoes',
    category: 'academico',
    issuer: 'Universidade São Judas Tadeu',
    name: {
      pt: 'Programação de soluções computacionais',
      en: 'Programming computational solutions',
      es: 'Programación de soluciones computacionales',
    },
    file: '/certificados/usjt-programacao-de-solucoes.pdf',
  },
  {
    id: 'usjt-sistemas-distribuidos',
    category: 'academico',
    issuer: 'Universidade São Judas Tadeu',
    name: {
      pt: 'Sistemas distribuídos e mobile',
      en: 'Distributed and mobile systems',
      es: 'Sistemas distribuidos y mobile',
    },
    file: '/certificados/usjt-sistemas-distribuidos.pdf',
  },
  {
    id: 'usjt-seguranca',
    category: 'academico',
    issuer: 'Universidade São Judas Tadeu',
    name: {
      pt: 'Sistemas computacionais e segurança',
      en: 'Computing systems and security',
      es: 'Sistemas computacionales y seguridad',
    },
    file: '/certificados/usjt-sistemas-e-seguranca.pdf',
  },
  {
    id: 'usjt-ambientes-conectividade',
    category: 'academico',
    issuer: 'Universidade São Judas Tadeu',
    name: {
      pt: 'Ambientes computacionais e conectividade',
      en: 'Computing environments and connectivity',
      es: 'Ambientes computacionales y conectividad',
    },
    file: '/certificados/usjt-ambientes-e-conectividade.pdf',
  },
  {
    id: 'usjt-qualidade-software',
    category: 'academico',
    issuer: 'Universidade São Judas Tadeu',
    name: {
      pt: 'Gestão e qualidade de software',
      en: 'Software management and quality',
      es: 'Gestión y calidad de software',
    },
    file: '/certificados/usjt-qualidade-de-software.pdf',
  },
  {
    id: 'usjt-usabilidade-web-mobile',
    category: 'academico',
    issuer: 'Universidade São Judas Tadeu',
    name: {
      pt: 'Usabilidade, desenvolvimento web, mobile e jogos',
      en: 'Usability, web, mobile and game development',
      es: 'Usabilidad, desarrollo web, mobile y juegos',
    },
    file: '/certificados/usjt-usabilidade-web-mobile.pdf',
  },
  {
    id: 'usjt-inovacao',
    category: 'academico',
    issuer: 'Universidade São Judas Tadeu',
    name: {
      pt: 'Inovação, sustentabilidade e competitividade',
      en: 'Innovation, sustainability and competitiveness',
      es: 'Innovación, sostenibilidad y competitividad',
    },
    file: '/certificados/usjt-inovacao.pdf',
  },
];

export const certifications: Certification[] = parseCollection(
  certificationSchema,
  raw,
  'src/data/certifications.ts',
);

export const certificationsByCategory = certifications.reduce<
  Record<Certification['category'], Certification[]>
>(
  (accumulator, item) => {
    (accumulator[item.category] ??= []).push(item);
    return accumulator;
  },
  {} as Record<Certification['category'], Certification[]>,
);
