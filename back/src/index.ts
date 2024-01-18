import cors from "cors";
import express, { Request } from "express";
import basicAuth from "express-basic-auth";

import { connection } from "./db";
import { Repository } from "./repository";

import dashboardApi from "./controllers/dashboards";
import fetchMetrics from "./controllers/metrics/fetch-metrics";
import fetchMetricsNames from "./controllers/metrics/fetch-metrics-names";
import pushMetric from "./controllers/metrics/push-metric";
import logger from "./logger";
import {
    MICROEYE_ADMIN_PASSWORD,
    MICROEYE_DISABLE_AUTH,
    MICROEYE_FAKE_DATA,
    MICROEYE_FRONT_HANDLER_PATH,
    MICROEYE_MUST_START_FRONT,
    NODE_ENV,
} from "./constants";
import metricsApi from "./controllers/metrics";

process.title = "microeye";

async function main() {
    const app = express();

    const port = 3000;

    const api = express.Router();

    if (NODE_ENV === "development") {
        logger.info("Enabling CORS");
        app.use(cors());
    } else if (!MICROEYE_DISABLE_AUTH) {
        logger.info("Enabling basic auth");
        app.use(
            basicAuth({
                users: {
                    admin: MICROEYE_ADMIN_PASSWORD,
                },
                challenge: true,
                realm: "microeye",
                unauthorizedResponse: {
                    message: "Unauthorized",
                },
            })
        );
    }

    api.use(
        express.json({
            limit: "50mb",
        })
    );

    api.use((req, _res, next) => {
        logger.info({
            method: req.method,
            url: req.url,
            // body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    });

    api.use("/dashboards", dashboardApi);
    api.use("/metrics", metricsApi);

    app.use("/api", api);

    logger.info("Starting server...");
    await connection.migrate.latest();

    if (MICROEYE_MUST_START_FRONT) {
        const frontHandlerPath = MICROEYE_FRONT_HANDLER_PATH;
        const { handler } = await import(frontHandlerPath);

        app.use(handler);
    }

    app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
    });

    if (MICROEYE_FAKE_DATA) {
        logger.info("Starting fake data generator");

        let start = Date.now();
        while (true) {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            await Repository.pushMetric(
                "test",
                {},
                ((Date.now() - start) / 1000) % 60
            );
        }
    }
}

main();
