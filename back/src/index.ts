import cors from "cors";
import express from "express";

import { connection } from "./db";
import { Repository } from "./repository";

import deleteDashboard from "./controllers/dashboards/delete-dashboard";
import fetchDashboard from "./controllers/dashboards/fetch-dashboard";
import fetchDashboards from "./controllers/dashboards/fetch-dashboards";
import updateDashboard from "./controllers/dashboards/update-dashboard";
import fetchMetrics from "./controllers/metrics/fetch-metrics";
import fetchMetricsNames from "./controllers/metrics/fetch-metrics-names";
import pushMetric from "./controllers/metrics/push-metric";
import logger from "./logger";

async function main() {
    const app = express();

    const port = 3000;

    const api = express.Router();

    api.use(cors(), express.json());

    api.use((req, res, next) => {
        logger.info({
            method: req.method,
            url: req.url,
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    });

    api.get("/metrics/names", ...fetchMetricsNames);
    api.post("/metrics", ...fetchMetrics);

    api.post("/push", ...pushMetric);
    api.get("/dashboards/:id", ...fetchDashboard);
    api.post("/dashboards/:id", ...updateDashboard);
    api.delete("/dashboards/:id", ...deleteDashboard);
    api.get("/dashboards", ...fetchDashboards);

    app.use(api);

    logger.info("Starting server...");
    await connection.migrate.latest();

    const mustStartFront = process.env.MICROEYE_MUST_START_FRONT === "true";
    if (mustStartFront) {
        const frontHandlerPath =
            process.env.MICROEYE_FRONT_HANDLER_PATH ||
            "/Users/leon/dev/microeye/front/build/handler.js";

        const { handler } = await import(frontHandlerPath);

        app.use(handler);
    }

    app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
    });

    if (process.env.MICROEYE_FAKE_DATA === "true") {
        console.warn("Starting fake data generator");

        let start = Date.now();
        while (true) {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            await Repository.pushMetrics(
                "test",
                {},
                ((Date.now() - start) / 1000) % 60
            );
        }
    }
}

main();
