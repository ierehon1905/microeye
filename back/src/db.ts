import Knex from "knex";

export const connection = Knex({
    client: "postgresql",
    connection: {
        database: process.env.MICROEYE_DB_NAME || "microeye",
        user: "postgres",
        password: "postgres",
    },
});
