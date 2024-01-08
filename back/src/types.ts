export type MetricsRequest = {
    name: string;
    labels: Labels;
    fromSec: number;
    toSec: number;
    aggWindowSec?: number;
    aggFunction?: AggFunction;
};

export type MetricLine = {
    name: string;
    labels: Labels;
    values: number[];
    timestampsSec: number[];
};

export type MetricsResponse = {
    result: MetricLine[];
};

export type MergedLines = {
    timestampsSec: number[];
    lines: {
        name: string;
        labels: Labels;
        values: (number | null)[];
    }[];
};
export type AggFunction = "avg" | "sum" | "min" | "max" | "count";
export type Labels = Record<string, string | number>;
