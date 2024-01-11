import { Request, Response } from "express";
import { AGG_FUNCTIONS } from "../../constants";
import { Repository } from "../../repository";
import { MergedLines, MetricsRequest } from "../../types";
import { createValidationGuard } from "../../utilities/validate";
import { wrapError } from "../../utilities/wrap-error";

const validateFetchMetrics = createValidationGuard({
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
    fromSec: {
        in: ["body"],
        isNumeric: true,
        notEmpty: true,
    },
    toSec: {
        in: ["body"],
        isNumeric: true,
        notEmpty: true,
    },
    aggWindowSec: {
        in: ["body"],
        isFloat: {
            options: {
                min: 1,
            },
        },
        optional: false,
    },
    aggFunction: {
        in: ["body"],
        isString: true,
        optional: true,
        isIn: {
            options: [AGG_FUNCTIONS],
            errorMessage: `aggFunction must be one of ${AGG_FUNCTIONS.join(
                ", "
            )}`,
        },
    },
});

export async function fetchMetrics(
    req: Request<{}, MergedLines, MetricsRequest>,
    res: Response
) {
    if (req.body.aggFunction && !AGG_FUNCTIONS.includes(req.body.aggFunction)) {
        req.body.aggFunction = undefined;
    }

    const result = await Repository.fetchPreparedMetrics({
        name: req.body.name,
        labels: req.body.labels,
        fromSec: req.body.fromSec,
        toSec: req.body.toSec,
        aggWindowSec: req.body.aggWindowSec,
        aggFunction: req.body.aggFunction,
    });
    return res.send(result);
}

export default [validateFetchMetrics, fetchMetrics];
