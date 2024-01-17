import Knex from "knex";
import { attachPaginate } from "knex-paginate";
import { MICROEYE_DB_NAME } from "./constants";

export const connection = Knex({
    client: "postgresql",
    connection: {
        database: MICROEYE_DB_NAME,
        user: "postgres",
        password: "postgres",
    },
});

attachPaginate();
