/**
 * Dev-only visual + runtime smoke test.
 * Renders the running dev server at several viewports, captures screenshots
 * and reports any console errors, failed requests or accessibility red flags.
 *
 * Usage: node scripts/smoke.mjs [url]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, '.screenshots');
const url = process.argv[2] ?? 'http://localhost:4321/';

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844, scheme: 'light' },
  { name: 'tablet', width: 834, height: 1112, scheme: 'light' },
  { name: 'desktop', width: 1440, height: 1000, scheme: 'light' },
  { name: 'desktop-dark', width: 1440, height: 1000, scheme: 'dark' },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
let problems = 0;

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    colorScheme: vp.scheme,
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const consoleErrors = [];
  const failedRequests = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));
  page.on('requestfailed', (req) =>
    failedRequests.push(`${req.url()} — ${req.failure()?.errorText}`),
  );
  page.on('response', (res) => {
    if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`);
  });

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  await page.screenshot({ path: resolve(outDir, `${vp.name}.png`), fullPage: true });

  // Theme actually applied?
  const theme = await page.evaluate(() => document.documentElement.dataset.theme);
  const expected = vp.scheme === 'dark' ? 'dark' : 'light';
  const themeOk = theme === expected;

  // Did the sprite resolve, or are we showing empty boxes?
  const iconBoxes = await page.evaluate(() => {
    const svgs = [...document.querySelectorAll('svg.icon')];

    /** Laid out and actually painted at this viewport and theme. */
    const isVisible = (el) =>
      el.checkVisibility?.({ checkOpacity: true, checkVisibilityCSS: true }) ?? true;

    /** Clipped to zero height by a collapsed <details> grid, but otherwise fine. */
    const isCollapsed = (el) =>
      !!el.closest('details:not([open])') || !!el.closest('.disclosure-body');

    const visible = svgs.filter((s) => isVisible(s) && !isCollapsed(s));

    return {
      total: svgs.length,
      visible: visible.length,
      // A genuinely broken <use> leaves a laid-out box with no painted content;
      // a zero-sized box on a *visible* element means the sprite failed.
      empty: visible.filter((s) => {
        const b = s.getBoundingClientRect();
        return b.width === 0 || b.height === 0;
      }).length,
    };
  });

  // Horizontal overflow is the #1 responsive bug; check it explicitly.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

  // Interactive elements must be reachable and big enough to tap.
  const smallTargets = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('a, button, summary').forEach((el) => {
      if (el.closest('.sr-only') || el.classList.contains('sr-only')) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      // Inline text links sit in a text flow and are exempt from tap-size
      // rules; buttons, summaries and flex/block links are not.
      const display = getComputedStyle(el).display;
      if (display === 'inline') return;
      if (r.height < 24 || r.width < 24) {
        bad.push(`${el.tagName.toLowerCase()}.${el.className.toString().split(' ')[0]} ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
    });
    return bad;
  });

  // Elements that spill outside the viewport horizontally.
  const bleeding = await page.evaluate(() => {
    const bad = [];
    const limit = document.documentElement.clientWidth;
    document.querySelectorAll('main *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > limit + 1 || r.left < -1)) {
        bad.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} [${Math.round(r.left)}..${Math.round(r.right)}]`);
      }
    });
    return bad.slice(0, 6);
  });

  const issues = [
    ...consoleErrors.map((e) => `console: ${e}`),
    ...failedRequests.map((r) => `request: ${r}`),
    themeOk ? null : `theme "${theme}" != expected "${expected}"`,
    iconBoxes.empty ? `${iconBoxes.empty} visible icons have no size` : null,
    overflow > 1 ? `h-overflow ${overflow}px` : null,
    ...bleeding.map((b) => `bleed: ${b}`),
    ...smallTargets.slice(0, 5).map((t) => `small target: ${t}`),
  ].filter(Boolean);

  problems += issues.length;

  console.log(`\n${vp.name} (${vp.width}x${vp.height}, ${vp.scheme})`);
  console.log(`  icons: ${iconBoxes.visible} visible of ${iconBoxes.total}, ${iconBoxes.empty} broken`);
  console.log(`  ${issues.length ? 'ISSUES:\n    - ' + issues.join('\n    - ') : 'clean'}`);

  await context.close();
}

/* --- Interaction tests on the desktop viewport --- */
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });

  const checks = {};

  // Tech filter narrows the timeline
  const before = await page.locator('[data-role]:not([hidden])').count();
  await page.locator('[data-filter="dotnet"]').click();
  await page.waitForTimeout(150);
  const after = await page.locator('[data-role]:not([hidden])').count();
  checks.filter = after > 0 && after < before ? `ok (${before} -> ${after})` : `FAIL (${before} -> ${after})`;

  // Filter status message is announced
  checks.filterStatus = (await page.locator('[data-filter-status]').textContent())?.trim();

  // Reset
  await page.locator('[data-filter="all"]').click();
  await page.waitForTimeout(150);
  checks.filterReset = (await page.locator('[data-role]:not([hidden])').count()) === before ? 'ok' : 'FAIL';

  // Expand-all toggles every card
  await page.locator('[data-expand-all]').click();
  await page.waitForTimeout(350);
  const allOpen = await page.evaluate(() =>
    [...document.querySelectorAll('[data-details]')].every((d) => d.open),
  );
  checks.expandAll = allOpen ? 'ok' : 'FAIL';
  await page.locator('[data-expand-all]').click();
  await page.waitForTimeout(350);
  const allClosed = await page.evaluate(() =>
    [...document.querySelectorAll('[data-details]')].every((d) => !d.open),
  );
  checks.collapseAll = allClosed ? 'ok' : 'FAIL';

  // Theme toggle round-trips and persists. The menu is a popover, so open it first.
  const pickTheme = async (value) => {
    await page.locator('[data-theme-btn]').first().click();
    await page.waitForTimeout(200);
    await page.locator(`[data-theme-option="${value}"]`).first().click();
    await page.waitForTimeout(200);
  };
  await pickTheme('dark');
  await page.waitForTimeout(200);
  checks.themeDark = (await page.evaluate(() => document.documentElement.dataset.theme)) === 'dark' ? 'ok' : 'FAIL';
  await page.reload({ waitUntil: 'networkidle' });
  checks.themePersisted = (await page.evaluate(() => document.documentElement.dataset.theme)) === 'dark' ? 'ok' : 'FAIL';
  checks.themeFlashGuard = await page.evaluate(() => {
    // The blocking head script must set data-theme before <body> renders.
    return document.documentElement.dataset.theme === 'dark';
  }) ? 'ok' : 'FAIL';

  // Scroll-spy marks the section you are in
  await pickTheme('light');
  await page.locator('#stack').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  checks.scrollspy = await page.evaluate(() => {
    const active = document.querySelector('[data-nav-link].nav-link-active');
    return active ? `ok (${active.dataset.navLink})` : 'FAIL (no active link)';
  });

  // Mobile drawer opens and closes
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);
  await page.locator('[data-menu-btn]').click();
  await page.waitForTimeout(300);
  checks.drawerOpen = (await page.locator('[data-drawer]').evaluate((el) => !el.classList.contains('invisible'))) ? 'ok' : 'FAIL';
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  checks.drawerEsc = (await page.locator('[data-drawer]').evaluate((el) => el.classList.contains('invisible'))) ? 'ok' : 'FAIL';

  // Email copy button
  await page.setViewportSize({ width: 1440, height: 1000 });
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.locator('[data-copy]').click();
  await page.waitForTimeout(300);
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  checks.clipboard = clip === 'bvislao95@gmail.com' ? 'ok' : `FAIL ("${clip}")`;

  console.log('\ninteractions:');
  for (const [k, v] of Object.entries(checks)) console.log(`  ${k}: ${v}`);

  // Print-mode screenshot: the page doubles as a CV.
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: resolve(outDir, 'cv.pdf'), format: 'A4', printBackground: true });
  console.log('\nprint PDF written to .screenshots/cv.pdf');

  await context.close();
}


await browser.close();
console.log(`\n${problems ? `${problems} visual issue(s) found` : 'no visual issues'}`);
console.log(`screenshots in .screenshots/`);
