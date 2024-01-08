import type { MergedLines, MetricsRequest } from './types';

export async function fetchMetrics({
	name,
	labels,
	fromSec,
	toSec
}: {
	name: string;
	labels: Record<string, string | number>;
	fromSec: number;
	toSec: number;
}): Promise<MergedLines> {
	const res: MergedLines = await fetch('http://localhost:3000/metrics', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: name,
			labels: labels,
			toSec: toSec,
			fromSec: fromSec
		} satisfies MetricsRequest)
	}).then((res) => res.json());

	return res;
}
