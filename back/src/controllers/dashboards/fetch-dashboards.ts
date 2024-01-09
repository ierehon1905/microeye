import { Request, Response } from "express";
import { Repository } from "../../repository";

export async function fetchDashboards(
    req: Request<{}, any, any>,
    res: Response
) {
    const result = await Repository.fetchDashboards({
        currentPage: 1,
        perPage: 10,
    });
    res.send(result);
}
