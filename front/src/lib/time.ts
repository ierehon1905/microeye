export function nowSec(offsetSec = 0): number {
	return Math.floor(Date.now() / 1000) + offsetSec;
}

export function getAbsoluteTime(
	fromSec: number,
	toSec: number,
	isRelative: boolean | undefined | null
): {
	fromSec: number;
	toSec: number;
} {
	if (isRelative) {
		return {
			fromSec: nowSec(-fromSec),
			toSec: nowSec(-toSec)
		};
	} else {
		return {
			fromSec,
			toSec
		};
	}
}
