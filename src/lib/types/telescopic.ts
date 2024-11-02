export type TelescopicResponse = {
	content: Array<{ text: string }>;
};

export type TelescopicError = {
	message: string;
	word: string;
};
