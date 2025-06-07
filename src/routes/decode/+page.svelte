<script lang='ts'>
	import { page } from '$app/state'
	import { pageTitle } from '$stores/title'
	import { Editor, Button, Slide, CheckBox } from '$lib'
	import { bfinterpreter } from '$scripts/complete'
	import { brainfuckHighlight } from '$utils/brainfuckHighlight'

	let code = $state(page.url.searchParams.get('code') ?? 'H = 72\n++++++++\n[\n\t> +++++++++\n\t< -\n]\n> .\n\ne = 101\n+++++++++++++++++++++++++++++ .\n\nll = 108\n+++++++ ..\n\no = 111\n+++ .\n\nvirgola = 44\n< ++++++++++\n[\n\t> -------\n\t< -\n]\n> +++ .\n\nspace = 0\n< ++++\n[\n\t> -----------\n\t< -\n]\n> .\n\nW = 87\n< ++++++++\n[\n\t> +++++++++++\n\t< -\n]\n> - .\n\no = 111\n< +++\n[\n\t> ++++++++\n\t< -\n]\n> .\n\nr = 114\n+++ .\n\nl = 108\n------ .\n\nd = 100\n-------- .\n\nexclamation = 33\n< +++\n[\n\t> ----------------------\n\t< -\n]\n> - .\n')

	let interpreter: any = $state()
	let mode: 'straight'|'step' = $state('straight')
	let speed = $state(0)
	let pause = $state(true)
	let interval = $state(0)

	let memory: number[] = $state([0, 0, 0])
	let pointer = $state(0)
	let ip = $state(0)
	let result = $state('')

	const execute = () => {
		interpreter = bfinterpreter(code, {
			pause: true,
			prompt: () => prompt('Enter a character:') ?? ' '
		})

		continue_()
	}

	const execute_step = () => {
		interpreter = bfinterpreter(code, {
			pause: true,
			prompt: () => prompt('Enter a character:') ?? ' '
		})

		step()
	}

	const step = () => {
		mode = 'step'

		const stage = interpreter.next()

		const { mem, ptr, res, ip: ip_ } = stage.value
		memory = mem
		pointer = ptr
		result = res
		ip = ip_

		if (stage.done)
			interpreter = null
	}

	const continue_ = () =>
		interval = setInterval(() => {
			step()
			mode = 'straight'
			if (!interpreter) clearInterval(interval)
		}, speed * 5)

	const reset = () => {
		interpreter = null
		memory = [0, 0, 0]
		pointer = 0
		result = ''
		ip = 0
		clearInterval(interval)
	}

	const pause_ = () => {
		mode = 'step'
		clearInterval(interval)
	}

	const ascii_descriptions: Record<number, string> = {
		0: 'NULL', 1: 'SOH', 2: 'STX', 3: 'ETX', 4: 'EOT', 5: 'ENQ', 6: 'ACK', 7: 'DEL', 8: 'BS', 9: 'TAB',
		10: 'LF', 11: 'VT', 12: 'FF', 13: 'CR', 14: 'SO', 15: 'SI', 16: 'DLE', 17: 'DC1', 18: 'DC2', 19: 'DC3',
		20: 'DC4', 21: 'NAK', 22: 'SYN', 23: 'ETB', 24: 'CAN', 25: 'EM', 26: 'SUB', 27: 'ESC', 28: 'FS', 29: 'GS',
		30: 'RS', 31: 'US', 32: 'space'
	}

	pageTitle.set('Decode')
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
					highlightFn={code => ip ? brainfuckHighlight(code, interpreter ? ip : -1) : brainfuckHighlight(code, interpreter ? ip : -1)}
					oninput={v => code = v}
				/>
			</div>
		</div>
	</div>
</section>

<section class='pt-15'>
	<div class='mx-auto w-[min(1020px,94%)] bg-[var(--cl)] rounded-lg p-4 flex flex-col gap-4 items-center'>
		<div class='w-full'>
			<span class='text-neutral-500'>Result:</span>
			{result}
		</div>

		{#if result}
			<Button href={`/encode?text=${encodeURIComponent(result)}`} small>Encode</Button>
		{/if}
	</div>
</section>

<section class='flex flex-col items-center justify-center gap-4 px-4 pb-16 pt-8 md:pt-16'>
	<h1 class='font-alphacentauri text-xl'>ASCII Table</h1>

	<ol class='columns-3 md:columns-6 lg:columns-8'>
		{#each { length: 127 }, i}
			<li>
				{i} -
				{#if i in ascii_descriptions}
					({ascii_descriptions[i]})
				{:else}
					<span class='bg-[var(--cl)] rounded px-2'>{String.fromCharCode(i)}</span>
				{/if}
			</li>
		{/each}
	</ol>
</section>

<style>
	.pointer { clip-path: polygon(50% 0px, 100% 100%, 0px 100%) }
</style>
