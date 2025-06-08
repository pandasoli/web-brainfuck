<script lang='ts'>
	import type { HTMLAttributes } from 'svelte/elements'

	interface Props extends HTMLAttributes<HTMLInputElement> {
		value: number
	}

	let { value = $bindable(), ...props }: Props = $props()
</script>

<div class='relative w-fit'>
	<input type='number' bind:value class='outline-none min-w-[100px] w-0 py-1 px-2 bg-[var(--cl)] rounded-md focus:input-shadow' {...props} />
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
