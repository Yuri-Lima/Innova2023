import { object, string, TypeOf } from 'zod';

/**
 * @description This is the schema for the create user route
 * @returns Zod schema
 */
const createUserSchema = object({
    body: object({
        firstName: string({
            required_error: 'First name is required',
        }).min(3, {
            message: 'First name must be at least 3 characters'
        }).max(20, {
            message: 'First name must be at most 20 characters'
        }),

        lastName: string({
            required_error: 'Last name is required'
        }).min(3, {
            message: 'Last name must be at least 3 characters'
        }).max(20, {
            message: 'Last name must be at most 20 characters'
        }),

        middleName: string({
            required_error: 'Middle name is not required',
        }).min(3, {
            message: 'Middle name must be at least 3 characters'
        }).max(20, {
            message: 'Middle name must be at most 20 characters'
        }),

        email: string({
            required_error: 'Email is required'
        }).email({
            message: 'Email must be a valid email address'
        }),

        password: string({
            required_error: 'Password is required'
        }).min(8, {
            message: 'Password must be at least 8 characters'
        }).max(20, {
            message: 'Password must be at most 20 characters'
        }),

        passwordConfirmation: string({
            required_error: 'Password confirmation is required'
        })

    }).refine(data => data.password === data.passwordConfirmation, {
        message: 'Password and password confirmation must match',
        path: ['passwordConfirmation'] // This is the path to the field that is invalid
    })
});

/**
 * @description This is the schema for the delete user route
 * @returns Zod schema
 */
const deleteUserSchema = object({
    body: object({
        email: string({
            required_error: 'Email is required'
        }).email({
            message: 'Email must be a valid email address'
        })
    })
});

/**
 * @description This is the schema to get a user by id
 * @returns Zod schema
 */
const getUserSchema = object({
    params: object({
        id: string({
            required_error: 'Id is required'
        })
    })
});

/**
 * @description This is the schema for the verify user route
 * @returns Zod schema
 * @example /api/v1/users/verify/:id/:verificationCode
 */
const verifyUserSchema = object({
    params: object({
        verificationCode: string({
            required_error: 'Verification code is required'
        }),
        id: string({
            required_error: 'Id is required'
        })
    }),
});

/**
 * @description This is the schema for the forgot password route
 * @returns Zod schema
 * @example /api/v1/users/forgot-password
 */
const forgotPasswordSchema = object({
    body: object({
        email: string({
            required_error: 'Email is required'
        }).email({
            message: 'Email must be a valid email address'
        })
    })
});

const resetPasswordSchema = object({
    params: object({
        id: string({
            required_error: 'Id is required as a parameter'
        }),
        passwordResetCode: string({
            required_error: 'Password reset code is required as a parameter'
        })
    }),
    body: object({
        password: string({
            required_error: 'Password is required'
        }).min(8, {
            message: 'Password must be at least 8 characters'
        }).max(20, {
            message: 'Password must be at most 20 characters'
        }),
        passwordConfirmation: string({
            required_error: 'Password confirmation is required'
        })
    }).refine(data => data.password === data.passwordConfirmation, {
        message: 'Password and password confirmation must match',
        path: ['passwordConfirmation'] // This is the path to the field that is invalid
    })
});
type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
type DeleteUserInput = TypeOf<typeof deleteUserSchema>['body'];
type GetUserInput = TypeOf<typeof getUserSchema>['params'];
type VerifyUserInput = TypeOf<typeof verifyUserSchema>['params'];
type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];
type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;

export {
    createUserSchema,
    CreateUserInput,
    deleteUserSchema,
    DeleteUserInput,
    getUserSchema,
    GetUserInput,
    verifyUserSchema,
    VerifyUserInput,
    forgotPasswordSchema,
    ForgotPasswordInput,
    resetPasswordSchema,
    ResetPasswordInput
}
