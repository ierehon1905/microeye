import cors from "cors";
import express from "express";
import { connection } from "./db";
import { pushMetric } from "./controllers/metrics/push-metric";
import { fetchMetrics } from "./controllers/metrics/fetch-metrics";
import { fetchDashboards } from "./controllers/dashboards/fetch-dashboards";
import { fetchDashboard } from "./controllers/dashboards/fetch-dashboard";
import { updateDashboard } from "./controllers/dashboards/update-dashboard";
import { deleteDashboard } from "./controllers/dashboards/delete-dashboard";

const app = express();
app.use(cors(), express.json());
const port = 3000;

export const AGG_FUNCTIONS = ["avg", "min", "max", "count", "sum"];

app.post("/metrics", fetchMetrics);
app.post("/push", pushMetric);
app.get("/dashboards/:id", fetchDashboard);
app.post("/dashboards/:id", updateDashboard);
app.delete("/dashboards/:id", deleteDashboard);
app.get("/dashboards", fetchDashboards);

async function main() {
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
}

main();
