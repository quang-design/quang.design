// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare namespace App {
	interface PageData {
		shareOrigin: string;
	}
}

declare module '@gouch/to-title-case' {
	export function toTitleCase(value: string): string;
}
