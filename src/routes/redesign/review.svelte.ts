import { browser } from '$app/environment';

export type Verdict = 'pending' | 'approved' | 'revise';
export type ReviewEntry = { verdict: Verdict; note: string };

const STORAGE_KEY = 'atlas-review-v5';

export type ReviewMeta = { id: string; title: string; group: string };

class Review {
	entries = $state<Record<string, ReviewEntry>>({});
	items = $state<ReviewMeta[]>([]);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					this.entries = JSON.parse(raw);
				} catch {
					this.entries = {};
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
		this.entries = {};
		this.save();
	}

	private save() {
		if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entries));
	}

	count(verdict: Verdict) {
		return this.items.filter((item) => this.entry(item.id).verdict === verdict).length;
	}

	get summary() {
		const lines = ['# Atlas redesign review', ''];
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
