
import { Strategy, StrategyOptions } from "passport-google-oauth20";
import log from "../logger";

// Types for Passport options
type AuthStrategyOptions = StrategyOptions & {
    callbackURL: string;
};

// Google Auth Strategy Options
const AUTH_STRATEGY_OPTIONS: AuthStrategyOptions = {
    clientID: <string>process.env.AUTH_GOOGLE_CLIENT_ID,
    clientSecret: <string>process.env.AUTH_GOOGLE_CLIENT_SECRET,
    callbackURL:  <string>process.env.AUTH_GOOGLE_REDIRECT_URIS,
};

function verifyCallback(accessToken: string, refreshToken: string, profile: any, done: any) {
    log.info(`verifyCallback: accessToken: ${accessToken}, refreshToken: ${refreshToken}, profile: ${JSON.stringify(profile)}`);
    return done(null, profile);
}

export default new Strategy(AUTH_STRATEGY_OPTIONS, verifyCallback);