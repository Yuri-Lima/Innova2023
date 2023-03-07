import { Request, Response, NextFunction } from "express";

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    res.status(500).send("Something broke! or 404");
    req.app.locals.error = err;
    next();
}