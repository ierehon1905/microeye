import { Request, Response } from "express";
import { Repository } from "../../repository";
import { PushMetricRequest } from "../../types";
import { createValidationGuard } from "../../utilities/validate";

const validateDeleteDashboard = createValidationGuard({
    name: {
        in: ["body"],
        isString: true,
        notEmpty: true,
    },
    labels: {
        in: ["body"],
        isObject: true,
        optional: true,
    },
    value: {
        in: ["body"],
        isNumeric: true,
        notEmpty: true,
    },
});

async function pushMetric(
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

export default [validateDeleteDashboard, pushMetric];
