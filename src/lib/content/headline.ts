const brands: Record<string, string> = {
	doppio: 'Doppio Kaffè',
	namka: 'Namka Coffee',
	'monsieur-luxe': 'Monsieur Luxe',
	'fuck-go': 'Fuck+Go',
	'face-mask': 'Face Mask',
	alluvia: 'Alluvia Chocolate',
	'717': '717 Architects'
};

export function designHeadline(title: string, slug: string) {
	const parts = title.split(/\s[-–—]\s/);
	if (parts.length >= 2) {
		return { brand: parts[0].toUpperCase(), line: parts.slice(1).join(' — ') };
	}
	const brand = (brands[slug] ?? slug.replace(/-/g, ' ')).toUpperCase();
	return { brand, line: title };
}
