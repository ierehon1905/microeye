import { Request, Response } from "express";
import { Repository } from "../../repository";

export async function deleteDashboard(
    req: Request<
        {
            id: string;
        },
        any,
        any
    >,
    res: Response
) {
    const result = await Repository.deleteDashboard(req.params.id);
    res.send(result);
}
