/**
 * Geradores das formas que a nuvem de particulas assume.
 *
 * Cada gerador devolve um Float32Array com tres floats por particula. A
 * contagem e sempre a mesma entre formas, porque o shader interpola a particula
 * de indice i de uma forma para a particula de indice i da outra. Se as
 * contagens divergissem, o morph embaralharia.
 */

/**
 * Esfera de Fibonacci.
 *
 * Distribuir pontos por latitude e longitude aleatorias empilha tudo nos polos.
 * A espiral de Fibonacci resolve isso: usa o angulo aureo para que cada ponto
 * caia no maior vazio deixado pelos anteriores, gerando cobertura uniforme.
 */
export function fibonacciSphere(count: number, radius = 1): Float32Array {
  const positions = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;

    positions[i * 3] = Math.cos(theta) * ringRadius * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * ringRadius * radius;
  }

  return positions;
}

/**
 * No toroidal (p, q). Uma curva fechada que da p voltas no eixo do toro
 * enquanto da q voltas em torno do tubo, com as particulas espalhadas na
 * secao circular para dar espessura ao fio.
 */
export function torusKnot(count: number, radius = 1, tube = 0.32, p = 2, q = 3): Float32Array {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const t = (i / count) * Math.PI * 2 * p;
    const phi = (i / count) * Math.PI * 2 * q;
    const spread = Math.random() * tube;
    const angle = Math.random() * Math.PI * 2;

    const r = radius * (2 + Math.cos(q * (t / p)));
    positions[i * 3] = (r * Math.cos(t)) / 3 + Math.cos(angle) * spread;
    positions[i * 3 + 1] = (r * Math.sin(t)) / 3 + Math.sin(angle) * spread;
    positions[i * 3 + 2] = (radius * Math.sin(q * (t / p))) / 1.5 + Math.cos(phi) * spread * 0.5;
  }

  return positions;
}

/**
 * Dupla helice. Referencia ao codigo como estrutura que se replica, e visualmente
 * legivel mesmo em movimento porque o olho segue as duas fitas.
 */
export function doubleHelix(count: number, radius = 0.85, height = 3.4, turns = 3): Float32Array {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const progress = i / count;
    const strand = i % 2 === 0 ? 0 : Math.PI;
    const angle = progress * Math.PI * 2 * turns + strand;
    // Um pouco de ruido radial evita que as fitas virem duas linhas perfeitas.
    const jitter = (Math.random() - 0.5) * 0.18;

    positions[i * 3] = Math.cos(angle) * (radius + jitter);
    positions[i * 3 + 1] = (progress - 0.5) * height;
    positions[i * 3 + 2] = Math.sin(angle) * (radius + jitter);
  }

  return positions;
}

/** Semente e escala por particula, para dessincronizar animacao e tamanho. */
export function particleAttributes(count: number): {
  seeds: Float32Array;
  scales: Float32Array;
} {
  const seeds = new Float32Array(count);
  const scales = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    seeds[i] = Math.random();
    // Distribuicao enviesada para baixo: muitas particulas pequenas e poucas
    // grandes, que e o que cria hierarquia visual em vez de ruido uniforme.
    scales[i] = 0.35 + Math.pow(Math.random(), 2.4) * 1.65;
  }

  return { seeds, scales };
}

export const SHAPES = ['sphere', 'knot', 'helix'] as const;
export type ShapeName = (typeof SHAPES)[number];

export function buildShape(name: ShapeName, count: number): Float32Array {
  switch (name) {
    case 'knot':
      return torusKnot(count);
    case 'helix':
      return doubleHelix(count);
    case 'sphere':
    default:
      return fibonacciSphere(count, 1.45);
  }
}
