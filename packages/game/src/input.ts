/**
 * Teclas de movimento pressionadas agora.
 *
 * Movimento é estado contínuo ("W está apertado?"), lido a cada quadro pelo
 * personagem. Ações pontuais, como interagir e chutar, são eventos e ficam
 * no HTML do app, que chama o store. Misturar os dois num lugar só é o que
 * produz o bug clássico do chute que dispara dez vezes com uma tecla só.
 */
const pressed = new Set<string>();

const UP = ['KeyW', 'ArrowUp'];
const DOWN = ['KeyS', 'ArrowDown'];
const LEFT = ['KeyA', 'ArrowLeft'];
const RIGHT = ['KeyD', 'ArrowRight'];
const RUN = ['ShiftLeft', 'ShiftRight'];

const MOVEMENT = new Set([...UP, ...DOWN, ...LEFT, ...RIGHT, ...RUN]);

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

function onKeyDown(event: KeyboardEvent) {
  if (isTyping(event.target) || !MOVEMENT.has(event.code)) return;
  // Setas rolariam a página por trás do jogo.
  if (event.code.startsWith('Arrow')) event.preventDefault();
  pressed.add(event.code);
}

function onKeyUp(event: KeyboardEvent) {
  pressed.delete(event.code);
}

/** Trocar de aba com W apertado deixaria o personagem andando sozinho. */
function onBlur() {
  pressed.clear();
}

export function attachKeyboard(): () => void {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);
  return () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('blur', onBlur);
    pressed.clear();
  };
}

const any = (codes: string[]) => codes.some((code) => pressed.has(code));

/** Direção pedida pelo teclado: x para a direita da tela, y para cima da tela. */
export function keyboardAxis(): { x: number; y: number; run: boolean } {
  return {
    x: (any(RIGHT) ? 1 : 0) - (any(LEFT) ? 1 : 0),
    y: (any(UP) ? 1 : 0) - (any(DOWN) ? 1 : 0),
    run: any(RUN),
  };
}
