export interface SelectionState {
	text: string;
	rect: DOMRect | null;
	start: number;
	end: number;
}
