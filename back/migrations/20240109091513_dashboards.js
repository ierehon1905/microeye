/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.raw(/* sql */ `
        create table dashboards (
            id text primary key,
            title text not null,
            items jsonb not null,
            created_at timestamp not null default now(),
            updated_at timestamp not null default now(),
            version integer not null default 0
        );

        create index dashboards_title_idx on dashboards (title);
        create index dashboards_created_at_idx on dashboards (created_at);
        create index dashboards_updated_at_idx on dashboards (updated_at);
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.raw(/* sql */ `
        drop table dashboards;
    `);
};
