import { curlNoise, simplexNoise3D } from './noise';

/**
 * Shader do campo de particulas do hero.
 *
 * Ideia: cada particula guarda duas posicoes, uma em cada forma geometrica, e
 * o uniform uMorph decide onde ela esta entre as duas. Rolar a pagina move o
 * uMorph, entao a nuvem literalmente se remonta em outra forma enquanto o
 * visitante desce o site. Por cima disso, um campo de curl noise mantem tudo
 * respirando, e o ponteiro do mouse abre um vazio ao redor do cursor.
 *
 * Tudo roda na GPU, por vertice. A CPU so envia uniforms, nunca mexe no buffer
 * de posicoes, que e o que permite manter dezenas de milhares de particulas a
 * 60 quadros por segundo.
 */

export const particleFieldVertex = /* glsl */ `
${simplexNoise3D}
${curlNoise}

uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
uniform float uMorph;
uniform float uDispersion;
uniform float uNoiseScale;
uniform float uNoiseSpeed;
uniform vec3  uPointer;
uniform float uPointerRadius;
uniform float uPointerStrength;

attribute vec3  aTarget;
attribute float aSeed;
attribute float aScale;

varying float vIntensity;
varying float vSeed;

void main() {
  // Interpolacao suave entre as duas formas. O smoothstep tira a linearidade,
  // que na pratica e a diferenca entre "deslizou" e "transformou".
  float morph = smoothstep(0.0, 1.0, uMorph);

  // Deslocar a fase por particula evita que a nuvem inteira mude de forma no
  // mesmo instante. Cada uma chega no seu tempo, e a transicao ganha volume.
  float stagger = clamp(morph * 1.35 - aSeed * 0.35, 0.0, 1.0);
  vec3 basePosition = mix(position, aTarget, stagger);

  // Campo de fluxo. A semente entra na coordenada para que particulas vizinhas
  // nao sigam exatamente a mesma linha de corrente.
  vec3 noiseInput = basePosition * uNoiseScale + vec3(uTime * uNoiseSpeed, aSeed * 4.0, 0.0);
  vec3 flow = curlNoise(noiseInput);
  vec3 displaced = basePosition + flow * uDispersion * (0.55 + aScale * 0.45);

  // Repulsao do ponteiro: o cursor empurra as particulas para fora, com queda
  // suave ate o raio de influencia.
  vec3 fromPointer = displaced - uPointer;
  float distanceToPointer = length(fromPointer);
  float influence = smoothstep(uPointerRadius, 0.0, distanceToPointer);
  displaced += normalize(fromPointer + 1e-5) * influence * uPointerStrength;

  vec4 modelPosition = modelMatrix * vec4(displaced, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projected = projectionMatrix * viewPosition;

  gl_Position = projected;

  // Perspectiva no tamanho do ponto: o que esta longe encolhe, como deveria.
  float perspective = uSize * aScale * uPixelRatio * (1.0 / -viewPosition.z);
  gl_PointSize = clamp(perspective, 0.6, 14.0);

  // Intensidade combina energia do fluxo com a proximidade do cursor, e e o
  // que o fragmento usa para escolher a cor.
  vIntensity = clamp(length(flow) * 0.42 + influence * 0.9, 0.0, 1.0);
  vSeed = aSeed;
}
`;

export const particleFieldFragment = /* glsl */ `
precision highp float;

uniform vec3  uColorCore;
uniform vec3  uColorEdge;
uniform vec3  uColorHot;
uniform float uOpacity;
uniform float uTime;

varying float vIntensity;
varying float vSeed;

void main() {
  // gl_PointCoord vai de 0 a 1 dentro do quadrado do ponto. Medindo a partir do
  // centro e descartando o que passa do raio, o quadrado vira circulo.
  vec2 centered = gl_PointCoord - vec2(0.5);
  float radius = length(centered);
  if (radius > 0.5) discard;

  // Queda quadratica no lugar de borda dura: o ponto vira brilho, nao disco.
  float falloff = 1.0 - smoothstep(0.0, 0.5, radius);
  falloff = pow(falloff, 2.2);

  // Cintilacao sutil, dessincronizada por particula.
  float twinkle = 0.82 + 0.18 * sin(uTime * 1.7 + vSeed * 42.0);

  vec3 color = mix(uColorEdge, uColorCore, smoothstep(0.0, 0.55, vIntensity));
  color = mix(color, uColorHot, smoothstep(0.62, 1.0, vIntensity));

  gl_FragColor = vec4(color, falloff * uOpacity * twinkle);

  #include <colorspace_fragment>
}
`;
