/**
 * Generates the social share image at public/og.png (1200x630).
 *
 * The reference site shipped an empty og:image, which is the single most
 * damaging SEO/social bug in a portfolio. This produces a real one with
 * sharp, so no extra runtime dependency is needed at build time.
 *
 * Run with: npm run og
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stat } from 'node:fs/promises';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outFile = resolve(root, 'public/og.png');

const W = 1200;
const H = 630;

/** Social cards are read at small sizes, so everything is oversized. */
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d1512"/>
      <stop offset="55%" stop-color="#111d19"/>
      <stop offset="100%" stop-color="#0a110f"/>
    </linearGradient>
    <radialGradient id="glow1" cx="0.12" cy="0.1" r="0.7">
      <stop offset="0%" stop-color="#2dd4a7" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#2dd4a7" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.92" cy="0.85" r="0.6">
      <stop offset="0%" stop-color="#22a67f" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#22a67f" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow1)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- monogram -->
  <g transform="translate(80, 96)">
    <rect width="96" height="96" rx="26" fill="#2dd4a7"/>
    <text x="48" y="66" font-family="Helvetica, Arial, sans-serif" font-size="54"
          font-weight="700" fill="#08110e" text-anchor="middle">BV</text>
  </g>

  <text x="80" y="316" font-family="Helvetica, Arial, sans-serif" font-size="82"
        font-weight="700" fill="#f4faf7" letter-spacing="-2">Bryan Vislao Chavez</text>

  <text x="80" y="382" font-family="Helvetica, Arial, sans-serif" font-size="38"
        font-weight="500" fill="#2dd4a7">FullStack Software Engineer</text>

  <text x="80" y="440" font-family="Helvetica, Arial, sans-serif" font-size="26"
        fill="#9db5ac">React · Next.js · Node.js · NestJS · .NET · Java</text>

  <!-- divider -->
  <rect x="80" y="486" width="1040" height="1" fill="#ffffff" fill-opacity="0.12"/>

  <text x="80" y="540" font-family="Helvetica, Arial, sans-serif" font-size="26"
        fill="#cfe0d9">bvislaoch.dev</text>

  <text x="1120" y="540" font-family="Helvetica, Arial, sans-serif" font-size="26"
        fill="#7e9a90" text-anchor="end">Lima, Perú</text>
</svg>`;

await mkdir(dirname(outFile), { recursive: true });
await writeFile(outFile, await sharp(Buffer.from(svg)).png({ quality: 92 }).toBuffer());

const { size } = await stat(outFile);
console.log(`og.png: ${W}x${H}, ${(size / 1024).toFixed(1)} KB`);

/* --- favicon + apple touch icon, derived from the same monogram --- */

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
  <rect width="96" height="96" rx="26" fill="#2dd4a7"/>
  <text x="48" y="66" font-family="Helvetica, Arial, sans-serif" font-size="54"
        font-weight="700" fill="#08110e" text-anchor="middle">BV</text>
</svg>`;

await writeFile(resolve(root, 'public/favicon.svg'), favicon);
await writeFile(
  resolve(root, 'public/apple-touch-icon.png'),
  await sharp(Buffer.from(favicon)).resize(180, 180).png().toBuffer(),
);

console.log('favicon.svg + apple-touch-icon.png written');

/* ------------------------------------------------------------------ */
/* Profile photo fallback                                              */
/*                                                                     */
/* public/profile.jpg is the portrait shown in the hero. A monogram     */
/* placeholder is generated so a fresh clone never 404s; drop a real     */
/* photo at that exact path to override it (any aspect ratio, >=512px).  */
/* ------------------------------------------------------------------ */

const placeholder = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1c3b33"/>
      <stop offset="100%" stop-color="#0f1f1a"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#g)"/>
  <circle cx="256" cy="196" r="76" fill="#2dd4a7" fill-opacity="0.9"/>
  <path d="M112 448c0-79 64-132 144-132s144 53 144 132Z" fill="#2dd4a7" fill-opacity="0.9"/>
  <text x="256" y="500" font-family="Helvetica, Arial, sans-serif" font-size="44"
        font-weight="600" fill="#2dd4a7" fill-opacity="0.55" text-anchor="middle"
        letter-spacing="4">BV</text>
</svg>`;

const placeholderPath = resolve(root, 'public/profile.jpg');
if (!existsSync(placeholderPath)) {
  await writeFile(
    placeholderPath,
    await sharp(Buffer.from(placeholder)).resize(512, 512).jpeg({ quality: 88 }).toBuffer(),
  );
  console.log('profile.jpg placeholder written (replace with a real photo)');
} else {
  console.log('profile.jpg already present, leaving it untouched');
}
