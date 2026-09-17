'use client';
import {thumbnail} from './thumbnail';
import {useState, type CSSProperties} from 'react';
import {Pause, Play, ArrowUpRight} from 'lucide-react';
import type {Episode} from './feed';
import {useAmbient} from '../use-ambient';
export function Waveform() {
  return <div className="broadcast-wave" aria-hidden="true">{Array.from({length: 35}, (_, i) => <i key={i} style={{height: `${18 + ((i * 37 + 13) % 79)}%`, animationDelay: `${i * -.13}s`}}/>)}</div>;
}
export default function EpisodeBelt({episodes}: {episodes: Episode[]}) {
  episodes = episodes.slice(0, 7);
  const {ref, moving} = useAmbient<HTMLDivElement>();
  const [paused, setPaused] = useState(false);
  return <div className="episode-belt" ref={ref} data-moving={moving && !paused}>
    <div className="belt-window" tabIndex={0} role="region" aria-label="Recent podcast thumbnails"><div className="belt-cylinder" style={{'--count': episodes.length} as CSSProperties}>{episodes.map((ep, i) => <article key={ep.id} className="belt-card" style={{'--angle': `${i * 360 / episodes.length}deg`} as CSSProperties}>
      <div className="belt-thumbnail"><img src={thumbnail(ep)} alt="" width="720" height="405" loading="lazy" decoding="async"/><span className="belt-duration">{ep.duration}</span></div><div className="belt-caption"><h3>{ep.title}</h3></div>
    </article>)}</div></div>
    <div className="belt-footer"><a href="/podcast">EXPLORE THE EPISODES<ArrowUpRight size={16}/></a><button onClick={() => setPaused(p => !p)} aria-label={paused ? 'Resume episode belt' : 'Pause episode belt'} aria-pressed={paused}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button></div>
  </div>;
}
