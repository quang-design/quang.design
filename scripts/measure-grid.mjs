import { chromium, firefox, webkit } from '@playwright/test';
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.MEASURE_BASE || 'http://127.0.0.1:5173';
const OUT_DIR = process.env.MEASURE_OUT || path.join(ROOT, 'tests/grid-measure');
const LABEL = process.env.MEASURE_LABEL || 'run';
const ROOT_FONT = process.env.MEASURE_ROOT_FONT || '';
const SHOTS = process.env.MEASURE_SHOTS === '1';
const SHOT_DIR = process.env.MEASURE_SHOT_DIR || '';

const VIEWPORTS = [
	{ name: 'desktop-1440', width: 1440, height: 900 },
	{ name: 'mobile-390', width: 390, height: 844 }
];

const ALL_ENGINES = [
	{ name: 'chromium', launcher: chromium },
	{ name: 'webkit', launcher: webkit },
	{ name: 'firefox', launcher: firefox }
];
const ENGINE_FILTER = (process.env.MEASURE_ENGINES || 'chromium,webkit,firefox')
	.split(',')
	.map((s) => s.trim())
	.filter(Boolean);
const ENGINES = ALL_ENGINES.filter((e) => ENGINE_FILTER.includes(e.name));

function designPaths() {
	const dir = path.join(ROOT, 'src/content/design');
	const slugs = readdirSync(dir, { withFileTypes: true })
		.filter((d) => d.isDirectory())
		.map((d) => d.name)
		.sort();
	return slugs.map((s) => `/design/${s}`);
}

function blogPaths() {
	const dir = path.join(ROOT, 'src/content/blog');
	try {
		const slugs = readdirSync(dir, { withFileTypes: true })
			.filter((d) => d.isDirectory())
			.map((d) => d.name)
			.sort();
		return ['/blog', ...slugs.map((s) => `/blog/posts/${s}`)];
	} catch {
		return ['/blog'];
	}
}

function measurePaths() {
	return [
		'/',
		'/design',
		...designPaths(),
		'/engineer',
		'/engineer/telescopic',
		'/engineer/microscopic',
		'/engineer/minesweeper',
		'/engineer/animation-vocabulary',
		...blogPaths()
	];
}

function offsetFromGrid(value, grid) {
	const mod = ((value % grid) + grid) % grid;
	return Math.min(mod, grid - mod);
}

const PROBE = `(() => {
  const gridRaw = getComputedStyle(document.documentElement).getPropertyValue('--grid').trim();
  let grid = 24;
  if (gridRaw.endsWith('px')) {
    const n = parseFloat(gridRaw);
    if (n > 0) grid = n;
  } else {
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;height:var(--grid);width:0';
    document.documentElement.appendChild(probe);
    const h = probe.getBoundingClientRect().height;
    probe.remove();
    if (h > 0) grid = h;
  }

  const shell = document.querySelector('.shell') || document.documentElement;
  const shellTop = shell.getBoundingClientRect().top;
  const scrollTop = shell.scrollTop || 0;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const alphabeticBaselines = (el) => {
    const cs = getComputedStyle(el);
    const tag = el.tagName;
    if (tag === 'IMG' || tag === 'FIGURE' || tag === 'SVG' || tag === 'VIDEO') return [];
    const text = (el.textContent || '').replace(/\\s+/g, ' ').trim();
    if (!text) return [];
    ctx.font = cs.font;
    const tm = ctx.measureText('Hg');
    const ascent =
      tm.fontBoundingBoxAscent ??
      tm.actualBoundingBoxAscent ??
      parseFloat(cs.fontSize) * 0.8;
    const fontSize = parseFloat(cs.fontSize) || 12;
    const lineHeight = parseFloat(cs.lineHeight) || fontSize;
    const padTop = parseFloat(cs.paddingTop) || 0;
    const trim = (cs.textBoxTrim || cs.getPropertyValue('text-box-trim') || '').trim();
    const trimmed = trim && trim !== 'none';

    const range = document.createRange();
    try {
      range.selectNodeContents(el);
    } catch {
      return [];
    }
    const raw = [...range.getClientRects()].filter((r) => r.width > 1 && r.height > 1);
    const lines = [];
    for (const rect of raw) {
      if (lines.some((l) => Math.abs(l.top - rect.top) < 1.5)) continue;
      lines.push(rect);
    }
    if (!lines.length) return [];

    const box = el.getBoundingClientRect();
    const pageTop = box.top - shellTop + scrollTop;

    if (trimmed) {
      const capProbe = document.createElement('span');
      capProbe.style.cssText =
        'position:absolute;visibility:hidden;pointer-events:none;font:inherit;height:1cap;display:block';
      el.appendChild(capProbe);
      const cap = capProbe.getBoundingClientRect().height || fontSize * 0.7;
      capProbe.remove();
      const first = pageTop + padTop + cap;
      return lines.map((_, i) => first + i * lineHeight);
    }

    return lines.map((rect) => {
      const halfLeading = Math.max(0, (rect.height - fontSize) / 2);
      return rect.top + halfLeading + ascent - shellTop + scrollTop;
    });
  };

  const selectors = [
    'img',
    'figure',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'li', 'label',
    '.ink-h1', '.ink-h2', '.ink-h3', '.ink-h4', '.ink-h5', '.ink-h6',
    '.ink-read', '.ink-label', '.ink-row', '.ink-row-title', '.ink-row-meta', '.ink-row-desc',
    '.gallery p', '.gallery h2',
    '.shell-head *', '.status-brand *', '.status-meta *'
  ];
  const seen = new Set();
  const els = [];
  for (const sel of selectors) {
    for (const el of document.querySelectorAll(sel)) {
      if (seen.has(el)) continue;
      seen.add(el);
      els.push(el);
    }
  }

  const items = [];
  for (const el of els) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    const pageTop = r.top - shellTop + scrollTop;
    const pageBottom = r.bottom - shellTop + scrollTop;
    const pageLeft = r.left;
    const tag = el.tagName.toLowerCase();
    const cls =
      typeof el.className === 'string' ? el.className.trim().split(/\\s+/).slice(0, 3).join('.') : '';
    const baselines = alphabeticBaselines(el);
    items.push({
      tag,
      cls,
      src: el.getAttribute('src') || '',
      top: pageTop,
      bottom: pageBottom,
      left: pageLeft,
      height: r.height,
      width: r.width,
      baselines
    });
  }
  return {
    grid,
    rootFontSize: getComputedStyle(document.documentElement).fontSize,
    count: items.length,
    items
  };
})()`;

function summarize(items, grid) {
	let off = 0;
	let sum = 0;
	let max = 0;
	const edges = [];
	for (const it of items) {
		for (const edge of ['top', 'bottom', 'left', 'height']) {
			const value = edge === 'height' ? it.height : it[edge];
			const offPx = offsetFromGrid(value, grid);
			edges.push(offPx);
			sum += offPx;
			if (offPx > max) max = offPx;
			if (offPx > 0.5) off += 1;
		}
	}
	const checked = edges.length;

	let baseChecked = 0;
	let baseOff = 0;
	let baseSum = 0;
	let baseMax = 0;
	for (const it of items) {
		for (const y of it.baselines || []) {
			const offPx = offsetFromGrid(y, grid);
			baseChecked += 1;
			baseSum += offPx;
			if (offPx > baseMax) baseMax = offPx;
			if (offPx > 0.5) baseOff += 1;
		}
	}

	return {
		elements: items.length,
		edgesChecked: checked,
		edgesOffGrid: off,
		maxOffsetPx: Number(max.toFixed(3)),
		meanOffsetPx: checked ? Number((sum / checked).toFixed(3)) : 0,
		baselinesChecked: baseChecked,
		baselinesOffGrid: baseOff,
		baselineMaxOffsetPx: Number(baseMax.toFixed(3)),
		baselineMeanOffsetPx: baseChecked ? Number((baseSum / baseChecked).toFixed(3)) : 0
	};
}

async function measurePage(page, urlPath) {
	await page.goto(BASE + urlPath, { waitUntil: 'load', timeout: 60_000 });
	if (ROOT_FONT) {
		await page.addStyleTag({ content: `html { font-size: ${ROOT_FONT} !important; }` });
	}
	await page.evaluate(async () => {
		const imgs = [...document.images];
		await Promise.all(
			imgs.map(
				(img) =>
					img.complete ||
					new Promise((resolve) => {
						img.addEventListener('load', resolve, { once: true });
						img.addEventListener('error', resolve, { once: true });
						setTimeout(resolve, 1500);
					})
			)
		);
		const shell = document.querySelector('.shell');
		if (shell) shell.scrollTop = 0;
		await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
	});
	return page.evaluate(PROBE);
}

async function shotWithOverlay(page, filePath) {
	await page.evaluate(() => {
		const id = '__grid_overlay__';
		if (document.getElementById(id)) return;
		const overlay = document.createElement('div');
		overlay.id = id;
		overlay.style.cssText =
			'position:fixed;inset:0;pointer-events:none;z-index:99999;' +
			'background-image:repeating-linear-gradient(to bottom, rgba(255,0,0,0.18) 0, rgba(255,0,0,0.18) 1px, transparent 1px, transparent 24px),' +
			'repeating-linear-gradient(to right, rgba(0,80,255,0.12) 0, rgba(0,80,255,0.12) 1px, transparent 1px, transparent 24px);';
		document.documentElement.appendChild(overlay);
	});
	await page.screenshot({ path: filePath, fullPage: false });
	await page.evaluate(() => document.getElementById('__grid_overlay__')?.remove());
}

async function runEngine(engine, paths) {
	const browser = await engine.launcher.launch({ headless: true });
	const results = [];
	try {
		for (const vp of VIEWPORTS) {
			for (const urlPath of paths) {
				const context = await browser.newContext({
					viewport: { width: vp.width, height: vp.height },
					deviceScaleFactor: 1
				});
				const page = await context.newPage();
				try {
					const data = await measurePage(page, urlPath);
					const summary = summarize(data.items, data.grid);
					results.push({
						engine: engine.name,
						viewport: vp.name,
						path: urlPath,
						gridPx: data.grid,
						rootFontSize: data.rootFontSize,
						...summary
					});
					if (SHOTS && SHOT_DIR) {
						const safe = `${LABEL}-${engine.name}-${vp.name}${urlPath.replace(/\//g, '_') || '_home'}.png`;
						await shotWithOverlay(page, path.join(SHOT_DIR, safe));
					}
				} catch (err) {
					results.push({
						engine: engine.name,
						viewport: vp.name,
						path: urlPath,
						error: String(err)
					});
				}
				await context.close();
			}
			console.error(`done ${engine.name} ${vp.name}`);
		}
	} finally {
		await browser.close();
	}
	return results;
}

function aggregate(rows) {
	const ok = rows.filter((r) => !r.error);
	const edgesChecked = ok.reduce((a, r) => a + r.edgesChecked, 0);
	const edgesOffGrid = ok.reduce((a, r) => a + r.edgesOffGrid, 0);
	const maxOffsetPx = ok.reduce((a, r) => Math.max(a, r.maxOffsetPx), 0);
	const meanOffsetPx = edgesChecked
		? Number(
				(ok.reduce((a, r) => a + r.meanOffsetPx * r.edgesChecked, 0) / edgesChecked).toFixed(3)
			)
		: 0;
	const baselinesChecked = ok.reduce((a, r) => a + (r.baselinesChecked || 0), 0);
	const baselinesOffGrid = ok.reduce((a, r) => a + (r.baselinesOffGrid || 0), 0);
	const baselineMaxOffsetPx = ok.reduce((a, r) => Math.max(a, r.baselineMaxOffsetPx || 0), 0);
	const baselineMeanOffsetPx = baselinesChecked
		? Number(
				(
					ok.reduce((a, r) => a + (r.baselineMeanOffsetPx || 0) * (r.baselinesChecked || 0), 0) /
					baselinesChecked
				).toFixed(3)
			)
		: 0;
	return {
		pages: ok.length,
		errors: rows.length - ok.length,
		elements: ok.reduce((a, r) => a + r.elements, 0),
		edgesChecked,
		edgesOffGrid,
		maxOffsetPx: Number(maxOffsetPx.toFixed(3)),
		meanOffsetPx,
		offGridRate: edgesChecked ? Number((edgesOffGrid / edgesChecked).toFixed(4)) : 0,
		baselinesChecked,
		baselinesOffGrid,
		baselineMaxOffsetPx: Number(baselineMaxOffsetPx.toFixed(3)),
		baselineMeanOffsetPx,
		baselineOffRate: baselinesChecked ? Number((baselinesOffGrid / baselinesChecked).toFixed(4)) : 0
	};
}

async function main() {
	mkdirSync(OUT_DIR, { recursive: true });
	if (SHOT_DIR) mkdirSync(SHOT_DIR, { recursive: true });
	const paths = measurePaths();
	const all = [];
	for (const engine of ENGINES) {
		try {
			const rows = await runEngine(engine, paths);
			all.push(...rows);
			console.error(`done ${engine.name}: ${rows.length} page×viewport rows`);
		} catch (err) {
			console.error(`engine ${engine.name} failed:`, err);
			all.push({ engine: engine.name, error: String(err) });
		}
	}
	const totals = aggregate(all);
	const payload = {
		label: LABEL,
		base: BASE,
		rootFont: ROOT_FONT || 'browser-default',
		measured:
			'top/bottom/left/height of img/figure/heading/text; alphabetic baseline Y per text line (Canvas fontBoundingBoxAscent within each getClientRects line, or line-box bottom when text-box-trim is active); offset = distance in px to nearest multiple of resolved --grid',
		how: 'Playwright Chromium+WebKit+Firefox; viewports 1440×900 and 390×844; home, design, engineer tools, blog; page coords via .shell scroll',
		totals,
		rows: all
	};
	const outFile = path.join(OUT_DIR, `${LABEL}.json`);
	writeFileSync(outFile, JSON.stringify(payload, null, 2));
	console.log(JSON.stringify({ outFile, totals }, null, 2));
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
