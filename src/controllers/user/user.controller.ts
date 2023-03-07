import  { Request, Response } from 'express';
import { createUser, findUserById, findUserByEmail } from '../../db/utils/user.utils';
import { CreateUserInput, VerifyUserInput, ForgotPasswordInput, ResetPasswordInput, DeleteUserInput, GetUserInput } from '../../db/schema/user.schema';
// import { sendMail, SendGridOtions } from '../../services/sendgrid/sender';
import { randomUUID } from 'crypto'
import { signAccessToken, signRefreshToken } from '../../Utils/auth/auth.jwt';
import { isValidObjectIdMongose } from '../../Utils/mongose.objectID.validate';
import log from '../../Utils/logger';

/**
 * @description Create a new user
 * @param req Request<{},{}, CreateUserInput>
 * @param res  Response
 * @returns Promise<Response | undefined>
 */
async function createUserHandler(req: Request<{},{}, CreateUserInput>, res:Response): Promise<Response | undefined> {
    const responseID = randomUUID();
    const body = req.body;
    try {
        const user = await createUser(body);
        /**
         * @description Encrypt the user's data and send it to the user's email
         */
        const userAccessToken = signAccessToken(user);
        const userRefreshToken = signRefreshToken({userId: user._id.toString()});

        /**
         * @description Send encrypted user data to the user's email with the password reset code
         * @param body passwordResetCode
         * @header Authorization Bearer ${userAccessToken}
         */
        let emailStatus = {
            emailSent: true,
            emailError: null
        }
        const response = await fetch(`https://email.yurilima.uk/api/email/sendgrid/send/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccessToken}`,
                'x-refresh-token': `${userRefreshToken}`,
                'x-response-id': responseID
            },
            body: JSON.stringify({
                firstName: user.firstName,
                middleName: user.middleName,
                lastName: user.lastName,
                email: user.email,
                id: user._id,
                verificationCode: user.verificationCode
            })
        });
    
        if (response.status !== 201) {
            log.error(`Error sending email to ${user.email}, responseID: ${responseID}`);
            emailStatus = {
                emailSent: false,
                emailError: null
            }
        }
        const responseJson = await response.json();
        emailStatus = {
            emailSent: false,
            emailError: responseJson
        }
        log.info(`User created successfully. Response ID: ${responseID}`);
        return res.status(201).json({
            message: 'User created successfully',
            id: user._id,
            verificationCode: user.verificationCode,
            emailStatus,
            responseID
        });
    } catch (error: any) {
        if (error.code === 11000) {
            log.error(`User email already exists. Response ID: ${responseID}`);
            return res.status(409).json({ // 409 Conflict
                error: 'User email already exists',
                responseID
            });
        }
        log.error(`Something went wrong. Response ID: ${responseID}`);
        return res.status(500).json({
            error: 'Something went wrong',
            details: error,
            responseID
        });
    }

}

/**
 * @description Delete a user
 * @param req Request<{},{}, VerifyUserInput>
 * @param res Response
 * @returns Promise<Response | undefined>
 */
async function deleteUserHandler(req: Request<{},{}, DeleteUserInput>, res:Response): Promise<Response | undefined> {
    const responseID = randomUUID();
    const { email } = req.body;
    try {
        log.info(`Deleting user with email: ${email} Response ID: ${responseID}`);
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                responseID
            });
        }
        /**
         * @description Encrypt the user's data and send it to the user's email
         */
        const userAccessToken = signAccessToken(user);
        const userRefreshToken = signRefreshToken({userId: user._id.toString()});

        /**
         * @description Remove user from database
         */
        const userDeleted = await user.remove();

        /**
         * @description Send encrypted user data to the user's email with the password reset code
         * @param body passwordResetCode
         * @header Authorization Bearer ${userAccessToken}
         */
        let emailStatus = {
            emailSent: true,
            emailError: null
        }
        const response = await fetch(`https://email.yurilima.uk/api/email/sendgrid/send/user-deleted`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccessToken}`,
                'x-refresh-token': `${userRefreshToken}`,
                'x-response-id': `${responseID}`
            },
            body: JSON.stringify({...userDeleted})
        });
        const responseJson = await response.json();

        if (response.status !== 201) {
            log.error(`Error sending email to ${user.email}, responseID: ${responseID}`);
            emailStatus = {
                emailSent: false,
                emailError: responseJson
            }
        }

        log.info(`User deleted successfully. Response ID: ${responseID}`);
        return res.status(200).json({
            message: 'User deleted successfully',
            userDeleted,
            emailStatus,
            responseID
        });
    } catch (error: any) {
        log.error(`Something went wrong. Response ID: ${responseID}`);
        return res.status(500).json({
            error: 'Something went wrong',
            details: error,
            responseID
        });
    }
}

/**
 * @description Get current user by id
 * @param req REQUEST<{},{}, VerifyUserInput>
 * @param res Response
 * @returns Promise<Response | undefined>
 */
async function getUserHandler(req: Request<GetUserInput,{}, {}>, res:Response): Promise<Response | undefined> {
    const responseID = randomUUID();
    const { id } = req.params;
    try {
        const user = await findUserById(id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                responseID
            });
        }

        log.info(`User found successfully. Response ID: ${responseID}`);
        return res.status(200).json({
            message: 'User found successfully',
            user,
            responseID
        });
    } catch (error: any) {
        log.error(`Something went wrong. Response ID: ${responseID}`);
        return res.status(500).json({
            error: 'Something went wrong',
            details: error,
            responseID
        });
    }
}

/**
 * @description Verify user
 * @longDescription This route is used to verify a user
 * @param req Request<{},{}, ForgotPasswordInput>
 * @param res Response
 * @returns Promise<Response | undefined>
 */
async function verifyUserHandler(req: Request<VerifyUserInput,{}, {}>, res:Response): Promise<Response | undefined> {
    const responseID= randomUUID();
    if (!req.params.id || !req.params.verificationCode) {
        log.error(`Invalid request, no params provided. Response ID: ${responseID}`);
        return res.status(400).json({
            error: 'Invalid request, no params provided',
            responseID
        });
    }

    let regex = /^[a-z,0-9,-]{36,36}$/;
    const { id, verificationCode } = req.params

    /**
     * @description Validate the id with isValidObjectIdMongose function
     * @description The id has to be a valid MongoDB ObjectId
     */
    if(!isValidObjectIdMongose(id)){
        log.error(`Invalid request, invalid id provided. Response ID: ${responseID}`);
        return res.status(400).json({
            error: 'Invalid request, invalid id provided',
            id,
            responseID
        });
    }

    /**
     * @description Validate the password reset code with a regex expression
     * @description The password reset code has to be a string with 36 characters
     * @useed randomUUID from Crypto
     */
    if (!regex.test(verificationCode)) {
        log.error(`Invalid request, invalid verification code provided. Response ID: ${responseID}`);
        return res.status(400).json({
            error: 'Invalid request, invalid verification code provided',
            verificationCode,
            responseID
        });
    }
    
    // find user by id
    if (!id) {
        log.error(`Invalid request, no id provided. Response ID: ${responseID}`);
        return res.status(400).json({
            error: 'Invalid request, no id provided',
            responseID
        });
    }
    if(id === null) {
        log.error(`Invalid request, no id provided. Response ID: ${responseID}`);
        return res.status(400).json({
            error: 'Invalid request, no id provided',
            id,
            responseID
        });
    }
    if(verificationCode === null) {
        log.error(`Invalid request, no verification code provided. Response ID: ${responseID}`);
        return res.status(400).json({
            error: 'Invalid request, no verification code provided',
            verificationCode,
            responseID
        });
    }

    const user = await findUserById(id);
    if (!user) {
        return res.status(404).json({
            error: 'User not found',
            responseID
        });
    }

    // check if the user is verified
    if (user.isVerified) {
        return res.status(200).json({
            error: 'User is already verified',
            responseID
        });
    }

    // check if verification code matches
    if (user.verificationCode !== verificationCode) {
        return res.status(400).json({
            error: 'Invalid verification code',
            responseID
        });
    }

    // update user to verified
    user.isVerified = true;
    await user.save();

    /**
     * @description Encrypt the user's data and send it to the user's email
     */
    const userAccessToken = signAccessToken(user);
    const userRefreshToken = signRefreshToken({userId: user._id.toString()});

    /**
     * @description Send encrypted user data to the user's email with the password reset code
     * @param body passwordResetCode
     * @header Authorization Bearer ${userAccessToken}
     */
    let emailStatus = {
        emailSent: true,
        emailError: null
    }
    const response = await fetch(`https://email.yurilima.uk/api/email/sendgrid/send/verify-successfully`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userAccessToken}`,
            'x-refresh-token': `${userRefreshToken}`,
            'x-response-id': `${responseID}`
        },
        body: JSON.stringify({
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName,
            email: user.email,
            id: user.id,
            passwordResetCode: user.passwordResetCode
        })
    });
    const responseJson = await response.json();

    if (response.status !== 201) {
        log.error(`Error sending email to ${user.email}, responseID: ${responseID}`);
        emailStatus = {
            emailSent: false,
            emailError: responseJson
        }
    }
    res.status(200).json({
        message: 'User verified successfully',
        emailStatus,
        responseID
    });
}

/**
 * @description Forgot password handler with email verification
 * @longDescription This function will send an email that contains a temporary password to the user.
 * @method POST
 * @param req Request<{}, {}, ForgotPasswordInput> -> email
 * @param res Response
 * @returns Promise<Response | undefined>
 */
async function forgotPasswordHandler(req: Request<{}, {}, ForgotPasswordInput>, res:Response): Promise<Response | undefined> {
    const responseID= randomUUID();
    const spamMessage = 'If we found an eligible account associated with that username, we\'ve sent password reset instructions to the primary email address on the account.';
    if (!req.body) {
        log.error(`Invalid request, no body provided, responseID: ${responseID}`);
        return res.status(400).json({   
            error: 'Invalid request, no body provided',
            responseID
        });
    }
    const { email } = req.body;
    
    // find user by email
    const user = await findUserByEmail(email);
    if (!user) {
        log.error(`User with email ${email} not found, responseID: ${responseID}`);
        return res.status(201).json({
            error: spamMessage,
            responseID
        });
    }

    // check if the user is verified
    if (!user.isVerified) {
        log.error(`User with email ${email} is not verified, responseID: ${responseID}`);
        return res.status(201).json({
            error: 'User is not verified',
            responseID
        });
    }
    /**
     * @description Generate a random password reset code and save it to the user
     * @todo Send the password reset code to the user's email
     */
    const passwordResetCode = randomUUID();
    user.passwordResetCode = passwordResetCode;
    await user.save();

    /**
     * @description Encrypt the user's data and send it to the user's email
     */
    const userAccessToken = signAccessToken(user);
    // const userRefreshToken = signRefreshToken({userId: user._id.toString()});

    /**
     * @description Send encrypted user data to the user's email with the password reset code
     * @param body passwordResetCode
     * @header Authorization Bearer ${userAccessToken}
     */
    let emailStatus = {
        emailSent: true,
        emailError: null
    }
    const response = await fetch(`https://email.yurilima.uk/api/email/sendgrid/send/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userAccessToken}`
        },
        body: JSON.stringify({
            id: user.id,
            passwordResetCode: user.passwordResetCode
        })
    });
    const responseJson = await response.json();

    if (response.status !== 201) {
        log.error(`Error sending email to ${user.email}, responseID: ${responseID}`);
        emailStatus = {
            emailSent: false,
            emailError: responseJson
        }
    }
    log.info(`Password reset email sent to ${email}, responseID: ${responseID}`);
    res.status(201).json({
        message: 'Password reset email sent',
        passwordResetCode, // Todo: It has to be removed, because it is not safe to send the password reset code to the user
        id: user.id,
        emailStatus,
        responseID
    });
}

/**
 * @description Reset password handler
 * @longDescription This function will receive a password reset code and a new password and will update the user's password
 * @param req Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>
 * @param res Response
 * @returns Promise<Response | undefined>
 */
async function resetPasswordHandler(req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>, res:Response): Promise<Response | undefined> {
    const responseID= randomUUID();

    // Todo: It has to be removed, because the validation is done by the schema
    if(!req.params) {
        log.error(`Invalid request, no params provided, responseID: ${responseID}`);
        return res.status(400).json({
            error: 'Invalid request, no params provided',
            responseID
        });
    }
    // Todo: It has to be removed, because the validation is done by the schema
    if (!req.body) {
        log.error(`Invalid request, no body provided, responseID: ${responseID}`);
        return res.status(400).json({
            error: 'Invalid request, no body provided',
            responseID
        });
    }

    let regex = /^[a-z,0-9,-]{36,36}$/;
    const { id, passwordResetCode } = req.params;

    /**
     * @description Validate the id with isValidObjectIdMongose function
     * @description The id has to be a valid MongoDB ObjectId
     */
    if(!isValidObjectIdMongose(id)){
        log.error(`Invalid request, invalid id provided. Response ID: ${responseID}`);
        return res.status(400).json({
            error: 'Invalid request, invalid id provided',
            id,
            responseID
        });
    }
    /**
     * @description Validate the password reset code with a regex expression
     * @description The password reset code has to be a string with 36 characters
     * @useed randomUUID from Crypto
     */
    if (!regex.test(passwordResetCode)) {
        log.error(`Invalid request, invalid password reset code provided. Response ID: ${responseID}`);
        return res.status(400).json({
            error: 'Invalid request, invalid password reset code provided',
            passwordResetCode,
            responseID
        });
    }

    const { password } = req.body;

    const user = await findUserById(id);

    if (!user) {
        log.warn(`User with id ${id} not found, responseID: ${responseID}`);
        return res.status(404).json({
            error: 'User not found',
            responseID
        });
    }
    if(user.passwordResetCode !== passwordResetCode) {
        log.warn(`Invalid password reset code, responseID: ${responseID}`);
        return res.status(400).json({
            error: 'Invalid password reset code',
            responseID
        });
    }

    user.password = password; // it will be hashed by the pre save hook in the user model
    user.passwordResetCode = null; // remove password reset code
    await user.save();

    /**
     * @description Encrypt the user's data and send it to the user's email
     */
    const userAccessToken = signAccessToken(user);
    // const userRefreshToken = signRefreshToken({userId: user._id.toString()});

    /**
     * @description Send encrypted user data to the user's email with the password reset code
     * @param body passwordResetCode
     * @header Authorization Bearer ${userAccessToken}
     */
    let emailStatus = {
        emailSent: true,
        emailError: null
    }
    const response = await fetch(`https://email.yurilima.uk/api/email/sendgrid/send/reset-password-success`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userAccessToken}`
        },
    });
    const responseJson = await response.json();

    if (response.status !== 201) {
        log.error(`Error sending email to ${user.email}, responseID: ${responseID}`);
        emailStatus = {
            emailSent: false,
            emailError: responseJson
        }       
    }
    // const msg: SendGridOtions =
    //     [{
    //             from: 'y.m.lima.ie@gmail.com',
    //             templateId: "d-bbf40d73dde7453e943f364a7710a79d",
    //             personalizations: 
    //             [
    //                 {
    //                 to: [
    //                     {
    //                     email: user.email,
    //                     },
    //                 ],
    //                 cc: undefined,
    //                 bcc: undefined
    //                 }
    //             ],
    //             dynamicTemplateData: {
    //                 firstName: user.firstName,
    //                 lastName: user.lastName,
    //                 email: user.email,
    //                 id: user._id
    //             },
    //             customArgs: {
    //                 responseID,
    //             },
    //             subject: "Hello, your password has been reset ✔",
    //     }];
    
    //     const resEmail = await sendMail(msg, {}, false);
    //     if (resEmail !== true) {
    //         return res.status(400).json({
    //             message: resEmail.message,
    //             code: resEmail.code,
    //             body: resEmail.response.body.errors.map((e:Error) => e.message),
    //             responseID
    //           });
    //     }

    log.info(`Password reset successfully, responseID: ${responseID}`);
    return res.status(201).json({
        message: 'Password reset successfully',
        emailStatus,
        responseID
    });
}

/**
 * @description Get current user handler
 * @param _req Request
 * @param res Response
 * @returns Promise<Response | undefined>
 */
async function getCurrentUserHandler(_req: Request, res:Response): Promise<Response | undefined> {
    const responseID= randomUUID();
    log.info(`Get Current User, ResponseID: ${responseID}`);
    return res.status(200).json({
        message: 'Current user',
        user: res.locals.user,
        responseID
    });
}

export {
    createUserHandler,
    deleteUserHandler,
    getUserHandler,
    verifyUserHandler,
    forgotPasswordHandler,
    resetPasswordHandler,
    getCurrentUserHandler
};