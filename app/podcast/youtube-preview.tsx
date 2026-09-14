'use client';
import {useEffect,useRef} from 'react';
type Player={mute:()=>void;setVolume:(volume:number)=>void;playVideo:()=>void;destroy:()=>void};
type YouTube={Player:new (el:HTMLElement,options:Record<string,unknown>)=>Player};
let loading:Promise<YouTube>|undefined;
function loadPlayer(){
 const win=window as typeof window&{YT?:YouTube;onYouTubeIframeAPIReady?:()=>void};
 if(win.YT?.Player)return Promise.resolve(win.YT);
 if(!loading)loading=new Promise<YouTube>((resolve,reject)=>{
  const previous=win.onYouTubeIframeAPIReady;win.onYouTubeIframeAPIReady=()=>{previous?.();if(win.YT)resolve(win.YT)};
  const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;script.onerror=()=>{loading=undefined;reject(new Error('Player unavailable'))};document.head.appendChild(script);
 });return loading;
}
export default function YouTubePreview({id,onUnavailable}:{id:string;onUnavailable:()=>void}){
 const host=useRef<HTMLDivElement>(null),failure=useRef(onUnavailable);failure.current=onUnavailable;
 useEffect(()=>{let stopped=false,player:Player|undefined;
  loadPlayer().then(yt=>{if(stopped||!host.current)return;const mount=document.createElement('div');host.current.appendChild(mount);
   player=new yt.Player(mount,{videoId:id,playerVars:{autoplay:0,playsinline:1,controls:0,loop:1,playlist:id,rel:0,start:45,origin:location.origin},events:{onReady:(event:{target:Player})=>{if(stopped)return;event.target.mute();event.target.setVolume(0);event.target.playVideo();const frame=host.current?.querySelector('iframe');if(frame)frame.title='Silent SHIFT HAPPENS podcast preview'},onError:()=>failure.current()}});
  }).catch(()=>{if(!stopped)failure.current()});
  return()=>{stopped=true;player?.destroy()};
 },[id]);
 return <div className="podcast-player" ref={host}/>;
}
