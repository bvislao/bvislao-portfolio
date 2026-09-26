/**
 * Generates a single SVG sprite at public/icons/sprite.svg.
 *
 * Two sources are merged:
 *  1. Brand marks from the `simple-icons` package (CC0-1.0). Rendered as
 *     `fill="currentColor"` because those logos are single-path solid glyphs.
 *  2. Hand-written UI glyphs in the Lucide style (stroke-based). These are the
 *     fallback for brands Simple Icons no longer ships (Java, Oracle, SQL
 *     Server, AWS, LinkedIn, React Native, OpenAI) and for generic concepts.
 *
 * Run with: npm run sprites
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const iconDir = resolve(root, 'node_modules/simple-icons/icons');
const outFile = resolve(root, 'public/icons/sprite.svg');

/** Brand slugs to pull from simple-icons. */
const BRAND_ICONS = [
  'react', 'nextdotjs', 'angular', 'vuedotjs', 'nodedotjs', 'nestjs', 'express',
  'dotnet', 'spring', 'typescript', 'javascript', 'python', 'go',
  'tailwindcss', 'mui', 'sass', 'astro', 'vite',
  'postgresql', 'mysql', 'mongodb', 'redis', 'prisma', 'flyway', 'graphql',
  'docker', 'kubernetes', 'terraform', 'nginx', 'grafana', 'prometheus', 'apachekafka', 'elasticsearch',
  'git', 'github', 'gitlab', 'jira', 'confluence', 'jenkins', 'jquery',
  'claudecode', 'anthropic', 'googlecloud', 'figma',
  'flutter', 'linux', 'apple', 'vercel', 'netlify',
  'x', 'whatsapp', 'telegram', 'gmail',
];

/**
 * Hand-written glyphs. Each is an array of element descriptors:
 *   ['path', { d, ... }]  |  ['circle', { cx, cy, r }] | ['rect', {...}]
 *   ['ellipse', {...}]    |  ['line', {...}]
 */
const UI_ICONS = {
  /* --- brands removed from Simple Icons (licensing) --- */
  'brand-java': [['path', { d: 'M17.5 8H3v8h14.5a4 4 0 0 0 0-8Z' }], ['path', { d: 'M17.5 8v.5A3.5 3.5 0 0 1 14 12H3' }], ['path', { d: 'M6 2v3M10 2v3M14 2v3' }], ['path', { d: 'M6 19h8' }]],
  'brand-oracle': [
    ['ellipse', { cx: 12, cy: 5, rx: 8.5, ry: 3 }],
    ['path', { d: 'M3.5 5v14c0 1.66 3.8 3 8.5 3s8.5-1.34 8.5-3V5' }],
    ['path', { d: 'M3.5 12c0 1.66 3.8 3 8.5 3s8.5-1.34 8.5-3' }],
  ],
  'brand-sqlserver': [
    ['ellipse', { cx: 12, cy: 12, rx: 8.5, ry: 8.5 }],
    ['ellipse', { cx: 12, cy: 12, rx: 4, ry: 4 }],
    ['path', { d: 'M12 3.5v5M12 15.5v5' }],
  ],
  'brand-aws': [
    ['path', { d: 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z' }],
    ['path', { d: 'M9.5 13.5 8 17l1.5 3.5 1.6-3.6 1.4-3.4' }],
  ],
  'brand-linkedin': [
    ['path', { d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-13h4v1.5' }],
    ['rect', { x: 2, y: 9, width: 4, height: 12, rx: 1 }],
    ['circle', { cx: 4, cy: 4, r: 2 }],
  ],
  'brand-reactnative': [
    ['rect', { x: 6, y: 2, width: 12, height: 20, rx: 2.5 }],
    ['path', { d: 'M10.5 18.5h3' }],
    ['circle', { cx: 12, cy: 9, r: 1.2 }],
  ],
  'brand-ai': [
    ['path', { d: 'M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0Z' }],
  ],

  /* --- generic concepts --- */
  database: [
    ['ellipse', { cx: 12, cy: 5, rx: 9, ry: 3 }],
    ['path', { d: 'M3 5v14a9 3 0 0 0 18 0V5' }],
    ['path', { d: 'M3 12a9 3 0 0 0 18 0' }],
  ],
  cloud: [['path', { d: 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z' }]],
  'cloud-cpu': [
    ['path', { d: 'M17.5 17H9a6 6 0 1 1 6.4-8.9A4 4 0 0 1 17.5 17Z' }],
    ['rect', { x: 10, y: 11, width: 4, height: 4, rx: 1 }],
  ],
  smartphone: [
    ['rect', { x: 6, y: 2, width: 12, height: 20, rx: 2.5 }],
    ['path', { d: 'M10.5 18.5h3' }],
  ],
  briefcase: [
    ['rect', { x: 2, y: 7, width: 20, height: 14, rx: 2 }],
    ['path', { d: 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' }],
  ],
  'map-pin': [
    ['path', { d: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' }],
    ['circle', { cx: 12, cy: 10, r: 3 }],
  ],
  mail: [
    ['rect', { x: 2, y: 4, width: 20, height: 16, rx: 2 }],
    ['path', { d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' }],
  ],
  phone: [
    ['path', { d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z' }],
  ],
  'external-link': [
    ['path', { d: 'M15 3h6v6' }],
    ['path', { d: 'M10 14 21 3' }],
    ['path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }],
  ],
  'arrow-up-right': [['path', { d: 'M7 17 17 7' }], ['path', { d: 'M8 7h9v9' }]],
  copy: [
    ['rect', { x: 9, y: 9, width: 12, height: 12, rx: 2 }],
    ['path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' }],
  ],
  check: [['path', { d: 'M20 6 9 17l-5-5' }]],
  sun: [
    ['circle', { cx: 12, cy: 12, r: 4 }],
    ['path', { d: 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41' }],
  ],
  moon: [['path', { d: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' }]],
  monitor: [
    ['rect', { x: 2, y: 3, width: 20, height: 14, rx: 2 }],
    ['path', { d: 'M8 21h8M12 17v4' }],
  ],
  menu: [['path', { d: 'M4 6h16M4 12h16M4 18h16' }]],
  close: [['path', { d: 'M18 6 6 18M6 6l12 12' }]],
  'chevron-down': [['path', { d: 'm6 9 6 6 6-6' }]],
  'chevron-right': [['path', { d: 'm9 18 6-6-6-6' }]],
  award: [
    ['circle', { cx: 12, cy: 8, r: 6 }],
    ['path', { d: 'M15.48 12.89 17 22l-5-3-5 3 1.52-9.11' }],
  ],
  'graduation-cap': [
    ['path', { d: 'M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0Z' }],
    ['path', { d: 'M22 10v6M6 12.5V16a6 3 0 0 0 12 0v-3.5' }],
  ],
  code: [['path', { d: 'm16 18 6-6-6-6M8 6l-6 6 6 6' }]],
  layers: [
    ['path', { d: 'M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z' }],
    ['path', { d: 'm22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65M22 12.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65' }],
  ],
  'git-branch': [
    ['line', { x1: 6, y1: 3, x2: 6, y2: 15 }],
    ['circle', { cx: 18, cy: 6, r: 3 }],
    ['circle', { cx: 6, cy: 18, r: 3 }],
    ['path', { d: 'M18 9a9 9 0 0 1-9 9' }],
  ],
  terminal: [['path', { d: 'm4 17 6-6-6-6M12 19h8' }]],
  'shield-check': [
    ['path', { d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z' }],
    ['path', { d: 'm9 12 2 2 4-4' }],
  ],
  zap: [['path', { d: 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14Z' }]],
  'book-open': [
    ['path', { d: 'M12 7v14' }],
    ['path', { d: 'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3Z' }],
  ],
  search: [
    ['circle', { cx: 11, cy: 11, r: 7 }],
    ['path', { d: 'm21 21-4.35-4.35' }],
  ],
  command: [
    ['path', { d: 'M18 9a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12' }],
  ],
  printer: [
    ['path', { d: 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' }],
    ['path', { d: 'M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6' }],
    ['rect', { x: 6, y: 14, width: 12, height: 8, rx: 1 }],
  ],
  user: [
    ['circle', { cx: 12, cy: 8, r: 5 }],
    ['path', { d: 'M20 21a8 8 0 0 0-16 0' }],
  ],
  target: [
    ['circle', { cx: 12, cy: 12, r: 9 }],
    ['circle', { cx: 12, cy: 12, r: 5 }],
    ['circle', { cx: 12, cy: 12, r: 1.5 }],
  ],
  rocket: [
    ['path', { d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2a2.18 2.18 0 0 0-3-3Z' }],
    ['path', { d: 'M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z' }],
    ['path', { d: 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5' }],
  ],
  file: [
    ['path', { d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' }],
    ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4' }],
  ],
  'scale-3d': [
    ['path', { d: 'M12 3 3 8l9 5 9-5-9-5Z' }],
    ['path', { d: 'M3 16l9 5 9-5M3 12l9 5 9-5' }],
  ],
  workflow: [
    ['rect', { x: 3, y: 3, width: 6, height: 6, rx: 1.5 }],
    ['rect', { x: 15, y: 15, width: 6, height: 6, rx: 1.5 }],
    ['path', { d: 'M6 9v6a3 3 0 0 0 3 3h6' }],
  ],
  'trending-up': [
    ['path', { d: 'M22 7 13.5 15.5 8.5 10.5 2 17' }],
    ['path', { d: 'M16 7h6v6' }],
  ],
  clock: [
    ['circle', { cx: 12, cy: 12, r: 9 }],
    ['path', { d: 'M12 7v5l3 2' }],
  ],
  filter: [['path', { d: 'M3 5h18l-7 8v6l-4 2v-8Z' }]],
  download: [
    ['path', { d: 'M12 3v12' }],
    ['path', { d: 'm7 11 5 5 5-5' }],
    ['path', { d: 'M5 21h14' }],
  ],
};

/** Renders one UI glyph to markup, applying stroke defaults on the root element. */
function renderUiGlyph(name, shapes) {
  const attrs = { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  const body = shapes
    .map(([tag, a]) => `<${tag} ${Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ')} />`)
    .join('');
  return `<symbol id="i-${name}" viewBox="0 0 24 24" ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ')}>${body}</symbol>`;
}

/** Renders one brand mark. simple-icons files are single-path solid glyphs. */
function renderBrand(name, pathData) {
  return `<symbol id="i-${name}" viewBox="0 0 24 24" fill="currentColor">${pathData}</symbol>`;
}

const missing = [];
const symbols = [];

// 1. Brand marks
for (const name of BRAND_ICONS) {
  const file = resolve(iconDir, `${name}.svg`);
  if (!existsSync(file)) {
    missing.push(`brand:${name}`);
    continue;
  }
  const raw = await readFile(file, 'utf8');
  const pathData = raw.match(/<path d="([^"]+)"/)?.[1];
  if (!pathData) {
    missing.push(`brand-path:${name}`);
    continue;
  }
  symbols.push(renderBrand(name, pathData));
}

// 2. Hand-written glyphs
for (const [name, shapes] of Object.entries(UI_ICONS)) {
  symbols.push(renderUiGlyph(name, shapes));
}

if (missing.length) {
  console.error(`Missing icons: ${missing.join(', ')}`);
  process.exit(1);
}

const sprite = [
  '<svg xmlns="http://www.w3.org/2000/svg">',
  '<!-- Generated by scripts/generate-sprite.mjs - do not edit by hand. -->',
  ...symbols,
  '</svg>',
  '',
].join('\n');

await mkdir(dirname(outFile), { recursive: true });
await writeFile(outFile, sprite, 'utf8');

const bytes = Buffer.byteLength(sprite);
console.log(`sprite.svg: ${symbols.length} icons, ${(bytes / 1024).toFixed(1)} KB`);
console.log(`  brands: ${BRAND_ICONS.length}   ui: ${Object.keys(UI_ICONS).length}`);
