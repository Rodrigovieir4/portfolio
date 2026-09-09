import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Junta classes condicionais e resolve conflito do Tailwind.
 *
 * Sem o twMerge, "px-4" somado a "px-8" deixaria as duas no atributo e o
 * resultado dependeria da ordem no CSS gerado. Com ele, a ultima vence, que e
 * o que qualquer pessoa espera ao sobrescrever o estilo de um componente.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
