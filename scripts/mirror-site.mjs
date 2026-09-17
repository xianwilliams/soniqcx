import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const origin = "https://soniqcx-experience.aballok.chatgpt.site";
const outDir = path.join(process.cwd(), "public");
const seen = new Set();
const queued = ["/"];
const pagePaths = new Set(["/"]);

const assetPattern =
  /(?:href|src)=["']([^"']+)["']|url\(["']?([^"')]+)["']?\)|href:\s*["']([^"']+)["']/g;

function normalizeUrl(raw, basePath = "/") {
  const value = raw?.trim();
  if (!value || value.startsWith("#") || value.startsWith("data:") || value.startsWith("mailto:") || value.startsWith("tel:")) {
    return null;
  }
  const url = new URL(value, new URL(basePath, origin));
  if (url.origin !== origin) return null;
  return `${url.pathname}${url.search}`;
}

function outputPath(urlPath, contentType = "") {
  const pathname = new URL(urlPath, origin).pathname;
  const mirroredPathname = pathname.startsWith("/_next/")
    ? `/legacy${pathname}`
    : pathname;
  if (contentType.includes("text/html") || pathname === "/" || !path.extname(pathname)) {
    return path.join(outDir, mirroredPathname, "index.html");
  }
  return path.join(outDir, mirroredPathname);
}

async function save(urlPath, body, contentType) {
  const file = outputPath(urlPath, contentType);
  await mkdir(path.dirname(file), { recursive: true });
  const recoveredHtml = contentType.includes("text/html")
    ? body.toString("utf8").replaceAll("/_next/", "/legacy/_next/")
    : body;
  await writeFile(file, recoveredHtml);
  return file;
}

async function fetchAndSave(urlPath) {
  if (seen.has(urlPath)) return;
  seen.add(urlPath);

  const response = await fetch(new URL(urlPath, origin));
  if (!response.ok) {
    console.warn(`skip ${urlPath}: ${response.status}`);
    return;
  }

  const contentType = response.headers.get("content-type") || "";
  const bytes = Buffer.from(await response.arrayBuffer());
  await save(urlPath, bytes, contentType);

  if (!contentType.includes("text/html") && !contentType.includes("text/css") && !contentType.includes("javascript")) return;

  const text = bytes.toString("utf8");
  for (const match of text.matchAll(assetPattern)) {
    const next = normalizeUrl(match[1] || match[2] || match[3], urlPath);
    if (!next || seen.has(next)) continue;
    queued.push(next);
    if (!path.extname(new URL(next, origin).pathname)) pagePaths.add(new URL(next, origin).pathname);
  }
}

while (queued.length) {
  const next = queued.shift();
  await fetchAndSave(next);
}

await writeFile(
  path.join(process.cwd(), "mirror-manifest.json"),
  `${JSON.stringify({ origin, fetched: [...seen].sort(), pages: [...pagePaths].sort() }, null, 2)}\n`,
);

console.log(`Mirrored ${seen.size} files from ${origin}`);
