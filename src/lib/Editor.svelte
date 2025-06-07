<script lang='ts'>
	import { CheckBox } from '$lib'
	import { getLineAndCol, getPosFromLineCol } from '$utils/text'
	import { clickOutside } from '$utils/clickOutside'

	interface Props {
		code: string
		highlightFn: (code: string) => string[]
		oninput?: (code: string) => void
	}

	let { code, highlightFn, oninput }: Props = $props()

	let textarea: HTMLTextAreaElement
	let linesContainer: HTMLDivElement
	let highlightContainer: HTMLPreElement

	let highlightedLines: string[] = $state([]) 
	let lineLengths: number[] = $state([])
	let contextOpen = $state(false)

	let vim = $state(false)
	let vimMode: 'n'|'i'|'v' = $state('n')
	let vimCursorPos = $state(0)
	let vimTmpCol = $state(0)
	let vimSelectionStart = $state(0)

	$effect(() => {
		highlightedLines = highlightFn(code)
		lineLengths = code.split('\n').map(line => line.length)
		oninput?.(code)
	})

	const keydown = (e: KeyboardEvent & { currentTarget: EventTarget & HTMLTextAreaElement }) => {
		if (!vim) return

		if (e.key === 'Escape') {
			vimMode = 'n'
			e.preventDefault()
			return
		}

		if (e.key === 'v' && vimMode === 'n') {
			vimMode = 'v'
			vimSelectionStart = e.currentTarget.selectionStart
			e.preventDefault()
			return
		}

		if (vimMode === 'i') return

		e.preventDefault()
		const [ line, col ] = getLineAndCol(code, vimCursorPos)

		switch (e.key) {
			case 'i': vimMode = 'i'; break
			case 'v': vimMode = 'v'; break

			case 'h':
				vimTmpCol = getLineAndCol(code, vimCursorPos)[1] - 1
				moveCursor(e.currentTarget, Math.max(0, vimCursorPos - 1))
				break

			case 'l':
				vimTmpCol = getLineAndCol(code, vimCursorPos)[1] + 1
				moveCursor(e.currentTarget, Math.min(code.length, vimCursorPos + 1))
				break

      case 'j':
        if (line < lineLengths.length - 1) {
					const newCol = lineLengths[line + 1] >= vimTmpCol ? vimTmpCol : Math.min(col, lineLengths[line + 1])
					moveCursor(e.currentTarget, getPosFromLineCol(code, line + 1, newCol))
        }
        break

      case 'k':
				if (line > 0) {
					const newCol = lineLengths[line - 1] >= vimTmpCol ? vimTmpCol : Math.min(col, lineLengths[line - 1])
					moveCursor(e.currentTarget, getPosFromLineCol(code, line - 1, newCol))
        }
        break
		}

		if (vimMode === 'v')
			updateVisualSelection(e.currentTarget)
	}

	function moveCursor(textarea: HTMLTextAreaElement, newPos: number) {
		vimCursorPos = newPos
		textarea.setSelectionRange(
			vimMode === 'v' ? vimSelectionStart : vimCursorPos,
			vimCursorPos
		)
	}

	function updateVisualSelection(textarea: HTMLTextAreaElement) {
		const start = Math.min(vimSelectionStart, vimCursorPos)
		const end = Math.max(vimSelectionStart, vimCursorPos)
		textarea.setSelectionRange(start, end)
	}

  let isSyncingScroll = $state(false)

	function syncScroll(e: UIEvent & { currentTarget: EventTarget & HTMLElement }, source: 'editor' | 'highlight' | 'lines') {
		if (isSyncingScroll) return
		isSyncingScroll = true

		const [scrollLeft, scrollTop] = [e.currentTarget.scrollLeft, e.currentTarget.scrollTop]

		if (source !== 'editor') {
			textarea.scrollTop = scrollTop
			textarea.scrollLeft = scrollLeft
		}
		if (source !== 'highlight') {
			highlightContainer.scrollTop = scrollTop
			highlightContainer.scrollLeft = scrollLeft
		}
		if (source !== 'lines') {
			linesContainer.scrollTop = scrollTop
			linesContainer.scrollLeft = scrollLeft
		}

		isSyncingScroll = false
	}
</script>

<div class='relative h-full rounded-xl'>
	<button onclick={() => contextOpen = !contextOpen} aria-label='Context menu' class='absolute flex flex-col justify-center items-center gap-[3px] right-4 top-4 w-6 h-6 z-50 cursor-pointer'>
		<div class='w-1 h-1 bg-gray-500 rounded-full'></div>
		<div class='w-1 h-1 bg-gray-500 rounded-full'></div>
		<div class='w-1 h-1 bg-gray-500 rounded-full'></div>
	</button>

	<div use:clickOutside={() => contextOpen = false} class='absolute right-10 top-2 rounded bg-slate-800 py-1 min-w-[150px] z-50 {contextOpen ? '' : 'opacity-0 pointer-events-none'}'>
		<label class='flex items-center gap-1 py-3 px-2'>
			<CheckBox oninput={() => vim = !vim} checked={vim} />
			Vim Mode
		</label>
	</div>

	<div class='flex gap-3 w-full h-full text-base'>
		<div
			bind:this={linesContainer}
			class='lines h-full overflow-auto px-3 py-4 rounded-md bg-[#0b121c]'
			onscroll={e => syncScroll(e, 'lines')}
		>
			{#each { length: lineLengths.length }, i}
				<div class='text-slate-600 opacity-60 text-center'>{i + 1}</div>
			{/each}
		</div>

		<div class='font-firacode relative h-full flex-1 rounded-md bg-[var(--cl)] overflow-hidden'>
			<textarea
				class='p-4'
				bind:this={textarea}
				bind:value={code}
				onkeydown={keydown}
				onscroll={e => syncScroll(e, 'editor')}
				spellcheck='false'
			></textarea>

			<pre
				class='p-4'
				bind:this={highlightContainer}
				onscroll={e => syncScroll(e, 'highlight')}
			><code class='font-firacode'>{#each highlightedLines as line}<div>{@html line}</div>{/each}</code></pre>
		</div>
	</div>
</div>

<style>
	.lines { scrollbar-color: transparent transparent }

	textarea, pre {
		margin: 0;
		height: 100%;
		width: 100%;
		white-space: pre;
		tab-size: 2
	}

	textarea {
		position: absolute;
		inset: 0;
		z-index: 1;
		color: transparent;
		background: transparent;
		resize: none;
		border: none;
		outline: none
	}

	pre {
		position: relative;
		z-index: 0;
		pointer-events: none;
		overflow: hidden
	}

	code div { min-height: 1.5em }
</style>
