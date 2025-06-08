<script lang='ts'>
	interface Props {
		tip: string
		down?: boolean
	}

	const { tip, down }: Props = $props()
</script>

<div class='relative group'>
	<div class='absolute pointer-events-none opacity-0 group-hover:opacity-100 transition bg-[var(--cl)] rounded-md px-2 py-1 text-base text-neutral-200 w-[240px] {down ? 'translate-y-[50%]' : '-translate-y-[110%]'} z-50 shadow'>
		<p>{tip}</p>
	</div>

	<span class='text-sm border-1 border-neutral-700 text-neutral-500 rounded-full px-2 w-5 h-5 flex justify-center items-center hover:text-lime-200 hover:border-lime-200 transition'>
		?
	</span>
</div>
