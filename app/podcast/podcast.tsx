'use client';
import {thumbnail} from './thumbnail';
import {useState} from 'react';
import {ArrowUpRight, Play, Search} from 'lucide-react';
import {Input} from '@/components/ui/input';
import ToneHeading from '../tone-heading';
import {Close} from '../chrome';
import {useAmbient} from '../use-ambient';
import {useEpisodeFeed} from './use-feed';
import {Waveform} from './episode-belt';
const CHANNEL = 'https://www.youtube.com/@SoniqCX';
export default function Podcast() {
  const {ref, visible, moving} = useAmbient<HTMLElement>();
  const feed = useEpisodeFeed(visible);
  const [query, setQuery] = useState('');
  const latest = feed.episodes[0];
  const episodes = feed.episodes.filter(ep => ep.title.toLowerCase().includes(query.trim().toLowerCase()));
  return <main id="main" className="podcast-editorial">
    <section className="podcast-opening wrap" ref={ref} data-moving={moving}>
      <div className="podcast-masthead"><span>SHIFT HAPPENS / THE SONIQCX PODCAST</span><a href={CHANNEL} target="_blank" rel="noreferrer">YouTube<ArrowUpRight size={16}/></a></div>
      <div className="podcast-opening-grid"><div className="podcast-opening-copy"><div className="show-identity"><img src="/assets/shift-happens-small.webp" alt="SHIFT HAPPENS hosted by SONIQCX" width="500" height="500"/><span>BUSINESS SHIFTS.<br/>PEOPLE LEAD.</span></div><ToneHeading as="h1">A different<br/><span>frequency.</span></ToneHeading><p>Big ideas. Honest perspectives. Conversations with the people shaping business, leadership, AI, and customer experience.</p><a className="button" href="#episodes">Find your next conversation<ArrowUpRight size={18}/></a></div>
      <div className="podcast-spotlight"><a className="spotlight-thumb" href={`https://www.youtube.com/watch?v=${latest.id}`} target="_blank" rel="noreferrer" aria-label={`Watch ${latest.title}, ${latest.duration}`}><img src={thumbnail(latest)} alt={latest.title} width="720" height="405" fetchPriority="high"/><span className="spotlight-play"><Play size={30} fill="currentColor"/></span><span className="spotlight-duration">{latest.duration}</span></a><Waveform/><div className="spotlight-meta"><span>{feed.fresh ? 'LATEST CONVERSATION' : 'FEATURED CONVERSATION'}</span><ArrowUpRight size={16}/></div><a className="spotlight-title" href={`https://www.youtube.com/watch?v=${latest.id}`} target="_blank" rel="noreferrer">{latest.title}</a></div></div>
      <div className="podcast-opening-foot"><span>COOL PEOPLE. BIG IDEAS.</span><p>A fresh perspective is one conversation away.</p></div>
    </section>
    <section className="podcast-library wrap" id="episodes"><div className="podcast-library-heading"><div><p className="eyebrow">THE EPISODE COLLECTION</p><ToneHeading>Keep the<br/>conversation going.</ToneHeading></div><div className="episode-search"><Search size={18}/><Input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a topic or guest" aria-label="Search podcast episodes"/></div></div>
      <div className="episode-grid">{episodes.map(ep => <a className="episode-card" href={`https://www.youtube.com/watch?v=${ep.id}`} target="_blank" rel="noreferrer" key={ep.id}><div className="episode-thumb"><img src={thumbnail(ep)} alt="" width="720" height="405" loading="lazy" decoding="async"/><span>{ep.duration}</span><Play className="episode-play" size={30}/></div><p className="eyebrow">SHIFT HAPPENS</p><h3>{ep.title}</h3><span className="text-link">Watch the conversation<ArrowUpRight size={16}/></span></a>)}</div>
      {!episodes.length && <p className="episode-empty" role="status">No matching episodes. Try another topic or guest.</p>}
      <div className="podcast-library-footer"><p>More perspectives. More possibilities.</p><a className="text-link" href={`${CHANNEL}/videos`} target="_blank" rel="noreferrer">Explore the full YouTube channel<ArrowUpRight size={18}/></a></div>
    </section><Close heading="Big ideas start with a conversation."/>
  </main>;
}
