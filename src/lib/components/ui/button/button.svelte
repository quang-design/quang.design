<script lang="ts" module>
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { type VariantProps, tv } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: "aria-invalid:border-destructive inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 border-[length:var(--hair)] border-transparent bg-clip-padding text-base whitespace-nowrap uppercase outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		variants: {
			variant: {
				default: 'border-transparent bg-primary text-primary-foreground hover:opacity-90',
				outline:
					'border-border bg-background text-foreground hover:bg-foreground hover:text-background',
				secondary:
					'border-transparent bg-secondary text-secondary-foreground hover:bg-foreground hover:text-background',
				ghost: 'border-transparent bg-transparent hover:bg-foreground hover:text-background',
				destructive:
					'border-border bg-transparent text-foreground hover:bg-foreground hover:text-background',
				link: 'border-transparent text-foreground underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-[var(--grid)] px-3',
				xs: "h-[var(--grid)] px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
				sm: "h-[var(--grid)] px-2.5 [&_svg:not([class*='size-'])]:size-3.5",
				lg: 'h-[calc(var(--grid)*2)] px-3',
				icon: 'size-[var(--grid)]',
				'icon-xs': "size-[var(--grid)] [&_svg:not([class*='size-'])]:size-3",
				'icon-sm': 'size-[var(--grid)]',
				'icon-lg': 'size-[calc(var(--grid)*2)]'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	import { Button as UiButton, type ButtonActionDetails } from '@ui-sdk/svelte/button';

	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref: _ref = null,
		href = undefined,
		type = 'button',
		disabled,
		onclick,
		children,
		...restProps
	}: ButtonProps = $props();

	const classes = $derived(cn(buttonVariants({ variant, size }), className));
	const isDisabled = $derived(Boolean(disabled));
	const buttonType = $derived(type === 'submit' || type === 'reset' ? type : 'button');

	function handleClick(event: MouseEvent, _details: ButtonActionDetails) {
		onclick?.(event as Parameters<NonNullable<typeof onclick>>[0]);
	}
</script>

{#if href}
	<UiButton
		class={classes}
		disabled={isDisabled}
		onclick={onclick ? handleClick : undefined}
		{...restProps}
	>
		{#snippet render({ props })}
			<a
				{...props}
				href={isDisabled ? undefined : href}
				aria-disabled={isDisabled ? 'true' : undefined}
			>
				{@render children?.()}
			</a>
		{/snippet}
	</UiButton>
{:else}
	<UiButton
		class={classes}
		type={buttonType}
		disabled={isDisabled}
		onclick={onclick ? handleClick : undefined}
		{...restProps}
	>
		{@render children?.()}
	</UiButton>
{/if}
