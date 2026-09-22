import {
  BoxGeometry,
  CylinderGeometry,
  DoubleSide,
  FrontSide,
  IcosahedronGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  PlaneGeometry,
  RingGeometry,
  type Texture,
} from 'three';

/**
 * Geometrias e materiais compartilhados por toda a cena.
 *
 * Antes, cada caixa do quarto criava a própria geometria e o próprio material:
 * eram quase duzentas geometrias na memória da placa de vídeo para desenhar
 * caixas idênticas. Aqui existe uma caixa de um metro, e cada móvel a estica
 * pela escala. O material é buscado por cor num mapa, então dois objetos da
 * mesma cor usam o mesmo.
 *
 * O ganho não é só memória. Quanto menos material distinto, menos vezes a
 * placa troca de estado por quadro, que é o que trava aparelho fraco.
 */

export const unitBox = new BoxGeometry(1, 1, 1);
export const unitPlane = new PlaneGeometry(1, 1);
export const unitCylinder = new CylinderGeometry(0.5, 0.5, 1, 10);
/** Tronco de cone com a boca para cima, para vaso e abajur. */
export const unitCone = new CylinderGeometry(0.5, 0.375, 1, 10);
export const unitBall = new IcosahedronGeometry(0.5, 1);
export const unitRock = new IcosahedronGeometry(0.5, 0);
export const unitMarker = new OctahedronGeometry(0.15, 0);
/** Anel do chão, com raio um: cada área o achata para o próprio tamanho. */
export const unitRing = new RingGeometry(0.86, 1, 40);

export interface MaterialOptions {
  emissive?: string;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  flatShading?: boolean;
  /** Para forma aberta, como a cúpula do abajur, que se vê por dentro. */
  doubleSide?: boolean;
}

const cache = new Map<string, MeshStandardMaterial>();

/**
 * Material opaco por cor, reaproveitado.
 *
 * Use só para aparência que não muda. O que pisca ou acende ao aproximar
 * precisa do próprio material, senão acenderia em todos os objetos da mesma
 * cor ao mesmo tempo.
 */
export function boxMaterial(color: string, options: MaterialOptions = {}): MeshStandardMaterial {
  const {
    emissive = '#000000',
    emissiveIntensity = 0,
    metalness = 0,
    roughness = 0.85,
    flatShading = true,
    doubleSide = false,
  } = options;
  const key = `${color}|${emissive}|${emissiveIntensity}|${metalness}|${roughness}|${flatShading}|${doubleSide}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const material = new MeshStandardMaterial({
    color,
    emissive,
    emissiveIntensity,
    metalness,
    roughness,
    flatShading,
    side: doubleSide ? DoubleSide : FrontSide,
  });
  cache.set(key, material);
  return material;
}

const mapCache = new Map<string, MeshStandardMaterial | MeshBasicMaterial>();

/**
 * Material com textura, reaproveitado pela textura e pelo tom.
 *
 * As telas do quarto usam isto duas vezes cada, uma com o tom aceso e outra com
 * o apagado, e trocam de material em vez de trocar a cor: assim o par continua
 * sendo dois materiais no total, não um novo a cada quadro.
 */
export function mapMaterial(
  texture: Texture,
  options: { tint?: string; basic?: boolean; roughness?: number; transparent?: boolean } = {},
): MeshStandardMaterial | MeshBasicMaterial {
  const { tint = '#ffffff', basic = false, roughness = 0.8, transparent = false } = options;
  const key = `${texture.uuid}|${tint}|${basic}|${roughness}|${transparent}`;
  const cached = mapCache.get(key);
  if (cached) return cached;

  const material = basic
    ? new MeshBasicMaterial({ map: texture, color: tint, toneMapped: false, transparent })
    : new MeshStandardMaterial({
        map: texture,
        color: tint,
        roughness,
        transparent,
        alphaTest: transparent ? 0.1 : 0,
      });
  mapCache.set(key, material);
  return material;
}
