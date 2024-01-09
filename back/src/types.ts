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

export namespace NDashboard {
    export type Dashboard = {
        id: string;
        title: string;
        items: DashboardItem[];
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

export type PushMetricRequest = {
    name: string;
    labels: Record<string, string>;
    value: number;
};

// export type PaginatedResponse<T> = {
//     total: number;
//     items: T[];
//     page: number;
//     size: number;
// };
