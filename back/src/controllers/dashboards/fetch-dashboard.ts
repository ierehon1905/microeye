import { Request, Response } from "express";
import { Repository } from "../../repository";
import { createValidationGuard } from "../../utilities/validate";

const validateFetchDashboard = createValidationGuard({
    id: {
        in: ["params"],
        isString: true,
        notEmpty: true,
    },
});

async function fetchDashboard(
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

export default [validateFetchDashboard, fetchDashboard];
