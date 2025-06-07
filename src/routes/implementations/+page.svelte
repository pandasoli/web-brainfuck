<script lang='ts'>
	import { pageTitle } from '$stores/title'
	import { CodeBergIcon, GitHubIcon } from '$assets'

	interface Project {
		title: string
		description: string
		platform: 'github.com' | 'codeberg.org'
		repo: string
		author: string
		path: string
		langs: ('js' | 'c')[]
	}

	const interpreters: Project[] = [
		{title: 'Small Interpreter', description: '', platform: 'codeberg.org', repo: 'brainfuck', author: 'elisoli', path: 'src/branch/master/interpreters/smallest.js', langs: ['js']},
		{title: 'Complete Interpreter', description: 'Focused on web usage with many features for user interaction.', platform: 'codeberg.org', repo: 'brainfuck', author: 'elisoli', path: 'src/branch/master/interpreters/complete.js', langs: ['js']}
	]

	const compilers: Project[] = [
		{title: 'JIT Compiler', description: '', platform: 'codeberg.org', repo: 'brainfuck', author: 'elisoli', path: 'src/branch/master/compilers/jit', langs: ['js', 'c']}
	]

	const transpilers: Project[] = [
		{title: 'GNU Assembly Transpiler', description: '', platform: 'codeberg.org', repo: 'brainfuck', author: 'elisoli', path: 'src/branch/master/transpilers/gas', langs: ['js']}
	]

	const encoders: Project[] = [
		{title: 'Smart Encoder', description: 'Uses many techniques to get the smallest output possible.', platform: 'codeberg.org', repo: 'brainfuck', author: 'elisoli', path: 'src/branch/master/encoders/encoderv2.js', langs: ['js']}
	]

	pageTitle.set('Implementations')
</script>

{#snippet card({title, description, platform, repo, author, path, langs}: Project)}
	<div class='flex flex-col gap-2 border border-neutral-700 rounded-md px-4 py-2'>
		<div class='flex gap-6'>
			<div class='flex items-center gap-2'>
				{#if platform === 'codeberg.org'}
					<CodeBergIcon />
				{:else if platform === 'github.com'}
					<GitHubIcon />
				{/if}

				<a href='https://codeberg.org/elisoli'>{author}</a>
			</div>

			<h1><a href='https://{platform}/{author}/{repo}/{path}'>{title}</a></h1>
		</div>

		<div class='max-w-[400px] text-base flex-1'>
			<p>{description}</p>
		</div>

		<div class='flex gap-2'>
			{#each langs as lang}
				<div class='flex items-center gap-1'>
					{#if lang === 'js'}
						<div class='w-3 h-3 bg-yellow-200 rounded-full'></div>
						<span>JavaScript</span>
					{:else if lang === 'c'}
						<div class='w-3 h-3 bg-gray-200 rounded-full'></div>
						<span>C</span>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/snippet}

<div class='flex items-center justify-center'>
	<p class='text-center'>
		<span class='text-lime-200'>I'm accepting pull requests to add more projects!</span><br>
		<a href='https://github.com/pandasoli/web-brainfuck'>pandasoli/web-brainfuck</a>
	</p>
</div>

<section class='flex flex-col items-center justify-center gap-16 px-4 pb-16 pt-8 md:pt-16'>
	<h1 class='font-alphacentauri text-xl' id='tutorial'>Interpreters</h1>

	<div class='flex gap-2'>
		{#each interpreters as info}
			{@render card(info)}
		{/each}
	</div>
</section>

<section class='flex flex-col items-center justify-center gap-16 px-4 pb-16 pt-8 md:pt-16'>
	<h1 class='font-alphacentauri text-xl' id='tutorial'>Compilers</h1>

	<div class='flex gap-2'>
		{#each compilers as info}
			{@render card(info)}
		{/each}
	</div>
</section>

<section class='flex flex-col items-center justify-center gap-16 px-4 pb-16 pt-8 md:pt-16'>
	<h1 class='font-alphacentauri text-xl' id='tutorial'>Transpilers</h1>

	<div class='flex gap-2'>
		{#each transpilers as info}
			{@render card(info)}
		{/each}
	</div>
</section>

<section class='flex flex-col items-center justify-center gap-16 px-4 pb-16 pt-8 md:pt-16'>
	<h1 class='font-alphacentauri text-xl' id='tutorial'>Encoders</h1>

	<div class='flex gap-2'>
		{#each encoders as info}
			{@render card(info)}
		{/each}
	</div>
</section>
