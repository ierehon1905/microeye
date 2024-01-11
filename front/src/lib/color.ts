export function getSimpleColor(lineIndex: number, totalLines: number) {
	return `hsl(${(lineIndex * 360) / totalLines}, 70%, 50%)`;
}
