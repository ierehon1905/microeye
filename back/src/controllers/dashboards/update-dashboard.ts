import { Request, Response } from "express";
import { Repository } from "../../repository";
import { NDashboard } from "../../types";

export async function updateDashboard(
    req: Request<
        {
            id: string;
        },
        NDashboard.DashboardUpdate,
        any
    >,
    res: Response
) {
    console.log(req.body);

    const result = await Repository.updateDashboard(req.params.id, req.body);
    res.send(result);
}
