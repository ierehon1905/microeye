import { Request, Response } from "express";
import { Repository } from "../../repository";
import { MergedLines, MetricsRequest } from "../../types";
import { AGG_FUNCTIONS } from "../..";

export async function fetchMetrics(
    req: Request<{}, MergedLines, MetricsRequest>,
    res: Response
) {
    if (req.body.aggFunction && !AGG_FUNCTIONS.includes(req.body.aggFunction)) {
        req.body.aggFunction = undefined;
    }

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
