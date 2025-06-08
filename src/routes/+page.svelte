<script lang='ts'>
	import { pageTitle } from '$stores/title'
	import { Header, Button } from '$lib'
	import { brainfuckHighlight } from '$utils/brainfuckHighlight'

	pageTitle.set('')
</script>

<div class='text-slate-500'></div>
<div class='text-rose-400'></div>
<div class='text-sky-300'></div>
<div class='text-blue-400'></div>
<div class='text-lime-300'></div>
<div class='text-purple-300'></div>
<div class='text-line-500'></div>

<section class='relative h-[90vh] bg-[url("/background.jpg")] bg-fixed bg-cover bg-center'>
	<div class='absolute bg-black opacity-60 inset-0 z-0'></div>

	<div class='relative grid place-items-center inset-0 h-full z-1'>
		<div class='flex flex-col items-center'>
			<h1 class='font-alphacentauri text-[min(120px,15vw)] flex'>
				br
				<span class='text-rose-400'>+</span>
				infu
				<span class='text-blue-400'>[</span>
				k
			</h1>

			<p class='opacity-80'>
				The best site to learn and play with Brainfuck<br>
				The most complete site for Brainfuck study
			</p>
		</div>

		<div class='flex flex-col gap-1'>
			<Button href='/#history'>Get Started</Button>
			<Button href='/encode'>Encode</Button>
			<Button href='/decode'>Decode</Button>
			<Button href='/implementations'>Implementations</Button>
		</div>
	</div>
</section>

<Header />

<section class='flex flex-col lg:flex-row items-center justify-center gap-16 px-4 pb-16 pt-8 md:pt-16' id='history'>
	<img src='/favicon.ico' alt='Brain' />

	<p class='max-w-180'>
		Brainfuck is an <a href='https://en.wikipedia.org/wiki/Esoteric_programming_language'>esoteric programming language</a> designed to challenge and amuse
		programmers. Created by Urban Müller in 1993, its minimalistic design consists
		of just eight commands, making it <a href='https://en.wikipedia.org/wiki/Turing_completeness'>Turing-complete</a> despite its extreme
		simplicity.<br>
		<br>
		The language operates on an array of memory cells, using a pointer to
		manipulate data. Its intentionally obscure syntax—composed of symbols like &lt;,
		&gt;, +, -, [, ], ., and ,—makes writing even simple programs a puzzle.
		While impractical for real-world use, Brainfuck is a fascinating exploration
		of computational minimalism and a fun exercise in low-level thinking.
	</p>
</section>

<section class='flex flex-col items-center justify-center gap-16 px-4 pb-16 pt-8 md:pt-16'>
	<h1 class='font-alphacentauri text-xl' id='tutorial'>Tutorial</h1>

	<div>
		<ul class='flex w-fit'>
			{#each [0, 24, 0, 1] as item}
				<li class='shadow-[0_0_.25rem_white] text-center min-w-12 py-2'>{item}</li>
			{/each}
		</ul>

		<div class='relative pointer bg-white h-3 w-12 transition' style='transform: translate(calc(var(--spacing) * 12 * {1}))'></div>
	</div>

	<p class='max-w-180'>
		Brainfuck programs use a memory stack of 8-bit cells (0–255). A pointer
		moves between cells, modifying their values with increment and decrement
		operations.
	</p>

	<div class='grid grid-cols-[auto_1fr] gap-x-8'>
		<span class='text-rose-400'>+</span> <p>Increment pointed memory cell by 1</p>
		<span class='text-sky-300'>-</span> <p>Decrement pointed memory cell by 1</p>
		<span class='text-blue-400'>&lt;</span> <p>Move pointer left (previous cell)</p>
		<span class='text-blue-400'>&gt;</span> <p>Move pointer right (next cell)</p>
	</div>

	<div class='grid grid-cols-[auto_1fr] gap-x-8'>
		<span class='text-lime-300'>.</span> <p>Print pointed memory cell</p>
		<span class='text-lime-300'>,</span> <p>Ask for user input and insert in pointed memory cell</p>
	</div>

	<p class='max-w-180'>
		Memory cells store 8-bit values (0–255). To print them, the numeric value is
		converted to a character using the <a href='https://en.wikipedia.org/wiki/ASCII'>ASCII</a> table.<br>
		<br>
		The same is done for when a character is inputed into a memory cell.
	</p>

	<div class='grid grid-cols-[auto_1fr] gap-x-8'>
		<span class='text-blue-400'>[</span> <p>Start loop</p>
		<span class='text-blue-400'>]</span> <p>End loop</p>
	</div>

	<p class='max-w-180'>
		Loops simplify repetitive operations like incrementing or decrementing a memory cell.
		When a loop starts, if the current cell is zero, it skips to the end. If the cell is
		non-zero, the loop runs until the cell becomes zero again, at which point it exits
		without returning to the start.<br>
		<br>
		A common use for loops is multiplication. One cell acts as the multiplicand
		(decrementing each iteration), while another acts as the multiplier (incrementing
		repeatedly). This mimics how multiplication works—adding a number to itself multiple
		times.<br>
		<br>
		Loops can also zero out a cell quickly. For example, <span class='text-blue-400'>[</span><span class='text-sky-300'>-</span><span class='text-blue-400'>]</span>
		keeps decrementing until the cell hits zero, while <span class='text-blue-400'>[</span><span class='text-rose-400'>+</span><span class='text-blue-400'>]</span>
		increments until it reaches 255 and <b>overflows</b> to zero. This makes loops a
		powerful tool for both arithmetic and memory management.
	</p>


	<div class='grid grid-cols-[auto_1fr] gap-x-8'>
		<span class='text-purple-300'>!</span> <p>End program</p>
	</div>
</section>

<section class='flex flex-col items-center justify-center gap-4 px-4 pb-16 pt-8 md:pt-16'>
	<h1 class='font-alphacentauri text-xl mb-12'>Example</h1>

	<div class='bg-[var(--cl)] rounded-md p-4 w-[min(900px,96%)]'>
		<pre><code class='font-hack'>{#each brainfuckHighlight(`++++++\n[\n\t> ++++++++++\n\t<-\n]\n+++++ .`, -1) as line}<div>{@html line}</div>{/each}</code></pre>
	</div>

	<div class='bg-[var(--cl)] rounded-md p-4 w-[min(700px,74%)]'>
		<span class='text-neutral-500'>Result:</span> A
	</div>

	<div class='flex flex-col gap-1'>
		<Button href='/decode'>Go Decode Brainfuck</Button>
	</div>
</section>

<style>
	.pointer { clip-path: polygon(50% 0px, 100% 100%, 0px 100%) }

	pre {
		margin: 0;
		height: 100%;
		width: 100%;
		white-space: pre;
		tab-size: 2;

		position: relative;
		z-index: 0;
		pointer-events: none;
		overflow: hidden
	}

	code div { min-height: 1.5em }
</style>
