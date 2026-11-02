export type DesignLayout = 'split' | 'flat';

export type DesignCredit = {
	paragraph: string;
	label: string;
	href: string;
};

export type DesignFlags = {
	layout?: DesignLayout;
	credit?: DesignCredit;
};

export type CreditLink = {
	before: string;
	label: string;
	href: string;
	after: string;
};

function isLayout(value: unknown): value is DesignLayout {
	return value === 'split' || value === 'flat';
}

function parseCredit(value: unknown): DesignCredit | undefined {
	if (value == null) return undefined;
	if (typeof value !== 'object') throw new Error('Design credit must be an object');

	const credit = value as Record<string, unknown>;
	const { paragraph, label, href } = credit;
	if (typeof paragraph !== 'string' || typeof label !== 'string' || typeof href !== 'string') {
		throw new Error('Design credit needs paragraph, label, and href');
	}
	if (!paragraph.includes(label))
		throw new Error('Design credit label must appear in the paragraph');

	return { paragraph, label, href };
}

export function parseDesignFlags(data: Record<string, unknown>): DesignFlags {
	const layout = data.layout;
	if (layout !== undefined && !isLayout(layout)) {
		throw new Error(`Unknown design layout: ${String(layout)}`);
	}

	return { layout, credit: parseCredit(data.credit) };
}

export function creditLink(paragraph: string, credit: DesignCredit | undefined): CreditLink | null {
	if (!credit || paragraph !== credit.paragraph) return null;
	const at = paragraph.indexOf(credit.label);
	if (at < 0) return null;

	return {
		before: paragraph.slice(0, at),
		label: credit.label,
		href: credit.href,
		after: paragraph.slice(at + credit.label.length)
	};
}
