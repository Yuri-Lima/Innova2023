/**
 * @fileoverview This file contains all the routes of the application
 */

import express, { Router } from 'express';

// Healthcheck
import healthcheckRoutes from './healthcheck.routes';

// WooCommerce
import wcWebhooksRoutes from './wc/wc.hooks.routes';
import ordersMsgRoutes from './wc/wc.order.msg.routes';
import tasksRoutes from './wc/wc.cron.routes';
import uatizMsgRoutes from './wc/wc.uatiz.routes';
import cashbackMsgRoutes from './wc/wc.cashback.msg.routes';


// Auth
import oAuth2GoogleRoutes from './user/user.oAuth2.google.routes';
import authJwtRoutes from './auth/auth.routes';

// User
import userRoutes from './user/user.routes';

const router:Router = express.Router();

router.use("/woo", [wcWebhooksRoutes, ordersMsgRoutes, tasksRoutes, uatizMsgRoutes, cashbackMsgRoutes]);
router.use("/user", [userRoutes])
router.use("/auth", [authJwtRoutes, oAuth2GoogleRoutes])
router.use("/health-check", [healthcheckRoutes])

export default router;