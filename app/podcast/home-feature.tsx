'use client';
import {useEffect, useRef, useState} from 'react';
import {ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play} from 'lucide-react';
import {useAmbient} from '../use-ambient';
import {useScrollStage} from '../use-scroll-stage';
import {useSurfaceMotion} from '../use-surface-motion';
import {useEpisodeFeed} from './use-feed';
import {FluidImage} from '../fluid-image';
import {thumbnail} from './thumbnail';
import {Waveform} from './waveform';

export default function PodcastFeature() {
  const {ref, visible, moving} = useAmbient<HTMLElement>();
  const {episodes} = useEpisodeFeed(visible);
  const [active, setActive] = useState(0), [paused, setPaused] = useState(false), [engaged, setEngaged] = useState(false);
  const touch = useRef<{x:number;y:number}|null>(null);
  const index = active % episodes.length, episode = episodes[index];
  const running = moving && !paused && !engaged;
  useSurfaceMotion(ref, moving);
  useScrollStage(ref, moving);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setActive(i => (i + 1) % episodes.length), 7000);
    return () => clearInterval(timer);
  }, [running, episodes.length]);
  function tune(next: number) {setActive((next + episodes.length) % episodes.length);setPaused(true);}
  const watch = `https://www.youtube.com/watch?v=${episode.id}`;
  return <section className="broadcast-experience" id="home-podcast" ref={ref} data-moving={moving} data-running={running} aria-labelledby="home-podcast-title">
    <span className="podcast-backdrop" aria-hidden="true">SHIFT</span>
    <div className="podcast-editorial">
      <div className="podcast-feature-art" onMouseEnter={() => setEngaged(true)} onMouseLeave={() => setEngaged(false)} onFocusCapture={() => setEngaged(true)} onBlurCapture={e => {if (!e.currentTarget.contains(e.relatedTarget)) setEngaged(false);}} onKeyDown={e => {if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {e.preventDefault(); tune(index + (e.key === 'ArrowRight' ? 1 : -1));}}} onPointerDown={e => {if(e.pointerType !== 'mouse') touch.current={x:e.clientX,y:e.clientY};}} onPointerCancel={() => {touch.current=null;}} onPointerUp={e => {const start=touch.current;touch.current=null;if(start && Math.abs(e.clientX-start.x)>45 && Math.abs(e.clientX-start.x)>Math.abs(e.clientY-start.y)) tune(index+(e.clientX<start.x?1:-1));}}>
        <div className="podcast-poster-stack">
          <span className="podcast-paper-shadow" aria-hidden="true"/>
          <a className="podcast-poster" href={watch} target="_blank" rel="noreferrer">
            <div className="poster-masthead"><img src="/assets/shift-happens-small.webp" alt="SHIFT HAPPENS, hosted by SONIQCX" width="240" height="240" loading="lazy"/><span>Cool people.<br/>Big ideas.<i>Real conversations.</i></span></div>
            <div className="poster-episode"><span>{index===0 ? 'The latest conversation' : 'From the conversation'}</span><span>{String(index+1).padStart(2,'0')} / {String(episodes.length).padStart(2,'0')}</span></div>
            <div className="poster-thumbnail"><FluidImage src={thumbnail(episode)} alt="" width="720" height="405" loading="lazy" decoding="async"/><span className="poster-play"><Play size={24} fill="currentColor"/></span><span className="poster-duration">{episode.duration}</span></div>
            <h3 key={episode.id}>{episode.title}</h3>
            <div className="poster-footer"><span>Watch the conversation<span className="sr-only"> on YouTube</span></span><ArrowUpRight size={23}/></div>
          </a>
        </div>
        <div className="podcast-poster-controls"><span>Fresh perspectives. On repeat.</span><div className="instrument-arrows"><button aria-label="Previous episode" onClick={() => tune(index-1)}><ChevronLeft size={19}/></button><button aria-label="Next episode" onClick={() => tune(index+1)}><ChevronRight size={19}/></button><button aria-label={paused?'Resume episode rotation':'Pause episode rotation'} aria-pressed={paused} onClick={() => setPaused(p=>!p)}>{paused?<Play size={15}/>:<Pause size={15}/>}</button></div></div>
      </div>
      <div className="podcast-editorial-copy">
        <p className="experience-eyebrow">04 / The SONIQCX podcast</p>
        <Waveform/>
        <h2 id="home-podcast-title"><span>Cool people.</span><span>Big ideas.</span><em>Shift happens.</em></h2>
        <p className="podcast-editorial-description">Unfiltered conversations with the people moving business forward. Leadership, customer experience, and what comes next.</p>
        <a className="podcast-primary-cta" href="/podcast"><span>Step into the conversation</span><ArrowUpRight size={21}/></a>
        <div className="podcast-editorial-foot"><span className="podcast-live-dot"/>The SHIFT HAPPENS podcast<span>Watch on YouTube</span></div>
      </div>
    </div>
  </section>;
}
