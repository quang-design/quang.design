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
		name: 'toggle-on-1440-dpr1-light',
		width: 1440,
		height: 900,
		dpr: 1,
		dark: false,
		on: true
	},
	{ name: 'toggle-on-390-dpr1-light', width: 390, height: 844, dpr: 1, dark: false, on: true },
	{
		name: 'toggle-on-1440-dpr3-light',
		width: 1440,
		height: 900,
		dpr: 3,
		dark: false,
		on: true
	},
	{ name: 'toggle-on-390-dpr3-light', width: 390, height: 844, dpr: 3, dark: false, on: true },
	{ name: 'toggle-on-1440-dpr1-dark', width: 1440, height: 900, dpr: 1, dark: true, on: true },
	{ name: 'toggle-on-390-dpr1-dark', width: 390, height: 844, dpr: 1, dark: true, on: true },
	{
		name: 'toggle-off-1440-dpr1-light',
		width: 1440,
		height: 900,
		dpr: 1,
		dark: false,
		on: false
	},
	{ name: 'toggle-off-390-dpr1-light', width: 390, height: 844, dpr: 1, dark: false, on: false }
];

const browser = await chromium.launch({ headless: true });
try {
	for (const c of cases) {
		const context = await browser.newContext({
			viewport: { width: c.width, height: c.height },
			deviceScaleFactor: c.dpr,
			colorScheme: c.dark ? 'dark' : 'light'
		});
		await context.addInitScript((on) => {
			localStorage.setItem('qd-grid-overlay', on ? '1' : '0');
		}, c.on);
		const page = await context.newPage();
		await page.goto(BASE + '/design/powder-therapy', { waitUntil: 'load', timeout: 60_000 });
		if (c.dark) {
			await page.evaluate(() => document.documentElement.classList.add('dark'));
		} else {
			await page.evaluate(() => document.documentElement.classList.remove('dark'));
		}
		await page.waitForTimeout(300);
		const overlay = await page.evaluate(() => {
			const el = document.querySelector('.grid-overlay');
			if (!el) return { present: false };
			const cs = getComputedStyle(el);
			const sample = document.createElement('canvas');
			sample.width = 48;
			sample.height = 48;
			return {
				present: true,
				line: cs.getPropertyValue('--grid-line').trim(),
				bgHead: cs.backgroundImage.slice(0, 120),
				size: cs.backgroundSize,
				z: cs.zIndex,
				pe: cs.pointerEvents
			};
		});
		const file = path.join(OUT, `${c.name}.png`);
		await page.screenshot({ path: file, fullPage: false });
		console.log(JSON.stringify({ file: path.basename(file), overlay }));
		await context.close();
	}
} finally {
	await browser.close();
}
