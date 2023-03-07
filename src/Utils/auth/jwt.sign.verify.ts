require('dotenv').config();
/**
 * Auth Service
 */
import jwt, { JwtPayload, Jwt } from 'jsonwebtoken';
import { OAuth2Client, TokenPayload, TokenInfo  } from 'google-auth-library';
/**
 * Node Library
 */
import path from 'node:path';
import fs from 'node:fs';
/**
 * External folder with private and public keys
 */
// sign with RSA SHA256 
const privateKeyPath = path.join(__dirname, '../../secure/keypair.pem');
const privateKey = fs.readFileSync(privateKeyPath, 'ascii');
const publicKeyPath = path.join(__dirname, '../../secure/public.pem');
const publicKey = fs.readFileSync(publicKeyPath, 'ascii');

import log from '../logger';



/**
 * @description Signs a JWT token using rsa private key and returns the token
 * @param payload Object to be signed
 * @param keyname JWT_ACCESS_PRIVATEKEY or JWT_REFRESH_PRIVATEKEY
 */
function signJwt(payload: Object, keyname: "JWT_ACCESS_PRIVATEKEY" | "JWT_REFRESH_PRIVATEKEY", options?: jwt.SignOptions | undefined): string {
    let key: string;
    if (keyname === "JWT_ACCESS_PRIVATEKEY") {
        key = privateKey
        // key = process.env.JWT_ACCESS_PRIVATEKEY as string;
        // key  = Buffer.from(key, 'base64').toString('ascii');
        // log.info(`key: ${key}`);
    } else if (keyname === "JWT_REFRESH_PRIVATEKEY") {
        key = privateKey
        // key = process.env.JWT_REFRESH_PRIVATEKEY as string;
        // key  = Buffer.from(key, 'base64').toString('ascii');
    } else {
        log.error(`Invalid keyname ${keyname}`);
        throw new Error(`Invalid keyname ${keyname}`);
    }
    const token = jwt.sign(payload, key, {
        ...(options && options), // If options are passed, spread them here to override defaults below.
        algorithm: 'RS256' // Default algorithm is HS256
    });
    return token;    
}

/**
 * @description Verifies a JWT token using rsa public key and returns the decoded token
 * @param token string to be verified
 * @param keyName JWT_ACCESS_PUBLICKEY or JWT_REFRESH_PUBLICKEY
 * @returns Decoded token or null if token is invalid
 */
function verifyJwt<T extends JwtPayload | Jwt | null>(token: string, keyName: "JWT_ACCESS_PUBLICKEY" | "JWT_REFRESH_PUBLICKEY"): T | null {
    let key: string;
    if (keyName === "JWT_ACCESS_PUBLICKEY") {
        key = publicKey
        // key = process.env.JWT_ACCESS_PUBLICKEY as string;
        // key  = Buffer.from(key, 'base64').toString('ascii');
    } else if (keyName === "JWT_REFRESH_PUBLICKEY") {
        key = publicKey
        // key = process.env.JWT_REFRESH_PUBLICKEY as string;
        // key  = Buffer.from(key, 'base64').toString('ascii');
    } else {
        log.error(`Invalid keyname ${keyName}`);
        throw new Error(`Invalid keyname ${keyName}`);
    }
    try {
        const decoded = jwt.verify(token, key) as T;
        return decoded;
    } catch (error:any) {
        log.warn(error);
        return  null;
    }
    
}

const CLIENT_ID = <string>process.env.AUTH_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = <string>process.env.AUTH_GOOGLE_CLIENT_SECRET;
// const REDIRECT_URI = <string>process.env.AUTH_GOOGLE_REDIRECT_URI;
const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);
/**
 * @description Verifies a Google OAuth2 token using the own google validation library
 * @param token 
 * @returns payload or null if token is invalid as TokenPayload
 */
async function verifyGoogleOauth2<T extends TokenPayload | TokenInfo | null>(token: string): Promise<T | null> {
    try {
        // const ticket = await client.verifyIdToken(
        //     {
        //         idToken: token,
        //         audience: [CLIENT_ID],  // Specify the CLIENT_ID of the app that accesses the backend
        //     }
        // )
        // const payload = ticket.getPayload() as T;
        // return payload;
        const check = await client.getTokenInfo(token) as T;
        return check;
    } catch (error:any) {
        log.warn(error.message);
        return null;
    }
}

export { 
    signJwt,
    verifyJwt,
    verifyGoogleOauth2
};