'use client';
import {useEffect, type RefObject} from 'react';

/** Small, damped pointer depth; the frame loop stops as soon as it settles. */
export function useSurfaceMotion(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let frame = 0, last = 0, x = 0, y = 0, targetX = 0, targetY = 0;
    const paint = () => {el.style.setProperty('--tilt-x', `${y}deg`);el.style.setProperty('--tilt-y', `${x}deg`);el.style.setProperty('--pointer-tone', `${x * 15}%`);};
    const tick = (time: number) => {
      frame = 0;
      const dt = last ? Math.min(time - last, 50) : 16;
      last = time;
      const ease = 1 - Math.exp(-dt / 100);
      x += (targetX - x) * ease; y += (targetY - y) * ease;
      const settled = Math.abs(targetX - x) + Math.abs(targetY - y) < .002;
      if (settled) {x = targetX; y = targetY;}
      paint();
      if (!settled) frame = requestAnimationFrame(tick);
    };
    const wake = () => {if (!frame) {last = 0;frame = requestAnimationFrame(tick);}};
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const box = el.getBoundingClientRect();
      targetX = ((event.clientX - box.left) / box.width - .5) * 4;
      targetY = -((event.clientY - box.top) / box.height - .5) * 3;
      wake();
    };
    const leave = () => {targetX = targetY = 0;wake();};
    el.addEventListener('pointermove', move);el.addEventListener('pointerleave', leave);
    return () => {cancelAnimationFrame(frame);x = y = 0;paint();el.removeEventListener('pointermove', move);el.removeEventListener('pointerleave', leave);};
  }, [ref, enabled]);
}
