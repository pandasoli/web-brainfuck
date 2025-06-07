
export const brainfuckHighlight = (code: string, ip: number): any[] => {
	let char_i = 0

	return code.split('\n').map(line => {
		line = line.split('').map(ch => {
			const colors: Record<string, string> = {
				'[': 'blue-400', ']': 'blue-400',
				'<': 'blue-400', '>': 'blue-400',
				'.': 'lime-300', ',': 'lime-300',
				'+': 'rose-400', '-': 'sky-300',
				'!': 'purple-300'
			}

			const color = colors?.[ch] ?? 'slate-500'
			const scale = ip === char_i ? 'inline-block scale-200 -translate-y-1' : ''
			char_i += 1

			return `<span class='text-${color} ${scale} hover:text-black'>${ch}</span>`
		}).join('')

		char_i += 1 // newline
		return line
	})
}
