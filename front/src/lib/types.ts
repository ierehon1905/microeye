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
