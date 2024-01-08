// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
    development: {
        client: "postgresql",
        connection: {
            database: "microeye",
            user: "postgres",
            password: "postgres",
        },
        migrations: {
            extension: "mjs",
            directory: "./migrations",
        },
    },

    production: {
        client: "postgresql",
        connection: {
            database: process.env.MICROEYE_DB_NAME || "microeye",
            user: "postgres",
            password: "postgres",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            extension: "mjs",
            directory: "./migrations",
        },
    },
};
