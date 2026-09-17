const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css/rebranding.css'), 'utf8');
const url = process.env.HERO_URL || 'http://127.0.0.1:8765/index.html';

const videoTag = html.match(/<video\b[^>]*class="hero-video"[^>]*>/i);
assert(videoTag, 'hero video element must exist');

for (const attribute of ['autoplay', 'muted', 'loop', 'playsinline', 'webkit-playsinline']) {
  assert(new RegExp(`\\s${attribute}(?:\\s|>|=)`, 'i').test(videoTag[0]), `${attribute} must be present`);
}

assert(/preload="auto"/i.test(videoTag[0]), 'video must be ready for native autoplay');
assert(/poster="img\/Rebranding\/hero-poster\.jpg"/i.test(videoTag[0]), 'video must have a poster');
assert(!/\bcontrols(?:\s|>|=)/i.test(videoTag[0]), 'native controls must stay disabled');
assert(!/hero-video-toggle|hero-video-status/.test(html), 'manual playback UI must not exist');
assert(/<script[^>]+src="js\/hero-video\.js"/i.test(html), 'autoplay fallback must load');
assert(/header\.masthead[\s\S]*?background:[^;]*hero-poster\.jpg/i.test(css), 'masthead must retain a poster fallback');

async function verifyRangeSupport() {
  const videoUrl = new URL('img/Rebranding/background-fullscreen-web.mp4', url);
  const response = await fetch(videoUrl, { headers: { Range: 'bytes=0-1023' } });
  assert.equal(response.status, 206, 'preview server must respond to video ranges with 206');
  assert.equal(response.headers.get('accept-ranges'), 'bytes');
  assert.match(response.headers.get('content-range') || '', /^bytes 0-1023\//);
}

verifyRangeSupport()
  .then(() => console.log('Hero video: native autoplay markup, fallback and byte ranges PASS'))
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
