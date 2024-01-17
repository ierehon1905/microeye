import { Request, Response } from "express";
import { Repository } from "../../repository";
import { NDashboard } from "../../types";
import { createValidationGuard } from "../../utilities/validate";

const validateCreateDashboard = createValidationGuard({
    id: {
        isString: true,
        notEmpty: true,
    },
    title: {
        isString: true,
        notEmpty: true,
    },

    "items.*.x": {
        isInt: true,
    },
    "items.*.y": {
        isInt: true,
    },
    "items.*.w": {
        isInt: true,
    },
    "items.*.h": {
        isInt: true,
    },
    "items.*.id": {
        isString: true,
        notEmpty: true,
    },

    "items.*.chart.name": {
        isString: true,
        notEmpty: true,
    },

    "items.*.chart.labels.*": {
        custom: {
            options: (value: any) => {
                if (typeof value !== "string" && typeof value !== "number") {
                    throw new Error("Invalid value");
                }
            },
        },
    },

    "items.*.chart.aggWindowSec": {
        isInt: true,
    },

    "items.*.chart.aggFunction": {
        isIn: {
            options: [["avg", "sum", "min", "max", "count"]],
        },
    },
});

async function createDashboard(
    req: Request<{}, {}, NDashboard.DashboardCreate>,
    res: Response
) {
    await Repository.createDashboard(req.body);
    res.sendStatus(200);
}

export default [validateCreateDashboard, createDashboard];
