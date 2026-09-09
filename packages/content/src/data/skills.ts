import { parseCollection, skillGroupSchema, type SkillGroup } from '../schema';

/**
 * Stack técnica agrupada por camada.
 *
 * O campo `level` vai de 1 a 5 e alimenta tanto a barra de proficiência quanto
 * o brilho de cada card: quanto maior o nível, mais forte o acento de cor.
 *
 *   1 estudando | 2 básico | 3 produtivo | 4 sólido | 5 referência
 */
const raw = [
  {
    id: 'backend',
    label: { pt: 'Backend', en: 'Backend', es: 'Backend' },
    accent: 'signal',
    skills: [
      { name: 'Java', level: 4, icon: 'java' },
      { name: 'Spring Boot', level: 4, icon: 'spring' },
      { name: 'Python', level: 3, icon: 'python' },
      { name: 'Flask', level: 3, icon: 'flask' },
      { name: 'Node.js', level: 3, icon: 'nodedotjs' },
      { name: 'Maven', level: 3, icon: 'apachemaven' },
    ],
  },
  {
    id: 'frontend',
    label: { pt: 'Frontend', en: 'Frontend', es: 'Frontend' },
    accent: 'plasma',
    skills: [
      { name: 'JavaScript', level: 4, icon: 'javascript' },
      { name: 'React', level: 3, icon: 'react' },
      { name: 'HTML5', level: 4, icon: 'html5' },
      { name: 'CSS3', level: 4, icon: 'css' },
      { name: 'Tailwind CSS', level: 3, icon: 'tailwindcss' },
      { name: 'Bootstrap', level: 3, icon: 'bootstrap' },
    ],
  },
  {
    id: 'dados',
    label: { pt: 'Dados', en: 'Data', es: 'Datos' },
    accent: 'cyan',
    skills: [
      { name: 'MySQL', level: 3, icon: 'mysql' },
      { name: 'MongoDB', level: 3, icon: 'mongodb' },
    ],
  },
  {
    id: 'infra',
    label: {
      pt: 'Infra e entrega',
      en: 'Infra & delivery',
      es: 'Infra y entrega',
    },
    accent: 'ember',
    skills: [
      { name: 'Docker', level: 3, icon: 'docker' },
      { name: 'AWS', level: 2, icon: 'amazonwebservices' },
      { name: 'Git', level: 4, icon: 'git' },
      { name: 'GitHub', level: 4, icon: 'github' },
    ],
  },
  {
    id: 'processo',
    label: {
      pt: 'Processo',
      en: 'Process',
      es: 'Proceso',
    },
    accent: 'signal',
    skills: [
      { name: 'Scrum', level: 3 },
      { name: 'Kanban', level: 3 },
    ],
  },
];

export const skillGroups: SkillGroup[] = parseCollection(
  skillGroupSchema,
  raw,
  'src/data/skills.ts',
);

/** Lista achatada, usada pela constelacao WebGL e pelo filtro de projetos. */
export const allSkills = skillGroups.flatMap((group) =>
  group.skills.map((skill) => ({ ...skill, group: group.id, accent: group.accent })),
);
