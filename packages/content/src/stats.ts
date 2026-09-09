import { certifications } from './data/certifications';
import { experiences } from './data/experience';
import { projects } from './data/projects';
import { allSkills } from './data/skills';
import type { Localized } from './locale';

/**
 * Números exibidos no contador animado da home.
 *
 * São derivados do conteúdo, nunca digitados à mão: publicar um projeto novo
 * atualiza o contador sozinho, sem ninguém lembrar de mexer aqui.
 */

function yearsSince(isoYearMonth: string): number {
  const [year, month] = isoYearMonth.split('-').map(Number);
  if (!year || !month) return 0;
  const start = new Date(year, month - 1);
  const elapsed = Date.now() - start.getTime();
  return Math.max(0, Math.floor(elapsed / (365.25 * 24 * 60 * 60 * 1000)));
}

const codingStart =
  experiences
    .filter((item) => item.kind === 'project' || item.kind === 'education')
    .map((item) => item.start)
    .sort()[0] ?? '2025-01';

export interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: Localized;
}

export const stats: Stat[] = [
  {
    id: 'projetos',
    value: projects.length,
    suffix: '',
    label: { pt: 'Projetos publicados', en: 'Published projects', es: 'Proyectos publicados' },
  },
  {
    id: 'tecnologias',
    value: allSkills.length,
    suffix: '',
    label: {
      pt: 'Tecnologias no radar',
      en: 'Technologies in play',
      es: 'Tecnologias en el radar',
    },
  },
  {
    id: 'certificados',
    value: certifications.length,
    suffix: '',
    label: { pt: 'Certificados', en: 'Certificates', es: 'Certificados' },
  },
  {
    id: 'anos',
    value: Math.max(1, yearsSince(codingStart)),
    suffix: '+',
    label: {
      pt: 'Anos escrevendo código',
      en: 'Years writing code',
      es: 'Años escribiendo código',
    },
  },
];
