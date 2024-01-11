import { Request, Response } from "express";
import { Repository } from "../../repository";

async function fetchMetricsNames(req: Request<{}, {}, {}>, res: Response) {
    const names = await Repository.fetchMetricsNames();
    res.send(names);
}

export default [fetchMetricsNames];
