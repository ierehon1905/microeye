import Yagr from '@gravity-ui/yagr';
import type { MergedLines, MetricsRequest } from './types';
import { HOST } from './constants';

export async function fetchMetrics(request: MetricsRequest): Promise<MergedLines> {
	const res: MergedLines = await fetch(`${HOST}/metrics`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(request)
	}).then((res) => res.json());

	return res;
}

export async function fetchAndDraw(
	request: MetricsRequest,
	yagr: Yagr | undefined,
	chart: HTMLDivElement | undefined
): Promise<Yagr> {
	const res = await fetchMetrics(request);

	const series = res.lines.map((line) => {
		return {
			id: line.name + JSON.stringify(line.labels),
			data: line.values,
			name: line.name + JSON.stringify(line.labels)
		};
	});

	if (!yagr) {
		yagr = new Yagr(chart!, {
			timeline: res.timestampsSec,
			series,
			chart: {
				timeMultiplier: 0.001,
				series: {
					spanGaps: true,
					type: 'line'
				}
			}
		});
	} else {
		yagr.setConfig({
			timeline: res.timestampsSec,
			series
		});
	}

	return yagr;
}
