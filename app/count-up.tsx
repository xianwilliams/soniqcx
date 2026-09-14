'use client';
import {useEffect,useRef,useState} from 'react';
export default function CountUp({value}:{value:string|number}){
 const text=String(value),match=text.match(/^(\D*?)(\d+(?:\.\d+)?)(.*)$/),ref=useRef<HTMLSpanElement>(null),[display,setDisplay]=useState(text);
 useEffect(()=>{
  if(!match||text==='24/7')return;const [_,prefix,num,suffix]=match,target=Number(num),decimals=num.split('.')[1]?.length||0;let raf=0,done=false;
  const mq=matchMedia('(prefers-reduced-motion: reduce)');
  const off=()=>mq.matches||document.documentElement.dataset.motion==='off';
  const finish=()=>{if(off()){cancelAnimationFrame(raf);setDisplay(text);done=true}};
  const io=new IntersectionObserver(([e])=>{if(!e.isIntersecting||done)return;done=true;io.disconnect();if(off())return;const start=performance.now();const tick=(now:number)=>{const p=Math.min(1,(now-start)/1300);setDisplay(prefix+(target*(1-Math.pow(1-p,3))).toFixed(decimals)+suffix);if(p<1)raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick)},{threshold:.35});io.observe(ref.current!);
  const mo=new MutationObserver(finish);mo.observe(document.documentElement,{attributes:true,attributeFilter:['data-motion']});mq.addEventListener('change',finish);
  return()=>{io.disconnect();mo.disconnect();cancelAnimationFrame(raf);mq.removeEventListener('change',finish)};
 },[text]);
 return <span ref={ref} className="count-up"><span className="sr-only">{text}</span><span aria-hidden="true">{display}</span></span>;
}
