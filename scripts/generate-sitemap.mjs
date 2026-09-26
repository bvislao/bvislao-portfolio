/**
 * Writes public/sitemap.xml.
 *
 * Generated as a static file rather than an Astro endpoint because Vite claims
 * `*.xml.ts` routes as XML assets. A single-page portfolio does not need
 * dynamic routes, and a build step keeps `lastmod` accurate.
 *
 * Run with: npm run sitemap
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outFile = resolve(root, 'public/sitemap.xml');

const origin = (process.env.PUBLIC_SITE_URL ?? 'https://bvislaoch.dev').replace(/\/+$/, '');
const today = new Date().toISOString().slice(0, 10);

// Only real, indexable pages. The 404 route is intentionally absent.
const pages = [{ path: '/', priority: '1.0', changefreq: 'monthly' }];

const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${origin}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

await mkdir(dirname(outFile), { recursive: true });
await writeFile(outFile, body, 'utf8');
console.log(`sitemap.xml: ${pages.length} urls for ${origin}`);
