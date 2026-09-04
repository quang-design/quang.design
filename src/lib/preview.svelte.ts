export type Preview = {
	eyebrow?: string;
	title: string;
	subtitle?: string;
	description?: string;
	date?: string;
	thumbnail?: string;
	meta?: string[];
	links?: { label: string; href: string }[];
	href?: string;
} | null;

export class PreviewState {
	hover = $state<Preview>(null);
	page = $state<Preview>(null);

	get current(): Preview {
		return this.hover ?? this.page;
	}

	setHover(value: Preview) {
		this.hover = value;
	}

	clearHover() {
		this.hover = null;
	}

	setPage(value: Preview) {
		this.page = value;
	}
}

export const PREVIEW_KEY = 'preview';
