import  { Request, Response } from 'express';
import { randomUUID } from 'crypto'
import { CreateSessionSchemaInput } from '../../db/schema/auth.schema';
import { get } from 'lodash';
import { findUserByEmail, findUserById } from '../../db/utils/user.utils';
import { findSessionById } from '../../Utils/auth/session';
import { verifyJwt } from '../../Utils/auth/jwt.sign.verify';
import { signRefreshToken, signAccessToken } from '../../Utils/auth/auth.jwt';
import log from '../../Utils/logger';

async function createSessionHandler(req: Request<{},{},CreateSessionSchemaInput>, res: Response) {
    const responseID = randomUUID();
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    /**
     * @description If user is not found, return 400 Bad Request
     */
    if (!user) {
        return res.status(400).json({
            message: 'Invalid credentials',
            responseID
        });
    }

    /**
     * @description If user is not verified, return 400 Bad Request
     */
    if(!user.isVerified) {
        return res.status(400).json({
            message: 'User is not verified, please verify your account first',
            responseID
        });
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: 'Invalid credentials'
        });
    }

    /**
     * @description Sign an accesss token
     */
    const accessToken = signAccessToken(user);
    /**
     * @description Sign a refresh token
     */
    const refreshToken = await signRefreshToken({userId: user._id.toString()});

    /**
     * @description Send the tokens back to the user
     */
    log.info(`User logged in successfully. Response ID: ${responseID}`);
    return res.status(200).json({
        message: 'User logged in successfully',
        accessToken,
        refreshToken
    });
}

async function refreshAccessTokenHandler(req: Request, res: Response) {
    const responseID = randomUUID();
    const refreshToken = <string>get(req, 'headers.x-refresh-token', '');

    const decoded = verifyJwt<{session:string}>(refreshToken, "JWT_REFRESH_PUBLICKEY")

    if(!decoded) {
        log.warn(`Invalid refresh token. Response ID: ${responseID}`);
        return res.status(401).json({
            message: 'Could not refresh access token',
            responseID
        });
    }

    const session = await findSessionById(decoded.session);

    if(!session || !session.valid) {
        log.warn(`Invalid refresh token. Response ID: ${responseID}`);
        return res.status(401).json({
            message: 'Could not refresh access token',
            responseID
        });
    }

    const user = await findUserById(String(session.user));

    if(!user) {
        log.warn(`Invalid refresh token. Response ID: ${responseID}`);
        return res.status(401).json({
            message: 'Could not refresh access token',
            responseID
        });
    }

    const accessToken = signAccessToken(user);

    log.info(`Access token refreshed successfully. Response ID: ${responseID}`);
    return res.status(200).json({
        message: 'Access token refreshed successfully',
        accessToken
    });
}

export {
    createSessionHandler,
    refreshAccessTokenHandler
}