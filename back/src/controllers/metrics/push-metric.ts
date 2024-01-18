import { Request, Response } from "express";
import { Repository } from "../../repository";
import { PushMetricRequest } from "../../types";
import { createValidationGuard } from "../../utilities/validate";

const validatePushMetric = createValidationGuard({
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
    timestampSec: {
        in: ["body"],
        isNumeric: true,
        optional: true,
    },
});

async function pushMetric(
    req: Request<{}, {}, PushMetricRequest>,
    res: Response
) {
    await Repository.pushMetric(
        req.body.name,
        req.body.labels,
        req.body.value,
        req.body.timestampSec
    );
    res.send();
}

export default [validatePushMetric, pushMetric];
