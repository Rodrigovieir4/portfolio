/**
 * Ponto único de entrada do conteúdo.
 *
 * O app Next importa somente daqui. Assim, mudar o formato interno de um
 * arquivo de dados não vaza para dentro dos componentes.
 */

export * from './locale';
export * from './schema';

export { profile } from './data/profile';
export { skillGroups, allSkills } from './data/skills';
export { projects, featuredProjects, projectBySlug } from './data/projects';
export { experiences, workExperiences } from './data/experience';
export { certifications, certificationsByCategory } from './data/certifications';
export { languages } from './data/languages';

export { stats } from './stats';
