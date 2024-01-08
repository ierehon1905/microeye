/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.raw(/*sql*/ `
        
        -- remove extract(epoch from created_at)::int8 duplicates
        DELETE FROM metrics
        WHERE ctid IN (
            SELECT ctid
            FROM (
                SELECT 
                    ctid, 
                    ROW_NUMBER() OVER (PARTITION BY extract(epoch from created_at)::int8, name, labels ORDER BY created_at) as rn
                FROM 
                    metrics
            ) sub
            WHERE rn > 1
        );

        alter table metrics
        alter column created_at drop default;

        alter table metrics
        alter column created_at type int8 using extract(epoch from created_at)::int8;

        alter table metrics
        alter column created_at set default extract(epoch from now())::int8;

        CREATE OR REPLACE FUNCTION time_round(t int8, n integer DEFAULT 1)
        RETURNS double precision AS $$
            SELECT round(t / n) * n
        $$ LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE;
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.raw(/*sql*/ `
        alter table metrics
        alter column created_at drop default;

        alter table metrics
        alter column created_at type timestamp using to_timestamp(created_at);

        alter table metrics
        alter column created_at set default now();

        DROP FUNCTION time_round(t int8, n integer);
    `);
};
