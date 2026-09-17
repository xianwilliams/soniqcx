'use client';
import {useEffect, useRef, useState} from 'react';

/** One lifecycle for decorative motion: visible, foreground, and opted in. */
export function useAmbient<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setAllowed(!media.matches && !document.hidden && document.documentElement.dataset.motion !== 'off');
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {rootMargin: '100px'});
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {attributes: true, attributeFilter: ['data-motion']});
    io.observe(el);
    media.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    update();
    return () => { io.disconnect(); observer.disconnect(); media.removeEventListener('change', update); document.removeEventListener('visibilitychange', update); };
  }, []);
  return {ref, visible, moving: visible && allowed};
}
