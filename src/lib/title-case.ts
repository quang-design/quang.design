import { toTitleCase } from '@gouch/to-title-case';

const subtitleBreak = /(\s[-\u2013\u2014]\s)/;

type MdNode = {
	type: string;
	value?: string;
	children?: MdNode[];
};

export function titleCase(value: string): string {
	return value
		.split(subtitleBreak)
		.map((part) => (/^\s[-\u2013\u2014]\s$/.test(part) ? part : toTitleCase(part)))
		.join('');
}

function walk(node: MdNode) {
	const children = node.children;
	if (node.type === 'heading' && children?.every((child) => child.type === 'text')) {
		const value = children.map((child) => child.value ?? '').join('');
		node.children = [{ type: 'text', value: titleCase(value) }];
		return;
	}
	if (!children) return;
	for (const child of children) walk(child);
}

export function titleCaseHeadings() {
	return (tree: MdNode) => {
		walk(tree);
	};
}
