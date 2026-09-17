<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Shared SONIQCX source and Sites publishing

This repository is the editable source for the existing SONIQCX Site:
https://soniqcx-experience.aballok.chatgpt.site

- Reuse `.openai/hosting.json` and its existing project ID. Never create a replacement Site.
- The `sites` Git remote is the Site's source repository; `main` is the shared branch. This is a Vinext/Cloudflare Workers project. Preserve its pnpm lockfile, framework scripts, and build plugin. Do not restore the old HTML mirror or proxy.
- The user wants to work interchangeably in VS Code and ChatGPT/Sites, with this source driving the published site. For requested website changes, sync the shared source, implement, validate, and publish to the existing public Site unless the user asks for local-only work or no publishing.
- Before editing, obtain a short-lived source credential through Sites if needed, fetch `sites/main`, inspect local changes, and reconcile remote changes without discarding user work. Prefer fast-forward updates; resolve divergence without force-pushing. Unsaved or unpushed local edits are not visible to a remote Sites session.
- Use the Sites building and hosting skills. Pass credentials only through per-command HTTP authorization. Never store tokens in files, remote URLs, Git configuration, or credential helpers.
- After a successful build, commit and push the exact source, package that revision, save a Sites version, deploy it with the existing audience, and verify deployment success. A Git push alone does not publish this public Site. If source or deployment access is unavailable, report that limitation rather than claiming the site updated.
- The available publish-on-push option is owner-private and time-limited; do not enable it for this public Site or change its audience to obtain automation.
- When working in ChatGPT on this computer, use this checkout. When working in a separate Sites checkout, push changes to the same Site source branch; fetch those changes here before the next local edit.

The original downloaded mirror is preserved on the local `backup/pre-sites-connection` branch.
