import { IPaginateParams, IWithPagination } from "knex-paginate";
import { connection } from "../db";
import { MergedLines, NDashboard } from "../types";
import { MetricLine, MetricsResponse } from "../types";
import { fetchPreparedMetrics } from "./fetch-prepared-metrics";

// CREATE TABLE metrics (
//     created_at timestamp not null default now(),
//     "name" varchar(255) not null,
//     labels jsonb not null default '{}',
//     "value" float not null,
//     PRIMARY KEY (created_at, "name", labels)
// );
type Metrics = {
    created_at: Date;
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
    async pushMetrics(
        name: string,
        labels: Record<string, string | number>,
        value: number
    ): Promise<void> {
        await connection<Metrics>("metrics")
            .insert({
                name,
                labels,
                value,
            })
            .onConflict(["created_at", "name", "labels"])
            .merge();
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
        await connection<NDashboard.Dashboard>("dashboards").insert(dashboard);
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
};
