/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
    await knex.raw(/*sql*/ `
        CREATE OR REPLACE FUNCTION time_round(t timestamp, n integer DEFAULT 1)
        RETURNS double precision AS $$
            SELECT round(extract(epoch from t) / n) * n
        $$ LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE;
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
    await knex.raw(/*sql*/ `DROP FUNCTION time_round(t timestamp, n integer)`);
};
