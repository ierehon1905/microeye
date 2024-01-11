import { Request, Response } from "express";
import { Repository } from "../../repository";
import { NDashboard } from "../../types";
import { createValidationGuard } from "../../utilities/validate";

const validateUpdateDashboard = createValidationGuard({
    id: {
        in: ["params"],
        isString: true,
        notEmpty: true,
    },
});

async function updateDashboard(
    req: Request<
        {
            id: string;
        },
        NDashboard.DashboardUpdate,
        any
    >,
    res: Response
) {
    const result = await Repository.updateDashboard(req.params.id, req.body);
    res.send(result);
}

export default [validateUpdateDashboard, updateDashboard];
