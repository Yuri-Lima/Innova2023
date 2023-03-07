import express, { Router } from 'express'
import { createSessionHandler, refreshAccessTokenHandler } from '../../controllers/auth/auth.controller'
import { createSessionSchema } from '../../db/schema/auth.schema'
import validateResource from '../../middlewares/validate.resource'

const router:Router = express.Router()

router.post("/login", validateResource(createSessionSchema), createSessionHandler)
router.post("/session", validateResource(createSessionSchema), createSessionHandler)
router.post('/session/refresh', refreshAccessTokenHandler)

export default router