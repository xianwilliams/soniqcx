'use client';
import {useEffect, useRef, type RefObject} from 'react';

/** Persistent panels orbit the same track; artwork never swaps between slots. */
export function useOrbitCarousel(ref: RefObject<HTMLDivElement | null>, position: number, count: number, moving: boolean) {
  const current = useRef(position), velocity = useRef(0);
  useEffect(() => {
    const deck = ref.current;
    if (!deck) return;
    const panels = Array.from(deck.querySelectorAll<HTMLElement>('.revenue-screen'));
    let frame = 0, previous = 0;
    let radius = 0;
    const paint = () => {
      for (const [i, panel] of panels.entries()) {
        const angle = (i - current.current) * Math.PI * 2 / count;
        const depth = Math.cos(angle), side = Math.sin(angle);
        const visibility = Math.max(0, Math.min(1, depth / .22));
        const opacity = visibility * visibility * (3 - 2 * visibility);
        panel.style.transform = `translateX(-50%) translate3d(${side * radius}px, ${(1 - depth) * 18}px, ${(depth - 1) * 210}px) rotateY(${-side * 24}deg) scale(${.78 + Math.max(0, depth) * .22})`;
        panel.style.opacity = String(opacity);
        panel.style.zIndex = String(Math.round((depth + 1) * 100));
        panel.style.visibility = depth > 0 ? 'visible' : 'hidden';
        panel.style.pointerEvents = depth > .12 ? 'auto' : 'none';
        panel.dataset.orbitDepth = depth.toFixed(3);
      }
      deck.dataset.orbitPosition = current.current.toFixed(3);
    };
    const measure = () => { radius = Math.min(deck.clientWidth * (deck.clientWidth < 761 ? .39 : .31), 520); paint(); };
    const tick = (time: number) => {
      frame = 0;
      const dt = previous ? Math.min(time - previous, 50) : 16;
      previous = time;
      const seconds = dt / 1000, omega = 12;
      const displacement = current.current - position;
      const step = (velocity.current + omega * displacement) * seconds;
      const decay = Math.exp(-omega * seconds);
      current.current = position + (displacement + step) * decay;
      velocity.current = (velocity.current - omega * step) * decay;
      if (Math.abs(position - current.current) < .0005 && Math.abs(velocity.current) < .005) {current.current = position;velocity.current = 0;}
      paint();
      if (current.current !== position) frame = requestAnimationFrame(tick);
    };
    if (!moving) {current.current = position;velocity.current = 0;}
    measure();
    if (moving && current.current !== position) frame = requestAnimationFrame(tick);
    const observer = new ResizeObserver(measure); observer.observe(deck);
    return () => {cancelAnimationFrame(frame);observer.disconnect();};
  }, [ref, position, count, moving]);
}
