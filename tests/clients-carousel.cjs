// Run with: node tests/clients-carousel.cjs [path-to-playwright-module]
// Uses an installed Chrome and a Playwright WebKit download; no project build required.
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { webkit, chromium } = require(process.argv[2] || 'playwright');

async function check(browser, width, mobile, label) {
  const context = await browser.newContext({
    viewport: { width, height: 844 },
    deviceScaleFactor: 1,
    isMobile: mobile,
    hasTouch: mobile,
  });
  try {
    const page = await context.newPage();
    await page.goto(pathToFileURL(path.resolve(__dirname, '../index.html')).href, { waitUntil: 'load' });
    await page.waitForFunction(() => [...document.querySelectorAll('#clients img')].every(img => img.complete && img.naturalWidth));
    await page.evaluate(() => window.scrollTo({ top: document.querySelector('#clients').offsetTop - 100, behavior: 'instant' }));
    const initial = await page.evaluate(() => {
      const marquee = document.querySelector('#clients .marquee');
      const tracks = [...marquee.children];
      const logos = [...marquee.querySelectorAll('img')];
      return {
        widths: tracks.map(track => track.getBoundingClientRect().width),
        duration: getComputedStyle(marquee).animationDuration,
        overflow: document.documentElement.scrollWidth > innerWidth,
        logos: logos.map(img => {
          const rect = img.getBoundingClientRect();
          const parent = img.parentElement.getBoundingClientRect();
          return { width: rect.width, height: rect.height, expectedWidth: rect.height * img.naturalWidth / img.naturalHeight, parentWidth: parent.width, parentHeight: parent.height };
        }),
      };
    });
    assert.equal(initial.overflow, false);
    assert.equal(initial.logos.length, 14);
    assert(Math.abs(initial.widths[0] - initial.widths[1]) < 0.1);
    assert(initial.widths[0] >= width - 1);
    assert.equal(initial.duration, mobile ? '20s' : '28s');
    for (const logo of initial.logos) {
      assert(Math.abs(logo.width - logo.expectedWidth) < 0.1, 'logo aspect ratio changed');
      assert(logo.parentWidth >= logo.width - 0.1, 'logo is horizontally clipped');
      assert(logo.parentHeight >= logo.height - 0.1, 'logo is vertically clipped');
    }
    if (mobile) {
      await page.touchscreen.tap(width / 2, 170);
      assert.equal(await page.locator('#clients .marquee').evaluate(el => getComputedStyle(el).animationPlayState), 'running', 'tap must not pause the carousel');
    }
    const moved = await page.evaluate(async () => {
      const animation = document.querySelector('#clients .marquee').getAnimations()[0];
      const start = animation.currentTime;
      await new Promise(resolve => setTimeout(resolve, 300));
      return animation.currentTime - start;
    });
    assert(moved > 100, 'animation did not advance');
    for (const phase of [0, 0.25, 0.5, 0.75, 0.999]) {
      const rects = await page.evaluate(phase => {
        const marquee = document.querySelector('#clients .marquee');
        const animation = marquee.getAnimations()[0];
        animation.pause();
        animation.currentTime = animation.effect.getTiming().duration * phase;
        return new Promise(resolve => requestAnimationFrame(() => {
          const first = marquee.children[0].getBoundingClientRect();
          const second = marquee.children[1].getBoundingClientRect();
          resolve({ left: first.left, right: second.right, gap: second.left - first.right, viewport: innerWidth });
        }));
      }, phase);
      assert(rects.left <= 0.1 && rects.right >= rects.viewport - 0.1, 'loop exposes empty trailing space');
      assert(Math.abs(rects.gap) < 0.1, 'tracks separate during animation');
    }
    if (label === 'webkit-390' && process.env.CAROUSEL_SCREENSHOT) {
      await page.locator('#clients').screenshot({ path: process.env.CAROUSEL_SCREENSHOT });
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.locator('#clients .marquee').evaluate(el => getComputedStyle(el).animationName), 'none');
    assert.equal(await page.locator('#clients .marquee-track[aria-hidden="true"]').evaluate(el => getComputedStyle(el).display), 'none');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    console.log(`${label}: PASS (dimensions, touch, animation, loop, reduced motion)`);
  } finally {
    await context.close();
  }
}

(async () => {
  for (const [type, options, engine] of [[webkit, {}, 'webkit'], [chromium, { channel: 'chrome' }, 'chrome']]) {
    const browser = await type.launch({ ...options, headless: true });
    try {
      for (const width of [320, 390, 430]) await check(browser, width, true, `${engine}-${width}`);
      await check(browser, 1440, false, `${engine}-desktop`);
    } finally {
      await browser.close();
    }
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
