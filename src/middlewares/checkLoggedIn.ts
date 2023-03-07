import { Request, Response, NextFunction } from 'express';


/**
 * Check if the user is logged in or not
 * @param _req Request
 * @param res Response
 * @param next NextFunction
 * @returns void | Response | NextFunction
 */
const checkLoggedIn = (_req: Request, res: Response, next: NextFunction): void | Response | NextFunction => {
    const isLoggedIn =  _req.isAuthenticated() && _req.user; // req.isAuthenticated() is provided by passport and req.user is provided by passport session
    /**
     * If the user is not logged in, return a 401 status code and a message
     */
    if (!isLoggedIn) {
        return res.status(401).json({ message: 'Not authenticated.' });
    }
    /**
     * If the user is logged in, call next() to continue with the execution
     */
    next();
}

export default checkLoggedIn;