import { chromium } from '@playwright/test';

const BASE = process.env.MEASURE_BASE || 'http://127.0.0.1:5173';
const PATH = '/blog/posts/security-headers-sveltekit';
const GRID = 24;
const MAX_OFF = 0.5;

const cases = [
	{ width: 390, height: 844, scroll: 600 },
	{ width: 1440, height: 900, scroll: 700 }
];

const browser = await chromium.launch({ headless: true });
let failed = false;

try {
	for (const c of cases) {
		const context = await browser.newContext({
			viewport: { width: c.width, height: c.height },
			deviceScaleFactor: 1,
			colorScheme: 'light'
		});
		await context.addInitScript(() => {
			localStorage.setItem('qd-grid-overlay', '1');
		});
		const page = await context.newPage();
		await page.goto(BASE + PATH, { waitUntil: 'load', timeout: 60_000 });
		await page.evaluate(() => {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('qd-grid-overlay', '1');
		});
		await page.waitForTimeout(400);
		await page.evaluate((y) => {
			const shell = document.querySelector('.shell');
			if (shell) shell.scrollTop = y;
		}, c.scroll);
		await page.waitForTimeout(200);

		const result = await page.evaluate((grid) => {
			const shell = document.querySelector('.shell');
			const sheet = document.querySelector('.shell-sheet');
			const overlay = document.querySelector('.shell-sheet > .grid-overlay');
			const h2 = [...document.querySelectorAll('h2')].find((h) =>
				(h.textContent || '').includes('TL;DR')
			);
			const two = [...document.querySelectorAll('p')].find((p) =>
				(p.textContent || '').includes('Two files')
			);
			if (!shell || !sheet || !h2 || !two) {
				return {
					error: 'missing nodes',
					has: {
						shell: !!shell,
						sheet: !!sheet,
						overlay: !!overlay,
						h2: !!h2,
						two: !!two
					}
				};
			}
			const origin = (overlay || sheet).getBoundingClientRect().top;
			const st = shell.getBoundingClientRect().top;
			const sc = shell.scrollTop || 0;
			const baseline = (el) => {
				const cs = getComputedStyle(el);
				const r = el.getBoundingClientRect();
				const pad = parseFloat(cs.paddingTop) || 0;
				const lh = parseFloat(cs.lineHeight) || grid;
				const cap = document.createElement('span');
				cap.style.cssText =
					'position:absolute;visibility:hidden;font:inherit;height:1cap;display:block';
				el.appendChild(cap);
				const ch = cap.getBoundingClientRect().height;
				cap.remove();
				const first = r.top + pad + ch;
				const range = document.createRange();
				range.selectNodeContents(el);
				const raw = [...range.getClientRects()].filter((rr) => rr.width > 1 && rr.height > 1);
				const lines = [];
				for (const rect of raw) {
					if (lines.some((l) => Math.abs(l.top - rect.top) < 1.5)) continue;
					lines.push(rect);
				}
				const offs = lines.map((_, i) => {
					const viewY = first + i * lh;
					const local = viewY - origin;
					const mod = ((local % grid) + grid) % grid;
					return Math.min(mod, grid - mod);
				});
				return {
					lh,
					fontSize: cs.fontSize,
					lineCount: lines.length,
					maxOff: offs.length ? Math.max(...offs) : 99,
					offs,
					pb: el.style.paddingBottom || '',
					h: r.height,
					pageTop: r.top - st + sc
				};
			};
			return {
				scrollTop: shell.scrollTop,
				h2: baseline(h2),
				two: baseline(two)
			};
		}, GRID);

		await context.close();

		if (result.error) {
			console.error(c.width, result);
			failed = true;
			continue;
		}

		const headingOk = result.h2.maxOff <= MAX_OFF && result.h2.lh === GRID;
		const twoOk = result.two.maxOff <= MAX_OFF;
		const ok = headingOk && twoOk;
		console.log(
			JSON.stringify({
				viewport: `${c.width}x${c.height}`,
				scroll: c.scroll,
				h2: {
					lh: result.h2.lh,
					fontSize: result.h2.fontSize,
					lines: result.h2.lineCount,
					maxOff: +result.h2.maxOff.toFixed(3),
					pb: result.h2.pb
				},
				twoOff: +result.two.maxOff.toFixed(3),
				ok
			})
		);
		if (!ok) failed = true;
	}
} finally {
	await browser.close();
}

if (failed) {
	console.error('FAIL: heading lines or Two files baseline off > 0.5px');
	process.exit(1);
}
console.log('PASS: 1× heading lines and Two files on grid');
