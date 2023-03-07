import { Request, Response, Router } from 'express';
import passport from 'passport';

const router:Router = Router();

/**
 * First set up what we want to get from google
 */
router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['email'], // What we want to get from google Example: ['email', 'profile', 'openid']
    }),
    (_req: Request, _res: Response) => {console.log('Google auth')}
);

/**
 * Then set up the callback url
 */
router.get('/auth/google/callback', 
    passport.authenticate('google',{
        successRedirect: '/secret',
        failureRedirect: '/auth/google/failure',
        session: true // If we want to save the session
    }), 
    (_req: Request, _res: Response) => {console.log('Google callback')}
);

/**
 * If the authentication fails
 */
router.get('/auth/google/failure', (_req: Request, res: Response): void | Response => {
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
router.get('/auth/logout', (_req: Request, res: Response): void | Response => {
    _req.logOut({
        keepSessionInfo: false // If we want to keep the session info in the cookie or not
    }, done); // Clear the session from the cookie and removes user from req.user object
    return res.redirect('/wc/login'); // Redirect to the login page
});

function done(err: any): void {
    console.error(err);
    throw new Error('Logout failed');
}


export default router;
