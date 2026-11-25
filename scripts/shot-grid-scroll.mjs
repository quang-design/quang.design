import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const BASE = process.env.MEASURE_BASE || 'http://127.0.0.1:5173';
const OUT =
	process.env.SHOT_DIR ||
	'/cursor/stores/bc-4a844339-8fac-4576-96e3-65bd9b6438db/media/css-snap-grid';

mkdirSync(OUT, { recursive: true });

const cases = [
	{
		name: 'scroll-top-390-telescopic',
		width: 390,
		height: 844,
		path: '/engineer/telescopic',
		scroll: 0
	},
	{
		name: 'scroll-mid-390-telescopic',
		width: 390,
		height: 844,
		path: '/engineer/telescopic',
		scroll: 200
	},
	{
		name: 'scroll-top-1440-telescopic',
		width: 1440,
		height: 900,
		path: '/engineer/telescopic',
		scroll: 0
	},
	{
		name: 'scroll-mid-1440-telescopic',
		width: 1440,
		height: 900,
		path: '/engineer/telescopic',
		scroll: 200
	},
	{
		name: 'scroll-top-390-blog',
		width: 390,
		height: 844,
		path: '/blog/posts/security-headers-sveltekit',
		scroll: 0
	},
	{
		name: 'scroll-mid-390-blog',
		width: 390,
		height: 844,
		path: '/blog/posts/security-headers-sveltekit',
		scroll: 600
	},
	{
		name: 'scroll-top-1440-blog',
		width: 1440,
		height: 900,
		path: '/blog/posts/security-headers-sveltekit',
		scroll: 0
	},
	{
		name: 'scroll-mid-1440-blog',
		width: 1440,
		height: 900,
		path: '/blog/posts/security-headers-sveltekit',
		scroll: 700
	}
];

const browser = await chromium.launch({ headless: true });
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
		await page.goto(BASE + c.path, { waitUntil: 'load', timeout: 60_000 });
		await page.evaluate(() => {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('qd-grid-overlay', '1');
		});
		await page.waitForTimeout(400);
		if (c.scroll > 0) {
			await page.evaluate((y) => {
				const shell = document.querySelector('.shell');
				if (shell) shell.scrollTop = y;
			}, c.scroll);
			await page.waitForTimeout(200);
		}
		const info = await page.evaluate(() => {
			const shell = document.querySelector('.shell');
			const overlays = [...document.querySelectorAll('.grid-overlay')].map((el) => {
				const r = el.getBoundingClientRect();
				const cs = getComputedStyle(el);
				return {
					pos: cs.position,
					top: +r.top.toFixed(1),
					height: +r.height.toFixed(1),
					pe: cs.pointerEvents,
					parent: el.parentElement?.className?.toString().slice(0, 40)
				};
			});
			const h1 = document.querySelector('.shell-canvas .ink-h1, .shell-canvas .ink-display');
			let baseline = null;
			if (h1) {
				const cs = getComputedStyle(h1);
				const pad = parseFloat(cs.paddingTop) || 0;
				const cap = document.createElement('span');
				cap.style.cssText =
					'position:absolute;visibility:hidden;font:inherit;height:1cap;display:block';
				h1.appendChild(cap);
				const ch = cap.getBoundingClientRect().height;
				cap.remove();
				const y = h1.getBoundingClientRect().top + pad + ch;
				const rem = ((y % 24) + 24) % 24;
				baseline = {
					viewportY: +y.toFixed(2),
					remToLine: +Math.min(rem, 24 - rem).toFixed(3)
				};
			}
			return { scrollTop: shell?.scrollTop ?? 0, overlays, baseline };
		});
		const file = path.join(OUT, `${c.name}.png`);
		await page.screenshot({ path: file, fullPage: false });
		console.log(JSON.stringify({ file: path.basename(file), info }));
		await context.close();
	}
} finally {
	await browser.close();
}
