'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
export default function ScrollTones(){const path=usePathname();useEffect(()=>{
 const headings=Array.from(document.querySelectorAll<HTMLElement>('main .tone-heading')),hero=document.querySelector<HTMLElement>('.hero-cover-stage'),mq=matchMedia('(prefers-reduced-motion: reduce)');let raf=0;
 function draw(){raf=0;const off=mq.matches||document.documentElement.dataset.motion==='off';headings.forEach(el=>{const r=el.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight*.9-r.top)/(innerHeight*.7)));el.style.setProperty('--tone-position',`${off?100:p*100}%`)});if(hero){const section=hero.querySelector<HTMLElement>('.immersive-hero');if(section)hero.style.setProperty('--hero-drift',`${off?0:Math.max(0,Math.min(section.offsetHeight*.5,-hero.getBoundingClientRect().top*.38))}px`)}}
 const update=()=>{if(!raf)raf=requestAnimationFrame(draw)};const ro=new ResizeObserver(update);if(hero)ro.observe(hero);const mo=new MutationObserver(update);mo.observe(document.documentElement,{attributes:true,attributeFilter:['data-motion']});window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);mq.addEventListener('change',update);draw();
 return()=>{cancelAnimationFrame(raf);ro.disconnect();mo.disconnect();window.removeEventListener('scroll',update);window.removeEventListener('resize',update);mq.removeEventListener('change',update)};
 },[path]);return null}
