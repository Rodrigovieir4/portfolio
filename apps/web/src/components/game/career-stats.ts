import { projects, stats } from '@portfolio/content';

/**
 * Números de carreira do placar, somados a partir das métricas dos projetos.
 *
 * Nada aqui é digitado à mão. Somar pelo rótulo da métrica garante que, ao
 * recontar testes num projeto e atualizar o arquivo de dados, o placar do
 * jogo muda junto com o site.
 */
function sumMetric(labelPt: string): number {
  return projects
    .flatMap((project) => project.metrics)
    .filter((metric) => metric.label.pt === labelPt)
    .reduce((total, metric) => total + Number(metric.value.replace(/\./g, '')), 0);
}

export const careerStats = {
  live: stats.find((stat) => stat.id === 'producao')?.value ?? 0,
  endpoints: sumMetric('Endpoints REST'),
  tests: sumMetric('Casos de teste'),
  migrations: sumMetric('Migrations de banco'),
};

/** 102 segundos viram "1:42". */
export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = String(total % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}
