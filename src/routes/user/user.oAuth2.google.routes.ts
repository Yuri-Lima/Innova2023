import { Request, Response, Router, NextFunction } from 'express';
import passport from 'passport';
import requiredUser from '../../middlewares/required.user';
import log from '../../Utils/logger';


const router:Router = Router();

/**
 * First set up what we want to get from google
 */
router.get('/google/session',(_req: Request, _res: Response, next:NextFunction) => {log.warn(_res.locals, 'Google session'); return next()},
    passport.authenticate('google', {
        scope: ['email'], // What we want to get from google Example: ['email', 'profile', 'openid']
    }),
    (_req: Request, _res: Response) => {log.warn('Google session')}
);

/**
 * Then set up the callback url
 */
router.get('/google/callback', passport.authenticate('google',{
        successRedirect: '/api/auth/google/secret',
        failureRedirect: '/api/auth/google/failure',
        session: true // If we want to save the session
    }),
    (_req: Request, _res: Response) => {log.warn('Google callback')}
);

/**
 * If the authentication fails
 */
router.get('/google/failure', (_req: Request, res: Response): void | Response => {
    res.status(200).json({
        message: 'Failure to authenticate'
    });
});

/**
 * Logout route to clear the session from the cookie and removes user from req.user object
 * and redirect to the login page
 * It uses the passport middleware to clear the session
 * @param req Request
 * @param res Response
 * @returns Redirect to the login page
 */
router.get('/google/logout', (_req: Request, res: Response): void | Response => {
    _req.logOut({
        keepSessionInfo: false // If we want to keep the session info in the cookie or not
    }, done); // Clear the session from the cookie and removes user from req.user object
    log.warn('Google logout');
    return res.redirect('/wc/login'); // Redirect to the login page
});

/**
 * @description Test route to check if the user is authenticated or not
 * @param err Error
 */
router.get('/google/secret', requiredUser, (req: Request, res: Response): void | Response => {
    return res.status(200).json({
        message: 'You are authenticated',
        user: req.user
    });
});

router.get('/google/no-access', (req: Request, res: Response): void | Response => {
    return res.status(200).json({
        message: 'You are not authenticated',
        user: req.user
    });
});

function done(err: any): void {
    log.error(err);
    throw new Error('Logout failed');
}


export default router;
