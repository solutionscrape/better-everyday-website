// Builds one printable topic sheet (PDF) per speaking topic into public/speaking/.
// Run after editing TOPICS in src/data/speaking.js:   npm run topic-pdfs
// Needs Playwright with Chromium (npm i -D playwright && npx playwright install chromium).
import { mkdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { TOPICS, FORMATS, SPEAKER, CREDENTIALS } from '../src/data/speaking.js';
import { CONTACT } from '../src/data/site.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = root + 'public/speaking/';
await mkdir(outDir, { recursive: true });

const font = async (pkg, file) => (await readFile(root + `node_modules/@fontsource/${pkg}/files/${file}`)).toString('base64');
const fonts = {
  d600: await font('barlow-condensed', 'barlow-condensed-latin-600-normal.woff2'),
  d700: await font('barlow-condensed', 'barlow-condensed-latin-700-normal.woff2'),
  b400: await font('inter', 'inter-latin-400-normal.woff2'),
  b600: await font('inter', 'inter-latin-600-normal.woff2'),
};
const logo = (await readFile(root + 'public/img/be-mark.png')).toString('base64');
const photo = (await readFile(root + 'public/img/james-anderson-cscs-headshot-dark-stripes.jpg')).toString('base64');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const page = (t, i) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:D;font-weight:600;src:url(data:font/woff2;base64,${fonts.d600})}
@font-face{font-family:D;font-weight:700;src:url(data:font/woff2;base64,${fonts.d700})}
@font-face{font-family:B;font-weight:400;src:url(data:font/woff2;base64,${fonts.b400})}
@font-face{font-family:B;font-weight:600;src:url(data:font/woff2;base64,${fonts.b600})}
@page{size:Letter;margin:0}
*{box-sizing:border-box}
body{margin:0;font-family:B,Arial,sans-serif;color:#111827;font-size:10.5pt;line-height:1.55}
.sheet{width:8.5in;height:10.98in;overflow:hidden;display:grid;grid-template-rows:auto 1fr auto}
header{background:#101012;color:#fff;padding:.5in .6in .45in;display:grid;grid-template-columns:1fr 1.45in;gap:.35in;align-items:end;border-bottom:6px solid #fc1111}
.brand{display:flex;align-items:center;gap:10px;margin-bottom:.32in}
.brand img{height:30px}
.brand span,.kick,h1,h2,.label{font-family:D,'Arial Narrow',sans-serif;text-transform:uppercase}
.brand span{font-weight:700;font-size:10pt;letter-spacing:.06em;line-height:1.05}
.kick{font-weight:600;letter-spacing:.2em;font-size:8.5pt;color:#ff4d4d;margin:0 0 8px}
h1{font-weight:700;font-size:34pt;line-height:.95;letter-spacing:.01em;margin:0}
.who{margin:12px 0 0;color:#b9c1cb;font-size:9.5pt}
header .photo{width:1.45in;height:1.75in;object-fit:cover;border:1px solid #4b5563}
main{padding:.45in .6in;display:grid;grid-template-columns:1.25fr 1fr;gap:.45in;align-content:start}
h2{font-weight:700;font-size:13pt;letter-spacing:.02em;margin:0 0 8px;border-bottom:1px solid #111827;padding-bottom:6px}
p{margin:0 0 12px}
ul{margin:0 0 16px;padding:0;list-style:none}
li{position:relative;padding-left:16px;margin:0 0 8px}
li:before{content:"";position:absolute;left:0;top:.55em;width:6px;height:6px;background:#fc1111}
.label{font-weight:600;font-size:8.5pt;letter-spacing:.18em;color:#4b5563;margin:0 0 4px}
.box{background:#f5f7fa;border-left:4px solid #fc1111;padding:14px 16px;margin-bottom:16px}
footer{background:#101012;color:#fff;padding:.32in .6in;display:flex;justify-content:space-between;align-items:center;gap:20px}
footer .cta{font-family:D,sans-serif;font-weight:700;text-transform:uppercase;font-size:15pt;letter-spacing:.02em}
footer .contact{text-align:right;font-size:9.5pt;line-height:1.6}
footer .contact b{color:#1e90d4;font-weight:600}
</style></head><body><div class="sheet">
<header><div>
  <div class="brand"><img src="data:image/png;base64,${logo}" alt=""><span>Better Everyday<br>Athletics</span></div>
  <p class="kick">Topic ${String(i + 1).padStart(2, '0')} · ${esc(t.label)}</p>
  <h1>${esc(t.title)}</h1>
  <p class="who">James Anderson · ${esc(SPEAKER.roles)}</p>
</div><img class="photo" src="data:image/jpeg;base64,${photo}" alt=""></header>
<main>
  <section>
    <h2>The talk</h2>
    <p>${esc(t.desc)}</p>
    <h2>Takeaway</h2>
    <ul>${t.takeaways.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>
    <h2>About James</h2>
    <p>${esc(SPEAKER.about)}</p>
    <p class="label">Credentials</p>
    <p>${CREDENTIALS.map(esc).join(' · ')}</p>
  </section>
  <aside>
    <div class="box"><p class="label">Best for</p><p style="margin:0">${esc(t.audience)}</p></div>
    <p class="label">Formats</p>
    <ul>${FORMATS.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
    <div class="box"><p class="label">Availability</p><p style="margin:0">In person or virtual. National, virtual and co-op events are welcome.</p></div>
  </aside>
</main>
<footer><span class="cta">Invite James to speak</span>
  <span class="contact"><b>${esc(CONTACT.speakingEmail)}</b><br>${esc(CONTACT.phone)}</span></footer>
</div></body></html>`;

// require() also finds a globally installed Playwright (NODE_PATH); ESM import() does not.
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
const tab = await browser.newPage();
for (const [i, t] of TOPICS.entries()) {
  await tab.setContent(page(t, i), { waitUntil: 'load' });
  await tab.evaluate(() => document.fonts.ready);
  const file = outDir + t.pdf.split('/').pop();
  await tab.pdf({ path: file, format: 'Letter', printBackground: true });
  console.log('✓', t.pdf);
}
await browser.close();
