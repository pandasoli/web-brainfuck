<script lang='ts'>
	import { page } from '$app/state'
	import { pageTitle } from '$stores/title'
	import { Header, Footer } from '$lib'
	import '../app.css'

	let { children } = $props()

	const few = $derived(page.url.pathname === '/')
</script>

<svelte:head>
	{#if $pageTitle}
		<title>Brainfuck | {$pageTitle}</title>
	{:else}
		<title>Brainfuck</title>
	{/if}
</svelte:head>

{#if !few}
	<Header />
{/if}

<div class='min-h-[100vh]'>
	{@render children()}
</div>

<Footer />
