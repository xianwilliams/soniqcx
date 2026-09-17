'use client';
import {useEffect, useState} from 'react';
import {ChevronLeft, ChevronRight, Pause, Play, Expand} from 'lucide-react';
import {Dialog, DialogContent, DialogTitle, DialogDescription} from '@/components/ui/dialog';
import {useAmbient} from './use-ambient';
const screens = [
  {id: 0, title: 'Performance, made visible', alt: 'SONIQ PULSE demonstration: team sales goals, analytics and agent rankings'},
  {id: 3, title: 'Turn trends into better coaching', alt: 'SONIQ PULSE demonstration: five-week coaching and performance trends'},
  {id: 4, title: 'One workspace. A shared view.', alt: 'SONIQ PULSE demonstration: team sales overview and workspace tools'},
  {id: 2, title: 'Every organization, connected', alt: 'SONIQ PULSE demonstration: organization selection and administration'},
  {id: 1, title: 'The right tools for every team', alt: 'SONIQ PULSE demonstration: module permissions and available tools'},
];
export default function RevenueShowcase() {
  const {ref, moving} = useAmbient<HTMLDivElement>();
  const [active, setActive] = useState(0), [paused, setPaused] = useState(false), [hover, setHover] = useState(false), [open, setOpen] = useState(false);
  useEffect(() => {
    if (!moving || paused || hover || open) return;
    const timer = setInterval(() => setActive(i => (i + 1) % screens.length), 5500);
    return () => clearInterval(timer);
  }, [moving, paused, hover, open]);
  function step(delta: number) { setPaused(true); setActive(i => (i + delta + screens.length) % screens.length); }
  const screen = screens[active];
  return <div className="revenue-showcase" ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocusCapture={() => setHover(true)} onBlurCapture={e => {if (!e.currentTarget.contains(e.relatedTarget)) setHover(false);}}>
    <div className="dashboard-perspective"><button className="dashboard-frame" onClick={() => setOpen(true)}>
      <span className="dashboard-topline"><span>SONIQ<span className="pulse-label">PULSE</span></span><span>PERFORMANCE WORKSPACE</span><Expand size={16}/></span>
      <span className="dashboard-slides">{screens.map((s, i) => (i === active || i === (active + 1) % screens.length) && <img key={s.id} src={`/assets/pulse-${s.id}-1440.webp`} srcSet={`/assets/pulse-${s.id}-800.webp 800w, /assets/pulse-${s.id}-1440.webp 1440w`} sizes="(max-width: 760px) 88vw, 52vw" alt={s.alt} width="1440" height="1188" loading="lazy" decoding="async" className={i === active ? 'active' : ''} aria-hidden={i !== active}/>)}</span>
      <span className="sr-only">Enlarge screenshot.</span><span className="dashboard-caption">{screen.title}<span>DEMO VIEW</span></span>
    </button></div>
    <div className="carousel-controls" role="group" aria-label="Product screenshots">
      <button onClick={() => step(-1)} aria-label="Previous screenshot"><ChevronLeft size={19}/></button>
      <div className="carousel-dots">{screens.map((s, i) => <button key={s.id} aria-label={`Show ${s.title}`} aria-pressed={i === active} onClick={() => {setActive(i); setPaused(true);}}><span/></button>)}</div>
      <button onClick={() => step(1)} aria-label="Next screenshot"><ChevronRight size={19}/></button>
      <button onClick={() => setPaused(p => !p)} aria-label={paused ? 'Resume screenshot rotation' : 'Pause screenshot rotation'} aria-pressed={paused}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button>
    </div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="screenshot-dialog"><DialogTitle>{screen.title}</DialogTitle><DialogDescription>SONIQ PULSE demonstration workspace.</DialogDescription><img src={`/assets/pulse-${screen.id}-1440.webp`} alt={screen.alt}/></DialogContent></Dialog>
  </div>;
}
