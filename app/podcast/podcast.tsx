'use client';

import {useState} from 'react';
import {ArrowUpRight, ArrowDown, ChevronLeft, ChevronRight, Play, Search, Radio, X} from 'lucide-react';
import {useAmbient} from '../use-ambient';
import {useSurfaceMotion} from '../use-surface-motion';
import {useEpisodeFeed} from './use-feed';
import {thumbnail} from './thumbnail';
import {topics, matchesEpisode} from './discovery';
import styles from './podcast.module.css';

const CHANNEL = 'https://www.youtube.com/@SoniqCX';
const watchURL = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export default function Podcast() {
  const {ref, visible, moving} = useAmbient<HTMLElement>();
  const feed = useEpisodeFeed(visible);
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<string>('All conversations');
  useSurfaceMotion(ref, moving);
  // Keep the visitor's selection stable when a new upload arrives.
  const index = Math.max(0, feed.episodes.findIndex(ep => ep.id === selected));
  const featured = feed.episodes[index];
  const episodes = feed.episodes.filter(ep => matchesEpisode(ep, query, topic));
  const tune = (step: number) => setSelected(feed.episodes[(index + step + feed.episodes.length) % feed.episodes.length].id);

  return <main id="main" className={styles.page} ref={ref} data-moving={moving}>
    <section className={styles.hero} aria-labelledby="podcast-title">
      <div className={styles.masthead}><span><Radio size={16}/> THE SONIQCX PODCAST</span><a href={CHANNEL} target="_blank" rel="noreferrer">Find us on YouTube <ArrowUpRight size={17}/></a></div>
      <div className={styles.titleRow}>
        <h1 id="podcast-title">SHIFT <span>HAPPENS.</span></h1>
        <div className={styles.signal} aria-hidden="true">{Array.from({length: 29}, (_, i) => <i key={i} style={{height: `${22 + (i * 37 % 79)}%`, animationDelay: `${i * -.12}s`}}/>)}</div>
      </div>
      <div className={styles.intro}><p>Cool people. Big ideas.<br/><span>Conversations that move business forward.</span></p><a href="#episodes">Explore the episodes <ArrowDown size={18}/></a></div>
      <div className={styles.studio}>
        <div className={styles.studioLines} aria-hidden="true"><i/><i/><i/></div>
        <div className={styles.featureCopy}>
          <div className={styles.featureLabel}><span className={styles.dot}/>{index === 0 && feed.fresh ? 'LATEST CONVERSATION' : 'IN THE SPOTLIGHT'}</div>
          <h2 key={featured.id}>{featured.title}</h2>
          <a className={styles.watch} href={watchURL(featured.id)} target="_blank" rel="noreferrer"><Play size={16} fill="currentColor"/> Watch on YouTube <ArrowUpRight size={19}/></a>
          <div className={styles.tuner}>
            <div><span>FIND YOUR FREQUENCY</span><span className={styles.tunerCount}>{String(index + 1).padStart(2, '0')} <i>/ {String(feed.episodes.length).padStart(2, '0')}</i></span></div>
            <div className={styles.arrows}><button onClick={() => tune(-1)} aria-label="Previous featured episode"><ChevronLeft size={20}/></button><button onClick={() => tune(1)} aria-label="Next featured episode"><ChevronRight size={20}/></button></div>
          </div>
          <input className={styles.dial} type="range" min="0" max={feed.episodes.length - 1} value={index} aria-label="Choose featured episode" aria-valuetext={featured.title} onChange={e => setSelected(feed.episodes[Number(e.target.value)].id)}/>
        </div>
        <div className={styles.featureArt}>
          <a className={styles.screen} href={watchURL(featured.id)} target="_blank" rel="noreferrer" aria-label={`Watch ${featured.title} on YouTube`}>
            <img key={featured.id} src={thumbnail(featured)} alt={featured.title} width="720" height="405" fetchPriority="high"/>
            <span className={styles.play}><Play size={29} fill="currentColor"/></span>
          </a>
          <div className={styles.screenFooter}><span>SHIFT HAPPENS <span className={styles.separator}>/</span> SONIQCX</span><span>{featured.duration}</span></div>
          <div className={styles.previewRail} role="group" aria-label="Featured conversations">{feed.episodes.slice(0, 4).map(ep => <button key={ep.id} onClick={() => setSelected(ep.id)} aria-label={`Feature ${ep.title}`} aria-pressed={ep.id === featured.id}><img src={thumbnail(ep)} alt="" width="320" height="180" loading="lazy"/><span>{ep.title}</span></button>)}</div>
        </div>
      </div>
      <div className={styles.heroFoot}><span>Different perspectives. A shared curiosity.</span><span>Business / AI / Leadership / CX</span></div>
    </section>
    <section className={styles.library} id="episodes" aria-labelledby="collection-title">
      <div className={styles.libraryHeading}><h2 id="collection-title">Good conversations.<br/><span>Great company.</span></h2><p>Meet the people questioning what’s next.<br/>Find the conversation that stays with you.</p></div>
      <div className={styles.filters}>
        <div className={styles.topics} role="group" aria-label="Filter episodes by topic">{topics.map(item => <button key={item} aria-pressed={topic === item} onClick={() => setTopic(item)}>{item}</button>)}</div>
        <label className={styles.search}><Search size={18}/><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Topic or guest" aria-label="Search podcast episodes"/>{query && <button aria-label="Clear search" onClick={() => setQuery('')}><X size={16}/></button>}</label>
      </div>
      <div className={styles.collectionMeta}><span role="status">{episodes.length} {episodes.length === 1 ? 'conversation' : 'conversations'}</span><span>{feed.fresh ? 'Updated from YouTube' : 'The episode collection'}</span></div>
      <div className={styles.episodeGrid}>{episodes.map(ep => <a className={styles.episode} key={ep.id} href={watchURL(ep.id)} target="_blank" rel="noreferrer">
        <div className={styles.thumbnail}><img src={thumbnail(ep)} alt="" width="720" height="405" loading="lazy" decoding="async"/><span className={styles.cardPlay}><Play size={22} fill="currentColor"/></span><span className={styles.duration}>{ep.duration}</span></div>
        <div className={styles.cardMeta}><span>SHIFT HAPPENS</span><ArrowUpRight size={19}/></div><h3>{ep.title}</h3><span className={styles.cardLink}>Watch the conversation <span aria-hidden="true">↗</span></span>
      </a>)}</div>
      {!episodes.length && <div className={styles.empty}><h3>No signal on this frequency.</h3><p>Try another topic or guest.</p><button onClick={() => {setQuery(''); setTopic(topics[0]);}}>Show all conversations <ArrowUpRight size={17}/></button></div>}
    </section>
    <section className={styles.close}><div><span>THERE’S ALWAYS ANOTHER PERSPECTIVE.</span><h2>Stay curious.<br/>Stay tuned.</h2></div><a href={CHANNEL} target="_blank" rel="noreferrer">Explore the YouTube channel <ArrowUpRight size={30}/></a><div className={styles.closeLines} aria-hidden="true">{Array.from({length: 19}, (_, i) => <i key={i}/>)}</div></section>
  </main>;
}
