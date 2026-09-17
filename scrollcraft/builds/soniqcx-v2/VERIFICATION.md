# SONIQCX v2 verification

2026-09-11. Same Site identity and private audience. Replaces the incomplete Q-led build.

## Coverage and behavior
- Retrieved all 45 sitemap entries plus the navigation-only careers and courtroom pages: 47 original pages. Full mapping and original section headings in CONTENT-MAP.md.
- Added /team and /resources. Preserved all 36 service/industry/pricing pages and all 352 original service FAQ controls with native details/summary.
- Browser route audit: 60/60 canonical and legacy URLs return 200 with exactly one h1. routes.json contains the complete results, titles, and image paths.
- All five official portraits verified against the original site. Founder image is the original portrait without the previously baked-in promotional text. All five full biography dialogs open and close, including Benjamin Bohman's long, scrollable biography. Results in biographies.json.
- Careers contains original fields, position choices, resume and audio attachments, and an unchecked newsletter opt-in. Local validation and an empty API request return a clear 400 error. Backend only reports success when the real recruitment service confirms success. No applicant data or test application was sent externally; end-to-end delivery therefore remains untested.
- Both booking destinations, demo phone number, and agent/admin portals are preserved from the official source. No booking or call was made during review.

## Visual review
- Reviewed all principal page openings: home, AI, Voice AI, Why SONIQCX, courtroom, about, team, careers, contact, resource index, value proposition, privacy, and terms. Sampled long-form service layouts, comparison structures, and expanded FAQs.
- Desktop home opening, diagnostic spread, intermediate and resolved signal states inspected. Official images load correctly; typography is crisp, and the old pixelated Q scene is removed.
- Phone frames: 390 x 844 and compact 360 x 640. The mobile composition has a stacked headline, lower signal field, usable menu, and readable type. This is Chromium viewport-frame review, not a physical iOS/Safari test.
- Phone home and service page document widths equal their scroll widths (380 px content width with the review browser's scrollbar). No sideways overflow in these checks.
- At phone scroll Y=3040, signal stage is sticky at top=0, height=844, parent=1477; labels remain in view. Motion-off switches parent/stage to 750 px with position:relative, resolves the canvas, and reveals all textual content.
- Verified mobile full menu navigation to Voice AI, native application validation, actual phone link, five dialogs, and service FAQ expand controls.
- Representative screenshots are in evidence/. The temporary viewport and route audit page is removed from the delivered site.

## Technical checks and limits
- Final Sites production build and TypeScript checks pass. Temporary QA assets removed from source and deployment output.
- No site JavaScript errors observed during reviewed states. Browser extension metadata errors are unrelated to the site.
- Canvas uses native pixel density capped at 2, pauses offscreen, avoids generated imagery, and honors reduced motion. Abstract traces do not represent measured audio or live telemetry.
- Source marketing claims and legal wording are retained, not independently verified. The source legal pages retain their original placeholder phone number, recorded in CONTENT-MAP.md.
- Scrollcraft engine copied unchanged; four-plus distinct motion families implemented; fingerprint differs in all six dimensions from the rejected first build.
