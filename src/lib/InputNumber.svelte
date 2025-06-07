<script lang='ts'>
	import type { HTMLAttributes } from 'svelte/elements'

	interface Props extends HTMLAttributes<HTMLInputElement> {
		defaultValue: number
	}

	const { ...props }: Props = $props()
</script>

<div class='relative w-fit'>
	<input type='number' class='outline-none min-w-[100px] w-0 py-1 px-2 bg-[var(--cl)] rounded-md focus:shadow-[0_0_0_.25rem_rgba(255,255,255,0.6)]' {...props} />
</div>

<style>
	div::after,
	div::before {
		position: absolute;
		right: 8px;
		width: 1.8em;
		height: 1em;
		font-size: 10px;
		pointer-events: none;
		background: var(--cl);

		display: flex;
		justify-content: center;
		align-items: center
	}

	div::after  { content: '▲'; top: 8px }
	div::before { content: '▼'; bottom: 8px }
</style>
