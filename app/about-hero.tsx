'use client';

import {useEffect, useRef, useState} from 'react';
import {Pause, Play} from 'lucide-react';
import {useAmbient} from './use-ambient';
import ToneHeading from './tone-heading';
import styles from './about-hero.module.css';

export default function AboutHero() {
  const {ref, visible, moving} = useAmbient<HTMLElement>();
  const video = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [manual, setManual] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (moving || manual) setLoaded(true);
  }, [moving, manual]);

  useEffect(() => {
    if (loaded) video.current?.load();
  }, [loaded]);

  useEffect(() => {
    const el = video.current;
    if (!el || !loaded) return;
    if (visible && !paused && (moving || manual) && !document.hidden) {
      el.play().catch(() => setPlaying(false));
    } else el.pause();
  }, [visible, moving, paused, loaded, manual]);

  useEffect(() => {
    const stop = () => { video.current?.pause(); setManual(false); };
    const onVisibility = () => { if (document.hidden) stop(); };
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const onPreference = () => { if (media.matches) stop(); };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('soniq-motion', stop);
    media.addEventListener('change', onPreference);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('soniq-motion', stop);
      media.removeEventListener('change', onPreference);
    };
  }, []);

  return <section className={`inner-hero ${styles.hero}`} ref={ref} aria-labelledby="about-heading">
    <picture className={styles.poster} aria-hidden="true">
      <source media="(max-width: 760px)" srcSet="/assets/team-hero-mobile-poster.webp"/>
      <img src="/assets/team-hero-poster.webp" alt="" width="1600" height="900" fetchPriority="high"/>
    </picture>
    <video id="about-hero-video" ref={video} className={styles.video} muted loop playsInline preload="none"
      width="1600" height="900" aria-hidden="true" tabIndex={-1}
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onError={() => setPlaying(false)}>
      {loaded && <>
        <source media="(max-width: 760px)" src="/assets/team-hero-mobile.mp4" type="video/mp4"/>
        <source src="/assets/team-hero.mp4" type="video/mp4"/>
      </>}
    </video>
    <div className={styles.scrim} aria-hidden="true"/>
    <div className="inner-hero-copy">
      <p className="eyebrow">ABOUT SONIQCX</p>
      <ToneHeading as="h1" id="about-heading">Built on a belief.<br/><span>Measured by impact.</span></ToneHeading>
      <p className={`lede ${styles.description}`}>To redefine customer experience as a revenue engine. We empower brands to monetize every interaction through performance-based CX operations, consulting, and technology enablement.</p>
    </div>
    <button className={styles.control} type="button" aria-controls="about-hero-video"
      aria-label={playing ? 'Pause about video' : 'Play about video'}
      onClick={() => {
        setPaused(playing);
        setManual(!playing);
        if (playing) video.current?.pause();
        else if (loaded && video.current) {
          if (video.current.error) video.current.load();
          video.current.play().catch(() => setPlaying(false));
        }
      }}>
      {playing ? <Pause size={16}/> : <Play size={16}/>}
      <span>{playing ? 'Pause video' : 'Play video'}</span>
    </button>
  </section>;
}
