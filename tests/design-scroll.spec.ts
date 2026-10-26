import { expect, test } from '@playwright/test';

test('sidebar navigation opens the next design article at the top', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/design/doppio');

	const doppio = page.getByRole('heading', { level: 1, name: /doppio/i });
	await expect(doppio).toBeVisible();

	await page.locator('.shell').evaluate((el) => {
		el.scrollTop = 2500;
	});
	await expect(doppio).not.toBeInViewport();

	await page
		.locator('.shell-index')
		.getByRole('link', { name: /suda coffee/i })
		.click();

	await expect(page).toHaveURL(/\/design\/suda$/);
	const suda = page.getByRole('heading', { level: 1, name: /suda/i });
	await expect(suda).toBeVisible();
	const box = await suda.boundingBox();
	expect(box).not.toBeNull();
	expect(box!.y).toBeGreaterThan(40);
	expect(box!.y).toBeLessThan(240);

	await page.goBack();
	await expect(page).toHaveURL(/\/design\/doppio$/);
	await expect(doppio).not.toBeInViewport();

	await page.goForward();
	await expect(page).toHaveURL(/\/design\/suda$/);
	const restored = await suda.boundingBox();
	expect(restored).not.toBeNull();
	expect(restored!.y).toBeGreaterThan(40);
	expect(restored!.y).toBeLessThan(240);
});
