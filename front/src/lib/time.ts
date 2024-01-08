export function nowSec(offsetSec = 0) {
	return Math.floor(Date.now() / 1000) + offsetSec;
}
