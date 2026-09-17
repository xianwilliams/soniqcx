# Verification

Recreated the revenue and podcast homepage sections against the user's supplied
AgentBoost screenshot and follow-up feedback. Other routes and media remain.

Revenue now uses one coherent two-sentence headline: white with italic revenue,
followed by a brand-blue gradient whose position responds to scroll and pointer
motion. Removed all extra screenshot toolbar, footer, padding and opaque frame.
Screenshots retain their natural proportions inside a fixed stage, with a closer
three-image fan, stronger scroll travel, decoded-image crossfades and enlargement.

Podcast is a new editorial split layout: tilted light episode poster, real live
YouTube artwork/title/duration and SHIFT HAPPENS logo, outlined background word,
animated waveform, three-line promo and a prominent archive CTA. Previous/next,
auto rotation, hover/focus pause, pause button and touch navigation remain. The
poster title reserves three lines to avoid layout movement during rotation.

Production build, TypeScript, podcast tests and diff whitespace validation passed.
Chrome checked scroll progress .209 → .60 → 1.0 for both sections, delayed incoming
image continuity, all five screenshot selections, enlargement/Escape, episode
selection, automatic rotation and pause, archive link, reduced-motion static
states, and no horizontal overflow at 360, 390, 768 and 1920px. No page errors.
Desktop/tablet/phone screenshots captured and visually inspected. Fixed a 3D
stacking intersection found on mobile so side images stay behind the center.

No new animation library. Motion is visible-only, paused in background tabs and
respects both reduced-motion preferences and the site's motion switch. Native
scroll remains unpinned. Physical Safari/iPhone and field Core Web Vitals have
not been measured.

Local throttled mobile Lighthouse: performance 87, accessibility 100, LCP 3.4s,
CLS 0, TBT 140ms. This is a lab measurement, not field CWV compliance. An
experimental label/content warning on the poster link was corrected by using
its visible content as the accessible name, with an added YouTube destination.
