/**
 * @typedef {Object} Result
 * @property {number[]} mem - The memory array
 * @property {number} ptr - Selected memory index
 * @property {number} ip - Intruction pointer
 * @property {string} res - The outputed result
 */

/**
 * @typedef {Object} Config
 * @property {number[]} [mem] - The memory array
 * @property {number} [ptr] - Selected memory index
 * @property {number} [ip] - Intruction pointer
 * @property {string} [res] - The outputed result
 * @property {function(): string} [prompt] - Input function
 * @property {boolean} [pause] - Pause when found valid character
 * @property {string} [stdin] - Standard input content
 */

/**
* @param {string} code - Brainfuck code
* @param {Config} [config] - Configuration to start interpretation from & dependencies
* @yields {Result}
* @returns {Generator<Result, Result, void>}
*/
export function * bfinterpreter(code = '', config = {}) {
  const mem = config?.mem ?? [0]
  let ptr = config?.ptr ?? 0
  let res = config?.res ?? ''
	let stdin = config?.stdin ?? ''

	/** @param {number} pos */
	const find_end = pos => {
		let opened = 1
		for (pos++; pos < code.length; pos++) {
			if      (code[pos] == '[') opened++
			else if (code[pos] == ']') opened--
			if (opened == 0) return pos
		}
		throw new Error('Error: could not find loop end')
	}

	/** @param {number} pos */
	const find_start = pos => {
		let closed = 1
		for (pos--; pos >= 0; pos--) {
			if      (code[pos] == '[') closed--
			else if (code[pos] == ']') closed++
			if (closed == 0) return pos
		}
		throw new Error('Error: could not find loop start')
	}

	let ip = config.ip ?? 0
  for (; ip < code.length; ip++) {
		const ch = code[ip]
		if (config.pause && '+-><.,![]'.includes(ch)) yield { mem, ptr, ip, res }

		if      (ch == '+') {if (++mem[ptr] > 127) mem[ptr] = 0}
		else if (ch == '-') {if (--mem[ptr] < 0) mem[ptr] = 127}
		else if (ch == '>') ++ptr >= mem.length && mem.push(0)
		else if (ch == '<') {if (--ptr == -1) throw new RangeError('Error: pointer cannot be less than 1')}
		else if (ch == '.') res += String.fromCharCode(mem[ptr])
		else if (ch == ',') {
			if (!stdin.length) {
				stdin = config.prompt?.() ?? '?'
				if (stdin === '') stdin = '\0'
			}

			mem[ptr] = stdin.charCodeAt(0)
			stdin = stdin.slice(1)
		}
		else if (ch == '[') mem[ptr] == 0 && (ip = find_end(ip))
		else if (ch == ']') mem[ptr] > 0  && (ip = find_start(ip))
		else if (ch == '!') break
	}

  return { mem, ptr, ip, res }
}
