'use client';

import { useGameStore } from '@portfolio/game/state';
import { useRef, useState, type PointerEvent } from 'react';

/** Raio, em pixels, que o botão central pode se afastar do centro da base. */
const RADIUS = 52;

/**
 * Joystick virtual para tela de toque.
 *
 * Escrito à mão porque é pouco: capturar o ponteiro, medir o deslocamento do
 * dedo em relação ao centro, limitar ao raio e publicar no store um vetor de
 * -1 a 1. O eixo y da tela cresce para baixo, então ele é invertido para que
 * empurrar para cima signifique andar para cima.
 *
 * `touch-action: none` impede que arrastar o dedo role ou dê zoom na página.
 */
export function Joystick({ label }: { label: string }) {
  const setJoystick = useGameStore((state) => state.setJoystick);
  const base = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  function update(event: PointerEvent<HTMLDivElement>) {
    const rect = base.current?.getBoundingClientRect();
    if (!rect) return;
    let dx = event.clientX - (rect.left + rect.width / 2);
    let dy = event.clientY - (rect.top + rect.height / 2);
    const length = Math.hypot(dx, dy);
    if (length > RADIUS) {
      dx = (dx / length) * RADIUS;
      dy = (dy / length) * RADIUS;
    }
    setKnob({ x: dx, y: dy });
    setJoystick(dx / RADIUS, -dy / RADIUS);
  }

  function release() {
    setKnob({ x: 0, y: 0 });
    setJoystick(0, 0);
  }

  return (
    <div
      ref={base}
      role="application"
      aria-label={label}
      className="relative grid h-36 w-36 touch-none place-items-center rounded-full border border-line-strong bg-void/50 backdrop-blur-md select-none"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        update(event);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) update(event);
      }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <div
        className="h-14 w-14 rounded-full border border-signal/60 bg-signal/20 shadow-[0_0_24px_-4px_rgb(200_247_81/0.5)]"
        style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
      />
    </div>
  );
}
