
// Helper function to get line and column from position
export const getLineAndCol = (text: string, pos: number): number[] => {
	const lines = text.split('\n')
	let cumulativeLength = 0

	for (let i = 0; i < lines.length; ++i) {
		const lineLength = lines[i].length + 1 // +1 for newline

		if (pos < cumulativeLength + lineLength)
			return [ i, pos - cumulativeLength ]

		cumulativeLength += lineLength
	}

	return [ lines.length - 1, lines[lines.length - 1].length ]
}

// Helper function to get position from line and column
export const getPosFromLineCol = (text: string, line: number, col: number): number => {
	const lines = text.split('\n')
	let pos = 0

	for (let i = 0; i < line; ++i)
		pos += lines[i].length + 1 // +1 for newline

	return pos + col
}
