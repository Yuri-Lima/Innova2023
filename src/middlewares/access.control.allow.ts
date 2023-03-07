import { Request, Response, NextFunction } from "express"
import log from "../Utils/logger"

function logs(req:Request, _res:Response, _next:NextFunction) {
    log.info(`Request from ${req.originalUrl}`)
    log.info(`Request method ${req.method}`)
    log.info(`Request subdomain ${req.subdomains}`)
    log.info(`Request url ${req.url}`)
    log.info(`Request IP ${req.ip}`)
    log.info(`Request protocol ${req.protocol}`)
    // return next();
}

/**
 * Rules of the application [Access-Control-Allow].
 */
export const accessControlAllow= (req:Request, res:Response, next:NextFunction) => {
    logs(req, res, next);
    if (req.method === "OPTIONS") {
        const headers = ["PUT, POST, PATCH, DELETE, GET"];
        return res.status(200).json({...headers}).on("finish", () => {
            logs(req, res, next);
        });
    }
    return next();
};