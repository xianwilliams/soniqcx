'use client';
import {useEffect, useRef, useState} from 'react';
import {Pause, Play} from 'lucide-react';
import {useAmbient} from './use-ambient';
import ToneHeading from './tone-heading';
export default function BrandFilm() {
  const {ref, visible, moving} = useAmbient<HTMLElement>();
  const video = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false), [paused, setPaused] = useState(false), [manual, setManual] = useState(false), [playing, setPlaying] = useState(false);
  useEffect(() => { if (visible) setLoaded(true); }, [visible]);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (visible && !paused && (moving || manual) && !document.hidden) el.play().catch(() => setPlaying(false));
    else el.pause();
  }, [visible, moving, paused, loaded, manual]);
  useEffect(() => {
    const onVisibility = () => { if (document.hidden) video.current?.pause(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);
  return <section className="brand-loop" ref={ref}>
    <div className="film-heading wrap"><ToneHeading>Revenue.<br/>In motion.</ToneHeading><p>Human-led. AI-enhanced.<br/>Accountable for the outcome.</p></div>
    <div className="brand-loop-frame"><video ref={video} src={loaded ? '/assets/brand-motion-loop.mp4' : undefined} poster="/assets/brand-motion-poster.jpg" muted loop playsInline preload="none" width="1600" height="900" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-label="SONIQCX brand film"/>
      <button className="film-control" onClick={() => {setPaused(playing); setManual(!playing);}} aria-label={playing ? 'Pause brand film' : 'Play brand film'}>{playing ? <Pause size={17}/> : <Play size={17}/>}<span>{playing ? 'Pause film' : 'Play film'}</span></button>
    </div>
  </section>;
}
