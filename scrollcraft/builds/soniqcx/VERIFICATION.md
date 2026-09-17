# Verification · 11 September 2026

## Scope

Reviewed the actual managed Sites preview, using the controlled browser. This is an existing Site update saved as a version; no production deployment was requested or performed. The temporary phone-review route was removed from final source. Native scroll, semantic HTML, local fonts, and the unmodified Scrollcraft runtime are preserved.

## Evidence and findings

| Check | Observed result |
|---|---|
| Desktop opening, 1363 × 929 | Complete headline and action visible immediately. Brand-native Q renders automatically; no play gate or audio. |
| Hero intermediate scroll | Opening, separated layers, and resolved states inspected. A washed-out transition around p=0.43 was found in the early pass. After shortening the fade, rerun at p=0.427 showed outgoing opacity 0, incoming opacity 1, and visibly separated layers. |
| Phone layout | Actual page rendered inside 390 × 844 and 360 × 640 CSS viewports. Opening copy, action, and lower Q composed separately from desktop. Expanded and resolved compact states inspected. These are viewport checks, not physical-device tests. |
| Approach | Anchor landed beneath the fixed header. Retain accordion opened the matching content and closed Convert. Compact navigation opened and navigated to the approach. |
| Intelligence | Heading, explanation, action and four dimensional workflow layers visually inspected. |
| People | Supplied Justin studio poster loaded and displayed. Added a real text name and role alongside the photograph. |
| Closing | Initial line splitter joined TALK and REVENUE. Replaced with separate explicitly authored lines and spacing. Final rerun showed “LET’S TALK REVENUE.” in DOM, both kinetic lines at opacity 1, correct visible lines, and no horizontal overflow. |
| Mobile drawer | Opened; all expected destinations visible. Escape closed the drawer (dialog count 0). Section selection closed it and reached the approach. |
| Reduced motion | In-page control tested at phone width. Pin removed, both hero messages remained visible in ordinary reading order, and motion could be re-enabled. OS preference is read on initialization and changes. |
| Asset loading | All three visible page image elements reported complete with nonzero natural width. Fonts and logo loaded locally. No document horizontal overflow in desktop opening and final views. |
| External links | Routes taken from SONIQCX official site, including Calendly, AI, company, careers, courtroom, agent/admin portals and legal pages. No bookings, portal logins or messages submitted. |
| Build | Final Vinext production build and TypeScript no-emit check both exited 0. Build reports a large dynamically loaded Three.js chunk; it does not gate HTML or the CSS 3D fallback. |

## WebGL and device limitations

The review browser reports its GPU disabled and rejects WebGL context creation. This is preserved as a verification limitation, not reported as a successful WebGL render. The implemented WebGL renderer is typechecked and included in the successful production build; its actual materials and frame rate still require a GPU-enabled device review. The no-WebGL path was directly observed: it is a nine-plane CSS 3D assembly derived from the exact Q, sharing the scroll pose with the WebGL scene. It starts without interaction and preserves navigation and reading.

Physical iPhone/Safari, low-power behavior, GPU performance and WebGL context restoration have not been exercised. There is no video decoder or autoplay dependency. No claim of a full automated accessibility audit or Scrollcraft shoot.mjs harness pass is made; the environment uses the controlled browser rather than local Chrome. JavaScript-disabled reading CSS is included but that mode was not simulated in this browser.

## Provenance

- Brand, current typeface, company offer and destination links: https://www.soniqcx.com/
- Company: https://www.soniqcx.com/about.php
- Technology: https://www.soniqcx.com/technology-ai.php
- Q and wordmark: official website brand assets.
- Justin Jones studio poster: user-supplied project reference.
- Archivo fonts: Google Fonts, included SIL Open Font License in `public/assets/archivo-OFL.txt`.
- Scrollcraft: https://github.com/nateherkai/scroll-craft/tree/main/plugins/nateherk-design/skills/scroll-craft
