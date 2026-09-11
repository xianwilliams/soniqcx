'use client';
import {useEffect,useId,useRef} from 'react';
import {Q_PATH} from './q-mark';

/** Brand-native SVG planes. The contour is traced from the official SONIQCX submark. */
export default function QScene({quiet=false}:{quiet?:boolean}){
 const ref=useRef<HTMLDivElement>(null);const uid=useId().replace(/:/g,'');
 useEffect(()=>{
  const el=ref.current!;const scene=el.closest('section')||el;const reduced=matchMedia('(prefers-reduced-motion: reduce)');const fine=matchMedia('(hover:hover) and (pointer:fine)');
  let raf=0,active=true,mx=0,my=0;
  function draw(){raf=0;const off=reduced.matches||document.documentElement.dataset.motion==='off';const box=scene.getBoundingClientRect();const p=off?0:Math.max(0,Math.min(1,-box.top/(scene.clientHeight*.9)));el.style.setProperty('--q-progress',p.toFixed(4));el.style.setProperty('--q-x',off?'0':mx.toFixed(3));el.style.setProperty('--q-y',off?'0':my.toFixed(3));el.dataset.still=off?'true':'false';}
  function requestDraw(){if(!raf&&active&&!document.hidden)raf=requestAnimationFrame(draw)}
  function pointer(e:PointerEvent){if(!fine.matches)return;const b=scene.getBoundingClientRect();mx=(e.clientX-b.left)/b.width-.5;my=(e.clientY-b.top)/b.height-.5;requestDraw()}
  function reset(){mx=0;my=0;requestDraw()}
  const io=new IntersectionObserver(([e])=>{active=e.isIntersecting;el.dataset.active=active?'true':'false';if(active)requestDraw()});io.observe(el);
  const resize=new ResizeObserver(requestDraw);resize.observe(scene);
  const motion=new MutationObserver(requestDraw);motion.observe(document.documentElement,{attributes:true,attributeFilter:['data-motion']});
  scene.addEventListener('pointermove',pointer as EventListener);scene.addEventListener('pointerleave',reset);window.addEventListener('scroll',requestDraw,{passive:true});window.addEventListener('soniq-motion',requestDraw);document.addEventListener('visibilitychange',requestDraw);reduced.addEventListener('change',requestDraw);draw();
  return()=>{cancelAnimationFrame(raf);io.disconnect();resize.disconnect();motion.disconnect();scene.removeEventListener('pointermove',pointer as EventListener);scene.removeEventListener('pointerleave',reset);window.removeEventListener('scroll',requestDraw);window.removeEventListener('soniq-motion',requestDraw);document.removeEventListener('visibilitychange',requestDraw);reduced.removeEventListener('change',requestDraw)};
 },[]);
 return <div ref={ref} className={`q-scene ${quiet?'q-scene-quiet':''}`} aria-hidden="true" data-active="true"><svg viewBox="-22 -28 204 204" className="q-art" fill="none" focusable="false"><defs><path id={'q-'+uid} d={Q_PATH} fillRule="evenodd" clipRule="evenodd" pathLength="1000"/><clipPath id={'q-clip-'+uid}><use href={'#q-'+uid}/></clipPath></defs><g className="q-plane q-plane-far"><use href={'#q-'+uid}/></g><g className="q-plane q-plane-near"><use href={'#q-'+uid}/></g><g className="q-plane q-plane-face"><use className="q-face" href={'#q-'+uid}/><use className="q-edge" href={'#q-'+uid}/><g clipPath={'url(#q-clip-'+uid+')'}><path className="q-light" d="M-10 -50L90 210M10 -50L110 210"/></g><use className="q-scan" href={'#q-'+uid}/></g></svg></div>
}
