import Knex from "knex";
import { attachPaginate } from "knex-paginate";

export const connection = Knex({
    client: "postgresql",
    connection: {
        database: process.env.MICROEYE_DB_NAME || "microeye",
        user: "postgres",
        password: "postgres",
    },
});

attachPaginate();
