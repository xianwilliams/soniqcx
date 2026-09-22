import assert from 'node:assert/strict';

// Run against the production Worker, not only the development transform.
const origin = process.argv[2] || 'http://127.0.0.1:8788';
async function read(path) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, `${path} must load`);
  return response.text();
}
const html = await read('/podcast');
const main = html.match(/<main\b[^>]*class="([^"]+)"[^>]*>([\s\S]*?)<\/main>/);
assert.ok(main, 'The podcast must render its content on the server');
assert.ok(!main[1].split(' ').includes('podcast-editorial'), 'The page must not inherit the homepage component grid');
assert.doesNotMatch(main[2], /<(?:video|audio|iframe)\b/i, 'Podcast browsing must remain thumbnail-only, with no media player');
assert.match(main[2], /Choose featured episode/);
assert.match(main[2], /Search podcast episodes/);
const stylesheetURLs = [...html.matchAll(/<link\b(?=[^>]*rel="stylesheet")[^>]*href="([^"]+)"/g)].map(match => match[1]);
assert.ok(stylesheetURLs.length, 'Production stylesheets must be included');
const css = (await Promise.all(stylesheetURLs.map(read))).join('\n');
const escaped = main[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pageRule = css.match(new RegExp('\\.' + escaped + '\\s*\\{([^}]+)\\}'));
assert.ok(pageRule, 'The page root must have isolated CSS');
assert.match(pageRule[1], /display:\s*block/, 'The podcast sections must stack, not form side-by-side grid columns');
for (const path of ['/assets/episode-YK89SMqFlFY.webp', '/assets/pulse-3-800.webp', '/assets/pulse-3-1440.webp']) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, `${path} must load`);
  assert.match(response.headers.get('content-type') || '', /image\//);
  await response.body.cancel();
}
const home = await read('/');
assert.match(home, /SONIQ PULSE product screenshots/);
assert.match(home, /Pause screenshot rotation/);
assert.match(home, /Explore the performance workspace/);
console.log('Production layout isolation, thumbnail-only podcast, controls, stylesheets, and product assets passed.');
