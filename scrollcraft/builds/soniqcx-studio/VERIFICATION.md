# Verification: broadcast studio and glass performance stage

## Observed before

Chrome showed the podcast opening far down the left half of the viewport while
the episode collection occupied the right half and overflowed. Root cause:
the page's main element shared `.podcast-editorial` with the homepage grid.

## Observed after

Native Chrome desktop screenshots inspected in the tool: the podcast masthead,
large SHIFT HAPPENS title and thumbnail studio render across the proper width.
The homepage performance section shows a centered active product screenshot,
two recessed translucent neighbors, double-edge glass frames, benefit plaques
and orbital lines. The controls and closing CTA remain in normal page flow.
Selecting Organizations changed the screenshot, caption, pressed-state tab and
pause control together. Clicking the active panel opened the corresponding
full-resolution screenshot dialog with its descriptive heading and close control.
One polish iteration removed the redundant added product bar because the real
screenshots already contain their own header.

## Automated checks

- `pnpm test:podcast`: parser, ordering, deduplication, official short-episode
  inclusion, fresh upload ingestion, concurrent request coalescing, cache failure,
  official Atom fallback, offline fallback, combined topic/search filtering.
- `pnpm exec tsc --noEmit`: passed.
- Targeted ESLint: no errors; five existing-pattern image-element warnings. These
  are optimized local WebP screenshots/thumbnails, with live YouTube thumbnails
  for new uploads.
- `pnpm build`: all five Vinext phases passed.
- Local production Worker at port 8788: `scripts/test-experiences.mjs` checks
  server rendering, scoped block layout, no audio/video/iframe in podcast main,
  rendered discovery controls, production CSS, product images and homepage controls.
  A rebuild while the old Worker process was running initially returned obsolete
  stylesheet hashes; restarting the Worker against the rebuilt files resolved
  that smoke-test failure, and the complete test then passed.
- Actual local `/api/podcast`: returned `fresh: true`, a current `checkedAt`,
  and 12 episodes. Refresh runs on entry, every five minutes while visible,
  tab return and network reconnection. New uploads still depend on YouTube
  exposing them and the next successful upstream check; this is not a webhook.

## Limits

After desktop verification, native browser inspection stopped returning
accessibility content or screenshots, including after reconnect/reset and a
fresh window. Responsive phone rules and reduced-motion behavior were inspected
in source, but this run could not complete phone or reduced-motion visual QA.
No real-phone testing or formal accessibility audit is claimed. The production
smoke test cannot prove visual polish or interaction geometry.

No generated images, new packages, changed authentication or audience changes.
The original Scrollcraft engine and publishing framework remain untouched.

## Public deployment

The existing public Site accepted the built archive and reported a successful
deployment. Its `/api/podcast` returned fresh YouTube content. Sites serves WebP
with `application/octet-stream`; the smoke test now verifies RIFF/WEBP payload
signatures directly rather than relying on the header. This also rejects HTML
error pages incorrectly returned with status 200.
