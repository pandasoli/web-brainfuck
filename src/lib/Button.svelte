<script lang='ts'>
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import type { Snippet } from 'svelte'
	import { SmoothScrollTo } from '$utils/smoothScroll'

	interface Props {
		onclick?: () => void
		href?: string
		small?: boolean
		green?: boolean
		red?: boolean
		invert?: boolean
		children: Snippet<[]>
	}

	const { onclick: onclick_, small, green, red, invert, href, children }: Props = $props()

	const onclick = () => {
		if (href) {
			const text = href.startsWith('/') ? page.url.origin + href : href
			const url = new URL(text)

			if (page.url.pathname === url.pathname) {
				const to = (document.querySelector(url.hash) as HTMLDivElement).offsetTop - 20
				SmoothScrollTo(0, to)
			}
			else
				goto(url)
		}

		onclick_?.()
	}

	const cl = $derived(green ? 'lime-200' : red ? 'red-400' : 'white')
</script>

<div class='text-[var(--cl)] hidden'></div>
<div class='hover:text-[var(--cl)] hidden'></div>
<div class='hover:bg-transparent hidden'></div>
<div class='hover:bg-white hidden'></div>
<div class='border-lime-200 hidden'></div>
<div class='hover:text-lime-200 hidden'></div>
<div class='bg-lime-200 hidden'></div>
<div class='border-red-400 hidden'></div>
<div class='hover:text-red-400 hidden'></div>
<div class='bg-red-400 hidden'></div>
<div class='hover:bg-red-400 hidden'></div>

<button
	{onclick}
	class='text-xl text-{invert ? '[var(--cl)]' : 'white'} border border-{cl} hover:border-{cl} bg-{invert ? cl : 'transparent'} rounded-full py-{small ? 1 : 3} px-10 transition cursor-pointer hover:bg-{invert ? 'transparent' : cl} hover:text-{invert ? cl : '[var(--cl)]'} focus:shadow-[0_0_0_.25rem_rgba(255,255,255,0.6)]'
>
	{@render children()}
</button>
