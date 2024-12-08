export interface SelectionState {
	text: string;
	rect: DOMRect | null;
	indices: Set<number>;
}

export interface ZipUpButtonPosition {
	left: number;
	top: number;
}
