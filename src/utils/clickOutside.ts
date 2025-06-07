import type { Action } from 'svelte/action';

export const clickOutside: Action<HTMLElement, () => void> = (node, handler) => {
	const handleClick = (event: MouseEvent) => {
		if (node && !node.contains(event.target as Node) && !event.defaultPrevented)
			handler()
	}

	document.addEventListener('click', handleClick, true)

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true)
		}
	}
}
