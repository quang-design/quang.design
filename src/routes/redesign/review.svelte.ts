import { browser } from '$app/environment';

export type Verdict = 'pending' | 'approved' | 'revise';
export type ReviewEntry = { verdict: Verdict; note: string };

const STORAGE_KEY = 'redesign-review-v6';

export type ReviewMeta = { id: string; title: string; group: string };

const seeded: Record<string, ReviewEntry> = {
	T1: { verdict: 'approved', note: '' },
	T2: { verdict: 'approved', note: '' },
	T3: { verdict: 'approved', note: '' },
	T4: { verdict: 'approved', note: '' },
	T5: { verdict: 'approved', note: '' },
	S1: { verdict: 'approved', note: '' },
	S2: {
		verdict: 'revise',
		note: 'the pattern should fit the background grid perfectly + responsively'
	},
	S3: { verdict: 'approved', note: '' },
	S4: { verdict: 'approved', note: '' },
	A1: { verdict: 'revise', note: "ghost shouldn't have the border" },
	A2: { verdict: 'approved', note: '' },
	A3: { verdict: 'revise', note: 'go inside is not kbd or shortcut, the rest look fine' },
	A4: {
		verdict: 'revise',
		note: 'spinner need to spin, not sure what is the pattern square is for?'
	},
	A5: {
		verdict: 'approved',
		note: "DESKTOP USES THE INDEX TREE INSTEAD -> this shouldn't be in the final page"
	},
	A6: { verdict: 'revise', note: "looking good, can't switch tab in this version" },
	A7: { verdict: 'approved', note: "if we don't use then let's remove the component" },
	A8: { verdict: 'revise', note: "keep the original one, it's better" },
	M1: {
		verdict: 'revise',
		note: 'the button height does not align with input height, the border color or size is also not matching when going together -> pls find root cause to fix, icon for subscribe button also not fit with its function'
	},
	M2: { verdict: 'approved', note: 'Option A' },
	M3: { verdict: 'approved', note: '' },
	M4: { verdict: 'approved', note: '' },
	M5: { verdict: 'approved', note: '' },
	O1: {
		verdict: 'revise',
		note: 'Change "REPOSITORY \\ quang.design" -> "WELCOME TO \\ quang.design" + fix the mode switcher'
	},
	O2: {
		verdict: 'approved',
		note: 'QUANG -> HOME. DESIGN should list all projects. Blog also list all articles.'
	},
	O3: { verdict: 'revise', note: 'keep current content and make it fit with new design' },
	O4: {
		verdict: 'revise',
		note: "keep the quote, remove those hint bar since we doesn't support keyboard shortcuts yet. use the Field — subscribe above (after revision)."
	},
	L1: {
		verdict: 'revise',
		note: 'make sure the grid is aligned well and follow the rhythm of the background/base grid. quantize everything to it and its steps. right sidebar = detail if any like hover an article -> show quick preview.'
	},
	P1: {
		verdict: 'revise',
		note: 'keep the original content and it should be the main focus in this page, not empty graphic, hover any link show some preview about it or empty'
	},
	P2: {
		verdict: 'revise',
		note: 'pretty good, remove hint bar. need to align base font size. Brand Name should go big and caps lock for example HER KIND. Description should be "The Making of a Name". Follow that format for all thumbnail. When hover show metadata/frontmatter on the right. Maybe the index don\'t need to show inside items like the engineer but. all be like design or blog. Click on that will show child items like this page.'
	},
	P3: {
		verdict: 'revise',
		note: 'keep original content, metadata/frontmatter on the right but the original layout should be the same.'
	},
	P4: {
		verdict: 'revise',
		note: 'show metadata/frontmatter on right sidebar when hovering each project, add an icon for each project'
	},
	P5: {
		verdict: 'revise',
		note: "keep the original behaviors don't change it, full content on the right, main app in the center"
	},
	P6: { verdict: 'revise', note: 'same comment above, keep the app behaviour only change style' },
	P7: {
		verdict: 'revise',
		note: 'none of motions work.. pls keep it 100% like now, only change style'
	},
	P8: { verdict: 'revise', note: 'make it a fully playable game now' },
	P9: {
		verdict: 'revise',
		note: 'no description for thumbnail, hover each will show preview metadata for the article'
	},
	P10: {
		verdict: 'revise',
		note: 'content should stay in the center, same layout only style change, name + description + metadata should move to right sidebar for sure'
	},
	P11: {
		verdict: 'revise',
		note: 'please keep everything we have right now and change style, this is not done yet'
	},
	P12: { verdict: 'revise', note: "don't change this route" }
};

class Review {
	entries = $state<Record<string, ReviewEntry>>({ ...seeded });
	items = $state<ReviewMeta[]>([]);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					this.entries = { ...seeded, ...JSON.parse(raw) };
				} catch {
					this.entries = { ...seeded };
				}
			}
		}
	}

	register(meta: ReviewMeta) {
		if (!this.items.some((item) => item.id === meta.id)) this.items.push(meta);
	}

	entry(id: string): ReviewEntry {
		return this.entries[id] ?? { verdict: 'pending', note: '' };
	}

	set(id: string, patch: Partial<ReviewEntry>) {
		this.entries[id] = { ...this.entry(id), ...patch };
		this.save();
	}

	reset() {
		this.entries = { ...seeded };
		this.save();
	}

	private save() {
		if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entries));
	}

	count(verdict: Verdict) {
		return this.items.filter((item) => this.entry(item.id).verdict === verdict).length;
	}

	get summary() {
		const lines = ['# Redesign review', ''];
		for (const item of this.items) {
			const { verdict, note } = this.entry(item.id);
			const glyph = verdict === 'approved' ? 'x' : ' ';
			lines.push(`- [${glyph}] ${item.id} — ${item.title} (${verdict})`);
			if (note.trim()) lines.push(`      note: ${note.trim()}`);
		}
		return lines.join('\n');
	}
}

export const review = new Review();
