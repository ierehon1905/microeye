import { connection } from "../db";
import type { MergedLines } from "../types";
import { Labels } from "../types";
import { AggFunction } from "../types";

export async function fetchPreparedMetrics({
    name,
    labels,
    fromSec,
    toSec,
    aggWindowSec,
    aggFunction,
}: {
    name: string;
    labels: Labels;
    fromSec: number;
    toSec: number;
    aggWindowSec?: number;
    aggFunction?: AggFunction;
}): Promise<MergedLines> {
    const result = await connection.raw(
        /* sql */ `
        with lines as (
            with
            all_all as (
                select
                    *
                from metrics
                where "name" = :name
                    and jsonb_contains_all_keys_and_values((:labels)::jsonb, labels)
                    and created_at >= :fromSec
                    and created_at <= :toSec
                order by created_at
            ),
            all_ts as (
                select time_round(:fromSec ::int4, :aggWindowSec) as timestamp_sec
                union all
                (
                    select
                        time_round(created_at, :aggWindowSec) as timestamp_sec
                    from all_all
                    group by timestamp_sec
                    order by timestamp_sec
                )
                union all
                select time_round(:toSec ::int4, :aggWindowSec)
            ),
            all_mx as (
                select
                    "name", labels
                from all_all
                group by name, labels
            ),
            agg_mx as (
                select
                    time_round(created_at, :aggWindowSec) as timestamp_sec,
                    "name",
                    labels,
                    :aggFunction:("value") as "value"
                from all_all
                group by timestamp_sec, "name", labels
            )
            select mx.name, mx.labels, array_agg(m.value) as values from all_ts
            cross join all_mx mx
            left join agg_mx m on
                m.timestamp_sec = all_ts.timestamp_sec and
                m.name = mx.name and
                m.labels = mx.labels
            group by mx.name, mx.labels
            union all 
            select null, null, array_agg(timestamp_sec) from all_ts 
        )
        select
            jsonb_build_object(
                'lines', coalesce(jsonb_agg(row_to_json(lines.*)::jsonb) filter (where lines.name is not null), '[]'::jsonb),
                'timestampsSec',
                    coalesce(
                        nullif(
                            (
                                (
                                    jsonb_agg(lines.values) filter (where lines.name is null and lines.values is not null)
                                )
                                -> 0
                            ),
                            null::jsonb
                        ),
                        '[]'::jsonb
                    )
            ) as result
        from lines;
        `,
        {
            name,
            labels: JSON.stringify(labels),
            fromSec,
            toSec,
            aggWindowSec: aggWindowSec ?? 1,
            aggFunction: aggFunction ?? "avg",
        }
    );

    return result.rows[0].result;
}
