# SONIQCX: broadcast studio and glass performance stage

Self-authored under explicit creative delegation: the user asked to fix the broken podcast page, make it dynamic and award-caliber, and supplied two visual references for the performance section.

User constraints: thumbnail-first episodes, no autoplay, automatic YouTube updates. For Performance Based CX, retain animation and use the reference images' transparency, depth, borders and small effects. Use the existing Next.js/Vinext source and Site.

## Direction

The podcast should feel curious, confident and alive because it features people moving business forward, expressed through a broadcast masthead and an operable episode tuner. Existing Archivo, SONIQ blue and dark navy carry the identity. Real supplied YouTube thumbnails and SONIQ PULSE screenshots are the assets. No generated assets.

This is a short broadcast-library grammar, not a continuous journey. Shared site navigation stays. The title opens the show, the studio lets the visitor choose a conversation, a searchable catalog provides breadth, and the YouTube channel invitation resolves the visit. No pinned scroll or hidden content. A photo-led split opening was considered but the large show title gives the podcast its own identity.

## Feeling curve and peak

Recognition: oversized SHIFT HAPPENS masthead with restrained signal bars.
Curiosity: choose a thumbnail or turn the episode dial; title, image, duration and destination change together. This operable studio is the peak and receives the largest designed opening region.
Discovery: search and topic filters make the real episode collection usable.
Anticipation: a blue, held invitation to explore the YouTube channel.

Tell-someone sentence: It's the site where you tune into a conversation before choosing to watch it.

Performance section: clarity in the headline, depth as three real workspaces fan out, agency as a visitor chooses one or opens its full-resolution detail. User reference 2 supplies the glass-stage composition. Fine-pointer tilt, natural scroll assembly, orbiting signal points and faint particles bring it to life; touch has a large central screen and swipe. No autoplay audio or video. Motion-off retains the entire composition and manual controls.

## Layers and behavior

Background: navy atmosphere and sparse floating particles, separate from stable text.
Midground: orbital lines and signal points, with small pointer response.
Subject: persistent actual product panels on an animated perspective track.
Near layer: translucent double frames with edge highlights and offset shadows.
Labels: three compact benefit plaques outside the central screenshot.
Controls: stable selector, previous/next/pause buttons, and detail dialog.

Device score: signal motion → pointer-depth studio and user-controlled tuner → natural-flow searchable catalog → held typographic close. Performance uses natural-scroll depth, orbital motion, perspective carousel and explicit full-resolution inspection. No empty scroll spans.

Fingerprint: the broadcast-library differs from every existing row in grammar, hero, sequence, close and signature move (5/6); shared site navigation is intentionally retained. Other grammars would impose a sales argument, cinematic journey or app shell on a page whose actual job is episode discovery.

## Engineering diagnosis

The old podcast main reused `.podcast-editorial`, the homepage two-column component class. Its three sections became grid cells. Route-local CSS Modules remove the collision. The existing feed refreshes on entry, every five minutes and tab return; the revised page observes the whole main so refreshing continues while browsing its library. Reconnection retries, coalesced client refresh and bypassed browser caching support recovery. Server caching and official Atom fallback remain intact.
