'use client';
import {useEffect, type RefObject} from 'react';

/** Scroll depth with a short, frame-rate-independent settle. No pinned scroll. */
export function useScrollStage(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0, previous = 0, current = 1, target = 1;
    const paint = (progress: number) => {
      const remaining = 1 - progress;
      el.style.setProperty('--fan-in', `${remaining * 90}px`);
      el.style.setProperty('--stage-lift', `${remaining * 32}px`);
      el.style.setProperty('--stage-pitch', `${remaining * 9}deg`);
      el.style.setProperty('--stage-scale', `${.95 + progress * .05}`);
      el.style.setProperty('--title-shift', `${remaining * 22}px`);
      el.style.setProperty('--stage-opacity', `${.72 + progress * .28}`);
      el.dataset.scVerifyState = progress.toFixed(3);
    };
    if (!enabled) { paint(1); return; }
    const measure = () => {
      const top = el.getBoundingClientRect().top;
      target = Math.max(0, Math.min(1, (innerHeight * .95 - top) / (innerHeight * .85)));
    };
    const tick = (time: number) => {
      frame = 0;
      const dt = previous ? Math.min(time - previous, 50) : 16;
      previous = time;
      current += (target - current) * (1 - Math.exp(-dt / 75));
      if (Math.abs(target - current) < .001) current = target;
      paint(current);
      if (current !== target) frame = requestAnimationFrame(tick);
    };
    const update = () => { measure(); if (!frame) { previous = 0; frame = requestAnimationFrame(tick); } };
    measure(); current = target; paint(current);
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update, {passive:true});
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [ref, enabled]);
}
