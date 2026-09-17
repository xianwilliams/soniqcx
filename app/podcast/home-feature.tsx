'use client';
import {ArrowUpRight} from 'lucide-react';
import ToneHeading from '../tone-heading';
import {useAmbient} from '../use-ambient';
import {useEpisodeFeed} from './use-feed';
import EpisodeBelt, {Waveform} from './episode-belt';
export default function PodcastFeature() {
  const {ref, visible, moving} = useAmbient<HTMLElement>();
  const feed = useEpisodeFeed(visible);
  return <section className="home-podcast" ref={ref} data-moving={moving} aria-labelledby="home-podcast-title">
    <div className="podcast-backword" aria-hidden="true">SHIFT HAPPENS</div>
    <EpisodeBelt episodes={feed.episodes}/>
    <div className="home-podcast-copy"><div className="show-identity"><img src="/assets/shift-happens-small.webp" alt="SHIFT HAPPENS, hosted by SONIQCX" width="500" height="500" loading="lazy"/><div><span className="eyebrow">THE SONIQCX PODCAST</span><Waveform/></div></div>
      <ToneHeading id="home-podcast-title">Big ideas.<br/><span>Real conversations.</span></ToneHeading><p>Business shifts. People lead. Get a fresh perspective on leadership, AI, and the conversations changing customer experience.</p>
      <a href="/podcast" className="button">Step into the conversation<ArrowUpRight size={19}/></a>
      <a href="https://www.youtube.com/@SoniqCX" target="_blank" rel="noreferrer" className="podcast-channel-link">Watch SHIFT HAPPENS on YouTube<ArrowUpRight size={15}/></a>
    </div>
  </section>;
}
