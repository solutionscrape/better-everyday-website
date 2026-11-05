// Downloads a logo for every outlet in src/data/placements/*.json into public/img/press/
// and writes src/data/press-logos.json, which the "As seen in" ticker reads.
// Outlets without a logo still show in the ticker as a name badge.
//
//   npm run fetch-press-logos            fetch logos that are missing
//   npm run fetch-press-logos -- --all   re-fetch every logo
//
// Needs normal internet access. Logos smaller than MIN_SIZE are rejected, and SKIP lists
// outlets whose sites serve a wrong or generic icon. Review new results: replace bad ones by hand. To use a hand-picked logo, save it as
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
};

// Outlets whose sites serve a wrong or generic icon; they show as a name badge instead.
const SKIP = new Set(['fortwaynenbc', 'khqtvnbc', 'kulrtvnbc', 'hometownsource', 'killeendailyherald', 'coasttv', 'coloradocannabistimes']);
// Smallest acceptable logo edge in pixels; smaller favicons look blurry in the ticker.
const MIN_SIZE = 48;
const SHARED_HOSTS = /financialcontent\.com|marketminute\.com|campusave\.com/;

const domainFor = (p) => {
  const key = pressKey(p.outlet);
  if (DOMAINS[key]) return DOMAINS[key];
  const host = new URL(p.url).host.replace(/^www\./, '');
  return SHARED_HOSTS.test(host) ? null : host;
};

/** Pixel size of a PNG, JPEG or WebP image, or null. */
function imageSize(b) {
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (b[0] === 0xff && b[1] === 0xd8) {
    for (let i = 2; i + 9 < b.length;) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1], len = b.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xc3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      i += 2 + len;
    }
  }
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const f = b.toString('ascii', 12, 16);
    if (f === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
    if (f === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    if (f === 'VP8L') { const v = b.readUInt32LE(21); return [1 + (v & 0x3fff), 1 + ((v >> 14) & 0x3fff)]; }
  }
  return null;
}

const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };

/** Fetch an image; keep it only if it is a PNG/JPEG/WebP at least MIN_SIZE pixels on each side. */
async function tryFetch(url) {
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'Mozilla/5.0 (press-logo fetcher)' } });
    const type = (res.headers.get('content-type') || '').split(';')[0].trim();
    if (!res.ok || !EXT[type]) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const size = imageSize(buf);
    if (!size || Math.min(...size) < MIN_SIZE) return null;
    return { buf, ext: EXT[type] };
  } catch {
    return null;
  }
}

/** Icon URLs a site declares in its homepage <head>, largest first. */
async function declaredIcons(domain) {
  try {
    const res = await fetch(`https://${domain}/`, { redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'Mozilla/5.0 (press-logo fetcher)' } });
    if (!res.ok) return [];
    const html = (await res.text()).slice(0, 400000);
    const base = res.url;
    const out = [];
    for (const tag of html.match(/<link\b[^>]*>/gi) || []) {
      const rel = (tag.match(/rel=["']([^"']+)["']/i) || [])[1] || '';
      if (!/icon/i.test(rel)) continue;
      const href = (tag.match(/href=["']([^"']+)["']/i) || [])[1];
      if (!href || /\.svg(\?|$)/i.test(href)) continue;
      const sizes = (tag.match(/sizes=["'](\d+)x\d+["']/i) || [])[1];
      out.push({ url: new URL(href, base).href, size: Number(sizes) || (/apple/i.test(rel) ? 180 : 0) });
    }
    for (const m of html.matchAll(/<meta\b[^>]*name=["']msapplication-TileImage["'][^>]*content=["']([^"']+)["']/gi)) out.push({ url: new URL(m[1], base).href, size: 144 });
    return out.sort((a, b) => b.size - a.size).map((x) => x.url);
  } catch {
    return [];
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
  if ((manifest[key] && !refetch) || SKIP.has(key)) continue;
  const domain = domainFor(p);
  if (!domain) { missed.push(p.outlet + ' (no domain)'); continue; }
  const candidates = [...(await declaredIcons(domain)), `https://${domain}/apple-touch-icon.png`, FAVICON_SERVICE + encodeURIComponent(domain)];
  let logo = null;
  for (const url of candidates) if ((logo = await tryFetch(url))) break;
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
