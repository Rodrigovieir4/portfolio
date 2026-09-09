/**
 * Ponte para o `cn` do design system.
 *
 * O gerador do shadcn/ui espera encontrar `cn` em @/lib/utils. Em vez de
 * duplicar a função, este arquivo reexporta a que já vive em @portfolio/ui,
 * para os componentes gerados e os nossos resolverem conflito de classe do
 * Tailwind exatamente da mesma forma.
 */
export { cn } from '@portfolio/ui';
