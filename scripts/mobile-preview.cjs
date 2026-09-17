// Local-network preview with HTTP byte-range support for Safari video playback.
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 8765);
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function resolveRequest(url) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);
  } catch {
    return null;
  }
  if (pathname.endsWith('/')) pathname += 'index.html';
  const target = path.resolve(root, '.' + pathname);
  return target === root || target.startsWith(root + path.sep) ? target : null;
}

const server = http.createServer((request, response) => {
  const target = resolveRequest(request.url);
  if (!target) {
    response.writeHead(400).end('Bad request');
    return;
  }

  fs.stat(target, (error, stats) => {
    if (error || !stats.isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }

    const headers = {
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-store',
      'Content-Type': mimeTypes[path.extname(target).toLowerCase()] || 'application/octet-stream',
    };
    const range = request.headers.range;

    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match) {
        response.writeHead(416, { 'Content-Range': `bytes */${stats.size}` }).end();
        return;
      }
      const start = match[1] ? Number(match[1]) : 0;
      const end = match[2] ? Math.min(Number(match[2]), stats.size - 1) : stats.size - 1;
      if (start > end || start >= stats.size) {
        response.writeHead(416, { 'Content-Range': `bytes */${stats.size}` }).end();
        return;
      }
      Object.assign(headers, {
        'Content-Length': end - start + 1,
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
      });
      response.writeHead(206, headers);
      if (request.method === 'HEAD') response.end();
      else fs.createReadStream(target, { start, end }).pipe(response);
      return;
    }

    headers['Content-Length'] = stats.size;
    response.writeHead(200, headers);
    if (request.method === 'HEAD') response.end();
    else fs.createReadStream(target).pipe(response);
  });
});

server.listen(port, '0.0.0.0', () => {
  const addresses = Object.values(os.networkInterfaces()).flat()
    .filter(address => address && address.family === 'IPv4' && !address.internal)
    .map(address => `http://${address.address}:${port}`);
  console.log('\nPreview mobile disponível em:');
  console.log(addresses.length ? addresses.join('\n') : `http://localhost:${port}`);
  console.log('\nUse o iPhone na mesma rede Wi-Fi. Pressione Ctrl+C para encerrar.\n');
});
