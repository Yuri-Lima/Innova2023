//https://sematext.com/blog/node-js-error-handling/
import { Request, Response, NextFunction } from "express"
import httpErrorHandler from "http-errors";

/**
 * Error Request Handler.
 */
const createHttpErrorHandler = (_req:Request, _res:Response, next:NextFunction) => {
    next(new httpErrorHandler.NotFound().message);  // create a new NotFound error
}
export default createHttpErrorHandler;