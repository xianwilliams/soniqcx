'use client';
import {useEffect, type RefObject} from 'react';

/** Pointer-driven depth without a permanent animation loop or React renders. */
export function useSurfaceMotion(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let frame = 0;
    const reset = () => { cancelAnimationFrame(frame); el.style.setProperty('--tilt-x', '0deg'); el.style.setProperty('--tilt-y', '0deg'); };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = el.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - .5;
        const y = (event.clientY - box.top) / box.height - .5;
        el.style.setProperty('--tilt-x', `${-y * 5}deg`);
        el.style.setProperty('--tilt-y', `${x * 7}deg`);
      });
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', reset);
    return () => { reset(); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', reset); };
  }, [ref, enabled]);
}
