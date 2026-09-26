/**
 * WCAG AA contrast audit for both themes.
 *
 * The tricky part: this project themes via CSS custom properties written in
 * `oklch()`, and getComputedStyle returns those values unconverted. Canvas
 * does the conversion to sRGB. Canvas pixels are also premultiplied, so a
 * fully transparent fill reads back as [0,0,0] — which would silently look
 * like "black text on black" and report nonsense ratios. Every fill is
 * therefore composited over an opaque base first.
 *
 * Run with: npm run audit:contrast   (dev server must be up)
 */
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:4321/';

const TARGETS = [
  ['h1 (titulo)', 'h1', 3],
  ['h2 (seccion)', 'h2', 3],
  ['h3 (card)', '[data-role] h3', 4.5],
  ['body copy', 'main p.text-pretty', 4.5],
  ['subtitulo muted', '#experiencia header p', 4.5],
  ['meta faint', 'main p.text-xs', 4.5],
  ['nav link', '[data-nav-link]', 4.5],
  ['nav link activo', '.nav-link-active', 4.5],
  ['chip filtro', '.filter-chip:not(.is-active)', 4.5],
  ['chip filtro activo', '.filter-chip.is-active', 4.5],
  ['skill chip', '#stack li[title]', 4.5],
  ['footer', 'footer p', 4.5],
  ['badge Actual', '[data-role] .uppercase', 4.5],
  ['drawer link', '[data-drawer-link]', 4.5],
  ['boton primaria', 'a[download]', 4.5],
  ['tech chip', '[data-role] li[title]', 4.5],
  ['logro bullet', '[data-role] li svg.icon + span', 4.5],
];

const browser = await chromium.launch();
let failures = 0;

for (const scheme of ['light', 'dark']) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    colorScheme: scheme,
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  const results = await page.evaluate((targets) => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 1;
    const cx = cv.getContext('2d', { willReadFrequently: true });

    /**
     * Resolve any CSS colour (oklch, color-mix, ...) to opaque sRGB bytes.
     * The base fill guarantees alpha is always 255, so a transparent colour
     * returns the base rather than a misleading [0,0,0].
     */
    const toRGB = (css, base = [255, 255, 255]) => {
      cx.fillStyle = `rgb(${base[0]} ${base[1]} ${base[2]})`;
      cx.fillRect(0, 0, 1, 1);
      cx.fillStyle = '#000';
      cx.fillStyle = css; // invalid strings leave fillStyle at the fallback
      cx.fillRect(0, 0, 1, 1);
      const d = cx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]];
    };

    const lum = ([r, g, b]) => {
      const f = (v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };

    const ratio = (a, b) => {
      const l1 = lum(a);
      const l2 = lum(b);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };

    const isTransparent = (c) => !c || c === 'transparent' || /rgba\([^)]*,\s*0\s*\)$/.test(c);

    /**
     * Effective background: walk ancestors compositing each layer, then fall
     * back to the --surface token. The page background is a translucent
     * surface over the canvas, so a single non-transparent ancestor is not
     * always the whole story.
     */
    const bgOf = (el) => {
      const root = getComputedStyle(document.documentElement);
      let base = toRGB(root.getPropertyValue('--surface').trim());
      const layers = [];
      let n = el;
      while (n && n !== document.documentElement) {
        const c = getComputedStyle(n).backgroundColor;
        if (!isTransparent(c)) layers.push(c);
        n = n.parentElement;
      }
      const bodyBg = getComputedStyle(document.body).backgroundColor;
      if (!isTransparent(bodyBg)) layers.push(bodyBg);

      // Composite outermost first so the element's own background wins.
      for (let i = layers.length - 1; i >= 0; i -= 1) {
        base = toRGB(layers[i], base);
      }
      return base;
    };

    return targets.map(([label, sel, min]) => {
      const el = document.querySelector(sel);
      if (!el) return { label, skip: true };
      const cs = getComputedStyle(el);
      const size = parseFloat(cs.fontSize);
      const weight = Number(cs.fontWeight) || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const bg = bgOf(el);
      const fg = toRGB(cs.color, bg);
      return {
        label,
        size,
        weight,
        need: large ? 3 : min,
        ratio: Number(ratio(fg, bg).toFixed(2)),
        fg,
        bg,
      };
    });
  }, TARGETS);

  const checked = results.filter((r) => !r.skip);
  const fails = checked.filter((r) => r.ratio < r.need);

  console.log(`\n${scheme}: ${checked.length - fails.length}/${checked.length} pass`);
  for (const r of checked) {
    const pass = r.ratio >= r.need;
    const detail = `rgb(${r.fg}) on rgb(${r.bg})`;
    console.log(
      `  ${pass ? 'PASS' : 'FAIL'}  ${r.label.padEnd(20)} ${String(r.ratio).padStart(6)}:1  (need ${r.need})  ${r.size}px/${r.weight}  ${detail}`,
    );
  }
  failures += fails.length;
  await context.close();
}

await browser.close();
console.log(failures ? `\n${failures} contrast failure(s)` : '\nall contrast checks pass');
process.exit(failures ? 1 : 0);
