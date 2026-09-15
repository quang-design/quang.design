export interface SelectionState {
	text: string;
	rect: DOMRect | null;
	indices: Set<number>;
}
