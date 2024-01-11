import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { connection } from "./db";
import pushMetric from "./controllers/metrics/push-metric";
import fetchMetrics from "./controllers/metrics/fetch-metrics";
import fetchDashboards from "./controllers/dashboards/fetch-dashboards";
import fetchDashboard from "./controllers/dashboards/fetch-dashboard";
import updateDashboard from "./controllers/dashboards/update-dashboard";
import deleteDashboard from "./controllers/dashboards/delete-dashboard";
import fetchMetricsNames from "./controllers/metrics/fetch-metrics-names";
import { Repository } from "./repository";

async function main() {
    const app = express();

    const port = 3000;

    const api = express.Router();

    api.use(cors(), express.json());

    api.get("/metrics/names", ...fetchMetricsNames);
    api.post("/metrics", ...fetchMetrics);

    api.post("/push", ...pushMetric);
    api.get("/dashboards/:id", ...fetchDashboard);
    api.post("/dashboards/:id", ...updateDashboard);
    api.delete("/dashboards/:id", ...deleteDashboard);
    api.get("/dashboards", ...fetchDashboards);

    app.use(api);

    console.log("Starting server...");
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
        console.log(`Server is running on port ${port}`);
    });

    if (process.env.MICROEYE_FAKE_DATA === "true") {
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
