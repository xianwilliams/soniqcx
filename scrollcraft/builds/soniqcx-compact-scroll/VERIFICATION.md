# Compact scroll pass

User requested smaller full-width revenue and podcast sections, with cleaner,
more fluid scroll animation. Existing design, assets and interactions retained.
Headlines, stage dimensions, controls and vertical padding are reduced.

At 1440px, section heights changed from 1296→874px (revenue) and 1309→907px
(podcast). At 390px, heights changed from 991→805px and 1000→767px. Full-width
surfaces and 44px navigation controls are preserved.

A shared scroll driver unfolds the image stacks using translate, scale and
perspective while headlines move gently into place. The driver uses a 75ms
frame-rate-independent settle, then stops requesting frames. It does not pin,
hijack scrolling, extend page height, or update React state per frame. Pointer
movement uses a separate gentle 100ms settle and reduced tilt amplitude.

Replacement images decode before crossfading over the previous image, avoiding
blank flashes. Existing auto-rotation, selection, enlargement and YouTube feed
remain in place. Reduced motion and the site's motion switch resolve stages to
the static fully-open composition.

Production build, TypeScript and whitespace checks passed. Headless Chrome
verified both stages at three scroll positions: progress about .176, .646 and
1.000, with corresponding rendered transforms. Captured and inspected desktop,
phone and intermediate states. No overflow at 360/390/768/1920px. Delayed an
incoming image by 650ms and verified the previous artwork stayed visible until
replacement. Enlargement/Escape, tuner selection and reduced-motion static state
passed with no uncaught page errors. Physical iPhone/Safari not tested.
