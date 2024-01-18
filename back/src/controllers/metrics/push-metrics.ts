import { Request, Response } from "express";
import { Repository } from "../../repository";
import { PushMetricRequest, PushMetricsRequest } from "../../types";
import { createValidationGuard } from "../../utilities/validate";

const validatePushMetrics = createValidationGuard({
    metrics: {
        in: ["body"],
        isArray: true,
    },
    "metrics.*.name": {
        isString: true,
        notEmpty: true,
    },
    "metrics.*.labels": {
        isObject: true,
        optional: true,
    },
    "metrics.*.values": {
        isArray: true,
    },
    "metrics.*.values.*": {
        isNumeric: true,
    },
    "metrics.*.timestampsSec": {
        isArray: true,
    },
    "metrics.*.timestampsSec.*": {
        isNumeric: true,
    },
});

async function pushMetrics(
    req: Request<{}, {}, PushMetricsRequest>,
    res: Response
) {
    await Repository.pushManyMetrics(req.body.metrics);
    res.send();
}

export default [validatePushMetrics, pushMetrics];

// curl -X POST -H "Content-Type: application/json" -d '{"metrics":[{"name":"test","labels":{"label":"value"},"values":[1,2,3],"timestampsSec":[1705592323,1705592353,1705592423]}]}' http://localhost:3000/api/metrics/push-many
