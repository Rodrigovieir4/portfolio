/**
 * Junta classes condicionais e resolve conflito do Tailwind.
 *
 * Reexporta o pacote `cn`, que é o mesmo que os componentes gerados pelo
 * shadcn/ui importam. Manter uma implementação só evita o caso em que o botão
 * do design system e o botão gerado resolvem "px-4 px-8" de formas diferentes.
 *
 * Sem o merge, "px-4" somado a "px-8" deixaria as duas classes no atributo e o
 * resultado dependeria da ordem no CSS gerado. Com ele, a última vence, que é
 * o que qualquer pessoa espera ao sobrescrever o estilo de um componente.
 */
export { cn } from 'cn';
export type { ClassValue } from 'cn';
