const YEAR = /^\d{4}$/;
const CALENDAR_DAY = /^\d{4}-\d{2}-\d{2}$/;
const LEADING_YEAR = /^(\d{4})/;

export function publishedYear(date: string): string {
	return LEADING_YEAR.exec(date)?.[1] ?? date;
}

export function publishedDateValue(date: string): string {
	if (YEAR.test(date)) return date;

	const parsed = CALENDAR_DAY.test(date) ? new Date(`${date}T00:00:00.000Z`) : new Date(date);
	if (Number.isNaN(parsed.getTime())) return date;
	return parsed.toISOString();
}

export function publishedMillis(date: string): number {
	if (YEAR.test(date)) return Date.parse(`${date}-01-01T00:00:00.000Z`);
	if (CALENDAR_DAY.test(date)) return Date.parse(`${date}T00:00:00.000Z`);
	const parsed = Date.parse(date);
	return Number.isNaN(parsed) ? Number.NEGATIVE_INFINITY : parsed;
}

export function comparePublishedDesc(
	a: { date: string; slug: string },
	b: { date: string; slug: string }
): number {
	const delta = publishedMillis(b.date) - publishedMillis(a.date);
	if (delta !== 0) return delta;
	if (a.slug < b.slug) return -1;
	if (a.slug > b.slug) return 1;
	return 0;
}
