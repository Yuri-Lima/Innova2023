import express, { Router } from 'express';
import { 
    httpCashBackMsgCreate,
    httpGetCashBackMsg,
    httpCashBackGetAllMsg,
    httpCashBackDeleteMsg,
    httpCashBackDeleteAllMsg
} from '../../controllers/wc/wc.cashback.msg.controller';

const router:Router = express.Router();

/**
 * Order Created Message Routes
 * Description: This is the code to save created order messages in the database.
 */
router.post('/cashback/add-msg', httpCashBackMsgCreate);
router.get('/cashback/get-msg/', httpGetCashBackMsg);
router.get('/cashback/get-all-msg', httpCashBackGetAllMsg);
router.delete('/cashback/delete-msg/', httpCashBackDeleteMsg);
router.delete('/cashback/delete-all-msg', httpCashBackDeleteAllMsg);

export default router;