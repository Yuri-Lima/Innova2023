import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";
import { verifyGoogleOauth2, verifyJwt } from "../Utils/auth/jwt.sign.verify";
import log from "../Utils/logger";


async function deserializeUser(req: Request, res: Response, next: NextFunction) {
    const responseID = randomUUID();
    const accessToken = req.headers?.authorization?.split(' ')[1];

    if (!accessToken || accessToken === 'undefined') {
        log.warn(`Access with no Token Response ID: ${responseID}`);
        return next();
    }
    /**
     * @description Verify the JWT token and return the decoded token
     */
    const decoded = verifyJwt(<string>accessToken, "JWT_ACCESS_PUBLICKEY");
    if (decoded) {
        log.info(`Access using Token Response ID: ${responseID}`);
        console.log('Access using Token Response ID:', decoded);
        res.locals.user = decoded;
        return next();
    }
    
    /**
     * @description Usgin Google OAuth2 authentication
     */
    const decodedGoogle = verifyGoogleOauth2(<string>accessToken);
    if (decodedGoogle) {
        log.info(decodedGoogle, `Access using Google OAuth2 Response ID: ${responseID}`);
        res.locals.user = decodedGoogle;
        return next();
    }

    log.warn(accessToken, `Unauthorized access. Response ID: ${responseID}`);
        return res.status(401).json({
            message: 'Unauthorized access',
            responseID
        });
}

export default deserializeUser;