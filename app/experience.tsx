'use client';

import { useEffect, useRef, useState } from 'react';
import { signalPose } from './signal-pose';
import { ArrowUpRight, Menu, Pause, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const call = 'https://calendly.com/justin-9urp/let-s-talk-about-your-goals';
const links = [['The approach', '#approach'], ['SONIQ AI', '#intelligence'], ['Our people', '#people']];
const approach = [
  { title: 'Convert.', line: 'Make the moment count.', copy: 'Equip your team to recognize intent and turn a useful conversation into a confident buying decision.', points: ['Sales conversations', 'AI-assisted coaching', 'Conversion visibility'] },
  { title: 'Retain.', line: 'Give people a reason to stay.', copy: 'Spot signs of frustration early. Give agents the context and judgment to solve the real problem and build a stronger relationship.', points: ['Customer care', 'Churn signals', 'Contextual handoffs'] },
  { title: 'Grow.', line: 'Build value beyond the first sale.', copy: 'Connect service, sales, and technology around the lifetime of a customer. Measure the value created, then keep improving.', points: ['Expansion opportunities', 'Revenue attribution', 'Shared accountability'] },
];
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

export default function Experience() {
  const [menu, setMenu] = useState(false);
  const [motion, setMotion] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const film = useRef<HTMLElement>(null);
  const canvasHost = useRef<HTMLDivElement>(null);
  const fallback = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    let preference: string | null = null;
    try { preference = localStorage.getItem('soniq-motion'); } catch { /* storage optional */ }
    setMotion(preference === 'off' ? false : !query.matches);
    const update = () => setMotion(!query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!film.current || !root.current) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = film.current!;
      const rect = el.getBoundingClientRect();
      const p = clamp(-rect.top / Math.max(1, el.offsetHeight - window.innerHeight));
      progress.current = p;
      root.current?.style.setProperty('--progress', String(p));
      root.current?.style.setProperty('--page-progress', String(clamp(window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight))));
      if (motion) {
        root.current?.querySelectorAll<HTMLElement>('.scene-copy').forEach((node, i) => {
          
          const opacity = i === 0 ? 1 - clamp((p - .375) / .025) : clamp((p - .39) / .025);
          node.style.opacity = String(opacity);
          node.style.transform = `translate3d(0,${i === 0 ? -p * 65 : (1 - clamp((p - .39) / .08)) * 16}px,0)`;
          node.style.visibility = opacity < .015 ? 'hidden' : 'visible';
          node.inert = opacity < .4;
        });
      } else {
        root.current?.querySelectorAll<HTMLElement>('.scene-copy').forEach(node => { node.removeAttribute('style'); node.inert = false; });
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', schedule); removeEventListener('resize', schedule); };
  }, [motion]);

  useEffect(() => {
    if (!canvasHost.current) return;
    let cancel = false;
    let dispose: (() => void) | undefined;
    setSceneReady(false);
    import('./signal-scene').then(({ mountSignal }) => {
      if (cancel || !canvasHost.current) return;
      dispose = mountSignal(canvasHost.current, progress, pointer, motion, setSceneReady);
    }).catch(() => setSceneReady(false));
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') pointer.current = { x: e.clientX / innerWidth * 2 - 1, y: e.clientY / innerHeight * 2 - 1 };
    };
    addEventListener('pointermove', move, { passive: true });
    return () => { cancel = true; dispose?.(); removeEventListener('pointermove', move); };
  }, [motion]);

  useEffect(() => {
    const w = window as unknown as { ScrollCraft?: { mount: (el: HTMLElement) => { layout: () => void } }; soniqScrollMounted?: boolean };
    const start = () => {
      if (root.current && w.ScrollCraft && !w.soniqScrollMounted) {
        w.soniqScrollMounted = true;
        w.ScrollCraft.mount(root.current);
        dispatchEvent(new Event('resize'));
      }
    };
    if (w.ScrollCraft) { start(); return; }
    const script = document.createElement('script');
    script.src = '/scrollcraft/scrollcraft.js'; script.async = true; script.onload = start;
    document.body.appendChild(script);
    return () => { script.onload = null; };
  }, []);

  useEffect(() => {
    if (sceneReady || !fallback.current) return;
    let frame = 0, last = performance.now(), elapsed = 0, current = progress.current, visible = true;
    const draw = (stamp: number) => {
      frame = 0;
      if (!visible || document.hidden) { frame = 0; return; }
      const delta = Math.min((stamp-last)/1000, .05); last = stamp;
      if (motion && !document.hidden) elapsed += delta;
      current += ((motion ? progress.current : 0) - current) * (1 - Math.exp(-delta * 9));
      const pose = signalPose(current);
      const el = fallback.current;
      if (el) {
        const spin = pose.ry + (motion ? Math.sin(elapsed*.27)*.06 + pointer.current.x*.035 : 0);
        el.style.setProperty('--q-rx', `${pose.rx}rad`);
        el.style.setProperty('--q-ry', `${spin}rad`);
        el.style.setProperty('--q-rz', `${pose.rz}rad`);
        el.style.setProperty('--q-gap', `${pose.gap * (innerWidth < 760 ? 44 : 95)}px`);
        el.style.setProperty('--q-scale', String(pose.scale / 1.27));
        el.dataset.scVerifyState = [spin.toFixed(2),pose.gap.toFixed(2),pose.scale.toFixed(2)].join('|');
      }
      if (motion) frame = requestAnimationFrame(draw);
    };
    const resume = () => { if (!frame && visible && !document.hidden) { last = performance.now(); frame = requestAnimationFrame(draw); } };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) resume(); });
    observer.observe(fallback.current);
    document.addEventListener('visibilitychange', resume);
    addEventListener('resize', resume);
    resume();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); document.removeEventListener('visibilitychange', resume); removeEventListener('resize', resume); };
  }, [motion, sceneReady]);

  function toggleMotion() {
    const next = !motion;
    setMotion(next);
    try { localStorage.setItem('soniq-motion', next ? 'on' : 'off'); } catch { /* storage optional */ }
  }

  return (
    <div ref={root} className={`experience ${motion ? 'motion-enabled' : 'motion-reduced'}`}>
      <a className="skip-link" href="#approach">Skip to the approach</a>
      <header className="site-header">
        <a href="#top" className="brand" aria-label="SONIQCX home"><img src="/assets/soniqcx.webp" alt="SONIQCX" width="810" height="130" /></a>
        <nav className="desktop-nav" aria-label="Main navigation">{links.map(([name, url]) => <a key={name} href={url}>{name}</a>)}</nav>
        <div className="header-actions"><a className="header-cta" href={call} target="_blank" rel="noreferrer">Let’s talk <ArrowUpRight size={17} /></a>
          <Sheet open={menu} onOpenChange={setMenu}>
            <SheetTrigger asChild><button className="menu-toggle" aria-label="Open navigation"><Menu size={23} /></button></SheetTrigger>
            <SheetContent className="navigation-sheet">
              <SheetTitle className="menu-title">SONIQCX</SheetTitle><SheetDescription>Performance in every conversation.</SheetDescription>
              <nav aria-label="Mobile navigation">{links.map(([name, url]) => <a key={name} href={url} onClick={() => setMenu(false)}>{name}<ArrowUpRight /></a>)}<a href="https://www.soniqcx.com/careers.php">Careers <ArrowUpRight /></a><a href={call}>Let’s talk <ArrowUpRight /></a></nav>
              <p className="eyebrow">REVENUE LIVES HERE.</p>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main id="top">
        <section ref={film} className="signal-film" data-sc-act="pin" data-sc-span="2.7" aria-label="Performance in every conversation">
          <div className="film-stage" data-sc-stage>
            <div ref={fallback} className="scene-fallback" aria-hidden="true" data-hidden={sceneReady}><div className="fallback-perspective"><div className="fallback-q">{Array.from({length:9}, (_, i) => <span className="q-slice" key={i} style={{ "--slice": i } as React.CSSProperties} />)}</div></div></div>
            <div ref={canvasHost} className="signal-canvas" aria-hidden="true" data-ready={sceneReady} />
            <div className="scene-shade" aria-hidden="true" />
            
            <article className="scene-copy intro-copy">
              <p className="eyebrow">Performance-based customer experience</p>
              <h1><span>REVENUE</span>{' '}<span>LIVES <em>HERE.</em></span></h1>
              <div className="intro-bottom"><p>Every conversation has potential.<br />We turn it into performance.</p><a className="hero-action" href={call} target="_blank" rel="noreferrer">Let’s talk <ArrowUpRight size={20} /></a></div>
            </article>
            <article className="scene-copy outcome-copy">
              <h2>Every conversation.<br />{' '}<em>More possibility.</em></h2>
              <p className="scene-description">A customer won. A relationship kept. A business growing. This is the performance that counts.</p>
              <a className="button-light" href={call} target="_blank" rel="noreferrer">Let’s talk <ArrowUpRight size={20} /></a>
            </article>

          </div>
        </section>

        <section id="approach" className="approach-section" data-sc-act="flow">
          
          <div className="approach-intro" data-sc-in data-sc-stagger="50"><h2>From answered.<br /><span>To achieved.</span></h2><p>Customer experience should move your business forward. We bring the people, technology, and operational focus to make it happen.</p></div>
          <Accordion type="single" collapsible defaultValue="Convert." className="outcome-accordion">
            {approach.map((item) => <AccordionItem value={item.title} key={item.title} className="outcome-row"><AccordionTrigger className="outcome-trigger"><span className="row-title">{item.title}</span><span className="row-line">{item.line}</span></AccordionTrigger><AccordionContent className="outcome-content"><p>{item.copy}</p><div>{item.points.map(point => <span key={point}>{point}</span>)}</div></AccordionContent></AccordionItem>)}
          </Accordion>
          <div className="approach-foot"><span>People + technology + shared accountability.</span><a className="text-link" href="https://www.soniqcx.com/sales-pitch-deck.php">Why SONIQCX <ArrowUpRight size={18} /></a></div>
        </section>

        <section id="intelligence" className="intelligence-section" data-sc-act="flow">
          <p className="ai-wordmark">soniq<span>.ai</span></p>
          <div className="ai-layout"><div className="ai-heading"><h2>A sharper<br />sense of<br /><em>what’s next.</em></h2><p>Turn the context inside each conversation into a better next step. SONIQ AI connects human judgment with intelligent workflows.</p><a className="button-light" href="https://www.soniqcx.com/technology-ai.php">Explore the intelligence <ArrowUpRight size={19} /></a></div>
            <div className="intelligence-stack" data-sc-reveal="up" data-sc-reveal-at="0.05 0.40" aria-label="SONIQ AI workflow">
              <div className="stack-guide" aria-hidden="true" />
              {[['01', 'Recognize', 'Find the intent behind the words.', 'SIGNAL DETECTION'], ['02', 'Empower', 'Give the agent the context to act.', 'AI CO-PILOT'], ['03', 'Resolve', 'Move routine work to intelligent flows.', 'AUTONOMOUS ACTION'], ['04', 'Learn', 'Connect conversations to business value.', 'REVENUE ATTRIBUTION']].map(([num, name, copy, label], i) => <div className="intelligence-layer" key={num} style={{ '--layer': i } as React.CSSProperties}><div className="layer-top"><span>{label}</span></div><h3>{name}</h3><p>{copy}</p><div className="layer-trace" aria-hidden="true">{Array.from({ length: 30 }, (_, j) => <i key={j} style={{ height: `${14 + ((j * 17 + i * 13) % 30)}px` }} />)}</div></div>)}
            </div>
          </div>
        </section>

        <section id="people" className="people-section" data-sc-act="flow">
          <div className="people-photo"><div className="photo-parallax" data-sc-parallax="-0.7"><img src="/assets/justin-studio.png" alt="Justin Jones, founder and CEO of SONIQCX" width="870" height="1426" loading="lazy" /></div><div className="photo-caption"><span>Justin Jones</span><span>Founder & CEO</span></div></div>
          <div className="people-copy"><h2>Accountability<br />has a <em>face.</em></h2><p className="leader-name">Justin Jones · Founder & CEO</p><p>Built by operators who know what happens on the floor. Led by people who take responsibility for the result.</p><p>We bring service and sales into the same conversation, with empathy, clear goals, and a shared view of success.</p><a className="text-link" href="https://www.soniqcx.com/about.php">Meet the team <ArrowUpRight size={21} /></a><div className="people-values"><span>Human centered.</span><span>Outcome obsessed.</span><span>In it together.</span></div></div>
        </section>

        <section className="contact-section" id="contact" data-sc-act="flow"><a href={call} target="_blank" rel="noreferrer" className="contact-link"><span className="contact-headline"><span data-sc-cue="0.04" data-sc-kinetic="lines">LET’S TALK</span>{' '}<em data-sc-cue="0.08" data-sc-kinetic="lines">REVENUE.</em></span><ArrowUpRight aria-hidden="true" /></a><div className="contact-bottom"><p>Your next growth opportunity<br />could already be on the line.</p><a href="https://www.soniqcx.com/contact.php" className="text-link">Connect with SONIQCX <ArrowUpRight size={19} /></a></div></section>
      </main>
      <footer className="site-footer"><a href="#top" aria-label="SONIQCX home"><img src="/assets/soniqcx.webp" width="810" height="130" alt="SONIQCX" /></a><div className="footer-links"><a href="https://www.soniqcx.com/careers.php">Careers</a><a href="https://www.soniqcx.com/the-cx-courtroom.php">The CX Courtroom</a><a href="https://pulse.soniq.ai" target="_blank" rel="noreferrer">Agent portal <ArrowUpRight size={14} /></a><a href="https://dashboard.fdm.ooo" target="_blank" rel="noreferrer">Admin portal <ArrowUpRight size={14} /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} SONIQCX</span><span>Performance in every conversation.</span><div><a href="https://www.soniqcx.com/privacy.php">Privacy</a><a href="https://www.soniqcx.com/terms.php">Terms</a></div></div></footer>
      <button className="motion-control" onClick={toggleMotion} aria-pressed={!motion} aria-label={motion ? 'Reduce motion' : 'Enable motion'}>{motion ? <Pause size={12} /> : <Sparkles size={12} />}<span>{motion ? 'Reduce motion' : 'Enable motion'}</span></button>
      
    </div>
  );
}
