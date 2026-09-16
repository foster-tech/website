// Start a local server on port 8765, then run:
// node tests/hero-video.cjs [path-to-playwright-module] [--poster]
// --poster extracts the still background from the existing video using Chrome.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const modulePath = process.argv.slice(2).find(arg => !arg.startsWith('--'));
const { chromium, webkit } = require(modulePath || 'playwright');
const url = 'http://127.0.0.1:8765/index.html';
const mobile = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };

async function extractPoster(browser) {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const data = await page.evaluate(async () => {
      const video = document.createElement('video');
      video.muted = true;
      video.preload = 'auto';
      const loaded = new Promise((resolve, reject) => {
        video.addEventListener('loadeddata', resolve, { once: true });
        video.addEventListener('error', () => reject(new Error('Cannot decode the source video')), { once: true });
      });
      video.src = 'img/Rebranding/background-fullscreen-web.mp4';
      video.load();
      await loaded;
      const sought = new Promise(resolve => video.addEventListener('seeked', resolve, { once: true }));
      video.currentTime = 1;
      await sought;
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(video.videoWidth, 1440);
      canvas.height = Math.round(canvas.width * video.videoHeight / video.videoWidth);
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
    });
    fs.writeFileSync(path.resolve(__dirname, '../img/Rebranding/hero-poster.jpg'), Buffer.from(data, 'base64'));
    console.log('Poster extracted from the original video.');
  } finally {
    await page.close();
  }
}

async function actualAutoplay(browser) {
  const context = await browser.newContext(mobile);
  try {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => {
      const video = document.querySelector('.hero-video');
      return !video.paused && video.currentTime > 0 && document.querySelector('.masthead').dataset.videoState === 'playing';
    });
    assert.equal(await page.locator('.hero-video-toggle').isVisible(), false);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    if (process.env.HERO_SCREENSHOT_PREFIX) {
      await page.screenshot({ path: process.env.HERO_SCREENSHOT_PREFIX + '-playing.png' });
    }
    console.log('Chrome mobile: real muted autoplay PASS');
  } finally {
    await context.close();
  }
}

async function blockedAutoplay(browser, engine) {
  const context = await browser.newContext(mobile);
  try {
    const page = await context.newPage();
    // Keep decoding/native autoplay out of these deterministic policy/UI tests.
    await page.route('**/background-fullscreen-web.mp4', () => new Promise(() => {}));
    await page.addInitScript(() => {
      // The autoplay attribute can start native playback without calling play().
      Object.defineProperty(HTMLMediaElement.prototype, 'autoplay', { get: () => false, set: () => {} });
      const preventNativeAutoplay = () => document.querySelectorAll('video[autoplay]').forEach(video => video.removeAttribute('autoplay'));
      new MutationObserver(preventNativeAutoplay).observe(document, { childList: true, subtree: true });
      HTMLMediaElement.prototype.play = function () {
        window.heroPlayRequests = (window.heroPlayRequests || 0) + 1;
        if (window.allowHeroPlayback) {
          queueMicrotask(() => this.dispatchEvent(new Event('playing')));
          return Promise.resolve();
        }
        return Promise.reject(new DOMException('Autoplay blocked', 'NotAllowedError'));
      };
    });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('.masthead').dataset.videoState === 'blocked');
    assert.equal(await page.locator('.hero-video-toggle').isVisible(), true);
    assert.equal(await page.locator('.hero-video').evaluate(el => getComputedStyle(el).visibility), 'hidden');
    assert.equal(await page.locator('[data-video-state="blocked"].trn').isVisible(), true);
    assert.equal(await page.locator('.hero-video-status').innerText(), 'Toque em Reproduzir para iniciar o vídeo de fundo.');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const poster = await page.evaluate(() => new Promise(resolve => {
      const image = new Image();
      image.onload = () => resolve(image.naturalWidth);
      image.onerror = () => resolve(0);
      image.src = document.querySelector('.hero-video').poster;
    }));
    assert(poster > 0, 'poster must load when autoplay is blocked');
    if (engine === 'webkit' && process.env.HERO_SCREENSHOT_PREFIX) {
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: process.env.HERO_SCREENSHOT_PREFIX + '-blocked.png' });
    }
    await page.evaluate(() => { window.allowHeroPlayback = true; });
    await page.locator('.hero-video-toggle').tap();
    await page.waitForFunction(() => document.querySelector('.masthead').dataset.videoState === 'playing');
    assert.equal(await page.locator('.hero-video-toggle').isVisible(), false);
    assert.equal(await page.locator('.hero-video-status').isVisible(), false);
    await page.locator('.hero-video').evaluate(el => el.dispatchEvent(new Event('error')));
    await page.waitForFunction(() => document.querySelector('.masthead').dataset.videoState === 'error');
    assert.equal(await page.locator('[data-video-state="error"].trn').isVisible(), true);
    assert.equal(await page.locator('.hero-video-toggle').isVisible(), false);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => document.querySelector('.masthead').dataset.videoState === 'reduced');
    assert.equal(await page.locator('.hero-video').isVisible(), false);
    assert.equal(await page.locator('.hero-video-toggle').isVisible(), false);
    assert.equal(await page.locator('.hero-video-status').isVisible(), false);
    assert((await page.locator('.masthead').evaluate(el => getComputedStyle(el).backgroundImage)).includes('hero-poster.jpg'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('.masthead').dataset.videoState === 'reduced');
    assert.equal(await page.evaluate(() => window.heroPlayRequests || 0), 0, 'reduced motion must not request autoplay on load');
    console.log(`${engine} mobile: blocked autoplay, user gesture, error and reduced motion PASS`);
  } finally {
    await context.close();
  }
}

(async () => {
  const chrome = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    if (process.argv.includes('--poster')) await extractPoster(chrome);
    await actualAutoplay(chrome);
    await blockedAutoplay(chrome, 'chrome');
  } finally {
    await chrome.close();
  }
  const safari = await webkit.launch({ headless: true });
  try {
    await blockedAutoplay(safari, 'webkit');
  } finally {
    await safari.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
