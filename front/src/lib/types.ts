/* eslint-disable @typescript-eslint/no-namespace */
export type AggFunction = 'avg' | 'sum' | 'min' | 'max' | 'count';
export type Labels = Record<string, string | number>;

export type MetricsRequest = {
	name: string;
	labels: Labels;
	fromSec: number;
	toSec: number;
	aggWindowSec?: number;
	aggFunction?: AggFunction;
};

export type MergedLines = {
	timestampsSec: number[];
	lines: {
		name: string;
		labels: Record<string, string | number>;
		values: (number | null)[];
	}[];
};

export namespace NDashboard {
	export type Dashboard = {
		id: string;
		title: string;
		items: DashboardItem[];
		version: number;
		created_at: string;
		updated_at: string;
	};

	export type DashboardCreate = {
		id: string;
		title: string;
		items: DashboardItem[];
	};

	export type DashboardUpdate = {
		title: string;
		items: DashboardItem[];
		version: number;
	};

	export type DashboardItem = {
		x: number;
		y: number;
		w: number;
		h: number;
		id: string;
		chart: Chart;
	};

	export type Chart = {
		name: string;
		labels: Labels;
		aggWindowSec: number;
		aggFunction: AggFunction;
	};
}

export interface IPaginateParams {
	perPage: number;
	currentPage: number;
	isFromStart?: boolean;
	isLengthAware?: boolean;
}

export interface IWithPagination<T> {
	data: T[];
	pagination: IPagination;
}

interface IPagination {
	total?: number;
	lastPage?: number;
	currentPage: number;
	perPage: number;
	from: number;
	to: number;
}
