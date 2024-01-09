import { Request, Response } from "express";
import { Repository } from "../../repository";

export async function fetchDashboard(
    req: Request<
        {
            id: string;
        },
        any,
        any
    >,
    res: Response
) {
    const result = await Repository.fetchDashboard(req.params.id);
    res.send(result);
}
