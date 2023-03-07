import express, { Router } from 'express';
import { tasks } from '../../controllers/wc/wc.cron.controllers';

const router:Router = express.Router();


router.get('/send/task', tasks); // Use query instead of params (this is the original code)
router.get('/send/task/:taskid/:source', tasks); // Use params instead of query (this is an alternative code)

export default router;