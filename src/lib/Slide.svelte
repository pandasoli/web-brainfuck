<script lang='ts'>
	interface Props {
		max?: number
		min?: number
		value?: number
		step?: string
		className?: string
		onSlide?: (_value: number) => any
	}

	let { max = 100, min = 0, value: initialValue = min, step = '1', className = '', onSlide }: Props = $props()

	let currentValue = $state(initialValue)
	let inputEl: HTMLInputElement
	let viewerEl: HTMLDivElement

	$effect(() => {
		if (initialValue !== undefined)
			currentValue = initialValue
	})

	function calcLeft() {
		const range = max - min
		const percentage = (currentValue - min) / range
		const viewerWidth = viewerEl?.clientWidth || 0
		return `calc(${percentage * 100}% - ${viewerWidth / 2}px)`
	}

	function handleInput() {
		currentValue = Number(inputEl.value)
		if (viewerEl) {
			viewerEl.style.opacity = '1'
			viewerEl.style.visibility = 'visible'
			viewerEl.style.left = calcLeft()
		}
	}

	function handleMouseUp() {
		if (viewerEl) {
			viewerEl.style.opacity = '0'
			viewerEl.style.visibility = 'hidden'
			viewerEl.style.left = calcLeft()
		}
		onSlide?.(currentValue)
	}
</script>

<section class='relative flex flex-col items-center justify-center w-[200px] p-1 m-1 mx-2.5 {className}'>
	<div
		bind:this={viewerEl}
		class='absolute h-[30px] min-w-[40px] -top-9 left-0 p-1 px-2.5 rounded-sm opacity-0 invisible transition-opacity duration-200 transition-visibility duration-200 bg-[var(--cl)]'
		style='left: {calcLeft()}'
	>
		<span class='block w-full text-center'>{currentValue}</span>
		<div class='absolute h-1.5 w-full max-w-[40px] top-full left-[calc(50%-min(100%,20px))] clip-path-triangle bg-[var(--cl)]'></div>
	</div>

	<input
		bind:this={inputEl}
		type='range'
		{min}
		{max}
		bind:value={currentValue}
		{step}
		oninput={handleInput}
		onmouseup={handleMouseUp}
		class='h-1 w-full min-w-0 m-0 p-0 rounded border-none bg-[var(--cl)]'
	/>
</section>

<style>
	input::-webkit-slider-thumb,
	input::-moz-range-thumb {
		height: 18px;
		width: 18px;
		border-radius: 50%;
		cursor: pointer;
		appearance: none;
		background-color: var(--cl)
	}

	input::-moz-range-track {
		background-color: var(--color-lime-200)
	}

	.clip-path-triangle { clip-path: polygon(50% 100%, 0 0, 100% 0) }
</style>
