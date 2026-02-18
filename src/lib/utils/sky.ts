/**
 * Sky gradient calculator.
 * Returns a CSS linear-gradient string (top → bottom) that matches real sky
 * colours at the given local time.
 */

interface SkyKeyframe {
	/** Hour of day in decimal form (e.g. 6.5 = 06:30) */
	hour: number;
	/** RGB at the zenith (top of gradient) */
	zenith: readonly [number, number, number];
	/** RGB at the horizon (bottom of gradient) */
	horizon: readonly [number, number, number];
}

/**
 * Hand-tuned keyframes based on real sky-colour references.
 * The list must be sorted by `hour` and include a sentinel at 24 that
 * matches the value at 0 so midnight wraps correctly.
 */
const keyframes: SkyKeyframe[] = [
	{ hour: 0, zenith: [2, 6, 20], horizon: [8, 20, 40] }, // Deep night
	{ hour: 4, zenith: [4, 8, 28], horizon: [10, 20, 42] }, // Pre-dawn
	{ hour: 5, zenith: [8, 12, 46], horizon: [18, 16, 60] }, // Astronomical twilight
	{ hour: 5.5, zenith: [14, 18, 70], horizon: [120, 32, 55] }, // Nautical dawn
	{ hour: 6, zenith: [22, 24, 96], horizon: [200, 88, 72] }, // Civil dawn — blue-purple → warm orange
	{ hour: 6.5, zenith: [26, 76, 170], horizon: [255, 152, 80] }, // Sunrise — blue sky, warm horizon
	{ hour: 7, zenith: [26, 108, 212], horizon: [240, 200, 112] }, // Post-sunrise — blue sky, golden horizon
	{ hour: 8, zenith: [20, 128, 224], horizon: [138, 196, 242] }, // Morning — clear blue
	{ hour: 10, zenith: [15, 108, 218], horizon: [120, 180, 234] }, // Day blue
	{ hour: 12, zenith: [15, 106, 216], horizon: [120, 176, 232] }, // Noon
	{ hour: 15, zenith: [18, 106, 210], horizon: [122, 176, 226] }, // Afternoon
	{ hour: 17, zenith: [20, 96, 194], horizon: [112, 148, 210] }, // Late afternoon
	{ hour: 17.5, zenith: [16, 78, 168], horizon: [192, 158, 95] }, // Pre-golden hour
	{ hour: 18, zenith: [12, 60, 144], horizon: [224, 136, 32] }, // Golden hour
	{ hour: 18.5, zenith: [58, 24, 136], horizon: [255, 86, 34] }, // Sunset
	{ hour: 19, zenith: [26, 8, 80], horizon: [70, 10, 42] }, // Dusk
	{ hour: 19.5, zenith: [12, 6, 46], horizon: [22, 6, 30] }, // Nautical dusk
	{ hour: 20, zenith: [2, 6, 20], horizon: [8, 20, 40] }, // Night
	{ hour: 24, zenith: [2, 6, 20], horizon: [8, 20, 40] } // Sentinel (wraps to midnight)
];

function lerp(a: number, b: number, t: number): number {
	return Math.round(a + (b - a) * t);
}

function lerpRgb(
	a: readonly [number, number, number],
	b: readonly [number, number, number],
	t: number
): [number, number, number] {
	return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function toRgb([r, g, b]: [number, number, number]): string {
	return `rgb(${r},${g},${b})`;
}

/**
 * Returns a CSS `linear-gradient` string representing the sky at the given
 * Date's local time.  Update the Date once per minute for a live effect.
 */
export function getSkyGradient(date: Date): string {
	const hour = date.getHours() + date.getMinutes() / 60;

	// Find the surrounding keyframes
	let before = keyframes[keyframes.length - 2];
	let after = keyframes[keyframes.length - 1];

	for (let i = 0; i < keyframes.length - 1; i++) {
		if (hour >= keyframes[i].hour && hour < keyframes[i + 1].hour) {
			before = keyframes[i];
			after = keyframes[i + 1];
			break;
		}
	}

	const span = after.hour - before.hour;
	const t = span > 0 ? (hour - before.hour) / span : 0;

	const zenith = lerpRgb(before.zenith, after.zenith, t);
	const horizon = lerpRgb(before.horizon, after.horizon, t);

	return `linear-gradient(to bottom, ${toRgb(zenith)}, ${toRgb(horizon)})`;
}
