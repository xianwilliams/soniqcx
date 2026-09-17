# Orbit and media-stage correction

Hero: Q reduced by 3%; copy moved 12px down on desktop and 7px on phones to
optically center in the opening. Typography, heading size and hero height retained.
Revenue: removed the serif. Persistent screenshot elements now travel around a
circular path with depth, orientation and scale tied to angle. Rear-half panels
are hidden, with a brief opacity ramp at the horizon. A critically damped spring
preserves velocity during rapid retargeting and stops requesting frames at rest.
Native scroll is unchanged; reduced motion resolves directly to the selected view.
Rear images warm only when the section approaches the viewport.
Podcast: eliminated portrait poster, paper texture and stacked sheets. Real 16:9
YouTube artwork is now the main surface, followed by episode caption, controls
and four selectable thumbnails. Show branding, animated waveform, dark palette
and archive CTA remain. Desktop height decreased from 876px to about 708px;
phone height from 984px to about 871px.

Production build, TypeScript and diff whitespace checks passed. Headless Chrome
verified five persistent image sources, intermediate circular transforms, hidden
rear panels at every stop, forward/reverse wrap, rapid selection retargeting,
fully-loaded artwork, enlarge/Escape, podcast rail and arrows, no overflow at
360/390/768/1440/1920px, and immediate reduced-motion selection. No page errors.
Inspected desktop/mobile/tablet and intermediate transition screenshots. Final
small accessibility adjustment includes the visible 'Watch episode' text in the
video link's accessible name. Real iPhone/Safari not tested; no new field CWV claim.
