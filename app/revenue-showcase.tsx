'use client';
import {useEffect, useState} from 'react';
import {ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, Expand} from 'lucide-react';
import {Dialog, DialogContent, DialogTitle, DialogDescription} from '@/components/ui/dialog';
import {useAmbient} from './use-ambient';
import {useScrollStage} from './use-scroll-stage';
import {useSurfaceMotion} from './use-surface-motion';
import {FluidImage} from './fluid-image';
import {CALL} from './chrome';
const screens = [
  {id: 0, label: 'Performance', title: 'Make every outcome visible.', alt: 'SONIQ PULSE demonstration: team sales goals, analytics and agent rankings'},
  {id: 3, label: 'Coaching', title: 'Turn insight into your next move.', alt: 'SONIQ PULSE demonstration: five-week coaching and performance trends'},
  {id: 4, label: 'Workspace', title: 'One team. One clear picture.', alt: 'SONIQ PULSE demonstration: team sales overview and workspace tools'},
  {id: 2, label: 'Organizations', title: 'Bring every operation together.', alt: 'SONIQ PULSE demonstration: organization selection and administration'},
  {id: 1, label: 'Team tools', title: 'Put the right tools in the right hands.', alt: 'SONIQ PULSE demonstration: module permissions and available tools'},
];
export default function RevenueShowcase() {
  const {ref, moving} = useAmbient<HTMLElement>();
  const [active, setActive] = useState(0), [paused, setPaused] = useState(false), [hover, setHover] = useState(false), [open, setOpen] = useState(false);
  useSurfaceMotion(ref, moving);
  useScrollStage(ref, moving);
  const running = moving && !paused && !hover && !open;
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setActive(i => (i + 1) % screens.length), 6500);
    return () => clearInterval(timer);
  }, [running]);
  function select(index: number) { setPaused(true); setActive((index + screens.length) % screens.length); }
  const screen = screens[active];
  return <section className="revenue-experience" id="revenue" ref={ref} data-moving={moving} data-running={running} aria-labelledby="revenue-title">
    <div className="revenue-heading"><p className="experience-eyebrow">01 / Performance based CX</p><h2 id="revenue-title"><span>Every call should drive <em>revenue.</em></span><span className="revenue-color-line">Not just get answered.</span></h2></div>
    <div className="revenue-instrument" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocusCapture={() => setHover(true)} onBlurCapture={e => {if (!e.currentTarget.contains(e.relatedTarget)) setHover(false);}}>
      <div className="revenue-orbits" aria-hidden="true"><i/><i/><i/></div>
      <div className="revenue-deck" aria-label="SONIQ PULSE product screenshots" onKeyDown={e => {if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {e.preventDefault(); select(active + (e.key === 'ArrowRight' ? 1 : -1));}}}>
        {[-1, 0, 1].map(offset => {const index = (active + offset + screens.length) % screens.length, item = screens[index];return <button key={offset} className={`revenue-screen revenue-screen-${offset === 0 ? 'center' : offset < 0 ? 'left' : 'right'}`} onClick={() => offset === 0 ? setOpen(true) : select(index)} title={offset === 0 ? `Enlarge ${item.label} screenshot` : `View ${item.label} screenshot`}>
          <span className="sr-only">{offset === 0 ? "Enlarge screenshot." : "Select screenshot."}</span>
          <span className="revenue-screen-image"><FluidImage src={`/assets/pulse-${item.id}-800.webp`} srcSet={`/assets/pulse-${item.id}-800.webp 800w, /assets/pulse-${item.id}-1440.webp 1440w`} sizes={offset === 0 ? '(max-width: 760px) 90vw, 55vw' : '34vw'} alt={item.alt} loading="lazy" decoding="async"/></span>
          {offset === 0 && <span className="revenue-expand"><Expand size={15}/><span>Explore the detail</span></span>}
        </button>})}
      </div>
      <div className="revenue-selection"><p key={active}>{screen.title}</p><div className="instrument-arrows"><button aria-label="Previous screenshot" onClick={() => select(active - 1)}><ChevronLeft size={19}/></button><button aria-label="Next screenshot" onClick={() => select(active + 1)}><ChevronRight size={19}/></button><button aria-label={paused ? 'Resume screenshot rotation' : 'Pause screenshot rotation'} aria-pressed={paused} onClick={() => setPaused(p => !p)}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button></div></div>
      <div className="revenue-switchboard" role="group" aria-label="Explore the performance workspace">{screens.map((item, i) => <button key={item.id} aria-pressed={i === active} onClick={() => select(i)}><span className="switch-index">0{i + 1}</span><span>{item.label}</span><ArrowUpRight size={17}/><i className="switch-progress" key={`${active}-${i}`} aria-hidden="true"/></button>)}</div>
    </div>
    <div className="revenue-resolution"><p>Your customer conversations are a growth opportunity. Turn them into conversions, lasting relationships, and measurable revenue.</p><a className="experience-cta" href={CALL}><span>See how performance based CX works</span><span className="experience-cta-icon"><ArrowUpRight size={25}/></span></a></div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="screenshot-dialog"><DialogTitle>{screen.title}</DialogTitle><DialogDescription>SONIQ PULSE demonstration workspace.</DialogDescription><img src={`/assets/pulse-${screen.id}-1440.webp`} alt={screen.alt}/></DialogContent></Dialog>
  </section>;
}
