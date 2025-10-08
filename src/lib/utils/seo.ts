export interface SEOData {
	title: string;
	description: string;
	canonical?: string;
	image?: string;
	type?: 'website' | 'article' | 'profile';
	publishedTime?: string;
	modifiedTime?: string;
	author?: string;
	tags?: string[];
}

export function generateStructuredData(data: SEOData & { url: string }) {
	const baseStructuredData = {
		'@context': 'https://schema.org',
		'@type': data.type === 'article' ? 'BlogPosting' : 'WebPage',
		headline: data.title,
		description: data.description,
		url: data.url,
		image: data.image ? [data.image] : undefined,
		author: data.author
			? {
					'@type': 'Person',
					name: data.author
				}
			: undefined,
		publisher: {
			'@type': 'Person',
			name: 'Quang',
			url: 'https://quang.design'
		},
		datePublished: data.publishedTime,
		dateModified: data.modifiedTime || data.publishedTime,
		keywords: data.tags?.join(', ')
	};

	// Remove undefined properties
	return JSON.stringify(
		Object.fromEntries(
			Object.entries(baseStructuredData).filter(([_, value]) => value !== undefined)
		),
		null,
		2
	);
}

