/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
    await knex.schema.raw(/* sql */ `
    CREATE TABLE metrics (
        created_at timestamp not null default now(),
        "name" varchar(255) not null,
        labels jsonb not null default '{}',
        "value" float not null,
        PRIMARY KEY (created_at, "name", labels)
    );

    CREATE INDEX metrics_created_at_idx ON metrics(created_at);
    CREATE INDEX metrics_name_idx ON metrics("name");
    CREATE INDEX metrics_labels_idx ON metrics(labels);
    CREATE INDEX metrics_value_idx ON metrics("value");
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
    await knex.schema.raw(/* sql */ `
        drop table metrics;
    `);
};
