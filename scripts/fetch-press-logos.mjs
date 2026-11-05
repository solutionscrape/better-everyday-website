// Downloads a logo for every outlet in src/data/placements/*.json into public/img/press/
// and writes src/data/press-logos.json, which the "As seen in" ticker reads.
// Outlets without a logo still show in the ticker as a name badge.
//
//   npm run fetch-press-logos            fetch logos that are missing
//   npm run fetch-press-logos -- --all   re-fetch every logo
//
// Needs normal internet access. Review the results: a few sites serve a generic or
// blank icon, and those are better replaced by hand. To use a hand-picked logo, save it as
// public/img/press/<key>.svg (or .png) and add "<key>": "/img/press/<key>.svg" to press-logos.json.
// Keys come from pressKey() in src/data/media.js.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pressKey } from '../src/data/press-key.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = root + 'public/img/press/';
const manifestPath = root + 'src/data/press-logos.json';
const refetch = process.argv.includes('--all');
const FAVICON_SERVICE = process.env.FAVICON_SERVICE || 'https://www.google.com/s2/favicons?sz=256&domain=';

// Outlets whose placement links go through a shared syndication host: their own domain.
const DOMAINS = {
  startribune: 'startribune.com',
  wralcom: 'wral.com',
  sandiegouniontribune: 'sandiegouniontribune.com',
  pittsburghpostgazette: 'post-gazette.com',
  internationalbusinesstimes: 'ibtimes.com',
  newsok: 'oklahoman.com',
  streetinsidercom: 'streetinsider.com',
  rockfordregisterstar: 'rrstar.com',
  concordmonitor: 'concordmonitor.com',
  fox47: 'fox47.com',
  fortwaynenbc: 'wpta21.com',
};
const SHARED_HOSTS = /financialcontent\.com|marketminute\.com|campusave\.com/;

const domainFor = (p) => {
  const key = pressKey(p.outlet);
  if (DOMAINS[key]) return DOMAINS[key];
  const host = new URL(p.url).host.replace(/^www\./, '');
  return SHARED_HOSTS.test(host) ? null : host;
};

async function tryFetch(url) {
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000) });
    const type = (res.headers.get('content-type') || '').split(';')[0];
    if (!res.ok || !/^image\//.test(type)) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 400) return null; // blank or 1×1 placeholder
    const ext = { 'image/svg+xml': 'svg', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/x-icon': 'ico', 'image/vnd.microsoft.icon': 'ico' }[type] || 'png';
    return { buf, ext };
  } catch {
    return null;
  }
}

const outlets = new Map();
for (const f of await readdir(root + 'src/data/placements/')) {
  if (!f.endsWith('.json')) continue;
  const d = JSON.parse(await readFile(root + 'src/data/placements/' + f, 'utf8'));
  for (const p of [...(d.broadcast || []), ...(d.national || []), ...(d.colorado || [])]) {
    const key = pressKey(p.outlet);
    if (!outlets.has(key)) outlets.set(key, p);
  }
}

let manifest = {};
try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')); } catch { /* first run */ }
await mkdir(outDir, { recursive: true });

let got = 0, missed = [];
for (const [key, p] of outlets) {
  if (manifest[key] && !refetch) continue;
  const domain = domainFor(p);
  if (!domain) { missed.push(p.outlet + ' (no domain)'); continue; }
  const logo = (await tryFetch(`https://${domain}/apple-touch-icon.png`)) || (await tryFetch(FAVICON_SERVICE + encodeURIComponent(domain)));
  if (!logo) { missed.push(p.outlet + ' (' + domain + ')'); continue; }
  const file = `${key}.${logo.ext}`;
  await writeFile(outDir + file, logo.buf);
  manifest[key] = '/img/press/' + file;
  got++;
  console.log('✓', p.outlet, '←', domain);
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(manifestPath, JSON.stringify(sorted, null, 1) + '\n');
console.log(`\n${got} logo(s) saved, ${Object.keys(sorted).length} in press-logos.json.`);
if (missed.length) console.log(`No logo for ${missed.length}:\n  ` + missed.join('\n  '));
