import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';

// Exercise the server parser and cache without relying on YouTube availability.
const source = readFileSync(new URL('../app/podcast/feed.ts', import.meta.url), 'utf8')
  .replace("import fallback from './episodes.json';", `const fallback = ${readFileSync(new URL('../app/podcast/episodes.json', import.meta.url), 'utf8')};`);
const code = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022}}).outputText;
const moduleURL = `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const {parseEpisodes, getEpisodes} = await import(moduleURL);
const video = (id, duration = '30:00') => ({lockupViewModel: {
  contentType: 'LOCKUP_CONTENT_TYPE_VIDEO', contentId: id,
  metadata: {lockupMetadataViewModel: {title: {content: `Episode ${id}`}}},
  contentImage: {thumbnailViewModel: {image: {sources: [{url: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`}]}, overlays: [{thumbnailBottomOverlayViewModel: {badges: [{thumbnailBadgeViewModel: {text: duration}}]}}]}}
}});
const html = data => `<script>var ytInitialData = ${JSON.stringify(data)};</script>`;
const latest = 'newVideo001', previous = 'oldVideo002', short = 'shortVid003';
const channel = html([video(latest), video(previous), video(latest), video(short, '8:00')]);
assert.deepEqual(parseEpisodes(channel).map(e => e.id), [latest, previous]);
assert.deepEqual(parseEpisodes(channel, new Set([short])).map(e => e.id), [latest, previous, short]);
assert.throws(() => parseEpisodes('Unavailable'), /unavailable/);
assert.throws(() => parseEpisodes(html([video(short, '0:45')])), /No episodes/);
const legacy = html({videoRenderer: {videoId: previous, title: {runs: [{text: 'Older episode'}]}, lengthText: {simpleText: '24:10'}, thumbnail: {thumbnails: [{url: `https://i.ytimg.com/vi/${previous}/hqdefault.jpg`}]}}});
assert.equal(parseEpisodes(legacy)[0].title, 'Older episode');
const originalFetch = globalThis.fetch;
let requests = 0;
try {
  globalThis.fetch = async url => {requests++; return new Response(String(url).includes('/playlist?') ? `"videoId":"${short}"` : channel);};
  const [first, second] = await Promise.all([getEpisodes(), getEpisodes()]);
  assert.equal(first.fresh, true);
  assert.equal(first.episodes[0].id, latest);
  assert.equal(first.episodes.at(-1).id, short);
  assert.deepEqual(first, second);
  await getEpisodes();
  assert.equal(requests, 2, 'Concurrent and cached reads must not refetch YouTube');
  const isolated = await import(moduleURL + '#offline');
  globalThis.fetch = async () => {throw new Error('offline');};
  const offline = await isolated.getEpisodes();
  assert.equal(offline.fresh, false);
  assert.ok(offline.episodes.length > 0, 'An upstream outage must retain clickable episodes');
} finally {globalThis.fetch = originalFetch;}
console.log('Podcast parser, official short-episode inclusion, deduplication, ordering, request coalescing, cache and outage fallback passed.');
