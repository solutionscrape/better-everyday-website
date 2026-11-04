// Turns a media-distribution results export (.xlsx, e.g. from NewsUSA) into placement data
// the site can show. Usage:
//
//   npm run import-placements -- <report.xlsx> <media-id>
//
// Writes src/data/placements/<media-id>.json with the report's headline stats, every
// Colorado / Denver-market placement (shown on the business site) and the largest national
// placements (shown on the speaking page). Then add or update the matching item in
// src/data/media.js. See docs/ADDING-MEDIA.md.
import ExcelJS from 'exceljs';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const [file, id] = process.argv.slice(2);
if (!file || !id || !/^[a-z0-9-]+$/.test(id)) {
  console.error('Usage: npm run import-placements -- <report.xlsx> <media-id>   (media-id: lowercase-with-dashes)');
  process.exit(1);
}

const NATIONAL_LIMIT = 40; // largest outlets kept for the national "As seen in" strip

const text = (v) => {
  if (v == null) return '';
  if (typeof v === 'object') return String(v.text ?? v.result ?? v.hyperlink ?? '').trim();
  return String(v).trim();
};
const num = (v) => {
  const n = Number(text(v).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
};

const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(file);
const ws = wb.worksheets[0];

// Header block: "Label:" in column A, value in column B.
const meta = {};
let headerRow = null;
ws.eachRow((row, r) => {
  const a = text(row.getCell(1).value);
  if (!headerRow && /^media outlet$/i.test(a)) headerRow = r;
  else if (!headerRow && a.endsWith(':')) meta[a.replace(/:$/, '').trim()] = text(row.getCell(2).value);
});
if (!headerRow) throw new Error('Could not find the "Media Outlet" header row.');

const cols = {};
ws.getRow(headerRow).eachCell((c, i) => { cols[text(c.value).toLowerCase()] = i; });
const col = (name) => Object.entries(cols).find(([k]) => k.startsWith(name))?.[1];
const C = { outlet: col('media outlet'), city: col('city'), state: col('state'), market: col('metro market'), reach: col('reach'), date: col('date') };

const placements = [];
for (let r = headerRow + 1; r <= ws.rowCount; r++) {
  const row = ws.getRow(r);
  const cell = row.getCell(C.outlet);
  const outlet = text(cell.value);
  if (!outlet) continue;
  const url = cell.hyperlink || (typeof cell.value === 'object' && cell.value?.hyperlink) || '';
  if (!/^https?:\/\//.test(url)) continue;
  // Skip malformed links and links to an outlet's homepage rather than the article itself.
  let parsed;
  try { parsed = new URL(url); } catch { continue; }
  if (parsed.pathname.replace(/\/+$/, '') === '' && !parsed.hash) continue;
  placements.push({
    outlet,
    city: text(row.getCell(C.city).value),
    state: text(row.getCell(C.state).value),
    market: text(row.getCell(C.market).value),
    reach: num(row.getCell(C.reach).value),
    date: text(row.getCell(C.date).value),
    url,
  });
}

// One entry per outlet (reports often list the same outlet twice), keeping the largest reach.
const key = (p) => p.outlet.toLowerCase().replace(/^the\s+/, '').replace(/[^a-z0-9]/g, '');
const unique = [...placements.reduce((m, p) => {
  const k = key(p);
  if (!m.has(k) || (p.reach || 0) > (m.get(k).reach || 0)) m.set(k, p);
  return m;
}, new Map()).values()];

const isColorado = (p) => p.state === 'CO' || /denver|colorado/i.test(p.market);
const byReach = (a, b) => (b.reach || 0) - (a.reach || 0);
const colorado = unique.filter(isColorado).sort(byReach);
const national = unique.filter((p) => !isColorado(p) && p.state.length === 2).sort(byReach).slice(0, NATIONAL_LIMIT);

const out = {
  story: meta['Story Title'] || '',
  distributed: meta['Distribution Date'] || '',
  stats: {
    placements: num(meta['Number of placements to date']) ?? placements.length,
    monthlyVisitors: num(meta['Cumulative unique visitors/month']),
    states: num(meta['Number of states reached']),
    metroMarkets: meta['Total US metro markets reached'] || '',
  },
  colorado,
  national,
};

const dir = fileURLToPath(new URL('../src/data/placements/', import.meta.url));
await mkdir(dir, { recursive: true });
await writeFile(dir + id + '.json', JSON.stringify(out, null, 1) + '\n');
console.log(`✓ ${id}: ${placements.length} placements read, ${colorado.length} Colorado/Denver outlets, ${national.length} national outlets kept.`);
