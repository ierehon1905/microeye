import { Request, Response } from "express";
import { Repository } from "../../repository";
import { PushMetricRequest as PushMetricRequest } from "../../types";

export async function pushMetric(
    req: Request<{}, {}, PushMetricRequest>,
    res: Response
) {
    await Repository.pushMetrics(
        req.body.name,
        req.body.labels,
        req.body.value
    );
    res.send();
}
