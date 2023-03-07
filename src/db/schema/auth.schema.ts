import { object, string, TypeOf } from 'zod';


const createSessionSchema = object({
    body: object({
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
        })
    })
});

type CreateSessionSchemaInput = TypeOf<typeof createSessionSchema>['body']

export { createSessionSchema, CreateSessionSchemaInput };