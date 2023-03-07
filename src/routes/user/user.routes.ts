import express, { Router } from 'express'
import { createUserHandler, verifyUserHandler, forgotPasswordHandler, resetPasswordHandler, getCurrentUserHandler, deleteUserHandler, getUserHandler } from '../../controllers/user/user.controller'
import { createUserSchema, deleteUserSchema, verifyUserSchema, forgotPasswordSchema, resetPasswordSchema } from '../../db/schema/user.schema'
import requiredUser from '../../middlewares/required.user'
import validateResource from '../../middlewares/validate.resource'


const router:Router = express.Router()

router.post('/register', validateResource(createUserSchema), createUserHandler); // Create user
router.delete('/delete', validateResource(deleteUserSchema), deleteUserHandler); // Delete user by email
router.get('/current-user/:id', requiredUser, getUserHandler); // Get current user
router.post('/verify/:id/:verificationCode', validateResource(verifyUserSchema), verifyUserHandler); // Verify user
router.get('/verify/:id/:verificationCode', validateResource(verifyUserSchema), verifyUserHandler); // Verify user
router.post('/forgot-password', validateResource(forgotPasswordSchema), forgotPasswordHandler); // Forgot password
router.post('/reset-password/:id/:passwordResetCode', validateResource(resetPasswordSchema), resetPasswordHandler); // Reset password
router.get('/current-user', requiredUser, getCurrentUserHandler); // Get current user

export default router