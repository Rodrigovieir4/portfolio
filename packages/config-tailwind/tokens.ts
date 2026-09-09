/**
 * Espelho tipado dos tokens de theme.css.
 *
 * Existe porque WebGL nao le CSS: three.js precisa de numero hexadecimal e de
 * vetores normalizados. Manter os dois lados sincronizados aqui evita que a
 * cena 3D e a interface saiam de sintonia.
 */

export const palette = {
  void: '#050609',
  abyss: '#090b10',
  surface: '#10131a',
  elevated: '#171b24',
  line: '#232936',
  ink: '#eef1f6',
  muted: '#7d8698',
  signal: '#c8f751',
  signalGlow: '#dcff7a',
  plasma: '#7b5cff',
  ember: '#ff6b3d',
  cyan: '#4ee0d0',
} as const;

export type PaletteKey = keyof typeof palette;

/** Converte "#c8f751" em 0xc8f751, formato que three.js espera. */
export function hex(key: PaletteKey): number {
  return Number.parseInt(palette[key].slice(1), 16);
}

/** Converte um token em [r, g, b] no intervalo 0..1, para uniforms de shader. */
export function rgb(key: PaletteKey): [number, number, number] {
  const value = hex(key);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

export const easing = {
  outExpo: [0.16, 1, 0.3, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
  spring: [0.34, 1.56, 0.64, 1],
} as const;

export const duration = {
  instant: 0.12,
  fast: 0.24,
  base: 0.42,
  slow: 0.72,
  cinematic: 1.2,
} as const;
