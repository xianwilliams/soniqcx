'use client';
import {useEffect,useRef} from 'react';

/** Sparse signal geometry in the side gutters; the Q remains the focal point. */
export default function HeroParticles(){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const c=canvas.current!,host=c.parentElement!,ctx=c.getContext('2d');if(!ctx)return;
  let w=0,h=0,raf=0,last=0,time=0,visible=true,mx=-999,my=-999,painted=0;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let seed=79;const random=()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646};
  const dust=Array.from({length:76},(_,i)=>({side:i%2,x:.025+random()*.255,y:.27+random()*.65,size:random()>.83?2:1,phase:random()*Math.PI*2}));
  const clusters=[[[.075,.47],[.125,.43],[.19,.49],[.155,.57]],[[.08,.77],[.15,.73],[.22,.79]],[[.79,.54],[.85,.48],[.925,.55],[.88,.62]],[[.77,.84],[.85,.79],[.94,.83]]];
  const moving=()=>!reduce.matches&&document.documentElement.dataset.motion!=='off';
  function draw(stamp:number){
   raf=0;if(!visible||document.hidden)return;if(stamp-painted<32){raf=requestAnimationFrame(draw);return}painted=stamp;
   const enabled=moving();if(enabled)time+=Math.min((stamp-last)/1000||.016,.04);last=stamp;
   ctx!.clearRect(0,0,w,h);const mobile=w<761;
   for(const p of dust){
    if(mobile&&p.y<.58)continue;
    const x=(p.side?1-p.x:p.x)*w+Math.sin(time*.13+p.phase)*4;
    const y=p.y*h+Math.cos(time*.17+p.phase)*6;
    ctx!.fillStyle=`rgba(97,171,188,${.15+(Math.sin(time*.6+p.phase)+1)*.12})`;
    ctx!.fillRect(x,y,p.size,p.size);
   }
   if(!mobile)clusters.forEach((cluster,k)=>{
    const nodes=cluster.map(([x,y],i)=>{const bx=x*w,by=y*h,dx=bx-mx,dy=by-my,d=Math.hypot(dx,dy);const force=enabled?Math.max(0,1-d/200):0;return [bx+Math.sin(time*.12+k+i)*4+dx/Math.max(d,1)*force*30,by+Math.cos(time*.16+i)*5+dy/Math.max(d,1)*force*30]});
    ctx!.lineWidth=.65;ctx!.strokeStyle='rgba(97,171,188,.16)';ctx!.beginPath();
    nodes.forEach(([x,y],i)=>{if(i)ctx!.lineTo(x,y);else ctx!.moveTo(x,y)});ctx!.stroke();
    nodes.forEach(([x,y],i)=>{
     ctx!.fillStyle=`rgba(134,194,208,${.3+(Math.sin(time*.7+k+i)+1)*.12})`;ctx!.fillRect(x-1.5,y-1.5,3,3);
     if(i===1){ctx!.strokeStyle='rgba(97,171,188,.24)';ctx!.strokeRect(x-5.5,y-5.5,11,11)}
    });
    const phase=(time*.07+k*.27)%1;const a=nodes[0],b=nodes[1];
    ctx!.fillStyle='rgba(188,229,235,.5)';ctx!.fillRect(a[0]+(b[0]-a[0])*phase-1,a[1]+(b[1]-a[1])*phase-1,2,2);
   });
   for(const [x,y] of [[.045,.63],[.26,.66],[.745,.4],[.952,.72]]){
    if(mobile)continue;ctx!.strokeStyle='rgba(97,171,188,.28)';ctx!.lineWidth=.7;ctx!.beginPath();ctx!.moveTo(x*w-4,y*h);ctx!.lineTo(x*w+4,y*h);ctx!.moveTo(x*w,y*h-4);ctx!.lineTo(x*w,y*h+4);ctx!.stroke();
   }
   if(enabled)raf=requestAnimationFrame(draw);
  }
  function resume(){if(!raf&&visible&&!document.hidden){last=performance.now();raf=requestAnimationFrame(draw)}}
  const resize=()=>{w=host.clientWidth;h=host.clientHeight;const d=Math.min(devicePixelRatio||1,1.5);c.width=w*d;c.height=h*d;ctx.setTransform(d,0,0,d,0,0);resume()};
  const move=(e:PointerEvent)=>{if(e.pointerType!=='mouse')return;const b=host.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top;resume()};
  const leave=()=>{mx=my=-999};host.addEventListener('pointermove',move);host.addEventListener('pointerleave',leave);
  const ro=new ResizeObserver(resize);ro.observe(host);
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;resume()});io.observe(host);
  const mo=new MutationObserver(resume);mo.observe(document.documentElement,{attributes:true,attributeFilter:['data-motion']});
  reduce.addEventListener('change',resume);document.addEventListener('visibilitychange',resume);resize();
  return()=>{host.removeEventListener('pointermove',move);host.removeEventListener('pointerleave',leave);cancelAnimationFrame(raf);ro.disconnect();io.disconnect();mo.disconnect();reduce.removeEventListener('change',resume);document.removeEventListener('visibilitychange',resume)};
 },[]);
 return <canvas className="hero-particles" ref={canvas} aria-hidden="true"/>;
}
