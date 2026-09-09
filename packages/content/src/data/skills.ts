import { parseCollection, skillGroupSchema, type SkillGroup } from '../schema';

/**
 * Stack técnica agrupada por camada.
 *
 * O campo `level` vai de 1 a 5 e alimenta a barra de proficiência:
 *   1 estudando | 2 básico | 3 produtivo | 4 sólido | 5 referência
 *
 * A régua aqui é uso em produção, não tutorial assistido. Nível 4 significa
 * que já resolvi problema difícil com a ferramenta em produto de cliente;
 * nível 3 significa que entrego com ela sem travar.
 */
const raw = [
  {
    id: 'backend',
    label: { pt: 'Backend', en: 'Backend', es: 'Backend' },
    accent: 'signal',
    skills: [
      { name: 'TypeScript', level: 5, icon: 'typescript', since: '2025' },
      { name: 'NestJS', level: 4, icon: 'nestjs', since: '2026' },
      { name: 'Node.js', level: 4, icon: 'nodedotjs', since: '2025' },
      { name: 'TypeORM', level: 4, icon: 'typeorm', since: '2026' },
      { name: 'REST e OpenAPI', level: 4, icon: 'openapiinitiative' },
      { name: 'Java', level: 3, icon: 'openjdk', since: '2023' },
      { name: 'Spring Boot', level: 3, icon: 'springboot' },
      { name: 'Python', level: 3, icon: 'python', since: '2023' },
    ],
  },
  {
    id: 'frontend',
    label: {
      pt: 'Frontend e mobile',
      en: 'Frontend & mobile',
      es: 'Frontend y mobile',
    },
    accent: 'plasma',
    skills: [
      { name: 'React', level: 5, icon: 'react', since: '2025' },
      { name: 'Next.js', level: 5, icon: 'nextdotjs', since: '2025' },
      { name: 'Tailwind CSS', level: 4, icon: 'tailwindcss' },
      { name: 'React Native e Expo', level: 4, icon: 'expo', since: '2025' },
      { name: 'shadcn/ui e Radix', level: 4, icon: 'shadcnui' },
      { name: 'Flutter', level: 3, icon: 'flutter', since: '2026' },
      { name: 'Three.js e R3F', level: 3, icon: 'threedotjs' },
    ],
  },
  {
    id: 'dados',
    label: {
      pt: 'Dados e persistência',
      en: 'Data & persistence',
      es: 'Datos y persistencia',
    },
    accent: 'cyan',
    skills: [
      { name: 'PostgreSQL', level: 4, icon: 'postgresql', since: '2025' },
      { name: 'Supabase', level: 5, icon: 'supabase', since: '2025' },
      { name: 'Row Level Security', level: 4, icon: 'postgresql' },
      { name: 'Funções e RPC no banco', level: 4, icon: 'postgresql' },
      { name: 'MySQL', level: 3, icon: 'mysql' },
      { name: 'MongoDB', level: 3, icon: 'mongodb' },
    ],
  },
  {
    id: 'infra',
    label: {
      pt: 'Cloud e entrega',
      en: 'Cloud & delivery',
      es: 'Cloud y entrega',
    },
    accent: 'ember',
    skills: [
      { name: 'AWS', level: 4, icon: 'amazonwebservices', since: '2026' },
      { name: 'Docker', level: 4, icon: 'docker', since: '2025' },
      { name: 'GitHub Actions', level: 4, icon: 'githubactions' },
      { name: 'Vercel', level: 4, icon: 'vercel' },
      { name: 'Turborepo e pnpm', level: 4, icon: 'turborepo' },
      { name: 'Cloudflare Workers', level: 3, icon: 'cloudflareworkers' },
      { name: 'Git e GitHub', level: 5, icon: 'git', since: '2023' },
    ],
  },
  {
    id: 'pagamentos',
    label: {
      pt: 'Pagamentos e segurança',
      en: 'Payments & security',
      es: 'Pagos y seguridad',
    },
    accent: 'signal',
    skills: [
      { name: 'Pix e gateway EFI', level: 4, icon: 'pix', since: '2026' },
      { name: 'Stripe e Stripe Connect', level: 4, icon: 'stripe', since: '2026' },
      { name: 'Webhooks idempotentes', level: 4 },
      { name: 'Controle de acesso por papel', level: 4 },
      { name: 'JWT e sessão', level: 4, icon: 'jsonwebtokens' },
    ],
  },
  {
    id: 'processo',
    label: {
      pt: 'Testes e processo',
      en: 'Testing & process',
      es: 'Pruebas y proceso',
    },
    accent: 'cyan',
    skills: [
      { name: 'Vitest', level: 4, icon: 'vitest' },
      { name: 'Jest', level: 4, icon: 'jest' },
      { name: 'Playwright', level: 3, icon: 'playwright' },
      { name: 'Revisão de código', level: 4 },
      { name: 'Scrum e Kanban', level: 4 },
    ],
  },
];

export const skillGroups: SkillGroup[] = parseCollection(
  skillGroupSchema,
  raw,
  'src/data/skills.ts',
);

/** Lista achatada, usada pelo filtro de projetos e pela faixa de tecnologias. */
export const allSkills = skillGroups.flatMap((group) =>
  group.skills.map((skill) => ({ ...skill, group: group.id, accent: group.accent })),
);
