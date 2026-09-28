import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {runInNewContext} from 'node:vm';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const source = readFileSync(new URL('../app/chrome.tsx', import.meta.url), 'utf8');
const code = ts.transpileModule(source, {
  compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true},
}).outputText;
const module = {exports: {}};
const passthrough = ({children}) => React.createElement('div', null, children);
runInNewContext(code, {
  module, exports: module.exports,
  require(name) {
    if (name === 'next/navigation') return {usePathname: () => '/about'};
    // Render both navigation surfaces; portal/focus behavior is checked in-browser.
    if (name.startsWith('@/components/ui/')) return new Proxy({}, {get: () => passthrough});
    if (name.startsWith('./')) return {__esModule: true, default: passthrough};
    return require(name);
  },
});
const html = renderToStaticMarkup(React.createElement(module.exports.Chrome));
const desktop = html.match(/<nav[^>]*class="desktop-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
const mobile = html.match(/<nav[^>]*aria-label="(?:All pages|Mobile navigation)"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
assert.ok(desktop && mobile, 'Both desktop and hamburger navigation must render');
const links = markup => [...markup.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
  .map(([, href, content]) => ({href, label: content.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '').trim()}));
assert.deepEqual(links(mobile), links(desktop), 'Hamburger menu must match desktop link labels, destinations and order');
assert.ok(!links(mobile).some(link => link.href === '/voice-ai'), 'Voice AI must not appear in the hamburger menu');
const desktopCTA = html.match(/<a[^>]*class="nav-cta"[^>]*href="([^"]+)"/);
const mobileCTA = html.match(/<div class="menu-foot">([\s\S]*?)<\/div>/)?.[1];
assert.deepEqual(links(mobileCTA), [{href: desktopCTA[1], label: 'Schedule a call'}], 'Mobile call action must match desktop without extra navigation');
console.log('Desktop and hamburger navigation labels, order, destinations and call action match.');
