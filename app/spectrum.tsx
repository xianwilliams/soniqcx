'use client';
import { useEffect, useRef } from 'react';

/** A purely abstract conversation field, not measured audio or a product screen. */
export default function Spectrum({ resolve = false, className = '' }: { resolve?: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const host = canvas.parentElement!;
    let w = 1, h = 1, raf = 0, active = true, time = 0, last = 0;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    let px = 0, py = 0;
    const move = (e: PointerEvent) => { if (!fine.matches) return; const r = host.getBoundingClientRect(); px = (e.clientX - r.left) / r.width - .5; py = (e.clientY-r.top)/r.height-.5; };
    const resize = () => { w = host.clientWidth; h = host.clientHeight; const dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = w*dpr; canvas.height = h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); draw(0); };
    const draw = (stamp: number) => {
      raf = 0;
      const off = reduced.matches || document.documentElement.dataset.motion === 'off';
      time += off ? 0 : Math.min((stamp-last)||16,40)*.00018; last=stamp;
      ctx.clearRect(0,0,w,h);
      const act = host.closest<HTMLElement>('[data-spectrum-act]');
      const r = act?.getBoundingClientRect();
      const p = off ? 1 : r ? Math.max(0,Math.min(1,-r.top/Math.max(1,act!.offsetHeight-innerHeight))) : 0;
      if(act) act.style.setProperty('--resolve',String(p));
      const settled = resolve ? Math.max(0,Math.min(1,(p-.12)/.70)) : 0;
      for (let j=0;j<54;j++) {
        ctx.beginPath();
        const group = Math.floor(j/18), k = j%18;
        const color = group === 0 ? '97,171,188' : group === 1 ? '187,221,229' : '73,115,128';
        ctx.strokeStyle=`rgba(${color},${.35 + (k%5)*.105})`;
        ctx.lineWidth = j%9===0 ? 1.3 : .68;
        for(let x=-30;x<=w+30;x+=4) {
          const u=x/w, envelope=Math.pow(Math.sin(Math.max(0,Math.min(1,u))*Math.PI),1.3);
          const spread = (j-27)*h*.009;
          const pulse = Math.sin(u*7.4 + j*.072 + time) * Math.cos(u*2.3-time*.2);
          const echo = Math.sin(u*12-j*.055-time*.55)*.22;
          const chaos = h*.52 + spread + (pulse+echo)*h*.37*envelope;
          const lane = h*(.24+group*.27) + (k-8.5)*h*.0038 + Math.sin(u*11+time+j*.08)*h*.015*envelope;
          const y = chaos*(1-settled)+lane*settled + (off?0:py*12 + px*(u-.5)*16);
          if(x===-30)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        }
        ctx.stroke();
      }
      if(active && !document.hidden && !off)raf=requestAnimationFrame(draw);
    };
    const start = () => { if(!raf && active && !document.hidden)raf=requestAnimationFrame(draw); };
    const observer=new IntersectionObserver(([e])=>{active=e.isIntersecting;if(active)start();else {cancelAnimationFrame(raf);raf=0;}}); observer.observe(host);
    const size=new ResizeObserver(resize);size.observe(host);
    const onScroll=()=>{if(active)start();};
    const changeMotion=()=>{cancelAnimationFrame(raf);raf=0;start();};host.addEventListener('pointermove',move);window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('soniq-motion',changeMotion);document.addEventListener('visibilitychange',start);reduced.addEventListener('change',start);resize();start();
    return()=>{observer.disconnect();size.disconnect();cancelAnimationFrame(raf);host.removeEventListener('pointermove',move);window.removeEventListener('scroll',onScroll);window.removeEventListener('soniq-motion',changeMotion);document.removeEventListener('visibilitychange',start);reduced.removeEventListener('change',start);};
  },[resolve]);
  return <canvas ref={ref} className={`spectrum ${className}`} aria-hidden="true"/>;
}
