'use client';

import { rgb } from '@portfolio/config-tailwind/tokens';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { particleFieldFragment, particleFieldVertex } from '../shaders/particle-field';
import { buildShape, particleAttributes, type ShapeName } from '../shapes';

export interface ParticleFieldProps {
  count: number;
  /** Forma de origem e forma de destino da interpolacao. */
  from?: ShapeName;
  to?: ShapeName;
  /** 0 mostra a forma de origem, 1 a de destino. Normalmente vem do scroll. */
  morph?: number;
  dispersion?: number;
  size?: number;
  opacity?: number;
  rotationSpeed?: number;
}

/**
 * Nuvem de particulas do hero.
 *
 * A geometria e construida uma unica vez e nunca mais e tocada pela CPU. Toda
 * a animacao acontece no shader, alimentada por uniforms baratos de atualizar.
 * E por isso que a cena aguenta dezenas de milhares de particulas sem perder
 * quadro, coisa que um loop em JavaScript sobre o buffer nao conseguiria.
 */
export function ParticleField({
  count,
  from = 'sphere',
  to = 'knot',
  morph = 0,
  dispersion = 0.28,
  size = 26,
  opacity = 0.9,
  rotationSpeed = 0.055,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointerTarget = useRef(new THREE.Vector3(999, 999, 999));
  const smoothedMorph = useRef(morph);

  const viewport = useThree((state) => state.viewport);

  const geometry = useMemo(() => {
    const source = buildShape(from, count);
    const target = buildShape(to, count);
    const { seeds, scales } = particleAttributes(count);

    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute('position', new THREE.BufferAttribute(source, 3));
    bufferGeometry.setAttribute('aTarget', new THREE.BufferAttribute(target, 3));
    bufferGeometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    bufferGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    // A esfera envolvente calculada a partir de "position" ignora o
    // deslocamento do shader, o que faria o frustum culling apagar a nuvem em
    // certos angulos. Um raio generoso resolve mais barato que recalcular.
    bufferGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 6);

    return bufferGeometry;
  }, [count, from, to]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: size },
      uPixelRatio: { value: 1 },
      uMorph: { value: morph },
      uDispersion: { value: dispersion },
      uNoiseScale: { value: 0.62 },
      uNoiseSpeed: { value: 0.08 },
      uPointer: { value: new THREE.Vector3(999, 999, 999) },
      uPointerRadius: { value: 0.85 },
      uPointerStrength: { value: 0.42 },
      uColorCore: { value: new THREE.Vector3(...rgb('signal')) },
      uColorEdge: { value: new THREE.Vector3(...rgb('plasma')) },
      uColorHot: { value: new THREE.Vector3(...rgb('signalGlow')) },
      uOpacity: { value: opacity },
    }),
    // Intencional: os uniforms sao criados uma vez e atualizados por referencia
    // dentro do useFrame. Recriar o objeto forcaria recompilar o shader.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;

    // O delta e limitado porque voltar de uma aba em segundo plano entrega um
    // salto enorme, que faria a nuvem teleportar.
    const step = Math.min(delta, 1 / 30);

    material.uniforms.uTime!.value = state.clock.elapsedTime;
    material.uniforms.uPixelRatio!.value = Math.min(state.gl.getPixelRatio(), 2);

    // Suavizacao exponencial: o morph persegue o alvo em vez de saltar, o que
    // absorve a irregularidade do evento de scroll.
    smoothedMorph.current += (morph - smoothedMorph.current) * Math.min(1, step * 4.2);
    material.uniforms.uMorph!.value = smoothedMorph.current;

    // O ponteiro chega em coordenada normalizada de -1 a 1. Reescalar pelo
    // viewport leva para o espaco do mundo, onde o shader trabalha.
    pointerTarget.current.set(
      (state.pointer.x * viewport.width) / 2,
      (state.pointer.y * viewport.height) / 2,
      0,
    );
    (material.uniforms.uPointer!.value as THREE.Vector3).lerp(
      pointerTarget.current,
      Math.min(1, step * 6),
    );

    if (pointsRef.current) {
      pointsRef.current.rotation.y += step * rotationSpeed;
      // Uma leve inclinacao que acompanha o mouse da a impressao de que a nuvem
      // tem volume, sem precisar de controle de orbita.
      pointsRef.current.rotation.x +=
        (state.pointer.y * 0.22 - pointsRef.current.rotation.x) * Math.min(1, step * 2);
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={particleFieldVertex}
        fragmentShader={particleFieldFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
