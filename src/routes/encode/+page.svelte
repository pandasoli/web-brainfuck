<script lang='ts'>
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'
	import { page } from '$app/state'
	import { pageTitle } from '$stores/title'
	import { Editor, Slide, CheckBox, Button, InputNumber } from '$lib'
	import { bfencoderv2 } from '$scripts/encoderv2'
	import { brainfuckHighlight } from '$utils/brainfuckHighlight'

	let text = $state('')

	let interpreter: ReturnType<typeof bfencoderv2>|null = $state(null)
	let mode: 'straight'|'step' = $state('straight')
	let speed = $state(0)
	let pause = $state(false)
	let memoryModel = $state([0, 0, 0])
	let max_mem = $state(0)
	let interval = $state(0)

	let memory: number[] = $state([0, 0, 0])
	let pointer = $state(0)
	let ip = $state(0)
	let result = $state('')
	let error = $state('')

	const execute = () => {
		memory = [...memoryModel]
		if (max_mem > 0) memory = memory.slice(0, max_mem)

		interpreter = bfencoderv2(text, { pause, mem: memory, max_mem })
		continue_()
	}

	const execute_step = () => {
		memory = [...memoryModel]
		if (max_mem > 0) memory = memory.slice(0, max_mem)

		interpreter = bfencoderv2(text, { pause: true, mem: memory, max_mem })
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

		const url_text = page.url.searchParams.get('text')
		if (url_text)
			return text = url_text

		const storage = localStorage.getItem('brainfuck')
		if (!storage)
			return text = 'Hello, World!'

		const data = JSON.parse(storage)
		if (!data) return

		memory = data?.encode_memory ?? memory
		text = data?.text ?? text
	})

	$effect(() => {
		const storage = localStorage.getItem('brainfuck')
		const data = storage ? JSON.parse(storage) : {}

		data.encode_memory = memory
		data.text = text

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
					<InputNumber bind:value={max_mem} />
				</label>
			</div>
		</div>

		<div class='grid place-items-center'>
			<div>
				<ul class='flex w-fit'>
					{#each memory, i}
						<li>
							<input
								bind:value={memory[i]}
								oninput={e => memoryModel[i] = Number(e.currentTarget.value)}
								type='number'
								max='127' min='0'
								class='memory-cell outline-none shadow-[0_0_.25rem_white] text-center min-w-12 py-2 w-0 focus:input-shadow'
							/>
						</li>
					{/each}
				</ul>

				<div class='relative pointer bg-white h-3 w-12 transition' style='transform: translate(calc(var(--spacing) * 12 * {pointer}))'></div>
			</div>
		</div>

		<div class='mx-auto w-[min(1020px,94%)] flex-1 h-0'>
			<div class='h-[110%]'>
				<!-- Using ip will make it update when ip updates. -->
				<Editor
					code={text}
					highlightFn={code => ip ? highlightFn(code, interpreter ? ip : -1) : highlightFn(code, interpreter ? ip : -1)}
					oninput={v => text = v}
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
				<pre class='whitespace-pre-wrap break-words overflow-wrap-break'><code class='font-hack block'>{@html brainfuckHighlight(result, -1)}</code></pre>
			{/if}
		</div>

		{#if result}
			<Button href={`/decode?code=${encodeURIComponent(result)}`} small>Decode</Button>
		{/if}
	</div>
</section>

<style>
	.pointer { clip-path: polygon(50% 0px, 100% 100%, 0px 100%) }
	.memory-cell { appearance: textfield }
</style>
