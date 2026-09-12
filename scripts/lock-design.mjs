import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tests/lock-design');
const BASE = 'http://127.0.0.1:5173';
const CDP_PORT = Number(process.env.LOCK_CDP_PORT || 9334);
const GRID = 24;
const KEY = GRID * 2;

const SHOTS = [
	{ name: 'home-390', path: '/', width: 390, height: 844, codes: [] },
	{ name: 'home-1440', path: '/', width: 1440, height: 900, codes: ['H'] },
	{ name: 'design-390', path: '/design', width: 390, height: 844, codes: ['D1', 'D10'] },
	{ name: 'design-1440', path: '/design', width: 1440, height: 900, codes: ['H', 'D1', 'D10'] },
	{ name: 'engineer-390', path: '/engineer', width: 390, height: 844, codes: ['E1'] },
	{ name: 'engineer-1440', path: '/engineer', width: 1440, height: 900, codes: ['H', 'E1'] },
	{ name: 'blog-390', path: '/blog', width: 390, height: 844, codes: ['B1', 'B2'] },
	{ name: 'blog-1440', path: '/blog', width: 1440, height: 900, codes: ['H', 'B1', 'B2'] },
	{ name: 'doppio-1440', path: '/design/doppio', width: 1440, height: 900, codes: ['H'] }
];

const PROBE = `(() => {
  const grid = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--grid')) || 24;
  const hair = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hair')) || 0.5;
  const paper = getComputedStyle(document.documentElement).getPropertyValue('--paper').trim();

  const describe = (el) => {
    const id = el.id ? '#' + el.id : '';
    const cls = typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0, 4).join('.') : '';
    const text = (el.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 24);
    return (el.tagName.toLowerCase() + id + cls + (text ? ' "' + text + '"' : '')).slice(0, 120);
  };

  const parsePx = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  const edges = [];
  const addH = (el, side, y, x0, x1, w) => {
    if (w <= 0 || x1 - x0 < 2) return;
    edges.push({ axis: 'h', side, y, x0, x1, w, el: describe(el) });
  };
  const addV = (el, side, x, y0, y1, w) => {
    if (w <= 0 || y1 - y0 < 2) return;
    edges.push({ axis: 'v', side, x, y0, y1, w, el: describe(el) });
  };

  for (const el of document.querySelectorAll('.site *, .site')) {
    const r = el.getBoundingClientRect();
    if (r.width < 0.25 && r.height < 0.25) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const visible = (color) =>
      color && color !== 'transparent' && !/^rgba?\\(0,\\s*0,\\s*0,\\s*0\\)/.test(color);
    const bt = parsePx(cs.borderTopWidth);
    const bb = parsePx(cs.borderBottomWidth);
    const bl = parsePx(cs.borderLeftWidth);
    const br = parsePx(cs.borderRightWidth);
    if (bt && cs.borderTopStyle !== 'none' && visible(cs.borderTopColor)) addH(el, 'top', r.top, r.left, r.right, bt);
    if (bb && cs.borderBottomStyle !== 'none' && visible(cs.borderBottomColor)) addH(el, 'bottom', r.bottom, r.left, r.right, bb);
    if (bl && cs.borderLeftStyle !== 'none' && visible(cs.borderLeftColor)) addV(el, 'left', r.left, r.top, r.bottom, bl);
    if (br && cs.borderRightStyle !== 'none' && visible(cs.borderRightColor)) addV(el, 'right', r.right, r.top, r.bottom, br);

    const shadow = cs.boxShadow || '';
    const inset = /inset/i.test(shadow) && /0px 0px 0px/.test(shadow);
    if (inset) {
      const sw = parsePx((shadow.match(/0px 0px 0px ([0-9.]+px)/) || [])[1]);
      if (sw) {
        addH(el, 'inset-top', r.top, r.left, r.right, sw);
        addH(el, 'inset-bottom', r.bottom, r.left, r.right, sw);
        addV(el, 'inset-left', r.left, r.top, r.bottom, sw);
        addV(el, 'inset-right', r.right, r.top, r.bottom, sw);
      }
    }

    if (r.width <= 1 && r.height >= grid && (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none')) {
      addV(el, 'rule', r.left + r.width / 2, r.top, r.bottom, Math.max(r.width, hair));
    }
    if (r.height <= 1 && r.width >= grid && (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none')) {
      addH(el, 'rule', r.top + r.height / 2, r.left, r.right, Math.max(r.height, hair));
    }
  }

  const overlap = [];
  const horiz = edges.filter((e) => e.axis === 'h');
  const vert = edges.filter((e) => e.axis === 'v');
  const spanOverlap = (a0, a1, b0, b1) => Math.min(a1, b1) - Math.max(a0, b0);

  for (let i = 0; i < horiz.length; i++) {
    for (let j = i + 1; j < horiz.length; j++) {
      const a = horiz[i];
      const b = horiz[j];
      if (a.el === b.el) continue;
      if (Math.abs(a.y - b.y) > 0.51) continue;
      const cover = spanOverlap(a.x0, a.x1, b.x0, b.x1);
      if (cover < 8) continue;
      overlap.push({
        axis: 'h',
        at: Math.round((a.y + b.y) * 50) / 100,
        cover: Math.round(cover),
        a: a.el,
        b: b.el
      });
    }
  }
  for (let i = 0; i < vert.length; i++) {
    for (let j = i + 1; j < vert.length; j++) {
      const a = vert[i];
      const b = vert[j];
      if (a.el === b.el) continue;
      if (Math.abs(a.x - b.x) > 0.51) continue;
      const cover = spanOverlap(a.y0, a.y1, b.y0, b.y1);
      if (cover < 8) continue;
      overlap.push({
        axis: 'v',
        at: Math.round((a.x + b.x) * 50) / 100,
        cover: Math.round(cover),
        a: a.el,
        b: b.el
      });
    }
  }

  const findCode = (text) => {
    const el = [...document.querySelectorAll('span')].find((s) => s.textContent.trim() === text);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const next = el.nextElementSibling;
    const nr = next ? next.getBoundingClientRect() : null;
    return {
      code: text,
      x: r.x,
      y: r.y,
      w: r.width,
      h: r.height,
      nextTag: next?.tagName ?? null,
      nextX: nr?.x ?? null,
      nextW: nr?.width ?? null,
      nextH: nr?.height ?? null
    };
  };

  const shell = document.querySelector('.shell');
  const canvas = document.querySelector('.shell-canvas');
  const sr = shell?.getBoundingClientRect();
  const cr = canvas?.getBoundingClientRect();

  return {
    innerWidth: window.innerWidth,
    grid,
    hair,
    paper,
    shell: sr ? { x: sr.x, y: sr.y, w: sr.width, h: sr.height } : null,
    canvas: cr ? { x: cr.x, y: cr.y, w: cr.width, h: cr.height } : null,
    codes: Object.fromEntries(
      ['H', 'D1', 'D10', 'B1', 'B2', 'E1'].map((c) => [c, findCode(c)])
    ),
    overlapCount: overlap.length,
    overlaps: overlap.slice(0, 40)
  };
})()`;

const FREEZE = `(() => {
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('light');
  let style = document.getElementById('lock-freeze');
  if (!style) {
    style = document.createElement('style');
    style.id = 'lock-freeze';
    document.head.appendChild(style);
  }
  style.textContent = '.status-time .truncate { font-size: 0; } .status-time .truncate::after { content: "12:00:00"; font-size: var(--text-base); letter-spacing: var(--tracking-widest); }';
  return document.fonts.ready.then(() =>
    Promise.all(
      [...document.images].map((img) =>
        img.complete ? null : new Promise((res) => {
          img.onload = res;
          img.onerror = res;
        })
      )
    )
  );
})()`;

function openCdp(url) {
	return new Promise((resolve, reject) => {
		const ws = new WebSocket(url);
		const pending = new Map();
		let nextId = 0;
		ws.addEventListener('open', () => resolve({ ws, send }));
		ws.addEventListener('error', reject);
		ws.addEventListener('message', (event) => {
			const msg = JSON.parse(event.data);
			if (msg.id && pending.has(msg.id)) {
				const { resolve: done, reject: fail } = pending.get(msg.id);
				pending.delete(msg.id);
				if (msg.error) fail(new Error(JSON.stringify(msg.error)));
				else done(msg.result);
			}
		});
		function send(method, params = {}) {
			const id = ++nextId;
			return new Promise((done, fail) => {
				pending.set(id, { resolve: done, reject: fail });
				ws.send(JSON.stringify({ id, method, params }));
			});
		}
	});
}

async function waitPage() {
	for (let i = 0; i < 50; i++) {
		try {
			const list = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`).then((r) => r.json());
			const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
			if (page) return page;
		} catch {}
		await sleep(150);
	}
	throw new Error('CDP page not ready');
}

async function routeStatus(urlPath) {
	try {
		const res = await fetch(BASE + urlPath, { redirect: 'manual' });
		return res.status;
	} catch (err) {
		return String(err);
	}
}

function onGrid(value, origin = 0) {
	const n = Math.round((value - origin) * 100) / 100;
	const rem = ((n % GRID) + GRID) % GRID;
	return rem < 0.75 || rem > GRID - 0.75;
}

const ASSERT = process.argv.includes('--assert');

export async function lockDesign() {
	mkdirSync(path.join(OUT, 'baselines'), { recursive: true });
	const profile = `/tmp/chrome-lock-${Date.now()}`;
	const chrome = spawn(
		'google-chrome',
		[
			'--headless=new',
			'--disable-gpu',
			'--no-sandbox',
			'--hide-scrollbars',
			`--remote-debugging-port=${CDP_PORT}`,
			`--user-data-dir=${profile}`,
			'about:blank'
		],
		{ stdio: 'ignore' }
	);

	try {
		const target = await waitPage();
		const session = await openCdp(target.webSocketDebuggerUrl);
		await session.send('Page.enable');
		await session.send('Runtime.enable');

		const shots = [];
		for (const shot of SHOTS) {
			await session.send('Emulation.setDeviceMetricsOverride', {
				width: shot.width,
				height: shot.height,
				deviceScaleFactor: 1,
				mobile: shot.width < 800
			});
			await session.send('Page.navigate', { url: BASE + shot.path });
			for (let i = 0; i < 50; i++) {
				const ready = await session.send('Runtime.evaluate', {
					expression: 'document.readyState',
					returnByValue: true
				});
				if (ready.result.value === 'complete') break;
				await sleep(100);
			}
			await session.send('Runtime.evaluate', { expression: FREEZE, awaitPromise: true });
			await sleep(250);
			const probed = await session.send('Runtime.evaluate', {
				expression: PROBE,
				returnByValue: true
			});
			const shotPng = await session.send('Page.captureScreenshot', { format: 'png' });
			const file = path.join(OUT, 'baselines', `${shot.name}.png`);
			writeFileSync(file, Buffer.from(shotPng.data, 'base64'));
			shots.push({ ...shot, file, probe: probed.result.value });
		}

		session.ws.close();

		const routes = {
			'/': await routeStatus('/'),
			'/design': await routeStatus('/design'),
			'/engineer': await routeStatus('/engineer'),
			'/blog': await routeStatus('/blog'),
			'/redesign': await routeStatus('/redesign'),
			'/anh-nhi': await routeStatus('/anh-nhi')
		};

		const geometry = [];
		const overlaps = [];
		for (const shot of shots) {
			const probe = shot.probe;
			overlaps.push({
				name: shot.name,
				count: probe.overlapCount,
				samples: probe.overlaps
			});
			const originX = probe.shell?.x ?? 0;
			const canvasX = probe.canvas?.x ?? originX;
			for (const code of shot.codes) {
				const hit = probe.codes[code];
				if (!hit || hit.w === 0) {
					geometry.push({
						name: shot.name,
						code,
						ok: false,
						reason: 'missing'
					});
					continue;
				}
				const widthOk = Math.abs(hit.w - KEY) < 0.75;
				const wantH = code === 'H' ? GRID : KEY;
				const heightOk = Math.abs(hit.h - wantH) < 0.75;
				const xOk = onGrid(hit.x, originX);
				const gap =
					hit.nextX == null ? null : Math.round((hit.nextX - (hit.x + hit.w)) * 100) / 100;
				const flushOk = code === 'H' || (gap != null && Math.abs(gap) < 1);
				const wantNext = code === 'H' ? null : code.startsWith('E') ? KEY : KEY + GRID;
				const nextOk = wantNext == null || Math.abs((hit.nextW ?? 0) - wantNext) < 0.75;
				const leftInset = Math.round((hit.x - canvasX) * 100) / 100;
				const leftOk = code === 'H' || Math.abs(leftInset) < 1;
				geometry.push({
					name: shot.name,
					code,
					ok: widthOk && heightOk && xOk && flushOk && nextOk && leftOk,
					x: hit.x,
					w: hit.w,
					h: hit.h,
					originX,
					canvasX,
					leftInset,
					gap,
					nextW: hit.nextW,
					widthOk,
					heightOk,
					xOk,
					flushOk,
					nextOk,
					leftOk
				});
			}
		}

		const report = {
			generatedAt: new Date().toISOString(),
			routes,
			geometry,
			overlaps,
			shots: shots.map((s) => ({
				name: s.name,
				path: s.path,
				width: s.width,
				file: s.file,
				overlapCount: s.probe.overlapCount,
				shell: s.probe.shell,
				canvas: s.probe.canvas
			}))
		};
		writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
		if (ASSERT) {
			const failed = [];
			for (const row of geometry) {
				if (!row.ok) failed.push(`geometry ${row.name} ${row.code}`);
			}
			for (const row of overlaps) {
				if (row.count > 0) failed.push(`overlap ${row.name} ${row.count}`);
			}
			if (routes['/redesign'] !== 404) failed.push(`redesign status ${routes['/redesign']}`);
			if (routes['/anh-nhi'] !== 404) failed.push(`anh-nhi status ${routes['/anh-nhi']}`);
			if (failed.length) {
				console.error(failed.join('\n'));
				process.exitCode = 1;
			}
		}
		return report;
	} finally {
		chrome.kill('SIGKILL');
	}
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
	const report = await lockDesign();
	console.log(JSON.stringify(report, null, 2));
}
