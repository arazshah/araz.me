// Render reel.html frame by frame and encode it with ffmpeg.
//   node render.js stills out/stills 1.5 5 9 ...   -> PNG stills at the given seconds
//   node render.js video  out/araz-reel.mp4 [@handle] -> 1080x1920 @30fps H.264 + music.wav
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const [mode = 'video', out = 'out/araz-reel.mp4', ...rest] = process.argv.slice(2);
const FPS = 30, END = 30;
const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.js': 'text/javascript' };
function serve() {
  return new Promise(res => {
    const srv = require('http').createServer((req, rsp) => {
      const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      if (!p.startsWith(ROOT) || !fs.existsSync(p)) { rsp.writeHead(404); return rsp.end(); }
      rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
      fs.createReadStream(p).pipe(rsp);
    }).listen(0, '127.0.0.1', () => res(srv));
  });
}

(async () => {
  const srv = await serve();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const handle = mode === 'video' && rest[0] ? `?ig=${encodeURIComponent(rest[0])}` : '';
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.goto(`http://127.0.0.1:${srv.address().port}/reel/reel.html${handle}`);
  await page.evaluate(() => window.ready);
  const grab = async t => Buffer.from(await page.evaluate(t => { render(t); return document.getElementById('c').toDataURL('image/jpeg', 0.94).split(',')[1]; }, t), 'base64');

  if (mode === 'stills') {
    fs.mkdirSync(out, { recursive: true });
    for (const s of rest) fs.writeFileSync(path.join(out, `t${s}.jpg`), await grab(parseFloat(s)));
  } else {
    const wav = path.resolve(__dirname, 'out/music.wav');
    const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-'];
    if (fs.existsSync(wav) && !out.includes('silent')) args.push('-i', wav, '-c:a', 'aac', '-b:a', '192k', '-shortest');
    else args.push('-an');
    args.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', String(FPS), '-movflags', '+faststart', out);
    const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
    const total = FPS * END;
    for (let f = 0; f < total; f++) {
      const buf = await grab(f / FPS);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 90 === 0) process.stdout.write(`frame ${f}/${total}\n`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
  srv.close();
})();
