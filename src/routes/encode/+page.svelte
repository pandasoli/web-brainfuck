<script lang='ts'>
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'
	import { page } from '$app/state'
	import { pageTitle } from '$stores/title'
	import { Editor, Slide, CheckBox, Button, InputNumber } from '$lib'
	import { bfencoderv2 } from '$scripts/encoderv2'
	import { brainfuckHighlight } from '$utils/brainfuckHighlight'

	let code = $state(page.url.searchParams.get('text') ?? 'Hello, World!')

	let interpreter: ReturnType<typeof bfencoderv2>|null = $state(null)
	let mode: 'straight'|'step' = $state('straight')
	let speed = $state(0)
	let pause = $state(false)
	let max_mem = $state(0)
	let interval = $state(0)

	let memory: number[] = $state([0, 0, 0])
	let pointer = $state(0)
	let ip = $state(0)
	let result = $state('')
	let error = $state('')

	const execute = () => {
		interpreter = bfencoderv2(code, { pause, max_mem })
		continue_()
	}

	const execute_step = () => {
		interpreter = bfencoderv2(code, { pause: true })
		step()
	}

	const step = () => {
		if (!interpreter) throw new Error('Code should not be reached')

		mode = 'step'

		const stage = interpreter.next()
		const res = stage.value

		if (res.err) {
			reset()
			error = res.err
		}
		else {
			memory = res.mem!
			pointer = res.ptr!
			result = res.res!
			ip = res.ip!
			error = ''

			if (stage.done)
				interpreter = null
		}
	}

	const reset = () => {
		interpreter = null
		memory = [0, 0, 0]
		ip = pointer = 0
		error = result = ''
		clearInterval(interval)
	}

	const pause_ = () => {
		mode = 'step'
		clearInterval(interval)
	}

	const continue_ = () =>
		interval = setInterval(() => {
			step()
			mode = 'straight'
			if (!interpreter) clearInterval(interval)
		}, speed * 5)

	function highlightFn(text: string, ip: number): string[] {
		let char_i = 0

		return text.split('\n').map(line => {
			line = line.split('').map(ch => {
				const scale = ip === char_i ? 'inline-block scale-200 -translate-y-1' : ''
				char_i += 1

				return `<span class='${scale} hover:text-black'>${ch}</span>`
			}).join('')

			char_i += 1 // newline
			return line
		})
	}

	onMount(() => {
		if (!browser) return

		const storage = localStorage.getItem('brainfuck')
		if (!storage) return

		const data = JSON.parse(storage)
		if (!data) return

		code = data?.text ?? code
	})

	$effect(() => {
		const storage = localStorage.getItem('brainfuck')
		const data = storage ? JSON.parse(storage) : {}

		data.text = code

		localStorage.setItem('brainfuck', JSON.stringify(data))
	})

	pageTitle.set('Encode')
</script>

<section class='relative h-[70vh] bg-[url("/background.jpg")] bg-fixed bg-cover bg-center'>
	<div class='absolute bg-black opacity-60 inset-0 z-0'></div>

	<div class='relative flex flex-col gap-6 inset-0 h-full p-4 z-1'>
		<div class='flex flex-wrap gap-4 justify-between px-10'>
			<div class='flex flex-wrap gap-1 justify-center h-fit'>
				{#if !interpreter}
					<Button onclick={execute} small green invert>Execute</Button>
					<Button onclick={execute_step} small green invert>Step</Button>
					<Button onclick={reset} small>Reset</Button>
				{:else if mode === 'straight'}
					<Button onclick={pause_} small green invert>Pause</Button>
					<Button onclick={reset} small red>Stop</Button>
				{:else if mode === 'step'}
					<Button onclick={step} small green invert>Step</Button>
					<Button onclick={continue_} small green invert>Continue</Button>
					<Button onclick={reset} small red>Stop</Button>
				{/if}
			</div>

			<div class='flex flex-col gap-2 min-w-80'>
				<label class='flex items-center gap-2'>
					<CheckBox checked={pause} oninput={e => pause = e.currentTarget.checked} />
					Pause
				</label>

				{#if pause}
					<label class='flex items-center gap-2'>
						Velocity:
						<Slide onSlide={v => speed = v} />
					</label>
				{/if}

				<label class='flex items-center gap-2'>
					Memory limit:
					<InputNumber defaultValue={max_mem} oninput={e => max_mem = Number(e.currentTarget.value)} />
				</label>
			</div>
		</div>

		<div class='grid place-items-center'>
			<div>
				<ul class='flex w-fit'>
					{#each memory as item}
						<li class='shadow-[0_0_.25rem_white] text-center min-w-12 py-2'>{item}</li>
					{/each}
				</ul>

				<div class='relative pointer bg-white h-3 w-12 transition' style='transform: translate(calc(var(--spacing) * 12 * {pointer}))'></div>
			</div>
		</div>

		<div class='mx-auto w-[min(1020px,94%)] flex-1 h-0'>
			<div class='h-[110%]'>
				<!-- Using ip will make it update when ip updates. -->
				<Editor
					{code}
					highlightFn={code => ip ? highlightFn(code, interpreter ? ip : -1) : highlightFn(code, interpreter ? ip : -1)}
					oninput={v => code = v}
				/>
			</div>
		</div>
	</div>
</section>

<section class='pt-15'>
	<div class='mx-auto w-[min(1020px,94%)] bg-[var(--cl)] rounded-lg p-4 flex flex-col gap-4 items-center'>
		<div class='w-full'>
			{#if error}
				<span class='text-red-400'>{error}</span>
			{:else}
				<span class='text-neutral-500'>Result:</span>
				{@html brainfuckHighlight(result, -1)}
			{/if}
		</div>

		{#if result}
			<Button href={`/decode?code=${encodeURIComponent(result)}`} small>Decode</Button>
		{/if}
	</div>
</section>

<style>
	.pointer { clip-path: polygon(50% 0px, 100% 100%, 0px 100%) }
</style>
