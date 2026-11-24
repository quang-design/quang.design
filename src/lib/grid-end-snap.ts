const SELECTOR = '.ink-h1, .ink-h2, .ink-display';

function gridPx(): number {
	const raw = getComputedStyle(document.documentElement).getPropertyValue('--grid').trim();
	if (raw.endsWith('px')) {
		const n = parseFloat(raw);
		if (n > 0) return n;
	}
	return 24;
}

function snapEnd(el: HTMLElement) {
	const grid = gridPx();
	const currentPad = parseFloat(getComputedStyle(el).paddingBottom) || 0;
	const height = el.getBoundingClientRect().height;
	const contentH = Math.max(0, height - currentPad);
	const rem = ((contentH % grid) + grid) % grid;
	const pad = rem > 0.5 && rem < grid - 0.5 ? grid - rem : 0;
	if (Math.abs(pad - currentPad) < 0.5) return;
	if (pad > 0) el.style.paddingBottom = `${pad}px`;
	else el.style.removeProperty('padding-bottom');
}

export function mountGridEndSnap(): () => void {
	const seen = new WeakSet<Element>();
	const observer = new ResizeObserver((entries) => {
		for (const entry of entries) {
			if (entry.target instanceof HTMLElement) snapEnd(entry.target);
		}
	});

	const watch = (root: ParentNode = document) => {
		for (const el of root.querySelectorAll?.(SELECTOR) ?? []) {
			if (!(el instanceof HTMLElement) || seen.has(el)) continue;
			seen.add(el);
			observer.observe(el);
			snapEnd(el);
		}
	};

	watch();
	const mo = new MutationObserver((records) => {
		for (const record of records) {
			for (const node of record.addedNodes) {
				if (!(node instanceof Element)) continue;
				if (node.matches(SELECTOR) && node instanceof HTMLElement && !seen.has(node)) {
					seen.add(node);
					observer.observe(node);
					snapEnd(node);
				} else watch(node);
			}
		}
	});
	mo.observe(document.documentElement, { childList: true, subtree: true });

	return () => {
		observer.disconnect();
		mo.disconnect();
		for (const el of document.querySelectorAll(SELECTOR)) {
			if (el instanceof HTMLElement) el.style.removeProperty('padding-bottom');
		}
	};
}
