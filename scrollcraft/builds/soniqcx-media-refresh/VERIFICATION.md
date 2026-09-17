# Media refresh verification — 2026-09-17

Production build and TypeScript check passed. `pnpm test:podcast` passed:
current and legacy YouTube renderers, official playlist inclusion, new long
conversations, newest-first ordering, deduplication, request coalescing, cache
reuse, malformed responses, and offline fallback.

Chrome/Playwright checked home, podcast and Why SONIQCX at 360, 390, 768 and
1440px widths: no horizontal page overflow or uncaught page errors. Visually
reviewed screenshots are in `screenshots/`. The Q fits above the next section,
copy sits inside it, the conversation heading has three lines, all five supplied
screenshots are accessible, and the comparison table is readable.

Functional checks passed: screenshot next/previous and enlargement, dialog
Escape, booking dialog, film automatic playback/pause/resume and offscreen
pause, belt movement and pause, podcast search and empty results, removed AI
routes returning 404, reduced-motion static belt and paused video. No booking
or recruitment submission was sent. No physical-device Safari test was run.

`performance.json` records the final local production Lighthouse mobile run.
All three pages scored 100 accessibility, zero CLS and zero TBT. Performance
scores were 90–95. LCP was 2.6–3.3 seconds, above the 2.5-second good threshold;
this is an improvement, not a claim of passing field Core Web Vitals. Real-user
75th-percentile metrics need post-publication traffic measurement.

Optimizations: subset variable WOFF2 font with preload, scoped Tailwind scanning,
responsive WebP demo screenshots, optimized current episode thumbnails,
viewport-loaded H.264 film with encoded quick fade-to-black, no autoplay YouTube
iframe, 30fps capped decorative canvases, static inner-page Q, offscreen and
hidden-tab motion suspension, and no unused scroll-scrubbing engine download.

Podcast feed checks run on entry, every five minutes while visible, and when the
tab becomes active. Edge/server caching also lasts five minutes. YouTube outages
retain known episodes. New uploads do not require rebuilding. Optimized existing
thumbnail files are snapshots; newly discovered episodes use live YouTube images.
