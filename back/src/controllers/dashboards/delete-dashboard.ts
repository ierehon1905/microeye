import { Request, Response } from "express";
import { Repository } from "../../repository";
import { createValidationGuard } from "../../utilities/validate";

const validateDeleteDashboard = createValidationGuard({
    id: {
        in: ["params"],
        isString: true,
        notEmpty: true,
    },
});

async function deleteDashboard(
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

export default [validateDeleteDashboard, deleteDashboard];
