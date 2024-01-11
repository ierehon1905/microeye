import type { Request, Response, NextFunction, Handler } from "express";
import { type Schema, checkSchema, validationResult } from "express-validator";
import type { DefaultSchemaKeys } from "express-validator/src/middlewares/schema";

export function validationGuard(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = validationResult(req);

    if (result.isEmpty()) {
        return next();
    }

    res.status(400).json({ errors: result.array() }).end();
}

export function createValidationGuard<T extends string = DefaultSchemaKeys>(
    schema: Schema<T>
): Handler[] {
    return [...checkSchema(schema), validationGuard];
}
