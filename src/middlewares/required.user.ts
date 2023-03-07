import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import log from "../Utils/logger";

/**
 * 
 * @param _req Request
 * @param res Response
 * @param next NextFunction
 * @returns 
 */
function requiredUser(_req: Request, res: Response, next: NextFunction): void | Response | NextFunction {
    const responseID = randomUUID();
    /**
     *  @description Check if the user is logged in or not using passport
     *  @description If the user is logged in, the user object will be added to the req.user object by passport
     *  @function req.isAuthenticated() is provided by passport
     */
    const isLoggedIn = _req.isAuthenticated() && _req.user; // req.isAuthenticated() is provided by passport and req.user is provided by passport session
    if(isLoggedIn) return next();

    /**
     * @description Check if the user is logged in or not using the JWT tokens
     * @description If the user is logged in, the user object will be added to the res.locals object
     */
    const user  = res.locals.user;
    if(user) return next();

    log.warn(`Unauthorized access. Response ID: ${responseID}`);
    return res.status(403).json({
        message: 'Unauthorized Access',
        responseID
    });
    

}

export default requiredUser;