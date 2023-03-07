import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { randomUUID } from "crypto";
import log from "../Utils/logger";

export const validateResource = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    const responseID = randomUUID();
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error:any) {
        log.error(`Invalid request [validateResource]. Response ID: ${responseID}`);
        res.status(400).json({ error: error.errors });
    }
};

export default validateResource;
// Path: Authentication/src/middleware/validate.resource.ts