export const siteName = 'quang.design';

export const pages = {
	home: {
		title: 'Quang | Vietnamese graphic designer, design engineer',
		description:
			'Quang is a Vietnamese graphic designer and design engineer in Nha Trang. He builds brand identities and tools for the web.'
	},
	design: {
		title: 'Design work by Quang, a Vietnamese design engineer',
		description:
			'Brand identity, naming, packaging, and visual systems by Quang, a Vietnamese graphic designer and design engineer in Vietnam.'
	},
	blog: {
		title: 'Blog notes by Quang, a Vietnamese designer and engineer',
		description:
			'Notes from Quang on graphic design, branding, and building for the web, written by a design engineer in Nha Trang, Vietnam.'
	},
	engineer: {
		title: 'Engineering projects by Quang, Vietnamese design engineer',
		description:
			'Web tools by Quang, a Vietnamese design engineer. Text tools, minesweeper, and an animation glossary built with SvelteKit.'
	},
	minesweeper: {
		title: 'Minesweeper by Quang, a browser game with SvelteKit',
		description:
			"A classic minesweeper game built with SvelteKit and Tailwind, playable in the browser as part of Quang's engineering work."
	},
	telescopic: {
		title: 'Telescopic | AI text expander by design engineer Quang',
		description:
			'An AI tool by Quang that expands a short sentence into a longer, more detailed passage, one step at a time, in the browser.'
	},
	microscopic: {
		title: 'Microscopic | AI text compressor by design engineer Quang',
		description:
			'An AI tool by Quang that compresses a long passage into a few precise words, built as a small web experiment on quang.design.'
	},
	animation: {
		title: 'Animation vocabulary by Quang, a visual motion glossary',
		description:
			'A visual glossary of animation terms by Quang, with examples driven by anime.js for entrances, exits, and easing on the web.'
	}
} as const;

const titleSuffixes = [
	' | Quang, Vietnamese design engineer',
	' | Quang, design engineer',
	' | Quang design',
	' | Quang'
];

export function documentTitle(name: string) {
	const clean = name.trim();
	if (clean.length >= 50) return clean;
	for (const suffix of titleSuffixes) {
		const next = `${clean}${suffix}`;
		if (next.length >= 50 && next.length <= 60) return next;
	}
	return clean;
}

const DESCRIPTION_MIN = 120;
const DESCRIPTION_MAX = 125;

const descriptionTails = [
	' By Quang, a design engineer in Nha Trang.',
	' By Quang, a design engineer in Vietnam.',
	' By Quang, design engineer.',
	' By Quang Nguyen.',
	' By Quang.',
	' Quang.'
];

function cutPhrase(text: string) {
	const head = text.slice(0, DESCRIPTION_MAX);
	let end = -1;
	for (const mark of ['.', '!', '?']) {
		const at = head.lastIndexOf(mark);
		if (at > end) end = at;
	}
	if (end >= 40) return head.slice(0, end + 1).trim();
	const space = head.lastIndexOf(' ');
	return (space > 0 ? head.slice(0, space) : head).trim();
}

export function searchDescription(text: string) {
	const clean = text.replace(/\s+/g, ' ').trim();
	if (clean.length > DESCRIPTION_MAX) return cutPhrase(clean);
	if (clean.length >= DESCRIPTION_MIN) return clean;
	const tail = descriptionTails.find((item) => {
		const next = clean.length + item.length;
		return next >= DESCRIPTION_MIN && next <= DESCRIPTION_MAX;
	});
	return tail ? `${clean}${tail}` : clean;
}
