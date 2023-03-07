import { DocumentType } from "@typegoose/typegoose";
import { signJwt } from "./jwt.sign.verify";
import { createSession } from "./session";
import { privateFields, User } from "../../db/models/user.model";

import { omit } from "lodash";

/**
 * @description Given a user, this function will create a JWT token and return it.
 * @param user - user to be encoded
 * @returns - encoded user
 */
function signAccessToken(user: DocumentType<User>) {
    const payload = omit(user.toJSON(), privateFields);
    const accessToken = signJwt(payload, "JWT_ACCESS_PRIVATEKEY", { expiresIn: "15m" });
    return accessToken;
}

/**
 * @description Sign a refresh token
 * @param {userId}:{userId:string}
 * @returns Refresh token
 */
async function signRefreshToken({userId}:{userId:string}):Promise<string> {
    const session = await createSession({userId})

    const refreshToken = signJwt({session:session._id}, "JWT_REFRESH_PRIVATEKEY", { expiresIn: "30d" });
    return refreshToken;
}

export {
    signAccessToken,
    signRefreshToken
}