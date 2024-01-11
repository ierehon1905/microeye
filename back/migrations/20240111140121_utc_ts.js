/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.raw(/*sql*/ `
        alter table metrics
        alter column created_at drop default;

        alter table metrics
        alter column created_at set default extract(epoch from (now() at time zone 'utc'))::int8;
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
        alter column created_at set default extract(epoch from now())::int8;
    `);
};
