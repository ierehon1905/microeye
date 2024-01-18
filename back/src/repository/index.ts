import { IPaginateParams, IWithPagination } from "knex-paginate";
import { connection } from "../db";
import { MetricLine, NDashboard } from "../types";
import { fetchPreparedMetrics } from "./fetch-prepared-metrics";

type Metrics = {
    created_at: number;
    name: string;
    labels: Record<string, string | number>;
    value: number;
};

export const Repository = {
    async fetchMetrics(
        name: string,
        labels: Record<string, string | number>,
        fromSec: number,
        toSec: number
    ): Promise<MetricLine[]> {
        const result = await connection.raw(
            /* sql */ `
            SELECT
                "name",
                labels,
                array_agg("value") as "values",
                array_agg(time_round(created_at)) as "timestampsSec"
            FROM metrics
            WHERE "name" = ?
                AND jsonb_contains_all_keys_and_values(?::jsonb, labels)
                AND created_at >= to_timestamp(?)
                AND created_at <= to_timestamp(?)
            GROUP BY "name", labels
            -- order by "name", labels
            -- LIMIT 100
        `,
            [name, JSON.stringify(labels), fromSec, toSec]
        );

        // for (const row of result.rows) {
        //     row.timestampsSec.unshift(fromSec);
        //     row.timestampsSec.push(toSec);
        //     row.values.unshift(null);
        //     row.values.push(null);
        // }

        return result.rows;
    },
    fetchPreparedMetrics,
    async pushMetric(
        name: string,
        labels: Record<string, string | number>,
        value: number,
        created_at?: number
    ): Promise<void> {
        await connection<Metrics>("metrics")
            .insert({
                name,
                labels,
                value,
                created_at,
            })
            .onConflict(["created_at", "name", "labels"])
            .merge();
    },
    async pushManyMetrics(
        metrics: {
            name: string;
            labels: Record<string, string | number>;
            values: number[];
            timestampsSec: number[];
        }[]
    ): Promise<void> {
        await connection.transaction(async (trx) => {
            const promises = metrics.map(async (metric) => {
                await trx.raw(
                    /* sql */ `
                    INSERT INTO metrics (name, labels, value, created_at)
                    SELECT
                        ? as name,
                        ?::jsonb as labels,
                        unnest(?::float[]) as value,
                        unnest(?::int8[]) as created_at
                    ON CONFLICT (created_at, name, labels)
                        DO UPDATE SET value = EXCLUDED.value
                    `,
                    [
                        metric.name,
                        JSON.stringify(metric.labels),
                        metric.values,
                        metric.timestampsSec,
                    ]
                );
            });

            await Promise.all(promises);
        });
    },
    async fetchDashboards(
        pagination: IPaginateParams
    ): Promise<IWithPagination<NDashboard.Dashboard>> {
        return await connection<NDashboard.Dashboard>("dashboards").paginate(
            pagination
        );
    },
    async fetchDashboard(id: string): Promise<NDashboard.Dashboard> {
        return await connection<NDashboard.Dashboard>("dashboards")
            .where("id", id)
            .first();
    },
    async createDashboard(dashboard: NDashboard.DashboardCreate) {
        await connection<NDashboard.Dashboard>("dashboards").insert({
            id: dashboard.id,
            title: dashboard.title,
            // @ts-ignore
            items: JSON.stringify(dashboard.items),
            version: 1,
        });
    },
    async updateDashboard(id: string, dashboard: NDashboard.DashboardUpdate) {
        await connection<NDashboard.Dashboard>("dashboards")
            .where("id", id)
            .update({
                // @ts-ignore
                items: JSON.stringify(dashboard.items),
                title: dashboard.title,
                version: dashboard.version + 1,
                updated_at: connection.fn.now(),
            });
    },
    async deleteDashboard(id: string) {
        await connection<NDashboard.Dashboard>("dashboards")
            .where("id", id)
            .delete();
    },
    async fetchMetricsNames(): Promise<string[]> {
        const result = await connection.raw(/* sql */ `
            SELECT DISTINCT "name"
            FROM metrics
        `);

        return result.rows.map((row) => row.name);
    },
};
