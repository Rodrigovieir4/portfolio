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

/** A data mais antiga entre formação e projeto marca o início da estrada. */
const codingStart =
  experiences
    .filter((item) => item.kind === 'project' || item.kind === 'education')
    .map((item) => item.start)
    .sort()[0] ?? '2023-02';

const liveClientProducts = projects.filter(
  (project) =>
    project.status === 'live' &&
    (project.engagement === 'dbc' || project.engagement === 'freelance'),
);

export interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: Localized;
}

export const stats: Stat[] = [
  {
    id: 'producao',
    value: liveClientProducts.length,
    suffix: '',
    label: {
      pt: 'Produtos em produção',
      en: 'Products in production',
      es: 'Productos en producción',
    },
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
  {
    id: 'tecnologias',
    value: allSkills.length,
    suffix: '',
    label: {
      pt: 'Tecnologias em uso',
      en: 'Technologies in use',
      es: 'Tecnologías en uso',
    },
  },
  {
    id: 'certificados',
    value: certifications.length,
    suffix: '',
    label: { pt: 'Certificados', en: 'Certificates', es: 'Certificados' },
  },
];
