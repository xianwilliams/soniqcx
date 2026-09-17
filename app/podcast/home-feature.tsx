'use client';
import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play} from 'lucide-react';
import {useAmbient} from '../use-ambient';
import {useSurfaceMotion} from '../use-surface-motion';
import {useEpisodeFeed} from './use-feed';
import {thumbnail} from './thumbnail';
export default function PodcastFeature() {
  const {ref, visible, moving} = useAmbient<HTMLElement>();
  const {episodes} = useEpisodeFeed(visible);
  const [active, setActive] = useState(0), [paused, setPaused] = useState(false), [engaged, setEngaged] = useState(false);
  const touch = useRef<{x:number;y:number}|null>(null);
  const index = active % episodes.length, episode = episodes[index];
  const running = moving && !paused && !engaged;
  useSurfaceMotion(ref, moving);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setActive(i => (i + 1) % episodes.length), 7000);
    return () => clearInterval(timer);
  }, [running, episodes.length]);
  function tune(next: number) {setActive((next + episodes.length) % episodes.length);setPaused(true);}
  const watch = `https://www.youtube.com/watch?v=${episode.id}`;
  return <section className="broadcast-experience" id="home-podcast" ref={ref} data-moving={moving} data-running={running} aria-labelledby="home-podcast-title">
    <div className="broadcast-masthead"><div className="broadcast-brand"><img src="/assets/shift-happens-small.webp" alt="SHIFT HAPPENS, hosted by SONIQCX" width="240" height="240" loading="lazy"/><p>The SONIQCX podcast<br/><span>Cool people. Big ideas.</span></p></div><a className="broadcast-archive" href="/podcast">Explore all episodes<ArrowUpRight size={22}/></a></div>
    <h2 id="home-podcast-title" className="broadcast-title"><span>Shift</span> <span>happens<span className="broadcast-title-dot">.</span></span></h2>
    <div className="broadcast-console" onMouseEnter={() => setEngaged(true)} onMouseLeave={() => setEngaged(false)} onFocusCapture={() => setEngaged(true)} onBlurCapture={e => {if (!e.currentTarget.contains(e.relatedTarget)) setEngaged(false);}}>
      <div className="broadcast-stage" role="group" aria-label="Featured podcast episodes" tabIndex={0} onKeyDown={e => {if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {e.preventDefault(); tune(index + (e.key === 'ArrowRight' ? 1 : -1));}}} onPointerDown={e => {if(e.pointerType !== 'mouse') touch.current={x:e.clientX,y:e.clientY};}} onPointerCancel={() => {touch.current=null;}} onPointerUp={e => {const start=touch.current;touch.current=null;if(start && Math.abs(e.clientX-start.x)>45 && Math.abs(e.clientX-start.x)>Math.abs(e.clientY-start.y)) tune(index+(e.clientX<start.x?1:-1));}}>
        <div className="broadcast-rings" aria-hidden="true"><i/><i/><i/></div>
        {[-1,0,1].map(offset => {const slot=(index+offset+episodes.length)%episodes.length, ep=episodes[slot];const Surface=offset===0?'div':'button';return <Surface key={offset} className={`broadcast-art broadcast-art-${offset===0?'center':offset<0?'left':'right'}`} onClick={offset ? () => tune(slot) : undefined} aria-label={offset===0 ? `Selected episode: ${ep.title}` : `Select episode: ${ep.title}`}>
          <img key={ep.id} src={thumbnail(ep)} alt="" width="720" height="405" loading="lazy" decoding="async"/><span className="broadcast-art-edge" aria-hidden="true"/>{offset===0 && <span className="broadcast-duration">{ep.duration}</span>}
        </Surface>})}
        <a className="broadcast-play" href={watch} target="_blank" rel="noreferrer" aria-label={`Watch episode: ${episode.title} on YouTube`}><Play size={28} fill="currentColor"/><span>Watch episode</span></a>
      </div>
      <div className="broadcast-now"><div className="broadcast-now-copy"><span className="broadcast-selected-label">{index===0?'LATEST CONVERSATION':'IN THE CONVERSATION'}</span><h3 key={episode.id}><a href={watch} target="_blank" rel="noreferrer">{episode.title}<ArrowUpRight size={22}/></a></h3></div><div className="instrument-arrows"><button aria-label="Previous episode" onClick={() => tune(index-1)}><ChevronLeft size={22}/></button><button aria-label="Next episode" onClick={() => tune(index+1)}><ChevronRight size={22}/></button><button aria-label={paused?'Resume episode rotation':'Pause episode rotation'} aria-pressed={paused} onClick={() => setPaused(p=>!p)}>{paused?<Play size={17}/>:<Pause size={17}/>}</button></div></div>
      <div className="broadcast-tuner" role="group" aria-label="Choose a podcast episode">{episodes.map((ep,i) => <button key={ep.id} className="tuner-station" aria-label={`${String(i+1).padStart(2,"0")}. Select ${ep.title}`} aria-pressed={i===index} onClick={() => tune(i)}><span className="tuner-bars" aria-hidden="true">{Array.from({length:5},(_,j)=><i key={j} style={{'--bar-height':`${22+((i*19+j*31)%70)}%`,'--bar-delay':`${j*-.17}s`} as CSSProperties}/>)}</span><span className="tuner-number" aria-hidden="true">{String(i+1).padStart(2,'0')}</span></button>)}</div>
    </div>
    <div className="broadcast-signoff"><p>Business shifts. People lead.<br/>A fresh perspective is one conversation away.</p><a className="experience-cta" href="/podcast"><span>Find your next conversation</span><span className="experience-cta-icon"><ArrowUpRight size={26}/></span></a></div>
  </section>;
}
