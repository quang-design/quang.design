const KEY = 'qd-grid-overlay';

function read(): boolean {
	if (typeof localStorage === 'undefined') return false;
	try {
		return localStorage.getItem(KEY) === '1';
	} catch {
		return false;
	}
}

function write(value: boolean) {
	try {
		localStorage.setItem(KEY, value ? '1' : '0');
	} catch {
		return;
	}
}

class GridOverlayState {
	enabled = $state(false);

	hydrate() {
		this.enabled = read();
	}

	set(next: boolean) {
		this.enabled = next;
		write(next);
	}

	toggle() {
		this.set(!this.enabled);
	}
}

export const gridOverlay = new GridOverlayState();
