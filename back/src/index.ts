import cors from "cors";
import express, { Request } from "express";
import { connection } from "./db";
import { Repository } from "./repository";
import { MergedLines, MetricsRequest } from "./types";

const app = express();
app.use(cors(), express.json());
const port = 3000;

app.post(
    "/metrics",
    async (req: Request<{}, MergedLines, MetricsRequest>, res) => {
        console.log(req.body);

        const result = await Repository.fetchPreparedMetrics({
            name: req.body.name,
            labels: req.body.labels,
            fromSec: req.body.fromSec,
            toSec: req.body.toSec,
            aggWindowSec: req.body.aggWindowSec,
            aggFunction: req.body.aggFunction,
        });
        res.send(result);
    }
);

type PushMetricsRequest = {
    name: string;
    labels: Record<string, string>;
    value: number;
};

app.post("/push", async (req: Request<{}, {}, PushMetricsRequest>, res) => {
    await Repository.pushMetrics(
        req.body.name,
        req.body.labels,
        req.body.value
    );
    res.send();
});

async function main() {
    console.log("Starting server...");
    await connection.migrate.latest();

    const frontHandlerPath =
        process.env.MICROEYE_FRONT_HANDLER_PATH ||
        "/Users/leon/dev/microeye/front/build/handler.js";

    const { handler } = await import(frontHandlerPath);

    console.log(handler);

    app.use(handler);

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

main();
