import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

/**
 * Link, redirect e hooks de rota com idioma embutido.
 *
 * Importe daqui em vez de next/link: estes ja prefixam o idioma atual e
 * traduzem o caminho, entao um <Link href="/projetos"> vira /en/projects
 * automaticamente quando o visitante esta em ingles.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
