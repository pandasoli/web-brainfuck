<script lang='ts'>
	import type { HTMLAttributes } from 'svelte/elements'

	interface Props extends HTMLAttributes<HTMLInputElement> {
		checked?: boolean
	}

	let { checked, ...props }: Props = $props()
</script>

<input
	type='checkbox'
	class='appearance-none w-6 h-6 rounded-md border border-lime-200 bg-[var(--cl)] checked:bg-lime-200 focus:input-shadow'
	{checked}
	{...props}
/>

<style>
	input:checked {
		background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='none' stroke='%2305090e' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m6 10 3 3 6-6'/%3E%3C/svg%3E")
	}
</style>
