'use client';
import {useEffect,useRef} from 'react';
import {Q_PATH} from './q-mark';

type Particle={x:number;y:number;z:number;r:number;phase:number};
/** A real three-dimensional point surface following the supplied Q vector.
 * Canvas projection keeps the same experience available without WebGL. */
export default function QScene({quiet=false}:{quiet?:boolean}){
 const host=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const el=host.current!,c=canvas.current!,ctx=c.getContext('2d',{alpha:true});if(!ctx)return;
  const shape=new Path2D();shape.addPath(new Path2D(Q_PATH),new DOMMatrix().scale(144/1080));const mask=document.createElement('canvas');mask.width=144;mask.height=144;const mc=mask.getContext('2d')!;mc.fill(shape,'evenodd');const pixels=mc.getImageData(0,0,144,144).data;
  const distance=new Float32Array(144*144);for(let i=0;i<distance.length;i++)distance[i]=pixels[i*4+3]>80?999:0;
  for(let y=1;y<143;y++)for(let x=1;x<143;x++){const i=y*144+x;distance[i]=Math.min(distance[i],distance[i-1]+1,distance[i-144]+1,distance[i-145]+1.414)}
  for(let y=142;y>0;y--)for(let x=142;x>0;x--){const i=y*144+x;distance[i]=Math.min(distance[i],distance[i+1]+1,distance[i+144]+1,distance[i+145]+1.414)}
  let seed=31;const rand=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
  const points:Particle[]=[];const step=innerWidth<600?2.0:1.2;
  for(let y=1;y<143;y+=step)for(let x=1;x<143;x+=step){const xx=x+rand()*step*.7,yy=y+rand()*step*.7;const d=distance[Math.floor(yy)*144+Math.floor(xx)];if(d>0){const z=Math.sqrt(Math.min(d/10,1))*13;points.push({x:xx-72,y:yy-72,z,r:.28+rand()*.55,phase:rand()*6.28});if(rand()>.5)points.push({x:xx-72,y:yy-72,z:-z-3,r:.3+rand()*.4,phase:rand()*6.28})}}
  let w=0,h=0,raf=0,visible=true,last=0,time=0,mx=999,my=999,tx=0,ty=0,px=0,py=0,painted=0;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const motion=()=>!quiet&&!reduce.matches&&document.documentElement.dataset.motion!=='off';
  const resize=()=>{w=el.clientWidth;h=el.clientHeight;const d=Math.min(devicePixelRatio||1,w<500?1.4:1.75);c.width=w*d;c.height=h*d;c.style.width=w+'px';c.style.height=h+'px';ctx.setTransform(d,0,0,d,0,0);resume()};
  const draw=(stamp:number)=>{raf=0;if(!visible||document.hidden)return;if(stamp-painted<32){raf=requestAnimationFrame(draw);return}painted=stamp;const dt=Math.min((stamp-last)/1000||.016,.04);last=stamp;const enabled=motion();if(enabled)time+=dt;px+=(tx-px)*.045;py+=(ty-py)*.045;
   ctx.clearRect(0,0,w,h);const p=0;
   const yaw=enabled?-.18+Math.sin(time*.17)*.1+px*.1+p*.23:-.18;const pitch=enabled?.11+py*.08:.11;const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);const scale=Math.min(w,h)/175;const cx=w*.5,centerY=h*.5;
   const palettes=['#203f4a','#326171','#488c9e','#61abbc','#86c2d0','#bce5eb','#eef9fa'];const batches=palettes.map(()=>new Path2D());
   for(let i=0;i<points.length;i++){const a=points[i];const u=(a.x+72)/144,v=(a.y+72)/144;const wave=enabled?Math.sin(u*17+v*10-time*.8)*1.35+Math.sin(v*28-time*.5)*.6:0;let x=a.x,y=a.y,z=a.z+wave;
    const dx=x*scale+cx-mx,dy=y*scale+centerY-my,dd=Math.sqrt(dx*dx+dy*dy);const influence=enabled?Math.exp(-dd*dd/12500):0;z+=influence*Math.sin(dd*.045-time*2.2)*5.5;x+=influence*Math.sin(time+v*8)*.9;y+=influence*Math.cos(time+u*7)*.9;
    const xx=x*cy+z*sy,zz=z*cy-x*sy,yy=y*cp-zz*sp,zz2=y*sp+zz*cp;const perspective=330/(330-zz2);const sx=cx+xx*scale*perspective,ssy=centerY+yy*scale*perspective;
    const shimmer=Math.sin(u*18+v*11-time*.35)*.18;const light=Math.max(0,Math.min(.999,.38+zz2/70+shimmer+influence*.12+(a.z>0?.1:-.2)));const band=Math.floor(light*palettes.length);const size=a.r*scale*.6*(quiet?.82:1);batches[band].rect(sx,ssy,size,size);
   }
   for(let i=0;i<palettes.length;i++){ctx.fillStyle=palettes[i];ctx.fill(batches[i])}
   el.dataset.scVerifyState=[time.toFixed(2),yaw.toFixed(3),px.toFixed(2),py.toFixed(2)].join('|');el.dataset.ready='true';if(enabled)raf=requestAnimationFrame(draw);
  };
  function resume(){if(!raf&&visible&&!document.hidden){last=performance.now();raf=requestAnimationFrame(draw)}}
  const region=el.closest('section')||el;
  const move=(e:PointerEvent)=>{if(e.pointerType!=='mouse')return;const b=el.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top;tx=mx/Math.max(w,1)-.5;ty=my/Math.max(h,1)-.5;resume()};
  const leave=()=>{mx=my=999;tx=ty=0};
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;resume()},{rootMargin:'80px'});io.observe(el);const ro=new ResizeObserver(resize);ro.observe(el);const mo=new MutationObserver(resume);mo.observe(document.documentElement,{attributes:true,attributeFilter:['data-motion']});region.addEventListener('pointermove',move as EventListener);region.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',resume);reduce.addEventListener('change',resume);resize();
  return()=>{cancelAnimationFrame(raf);io.disconnect();ro.disconnect();mo.disconnect();region.removeEventListener('pointermove',move as EventListener);region.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',resume);reduce.removeEventListener('change',resume)};
 },[quiet]);
 return <div className={`q-scene fluid-q ${quiet?'quiet':''}`} ref={host} aria-hidden="true"><img className="q-poster" src="/assets/q-mark.svg" alt="" width="144" height="144"/><canvas ref={canvas}/></div>
}
