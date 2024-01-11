import { Handler, Request, Response } from "express";

const ERROR_MESSAGE = "Internal server error";

export function wrapError<
    F extends (req: Request, res: Response) => Promise<void>
>(f: F): Handler {
    return function (req, res) {
        f(req, res).catch(() => {
            res.set("Content-Type", "text/plain");
            res.status(500).send(ERROR_MESSAGE);
        });
    };
}
