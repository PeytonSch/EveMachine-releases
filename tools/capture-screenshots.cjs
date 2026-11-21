// Captures the website's screenshots (site/screenshots/) from Eve Machine's demo mode, which shows
// made-up characters, so no real account appears.
//
// 1. In the EveMachine source folder, start the web build:  npx vite --port=3002 --strictPort
// 2. From that same folder (it has Electron installed), run:
//      npx electron ..\EveMachine-releases\tools\capture-screenshots.cjs ..\EveMachine-releases\site\screenshots
// 3. Look at the new images before committing them. Progress goes to capture.log next to the output folder.
//
// Each shot is 1440x900 rendered at 2x, saved as a 1920px wide JPEG.
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

const OUT = process.argv[process.argv.length - 1];
const URL = 'http://localhost:3002/';
const W = 1440, H = 900;
const LOG = path.join(path.dirname(OUT), 'capture.log');
const log = (...a) => fs.appendFileSync(LOG, a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(' ') + '\n');

app.commandLine.appendSwitch('force-device-scale-factor', '2');
// A fresh, throwaway profile, so the app starts in demo mode with nothing of yours in it.
app.setPath('userData', fs.mkdtempSync(path.join(require('os').tmpdir(), 'evemachine-shots-')));

const SHOTS = [
  { file: 'overview', tab: 'Overview', wait: 2500 },
  { file: 'assets', tab: 'Asset Manager', wait: 2500 },
  { file: 'industry', tab: 'Industry Planner', wait: 15000 },
  { file: 'market', tab: 'Market Browser', wait: 6000 },
  { file: 'planetary', tab: 'Planetary', sub: 'Dashboard', wait: 3000 },
  { file: 'mining', tab: 'Mining', wait: 3000 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Closes the start-up disclaimer, floating tools and toasts, and swaps character portraits for
// EVE's default one (the demo pilots borrow real character IDs).
const tidy = `(() => {
  [...document.querySelectorAll('button')].filter(b => b.innerText.trim() === 'I understand').forEach(b => b.click());
  document.querySelectorAll('[aria-label="Close Mining"],[aria-label="Close Combat"],[aria-label="Dismiss notification"]').forEach(b => b.click());
  document.querySelectorAll('img').forEach(i => {
    if (/images\\.evetech\\.net\\/characters\\/\\d+\\//.test(i.src) && !/characters\\/1\\//.test(i.src)) {
      i.src = i.src.replace(/characters\\/\\d+\\//, 'characters/1/');
    }
  });
  return true;
})()`;
const go = (label) => `(() => {
  const b = [...document.querySelectorAll('nav button, aside button')].find(b => b.innerText.includes(${JSON.stringify(label)}));
  if (b) b.click();
  return !!b;
})()`;
const sub = (label) => `(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.innerText.trim() === ${JSON.stringify(label)});
  if (b) b.click();
  return !!b;
})()`;

app.whenReady().then(async () => {
  try {
    fs.mkdirSync(OUT, { recursive: true });
    const win = new BrowserWindow({ width: W, height: H, show: false, useContentSize: true, enableLargerThanScreen: true, backgroundColor: '#0b0e14' });
    win.setContentSize(W, H);
    // The demo pilots borrow real character IDs: show EVE's default portrait instead.
    win.webContents.session.webRequest.onBeforeRequest({ urls: ['https://images.evetech.net/characters/*'] }, (d, cb) => {
      if (/\/characters\/1\//.test(d.url)) return cb({});
      cb({ redirectURL: d.url.replace(/\/characters\/\d+\//, '/characters/1/') });
    });
    win.loadURL(URL).catch((e) => log('load err', e.message));
    await sleep(8000);
    for (const s of SHOTS) {
      log('shot', s.file);
      await win.webContents.executeJavaScript(tidy);
      // Via Overview, so the Back button always reads "Overview" and the title bar does not wrap.
      await win.webContents.executeJavaScript(go('Overview'));
      await sleep(800);
      const ok = s.tab === 'Overview' || await win.webContents.executeJavaScript(go(s.tab));
      if (s.sub) { await sleep(1200); await win.webContents.executeJavaScript(sub(s.sub)); }
      await sleep(s.wait);
      await win.webContents.executeJavaScript(tidy);
      await sleep(1500);
      const img = await win.webContents.capturePage();
      fs.writeFileSync(path.join(OUT, s.file + '.jpg'), img.resize({ width: 1920, quality: 'best' }).toJPEG(88));
      log(s.file, ok, img.getSize());
    }
  } catch (e) {
    log('error', e && e.stack);
  }
  app.quit();
});
