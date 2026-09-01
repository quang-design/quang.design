<script lang="ts" module>
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { type VariantProps, tv } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: "aria-invalid:border-destructive inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 border-[length:var(--hair)] border-transparent bg-clip-padding text-sm whitespace-nowrap uppercase outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
				default: 'h-8 px-2.5',
				xs: "h-6 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
				sm: "h-7 px-2.5 text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",
				lg: 'h-9 px-2.5',
				icon: 'size-8',
				'icon-xs': "size-6 [&_svg:not([class*='size-'])]:size-3",
				'icon-sm': 'size-7',
				'icon-lg': 'size-9'
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
	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? 'link' : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
