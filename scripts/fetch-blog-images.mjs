// Downloads the blog post photos that still live on Squarespace into public/img/blog/
// and rewrites src/data/blog-posts.json to point at the local copies.
// Run once before the Squarespace account is closed:  npm run fetch-blog-images
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dataPath = root + 'src/data/blog-posts.json';
const outDir = root + 'public/img/blog/';

const posts = JSON.parse(await readFile(dataPath, 'utf8'));
await mkdir(outDir, { recursive: true });

let changed = 0;
for (const p of posts) {
  if (!p.img || !/^https?:/.test(p.img)) continue;
  const m = p.img.split('?')[0].match(/\.(jpe?g|png|webp)$/i);
  const file = p.slug + '.' + (m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg');
  const res = await fetch(p.img);
  if (!res.ok) { console.error(`✗ ${p.slug}: HTTP ${res.status}`); continue; }
  await writeFile(outDir + file, Buffer.from(await res.arrayBuffer()));
  p.img = '/img/blog/' + file;
  changed++;
  console.log('✓', file);
}

if (changed) await writeFile(dataPath, JSON.stringify(posts));
console.log(`${changed} image(s) saved.`);
