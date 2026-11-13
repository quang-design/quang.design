import { createChange, createController, definePrimitive } from '@ui-sdk/core';

type WordBoardApi = {
	expand: (index: number) => void;
	setEditing: (editing: boolean) => void;
	copy: () => void;
};

type WordBoardOptions = {
	text?: string;
	busy?: boolean;
	editing?: boolean;
	defaultEditing?: boolean;
	onEditingChange?: (editing: boolean) => void;
	onExpand?: (index: number) => void;
	controller?: WordBoardApi;
};

function createWordBoardController() {
	return createController<WordBoardApi>();
}

const wordBoard = definePrimitive({
	name: 'word-board',
	options: {
		text: 'string',
		busy: 'boolean',
		editing: 'boolean',
		defaultEditing: 'boolean',
		onEditingChange: 'callback',
		onExpand: 'callback',
		controller: 'value'
	},
	controlled: ['editing'],
	state: (options: WordBoardOptions) => ({
		editing: options.editing ?? options.defaultEditing ?? false,
		copying: false,
		text: options.text ?? '',
		busy: !!options.busy
	}),
	sync: (options) => ({
		...(options.editing === undefined ? {} : { editing: options.editing }),
		...(options.text === undefined ? {} : { text: options.text }),
		...(options.busy === undefined ? {} : { busy: options.busy })
	}),
	api: (context) => {
		const change = createChange(context);
		let copyTimer: ReturnType<typeof setTimeout> | undefined;

		context.onDestroy(() => clearTimeout(copyTimer));

		return {
			expand(index: number) {
				const { busy, editing, onExpand } = context.options();
				if (busy || editing) return;
				onExpand?.(index);
			},
			setEditing(editing: boolean) {
				change('editing', editing, { reason: 'imperative' });
			},
			async copy() {
				const { text } = context.store.get();
				await navigator.clipboard.writeText(text);
				context.store.set({ copying: true });
				clearTimeout(copyTimer);
				copyTimer = setTimeout(() => {
					context.store.set({ copying: false });
				}, 1000);
			}
		};
	},
	slots: (slot) => ({
		root: slot({
			attrs: () => ({
				'aria-label': 'Telescopic text'
			}),
			state: (state) => ({
				editing: state.editing,
				copying: state.copying,
				busy: state.busy,
				words: state.text.split(' '),
				text: state.text
			})
		}),
		word: slot<{ index: number }, { word: string; index: number }>({
			role: 'button',
			focus: 'native',
			props: { index: 'number' },
			state: (state, { props }) => ({
				index: props.index,
				word: state.text.split(' ')[props.index] ?? ''
			}),
			attrs: (state, { props }) => {
				const word = state.text.split(' ')[props.index] ?? '';
				return {
					type: 'button',
					'aria-label': `Expand word "${word}" at ${props.index}`,
					'aria-disabled': state.busy || state.editing ? 'true' : undefined,
					'data-disabled': state.busy || state.editing ? '' : undefined
				};
			},
			press: ({ api, props }) => api.expand(props.index)
		})
	}),
	agent: { actions: ['expand', 'setEditing', 'copy'] }
});

export { createWordBoardController, wordBoard, type WordBoardApi, type WordBoardOptions };
