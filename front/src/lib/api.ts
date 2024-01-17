import Yagr, { type YagrConfig } from '@gravity-ui/yagr';
import { Result, Unit } from 'true-myth';

import { getSimpleColor } from './color';
import { HOST } from './constants';
import type { IWithPagination, MergedLines, MetricsRequest, NDashboard } from './types';

class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public data?: unknown
	) {
		super(message);
	}
}

async function customFetch<T>(url: string, options: RequestInit): Promise<Result<T, ApiError>> {
	try {
		const res = await fetch(url, options);
		const data = await res.json();
		if (res.status >= 400) {
			return Result.err(new ApiError(data.message, res.status, data));
		}

		return Result.ok(data);
	} catch (e) {
		// @ts-ignore
		return Result.err(new ApiError(e?.message, 500));
	}
}

export async function fetchMetrics(
	request: MetricsRequest
): Promise<Result<MergedLines, ApiError>> {
	return customFetch<MergedLines>(`${HOST}/metrics`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(request)
	});
}

export async function fetchAndDraw(
	request: MetricsRequest,
	yagr: Yagr | undefined,
	chart: HTMLDivElement | undefined
): Promise<Result<Yagr, ApiError>> {
	const res = await fetchMetrics(request);

	if (res.isErr) {
		return Result.err(res.error);
	}

	const value = res.value;

	const series: YagrConfig['series'] = value.lines.map((line, lineIndex) => {
		return {
			id: line.name + JSON.stringify(line.labels),
			data: line.values,
			name: line.name + JSON.stringify(line.labels),
			color: getSimpleColor(lineIndex, value.lines.length)
		};
	});

	if (!yagr) {
		yagr = new Yagr(chart!, {
			timeline: value.timestampsSec,
			series,
			chart: {
				timeMultiplier: 0.001,
				series: {
					spanGaps: true,
					type: 'line'
				},
				appearance: {
					theme: 'dark'
				}
			}
		});
	} else {
		yagr.setConfig({
			timeline: value.timestampsSec,
			series
		});
	}

	return Result.ok(yagr);
}

export async function fetchDashboard(
	dashId: string
): Promise<Result<NDashboard.Dashboard, ApiError>> {
	return customFetch<NDashboard.Dashboard>(`${HOST}/dashboards/${dashId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

export async function fetchDashboards(): Promise<
	Result<IWithPagination<NDashboard.Dashboard>, ApiError>
> {
	return customFetch<IWithPagination<NDashboard.Dashboard>>(`${HOST}/dashboards`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

export async function updateDashboard(
	dashId: string,
	dashboard: NDashboard.DashboardUpdate
): Promise<Result<Unit, ApiError>> {
	return await customFetch<Unit>(`${HOST}/dashboards/${dashId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(dashboard)
	});
}

export async function createDashboard(
	dashboard: NDashboard.DashboardCreate
): Promise<Result<Unit, ApiError>> {
	return await customFetch<Unit>(`${HOST}/dashboards`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(dashboard)
	});
}

export async function deleteDashboard(dashId: string): Promise<Result<Unit, ApiError>> {
	return await customFetch<Unit>(`${HOST}/dashboards/${dashId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

export async function fetchMetricsNames(): Promise<Result<string[], ApiError>> {
	return await customFetch<string[]>(`${HOST}/metrics/names`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
